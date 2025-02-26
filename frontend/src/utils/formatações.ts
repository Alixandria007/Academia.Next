export const capitalize = (str:string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const formatarCREF = (value: string) => {
    const digitsAndLetters = value.replace(/[^0-9A-Za-z]/g, '');
  
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
      .replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  };

export const formatPhone = (value: string): string => {
    return value
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  };
