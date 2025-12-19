import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, User, Loader2, Phone, MapPin, Briefcase, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { API_URL } from "@/config/api"

const CATEGORIES = ["Tecnologia", "Reparos", "Limpeza", "Pintura", "Construção", "Beleza", "Babá", "Cuidadores", "Culinária", "Mudança", "Fotografia", "Motoristas", "Outros"]

const CITIES = [
  "São Luís - MA",
  "São José de Ribamar - MA",
  "Paço do Lumiar - MA",
  "Raposa - MA"
]

export function EditProfilePrestador() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
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
      // Se não for prestador, manda pro cliente
      if (parsedUser.role !== "PROVIDER") {
        navigate("/dashboard/cliente/perfil")
        return
      }
      
      setUser(parsedUser)
      setDescription(parsedUser.provider?.description || "")
      setCategory(parsedUser.provider?.category || "")
      setName(parsedUser.name || "")
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

      // DADOS DE PRESTADOR
      formData.append("description", description)
      formData.append("category", category)
      
      // DADOS COMUNS
      formData.append("name", name)
      formData.append("phone", phone)
      formData.append("city", city)
      formData.append("neighborhood", neighborhood)
      
      if (selectedFile) formData.append("avatar", selectedFile)

      const res = await fetch(`${API_URL}/users/profile`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData,
      })

      if (!res.ok) throw new Error("Erro")

      const updatedUser = await res.json()
      localStorage.setItem("upaon_user", JSON.stringify(updatedUser))
      toast.success("Perfil atualizado com sucesso!")
      navigate("/dashboard/prestador")

    } catch (error) {
      toast.error("Erro ao salvar perfil.")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto"/></div>

  return (
    <section className="min-h-screen py-10 px-4 bg-gradient-sunset flex justify-center items-center">
      <div className="w-full max-w-xl bg-card rounded-3xl shadow-xl overflow-hidden">
        <div className="p-6 border-b flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/prestador")}>
                <ArrowLeft />
            </Button>
            <h1 className="text-xl font-bold">Editar Perfil Profissional</h1>
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
                    <div className="relative">
                        <User className="absolute left-3 top-2.5 w-5 h-5 text-muted-foreground" />
                        <Input value={name} onChange={e => setName(e.target.value)}  className="pl-10"/>
                    </div>
                </div>
                <div>
                    <label className="text-sm font-medium">Categoria</label>
                    <div className="relative">
                        <Briefcase className="absolute left-3 top-2.5 w-5 h-5 text-muted-foreground pointer-events-none" />
                        <select 
                            value={category} 
                            onChange={e => setCategory(e.target.value)} 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <option value="">Selecione...</option>
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>
                <div>
                    <label className="text-sm font-medium">Descrição</label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                        <textarea 
                            value={description} 
                            onChange={e => setDescription(e.target.value)} 
                            className="w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm min-h-[100px] ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        />
                    </div>
                </div>
                 <div>
                    <label className="text-sm font-medium">Telefone / WhatsApp</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-2.5 w-5 h-5 text-muted-foreground" />
                        <Input value={phone} onChange={e => setPhone(e.target.value)} className="pl-10" />
                    </div>
                </div>
                
                <div>
                    <label className="text-sm font-medium">Cidade</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 w-5 h-5 text-muted-foreground pointer-events-none" />
                        <select 
                            value={city} 
                            onChange={e => setCity(e.target.value)} 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>

                 <div>
                    <label className="text-sm font-medium">Bairro</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 w-5 h-5 text-muted-foreground" />
                        <Input value={neighborhood} onChange={e => setNeighborhood(e.target.value)} placeholder="Ex: Cohab" className="pl-10" />
                    </div>
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