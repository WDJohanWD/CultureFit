import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MailCheck } from "lucide-react";

function PasswordResetSentModal({ isOpen, onClose }) {
  const { t } = useTranslation("login");

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
            <CardHeader className="p-0 space-y-2 text-center">
              <CardTitle className="text-2xl font-bold">
                {t("reset_sent_title") || "Correo enviado"}
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0 flex flex-col items-center justify-center text-center space-y-4">
              <MailCheck className="w-16 h-16 text-orange-500" />
              <p className="text-gray-700 text-base">
                {t("reset_sent_msg") ||
                  "Hemos enviado un correo con instrucciones para cambiar tu contraseña. Por favor, revisa tu bandeja de entrada (y la carpeta de spam)."}
              </p>
            </CardContent>

            <CardFooter className="p-0">
              <Button
                onClick={onClose}
                className="w-full mt-6 text-white bg-gradient-to-r from-orange-400 to-orange-600 
                hover:shadow-lg hover:shadow-orange-500/50 font-semibold rounded-lg text-lg py-2.5 select-none"
              >
                {t("close") || "Cerrar"}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PasswordResetSentModal;
