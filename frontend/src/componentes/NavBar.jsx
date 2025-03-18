import { LANGUAGES } from "../constants";

function NavBar() {
  const { i18n, t } = useTranslation();

  const onChangeLang = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang_code = e.target.value;
    i18n.changeLanguage(lang_code);
  };

  return (
    <nav className="sticky shadow-lg flex items-center relative z-50 bg-white p-1 top-0">
      <h2>Culture Fit</h2>
      <select defaultValue={"es"}>
        {LANGUAGES.map(({ code, label }) => (
          <option key={code} value={code}>
            {label}
          </option>
        ))}
      </select>
    </nav>
  );
}

export default NavBar;
