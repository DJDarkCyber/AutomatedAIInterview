from rest_framework import routers

from core.user.viewsets import UserViewSet

from core.auth.viewsets import (
    LoginViewSet,
    RegisterViewSet
)
from core.auth.viewsets import RefreshViewSet

from core.employer.viewsets.employer import EmployerViewSet
from core.employer.viewsets.questions import InterviewQuestionViewSet

router = routers.SimpleRouter()

router.register(r"user", UserViewSet, basename="user")

router.register(r"auth/register", RegisterViewSet, basename="auth-register")
router.register(r"auth/refresh", RefreshViewSet, basename="auth-refresh")
router.register(r"auth/login", LoginViewSet, basename="auth-login")

router.register(r"employer", EmployerViewSet, basename="employer")
router.register(r"questions", InterviewQuestionViewSet, basename="questions")


urlpatterns = [
    *router.urls,
]