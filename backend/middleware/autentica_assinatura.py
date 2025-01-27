from apps.aluno.models import Aluno
from apps.plano.models import Assinatura
from django.utils import timezone

class AutenticaAssinaturaMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        alunos = Aluno.objects.all()
        data = timezone.now().date()

        for aluno in alunos:
            aluno.ativo = True if Assinatura.objects.filter(aluno = aluno.pk, vencimento__gt = data).last() else False

            aluno.save()

        response = self.get_response(request)
        return response