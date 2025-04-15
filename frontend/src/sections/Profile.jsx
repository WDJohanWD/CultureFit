"use client"

import { useState } from "react"
import { User, Lock, Calendar, Mail, CreditCard, Camera } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"

export default function Profile() {
  // Mock user data - in a real app, this would come from your backend
  const [user, setUser] = useState({
    name: "Juan Pérez",
    email: "juan.perez@ejemplo.com",
    birthDate: "1990-05-15",
    dni: "12345678A",
    profileImage: "/placeholder.svg?height=100&width=100",
  })

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({ ...user })
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswords({
      ...passwords,
      [name]: value,
    })
  }

  const handleProfileUpdate = (e) => {
    e.preventDefault()
    // In a real app, you would send this data to your backend
    setUser({ ...formData })
    setIsEditing(false)
    toast({
      title: "Perfil actualizado",
      description: "Tu información ha sido actualizada correctamente.",
    })
  }

  const handlePasswordUpdate = (e) => {
    e.preventDefault()

    // Validate passwords
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas nuevas no coinciden.",
        variant: "destructive",
      })
      return
    }

    // In a real app, you would send this to your backend
    toast({
      title: "Contraseña actualizada",
      description: "Tu contraseña ha sido actualizada correctamente.",
    })

    // Reset password fields
    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // In a real app, you would upload this file to your server/storage
      // For now, we'll create a local URL
      const imageUrl = URL.createObjectURL(file)
      setFormData({
        ...formData,
        profileImage: imageUrl,
      })
    }
  }

  return (
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
              <AvatarImage src={isEditing ? formData.profileImage : user.profileImage} alt="Foto de perfil" />
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
  )
}
