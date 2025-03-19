import { LANGUAGES } from "../traducciones";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function NavBar() {
  const { i18n, t } = useTranslation("navbar");

  const onChangeLang = (e) => {
    const lang_code = e.target.value;
    i18n.changeLanguage(lang_code);
  };

  const formatOptionLabel = ({ label, flag }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <img src={flag} alt={label} style={{ width: "20px", height: "15px" }} />{" "}

      <span>{label}</span>
    </div>
  );

  return (
    <nav className="bg-[#ff5400] sticky shadow-lg relative z-50 py-4 px-4 top-0 text-white montserrat font-medium">
      <div className="flex justify-between align-middle">
        <div className="flex items-center">
          <h2 className="text-4xl montserrat font-semibold">CultureFit</h2>
          <Link className="pt-1 ms-9">{t("clases")}</Link>
          <Link className="pt-1 ms-6">{t("planes")}</Link>
          <Link className="pt-1 ms-6">{t("about")}</Link>
        </div>
        <div className="flex items-center">
          <select defaultValue={"en"} onChange={onChangeLang} style={{ cursor: "pointer"}}>
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
