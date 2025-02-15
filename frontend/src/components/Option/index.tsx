import Link from 'next/link';
import React, { Children, ReactNode } from 'react';

interface OptionProp {
  nome: string;
  url: string
}

const Option: React.FC<OptionProp> = ({nome, url}) => {
  const base_pathname = process.env.NEXT_PUBLIC_FRONTEND_URL

  return (
    <div className="relative inline-block text-left">
      <Link
        href={`${base_pathname}/${url}`}
        className="cursor-pointer text-sm font-semibold text-gray-900 flex items-center"
      >
        {nome}
      </Link>
    </div>
  );
};

export default Option;
