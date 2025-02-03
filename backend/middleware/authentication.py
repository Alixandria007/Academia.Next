from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings
import jwt

class CookieJWTAuthentication(JWTAuthentication):
    def get_raw_token(self, request):
        token = request.COOKIES.get('access_token')
        if not token:
            raise AuthenticationFailed("Token não encontrado nos cookies.")
        return token

    def authenticate(self, request):
        raw_token = self.get_raw_token(request)
        validated_token = self.get_validated_token(raw_token)
        return self.get_user(validated_token), validated_token
