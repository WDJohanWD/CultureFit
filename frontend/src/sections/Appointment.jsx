/*REACT*/
import { useState, useEffect, useContext } from "react"
import { useTranslation } from "react-i18next"
import { AuthContext } from "@/AuthContext"

/*UTILIDADES */
import { format, addDays, startOfDay, isBefore, isAfter, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

/*COMPONENTES UI*/
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

/*ICONOS */
import { CalendarIcon, Clock, CheckCircle, X, Loader2, CreditCard } from "lucide-react"

export default function Appointment() {
  // --- Imports ---
  const { t } = useTranslation("appointments")
  const API_URL = (import.meta.env.VITE_API_URL + "/appointment") || "http://localhost:9000/appointment"
  const { user, fetchUser } = useContext(AuthContext)

  // --- Estados Generales ---
  const [date, setDate] = useState(startOfDay(new Date()))
  const [timeSlots, setTimeSlots] = useState([])
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
  const [services, setServices] = useState([])
  const [selectedService, setSelectedService] = useState("")
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState(false)

  // --- Estados de Citas del Usuario ---
  const [userAppointments, setUserAppointments] = useState([])
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true)

  // --- Estados de Compra de Cupones ---
  const [selectedCouponAmount, setSelectedCouponAmount] = useState(null)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [paymentError, setPaymentError] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)


  // ==========================
  // = Función: Comprar Cupones =
  // ==========================
  const handlePurchaseCoupons = async (amount) => {
    try {
      setIsProcessing(true)
      setPaymentError("")
      setPaymentSuccess(false)

      // Aquí llamas a tu endpoint de compra en el backend
      const response = await fetch(`${API_URL}/buy-coupon`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          quantity: amount
        }),
      });
      await fetchUser(user.id);
      setPaymentSuccess(true)
      setSelectedCouponAmount(null)


    } catch (err) {
      setPaymentError(t("purchaseFailed") || "Something went wrong.")
    } finally {
      setIsProcessing(false)
    }
  }


  // = Fetch: Servicios Disponibles =
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${API_URL}/services`)
        const servicesData = await response.json()
        setServices(servicesData)
        setError(null)
      } catch (err) {
        console.error("Error fetching services:", err)
        setError(t("errorFetchingServices") || "Error fetching services")
      } finally {
        setIsLoading(false)
      }
    }

    fetchServices()
  }, [API_URL, t])


  // ==========================
  // = Fetch: Citas del Usuario =
  // ==========================
  useEffect(() => {
    const fetchUserAppointments = async () => {
      try {
        setIsLoadingAppointments(true)
        const response = await fetch(`${API_URL}/byuser/${user.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
        })

        if (!response.ok) throw new Error("Failed to fetch appointments")

        const data = await response.json()
        setUserAppointments(data)
      } catch (err) {
        console.error("Error fetching user appointments:", err)
      } finally {
        setIsLoadingAppointments(false)
      }
    }

    if (user?.id) {
      fetchUserAppointments()
    }
  }, [user?.id])


  // ==========================
  // = Fetch: Horarios Disponibles por Día =
  // ==========================
  useEffect(() => {
    const fetchSlotsFromBackend = async () => {
      if (!date) return

      try {
        const formattedDate = format(date, "yyyy-MM-dd")
        const response = await fetch(`${API_URL}/slots?date=${formattedDate}`)
        const data = await response.json()

        const slots = data.map((timeString) => ({
          time: timeString.slice(0, 5),
          available: true,
        }))

        setTimeSlots(slots)
      } catch (error) {
        console.error("Error fetching time slots from backend:", error)
        setTimeSlots([])
      }
    }

    fetchSlotsFromBackend()
  }, [date])


  // = Acción: Reservar Cita =
  const handleBookAppointment = async () => {
    if (!selectedTimeSlot || !selectedService) {
      setError(t("pleaseSelectTimeAndService") || "Please select a time slot and service")
      return
    }

    if (user?.appointmentsAvailables === 0) {
      setError(t("noAppointmentsRemaining") || "No appointments remaining")
      setConfirmDialog(false)
      return
    }

    try {
      setIsLoading(true)

      const payload = {
        userId: user.id,
        appointmentType: selectedService,
        date: format(date, "yyyy-MM-dd"),
        time: `${selectedTimeSlot}:00`,
        notes: notes || ""
      }

      const response = await fetch(`${API_URL}/create-appointment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error("Failed to book appointment")

      const newAppointment = await response.json()

      setSuccess(true)
      setConfirmDialog(false)
      setSelectedTimeSlot(null)
      setSelectedService("")
      setNotes("")
      setUserAppointments((prev) => [...prev, newAppointment])
      fetchUser(user.id);
    } catch (err) {
      console.error("Error booking appointment:", err)
      setError(t("errorBookingAppointment") || "Error al reservar la cita")
    } finally {
      setIsLoading(false)
    }
  }


  // = Acción: Cancelar Cita =
  const handleCancelAppointment = async (appointmentId) => {
    try {
      setIsLoading(true)

      const response = await fetch(`${API_URL}/${appointmentId}/cancel`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" }
      })

      if (!response.ok) throw new Error("Failed to cancel appointment")

      setUserAppointments((prev) =>
        prev.map((app) =>
          app.id === appointmentId ? { ...app, canceled: true } : app
        )
      )
    } catch (err) {
      console.error("Error cancelling appointment:", err)
      setError(t("errorCancellingAppointment") || "Error al cancelar la cita")
    } finally {
      setIsLoading(false)
    }
  }


  // = Utilidad: Formatear Fecha =
  const formatAppointmentDate = (dateString) => {
    try {
      const date = parseISO(dateString)
      return format(date, "PPP", { locale: es })
    } catch (error) {
      console.error("Error formatting date:", error)
      return dateString
    }
  }


  // = Render: Estado de Carga =
  if (isLoading && services.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-lg font-medium">{t("loading") || "Loading"}...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {user.role == "USER" || user.role == "ANONYMOUS" ? <div className="flex text-xl md:text-2xl items-center mx-auto text-center font-bold uppercase w-80 sm:w-130 lg:w-170">{t("noRole")}</div> : <>
        <h1 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl mb-8">
          {t("appointmentsTitle") || "Appointments"}
        </h1>
        


        <Tabs defaultValue="book" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger
              value="buy-coupons"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              {t("buyCoupons") || "Buy Coupons"}
            </TabsTrigger>
            <TabsTrigger
              value="book"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              {t("bookAppointment") || "Book Appointment"}
            </TabsTrigger>
            <TabsTrigger
              value="my-appointments"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Clock className="h-4 w-4 mr-2" />
              {t("myAppointments") || "My Appointments"}
            </TabsTrigger>
          </TabsList>

          {/* Book Appointment Tab */}
          <TabsContent value="book">
            {typeof user?.appointmentsAvailables === "number" && (
              <div className="mb-4 text-sm text-muted-foreground font-medium">
                {t("appointmentsRemaining") || "Appointments remaining"}:{" "}
                <span className="font-semibold text-foreground">{user.appointmentsAvailables}</span>
              </div>
            )}
            <Card className="border-muted/40 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  {t("bookNewAppointment") || "Book a New Appointment"}
                </CardTitle>
                <CardDescription>
                  {t("bookingDescription") || "Select a date, time and service to schedule your appointment."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertTitle>{t("error") || "Error"}</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="mb-6 bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">{t("success") || "Success"}</AlertTitle>
                    <AlertDescription className="text-green-700">
                      {t("appointmentBooked") || "Your appointment has been booked successfully!"}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Date Selection */}
                  <div className="space-y-2">
                    <Label className="text-base font-medium flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-primary" />
                      {t("selectDate") || "Select Date"}
                    </Label>
                    <div className="border rounded-md p-4">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(newDate) => {
                          setDate(newDate || startOfDay(new Date()))
                          setSelectedTimeSlot(null)
                        }}
                        disabled={(date) =>
                          isBefore(date, startOfDay(new Date())) || isAfter(date, addDays(new Date(), 30))
                        }
                        className="mx-auto"
                      />
                    </div>
                  </div>

                  {/* Time Slots */}
                  <div className="space-y-2">
                    <Label className="text-base font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      {t("selectTime") || "Select Time"}
                    </Label>
                    <div className="border rounded-md p-4 h-[350px] overflow-y-auto">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {timeSlots.map((slot, index) => (
                          <Button
                            key={index}
                            variant={selectedTimeSlot === slot.time ? "default" : "outline"}
                            className={cn("justify-center", !slot.available && "opacity-50 cursor-not-allowed")}
                            disabled={!slot.available}
                            onClick={() => setSelectedTimeSlot(slot.time)}
                          >
                            {slot.time}
                          </Button>
                        ))}
                      </div>
                      {timeSlots.length === 0 && (
                        <p className="text-center text-muted-foreground py-4">
                          {t("noTimeSlotsAvailable") || "No time slots available for this date"}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Service Selection */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="service" className="text-base font-medium">
                      {t("selectService") || "Select Service"}
                    </Label>
                    <Select value={selectedService} onValueChange={setSelectedService}>
                      <SelectTrigger id="service">
                        <SelectValue placeholder={t("selectServicePlaceholder") || "Select a service"} />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service} value={service}>
                            <div className="flex justify-between items-center w-full">
                              <span>{service}</span>
                              <span className="text-muted-foreground text-sm ms-2">
                                30min - $15
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="notes" className="text-base font-medium">
                      {t("notes") || "Additional Notes"} ({t("optional") || "optional"})
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder={
                        t("notesPlaceholder") || "Any special requirements or information for your appointment"
                      }
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button
                  disabled={!selectedTimeSlot || !selectedService || isLoading}
                  onClick={() => setConfirmDialog(true)}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("processing") || "Processing"}
                    </>
                  ) : (
                    <>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {t("bookAppointment") || "Book Appointment"}
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* My Appointments Tab */}
          <TabsContent value="my-appointments">
            <Card className="border-muted/40 shadow-md overflow-hidden">
              <CardHeader className="bg-background/50 backdrop-blur-sm border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold">{t("myAppointments") || "My Appointments"}</CardTitle>
                    <CardDescription>
                      {t("myAppointmentsDescription") || "View and manage your upcoming appointments."}
                    </CardDescription>
                  </div>
                  <CalendarIcon className="h-6 w-6 text-primary opacity-80" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {isLoadingAppointments ? (
                  <div className="flex items-center justify-center h-64 bg-muted/10">
                    <div className="flex flex-col items-center space-y-3 p-6 rounded-lg bg-background/80 shadow-sm">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="text-lg font-medium">{t("loading") || "Loading"}...</p>
                    </div>
                  </div>
                ) : userAppointments.length > 0 ? (
                  <div className="divide-y divide-border/50">
                    {userAppointments
                      .filter((appointment) => {
                        const now = new Date()
                        const [hours, minutes, seconds] = appointment.time.split(":").map(Number)

                        const appointmentDateTime = new Date(appointment.date)
                        appointmentDateTime.setHours(hours, minutes, seconds || 0, 0)

                        return appointmentDateTime >= now
                      })
                      .map((appointment) => (
                        <div key={appointment.id} className="group hover:bg-muted/20 transition-colors">
                          <div className="flex flex-col sm:flex-row p-1">
                            <div className="bg-primary/5 rounded-lg m-3 p-4 flex flex-col justify-center items-center sm:w-1/5 border border-primary/10">
                              <p className="text-sm font-medium text-muted-foreground">
                                {formatAppointmentDate(appointment.date)}
                              </p>
                              <p className="text-2xl font-bold text-primary">{appointment.time}</p>
                            </div>
                            <div className="p-4 flex-1 flex flex-col justify-center">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                  <h3 className="text-xl font-bold text-foreground">{appointment.appointmentType}</h3>
                                  <p className="text-sm text-muted-foreground flex items-center mt-1">
                                    <Clock className="h-3.5 w-3.5 mr-1 opacity-70" />
                                    {t("scheduledFor") || "Scheduled for"} {appointment.time}
                                  </p>
                                </div>

                                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                                  <Badge
                                    className={cn(
                                      "px-3 py-1 rounded-full text-sm font-medium transition-colors",
                                      appointment.canceled
                                        ? "bg-destructive/10 text-destructive border border-destructive/20"
                                        : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/30",
                                    )}
                                  >
                                    {appointment.canceled ? t("canceled") || "Canceled" : t("active") || "Active"}
                                  </Badge>

                                  {!appointment.canceled && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-destructive hover:bg-destructive/10 hover:text-destructive dark:hover:bg-destructive/20 border border-muted hover:border-destructive/30 transition-colors"
                                      onClick={() => handleCancelAppointment(appointment.id)}
                                    >
                                      <X className="h-4 w-4 mr-1" />
                                      {t("cancel") || "Cancel"}
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-16 px-4 bg-muted/5">
                    <div className="max-w-md mx-auto">
                      <div className="bg-primary/5 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/10">
                        <CalendarIcon className="h-10 w-10 text-primary opacity-80" />
                      </div>
                      <h3 className="text-xl font-semibold">{t("noAppointments") || "No appointments found"}</h3>
                      <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
                        {t("noAppointmentsDescription") || "You don't have any appointments scheduled yet."}
                      </p>
                      <Button
                        variant="default"
                        className="mt-6"
                        onClick={() => document.querySelector('[data-state="inactive"][value="book"]')?.click()}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {t("bookNow") || "Book Now"}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Buy Coupons Tab */}
          <TabsContent value="buy-coupons">
            {typeof user?.appointmentsAvailables === "number" && (
              <div className="mb-4 text-sm text-muted-foreground font-medium">
                {t("appointmentsRemaining") || "Appointments remaining"}:{" "}
                <span className="font-semibold text-foreground">{user.appointmentsAvailables}</span>
              </div>
            )}
            <Card className="border-muted/40 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{t("buyCoupons") || "Buy Appointment Coupons"}</CardTitle>
                <CardDescription>
                  {t("buyCouponsDescription") || "Increase your available appointments by purchasing extra coupons."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-3 gap-4">
                  {[1, 3, 5, 10].map((count) => (
                    <Button
                      key={count}
                      variant={selectedCouponAmount === count ? "default" : "outline"}
                      onClick={() => setSelectedCouponAmount(count)}
                      className="flex flex-col items-center p-6 h-full"
                    >
                      <span className="text-3xl font-bold">{count}</span>
                      <span className="text-muted-foreground text-sm mt-1">
                        ${count * 5} USD
                      </span>
                    </Button>
                  ))}
                </div>

                {paymentError && (
                  <Alert variant="destructive">
                    <AlertTitle>{t("error") || "Error"}</AlertTitle>
                    <AlertDescription>{paymentError}</AlertDescription>
                  </Alert>
                )}

                {paymentSuccess && (
                  <Alert>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">{t("success") || "Success"}</AlertTitle>
                    <AlertDescription className="text-green-700">
                      {t("couponsAdded") || "Coupons purchased successfully!"}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
              <CardFooter className="justify-end">
                <Button
                  disabled={!selectedCouponAmount || isProcessing}
                  onClick={() => handlePurchaseCoupons(selectedCouponAmount)}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("processing") || "Processing"}
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      {t("buyNow") || "Buy Now"}
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

        </Tabs>

        {/* Confirmation Dialog */}
        <Dialog open={confirmDialog} onOpenChange={setConfirmDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("confirmAppointment") || "Confirm Your Appointment"}</DialogTitle>
              <DialogDescription>
                {t("confirmAppointmentDescription") || "Please review your appointment details before confirming."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t("date") || "Date"}</p>
                  <p className="text-base">{format(date, "PPP", { locale: es })}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t("time") || "Time"}</p>
                  <p className="text-base">{selectedTimeSlot}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">{t("service") || "Service"}</p>
                  <p className="text-base">{services.find((s) => s === selectedService) || ""}</p>
                </div>
                {notes && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">{t("notes") || "Notes"}</p>
                    <p className="text-base">{notes}</p>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmDialog(false)}>
                {t("cancel") || "Cancel"}
              </Button>
              <Button onClick={handleBookAppointment} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("processing") || "Processing"}
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {t("confirm") || "Confirm"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        </>}
      </div>
    </div>
  )
}