from django.shortcuts import redirect
from rest_framework_simplejwt.views import TokenObtainPairView,TokenVerifyView,TokenRefreshView
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer,TokenVerifySerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework.permissions import NOT
from django.views.decorators.csrf import csrf_exempt

import datetime
from rest_framework import status

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = TokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        tokens = serializer.validated_data
        access_token = tokens.get('access')
        refresh_token = tokens.get('refresh')

        if not access_token or not refresh_token:
            return Response({"detail": "Erro ao gerar os tokens."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        response = Response({"detail": "Login bem-sucedido."}, status=status.HTTP_200_OK)
        response.set_cookie(
            key='access_token',
            value=access_token,
            secure=True,
            httponly=True,
            samesite='None',
            max_age=300
        )
        
        response.set_cookie(
            key='refresh_token',
            value=refresh_token,
            secure=True,
            httponly=True,
            samesite='None',
            max_age=86400
        )
        return response


class LogoutView(APIView):
    def post(self, request, *args, **kwargs):
        response = Response(
            {"detail": "Logout realizado com sucesso."}, 
            status=status.HTTP_200_OK
        )

        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        return response


class CustomTokenVerifyView(TokenVerifyView):
    def post(self, request, *args, **kwargs):
        access_token = request.COOKIES.get('access_token')
        if not access_token:
            response = Response({"detail": f"Token de acesso não encontrado"}, status=status.HTTP_401_UNAUTHORIZED)
            return response
        
        serializer = TokenVerifySerializer(data={"token": access_token})
        try:
            serializer.is_valid(raise_exception=True)
            return Response({"detail": "Token válido."}, status=status.HTTP_200_OK)
        except AuthenticationFailed:
            return Response({"detail": "Token inválido ou expirado."}, status=status.HTTP_401_UNAUTHORIZED)


class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh_token')
        if not refresh_token:
            return Response({"detail": "Token de atualização não encontrado."}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)
            response = Response({"detail": "Token atualizado com sucesso."}, status=status.HTTP_200_OK)

            response.set_cookie(
                'access_token',
                access_token,
                httponly=True,
                secure=True,
                samesite='None',
                max_age=300
            )

            return response

        except InvalidToken:
            return Response({"detail": "Token de atualização inválido."}, status=status.HTTP_401_UNAUTHORIZED)