from rest_framework import serializers
from core.employer.models import Employer

class EmployerSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(source="public_id", read_only=True, format="hex")

    class Meta:
        model = Employer
        fields = "__all__"
