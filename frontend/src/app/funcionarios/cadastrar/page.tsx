'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface FuncionarioFormData {
  first_name: string;
  last_name: string;
  email: string;
  entrada: string;
  saida: string;
  salario: string;
  cpf: string;
  cref: string | null;
  telefone: string;
  foto: File | null;
}

export default function CadastrarFuncionario() {
  const router = useRouter();

  const [formData, setFormData] = useState<FuncionarioFormData>({
    first_name: '',
    last_name: '',
    email: '',
    entrada: '',
    saida: '',
    salario: '',
    cpf: '',
    cref: null,
    telefone: '',
    foto: null,
  });

  const [instrutor, setInstrutor] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, foto: e.target.files![0] }));
    }
  };

  const handleCrefChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, cref: e.target.value }));
  };

  const handleInstrutorChange = () => {
    setInstrutor(prev => !prev);
    setFormData(prev => ({
      ...prev,
      cref: instrutor ? null : prev.cref, // Se desativar instrutor, limpa cref
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          formDataToSend.append(key, value);
        }
      });

      const response = await fetch('http://127.0.0.1:8000/funcionario/', {
        method: 'POST',
        credentials: 'include',
        body: formDataToSend,
      });

      if (response.ok) {
        setSuccessMessage('Funcionário cadastrado com sucesso!');
        setErrorMessage('');
        setFieldErrors({});
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          entrada: '',
          saida: '',
          salario: '',
          cpf: '',
          cref: null,
          telefone: '',
          foto: null,
        });
        router.push('/funcionarios');
      } else {
        const errorData = await response.json();

        if (errorData.detail) {
          setErrorMessage(errorData.detail);
        }

        if (errorData.errors) {
          setFieldErrors(errorData.errors);
        }
      }
    } catch (error) {
      setErrorMessage('Erro ao processar o cadastro. Tente novamente mais tarde.');
      console.error(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Cadastrar Funcionário</h1>

      {successMessage && <div className="p-4 mb-4 text-green-700 bg-green-100 rounded">{successMessage}</div>}

      {errorMessage && <div className="p-4 mb-4 text-red-700 bg-red-100 rounded">{errorMessage}</div>}

      <form onSubmit={handleSubmit}>
        {[
          { id: 'first_name', label: 'Nome', type: 'text', required: true },
          { id: 'last_name', label: 'Sobrenome', type: 'text', required: true },
          { id: 'email', label: 'Email', type: 'email', required: true },
          { id: 'entrada', label: 'Hora de Entrada', type: 'time', required: true },
          { id: 'saida', label: 'Hora de Saída', type: 'time', required: true },
          { id: 'salario', label: 'Salário', type: 'number', required: true },
          { id: 'cpf', label: 'CPF', type: 'text', required: true },
          { id: 'telefone', label: 'Telefone', type: 'text', required: false },
        ].map(({ id, label, type, required }) => (
          <div key={id} className="mb-4">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">
              {label}
            </label>
            <input
              type={type}
              id={id}
              name={id}
              onChange={handleInputChange}
              required={required}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {fieldErrors[id] && <span className="text-red-600 text-sm">{fieldErrors[id]}</span>}
          </div>
        ))}

        <div className="mb-4 flex items-center">
          <label htmlFor="instrutor" className="block text-sm font-medium text-gray-700 mr-2">
            Instrutor
          </label>
          <input type="checkbox" id="instrutor" checked={instrutor} onChange={handleInstrutorChange} />
        </div>

        {instrutor && (
          <div className="mb-4">
            <label htmlFor="cref" className="block text-sm font-medium text-gray-700">CREF</label>
            <input
              type="text"
              name="cref"
              id="cref"
              value={formData.cref || ''}
              onChange={handleCrefChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="foto" className="block text-sm font-medium text-gray-700">
            Foto
          </label>
          <input
            type="file"
            id="foto"
            name="foto"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
}
