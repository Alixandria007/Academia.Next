'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Instrutor {
  id: number;
  first_name: string;
  last_name: string;
  cref?: string;
}

interface DiaSemana {
  id: number;
  nome: string;
}

interface TipoAtividade {
  id: number;
  label: string;
}

interface AulaFormData {
  nome: string;
  vagas: number;
  horario_inicial: string;
  horario_final: string;
  instrutor: { id: number } | number;
  dias_da_semana: string[] | { id: string }[];
  tipo_atividade: { id: number } ;
}


const AtualizarAula = () => {
  const [nome, setNome] = useState<string>('');
  const [vagas, setVagas] = useState<number>(1);
  const [horarioInicial, setHorarioInicial] = useState<string>('');
  const [horarioFinal, setHorarioFinal] = useState<string>('');
  const [instrutor, setInstrutor] = useState<number>(0);
  const [diasSemana, setDiasSemana] = useState<string[]>([]);
  const [tipoAtividade, setTipoAtividade] = useState<number>(0);  
  const [instrutores, setInstrutores] = useState<Instrutor[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const router = useRouter();
  const { id } = useParams();
  const API = process.env.NEXT_PUBLIC_API;

  const diasDaSemanaOpcoes: DiaSemana[] = [
    { id: 1, nome: 'Segunda-feira' },
    { id: 2, nome: 'Terça-feira' },
    { id: 3, nome: 'Quarta-feira' },
    { id: 4, nome: 'Quinta-feira' },
    { id: 5, nome: 'Sexta-feira' },
    { id: 6, nome: 'Sábado' },
    { id: 7, nome: 'Domingo' },
  ];

  const tiposAtividade: TipoAtividade[] = [
    { id: 1, label: 'Aulas Coletivas' },
    { id: 2, label: 'Treinamento Funcional' },
    { id: 3, label: 'Artes Marciais e Defesa Pessoal' },
    { id: 4, label: 'Yoga e Alongamento' },
  ];

  useEffect(() => {
    const fetchInstrutores = async () => {
      try {
        const response = await fetch(`${API}/funcionario?instrutores/`, {
          credentials: 'include',
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

  useEffect(() => {
    const fetchAula = async () => {
      try {
        if (!id) return;

        const response = await fetch(`${API}/aula/${id}/`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Erro ao carregar os dados da aula.');
        }

        const data: AulaFormData = await response.json();
        setNome(data.nome);
        setVagas(data.vagas);
        setHorarioInicial(data.horario_inicial);
        setHorarioFinal(data.horario_final);
        if (data.instrutor !== null) {
          setInstrutor(typeof data.instrutor === 'object' ? data.instrutor.id : data.instrutor);
        }
        // @ts-ignore
        const dias = data.dias_da_semana.map((dia) => dia.id);

        setDiasSemana(dias);
        setTipoAtividade(data.tipo_atividade.id); 
      } catch (error) {
        setErrorMessage('Erro ao carregar os dados da aula.');
        console.error(error);
      }
    };

    fetchAula();
  }, [id]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const dadosAula = {
      nome,
      vagas,
      horario_inicial: horarioInicial,
      horario_final: horarioFinal,
      instrutor,
      dias_da_semana: diasSemana,
      tipo_atividade: tipoAtividade,  
    };

    try {
      const response = await fetch(`${API}/aula/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosAula),
        credentials: 'include',
      });

      if (response.ok) {
        setSuccessMessage('Aula atualizada com sucesso!');
        setTimeout(() => {
          router.push('/aulas');
        }, 2000);
      } else {
        const data = await response.json();
        setErrorMessage(data.detail || 'Erro ao atualizar a aula!');
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
      <h1 className="text-2xl font-bold mb-6">Atualizar Aula</h1>

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
            onChange={(e) => setInstrutor(Number(e.target.value))}
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
            {diasDaSemanaOpcoes.map((dia) => (
              <option key={dia.id} value={dia.id.toString()}>
                {dia.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="tipo_atividade" className="block font-medium mb-1">Tipo de Atividade</label>
          <select
            id="tipo_atividade"
            value={tipoAtividade}
            onChange={(e) => setTipoAtividade(Number(e.target.value))}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Selecione o tipo de atividade</option>
            {tiposAtividade.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.label}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
          Atualizar Aula
        </button>
      </form>
    </div>
  );
};

export default AtualizarAula;
