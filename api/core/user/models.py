import uuid

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.exceptions import ObjectDoesNotExist
from django.db import models
from django.http import Http404


class UserManager(BaseUserManager):
    def get_object_by_public_id(self, public_id):
        try:
            instance = self.get(public_id=public_id)
            return instance
        except (ObjectDoesNotExist, ValueError, TypeError):
            raise Http404("User not found.")
            
    def create_employer(self, username, email, password=None, **kwargs):
        if username is None:
            raise TypeError("The employers must have a username.")
        if email is None:
            raise TypeError("The employers must have an email.")
        if password is None:
            raise TypeError("The employers must have a password.")
        
        user = self.model(username=username, email=self.normalize_email(email), **kwargs)
        user.set_password(password)
        user.role = "EMPLOYER"
        user.save(using=self._db)
        
        return user
    
    def create_moderator(self, username, email, password=None, **kwargs):
        if username is None:
            raise TypeError("The moderators must have a username.")
        if email is None:
            raise TypeError("The moderators must have an email.")
        if password is None:
            raise TypeError("The moderators must have a password.")
        
        user = self.model(username=username, email=self.normalize_email(email), **kwargs)
        user.set_password(password)
        user.role = "MODERATOR"
        user.save(using=self._db)

        return user
    
    def create_superuser(self, username, email, password, **kwargs):
        if username is None:
            raise TypeError("Superusers must have a username.")
        if email is None:
            raise TypeError("Superusers must have an email.")
        if password is None:
            raise TypeError("Superusers must have an password.")
        
        user = self.model(username=username, email=self.normalize_email(email), **kwargs)
        user.set_password(password)
        user.is_superuser = True
        user.is_staff = True
        user.role = "ADMIN"
        user.save(using=self._db)

        return user
    

class User(AbstractBaseUser, PermissionsMixin):

    class Role(models.TextChoices):
        EMPLOYER = "EMPLOYER", "Employer"
        MODERATOR = "MODERATOR", "Moderator"
        ADMIN = "ADMIN", "Admin"

    public_id = models.UUIDField(db_index=True, unique=True, default=uuid.uuid4)

    username = models.CharField(db_index=True, max_length=255, unique=True)
    email = models.CharField(db_index=True, unique=True, max_length=255)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)

    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
    )

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    objects = UserManager()

    def __str__(self):
        return f"{self.email}"
    
    @property
    def name(self):
        return f"{self.first_name} {self.last_name}"