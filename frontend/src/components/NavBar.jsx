import { useState, useContext } from "react";
import { LANGUAGES } from "../translations";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../AuthContext";
import { Link } from "react-router-dom";

function NavBar() {
  // Seleccionar el NameSpace que estamos utilizando
  const { i18n, t } = useTranslation("navbar");
  const [lng, setLng] = useState(i18n.language)

  const { user, logout } = useContext(AuthContext);

  //Cambiar el idioma de la pagina web
  const onChangeLang = (e) => {
    const lang_code = e.target.value;
    i18n.changeLanguage(lang_code);
    setLng(lang_code);
  };

  return (
    <nav className="bg-primary sticky shadow-lg relative z-50 py-4 px-4 top-0 text-white montserrat font-medium">
      <div className="flex justify-between align-middle">
        <div className="flex items-center">
          <Link to="/">
            <div className="flex items-center">
              <img src="/CultureFitLogoBlanco(2).webp" alt="" className="h-12 w-16 me-2" />
              <h2 className="text-4xl montserrat font-semibold">CultureFit</h2>
            </div>
          </Link>
          <Link className="pt-1 ms-9 hover:underline">{t("clases")}</Link>
          <Link className="pt-1 ms-6 hover:underline">{t("videos")}</Link>
          <Link to="/memberships" className="pt-1 ms-6 hover:underline">{t("planes")}</Link>
          <Link to="/aboutus" className="pt-1 ms-6 hover:underline">{t("about")}</Link>
        </div>
        <div className="flex items-center">
          {user ? (
            <span>{user.username}</span>
          ) : (
            <div>
              <Link to="/login">
                <button className="text-white bg-light-primary transition hover:ring-3 hover:outline-none hover:ring-orange-400 shadow-lg 
                                      shadow-red-500/50 dark:shadow-lg font-semibold rounded-lg cursor-pointer
                                      text-lg px-5 py-2.5 text-center me-4 mb-2 mt-2">
                  {t("login")}
                </button>
              </Link>
              <Link to="/signup">
                <button className="text-white bg-light-primary transition hover:ring-3 hover:outline-none hover:ring-orange-400 shadow-lg 
                                      shadow-red-500/50 dark:shadow-lg font-semibold rounded-lg cursor-pointer
                                      text-lg px-5 py-2.5 text-center me-2 mb-2 mt-2">
                  {t("signup")}
                </button>
              </Link>
            </div>

          )}


          <label htmlFor="language"></label>
          <select id="language" defaultValue={lng} onChange={onChangeLang} style={{ cursor: "pointer", appearance: "none" }} className="ms-4">
            {LANGUAGES.map(({ code, label }) => (
              <option key={code} value={code} className="text-black">
                {label}
              </option>
            ))}
          </select>

        </div>

      </div>

    </nav>
  );
}

export default NavBar;
