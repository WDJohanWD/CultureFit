import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"


import { Pencil, Trash2, Search, AlertCircle, Loader2, Camera, Dumbbell } from "lucide-react"
import axios from "axios"

function AdminDashboard() {
  const { t } = useTranslation("adminDashboard")
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:9000"

  // --- Estado ---
  const [members, setMembers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingMemberId, setEditingMemberId] = useState(null)
  const [editFormData, setEditFormData] = useState({})
  const [confirmDelete, setConfirmDelete] = useState(null)

  const [exercises, setExercises] = useState([])
  const [isLoadingExercises, setIsLoadingExercises] = useState(true)
  const [exerciseError, setExerciseError] = useState(null)
  const [exerciseSearchQuery, setExerciseSearchQuery] = useState("")
  const [editingExerciseId, setEditingExerciseId] = useState(null)
  const [exerciseFormData, setExerciseFormData] = useState({})
  const [confirmDeleteExercise, setConfirmDeleteExercise] = useState(null)
  const [showAddExerciseDialog, setShowAddExerciseDialog] = useState(false)
  const [newExerciseData, setNewExerciseData] = useState({
    nameES: "",
    nameEN: "",
  })
  const [tempExerciseImage, setTempExerciseImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [appointments, setAppointments] = useState([])
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true)
  const [appointmentError, setAppointmentError] = useState(null)
  const [editingAppointmentId, setEditingAppointmentId] = useState(null)
  const [appointmentFormData, setAppointmentFormData] = useState({})
  const [confirmDeleteAppointment, setConfirmDeleteAppointment] = useState(null)

  const [services, setServices] = useState([])
  const [isLoadingServices, setIsLoadingServices] = useState(true)

  const [memberships, setMemberships] = useState([])
  const [isLoadingMemberships, setIsLoadingMemberships] = useState(true)

  // --- Función para Cargar Miembros ---
  const fetchMembersData = async () => {
    try {
      const membersFetch = await fetch(`${API_URL}/users`)
      if (!membersFetch.ok) {
        throw new Error(`Failed to fetch members: ${membersFetch.statusText}`)
      }
      const data = await membersFetch.json()
      setMembers(data)
    } catch (error) {
      console.error("Error fetching members:", error)
      setError(error.message)
      setMembers([])
    } finally {
      setIsLoading(false)
    }
  }

  const fetchExercisesData = async () => {
    try {
      const exercisesFetch = await fetch(`${API_URL}/exercise`)
      if (!exercisesFetch.ok) {
        throw new Error(`Failed to fetch exercises: ${exercisesFetch.statusText}`)
      }
      const data = await exercisesFetch.json()
      setExercises(data)
    } catch (error) {
      console.error("Error fetching exercises:", error)
      setExerciseError(error.message)
      setExercises([])
    } finally {
      setIsLoadingExercises(false)
    }
  }

  const fetchAppointmentData = async () => {
    try {
      const appointmentsFetch = await fetch(`${API_URL}/appointment/all`)
      if (!appointmentsFetch.ok) {
        throw new Error(`Failed to fetch appointments: ${appointmentsFetch.statusText}`)
      }
      const data = await appointmentsFetch.json()
      setAppointments(data)
    } catch (error) {
      console.error("Error fetching appointments:", error)
      setAppointmentError(error.message)
      setAppointments([])
    } finally {
      setIsLoadingAppointments(false)
    }
  }

  const fetchServices = async () => {
    try {
      const servicesFetch = await fetch(`${API_URL}/appointment/services`)
      if (!servicesFetch.ok) {
        throw new Error('Failed to fetch services')
      }
      const data = await servicesFetch.json()
      setServices(data)
    } catch (error) {
      console.error("Error fetching services:", error)
    } finally {
      setIsLoadingServices(false)
    }
  }

  const fetchMemberships = async () => {
    try {
      const res = await fetch(`${API_URL}/memberships`)
      if (!res.ok) throw new Error('Failed to fetch memberships')
      const data = await res.json()
      setMemberships(data)
    } catch (error) {
      console.error('Error fetching memberships:', error)
    } finally {
      setIsLoadingMemberships(false)
    }
  }

  useEffect(() => {
    setIsLoading(true)
    setIsLoadingExercises(true)
    setIsLoadingAppointments(true)
    setIsLoadingServices(true)
    setIsLoadingMemberships(true)
    fetchMembersData()
    fetchExercisesData()
    fetchAppointmentData()
    fetchServices()
    fetchMemberships()
  }, [])

  // --- Función para Borrar Miembro ---
  async function deleteMember(id) {
    try {
      const deleteFetch = await fetch(`${API_URL}/user/${id}`, {
        method: "DELETE",
      })
      if (!deleteFetch.ok) {
        throw new Error(`Failed to delete member: ${deleteFetch.statusText}`)
      }
      console.log(`Member ${id} deleted`)
      setConfirmDelete(null)
      fetchMembersData()
    } catch (error) {
      console.error("Error deleting member:", error)
      setError(`Error deleting member: ${error.message}`)
    }
  }

  async function deleteExercise(id) {
    try {
      const deleteFetch = await fetch(`${API_URL}/delete-exercise/${id}`, {
        method: "DELETE",
      })
      if (!deleteFetch.ok) {
        throw new Error(`Failed to delete exercise: ${deleteFetch.statusText}`)
      }
      console.log(`Exercise ${id} deleted`)
      setConfirmDeleteExercise(null)
      fetchExercisesData()
    } catch (error) {
      console.error("Error deleting exercise:", error)
      setExerciseError(`Error deleting exercise: ${error.message}`)
    }
  }

  async function deleteAppointment(id) {
    try {
      const deleteFetch = await fetch(`${API_URL}/appointment/${id}`, {
        method: "DELETE",
      })
      if (!deleteFetch.ok) {
        throw new Error(`Failed to delete appointment: ${deleteFetch.statusText}`)
      }
      console.log(`Appointment ${id} deleted`)
      setConfirmDeleteAppointment(null)
      fetchAppointmentData()
    } catch (error) {
      console.error("Error deleting appointment:", error)
      setAppointmentError(`Error deleting appointment: ${error.message}`)
    }
  }

  const handleEditExerciseClick = (exercise) => {
    setEditingExerciseId(exercise.id)
    setExerciseFormData({
      nameEs: exercise.nameEs,
      nameEn: exercise.nameEn,
      idAttachment: exercise.idAttachment || "",
    })
  }

  const handleCancelExerciseEdit = () => {
    setEditingExerciseId(null)
    setExerciseFormData({})
  }

  const handleExerciseInputChange = (event) => {
    const { name, value } = event.target
    setExerciseFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleExerciseImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      setTempExerciseImage(file);
    }
  }

  const handleNewExerciseInputChange = (event) => {
    const { name, value } = event.target
    setNewExerciseData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  async function handleSaveExerciseEdit(id) {
    try {
      if (tempExerciseImage) {
        const formData = new FormData();
        formData.append("image", tempExerciseImage);

        const uploadResponse = await axios.post(
          `${API_URL}/exercise/upload-image/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (!uploadResponse.status === 200) {
          throw new Error("Failed to upload image");
        }
      }

      const response = await fetch(`${API_URL}/edit-exercise/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(exerciseFormData),
      })
      if (!response.ok) {
        let errorBody = ""
        try {
          errorBody = await response.text()
        } catch {
          throw new Error(`Failed to update exercise: ${response.statusText}. ${errorBody}`)
        }

      }
      console.log(`Exercise ${id} updated successfully`)
      setEditingExerciseId(null)
      setExerciseFormData({})
      fetchExercisesData()
    } catch (error) {
      console.error("Error updating exercise:", error)
      setExerciseError(`Error updating exercise: ${error.message}`)
    }
  }

  async function handleAddExercise() {
    try {
      const response = await fetch(`${API_URL}/new-exercise`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExerciseData),
      })
      if (!response.ok) {
        let errorBody = ""
        try {
          errorBody = await response.text()
        } catch {
          throw new Error(`Failed to add exercise: ${response.statusText}. ${errorBody}`)
        }
      }
      console.log("Exercise added successfully")
      setShowAddExerciseDialog(false)
      setNewExerciseData({
        nameES: "",
        nameEN: "",
      })
      fetchExercisesData()
    } catch (error) {
      console.error("Error adding exercise:", error)
      setExerciseError(`Error adding exercise: ${error.message}`)
    }
  }

  // --- Manejadores para Edición ---
  const handleEditClick = (member) => {
    setEditingMemberId(member.id)
    setEditFormData({
      name: member.name,
      email: member.email,
      dni: member.dni,
      role: member.role,
      birthDate: member.birthDate || "",
      active: member.active,
      membership: member.membership // debe ser string, no índice
    })
  }

  const handleAppointmentInputChange = (event) => {
    const { name, value } = event.target
    setAppointmentFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleEditAppointmentClick = (appointment) => {
    setEditingAppointmentId(appointment.id)
    setAppointmentFormData({
      clientName: appointment.user?.name,
      service: appointment.appointmentType,
      date: appointment.date,
      time: appointment.time,
      isCanceled: Boolean(appointment.isCanceled)
    })
  }

  const handleCancelAppointmentEdit = () => {
    setEditingAppointmentId(null)
    setAppointmentFormData({})
  }

  const handleSaveAppointmentEdit = async (id) => {
    try {
      const response = await fetch(`${API_URL}/appointment/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointmentType: appointmentFormData.service,
          date: appointmentFormData.date,
          time: appointmentFormData.time,
          isCanceled: appointmentFormData.isCanceled
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update appointment")
      }

      // Recargar los datos
      await fetchAppointmentData()
        // Limpiar el estado de edición
      setEditingAppointmentId(null)
      setAppointmentFormData({})
    } catch (error) {
      console.error("Error updating appointment:", error)
    }
  }
  
  const handleCancelEdit = () => {
    setEditingMemberId(null)
    setEditFormData({})
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  // --- Función para Guardar Cambios ---
  async function handleSaveEdit(id) {
    try {
      const payload = {
        ...editFormData,
        membership: editFormData.membership 
      };
      const response = await fetch(`${API_URL}/user-edit/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        let errorBody = ""
        try {
          errorBody = await response.text()
        } catch {
          throw new Error(`Failed to update member: ${response.statusText}. ${errorBody}`)
        }
      }
      console.log(`Member ${id} updated successfully`)
      setEditingMemberId(null)
      setEditFormData({})
      fetchMembersData()
    } catch (error) {
      console.error("Error updating member:", error)
      setError(`Error updating member: ${error.message}`)
    }
  }

  // Helper function to safely filter strings
  const safeStringIncludes = (text, search) => {
    if (!text || !search) return false;
    return String(text).toLowerCase().includes(search.toLowerCase());
  };

  // Safe filtering for appointments
  const filteredAppointments = (appointments || []).filter((appointment) => {
    if (!searchQuery) return true;
    if (!appointment) return false;
    
    const clientName = appointment?.clientName || '';
    const service = appointment?.service || '';
    const status = appointment?.status || '';
    const date = appointment?.date || '';
    
    const searchLower = searchQuery.toLowerCase();
    
    return clientName.toLowerCase().includes(searchLower) ||
           service.toLowerCase().includes(searchLower) ||
           status.toLowerCase().includes(searchLower) ||
           date.toLowerCase().includes(searchLower);
  });

  // Safe filtering for members
  const filteredMembers = (members || []).filter((member) => {
    if (!searchQuery) return true;
    if (!member) return false;
    
    return safeStringIncludes(member.name, searchQuery) ||
           safeStringIncludes(member.email, searchQuery) ||
           safeStringIncludes(member.dni, searchQuery);
  });

  // Safe filtering for exercises
  const filteredExercises = (exercises || []).filter((exercise) => {
    if (!exerciseSearchQuery) return true;
    if (!exercise) return false;
    
    return safeStringIncludes(exercise.nameES, exerciseSearchQuery) ||
           safeStringIncludes(exercise.nameEN, exerciseSearchQuery);
  }) || [];

  // --- Renderizado ---
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-lg font-medium">{t("loading")}...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <h1 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">{t("h1")}</h1>
      <Card className="w-auto m-5">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex items-center mb-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              className="pl-10 w-full max-w-md"
              placeholder={t("search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("ID")}</TableHead>
                  <TableHead>{t("Name")}</TableHead>
                  <TableHead>{t("Email")}</TableHead>
                  <TableHead>{t("DNI")}</TableHead>
                  <TableHead>{t("Plan")}</TableHead>
                  <TableHead>{t("Birth Date")}</TableHead>
                  <TableHead>{t("Status")}</TableHead>
                  <TableHead>{t("Role")}</TableHead>
                  <TableHead>{t("Actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
                    <TableRow key={member.id}>
                      {editingMemberId === member.id ? (
                        // --- Modo Edición ---
                        <>
                          <TableCell className="font-medium">{member.id}</TableCell>
                          <TableCell>
                            <Input
                              type="text"
                              name="name"
                              value={editFormData.name}
                              onChange={handleInputChange}
                              readOnly
                              className="w-full"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="email"
                              name="email"
                              value={editFormData.email}
                              onChange={handleInputChange}
                              readOnly
                              className="w-full"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="text"
                              name="dni"
                              value={editFormData.dni}
                              onChange={handleInputChange}
                              readOnly
                              className="w-full"
                            />
                          </TableCell>
                          <TableCell>
                            <Select
                              name="membership"
                              value={editFormData.membership}
                              onValueChange={(value) => handleInputChange({ target: { name: 'membership', value } })}
                              className="w-full"
                            >
                              <SelectTrigger>
                                <SelectValue placeholder={editFormData.membership} />
                              </SelectTrigger>
                              <SelectContent>
                                {memberships.map((m) => (
                                  <SelectItem key={m} value={m}>{m}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                          </TableCell>
                          <TableCell>
                            <Input
                              type="date"
                              name="birthDate"
                              value={editFormData.birthDate}
                              readOnly
                              onChange={handleInputChange}
                              className="w-full"
                            />
                          </TableCell>
                          <TableCell>
                            <Select
                              name="active"
                              value={editFormData.active ? "true" : "false"}
                              onValueChange={(value) => handleInputChange({ target: { name: 'active', value: value === "true" } })}
                              className="w-full"
                            >
                              <SelectTrigger>
                                <SelectValue>
                                  <Badge variant={editFormData.active ? "success" : "destructive"} className="font-medium">
                                    {editFormData.active ? t("active") : t("inactive")}
                                  </Badge>
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="true">
                                  <Badge variant="success" className="font-medium">
                                    {t("active")}
                                  </Badge>
                                </SelectItem>
                                <SelectItem value="false">
                                  <Badge variant="destructive" className="font-medium">
                                    {t("inactive")}
                                  </Badge>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select
                              name="role"
                              value={editFormData.role}
                              onValueChange={(value) => handleInputChange({ target: { name: 'role', value } })}
                              className="w-full"
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ADMIN">ADMIN</SelectItem>
                                <SelectItem value="USER">USER</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSaveEdit(member.id)}
                                className="text-green-600 border-green-600 hover:bg-green-50"
                              >
                                {t("Save")}
                              </Button>
                              <Button variant="ghost" size="sm" onClick={handleCancelEdit} className="text-gray-600">
                                {t("Cancel")}
                              </Button>
                            </div>
                          </TableCell>
                        </>
                      ) : (
                        // --- Modo Visualización ---
                        <>
                          <TableCell className="font-medium">{member.id}</TableCell>
                          <TableCell>{member.name}</TableCell>
                          <TableCell>{member.email}</TableCell>
                          <TableCell>{member.dni} </TableCell>
                          <TableCell>{member.membership} </TableCell>
                          <TableCell>{member.birthDate || "-"}</TableCell>
                          <TableCell>
                            <Badge variant={member.active ? "success" : "destructive"} className="font-medium">
                              {member.active ? t("active") : t("inactive")}
                            </Badge>
                          </TableCell>
                          <TableCell>{member.role}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditClick(member)}
                                className="h-8 w-8 text-blue-600"
                              >
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">{t("Edit")}</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setConfirmDelete(member.id)}
                                className="h-8 w-8 text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">{t("Delete")}</span>
                              </Button>
                            </div>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      {t("NoFound")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>

        {/* Confirmation Dialog for Delete */}
        <Dialog open={!!confirmDelete} onOpenChange={(open) => !open && setConfirmDelete(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("confirmDeleteTitle")}</DialogTitle>
              <DialogDescription>{t("confirmDelete")}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmDelete(null)}>
                {t("Cancel")}
              </Button>
              <Button variant="destructive" onClick={() => confirmDelete && deleteMember(confirmDelete)}>
                {t("Delete")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>

      {/* Exercise Management Card */}
      <Card className="w-auto m-5">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-3xl font-bold">{t("exercisesTitle") || "Exercise Management"}</CardTitle>
          <Button onClick={() => setShowAddExerciseDialog(true)}>{t("addExercise") || "Add Exercise"}</Button>
        </CardHeader>
        <CardContent>
          {exerciseError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{exerciseError}</AlertDescription>
            </Alert>
          )}

          <div className="flex items-center mb-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              className="pl-10 w-full max-w-md"
              placeholder={t("searchExercises") || "Search exercises..."}
              value={exerciseSearchQuery}
              onChange={(e) => setExerciseSearchQuery(e.target.value)}
            />
          </div>

          {isLoadingExercises ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center space-y-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-lg font-medium">{t("loading") || "Loading"}...</p>
              </div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("ID") || "ID"}</TableHead>
                    <TableHead>{t("image") || "Image"}</TableHead>
                    <TableHead>{t("nameEs") || "Name (Spanish)"}</TableHead>
                    <TableHead>{t("nameEn") || "Name (English)"}</TableHead>
                    <TableHead>{t("Actions") || "Actions"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExercises.length > 0 ? (
                    filteredExercises.map((exercise) => (
                      <TableRow key={exercise.id}>
                        {editingExerciseId === exercise.id ? (
                          // --- Edit Mode ---
                          <>
                            <TableCell className="font-medium">{exercise.id}</TableCell>
                            <TableCell>
                              <Label htmlFor="profile-image-btn" className="cursor-pointer">
                                <div className="flex items-center justify-center gap-2 p-2 border border-dashed rounded-md hover:bg-muted transition-colors">
                                  {imagePreview ? (
                                    <img
                                      src={imagePreview}
                                      alt="Preview"
                                      className="h-10 w-10 object-cover rounded-md"
                                    />
                                  ) : (
                                    <>
                                      <Camera className="h-4 w-4" />
                                      <span>{t("change-image")}</span>
                                    </>
                                  )}
                                </div>
                                <Input
                                  id="profile-image-btn"
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={handleExerciseImageUpload}
                                />
                              </Label>
                            </TableCell>
                            <TableCell>
                              <Input
                                type="text"
                                name="nameES"
                                value={exerciseFormData.nameES}
                                onChange={handleExerciseInputChange}
                                className="w-full"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="text"
                                name="nameEN"
                                value={exerciseFormData.nameEN}
                                onChange={handleExerciseInputChange}
                                className="w-full"
                              />
                            </TableCell>

                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSaveExerciseEdit(exercise.id)}
                                  className="text-green-600 border-green-600 hover:bg-green-50"
                                >
                                  {t("Save") || "Save"}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={handleCancelExerciseEdit}
                                  className="text-gray-600"
                                >
                                  {t("Cancel") || "Cancel"}
                                </Button>
                              </div>
                            </TableCell>
                          </>
                        ) : (
                          // --- View Mode ---
                          <>
                            <TableCell className="font-medium">{exercise.id}</TableCell>
                            <TableCell>
                              <Avatar className="h-10 w-10 shadow-md">
                                <AvatarImage
                                  src={`${API_URL}${exercise.imageUrl}`}
                                  alt="ejercicio"
                                  className="object-cover"
                                />
                                <AvatarFallback className="text-2xl p-2 bg-primary/10 text-primary">
                                  <Dumbbell></Dumbbell>
                                </AvatarFallback>
                              </Avatar>
                            </TableCell>
                            <TableCell>{exercise.nameES}</TableCell>
                            <TableCell>{exercise.nameEN}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditExerciseClick(exercise)}
                                  className="h-8 w-8 text-blue-600"
                                >
                                  <Pencil className="h-4 w-4" />
                                  <span className="sr-only">{t("Edit") || "Edit"}</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setConfirmDeleteExercise(exercise.id)}
                                  className="h-8 w-8 text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">{t("Delete") || "Delete"}</span>
                                </Button>
                              </div>
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        {t("NoExercisesFound") || "No exercises found"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <>
        <Card className="w-auto m-5">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">{t("appointmentsTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            {appointmentError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{appointmentError}</AlertDescription>
              </Alert>
            )}

            <div className="flex items-center mb-6 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                className="pl-10 w-full max-w-md"
                placeholder={t("searchAppointments")}
                value={searchQuery} // Assuming searchQuery is still used for general search
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {isLoadingAppointments ? (
              <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center space-y-2">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-lg font-medium">{t("loadingAppointments")}...</p>
                </div>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("ID")}</TableHead>
                      <TableHead>{t("ClientName")}</TableHead>
                      <TableHead>{t("Service")}</TableHead>
                      <TableHead>{t("Date")}</TableHead>
                      <TableHead>{t("Time")}</TableHead>
                      <TableHead>{t("Status")}</TableHead>
                      <TableHead>{t("Actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments?.length > 0 ? (
                      appointments.filter(appointment => {
                        if (!searchQuery) return true;
                        if (!appointment) return false;
                        
                        const searchLower = searchQuery.toLowerCase();
                        const clientName = appointment?.user.name;
                        const service = appointment?.appointmentType;
                        
                        return clientName.toLowerCase().includes(searchLower) ||
                               service.toLowerCase().includes(searchLower);
                      }).map((appointment) => (
                        <TableRow key={appointment.id}>
                          {editingAppointmentId === appointment.id ? (
                            // --- Edit Mode ---
                            <>
                              <TableCell className="font-medium">{appointment.id}</TableCell>
                              <TableCell>
                                <Input
                                  type="text"
                                  name="name"
                                  value={appointmentFormData.name || appointment.user?.name}
                                  onChange={handleAppointmentInputChange}
                                  className="w-full"
                                />
                              </TableCell>
                              <TableCell>
                                <Select
                                  name="service"
                                  value={appointmentFormData.service}
                                  onValueChange={(value) => handleAppointmentInputChange({ target: { name: 'service', value } })}
                                  className="w-full"
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder={t("selectService")} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {services.map((service) => (
                                      <SelectItem key={service} value={service}>
                                        {service}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="date"
                                  name="date"
                                  value={appointmentFormData.date}
                                  onChange={handleAppointmentInputChange}
                                  className="w-full"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="time"
                                  name="time"
                                  value={appointmentFormData.time}
                                  onChange={handleAppointmentInputChange}
                                  className="w-full"
                                />
                              </TableCell>
                              <TableCell>                              <Select
                                  name="isCanceled"
                                  value={String(Boolean(appointmentFormData.isCanceled))}
                                  onValueChange={(value) => handleAppointmentInputChange({ target: { name: 'isCanceled', value: value === "true" } })}
                                  className="w-full"
                                >
                                  <SelectTrigger>
                                    <SelectValue>
                                      <Badge variant={!appointmentFormData.isCanceled ? "success" : "destructive"} className="font-medium">
                                        {!appointmentFormData.isCanceled ? t("active") : t("canceled")}
                                      </Badge>
                                    </SelectValue>
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="false">
                                      <Badge variant="success" className="font-medium">
                                        {t("active")}
                                      </Badge>
                                    </SelectItem>
                                    <SelectItem value="true">
                                      <Badge variant="destructive" className="font-medium">
                                        {t("canceled")}
                                      </Badge>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleSaveAppointmentEdit(appointment.id)}
                                    className="text-green-600 border-green-600 hover:bg-green-50"
                                  >
                                    {t("Save")}
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={handleCancelAppointmentEdit} className="text-gray-600">
                                    {t("Cancel")}
                                  </Button>
                                </div>
                              </TableCell>
                            </>
                          ) : (
                            // --- View Mode ---
                            <>
                              <TableCell className="font-medium">{appointment.id}</TableCell>
                              <TableCell>{appointment.user?.name}</TableCell>
                              <TableCell>{appointment.appointmentType}</TableCell>
                              <TableCell>{appointment.date}</TableCell>
                              <TableCell>{appointment.time}</TableCell>                              <TableCell>
                                <Badge
                                  variant={!appointment.isCanceled ? "success" : "destructive"}
                                  className="font-medium"
                                >
                                  {!appointment.isCanceled ? t("active") : t("canceled")}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEditAppointmentClick(appointment)}
                                    className="h-8 w-8 text-blue-600"
                                  >
                                    <Pencil className="h-4 w-4" />
                                    <span className="sr-only">{t("Edit")}</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setConfirmDeleteAppointment(appointment.id)}
                                    className="h-8 w-8 text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">{t("Delete")}</span>
                                  </Button>
                                </div>
                              </TableCell>
                            </>
                          )}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          {t("NoAppointmentsFound")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>

          {/* Confirmation Dialog for Delete Appointment */}
          <Dialog open={!!confirmDeleteAppointment} onOpenChange={(open) => !open && setConfirmDeleteAppointment(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("confirmDeleteAppointmentTitle")}</DialogTitle>
                <DialogDescription>{t("confirmDeleteAppointment")}</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setConfirmDeleteAppointment(null)}>
                  {t("Cancel")}
                </Button>
                <Button variant="destructive" onClick={() => confirmDeleteAppointment && deleteAppointment(confirmDeleteAppointment)}>
                  {t("Delete")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Card>
      </>

      {/* Add Exercise Dialog */}
      <Dialog open={showAddExerciseDialog} onOpenChange={setShowAddExerciseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("addExercise") || "Add New Exercise"}</DialogTitle>
            <DialogDescription>
              {t("addExerciseDescription") || "Fill in the details to add a new exercise."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="nameEs" className="text-right">
                {t("nameEs") || "Name (Spanish)"}
              </label>
              <Input
                id="nameES"
                name="nameES"
                value={newExerciseData.nameES}
                onChange={handleNewExerciseInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="nameEn" className="text-right">
                {t("nameEn") || "Name (English)"}
              </label>
              <Input
                id="nameEN"
                name="nameEN"
                value={newExerciseData.nameEN}
                onChange={handleNewExerciseInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddExerciseDialog(false)}>
              {t("Cancel") || "Cancel"}
            </Button>
            <Button onClick={handleAddExercise}>{t("Add") || "Add Exercise"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for Delete Exercise */}
      <Dialog open={!!confirmDeleteExercise} onOpenChange={(open) => !open && setConfirmDeleteExercise(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("confirmDeleteExerciseTitle") || "Confirm Delete"}</DialogTitle>
            <DialogDescription>
              {t("confirmDeleteExercise") ||
                "Are you sure you want to delete this exercise? This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteExercise(null)}>
              {t("Cancel") || "Cancel"}
            </Button>
            <Button
              variant="destructive"
              onClick={() => confirmDeleteExercise && deleteExercise(confirmDeleteExercise)}
            >
              {t("Delete") || "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AdminDashboard
