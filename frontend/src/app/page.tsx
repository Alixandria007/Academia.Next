import ActivityChart from '@/components/ActivityCard';
import DashboardCards from '@/components/DashboardCards';
import { Header } from '@/components/Header';
import QuickActions from '@/components/QuickActions';
import RecentActivities from '@/components/RecentActivities';
import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-6 space-y-6 flex-1">
        <DashboardCards />

        <div className="flex space-x-6">
          <div className="flex-1"> {/* Cada item vai ocupar metade do espaço */}
            <ActivityChart />
          </div>

          <div className="flex-1 flex flex-col justify-between "> {/* O outro item também ocupa metade do espaço */}
            <QuickActions />
            
            <RecentActivities />
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default Home;
