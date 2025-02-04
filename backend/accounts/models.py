from django.contrib.auth.models import AbstractUser
from django.db import models
import json

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    portfolio = models.JSONField(default=dict, blank=True)  # Store portfolio as JSON

    def __str__(self):
        return self.username

    def update_portfolio(self, new_portfolio):
        """
        Update the user's portfolio data.
        """
        self.portfolio = new_portfolio
        self.save()
