import os
import django

# Setup Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()
email = "admin@example.com"
password = "pass1234"

try:
    if not User.objects.filter(email=email).exists():
        print(f"Creating superuser: {email}")
        # This handles both username-based and email-based user models
        try:
            User.objects.create_superuser(username="admin", email=email, password=password)
        except Exception:
            User.objects.create_superuser(email=email, password=password)
        print("Superuser created successfully!")
    else:
        print("Superuser already exists.")
except Exception as e:
    print(f"Error creating superuser: {e}")