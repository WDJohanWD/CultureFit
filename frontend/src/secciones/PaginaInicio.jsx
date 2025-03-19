import { useTranslation } from "react-i18next";

function PaginaInicio() {
  const { t } = useTranslation("inicio")

  return (
    <div className="">
      <h2>{t("welcome")}</h2>
    </div>
  )
}
export default PaginaInicio;