from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.http import Http404
from rest_framework.decorators import action
from django.conf import settings

import os
import json

from core.ai_interview.models import InterviewChatLog
from core.ai_interview.serializers.chatlog import InterviewChatLogSerializer
from core.ai_interview.ai_interviewer.gemini_client import Interviewer
from core.employer.models import Employer


class AIInterviewViewSet(viewsets.ViewSet):

    def get_employer(self, user):
        """Retrieve employer details"""
        try:
            return Employer.objects.get(user=user)
        except Employer.DoesNotExist:
            raise Http404("Employer profile not found")

    def get_chat_history(self, user, stage):
        """Retrieve chat history for a given user and stage"""
        previous_chat = InterviewChatLog.objects.filter(user=user, stage=stage)
        history_chat = []
        for chat in InterviewChatLogSerializer(previous_chat, many=True).data:
            if chat["user_chat"]:
                history_chat.append({"role": "user", "parts": [chat["user_chat"]]})
            if chat["ai_chat"]:
                history_chat.append({"role": "model", "parts": [chat["ai_chat"]]})
        
        return history_chat

    def get_prompt_for_stage(self, stage, employer):
        """Retrieve the corresponding prompt from JSON based on stage"""
        with open(os.path.join(settings.BASE_DIR, "core/ai_interview/ai_interviewer/interview_tree.json")) as file:
            prompt_tree = json.load(file)

        node = next((item for item in prompt_tree if item["nodeId"] == stage), None)
        if not node:
            return None

        return node["prompt"].format(
            first_name=employer.first_name,
            last_name=employer.last_name,
            field_of_interview=employer.field_of_interview,
            introduction_summary=getattr(employer, "introduction_summary", ""),
            logical_thinking_score=getattr(employer, "logical_thinking", 0),
            programming_skills_score=getattr(employer, "programming_skill", 0),
            problem_solving_skills_score=getattr(employer, "problem_solving", 0),
            case_study_score=getattr(employer, "case_study", 0),
        )
    
    def get_node(self, stage):
        with open(os.path.join(settings.BASE_DIR, "core/ai_interview/ai_interviewer/interview_tree.json")) as file:
            prompt_tree = json.load(file)

        return next((item for item in prompt_tree if item["nodeId"] == stage), None)

    @action(detail=False, methods=["post"])
    def chat(self, request):
        user = request.user
        user_message = request.data.get("message", "").strip()

        if not user_message:
            return Response({"error": "Message field is required"}, status=status.HTTP_400_BAD_REQUEST)

        employer = self.get_employer(user)
        stage = employer.stage
        history_chat = self.get_chat_history(user, stage)
        prompt = self.get_prompt_for_stage(stage, employer)
        node = self.get_node(stage=stage)

        print("Stage: ", stage)
        print("Prompt: ", prompt)

        if not prompt:
            return Response({"error": "Invalid interview stage"}, status=status.HTTP_400_BAD_REQUEST)
        
        print(history_chat)

        ai_interviewer = Interviewer(system_instruction=prompt, user_message=user_message, history_chat=history_chat)
        ai_response = ai_interviewer.get_response()

        InterviewChatLog.objects.create(user=user, ai_chat=ai_response, user_chat=user_message, stage=stage)

        ai_response_list = ai_response.split("---")
        print("AI response List: ", ai_response_list)
        ai_message = ai_response_list[0].strip()
        if stage == 0:
            print("I'm in stage 0")
            is_user = ai_response_list[1].strip()
            print(is_user)
            if is_user == 'True':
                employer.is_true_attender = True
                employer.stage = node["edges"][0]["targetNodeId"]
                employer.interview_status = "IN_PROGRESS"
            else:
                employer.stage = node["edges"][1]["targetNodeId"]
        elif stage == 1:
            print("I'm in stage 1")
            if len(ai_response_list) <= 2:
                ai_message = ai_response_list[0].strip()
                employer.stage = node["edges"][1]["targetNodeId"]
            else:
                employer.stage = node["edges"][0]["targetNodeId"]
                employer.introduction_summary = ai_response_list[1].strip()
                employer.logical_thinking = int(ai_response_list[2].strip())
                employer.communication_skill = int(ai_response_list[3].strip())
        elif stage == 2:
            print("I'm in stage 2")
            if len(ai_response_list) <= 2:
                ai_message = ai_response_list[0].strip()
                employer.stage = node["edges"][1]["targetNodeId"]
            else:
                employer.stage = node["edges"][0]["targetNodeId"]
                employer.programming_skill = int(ai_response_list[1].strip())
                employer.problem_solving = int(ai_response_list[2].strip())
        elif stage == 3:
            print("I'm in stage 3")
            if len(ai_response_list) <= 2:
                ai_message = ai_response_list[0].strip()
                employer.stage = node["edges"][1]["targetNodeId"]
            else:
                employer.stage = node["edges"][0]["targetNodeId"]
                employer.case_study = int(ai_response_list[1].strip())
                employer.logical_thinking = int(ai_response_list[2].strip())
        elif stage == 4:
            print("I'm in stage 4")
            if bool(ai_response_list[2].strip()):
                employer.stage = node["edges"][0]["targetNodeId"]
                employer.overall_score = int(ai_response_list[1].strip())
                employer.interview_status = "COMPLETED"
            else:
                employer.stage = node["edges"][1]["targetNodeId"]
        elif stage == 5:
            print("I'm in stage 5")
            is_user = ai_response_list[1].strip()
            if is_user == 'True':
                employer.is_true_attender = True
                employer.stage = node["edges"][0]["targetNodeId"]
                employer.interview_status = "IN_PROGRESS"
            else:
                employer.stage = node["edges"][1]["targetNodeId"]

        employer.save()

        print(ai_response)
        return Response({"ai_interviewer": ai_message}, status=status.HTTP_200_OK)
