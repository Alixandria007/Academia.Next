from django.db import models
from ..aluno import models as modelAluno
from django.utils import timezone

# Create your models here.

class AtividadeExtra(models.Model):
    TIPOS_ATIVIDADE = [
        ('aulas_coletivas', 'Aulas Coletivas'),
        ('funcional', 'Treinamento Funcional'),
        ('artes_marciais', 'Artes Marciais e Defesa Pessoal'),
        ('yoga_alongamento', 'Yoga e Alongamento'),
    ]

    nome = models.CharField(max_length=100, choices=TIPOS_ATIVIDADE, unique=True)
    descricao = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.get_nome_display()
    
class Plano(models.Model):

    class Meta:
        verbose_name = 'Plano'
        verbose_name_plural = 'Planos'

    nome = models.CharField(max_length=150, unique=True)
    valor = models.PositiveIntegerField(default=1)
    duracao = models.CharField(choices=({'Men': 'Mensal', 'Tri': 'Trimestral', 'Sem': 'Semestral', 'Anual' : 'Anual'}), max_length=5)
    atividade_extra = models.ManyToManyField(AtividadeExtra, blank=True)

    def __str__(self) -> str:
        return f'Plano {self.nome}'

class Assinatura(models.Model):
    def current_date():
        return timezone.now().date()
    
    class Meta:
        verbose_name = 'Assinatura'
        verbose_name_plural = 'Assinaturas'

    aluno = models.ForeignKey(modelAluno.Aluno, on_delete=models.CASCADE)
    plano = models.ForeignKey(Plano, on_delete=models.SET_NULL, null=True)
    total = models.PositiveIntegerField()
    data_assinatura = models.DateField(default=current_date)
    vencimento = models.DateField()

    def __str__(self) -> str:
        return f'Assinatura nº{self.pk}'