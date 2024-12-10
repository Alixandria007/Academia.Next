"use client"

import React, { ReactNode, useState } from 'react';
import Dropdown from '../DropDown';
import Link from 'next/link';

const DropdownContainer: React.FC<{}> = () => {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
    const handleToggle = (id: string) => {
      setOpenDropdown(prevId => (prevId === id ? null : id));
    };
  
    return (
      <>
        <Dropdown 
        Texto='Alunos'
        onToggle={handleToggle}
        isOpen = {openDropdown === 'alunos'}
        id='alunos'
        options={[{href: "/alunos/", linkName: "Consultar Alunos"}, {href: "/alunos/cadastrar", linkName: "Cadastrar Alunos"}]}/>

        <Dropdown 
        Texto='Funcionarios'
        onToggle={handleToggle}
        isOpen = {openDropdown === 'funcionarios'}
        id='funcionarios'
        options={[{href: "/funcionarios/", linkName: "Consultar Funcionarios"}, {href: "funcionarios/cadastrar/", linkName: "Cadastrar Funcionarios"}]}/>
          

        <Dropdown 
        Texto='Aulas'
        onToggle={handleToggle}
        isOpen = {openDropdown === 'aulas'}
        id='aulas'
        options={[{href: "#", linkName: "Teste"}]}/>

        <Dropdown 
        Texto='Planos'
        onToggle={handleToggle}
        isOpen = {openDropdown === 'planos'}
        id='planos'
        options={[{href: "#", linkName: "Teste"}]}/>
        
      </>
    );
  };
  
  export default DropdownContainer;