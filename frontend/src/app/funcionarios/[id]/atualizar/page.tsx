'use client';

import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { formatarCREF, formatCPF, formatPhone } from '@/utils/formatações';

interface FuncionarioFormData {
  first_name: string;
  last_name: string;
  email: string;
  data_admissao: string;
  entrada: string;
  saida: string;
  salario: string;
  cpf: string;
  telefone: string;
  cref?: string; 
  foto: File | null;
}

export default function AtualizarFuncionario() {
  const router = useRouter();
  const { id } = useParams(); 
  const API = process.env.NEXT_PUBLIC_API

  const [formData, setFormData] = useState<FuncionarioFormData>({
    first_name: '',
    last_name: '',
    email: '',
    data_admissao: '',
    entrada: '',
    saida: '',
    salario: '',
    cpf: '',
    telefone: '',
    cref: '', 
    foto: null,
  });

  const [showCref, setShowCref] = useState<boolean>(false); 
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchFuncionario = async () => {
      try {
        const response = await fetch(`${API}/funcionario/${id}/`, {
          credentials: "include"
        });
        if (response.ok) {
          const data = await response.json();

          if (data.cref){
            setShowCref(true);
          }
          
          setFormData({
            ...data,
            foto: null,
          });
        } else {
          setErrorMessage('Erro ao carregar dados do funcionário.');
        }
      } catch (error) {
        setErrorMessage('Erro ao carregar dados do funcionário.');
        console.error(error);
      }
    };

    fetchFuncionario();
  }, [id]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;
    if (name == "cref") formattedValue = formatarCREF(formattedValue.toUpperCase())
    else if (name === "telefone") formattedValue = formatPhone(formattedValue)
    else if (name === 'cpf') formattedValue = formatCPF(formattedValue)
    setFormData({ ...formData, [name]: formattedValue });
    setFieldErrors({ ...fieldErrors, [name]: '' });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, foto: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const dataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        dataToSend.append(key, value as string | Blob);
      }
    });

    try {
      const response = await fetch(`${API}/funcionario/${id}/`, {
        method: 'PATCH',
        body: dataToSend,
        credentials: "include"
      });

      if (response.ok) {
        setSuccessMessage('Funcionário atualizado com sucesso!');
        setErrorMessage('');
        setFieldErrors({});
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
      setErrorMessage('Erro ao atualizar o funcionário. Tente novamente mais tarde.');
      console.error(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Atualizar Funcionário</h1>
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
              value={String(formData[id as keyof FuncionarioFormData]) || ''}
              onChange={handleInputChange}
              required={required}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {fieldErrors[id] && (
              <span className="text-red-600 text-sm">{fieldErrors[id]}</span>
            )}
          </div>
        ))}

        {showCref && (
          <div className="mb-4">
            <label htmlFor="cref" className="block text-sm font-medium text-gray-700">
              CREF
            </label>
            <input
              type="text"
              id="cref"
              name="cref"
              value={formData.cref || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {fieldErrors['cref'] && (
              <span className="text-red-600 text-sm">{fieldErrors['cref']}</span>
            )}
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
          Atualizar
        </button>
      </form>
    </div>
  );
}
