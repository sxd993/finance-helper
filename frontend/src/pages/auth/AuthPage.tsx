import { useState } from 'react';
import { Logo } from '@/shared/ui/Logo';

import { Login } from '@features/auth';
import { Register } from '@widgets/register';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex flex-col gap-10 items-center justify-center bg-gray-50">
      <Logo />
      <div className="max-w-md w-[95%] bg-white rounded-xl shadow-md p-4">
        {isLogin ? (
          <Login
            onSwitchToRegister={() => setIsLogin(false)}
          />
        ) : (
          <Register
            onSwitchToLogin={() => setIsLogin(true)}
          />
        )}
      </div>
    </div>
  );
};
