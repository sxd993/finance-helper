import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin, useRegister } from '../features/auth/hooks/useAuth';
import { Login } from '../features/auth/components/Login';
import { Register } from '../features/auth/components/Register';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const handleLogin = async (data: { login: string; password: string }) => {
    try {
      await loginMutation.mutateAsync(data);
      navigate('/home');
    } catch (error) {
      console.error('Ошибка входа:', error);
    }
  };

  const handleRegister = async (data: { login: string; name: string; password: string }) => {
    try {
      await registerMutation.mutateAsync(data);
      navigate('/home');
    } catch (error) {
      console.error('Ошибка регистрации:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        {isLogin ? (
          <Login
            onSubmit={handleLogin}
            isLoading={loginMutation.isPending}
            error={loginMutation.error}
            onSwitchToRegister={() => setIsLogin(false)}
          />
        ) : (
          <Register
            onSubmit={handleRegister}
            isLoading={registerMutation.isPending}
            error={registerMutation.error}
            onSwitchToLogin={() => setIsLogin(true)}
          />
        )}
      </div>
    </div>
  );
};