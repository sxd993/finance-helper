import { useNavigate } from 'react-router-dom';

import { Login } from '@features/auth/ui/Login';
import { Register } from '@features/auth/ui/Register';

interface AuthFormProps {
    mode: 'login' | 'register';
}

export const AuthForm = ({ mode }: AuthFormProps) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col gap-10 items-center justify-center bg-gray-50">
            <div className={`${mode === 'register' ? 'max-w-2xl' : 'max-w-md'} w-[95%] bg-white rounded-xl shadow-md p-4`}>
                {mode === 'login' ? (
                    <Login
                        onSwitchToRegister={() => navigate('/register')}
                    />
                ) : (
                    <Register
                        onSwitchToLogin={() => navigate('/login')}
                    />
                )}
            </div>
        </div>
    )

}
