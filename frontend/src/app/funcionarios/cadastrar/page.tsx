'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface FuncionarioFormData {
  first_name: string;
  last_name: string;
  email: string;
  data_admissao: string;
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
    data_admissao: '',
    entrada: '',
    saida: '',
    salario: '',
    cpf: '',
    cref:'',
    telefone: '',
    foto: null,
  });

  const [instrutor, setInstrutor] = useState<boolean>(false)
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFieldErrors({ ...fieldErrors, [name]: '' }); // Limpa o erro do campo alterado
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, foto: e.target.files[0] });
    }
  };

  const handleCrefChange = (e: ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, cref: e.target.value });
  };

  const handleInstrutorChange = () => {
    setInstrutor(!instrutor)
  }

  const handleSubmit = async (e: FormEvent, instrutor: boolean) => {
    e.preventDefault();

    const dataToSend = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        dataToSend.append(key, value as string | Blob);
      }
    });

    try {

      const response = instrutor ? await (fetch('http://127.0.0.1:8000/funcionario/instrutor/', {
        method: 'POST',
        body: dataToSend,
      })): await (fetch('http://127.0.0.1:8000/funcionario/', {
        method: 'POST',
        body: dataToSend,
      }));

      if (response.ok) {
        setSuccessMessage('Funcionário cadastrado com sucesso!');
        setErrorMessage('');
        setFieldErrors({});
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          data_admissao: '',
          entrada: '',
          saida: '',
          salario: '',
          cpf: '',
          cref:'',
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

      <form onSubmit={(e) => handleSubmit(e, instrutor)}>
        {[ 
          { id: 'first_name', label: 'Nome', type: 'text', required: true },
          { id: 'last_name', label: 'Sobrenome', type: 'text', required: true },
          { id: 'email', label: 'Email', type: 'email', required: true },
          { id: 'data_admissao', label: 'Data de Admissão', type: 'date', required: true },
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
              value = {String(formData[id as keyof FuncionarioFormData]) || ''}
              onChange={handleInputChange}
              required={required}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {fieldErrors[id] && (
              <span className="text-red-600 text-sm">{fieldErrors[id]}</span>
            )}
          </div>
        ))}

        <div className="mb-4">
          <label htmlFor="instrutor" className='block text-sm font-medium text-gray-700'>
              Instrutor
          </label>
          <input type="checkbox" name="intrutor" id="instrutor" onChange={handleInstrutorChange} />
        </div>

        {instrutor && (
          <div className='mb-4'>
              <label htmlFor="cref" className='block text-sm font-medium text-gray-700'>CREF</label>
              <input type="text" name='cref' id='cref' className='mt-1 block w-full p-2 border border-gray-300 rounded-md' onChange={handleCrefChange} required/>
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
