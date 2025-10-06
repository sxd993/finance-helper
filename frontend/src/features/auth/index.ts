// API
export { AuthApi } from './api/AuthApi';

// Хуки
export { useLoginForm } from "./model/hooks/useLoginForm";
export { useRegisterForm } from "./model/hooks/useRegisterForm";
export { useLogout } from "./model/hooks/useLogout";

// Типы
export type {
    RegisterFormData,
    LoginFormData,
    RegisterStep,
} from './model/types/auth.types';

// UI
export { Login } from './ui/Login';
export { Register } from './ui/Register'

