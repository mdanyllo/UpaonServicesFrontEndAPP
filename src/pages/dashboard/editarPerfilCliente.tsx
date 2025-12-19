import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Camera, Save, User, Mail, Loader2, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input" 

export function EditProfileCliente() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  const [phone, setPhone] = useState("")
  const [city, setCity] = useState("")
  const [neighborhood, setNeighborhood] = useState("")
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("upaon_user")
    const storedToken = localStorage.getItem("upaon_token")

    if (!storedUser || !storedToken) {
      navigate("/login")
      return
    }

    try {
      const parsedUser = JSON.parse(storedUser)
      // Se for prestador, chuta ele pra tela certa
      if (parsedUser.role === "PROVIDER") {
        navigate("/dashboard/prestador/perfil")
        return
      }
      setUser(parsedUser)
      setPhone(parsedUser.phone || "")
      setCity(parsedUser.city || "São Luís - MA")
      setNeighborhood(parsedUser.neighborhood || "")
      setPreviewUrl(parsedUser.avatarUrl || null)
      setIsLoading(false)
    } catch (error) {
      localStorage.clear()
      navigate("/login")
    }
  }, [navigate])
  
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)

    try {
      const token = localStorage.getItem("upaon_token")
      const formData = new FormData()

      formData.append("phone", phone)
      formData.append("city", city)
      formData.append("neighborhood", neighborhood)
      
      if (selectedFile) formData.append("avatar", selectedFile)

      const res = await fetch("https://upaonservicesbackprototipo.onrender.com/users/profile", {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData,
      })

      if (!res.ok) throw new Error("Erro")

      const updatedUser = await res.json()
      localStorage.setItem("upaon_user", JSON.stringify(updatedUser))
      navigate("/dashboard/cliente")

    } catch (error) {
      alert("Erro ao salvar perfil.")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto"/></div>

  return (
    <section className="min-h-screen py-10 px-4 bg-gradient-sunset flex justify-center items-center">
      <div className="w-full max-w-xl bg-card rounded-3xl shadow-xl overflow-hidden">
        <div className="p-6 border-b flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/cliente")}>
                <ArrowLeft />
            </Button>
            <h1 className="text-xl font-bold">Editar Meu Perfil</h1>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="flex flex-col items-center">
                <div onClick={() => fileInputRef.current?.click()} className="relative cursor-pointer w-28 h-28 rounded-full bg-muted overflow-hidden border-4 border-white shadow-lg">
                    {previewUrl ? <img src={previewUrl} className="w-full h-full object-cover"/> : <User className="w-12 h-12 m-auto mt-6 opacity-50"/>}
                    <div className="absolute bottom-0 w-full bg-black/50 text-white text-xs text-center py-1">Alterar</div>
                </div>
                <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageChange}/>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="text-sm font-medium">Nome</label>
                    <Input value={user.name} disabled className="bg-muted"/>
                </div>
                <div>
                    <label className="text-sm font-medium">Telefone / WhatsApp</label>
                    <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="(98) 99999-9999"/>
                </div>
                 <div>
                    <label className="text-sm font-medium">Bairro</label>
                    <Input value={neighborhood} onChange={e => setNeighborhood(e.target.value)} placeholder="Ex: Cohab"/>
                </div>
                <div>
                    <label className="text-sm font-medium">Cidade</label>
                    <Input value={city} onChange={e => setCity(e.target.value)} />
                </div>
            </div>

            <Button type="submit" disabled={isSaving} className="w-full" variant="hero">
                {isSaving ? "Salvando..." : "Salvar Alterações"}
            </Button>
        </form>
      </div>
    </section>
  )
}