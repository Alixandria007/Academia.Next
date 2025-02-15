export const validarCREF = (value: string): boolean => {
    const regex = /^(?:\d{4}-[GPT0-9]{2}|\d{4,6}-[GPT]{1}\/[A-Z]{2})$/;
    return regex.test(value);
  };