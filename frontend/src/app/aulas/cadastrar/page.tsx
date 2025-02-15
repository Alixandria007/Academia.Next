'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface Instrutor {
  id: number;
  first_name: string;
  last_name: string;
  cref?: string;
}

interface AulaFormData {
  nome: string;
  vagas: number;
  horario_inicial: string;
  horario_final: string;
  instrutor: string;
  dias_da_semana: string[];
}

const CadastrarAula = () => {
  const [nome, setNome] = useState<string>('');
  const [vagas, setVagas] = useState<number>(1);
  const [horarioInicial, setHorarioInicial] = useState<string>('');
  const [horarioFinal, setHorarioFinal] = useState<string>('');
  const [instrutor, setInstrutor] = useState<string>('');
  const [diasSemana, setDiasSemana] = useState<string[]>([]);
  const [instrutores, setInstrutores] = useState<Instrutor[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API

  useEffect(() => {
    const fetchInstrutores = async () => {
      try {
        const response = await fetch(`${API}/funcionario?instrutores="True"/`,{
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Erro ao carregar os instrutores.');
        }

        const data = await response.json();
        setInstrutores(data);
      } catch (error) {
        setErrorMessage('Erro ao carregar os instrutores.');
        console.error(error);
      }
    };

    fetchInstrutores();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const dadosAula: AulaFormData = {
      nome,
      vagas,
      horario_inicial: horarioInicial,
      horario_final: horarioFinal,
      instrutor,
      dias_da_semana: diasSemana,
    };

    try {
      const response = await fetch(`${API}/aula/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosAula),
        credentials: 'include'
      });

      if (response.ok) {
        setSuccessMessage('Aula cadastrada com sucesso!');
        setTimeout(() => {
          router.push('/aulas');
        }, 2000);
      } else {
        const data = await response.json();
        setErrorMessage(data.detail || 'Erro ao cadastrar aula!');
      }
    } catch (error) {
      setErrorMessage('Erro de conexão!');
      console.error(error);
    }
  };

  const handleDiasSemanaChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setDiasSemana(selectedOptions);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-6">Cadastrar Aula</h1>

      {successMessage && <p className="text-green-600 mb-4">{successMessage}</p>}
      {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="nome" className="block font-medium mb-1">Nome da Aula</label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="vagas" className="block font-medium mb-1">Número de Vagas</label>
          <input
            type="number"
            id="vagas"
            value={vagas}
            onChange={(e) => setVagas(Number(e.target.value))}
            min={1}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="horario_inicial" className="block font-medium mb-1">Horário Inicial</label>
          <input
            type="time"
            id="horario_inicial"
            value={horarioInicial}
            onChange={(e) => setHorarioInicial(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="horario_final" className="block font-medium mb-1">Horário Final</label>
          <input
            type="time"
            id="horario_final"
            value={horarioFinal}
            onChange={(e) => setHorarioFinal(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="instrutor" className="block font-medium mb-1">Instrutor</label>
          <select
            id="instrutor"
            value={instrutor}
            onChange={(e) => setInstrutor(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Selecione o instrutor</option>
            {instrutores.map((inst) => (
              <option key={inst.id} value={inst.id}>
                {inst.first_name} {inst.last_name} {inst.cref ? `- CREF: ${inst.cref}` : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="dias_da_semana" className="block font-medium mb-1">Dias da Semana</label>
          <select
            id="dias_da_semana"
            multiple
            value={diasSemana}
            onChange={handleDiasSemanaChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="1">Segunda-feira</option>
            <option value="2">Terça-feira</option>
            <option value="3">Quarta-feira</option>
            <option value="4">Quinta-feira</option>
            <option value="5">Sexta-feira</option>
            <option value="6">Sábado</option>
            <option value="7">Domingo</option>
          </select>
        </div>

        <button type="submit" className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
          Cadastrar Aula
        </button>
      </form>
    </div>
  );
};

export default CadastrarAula;
