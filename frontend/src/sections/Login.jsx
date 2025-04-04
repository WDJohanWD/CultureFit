import { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from "../AuthContext.jsx";


function Login() {
    const { t } = useTranslation("login")
    const navigate = useNavigate()
    const { login } = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    async function checkUser() {
        try {
            const success = await login(email, password)
            if (success) {
                navigate('/');
            }
        } catch {
            document.getElementById('error').innerHTML = `<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline">${t("error")}</span>
        </div>`;
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        checkUser()
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat -z-10">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-md ">
                <h2 className="text-2xl font-bold text-center">{t("title")}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
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
                    <button type='submit'
                        className="text-white bg-gradient-to-r from-light-primary to-primary 
                            transition hover:ring-6 hover:outline-none hover:ring-orange-300 shadow-lg 
                            shadow-red-500/50 dark:shadow-lg font-semibold rounded-lg cursor-pointer
                            text-lg px-5 py-2.5 text-center me-2 mb-2 mt-2 w-full">
                        {t("title")}
                    </button> <br />
                    <div className="my-8 mx-auto text-center">
                        <p>{t("account")}<Link to="/signup" className="px-2 underline font-semibold">{t("signup")}</Link></p>
                    </div>
                </form>
                <span id="error"></span>
            </div>
        </div>
    );
};

export default Login;