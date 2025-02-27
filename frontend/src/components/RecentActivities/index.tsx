'use client';

import { capitalize } from '@/utils/formatações';
import React from 'react';

type Activities = {
  tipo_acao: string;
  descricao: string;
  data_hora: string;
};

type RecentActivitiesProps = {
  activities: Activities[];
};

const RecentActivities = ({ activities }: RecentActivitiesProps) => {
  const formatDate = (data_hora: string) => {
    const date = new Date(data_hora);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}/${month}/${year} às ${hours}:${minutes}`;
  };

  return (
    <div className="bg-white p-4 shadow-md rounded-lg">
      <h2 className="text-xl font-bold text-gray-700 mb-1">Atividades Recentes</h2>
      <ul className="divide-y divide-gray-200">
        {activities.map((act, index) => (
          <li key={index} className="py-2">
            <span className="font-semibold text-blue-600">{capitalize(act.tipo_acao)}</span> - 
            <span className="text-gray-700"> {act.descricao} </span> - 
            <span className="text-sm text-gray-500"> {formatDate(act.data_hora)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivities;
