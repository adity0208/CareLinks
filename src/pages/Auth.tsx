import { useState } from 'react';
import LoginForm from '../components/Auth/LoginForm';
import RegisterForm from '../components/Auth/RegisterForm';

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);

    const toggleMode = () => {
        setIsLogin(!isLogin);
    };

    return isLogin ? (
        <LoginForm onToggleMode={toggleMode} />
    ) : (
        <RegisterForm onToggleMode={toggleMode} />
    );
}