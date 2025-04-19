import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Pencil, Trash2, Search, AlertCircle, Loader2 } from "lucide-react"

function AdminDashboard() {
  const { t } = useTranslation("adminDashboard")

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

  // --- Función para Cargar Miembros ---
  const fetchMembersData = async () => {
    try {
      const membersFetch = await fetch("http://localhost:9000/users")
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
      const exercisesFetch = await fetch("http://localhost:9000/exercise")
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

  // --- Carga Inicial de Datos ---
  useEffect(() => {
    setIsLoading(true)
    setIsLoadingExercises(true)
    fetchMembersData()
    fetchExercisesData()
  }, [])

  // --- Función para Borrar Miembro ---
  async function deleteMember(id) {
    try {
      const deleteFetch = await fetch(`http://localhost:9000/user/${id}`, {
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
      const deleteFetch = await fetch(`http://localhost:9000/delete-exercise/${id}`, {
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

  const handleNewExerciseInputChange = (event) => {
    const { name, value } = event.target
    setNewExerciseData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  async function handleSaveExerciseEdit(id) {
    try {
      const response = await fetch(`http://localhost:9000/edit-exercise/${id}`, {
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
      const response = await fetch("http://localhost:9000/new-exercise", {
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
      role: member.role,
      birthDate: member.birthDate || "",
      active: member.active,
    })
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
      const response = await fetch(`http://localhost:9000/user-edit/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData),
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

  const filteredExercises = exercises.filter(
    (exercise) =>
      (exercise.nameES?.toLowerCase() || "").includes(exerciseSearchQuery.toLowerCase()) ||
      (exercise.nameEN?.toLowerCase() || "").includes(exerciseSearchQuery.toLowerCase()),
  )

  // --- Filtrado ---
  const filteredMembers = members.filter(
    (member) =>
      (member.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (member.email?.toLowerCase() || "").includes(searchQuery.toLowerCase()),
  )

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
      <Card className="w-full">
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
                              onValueChange={(value) => handleInputChange({ target: { name: 'active', value: value === "true" }})}
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
                              onValueChange={(value) => handleInputChange({ target: { name: 'role', value }})}
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
      <Card className="w-full mt-8">
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
