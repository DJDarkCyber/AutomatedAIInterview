from rest_framework import serializers
from core.ai_interview.models import InterviewChatLog

class InterviewChatLogSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(source="public_id", read_only=True, format="hex")
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = InterviewChatLog
        fields =  "__all__"