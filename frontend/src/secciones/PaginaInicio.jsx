import { useTranslation } from "react-i18next";

function PaginaInicio() {
  const { t } = useTranslation();  

  return (
    <div>
      <h1>{t("welcome")}</h1>
    </div>
  );
}

export default PaginaInicio;