import LoginForm from '@/components/LoginForm';

export const metadata = {
  title: 'Login',
  description: 'Faça login para acessar a plataforma.',
};

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
        <LoginForm/>
      </div>
    </div>
  );
};

export default LoginPage;