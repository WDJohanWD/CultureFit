import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../AuthContext"
import { User, Lock, Calendar, Mail, CreditCard, Camera } from "lucide-react"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"

export default function Profile() {
    const { user: authUser, loading } = useContext(AuthContext)

    const API_URL = "http://localhost:9000"
    const [isEditing, setIsEditing] = useState(false)
    const [user, setUser] = useState(null)
    const [formData, setFormData] = useState(null)
    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })

    useEffect(() => {
        if (!loading && authUser) {
            setUser(authUser)
            setFormData({ ...authUser })
        }
    }, [authUser, loading])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handlePasswordChange = (e) => {
        const { name, value } = e.target
        setPasswords((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleProfileUpdate = (e) => {
        e.preventDefault()
        setUser({ ...formData })
        setIsEditing(false)
        toast({
            title: "Perfil actualizado",
            description: "Tu información ha sido actualizada correctamente.",
        })
    }

    const handlePasswordUpdate = (e) => {
        e.preventDefault()

        if (passwords.newPassword !== passwords.confirmPassword) {
            toast({
                title: "Error",
                description: "Las contraseñas nuevas no coinciden.",
                variant: "destructive",
            })
            return
        }

        toast({
            title: "Contraseña actualizada",
            description: "Tu contraseña ha sido actualizada correctamente.",
        })

        setPasswords({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        })
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files[0]
        if (file) {
            try {
                const formData = new FormData()
                formData.append('image', file)

                const response = await axios.post(`${API_URL}/user/upload-profile-image/${user.id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })

                if (response.status === 200) {
                    const imageUrl = response.data.imageUrl
                    setFormData((prev) => ({
                        ...prev,
                        imageUrl: imageUrl,
                    }))
                    setUser((prev) => ({
                        ...prev,
                        imageUrl: imageUrl,
                    }))
                    toast({
                        title: "Imagen actualizada",
                        description: "Tu imagen de perfil ha sido actualizada correctamente.",
                    })
                    console.log(user.imageUrl)
                }
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Hubo un error al subir la imagen. Por favor, inténtalo de nuevo.",
                    variant: "destructive",
                })
                console.error("Error uploading image:", error)
            }
        }
    }

    if (loading || !user || !formData) return <p className="text-center py-10">Cargando...</p>

    return (
        <div className="container mx-auto py-10">
            <div className="container mx-auto py-10">
                <h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Profile Image Section */}
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle>Imagen de Perfil</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center">
                            <Avatar className="h-32 w-32 mb-4">
                                <AvatarImage src={isEditing ? `${API_URL}${formData.imageUrl}` : `${API_URL}${user.imageUrl}`} alt="Foto de perfil" />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>

                            {isEditing && (
                                <div className="w-full">
                                    <Label htmlFor="profile-image" className="cursor-pointer">
                                        <div className="flex items-center justify-center gap-2 p-2 border-2 border-dashed rounded-md hover:bg-muted">
                                            <Camera className="h-4 w-4" />
                                            <span>Cambiar imagen</span>
                                        </div>
                                        <Input
                                            id="profile-image"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageUpload}
                                        />
                                    </Label>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Main Content */}
                    <div className="md:col-span-2">
                        <Tabs defaultValue="info">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="info">Información Personal</TabsTrigger>
                                <TabsTrigger value="security">Seguridad</TabsTrigger>
                            </TabsList>

                            {/* Personal Information Tab */}
                            <TabsContent value="info">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Información Personal</CardTitle>
                                        <CardDescription>Gestiona tu información personal y de contacto.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleProfileUpdate}>
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="name" className="flex items-center gap-2">
                                                            <User className="h-4 w-4" />
                                                            Nombre Completo
                                                        </Label>
                                                        <Input
                                                            id="name"
                                                            name="name"
                                                            value={isEditing ? formData.name : user.name}
                                                            onChange={handleInputChange}
                                                            readOnly={!isEditing}
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="email" className="flex items-center gap-2">
                                                            <Mail className="h-4 w-4" />
                                                            Correo Electrónico
                                                        </Label>
                                                        <Input
                                                            id="email"
                                                            name="email"
                                                            type="email"
                                                            value={isEditing ? formData.email : user.email}
                                                            onChange={handleInputChange}
                                                            readOnly={!isEditing}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="birthDate" className="flex items-center gap-2">
                                                            <Calendar className="h-4 w-4" />
                                                            Fecha de Nacimiento
                                                        </Label>
                                                        <Input
                                                            id="birthDate"
                                                            name="birthDate"
                                                            type="date"
                                                            value={isEditing ? formData.birthDate : user.birthDate}
                                                            onChange={handleInputChange}
                                                            readOnly={!isEditing}
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="dni" className="flex items-center gap-2">
                                                            <CreditCard className="h-4 w-4" />
                                                            DNI
                                                        </Label>
                                                        <Input
                                                            id="dni"
                                                            name="dni"
                                                            value={isEditing ? formData.dni : user.dni}
                                                            onChange={handleInputChange}
                                                            readOnly={!isEditing}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex justify-end space-x-2 pt-4">
                                                    {isEditing ? (
                                                        <>
                                                            <Button
                                                                variant="outline"
                                                                type="button"
                                                                onClick={() => {
                                                                    setIsEditing(false)
                                                                    setFormData({ ...user })
                                                                }}
                                                            >
                                                                Cancelar
                                                            </Button>
                                                            <Button type="submit">Guardar Cambios</Button>
                                                        </>
                                                    ) : (
                                                        <Button type="button" onClick={() => setIsEditing(true)}>
                                                            Editar Perfil
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Security Tab */}
                            <TabsContent value="security">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Seguridad</CardTitle>
                                        <CardDescription>Actualiza tu contraseña para mantener tu cuenta segura.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handlePasswordUpdate}>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="currentPassword" className="flex items-center gap-2">
                                                        <Lock className="h-4 w-4" />
                                                        Contraseña Actual
                                                    </Label>
                                                    <Input
                                                        id="currentPassword"
                                                        name="currentPassword"
                                                        type="password"
                                                        value={passwords.currentPassword}
                                                        onChange={handlePasswordChange}
                                                        required
                                                    />
                                                </div>

                                                <Separator />

                                                <div className="space-y-2">
                                                    <Label htmlFor="newPassword" className="flex items-center gap-2">
                                                        <Lock className="h-4 w-4" />
                                                        Nueva Contraseña
                                                    </Label>
                                                    <Input
                                                        id="newPassword"
                                                        name="newPassword"
                                                        type="password"
                                                        value={passwords.newPassword}
                                                        onChange={handlePasswordChange}
                                                        required
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                                                        <Lock className="h-4 w-4" />
                                                        Confirmar Nueva Contraseña
                                                    </Label>
                                                    <Input
                                                        id="confirmPassword"
                                                        name="confirmPassword"
                                                        type="password"
                                                        value={passwords.confirmPassword}
                                                        onChange={handlePasswordChange}
                                                        required
                                                    />
                                                </div>

                                                <div className="flex justify-end pt-4">
                                                    <Button type="submit">Actualizar Contraseña</Button>
                                                </div>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    )
}
