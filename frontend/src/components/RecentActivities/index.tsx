'use client';

import React, { useEffect, useState } from 'react';

type Activities = {
  tipo_acao: string,
  descricao: string,
  data_hora: string
}

type RecentActivitiesProps = {
  activities: Activities[];
};

const RecentActivities = ({activities} : RecentActivitiesProps) => {
  
  const formatDate = (data_hora: string) => {
    const date = new Date(data_hora);
  
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mês começa em 0
    const year = date.getFullYear();
    
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
  
    return `${day}/${month}/${year} as ${hours}:${minutes}`;}

  return (
    <div className="bg-white p-6 my-3 shadow rounded-lg">
      <h2 className="text-xl font-bold text-gray-700">Atividades Recentes</h2>
      <ul>
        {activities.map((act, index) => (
          <li key={index} className="border-b py-2">
            <span className="font-semibold">{act.tipo_acao.toUpperCase()} </span> - {act.descricao} - {formatDate(act.data_hora)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivities;
