from rest_framework import routers

from core.user.viewsets import UserViewSet

from core.auth.viewsets import (
    LoginViewSet,
    RegisterViewSet
)
from core.auth.viewsets import RefreshViewSet

from core.employer.viewsets.employer import EmployerViewSet
from core.employer.viewsets.questions import InterviewQuestionViewSet

from core.ai_interview.viewsets.chatlog import InterviewChatLogViewSet

from core.ai_interview.viewsets.ai_interview import AIInterviewViewSet

router = routers.SimpleRouter()

router.register(r"user", UserViewSet, basename="user")

router.register(r"auth/register", RegisterViewSet, basename="auth-register")
router.register(r"auth/refresh", RefreshViewSet, basename="auth-refresh")
router.register(r"auth/login", LoginViewSet, basename="auth-login")

router.register(r"employer", EmployerViewSet, basename="employer")
router.register(r"questions", InterviewQuestionViewSet, basename="questions")

router.register(r"ai_interview/chatlog", InterviewChatLogViewSet, basename="interview-chatlog")

router.register(r"ai_interview/ai", AIInterviewViewSet, basename="ai-interview")

urlpatterns = [
    *router.urls,
]