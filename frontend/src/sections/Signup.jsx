import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

function Signup() {
  const { t } = useTranslation("signup")
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [dni, setDni] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [passwordRepeat, setPasswordRepeat] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [error, setError] = useState(null)

  const validatePassword = (password) => {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/
    if (!passwordPattern.test(password)) {
      return t("passError")
    }
    return null
  }

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailPattern.test(email)) {
      return t("emailError")
    }
    return null
  }

  async function checkUser() {
    // ↓↓↓ Comprobar si el usuario existe ↓↓↓

    // if (userExists) {
    //    setError(t("userExists"))
    //} else {
    const newUser = {
      name,
      password,
      email,
      birthDate,
      dni,
    }

    const response = await fetch("http://localhost:9000/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    })

    sendVerificationEmail(email)
    navigate("/")
    //}
  }

  // Comprobaciones de email, contraseña y que las contraseñas sean iguales
  const handleSubmit = (e) => {
    e.preventDefault()
    const passwordError = validatePassword(password)
    const emailError = validateEmail(email)

    if (password !== passwordRepeat) {
      setError(t("passwordMatch"))
    } else if (passwordError) {
      setError(passwordError)
      return
    } else if (emailError) {
      setError(emailError)
      return
    } else {
      setError(null)
      checkUser()
    }
  }

  // Enviar el email de verificación
  const sendVerificationEmail = async (email) => {
    try {
      const response = await fetch("http://localhost:9000/verification-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: email,
      })

      if (!response.ok) {
        throw new Error("Error al enviar el email")
      }

      const data = await response.json()
      console.log("Respuesta:", data)
      return data
    } catch (error) {
      console.error("Error:", error)
      throw error
    }
  }

  return (
    <div className="flex flex-col mx-10 my-10 sm:mx-10 md:mx-10 lg-mx-20 xl:mx-20 overflow-hidden bg-cover bg-center bg-no-repeat -z-10">
          <h2 className="text-2xl font-bold mb-5">{t("title")}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                {t("username")}
              </Label>
              <Input
                type="text"
                id="username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
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
              <Label htmlFor="dni" className="text-sm font-medium text-gray-700">
                {t("dni")}
              </Label>
              <Input
                type="text"
                id="dni"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                {t("pass")}
              </Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passwordRepeat" className="text-sm font-medium text-gray-700">
                {t("repeatPass")}
              </Label>
              <Input
                type="password"
                id="passwordRepeat"
                value={passwordRepeat}
                onChange={(e) => setPasswordRepeat(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium text-gray-700">
                {t("birthDate")}
              </Label>
              <Input
                type="date"
                id="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-6 text-white bg-gradient-to-r from-orange-400 to-orange-600 
                hover:shadow-lg hover:shadow-orange-500/50 font-semibold rounded-lg text-lg py-2.5"
            >
              {t("btn")}
            </Button>
          </form>

          <p className="text-center">
            {t("account")}
            <Link to="/login" className="px-2 underline font-semibold">
              {t("login")}
            </Link>
          </p>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error!</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
    </div>
  )
}

export default Signup
