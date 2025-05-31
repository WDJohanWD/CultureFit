import { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import {
  Card, CardContent, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Alert, AlertDescription, AlertTitle,
} from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEyeSlash, FaRegEye } from "react-icons/fa";
import PasswordResetSentModal from "./PasswordResetSentModal";

function LoginModal({ isOpen, onClose }) {
  const { t } = useTranslation("login");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [isPasswordResetSent, setIsPasswordResetSent] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await login(email, password);
      if (success) {
        setError(null);
        navigate("/");
        onClose();
      } else {
        setError(t("invalid_credentials") || "Las credenciales introducidas son incorrectas.");
      }
    } catch {
      setError(t("error"));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="login-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm isolate"
        >
          <div className="absolute inset-0" onClick={onClose} />

          <Card
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md p-6 space-y-6 bg-white shadow-lg z-50 rounded-xl"
          >
            <CardHeader className="p-0 space-y-1">
              <CardTitle className="text-2xl font-bold text-center">{t("title")}</CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{t("pass")}</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pr-10"
                    />
                    <div
                      onClick={togglePasswordVisibility}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
                    >
                      {showPassword ? <FaRegEye className="text-xl" /> : <FaEyeSlash className="text-xl" />}
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="link"
                    className="justify-end w-full px-0"
                    onClick={() => setIsPasswordResetSent(true)}
                  >
                    <p className="text-end text-xs">{t("forgot_password")}</p>
                  </Button>
                </div>

                <Button
                  type="submit"
                  className="w-full mt-6 text-white bg-gradient-to-r from-orange-400 to-orange-600 
                  hover:shadow-lg hover:shadow-orange-500/50 font-semibold rounded-lg text-lg py-2.5"
                >
                  {t("title")}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="p-0 flex flex-col items-center">
              <p className="text-center text-sm">
                {t("account")}
                <Link to="/signup" className="px-2 underline font-semibold" onClick={onClose}>
                  {t("signup")}
                </Link>
              </p>

              {error && (
                <Alert variant="destructive" className="mt-4 w-full">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error!</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardFooter>
          </Card>
        </motion.div>
      )}

      <AnimatePresence>
        {isPasswordResetSent && (
          <PasswordResetSentModal
            key="reset-modal"
            isOpen={isPasswordResetSent}
            onClose={() => setIsPasswordResetSent(false)}
          />
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}

export default LoginModal;
