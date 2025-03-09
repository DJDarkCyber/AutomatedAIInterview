from django.db import models
from core.user.models import User

import uuid


class InterviewChatLog(models.Model):
    public_id = models.UUIDField(default=uuid.uuid4, unique=True, db_index=True, editable=False)

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="chat_logs")
    
    ai_chat = models.TextField(blank=True, null=True)
    user_chat = models.TextField(blank=True, null=True)

    stage = models.IntegerField(default=0)

    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"ChatLog {self.public_id} - {self.user.username}"