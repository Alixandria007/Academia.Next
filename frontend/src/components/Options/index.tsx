import Option from '../Option';

const Options = () => {
  const API = process.env.NEXT_PUBLIC_API
  const handleLogout = async () => {

    try {
      const response = await fetch(`${API}/logout/`, {
        method: 'POST',
        credentials: 'include',
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error(data.detail);
      }
    } catch {
      console.error('Erro ao realizar a requisição!!!');
    }
  };

    return (
      <>
        <Option
        nome='Alunos'
        url='alunos'
        />

        <Option
        nome='Funcionarios'
        url='funcionarios'
        />
          
        <Option
        nome='Aulas'
        url='aulas'
        />

        <Option
        nome='Planos'
        url='planos'
        />

        <div className="relative inline-block text-left">
          <div
            className="cursor-pointer text-sm font-semibold text-gray-900 flex items-center"
            onClick={() => handleLogout()}
          >
            Sair
          </div>
        </div>
      </>
    );
  };
  
  export default Options;