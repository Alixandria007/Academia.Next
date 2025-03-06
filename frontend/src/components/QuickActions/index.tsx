import React from 'react';

const QuickActions = () => {
  const actions = [
    { label: 'Cadastrar Aluno', href: '/alunos/cadastrar' },
    { label: 'Registrar Aula', href: '/aulas/cadastrar' },
    { label: 'Cadastrar Funcionarios', href: '/funcionarios/cadastrar' },
    { label: 'Configurar Planos', href: '/planos/cadastrar' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {actions.map(action => (
        <a key={action.label} href={action.href} className="bg-indigo-600 text-white text-center p-3 rounded-md hover:bg-indigo-700">
          {action.label}
        </a>
      ))}
    </div>
  );
};

export default QuickActions;
