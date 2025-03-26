import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
    const { t } = useTranslation("error");

    return (
        <div className="flex flex-col items-center justify-center text-center">
            <div className="absolute top-1/2 -translate-y-1/2">
                <h1 className="text-9xl font-bold montserrat text-primary">404</h1>
                <p className="text-lg mt-6">{t("lost")}</p>
                <Link to="/">
                    <button className="text-white bg-gradient-to-r from-light-primary to-primary 
                            transition hover:ring-6 hover:outline-none hover:ring-orange-300 shadow-lg 
                            shadow-red-500/50 dark:shadow-lg font-semibold rounded-lg cursor-pointer
                            text-lg px-5 py-2.5 text-center mb-2 mt-2">
                        {t("home")}
                    </button>
                </Link>
            </div>

        </div>
    );
}
