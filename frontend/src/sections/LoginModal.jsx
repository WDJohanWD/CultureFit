import { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEyeSlash, FaRegEye } from "react-icons/fa";

function LoginModal({ isOpen, onClose }) {
  const { t } = useTranslation("login");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  async function checkUser() {
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
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    checkUser();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
                {t("title")}
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    {t("email")}
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    {t("pass")}
                  </Label>
                  <div className="flex">
                    <Input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full"
                    />
                    <div id="eye-icon" onClick={togglePasswordVisibility} className="-ml-8 mt-2">
                    {showPassword ? <FaRegEye className="text-xl"/> : <FaEyeSlash className="text-xl"/>}
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit"
                  className="w-full mt-6 text-white bg-gradient-to-r from-orange-400 to-orange-600 
                hover:shadow-lg hover:shadow-orange-500/50 font-semibold rounded-lg text-lg py-2.5 select-none"
                >
                  {t("title")}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="p-0 flex flex-col items-center">
              <p className="text-center">
                {t("account")}
                <Link
                  to="/signup"
                  className="px-2 underline font-semibold"
                  onClick={onClose}
                >
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
    </AnimatePresence>
  );
}

export default LoginModal;
