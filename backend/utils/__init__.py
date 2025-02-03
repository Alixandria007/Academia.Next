from apps.atividade.models import Atividade

def create_activity(tipo: str, descricao: str):
    return (Atividade.objects.create(
                tipo_acao = tipo,
                descricao = descricao
            ))