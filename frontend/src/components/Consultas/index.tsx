'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { FiCheckCircle, FiXCircle, FiPlus, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface ConsultarProps<T> {
  data: T[];
  title: string;
  headers: { key: keyof T; key2?: keyof T; label: string; href?: boolean; format?: Function }[];
  placeholder: string;
  url_add: string;
  filterFunction: (item: T, searchTerm: string) => boolean;
  actions?: (item: T) => JSX.Element;
}

const Consultar = <T,>({
  data,
  title,
  headers,
  placeholder,
  url_add,
  filterFunction,
  actions,
}: ConsultarProps<T>) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 
  const pathname = usePathname();

  useEffect(() => {
    const filtered = data.filter((item) => filterFunction(item, searchTerm));
    setFilteredData(filtered);
    setCurrentPage(1); 
  }, [searchTerm, data, filterFunction]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            placeholder={placeholder}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Link
            className="p-3 rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:outline-none w-[48px] flex items-center justify-center"
            aria-label="Adicionar novo item"
            href={`${pathname}/${url_add}/`}
          >
            <FiPlus className="text-xl" />
          </Link>
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
            {currentItems.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {headers.map((header) => (
                  <td key={String(header.key)} className="p-3 border border-gray-300">
                    {header.href ? (
                      <Link
                        href={`${pathname}/${item[header.key]}/`}
                        className="text-blue-500 hover:text-blue-700 transition-colors duration-300"
                      >
                        {typeof item[header.key] === 'boolean' ? (
                          item[header.key] ? (
                            <FiCheckCircle className="text-green-700" />
                          ) : (
                            <FiXCircle className="text-red-500" />
                          )
                        ) : (
                          String(
                            header.key2
                              ? header.format
                                ? header.format(`${item[header.key]} ${item[header.key2]}`)
                                : `${item[header.key]} ${item[header.key2]}`
                              : header.format
                              ? header.format(item[header.key])
                              : item[header.key]
                          )
                        )}
                      </Link>
                    ) : typeof item[header.key] === 'boolean' ? (
                      item[header.key] ? (
                        <FiCheckCircle className="text-green-700" />
                      ) : (
                        <FiXCircle className="text-red-500" />
                      )
                    ) : (
                      String(
                        header.key2
                          ? header.format
                            ? header.format(`${item[header.key]} ${item[header.key2]}`)
                            : `${item[header.key]} ${item[header.key2]}`
                          : header.format
                          ? header.format(item[header.key])
                          : item[header.key]
                      )
                    )}
                  </td>
                ))}
                {actions && <td className="p-3 border border-gray-300">{actions(item)}</td>}
              </tr>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <div className="text-center text-gray-600 mt-4">Nenhum item encontrado.</div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              className={`p-2 rounded ${currentPage === 1 ? 'text-gray-400' : 'text-blue-500 hover:text-blue-700'}`}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <FiChevronLeft className="text-xl" />
            </button>

            <span className="text-gray-800">
              Página {currentPage} de {totalPages}
            </span>

            <button
              className={`p-2 rounded ${currentPage === totalPages ? 'text-gray-400' : 'text-blue-500 hover:text-blue-700'}`}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <FiChevronRight className="text-xl" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Consultar;
