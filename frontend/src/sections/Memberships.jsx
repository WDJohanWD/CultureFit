import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { useState, useContext } from "react"
import { AuthContext } from "../AuthContext"

function Memberships() {
  const { t } = useTranslation("memberships")
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useContext(AuthContext)

  const tiers = [
    {
      name: t("n1"),
      id: t("id1"),
      priceId: "price_1R4jFS2esfOHTwEzogii8lfq", // ID del precio en Stripe
      priceMonthly: t("p1"),
      description: t("d1"),
      features: [t("f11"), t("f12"), t("f13"), t("f14")],
    },
    {
      name: t("n2"),
      id: t("id2"),
      priceId: "price_1R4jNE2esfOHTwEzlJUbL54J", // ID del precio en Stripe
      priceMonthly: t("p2"),
      description: t("d2"),
      features: [t("f21"), t("f22"), t("f23"), t("f24"), t("f25")],
    },
    {
      name: t("n3"),
      id: t("id3"),
      priceId: "price_1R4jRN2esfOHTwEzAfcJXAOi", // ID del precio en Stripe
      priceMonthly: t("p3"),
      description: t("d3"),
      features: [t("f31"), t("f32"), t("f33"), t("f34")],
    },
  ]

  // Metodo para redirigir al checkout-session
  const handleCheckout = async (priceId) => {
    setIsLoading(true)
    const CHECKOUT_SESSION_URL = "http://localhost:9000/payments/create-checkout-session/"

    try {
      const response = await fetch(CHECKOUT_SESSION_URL + priceId, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Error al iniciar la sesión de pago")
      }

      const { url } = await response.json() // Stripe devuelve la URL de pago
      window.location.href = url // Redirige a Stripe Checkout
    } catch (error) {
      console.error("Error:", error)
      setIsLoading(false)
    }
  }

  return (
    <div className="relative isolate bg-white px-6 py-24 lg:px-8">

      <img src="/CultureFitLogoNegro.png" alt="" className="h-12 mx-auto mb-3" />
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl montserrat">{t("titulo1")}</h2>
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-center text-lg font-medium text-pretty text-gray-600 sm:text-xl">
        {t("subtitulo1")}
      </p>
      <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-x-6 gap-y-6 lg:max-w-6xl lg:grid-cols-3">
        {tiers.map((tier) => (
          <Card
            key={tier.id}
            className="flex flex-col h-full rounded-3xl bg-white/60 sm:mx-8 lg:mx-0 ring-1 ring-gray-300"
          >
            <CardHeader className="pb-0">
              <Badge variant="outline" className="w-fit text-primary border-primary">
                {tier.name}
              </Badge>
              <div className="mt-4 flex items-baseline gap-x-2">
                <CardTitle className="text-5xl font-semibold tracking-tight montserrat text-gray-900">
                  {tier.priceMonthly}
                </CardTitle>
                <span className="text-base text-gray-500">/{t("mes")}</span>
              </div>
              <CardDescription className="text-base text-gray-600">{tier.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow pt-6">
              <ul role="list" className="space-y-3 text-sm text-gray-600">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-x-3">
                    <Check className="h-5 w-5 flex-shrink-0 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="pt-0">
              <Button
                onClick={() => handleCheckout(tier.priceId)}
                variant="outline"
                className="w-full border-primary font-semibold text-gray-900 hover:bg-primary hover:text-white transition"
              >
                {t("elegir")}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {!user ? (
        <Alert variant="destructive" className="mt-10 mb-10 w-300 mx-auto">
          <AlertTitle>
            {t("warning")}
          </AlertTitle>
          <AlertDescription>
            {t("warningDescription")}
          </AlertDescription>
        </Alert>
      ) : null}

      {!user ?(
        <Dialog open={isLoading} onOpenChange={setIsLoading}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("processingPayment")}</DialogTitle>
            <DialogDescription className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("redirecting")}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      ):null}
      

    </div>
  )
}

export default Memberships
