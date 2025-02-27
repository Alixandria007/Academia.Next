export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatarCREF = (value: string) => {
  const digitsAndLetters = value.replace(/[^0-9A-Za-z]/g, '').slice(0, 10); // Limite de 10 caracteres

  if (digitsAndLetters.length > 4 && /[GPT]/.test(digitsAndLetters)) {
    return digitsAndLetters.replace(/(\d{4,6})([GPT]{1})([A-Z]{2})/, '$1-$2/$3');
  }

  if (digitsAndLetters.length <= 4) {
    return digitsAndLetters;
  }

  if (digitsAndLetters.length <= 6) {
    return digitsAndLetters.replace(/(\d{4})([GPT0-9]{2})/, '$1-$2');
  }

  return digitsAndLetters;
};

export const formatCPF = (value: string): string => {
  return value
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
};

export const formatPhone = (value: string| null | undefined): string => {
  if (!value) return("Não Informado")

  return value
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
};

export const formatDate = (data: string | Date): string => {
  const dateObj = typeof data === 'string' ? new Date(data) : data;

  if (isNaN(dateObj.getTime())) {
    return 'Data inválida';
  }

  const dia = String(dateObj.getDate()).padStart(2, '0');
  const mes = String(dateObj.getMonth() + 1).padStart(2, '0');
  const ano = dateObj.getFullYear();

  return `${dia}/${mes}/${ano}`;
}

export const formatMoney = (value: number ): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

export const formatDuracao = (value: string) => {
  return value === 'Men' ? 'Mensal' : value === 'Tri' ? 'Trimestral' : value === 'Sem' ? 'Semestral' : 'Anual'
}