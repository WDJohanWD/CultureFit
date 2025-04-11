import { useState, useContext } from "react"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../AuthContext"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

function Login() {
  const { t } = useTranslation("login")
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)

  async function checkUser() {
    try {
      const success = await login(email, password)
      if (success) {
        navigate("/")
      }
    } catch {
      setError(t("error"))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    checkUser()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat -z-10">
      <Card className="w-full max-w-md p-6 space-y-6 bg-white shadow-md">
        <CardHeader className="p-0 space-y-1">
          <CardTitle className="text-2xl font-bold text-center">{t("title")}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <form onSubmit={handleSubmit} className="space-y-4">
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
          <p className="text-center">
            {t("account")}
            <Link to="/signup" className="px-2 underline font-semibold">
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
    </div>
  )
}

export default Login
