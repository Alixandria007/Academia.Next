'use client'

import React, { useEffect, useState } from 'react';
import ActivityChart from '@/components/ActivityChart';
import DashboardCards from '@/components/DashboardCards';
import { Header } from '@/components/Header';
import QuickActions from '@/components/QuickActions';
import RecentActivities from '@/components/RecentActivities';

const Home = () => {
  const [activities, setActivities] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [alunos, setAlunos] = useState<number>(0);
  const [instrutores, setInstrutores] = useState<number>(0);
  const [aulas, setAulas] = useState<number>(0);
  const [planos, setPlanos] = useState<number>(1);

  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API;

    const fetchData = async (url: string, setter: Function, errorMessage: string) => {
      try {
        const response = await fetch(`${API}${url}`, { credentials: 'include' });
        const data = await response.json();
        if (response.ok) {
          setter(data);
        } else {
          console.error(data.detail);
        }
      } catch {
        console.error(errorMessage);
      }
    };

    fetchData('/atividade/?limit=3', setActivities, 'Erro ao buscar os dados das Atividades!');
    fetchData('/atividade/dashboard/', (data: any) => {
      setAlunos(data.alunos);
      setAulas(data.aulas);
      setInstrutores(data.instrutores);
      setPlanos(data.planos);
    }, 'Erro ao buscar os dados do Dashboard!');
    fetchData('/atividade/chart/', setChartData, 'Erro ao buscar os dados do gráfico!');
  }, []);

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <DashboardCards alunos={alunos} instrutores={instrutores} aulas={aulas} planos={planos} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="flex-1 bg-white shadow-lg rounded-lg p-6">
            <ActivityChart chartData={chartData} />
          </div>

          <div className="flex-1 flex flex-col gap-6">
            <QuickActions />
            <RecentActivities activities={activities} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
