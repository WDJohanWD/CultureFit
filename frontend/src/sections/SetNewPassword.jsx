import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";

function SetNewPassword() {
  const { t } = useTranslation("login");
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    if (typeof token === "string" && token.trim() !== "") {
      try {
        const decoded = jwtDecode(token);
        setEmail(decoded.email);
      } catch (err) {
        console.error("Token inválido:", err);
        setError("El enlace de restablecimiento no es válido o ha expirado.");
      }
    } else {
      setError("Token no proporcionado o mal formado.");
    }
  }, [token]);

  useEffect(() => {
    setError(null);
  }, [password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:9000/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      if (response.ok) {
        navigate("/");
      } else {
        const data = await response.json();
        setError(data.message || "Error al cambiar la contraseña.");
      }
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error en el servidor.");
    }
  };

  if (error && !email) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Card className="max-w-md w-full p-6">
          <CardHeader>
            <CardTitle className="text-center text-red-600">{t("error")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-700">{error}</p>
            <div className="mt-6 text-center">
              <Button onClick={() => navigate("/")} className="w-full">
                {t("back_to_home")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="max-w-md w-full p-6 space-y-6">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-bold">
            {t("set_new_password")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password">{t("new_password")}</label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword">{t("confirm_password")}</label>
              <Input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-sm text-red-600 text-center">{error}</p>}

            <Button type="submit" className="w-full">
              {t("change_password")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default SetNewPassword;
