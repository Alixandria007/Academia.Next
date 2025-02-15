'use client'

import ActivityChart from '@/components/ActivityChart';
import DashboardCards from '@/components/DashboardCards';
import { Header } from '@/components/Header';
import QuickActions from '@/components/QuickActions';
import RecentActivities from '@/components/RecentActivities';
import React, { useEffect, useState } from 'react';


const Home = () => {
  const [activities, SetActivities] = useState([])
  const [chartData, setChartData] = useState([])
  const [alunos, setAlunos] = useState<number>(0)
  const [instrutores, setInstrutores] = useState<number>(0)
  const [aulas, setAulas] = useState<number>(0)
  const [planos, setPlanos] = useState<number>(1)


  useEffect(() => {
    let API = process.env.NEXT_PUBLIC_API

    const fetchActivity = async () => {
      try{
      const response = await fetch(`${API}/atividade/?limit=3`,{
        credentials: 'include'
      })
      const data = await response.json()

      if (response.ok){
        SetActivities(data)
      }

      else{
        console.error(data.detail)
      }
    }

    catch{
      console.error("Erro ao buscar os dados das Atividades!!")
    }
    }

    const fetchDashboard = async () => {
      try{
        const response = await fetch(`${API}/atividade/dashboard/`,{
          credentials: 'include'
        })
        const data = await response.json()
  
        if (response.ok){
          setAlunos(data.alunos)
          setAulas(data.aulas)
          setInstrutores(data.instrutores)
          setPlanos(data.planos)
        }
  
        else{
          console.error(data.detail)
        }
      }
  
      catch{
        console.error("Erro ao buscar os dados das Atividades!!")
      }
    }

    const fetchActivityChart = async () => {
      try{
        const response = await fetch(`${API}/atividade/chart/`,{
          method: 'GET',
          credentials: 'include'
        })
        const data = await response.json()
  
        if (response.ok){
          setChartData(data)
        }
  
        else{
          console.error(data.detail)
        }
      }
  
      catch{
        console.error("Erro ao buscar os dados das Atividades!!")
      }
    }

    fetchActivityChart()
    fetchDashboard()
    fetchActivity()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-6 space-y-6 flex-1">
        <DashboardCards alunos={alunos} instrutores={instrutores} aulas={aulas} planos={planos}/>

        <div className="flex space-x-6">
          <div className="flex-1"> 
            <ActivityChart chartData = {chartData}/>
          </div>

          <div className="flex-1 flex flex-col justify-between ">
            <QuickActions />
            
            <RecentActivities activities = {activities}
             />
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default Home;
