'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

interface ConsultarProps<T> {
  data: T[];
  title: string;
  headers: { key: keyof T; label: string; href?: boolean }[];
  placeholder: string;
  filterFunction: (item: T, searchTerm: string) => boolean;
  actions?: (item: T) => JSX.Element;
}

const Consultar = <T,>({
  data,
  title,
  headers,
  placeholder,
  filterFunction,
  actions,
}: ConsultarProps<T>) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState<T[]>(data);

  const pathname = usePathname();

  useEffect(() => {
    const filtered = data.filter((item) => filterFunction(item, searchTerm));
    setFilteredData(filtered);
  }, [searchTerm, data, filterFunction]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-md p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h1>

        <div className="mb-4">
          <input
            type="text"
            placeholder={placeholder}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <table className="w-full border-collapse border border-gray-200 text-left text-sm">
          <thead>
            <tr className="bg-gray-100">
              {headers.map((h, index) => (
                <th key={index} className="p-3 border border-gray-300">
                  {h.label}
                </th>
              ))}
              {actions && <th className="p-3 border border-gray-300">Ações</th>}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {headers.map((header) => (
                  <td
                    key={String(header.key)}
                    className="p-3 border border-gray-300"
                  >
                    {header.href ? (
                      <Link
                        href={`${pathname}/${item[header.key]}`}
                        className="text-blue-500 hover:text-blue-700 transition-colors duration-300"
                      >
                        {typeof item[header.key] === 'boolean' ? (
                          item[header.key] ? (
                            <FiCheckCircle className="text-green-700" />
                          ) : (
                            <FiXCircle className="text-red-500" />
                          )
                        ) : (
                          String(item[header.key])
                        )}
                      </Link>
                    ) : typeof item[header.key] === 'boolean' ? (
                      item[header.key] ? (
                        <FiCheckCircle className="text-green-700" />
                      ) : (
                        <FiXCircle className="text-red-500" />
                      )
                    ) : (
                      String(item[header.key])
                    )}
                  </td>
                ))}
                {actions && (
                  <td className="p-3 border border-gray-300">
                    {actions(item)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <div className="text-center text-gray-600 mt-4">
            Nenhum item encontrado.
          </div>
        )}
      </div>
    </div>
  );
};

export default Consultar;
