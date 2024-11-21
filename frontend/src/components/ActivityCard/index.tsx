'use client'

import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Filler } from 'chart.js';

// Registre os componentes necessários
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler);

const ActivityChart = () => {
  const data = {
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Check-ins Semanais',
        data: [20, 35, 45, 30, 50, 60, 40],
        fill: true,
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: '#6366f1',
      },
    ],
  };

  return (
    <div className="bg-white p-6 shadow rounded-lg">
      <h2 className="text-xl font-bold text-gray-700">Atividades da Semana</h2>
      <div className="w-full mt-4">
        <Line 
          data={data} 
        />
      </div>
    </div>
  );
};

export default ActivityChart;
