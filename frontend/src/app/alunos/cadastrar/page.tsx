'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface AlunoFormData {
  first_name: string;
  last_name: string;
  email: string;
  cpf: string;
  telefone: string;
  data_de_nascimento: string;
  foto?: File | null;
}

export default function CadastrarAluno() {
  const API = process.env.NEXT_PUBLIC_API;
  const router = useRouter();

  const [formData, setFormData] = useState<AlunoFormData>({
    first_name: '',
    last_name: '',
    email: '',
    cpf: '',
    telefone: '',
    data_de_nascimento: '',
    foto: null, // Novo campo para armazenar a foto
  });

  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let formattedValue = value;
    if (name === 'cpf') {
      formattedValue = formatCPF(value); // Formata o CPF
    } else if (name === 'telefone') {
      formattedValue = formatPhone(value); // Formata o telefone
    }

    setFormData({ ...formData, [name]: formattedValue });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, foto: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      // Adiciona os dados do formulário
      formDataToSend.append('first_name', formData.first_name);
      formDataToSend.append('last_name', formData.last_name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('cpf', formData.cpf);
      formDataToSend.append('telefone', formData.telefone);
      formDataToSend.append('data_de_nascimento', formData.data_de_nascimento);

      // Adiciona a foto, se houver
      if (formData.foto) {
        formDataToSend.append('foto', formData.foto);
      }

      const response = await fetch(`${API}/aluno/`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: formDataToSend,
      });

      if (response.ok) {
        setSuccessMessage('Aluno cadastrado com sucesso!');
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          cpf: '',
          telefone: '',
          data_de_nascimento: '',
          foto: null,
        });
        router.push('/alunos');
      } else {
        console.error('Erro ao cadastrar aluno:', await response.text());
      }
    } catch (error) {
      console.error('Erro ao cadastrar aluno:', error);
    }
  };

  const formatCPF = (value: string): string => {
    return value
      .replace(/\D/g, '')
      .replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  };

  const formatPhone = (value: string): string => {
    return value
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Cadastrar Aluno</h1>
      {successMessage && (
        <div className="p-4 mb-4 text-green-700 bg-green-100 rounded">
          {successMessage}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
            Nome
          </label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
            Sobrenome
          </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
            CPF
          </label>
          <input
            type="text"
            id="cpf"
            name="cpf"
            value={formData.cpf}
            onChange={handleInputChange}
            maxLength={14}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">
            Telefone
          </label>
          <input
            type="text"
            id="telefone"
            name="telefone"
            value={formData.telefone}
            onChange={handleInputChange}
            maxLength={11}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="data_de_nascimento" className="block text-sm font-medium text-gray-700">
            Data de Nascimento
          </label>
          <input
            type="date"
            id="data_de_nascimento"
            name="data_de_nascimento"
            value={formData.data_de_nascimento}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
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
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
