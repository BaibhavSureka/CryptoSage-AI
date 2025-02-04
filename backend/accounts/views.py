from django.contrib.auth import logout,authenticate
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
try:
    from rest_framework.authtoken.models import Token
except ImportError:
    raise ImportError("Make sure 'rest_framework.authtoken' is added to INSTALLED_APPS and migrations are applied.")
from .serializers import RegisterSerializer, LoginSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model

User = get_user_model()

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            return Response({"token": token.key, "user": serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"error": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User with this email does not exist"}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=user.username, password=password)

        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({"token": token.key, "user": {"username": user.username, "email": user.email}}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid email or password"}, status=status.HTTP_400_BAD_REQUEST)



# Logout API
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.user.auth_token.delete()
        logout(request)
        return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
