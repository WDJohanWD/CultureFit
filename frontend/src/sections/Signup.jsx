import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

function Signup(){
    const { t } = useTranslation("signup"); 

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');

    const validatePassword = (password) => {
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordPattern.test(password)) {
            return t("passError");
        }
        return null;
    };

    const validateEmail = (email) => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email)) {
            return t("emailError")
        }
        return null;
    }

    async function checkUser() {    
        // ↓↓↓ Comprobar si el usuario existe ↓↓↓
         
        if (userExists) {
            document.getElementById('error').innerHTML = `<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong class="font-bold">Error!</strong>
                        <span class="block sm:inline">${t("userExists")}</span>
                    </div>`;
        } else {
            // ↓↓↓ Crear el nuevo usuario ↓↓↓
            
        }
    }

    // Comprobaciones de email, contraseña y que las contraseñas sean iguales
    const handleSubmit = (e) => {
        
        e.preventDefault();
        const passwordError = validatePassword(password);
        const emailError = validateEmail(email);
        const passwordMatch = t("passwordMatch");
        if (password !== passwordRepeat) {
            document.getElementById('error').innerHTML = `<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong class="font-bold">Error!</strong>
                        <span class="block sm:inline">${passwordMatch}</span>
                    </div>`;
        } else if (passwordError) {
            document.getElementById('error').innerHTML = `<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong class="font-bold">Error!</strong>
                    <span class="block sm:inline">${passwordError}</span>
                </div>`;
            return;
        } else if (emailError) {
            document.getElementById('error').innerHTML = `<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline">${emailError}</span>
                    </div>`;
            return;
        } else {
            checkUser();
        };
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat -z-10">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-md ">
                <h2 className="text-2xl font-bold text-center">{t("title")}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="my-8">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            {t("username")}
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                        />
                    </div>
                    <div className="my-8">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        {t("email")}
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                        />
                    </div>

                    <div className="my-8">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        {t("pass")}
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                        />
                    </div>

                    <div className="my-8">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        {t("repeatPass")}
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={passwordRepeat}
                            onChange={(e) => setPasswordRepeat(e.target.value)}
                            required
                            className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                        />
                    </div>
                    <button type='submit'
                    className="text-white bg-gradient-to-r from-light-primary to-primary 
                            transition hover:ring-6 hover:outline-none hover:ring-orange-300 shadow-lg 
                            shadow-red-500/50 dark:shadow-lg font-semibold rounded-lg cursor-pointer
                            text-lg px-5 py-2.5 text-center me-2 mb-2 mt-2 w-full">
                        {t("title")}
                    </button>
                    <div className="my-8 mx-auto text-center">
                        <p>{t("account")}<Link to="/login" className="px-2 underline font-semibold">{t("login")}</Link></p>
                    </div>
                </form>
                <div id="error">
                </div>
            </div>
        </div>
    );
};

export default Signup;