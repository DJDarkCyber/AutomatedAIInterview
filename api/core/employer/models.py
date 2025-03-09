from django.db import models
from django.conf import settings
import uuid


class Employer(models.Model):
    public_id = models.UUIDField(db_index=True, unique=True, default=uuid.uuid4)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="employer_profile")

    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)

    stage = models.IntegerField(default=0)
    is_true_attender = models.BooleanField(default=False)

    introduction_summary = models.TextField(null=True)

    programming_skill = models.IntegerField(default=0, max_length=100)
    logical_thinking = models.IntegerField(default=0, max_length=100)
    case_study = models.IntegerField(default=0, max_length=100)
    communication_skill = models.IntegerField(default=0, max_length=100)
    problem_solving = models.IntegerField(default=0, max_length=100)
    overall_score = models.IntegerField(default=0, max_length=100)

    field_of_interview = models.CharField(max_length=255)
    
    interview_status = models.CharField(
        max_length=20, 
        choices=[("PENDING", "Pending"), ("IN_PROGRESS", "In Progress"), ("COMPLETED", "Completed")], 
        default="PENDING"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class InterviewQuestion(models.Model):
    public_id = models.UUIDField(db_index=True, unique=True, default=uuid.uuid4)
    employer = models.ForeignKey(Employer, on_delete=models.CASCADE, related_name="interview_questions")
    question_text = models.TextField()
    answer_text = models.TextField(blank=True, null=True)
    score = models.IntegerField(default=0, max_length=100)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Question for {self.employer.first_name} - {self.question_text[:30]}..."
