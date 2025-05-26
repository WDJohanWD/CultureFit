import { useState, useContext, useEffect, useRef } from "react";
import { LANGUAGES } from "../translations";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../AuthContext";
import { Link } from "react-router-dom";
import { LuChevronDown } from "react-icons/lu";
import { FaBars } from "react-icons/fa";
import { useClickOutside } from "@/hooks/useClickOutside";
import LoginModal from "../sections/LoginModal";
import SearchModal from "../sections/SearchModal";
import Profile from "../assets/login.svg";

import { UserRoundSearch } from "lucide-react";

function NavBar() {
  // Seleccionar el NameSpace que estamos utilizando
  const { i18n, t } = useTranslation("navbar");
  const [lng, setLng] = useState(i18n.language);

  const { user, logout, isAdmin } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navbarRef = useRef(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  //Cambiar el idioma de la pagina web
  const onChangeLang = (e) => {
    const lang_code = e.target.value;
    i18n.changeLanguage(lang_code);
    setLng(lang_code);
  };


  useClickOutside(navbarRef, () => {
    if (menuOpen) setMenuOpen(false);
  });

  return (
    <nav
      className="bg-primary sticky shadow-lg z-50 py-4 px-4 top-0 text-white montserrat font-medium"
      ref={navbarRef}
    >
      <div className="flex justify-between align-middle">
        <div className="flex items-center">
          <Link to="/">
            <div className="flex items-center">
              <img
                src="/CultureFitLogoBlanco(2).webp"
                alt=""
                className="h-12 w-16 me-2"
              />
              <h2 className="text-4xl montserrat font-semibold">CultureFit</h2>
            </div>
          </Link>
          <div className="hidden lg:flex ms-9 gap-x-6">
            <Link to="/memberships" className="pt-1 hover:underline">
              {t("planes")}
            </Link>
            <Link to="/aboutus" className="pt-1 hover:underline">
              {t("about")}
            </Link>
            <Link className="pt-1 hover:underline">{t("clases")}</Link>
            {user ? (
              <Link to="/appointment" className="pt-1 hover:underline">
                {t("appointment")}
              </Link>
            ) : (
              <></>
            )}

            {isAdmin && (
              <Link to="/admin" className="pt-1 hover:underline">
                Admin
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center">
          <button
            className="lg:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <FaBars className="text-white text-2xl" />
          </button>
        </div>

        <div
          className={`
                          lg:hidden 
                          absolute top-20 left-0 w-full bg-primary 
                          overflow-hidden
                          transition-all duration-300 ease-in-out 
                          ${
                            menuOpen
                              ? "max-h-[500px] opacity-100 py-4"
                              : "max-h-0 opacity-0 py-0"
                          }
                          text-center
                        `}
        >
          <div className="flex flex-col gap-y-2">
            <Link className="block hover:underline" to="/">
              {t("clases")}
            </Link>
            <Link to="/memberships" className="block hover:underline">
              {t("planes")}
            </Link>
            <Link to="/aboutus" className="block hover:underline">
              {t("about")}
            </Link>
            {user ? (
              <Link to="/appointment" className="pt-1 hover:underline">
                {t("appointment")}
              </Link>
            ) : (
              <></>
            )}
            {isAdmin && (
              <Link to="/admin" className="block hover:underline">
                Admin
              </Link>
            )}
          </div>

          <div className="items-center align-middle text-center">
            {user ? (
              <div className="mt-8 flex items-center flex-col">
                <button
                  className="text-white cursor-pointer flex gap-x-3 bg-light-primary px-3 py-2 rounded-lg"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <UserRoundSearch />
                </button>
                <div className="flex flex-row items-center justify-center my-4 gap-x-5">
                  <div className="flex flex-col">
                    <Link
                      to="/profile"
                      className="flex flex-col items-center pt-1 hover:underline"
                    >
                      <img src={Profile} alt="Profile" className="h-9 w-12" />
                      <span className="text-sm">{user.name}</span>
                    </Link>
                  </div>
                </div>
              </div>
            ) : null}
            {user ? (
              <></>
            ) : (
              <div>
                <button
                  className="text-white bg-light-primary transition hover:ring-3 hover:outline-none hover:ring-orange-400 shadow-lg 
                                      shadow-red-500/50 dark:shadow-lg font-semibold rounded-lg cursor-pointer
                                      text-lg px-5 py-2.5 text-center me-4 mb-2 mt-2"
                  onClick={() => setIsLoginOpen(true)}
                >
                  {t("login")}
                </button>
                <Link to="/signup">
                  <button
                    className="text-white bg-light-primary transition hover:ring-3 hover:outline-none hover:ring-orange-400 shadow-lg 
                                      shadow-red-500/50 dark:shadow-lg font-semibold rounded-lg cursor-pointer
                                      text-lg px-5 py-2.5 text-center me-2 mb-2 mt-2"
                  >
                    {t("signup")}
                  </button>
                </Link>
              </div>
            )}

            <div className="flex items-center align-middle justify-center md:my-1">
              <label htmlFor="language"></label>
              <select
                id="language"
                defaultValue={lng}
                onChange={onChangeLang}
                style={{ cursor: "pointer", appearance: "none" }}
                className="ms-4 pe-4"
              >
                {LANGUAGES.map(({ code, label }) => (
                  <option key={code} value={code} className="text-black">
                    {label}
                  </option>
                ))}
              </select>
              <LuChevronDown className="-ms-4" />
            </div>
          </div>
        </div>

        <div className="items-center hidden lg:flex">
          {user ? (
            <>
              <button
                className="text-white cursor-pointer flex gap-x-3 bg-light-primary px-3 py-2 rounded-lg me-6"
                onClick={() => setIsSearchOpen(true)}
              >
                <UserRoundSearch />
              </button> 
              <div className="flex flex-col items-center me-2">
                <Link
                  to="/profile"
                  className="flex flex-col pt-1 items-center hover:underline"
                >
                  {" "}
                  <img src={Profile} alt="Profile" className="h-9 w-12" />{" "}
                  <span className="text-sm">{user.name}</span>
                </Link>
              </div>
            </>
          ) : (
            <div>
              <button
                className="text-white bg-light-primary transition hover:ring-3 hover:outline-none hover:ring-orange-400 shadow-lg 
                                      shadow-red-500/50 dark:shadow-lg font-semibold rounded-lg cursor-pointer
                                      text-lg px-5 py-2.5 text-center me-4 mb-2 mt-2"
                onClick={() => setIsLoginOpen(true)}
              >
                {t("login")}
              </button>
              <Link to="/signup">
                <button
                  className="text-white bg-light-primary transition hover:ring-3 hover:outline-none hover:ring-orange-400 shadow-lg 
                                      shadow-red-500/50 dark:shadow-lg font-semibold rounded-lg cursor-pointer
                                      text-lg px-5 py-2.5 text-center me-2 mb-2 mt-2"
                >
                  {t("signup")}
                </button>
              </Link>
            </div>
          )}

          <label htmlFor="language"></label>
          <select
            id="language"
            defaultValue={lng}
            onChange={onChangeLang}
            style={{ cursor: "pointer", appearance: "none" }}
            className="ms-4 pe-4"
          >
            {LANGUAGES.map(({ code, label }) => (
              <option key={code} value={code} className="text-black">
                {label}
              </option>
            ))}
          </select>
          <LuChevronDown className="-ml-4" />
        </div>

        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
        />
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
        />
      </div>
    </nav>
  );
}

export default NavBar;
