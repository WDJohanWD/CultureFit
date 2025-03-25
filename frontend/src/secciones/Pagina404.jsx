import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, AlertCircle } from "lucide-react"
import {useState, useEffect} from "react";


function Pagina404() {
    const { t } = useTranslation("404")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-primary/70 to-slate-900 flex items-center justify-center p-4 -mt-20">
      <div
        className={`relative bg-black/20 backdrop-blur-lg rounded-xl p-8 md:p-12 shadow-2xl max-w-lg w-full border border-white/10 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-primary rounded-full p-5 shadow-lg shadow-primary/30">
          <AlertCircle size={40} className="text-primary-foreground" />
        </div>

        <div className="text-center mt-6">
          <h2 className="text-7xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary/70 to-primary mb-4">
            404
          </h2>

          <h4 className="text-xl md:text-2xl font-semibold text-white mb-3">{t("h4")}</h4>

          <p className="text-gray-300 mb-8">{t("p")}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="group flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 text-white rounded-lg px-6 py-3 transition-all duration-300 border border-primary/20 hover:border-primary/40"
            >
              <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
              {t("button")}
            </Link>
          </div>
        </div>

        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-radial from-primary/10 to-transparent"></div>
        <div className="absolute -z-10 top-0 left-0 w-full h-full overflow-hidden rounded-xl">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/10 to-transparent rotate-12 animate-pulse"></div>
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-primary/10 to-transparent -rotate-12 animate-pulse"></div>
        </div>
      </div>
    </div>
    )
}

export default Pagina404;