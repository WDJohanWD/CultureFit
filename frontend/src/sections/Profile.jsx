"use client"

import { useTranslation } from "react-i18next"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../AuthContext"
import { User, Lock, Calendar, Mail, CreditCard, Camera, CheckCircle } from "lucide-react"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"

export default function Profile() {
  const { user: authUser, loading } = useContext(AuthContext)
  const { t } = useTranslation("profile")
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
      title: t("toast-profile-success-title"),
      description: t("toast-profile-success-description"),
    })
  }

  const handlePasswordUpdate = (e) => {
    e.preventDefault()

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast({
        title: t("toast-error-title"),
        description: t("toast-password-mismatch"),
        variant: "destructive",
      })
      return
    }

    toast({
      title: t("toast-password-success-title"),
      description: t("toast-password-success-description"),
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
        formData.append("image", file)

        const response = await axios.post(`${API_URL}/user/upload-profile-image/${user.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
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
            title: t("toast-image-success-title"),
            description: t("toast-image-success-description"),
          })
        }
      } catch (error) {
        toast({
          title: t("toast-error-title"),
          description: t("toast-image-error"),
          variant: "destructive",
        })
        console.error("Error uploading image:", error)
      }
    }
  }

  if (loading || !user || !formData)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-24 w-24 bg-muted rounded-full"></div>
          <div className="h-6 w-48 bg-muted rounded"></div>
          <div className="h-4 w-32 bg-muted rounded"></div>
        </div>
      </div>
    )

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <Badge variant="outline" className="bg-primary/10 text-primary">
            {isEditing ? t("editing") || "Editando" : t("viewing") || "Visualizando"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Image Section */}
          <Card className="md:col-span-1 border-muted/40 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                {t("text-image")}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center pt-4">
              <div className="relative group">
                <Avatar className="h-36 w-36 mb-6 border-4 border-background shadow-md">
                  <AvatarImage
                    src={isEditing ? `${API_URL}${formData.imageUrl}` : `${API_URL}${user.imageUrl}`}
                    alt="Foto de perfil"
                    className="object-cover"
                  />
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                    {user.name?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Label htmlFor="profile-image" className="cursor-pointer">
                      <div className="flex items-center justify-center gap-2 p-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                        <Camera className="h-5 w-5" />
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
              </div>

              <div className="text-center space-y-1 w-full">
                <h3 className="font-semibold text-lg">{user.name}</h3>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{user.birthDate}</span>
                </div>
              </div>

              {isEditing && (
                <div className="w-full mt-6">
                  <Label htmlFor="profile-image-btn" className="cursor-pointer">
                    <div className="flex items-center justify-center gap-2 p-2 border border-dashed rounded-md hover:bg-muted transition-colors">
                      <Camera className="h-4 w-4" />
                      <span>{t("change-image")}</span>
                    </div>
                    <Input
                      id="profile-image-btn"
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
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger
                  value="info"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <User className="h-4 w-4 mr-2" />
                  {t("tab1")}
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  {t("tab2")}
                </TabsTrigger>
              </TabsList>

              {/* Personal Information Tab */}
              <TabsContent value="info">
                <Card className="border-muted/40 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      {t("tab1-tittle")}
                    </CardTitle>
                    <CardDescription>{t("tab1-description")}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <form onSubmit={handleProfileUpdate}>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                              <User className="h-4 w-4 text-primary" />
                              {t("tab1-name")}
                            </Label>
                            <Input
                              id="name"
                              name="name"
                              value={isEditing ? formData.name : user.name}
                              onChange={handleInputChange}
                              readOnly={!isEditing}
                              className={!isEditing ? "bg-muted/50" : ""}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                              <Mail className="h-4 w-4 text-primary" />
                              {t("tab1-email")}
                            </Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={isEditing ? formData.email : user.email}
                              onChange={handleInputChange}
                              readOnly={!isEditing}
                              className={!isEditing ? "bg-muted/50" : ""}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="birthDate" className="flex items-center gap-2 text-sm font-medium">
                              <Calendar className="h-4 w-4 text-primary" />
                              {t("tab1-birthDate")}
                            </Label>
                            <Input
                              id="birthDate"
                              name="birthDate"
                              type="date"
                              value={isEditing ? formData.birthDate : user.birthDate}
                              onChange={handleInputChange}
                              readOnly={!isEditing}
                              className={!isEditing ? "bg-muted/50" : ""}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="dni" className="flex items-center gap-2 text-sm font-medium">
                              <CreditCard className="h-4 w-4 text-primary" />
                              {t("tab1-dni")}
                            </Label>
                            <Input
                              id="dni"
                              name="dni"
                              value={isEditing ? formData.dni : user.dni}
                              onChange={handleInputChange}
                              readOnly={!isEditing}
                              className={!isEditing ? "bg-muted/50" : ""}
                            />
                          </div>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                          {isEditing ? (
                            <>
                              <Button
                                variant="outline"
                                type="button"
                                onClick={() => {
                                  setIsEditing(false)
                                  setFormData({ ...user })
                                }}
                                className="gap-2"
                              >
                                {t("tab1-button-cancel")}
                              </Button>
                              <Button type="submit" className="gap-2">
                                <CheckCircle className="h-4 w-4" />
                                {t("tab1-button-save")}
                              </Button>
                            </>
                          ) : (
                            <Button type="button" onClick={() => setIsEditing(true)} className="gap-2">
                              <User className="h-4 w-4" />
                              {t("tab1-button")}
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
                <Card className="border-muted/40 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Lock className="h-5 w-5 text-primary" />
                      {t("tab2-tittle")}
                    </CardTitle>
                    <CardDescription>{t("tab2-description")}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <form onSubmit={handlePasswordUpdate}>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword" className="flex items-center gap-2 text-sm font-medium">
                            <Lock className="h-4 w-4 text-primary" />
                            {t("tab2-currentPassword")}
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


                        <div className="space-y-2">
                          <Label htmlFor="newPassword" className="flex items-center gap-2 text-sm font-medium">
                            <Lock className="h-4 w-4 text-primary" />
                            {t("tab2-newPassword")}
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
                          <Label htmlFor="confirmPassword" className="flex items-center gap-2 text-sm font-medium">
                            <Lock className="h-4 w-4 text-primary" />
                            {t("tab2-confirmPassword")}
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
                          <Button type="submit" className="gap-2">
                            <CheckCircle className="h-4 w-4" />
                            {t("tab2-button")}
                          </Button>
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
