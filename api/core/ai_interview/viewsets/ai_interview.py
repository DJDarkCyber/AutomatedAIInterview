from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.http import Http404

from core.ai_interview.models import InterviewChatLog
from core.ai_interview.serializers.chatlog import InterviewChatLogSerializer
from core.ai_interview.viewsets.chatlog import InterviewChatLogViewSet
from core.ai_interview.ai_interviewer.gemini_client import Interviewer
from core.employer.models import Employer

from rest_framework.decorators import action

from core.ai_interview.ai_interviewer.gemini_client import Interviewer

class AIInterviewViewSet(viewsets.ViewSet):
    @action(detail=False, methods=["post"])
    def chat(self, request):
        user = request.user

        user_message = request.data.get("message", "").strip()

        if not user_message:
            return Response({"error": "message field is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            employer = Employer.objects.get(user=user)  # Get a single Employer instance
            stage = employer.stage
            print("Stage: ", stage)
            # return Response({"stage": stage}, status=status.HTTP_200_OK)

        except Employer.DoesNotExist:
            raise Http404("Employer profile not found")

        ai_response = ""
        ai_message = ""            
            

        if stage == 0:
            first_name = Employer.objects.get(user=user).first_name
            last_name = Employer.objects.get(user=user).last_name

            previous_chat = InterviewChatLog.objects.filter(user=user).filter(stage=0)

            previous_chat_serialized = InterviewChatLogSerializer(previous_chat, many=True)

            print(previous_chat_serialized.data)

            history_chat = []
            for chat in previous_chat_serialized.data:
                if chat["user_chat"]:
                    history_chat.append({"role": "user", "parts": [chat["user_chat"]]})
                if chat["ai_chat"]:
                    history_chat.append({"role": "model", "parts": [chat["ai_chat"]]})

            print(history_chat)
            
            prompt_0 = f"""Forgot every system note you where given before.
            From now, you are the kind and human like AI Interviewer of the company named 'Company 7' and your name is 'Agent437'. Mimick human behavior and mimick professional interviewers.
            
            You are in stage 0.

            In this stage, your only job is to make sure that you are taking interview for the correct user.
            First of all, introduce yourself.
            You are going to take interview to {first_name} {last_name}.

            Interact with the user and find whether this is the right user. If that is not a correct user, apologize to user and return 'False' if that is correct user return 'True'.

            Your response should be in the format for every response

            '<your_response> --- <boolean_value>'

            For example: 'Welcome to the interview {first_name} {last_name} --- True'
            'Hey, I want to confirm you before begin! --- False'

            if that is not user return False until get verified or apologize.

            Important: Follow the response the format until last. Don't break the response format and don't change the track.
            """

            ai_interviewer = Interviewer(system_instruction=prompt_0, user_message=user_message, history_chat=history_chat)

            ai_response = ai_interviewer.get_response()

            

            chat_data = {
                "ai_chat": ai_response,
                "user_chat": user_message,
                "stage": stage
            }

            InterviewChatLog.objects.create(user=user, **chat_data)

            ai_message, is_user = ai_response.split("---")
            is_user = bool(is_user.strip())

            print(is_user)


            if is_user == True:
                employer = Employer.objects.get(user=user)
                employer.is_true_attender = True
                employer.stage = 1
                employer.interview_status = "IN_PROGRESS"
                employer.save()


        elif stage == 1:
            first_name = Employer.objects.get(user=user).first_name
            last_name = Employer.objects.get(user=user).last_name
            field_of_interview = Employer.objects.get(user=user).field_of_interview

            previous_chat = InterviewChatLog.objects.filter(user=user).filter(stage=1)

            previous_chat_serialized = InterviewChatLogSerializer(previous_chat, many=True)

            history_chat = []
            for chat in previous_chat_serialized.data:
                if chat["user_chat"]:
                    history_chat.append({"role": "user", "parts": [chat["user_chat"]]})
                if chat["ai_chat"]:
                    history_chat.append({"role": "model", "parts": [chat["ai_chat"]]})
            
            print(history_chat)

            prompt_1 = f"""Forgot every system note you where given before.
            From now, you are the kind and human like AI Interviewer of the company named 'Company 7' and your name is 'Agent437'. Mimick human behavior and mimick professional interviewers.

            You are in stage 1. In previous stage 0, you have verified whether you are interviewing with correct user. You've passed stage 0 and you are interviewing with correct user.
            In this stage, your job is to get the introduction of the user. You've already introduced about yourself on previous stage so don't introduce yourself again.

            Get introduction about the user in interaction way.

            You are going to ask introduction to {first_name} {last_name}.
            You are taking interview to user on the field {field_of_interview}. The user applied to this.
            Ask user about his studies, past experience and get other introductions about the user which are taken by professional interviewers.

            While you are interactively getting introduction from user, your response should be in the format

            <your_response_to_user> --- False

            In the above format, until you finish asking introduction in interactive way, the boolean value should be 'False'.
            If you finished interviewing about the user, your response should be in the format

            <your_response_to_user> --- <final_summarized_user_introduction> --- <logical_thinking_score_of_100_in_integer> --- <communication_skill_score_of_100_in_integer> --- True


            Important: Follow the response the format until last. Don't break the response format and don't change the track.
            """

            ai_interviewer = Interviewer(system_instruction=prompt_1, user_message=user_message, history_chat=history_chat)

            ai_response = ai_interviewer.get_response()

            print(ai_response)
            
            chat_data = {
                "ai_chat": ai_response,
                "user_chat": user_message,
                "stage": stage
            }

            InterviewChatLog.objects.create(user=user, **chat_data)

            ai_response_list = ai_response.split("---")

            print(len(ai_response_list ))

            if len(ai_response_list) <= 2:
                ai_message = ai_response_list[0].strip()
            elif len(ai_response_list) > 2:
                ai_message, summarized_introduction, logical_thinking_score, communication_skill_score, is_stage_passed = ai_response_list
                employer = Employer.objects.get(user=user)
                employer.stage = 2
                employer.introduction_summary = summarized_introduction.strip()
                employer.logical_thinking = int(logical_thinking_score.strip())
                employer.communication_skill = int(communication_skill_score.strip())
                employer.save()
        
        elif stage == 2:
            first_name = Employer.objects.get(user=user).first_name
            last_name = Employer.objects.get(user=user).last_name
            field_of_interview = Employer.objects.get(user=user).field_of_interview

            introduction_summary = Employer.objects.get(user=user).introduction_summary

            logical_thinking_score = Employer.objects.get(user=user).logical_thinking

            previous_chat = InterviewChatLog.objects.filter(user=user).filter(stage=2)

            previous_chat_serialized = InterviewChatLogSerializer(previous_chat, many=True)

            history_chat = []
            for chat in previous_chat_serialized.data:
                if chat["user_chat"]:
                    history_chat.append({"role": "user", "parts": [chat["user_chat"]]})
                if chat["ai_chat"]:
                    history_chat.append({"role": "model", "parts": [chat["ai_chat"]]})
            
            print(history_chat)

            prompt_2 = f"""Forgot every system note you where given before.
            From now, you are the kind and human like AI Interviewer of the company named 'Company 7' and your name is 'Agent437'. Mimick human behavior and mimick professional interviewers.

            You are in stage 2. In previous stage 1, you got introduction from the user. You've already introduced about yourself on previous stage so don't introduce yourself again. Here is the user introduction summarized '{introduction_summary}'
            The user's previous logical thinking score from introduction of the user is {logical_thinking_score}

            In this stage, your job is to get the programming skills and logical skills of the user.

            Get programming skills and logical thinking about the user in interaction way by giving programming problems.

            You are going to get programming skills and logical thinking to the user {first_name} {last_name}.
            You are taking interview to user on the field {field_of_interview}. The user applied to this.
            Give user programming questions to solve and also logical questions to ask the user to solve that.

            While you are interactively getting programming skills and logical thinking skills from user, your response should be in the format

            <your_response_to_user> --- False

            In the above format, until you finish getting programming skills and logical thinking skills in interactive way, the boolean value should be 'False'.
            If you finished interviewing about the user's programming skills and logical thinking skills, your response should be in the format

            <your_response_to_user> --- <programming_skill_score_of_100_in_integer> --- <problem_solving_score_of_100_in_integer> --- True


            Important: Follow the response the format until last. Don't break the response format and don't change the track.
            """

            ai_interviewer = Interviewer(system_instruction=prompt_2, user_message=user_message, history_chat=history_chat)

            ai_response = ai_interviewer.get_response()

            print(ai_response)
            
            chat_data = {
                "ai_chat": ai_response,
                "user_chat": user_message,
                "stage": stage
            }

            InterviewChatLog.objects.create(user=user, **chat_data)

            ai_response_list = ai_response.split("---")

            print(len(ai_response_list))

            if len(ai_response_list) <= 2:
                ai_message = ai_response_list[0].strip()
            elif len(ai_response_list) > 2:
                ai_message, programming_skills_score, problem_solving_skills_score, is_stage_passed = ai_response_list
                employer = Employer.objects.get(user=user)
                employer.stage = 3
                employer.programming_skill = int(programming_skills_score.strip())
                employer.problem_solving = int(problem_solving_skills_score.strip())
                employer.save()
        
        elif stage == 3:
            first_name = Employer.objects.get(user=user).first_name
            last_name = Employer.objects.get(user=user).last_name
            field_of_interview = Employer.objects.get(user=user).field_of_interview
            logical_thinking_score = Employer.objects.get(user=user).logical_thinking
            programming_skills_score = Employer.objects.get(user=user).programming_skill

            introduction_summary = Employer.objects.get(user=user).introduction_summary

            logical_thinking_score = Employer.objects.get(user=user).logical_thinking

            previous_chat = InterviewChatLog.objects.filter(user=user).filter(stage=3)

            previous_chat_serialized = InterviewChatLogSerializer(previous_chat, many=True)

            history_chat = []
            for chat in previous_chat_serialized.data:
                if chat["user_chat"]:
                    history_chat.append({"role": "user", "parts": [chat["user_chat"]]})
                if chat["ai_chat"]:
                    history_chat.append({"role": "model", "parts": [chat["ai_chat"]]})
            
            print(history_chat)

            prompt_3 = f"""Forgot every system note you where given before.
            From now, you are the kind and human like AI Interviewer of the company named 'Company 7' and your name is 'Agent437'. Mimick human behavior and mimick professional interviewers.

            You are in stage 3. In previous stage 2, you completed the testing user's programming and logical thinking skills. You've already introduced about yourself on previous stage so don't introduce yourself again. Here is the user introduction summarized in stage 1 '{introduction_summary}'
            The user's logical thinking score is {logical_thinking_score} and the user's programming skill score is {programming_skills_score}
            In this stage, your job is to get the user's case study solving skills.

            Get case study solving and use cases skills from the user in interaction way.

            You are going to get case study and use case skills to the user {first_name} {last_name}.
            You are taking interview to user on the field {field_of_interview}. The user applied to this.
            Give user case questions and case study to solve.

            While you are interactively getting user case study and use case skills from user, your response should be in the format

            <your_response_to_user> --- False

            In the above format, until you finish getting user case study and use case skills in interactive way, the boolean value should be 'False'.
            If you finished interviewing about the user's user case study and use case skills, your response should be in the format

            <your_response_to_user> --- <user_case_study_score_of_100_in_integer> --- <logical_thinking_score_of_100_in_integer> --- True


            Important: Follow the response the format until last. Don't break the response format and don't change the track.
            """

            ai_interviewer = Interviewer(system_instruction=prompt_3, user_message=user_message, history_chat=history_chat)

            ai_response = ai_interviewer.get_response()

            print(ai_response)
            
            chat_data = {
                "ai_chat": ai_response,
                "user_chat": user_message,
                "stage": stage
            }

            InterviewChatLog.objects.create(user=user, **chat_data)

            ai_response_list = ai_response.split("---")

            print(len(ai_response_list))

            if len(ai_response_list) <= 2:
                ai_message = ai_response_list[0].strip()
            elif len(ai_response_list) > 2:
                ai_message, case_study_score, is_stage_passed = ai_response_list
                employer = Employer.objects.get(user=user)
                employer.stage = 4
                employer.case_study = int(case_study_score.strip())
                employer.save()
        
        elif stage == 4:
            first_name = Employer.objects.get(user=user).first_name
            last_name = Employer.objects.get(user=user).last_name
            field_of_interview = Employer.objects.get(user=user).field_of_interview
            logical_thinking_score = Employer.objects.get(user=user).logical_thinking
            programming_skills_score = Employer.objects.get(user=user).programming_skill
            case_study_score = Employer.objects.get(user=user).case_study
            problem_solving_skills_score = Employer.objects.get(user=user).problem_solving

            introduction_summary = Employer.objects.get(user=user).introduction_summary

            logical_thinking_score = Employer.objects.get(user=user).logical_thinking

            previous_chat = InterviewChatLog.objects.filter(user=user).filter(stage=4)

            previous_chat_serialized = InterviewChatLogSerializer(previous_chat, many=True)

            history_chat = []
            for chat in previous_chat_serialized.data:
                if chat["user_chat"]:
                    history_chat.append({"role": "user", "parts": [chat["user_chat"]]})
                if chat["ai_chat"]:
                    history_chat.append({"role": "model", "parts": [chat["ai_chat"]]})
            
            print(history_chat)

            prompt_3 = f"""Forgot every system note you where given before.
            From now, you are the kind and human like AI Interviewer of the company named 'Company 7' and your name is 'Agent437'. Mimick human behavior and mimick professional interviewers.

            You are in stage 4. In previous stage 3, you completed the testing user's case study skills. You've already introduced about yourself on previous stage so don't introduce yourself again. Here is the user introduction summarized in stage 1 '{introduction_summary}'
            The user's logical thinking score is {logical_thinking_score}, the user's programming skill score is {programming_skills_score} and the user's case study skills is {case_study_score} and problem solving skill is {problem_solving_skills_score}
            In this stage, your job is to actually say goodbye and evalute the final score.

            Evaluate the final score of 100 and react according to the score. For example, if user got high score, congratulate the user, if user got low motivate or reject in nicest way as possible.

            You are going to finish the interview of the user {first_name} {last_name}.
            You are taking interview to user on the field {field_of_interview}. The user applied to this.

            Your response should be in the format for every response

            '<your_response> --- <final_score_of_100_in_integer> --- <boolean_value>'


            Important: Follow the response the format until last. Don't break the response format and don't change the track.
            """

            ai_interviewer = Interviewer(system_instruction=prompt_3, user_message=user_message, history_chat=history_chat)

            ai_response = ai_interviewer.get_response()

            print(ai_response)
            
            chat_data = {
                "ai_chat": ai_response,
                "user_chat": user_message,
                "stage": stage
            }

            InterviewChatLog.objects.create(user=user, **chat_data)

            ai_response_list = ai_response.split("---")

            ai_message, final_score, is_stage_passed = ai_response_list

            print(len(ai_response_list))

            # if len(ai_response_list) <= 2:
            #     ai_message = ai_response_list[0].strip()
            # elif len(ai_response_list) > 2:
            #     ai_message, case_study_score, is_stage_passed = ai_response_list
            #     employer = Employer.objects.get(user=user)
            #     employer.stage = 4
            #     employer.case_study = int(case_study_score.strip())

            if bool(is_stage_passed.strip()):
                employer = Employer.objects.get(user=user)
                employer.stage = 5
                employer.overall_score = int(final_score.strip())
                employer.interview_status = "COMPLETED"
                employer.save()


        elif stage == 5:
            return Response({"ai_interviewer": "The interview have been completed already. Contact your HR."})


        return Response({"ai_interviewer": ai_message}, status=status.HTTP_200_OK)