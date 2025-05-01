import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { CalendarIcon, Clock, MapPin, CheckCircle, X, Loader2 } from "lucide-react"
import { format, addDays, startOfDay, isBefore, isAfter, parseISO } from "date-fns"
import { es } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Dialog,  DialogContent,  DialogDescription,  DialogFooter,  DialogHeader,  DialogTitle,} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

export function Appointment(){
    const { t } = useTranslation("appointments")
    const API_URL = "http://localhost:9000"

  // --- State ---
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
  const [userAppointments, setUserAppointments] = useState([])
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true)

  // Mock user data - in a real app, this would come from your auth context
  const user = {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
  }

  // --- Fetch Services ---
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true)
        // In a real app, fetch from your API
        // const response = await fetch(`${API_URL}/services`)
        // const data = await response.json()

        // Mock data for services
        const mockServices = [
          { id: 1, name: "Consulta inicial", duration: 60, price: 50 },
          { id: 2, name: "Sesión de fisioterapia", duration: 45, price: 40 },
          { id: 3, name: "Evaluación física", duration: 30, price: 35 },
          { id: 4, name: "Masaje terapéutico", duration: 60, price: 45 },
        ]

        setServices(mockServices)
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

  // --- Fetch User Appointments ---
  useEffect(() => {
    const fetchUserAppointments = async () => {
      try {
        setIsLoadingAppointments(true)
        // In a real app, fetch from your API
        // const response = await fetch(`${API_URL}/appointments/user/${user.id}`)
        // const data = await response.json()

        // Mock data for user appointments
        const mockAppointments = [
          {
            id: 101,
            date: addDays(new Date(), 2).toISOString(),
            time: "10:00",
            service: "Consulta inicial",
            status: "confirmed",
            location: "Clínica Central",
          },
          {
            id: 102,
            date: addDays(new Date(), 7).toISOString(),
            time: "15:30",
            service: "Sesión de fisioterapia",
            status: "pending",
            location: "Clínica Norte",
          },
        ]

        setUserAppointments(mockAppointments)
      } catch (err) {
        console.error("Error fetching user appointments:", err)
      } finally {
        setIsLoadingAppointments(false)
      }
    }

    fetchUserAppointments()
  }, [API_URL, user.id])

  // --- Generate Time Slots ---
  useEffect(() => {
    const generateTimeSlots = () => {
      const slots = []
      const startHour = 9 // 9 AM
      const endHour = 18 // 6 PM
      const now = new Date()
      const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()

      for (let hour = startHour; hour < endHour; hour++) {
        for (let minutes = 0; minutes < 60; minutes += 30) {
          const slotTime = new Date(date)
          slotTime.setHours(hour, minutes, 0, 0)

          // Skip time slots in the past if it's today
          if (isToday && isBefore(slotTime, now)) {
            continue
          }

          // In a real app, you would check against booked appointments
          // and only add available slots
          const isAvailable = Math.random() > 0.3 // Randomly make some slots unavailable for demo

          slots.push({
            time: format(slotTime, "HH:mm"),
            available: isAvailable,
          })
        }
      }

      setTimeSlots(slots)
    }

    generateTimeSlots()
  }, [date])

  // --- Handle Booking Submission ---
  const handleBookAppointment = async () => {
    if (!selectedTimeSlot || !selectedService) {
      setError(t("pleaseSelectTimeAndService") || "Please select a time slot and service")
      return
    }

    try {
      setIsLoading(true)

      // In a real app, send to your API
      // const response = await fetch(`${API_URL}/appointments`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     userId: user.id,
      //     serviceId: selectedService,
      //     date: format(date, "yyyy-MM-dd"),
      //     time: selectedTimeSlot,
      //     notes
      //   })
      // })

      // if (!response.ok) throw new Error("Failed to book appointment")

      // Mock successful booking
      console.log("Booking submitted:", {
        userId: user.id,
        serviceId: selectedService,
        date: format(date, "yyyy-MM-dd"),
        time: selectedTimeSlot,
        notes,
      })

      // Reset form
      setSuccess(true)
      setConfirmDialog(false)
      setSelectedTimeSlot(null)
      setSelectedService("")
      setNotes("")

      // In a real app, refresh user appointments
      // fetchUserAppointments()

      // Add the new appointment to the list for demo purposes
      const selectedServiceObj = services.find((s) => s.id.toString() === selectedService.toString())
      setUserAppointments((prev) => [
        ...prev,
        {
          id: Math.floor(Math.random() * 1000),
          date: date.toISOString(),
          time: selectedTimeSlot,
          service: selectedServiceObj?.name || "Service",
          status: "pending",
          location: "Clínica Central",
        },
      ])
    } catch (err) {
      console.error("Error booking appointment:", err)
      setError(t("errorBookingAppointment") || "Error booking appointment")
    } finally {
      setIsLoading(false)
    }
  }

  // --- Handle Appointment Cancellation ---
  const handleCancelAppointment = async (appointmentId) => {
    try {
      setIsLoading(true)

      // In a real app, send to your API
      // const response = await fetch(`${API_URL}/appointments/${appointmentId}`, {
      //   method: "DELETE"
      // })

      // if (!response.ok) throw new Error("Failed to cancel appointment")

      // Mock successful cancellation
      console.log("Appointment cancelled:", appointmentId)

      // Update the local state by removing the cancelled appointment
      setUserAppointments((prev) => prev.filter((app) => app.id !== appointmentId))
    } catch (err) {
      console.error("Error cancelling appointment:", err)
      setError(t("errorCancellingAppointment") || "Error cancelling appointment")
    } finally {
      setIsLoading(false)
    }
  }

  // --- Format Date Helper ---
  const formatAppointmentDate = (dateString) => {
    try {
      const date = parseISO(dateString)
      return format(date, "PPP", { locale: es })
    } catch (error) {
      console.error("Error formatting date:", error)
      return dateString
    }
  }

  // --- Render Loading State ---
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
        <h1 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl mb-8">
          {t("appointmentsTitle") || "Appointments"}
        </h1>

        <Tabs defaultValue="book" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
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
                          <SelectItem key={service.id} value={service.id.toString()}>
                            <div className="flex justify-between items-center w-full">
                              <span>{service.name}</span>
                              <span className="text-muted-foreground text-sm">
                                {service.duration} min - ${service.price}
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
            <Card className="border-muted/40 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{t("myAppointments") || "My Appointments"}</CardTitle>
                <CardDescription>
                  {t("myAppointmentsDescription") || "View and manage your upcoming appointments."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingAppointments ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="flex flex-col items-center space-y-2">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="text-lg font-medium">{t("loading") || "Loading"}...</p>
                    </div>
                  </div>
                ) : userAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {userAppointments.map((appointment) => (
                      <Card key={appointment.id} className="overflow-hidden">
                        <div className="flex flex-col sm:flex-row">
                          <div className="bg-primary/10 p-4 sm:p-6 flex flex-col justify-center items-center sm:w-1/4">
                            <p className="text-lg font-bold">{formatAppointmentDate(appointment.date)}</p>
                            <p className="text-2xl font-bold text-primary">{appointment.time}</p>
                          </div>
                          <div className="p-4 sm:p-6 flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div>
                                <h3 className="text-lg font-semibold">{appointment.service}</h3>
                                <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                                  <MapPin className="h-4 w-4" />
                                  <span>{appointment.location}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={appointment.status === "confirmed" ? "default" : "outline"}
                                  className={cn(
                                    appointment.status === "confirmed"
                                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                                      : appointment.status === "pending"
                                        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                        : "",
                                  )}
                                >
                                  {appointment.status === "confirmed"
                                    ? t("confirmed") || "Confirmed"
                                    : t("pending") || "Pending"}
                                </Badge>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                                  onClick={() => handleCancelAppointment(appointment.id)}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  {t("cancel") || "Cancel"}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">{t("noAppointments") || "No appointments found"}</h3>
                    <p className="mt-2 text-muted-foreground">
                      {t("noAppointmentsDescription") || "You don't have any appointments scheduled yet."}
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => document.querySelector('[data-state="inactive"][value="book"]')?.click()}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {t("bookNow") || "Book Now"}
                    </Button>
                  </div>
                )}
              </CardContent>
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
                  <p className="text-base">{services.find((s) => s.id.toString() === selectedService)?.name || ""}</p>
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
      </div>
    </div>
  )
}