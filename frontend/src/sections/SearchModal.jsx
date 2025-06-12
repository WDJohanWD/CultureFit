import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

import { motion, AnimatePresence } from "framer-motion";

function SearchModal({ isOpen, onClose }) {
  const { t } = useTranslation("search");
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:9000";

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const fetchUsers = async () => {
        if (query.length > 1) {
          try {
            const res = await fetch(
              `${API_URL}/search/${encodeURIComponent(query)}`
            );

            if (res.ok) {
              // ← Cambiado a res.ok
              const data = await res.json();
              console.log(data);
              setUsers(data);
            } else {
              console.warn("Respuesta inesperada");
              setUsers([]);
            }
          } catch (error) {
            console.error("Error al buscar usuarios:", error);
            setUsers([]);
          }
        } else {
          setUsers([]);
        }
      };

      fetchUsers();

      return () => clearTimeout(delayDebounce);
    }, 600);
  }, [query]); // ← Asegúrate de incluir query como dependencia

  const handleSelect = (username) => {
    navigate(`/profile/${username}`);
    window.location.reload();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="fixed inset-0" onClick={onClose}></div>

          <Card className="w-full max-w-md p-6 space-y-6 bg-white shadow-md z-50">
            <CardHeader className="p-0 space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                {t("search")}
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              <div>
                <input
                  placeholder={`${t("placeholder")}`}
                  type="text"
                  name="query"
                  value={query}
                  className="border rounded-lg w-full px-4 py-2 mb-3"
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className="mx-7">
                <ScrollArea className="h-45 w-full rounded-md p-3 border">
                  {users.length === 0 && (
                    <div className="h-full flex items-center justify-center">
                      <span>{t("not-found")}</span>
                    </div>
                  )}
                  {users.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => handleSelect(user.name)}
                      className="cursor-pointer border rounded-xl px-4 py-2 hover:bg-gray-100 flex items-center"
                    >
                      <Avatar className="h-10 w-10 border-1 border-background shadow-md me-3">
                        <AvatarImage
                          src={`${API_URL}${user.imageUrl}`}
                          alt="Foto de perfil"
                          className="object-cover"
                        />
                        <AvatarFallback className="text-xl bg-primary/10 text-primary">
                          {user.name?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {user.name}
                    </div>
                  ))}
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SearchModal;
