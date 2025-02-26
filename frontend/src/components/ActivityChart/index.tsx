'use client'

import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip, Legend);

type ChartData = {
  dia: string;
  total: number;
};

interface ActivityChartProps {
  chartData: ChartData[];
}

const ActivityChart = ({ chartData }: ActivityChartProps) => {
  const labels = chartData.map((data) => data.dia).reverse();
  const total = chartData.map((data) => data.total).reverse();

  const data = {
    labels,
    datasets: [
      {
        label: 'Atividades Semanais',
        data: total,
        fill: true,
        backgroundColor: 'rgba(33, 99, 234, 0.2)',
        borderColor: '#2163EA',
        borderWidth: 2,
        pointBackgroundColor: '#2163EA',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#2163EA',
      },
    ],
  };


  return (
    <div className="w-full h-full flex flex-col">
      <h2 className="text-xl font-semibold text-gray-700">Atividades da Semana</h2>
      <div className="flex-1 w-full h-full">
        <Line data={data} options={{responsive: true}}/>
      </div>
    </div>
  );
};

export default ActivityChart;
