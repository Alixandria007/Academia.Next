'use client'

import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Filler } from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler);

type chartData = {
  dia: string,
  total: number
}

interface ActivityChartProps {
  chartData: chartData[];
}

const ActivityChart = ({chartData}: ActivityChartProps) => {
  const labels: string[]= [];
  const total: number[] = []
  const today = new Date();

  chartData.map((data) => {
    labels.push(data.dia)
    total.push(data.total)
  })

  const data = {
    labels: labels.reverse(),
    datasets: [
      {
        label: 'Check-ins Semanais',
        data: total.reverse(),
        fill: true,
        backgroundColor: 'rgba(255, 0, 234, 0.2)',
        borderColor: 'pink',
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
