'use client'

import Dropdown from "@/components/DropDown"
import DropdownContainer from "../DropdownContainer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";
//@ts-ignore
import Cookies from 'js-cookie';

export const Header = () => {
  const router = useRouter()

  const handleLogout = async(e:MouseEvent) => {
    e.preventDefault()
    try{
    const response = await fetch('http://127.0.0.1:8000/logout/',{
      method: 'POST',
      credentials: 'include'
    })

    const data = await response.json()

    if (response.ok){
      router.push('/login/')
    }

    else{
      console.error(data.detail)
    }
  
  }

    catch{
      console.error('Erro ao realizar a requisição!!!')
    }
  }

  return (
    <>
    <header className="bg-white fixed top-0 left-0 right-0 z-10">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Academia</span>
            <img
              className="h-8 w-auto"
              src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
              alt="Logo"
            />
          </Link>
        </div>

        <div className="hidden lg:flex lg:gap-x-12">
          <DropdownContainer />
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a onClick={(e) => handleLogout(e)} className="text-sm/6 font-semibold text-gray-900 cursor-pointer">
            Sair
          </a>
        </div>
      </nav>
    </header>

    <div className="p-8"></div>
    
    </>
  );
};
