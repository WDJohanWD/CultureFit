import { LANGUAGES } from "../traducciones";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function NavBar() {
  // Seleccionar el NameSpace que estamos utilizando
  const { i18n, t } = useTranslation("navbar");

  //Cambiar el idioma de la pagina web
  const onChangeLang = (e) => {
    const lang_code = e.target.value;
    i18n.changeLanguage(lang_code);
  };

  return (
    <nav className="bg-primary sticky shadow-lg relative z-50 py-4 px-4 top-0 text-white montserrat font-medium">
      <div className="flex justify-between align-middle">
        <div className="flex items-center">
          <Link to="/">
            <div className="flex items-center">
              <img src="/CultureFitLogoBlanco.png" alt="" className="h-12 me-2"/>
              <h2 className="text-4xl montserrat font-semibold">CultureFit</h2>
            </div>
          </Link>
          <Link className="pt-1 ms-9 hover:underline">{t("clases")}</Link>
          <Link className="pt-1 ms-6 hover:underline">{t("videos")}</Link>
          <Link to="/memberships" className="pt-1 ms-6 hover:underline">{t("planes")}</Link>
          <Link className="pt-1 ms-6 hover:underline">{t("about")}</Link>
        </div>
        <div className="flex items-center">
          <select defaultValue={"es"} onChange={onChangeLang} style={{ cursor: "pointer"}}>
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
