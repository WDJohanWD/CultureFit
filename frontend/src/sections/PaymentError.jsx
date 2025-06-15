import React from 'react';
import { Link } from 'react-router-dom';
import {  FaCircleXmark } from "react-icons/fa6";
import { useTranslation } from 'react-i18next';

function PaymentSuccess() {
    const { t } = useTranslation("payment");
    return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-green-50">
        <FaCircleXmark className="text-red-500" size={78} />
        <h2 className="pt-3">{t("errorTitle")}</h2>
        <p className="text-gray-800 mt-2">{t("errorDescription")}</p>
        <Link to="/"
            className="text-white bg-gradient-to-r from-light-primary to-primary 
                            transition hover:ring-6 hover:outline-none hover:ring-orange-300 shadow-lg 
                            shadow-red-500/50 dark:shadow-lg font-semibold rounded-lg cursor-pointer
                            text-lg px-5 py-2.5 text-center mb-2 mt-2"
        >
            {t("home")}
        </Link>
    </div>
)};

export default PaymentSuccess;