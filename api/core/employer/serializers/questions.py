from rest_framework import serializers
from core.employer.models import InterviewQuestion


class InterviewQuestionSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(source="public_id", read_only=True, format="hex")
    employer = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = InterviewQuestion
        fields = "__all__"
