from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
import os

class Command(BaseCommand):
    help = 'Creates a superuser non-interactively if it does not exist'

    def handle(self, *args, **kwargs):
        User = get_user_model()
        email = "admin@example.com"
        password = "pass1234"
        
        # Check if the user already exists
        if not User.objects.filter(email=email).exists():
            print(f"Creating superuser: {email}...")
            
            # Try creating with username (if required) + email
            try:
                User.objects.create_superuser(
                    username="admin",  # Fallback if username is required
                    email=email, 
                    password=password
                )
            except Exception:
                # If that fails (e.g., custom model with no username field), try email only
                User.objects.create_superuser(
                    email=email, 
                    password=password
                )
            
            print("Superuser 'admin@example.com' created successfully!")
        else:
            print("Superuser 'admin@example.com' already exists.")