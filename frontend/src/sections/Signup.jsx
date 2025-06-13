import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog"
import { DialogTitle } from "@radix-ui/react-dialog"

function Signup() {
  const { t } = useTranslation("signup")
  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:9000"
  const [email, setEmail] = useState("")
  const [dni, setDni] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [passwordRepeat, setPasswordRepeat] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [error, setError] = useState(null)
  const [showDialog, setShowDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const validatePassword = (password) => {
    if (password.length < 6 || password.length > 40) {
      return t("passLengthError") || "Password must be between 6 and 40 characters"
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return t("passLowercaseError") || "Password must contain at least one lowercase letter"
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return t("passUppercaseError") || "Password must contain at least one uppercase letter"
    }
    if (!/(?=.*\d)/.test(password)) {
      return t("passNumberError") || "Password must contain at least one number"
    }
    return null
  }

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailPattern.test(email)) {
      return t("emailError") || "Please enter a valid email address"
    }
    return null
  }

  const validateDni = (dni) => {
    if (!dni) return t("dniRequired") || "DNI is required"
    // Basic DNI validation for Spanish format (8 numbers + optional letter)
    const dniPattern = /^[0-9]{8}[a-zA-Z]?$/
    if (!dniPattern.test(dni)) {
      return t("dniError") || "Please enter a valid DNI (8 digits)"
    }
    return null
  }

  const validateBirthDate = (date) => {
    if (!date) return t("birthDateRequired") || "Birth date is required"
    const birthDate = new Date(date)
    const today = new Date()
    const minAgeDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
    
    if (birthDate > minAgeDate) {
      return t("ageError") || "You must be at least 18 years old"
    }
    return null
  }

  async function checkUser() {
    setIsLoading(true)
    setError(null)
    
    const newUser = {
      name,
      password,
      email,
      birthDate,
      dni,
    }

    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        setError(errorData.message || t("defaultError") || "An error occurred during registration")
        return
      }

      await sendVerificationEmail(email)
      setShowDialog(true)
    } catch (err) {
      console.error("Registration error:", err)
      setError(t("defaultError") || "There was an error during registration. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate all fields
    const errors = [
      validateEmail(email),
      validatePassword(password),
      validateDni(dni),
      validateBirthDate(birthDate),
      password !== passwordRepeat ? (t("passwordMatch") || "Passwords do not match") : null
    ].filter(Boolean)

    if (errors.length > 0) {
      setError(errors[0])
      return
    }

    checkUser()
  }

  const sendVerificationEmail = async (email) => {
    try {
      const response = await fetch(`${API_URL}/verification-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error("Error sending verification email")
      }

      return await response.text()
    } catch (error) {
      console.error("Email error:", error)
      throw error
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-6rem)] bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">
            {t("title") || "Create your account"}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">{t("username") || "Full Name"}</Label>
              <Input
                type="text"
                id="username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Johan Aponte"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t("email") || "Email"}</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="example@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dni">{t("Dni") || "DNI/NIE"}</Label>
              <Input
                type="text"
                id="dni"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                required
                placeholder="12345678A"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">{t("birthDate") || "Date of Birth"}</Label>
              <Input
                type="date"
                id="birthDate"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t("pass") || "Password"}</Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passwordRepeat">{t("repeatPass") || "Confirm Password"}</Label>
              <Input
                type="password"
                id="passwordRepeat"
                value={passwordRepeat}
                onChange={(e) => setPasswordRepeat(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-4"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("processing") || "Processing..."}
                </>
              ) : (
                t("btn") || "Sign Up"
              )}
            </Button>
          </form>
        </CardContent>

        <div className="px-6 pb-4 text-center text-sm text-gray-600">
          {t("account") || "Already have an account?"}
          <Link 
            to="/login" 
            className="ml-1 font-medium text-orange-600 hover:text-orange-500 hover:underline"
          >
            {t("login") || "Log in"}
          </Link>
        </div>
      </Card>

      {/* Success Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {t("verificationSentTitle") || "Verification Email Sent!"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700">
              {t("verificationSentMsg") || 
                "We've sent a verification link to your email. Please check your inbox and follow the instructions to complete your registration."}
            </p>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setShowDialog(false)
                navigate("/")
              }}
              className="w-full"
            >
              {t("goHome") || "Go to Home"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Signup