import React from 'react';
import Link from 'next/link';
import { formatDate } from '@/utils/formatações';

interface Aluno {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface Assinatura {
  id: number;
  aluno: Aluno;
  data_assinatura: string;
  vencimento: string;
  total: number;
}

interface AssinaturasProps {
  data: Assinatura[];
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const Assinaturas: React.FC<AssinaturasProps> = ({ data, searchTerm, setSearchTerm }) => {
  const filteredAssinaturas = data.filter((assinatura) =>
    `${assinatura.aluno.first_name} ${assinatura.aluno.last_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto my-10 p-8 bg-white shadow-lg rounded-3xl border border-gray-200">
      <h2 className="text-3xl font-bold text-blue-600 text-center mb-6">Assinaturas Ativas</h2>

      <input
        type="text"
        placeholder="Buscar aluno..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {filteredAssinaturas.length > 0 ? (
        <ul className="space-y-4">
          {filteredAssinaturas.map((assinatura) => (
            <li
              key={assinatura.id}
              className="p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              <p className="text-xl font-semibold text-blue-700">
                <Link href={`/alunos/${assinatura.aluno.id}`}>
                  {assinatura.aluno.first_name} {assinatura.aluno.last_name}
                </Link>
              </p>
              <p className="text-gray-600 mt-2">
                <strong>ID:</strong> {assinatura.aluno.id}
              </p>
              <p className="text-gray-600 mt-1">
                <strong>Email:</strong> {assinatura.aluno.email}
              </p>
              <p className="text-gray-600 mt-1">
                <strong>Data de Assinatura:</strong> {formatDate(assinatura.data_assinatura)}
              </p>
              <p className="text-gray-600 mt-1">
                <strong>Vencimento:</strong> {formatDate(assinatura.vencimento)}
              </p>
              <p className="text-gray-600 mt-1">
                <strong>Total:</strong> {assinatura.total} <span className="text-gray-500">BRL</span>
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 text-center">Nenhuma assinatura encontrada.</p>
      )}
    </div>
  );
};

export default Assinaturas;
