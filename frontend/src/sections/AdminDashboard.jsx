import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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

    // --- Carga Inicial de Datos ---
    useEffect(() => {
        setIsLoading(true)
        fetchMembersData()
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
            const response = await fetch(`http://localhost:9000/user/${id}`, {
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
                                                        className="w-full"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="email"
                                                        name="email"
                                                        value={editFormData.email}
                                                        onChange={handleInputChange}
                                                        className="w-full"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="text"
                                                        name="birthDate"
                                                        value={editFormData.birthDate}
                                                        onChange={handleInputChange}
                                                        className="w-full"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={member.active === "1" ? "success" : "destructive"} className="font-medium">
                                                        {member.active === "1" ? t("active") : t("inactive")}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="text"
                                                        name="role"
                                                        value={editFormData.role}
                                                        onChange={handleInputChange}
                                                        className="w-full"
                                                    />
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
    )
}

export default AdminDashboard
