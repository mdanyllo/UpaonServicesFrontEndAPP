import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Camera, Save, User, Briefcase, Mail, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input" // Se você usar input simples, pode manter, mas aqui usaremos textarea e select manuais

const CATEGORIES = [
  "Tecnologia", "Reparos", "Limpeza", "Pintura", "Construção",
  "Beleza", "Babá", "Cuidadores", "Culinária", "Mudança",
  "Fotografia", "Motoristas", "Outros",
]

export function EditProfile() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Estados de Carregamento e Dados
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false) // Mudei o nome pra ficar mais claro
  
  // Estados do Formulário
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  
  // Estados da Imagem
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // --- 1. EFEITO ÚNICO E PODEROSO (Segurança + Carregamento) ---
  useEffect(() => {
    const storedUser = localStorage.getItem("upaon_user")
    const storedToken = localStorage.getItem("upaon_token")

    // 1.1 Checa Login Básico
    if (!storedUser || !storedToken) {
      navigate("/login")
      return
    }

    try {
      const parsedUser = JSON.parse(storedUser)

      // 1.2 Checa se é Prestador
      if (parsedUser.role !== "PROVIDER") {
        console.warn("Acesso negado: Apenas prestadores podem editar perfil de serviço.")
        navigate("/dashboard/cliente", { replace: true })
        return
      }

      // 1.3 Se passou em tudo, preenche os estados
      setUser(parsedUser)
      
      // Preenche campos do formulário (com fallback para string vazia)
      setDescription(parsedUser.provider?.description || "")
      setCategory(parsedUser.provider?.category || "")
      setPreviewUrl(parsedUser.avatarUrl || null)
      
      // Libera o loading
      setIsLoading(false)

    } catch (error) {
      console.error("Erro ao processar usuário", error)
      localStorage.clear()
      navigate("/login")
    }
  }, [navigate])
  
  // 2. Lógica de Preview da Imagem
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)
    }
  }

  // 3. Enviar para o Backend
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)

    try {
      const token = localStorage.getItem("upaon_token")
      const formData = new FormData()

      formData.append("description", description)
      formData.append("category", category)
      
      if (selectedFile) {
        formData.append("avatar", selectedFile)
      }

      const res = await fetch("https://upaonservicesbackprototipo.onrender.com/users/profile", {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      })

      if (!res.ok) throw new Error("Erro ao atualizar perfil")

      const updatedUser = await res.json()
      
      // Atualiza o localStorage e o estado local
      localStorage.setItem("upaon_user", JSON.stringify(updatedUser))
      setUser(updatedUser) // Atualiza visualmente se a pessoa não sair da tela
      
      // Redireciona com feedback visual (opcional, aqui vai direto)
      navigate("/dashboard/prestador")

    } catch (error) {
      console.error(error)
      alert("Erro ao salvar perfil. Tente novamente.")
    } finally {
      setIsSaving(false)
    }
  }

  // --- TELA DE LOADING ---
  // (Importante vir antes de qualquer outro return)
  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-sunset">
            <div className="animate-spin text-primary">
                <Loader2 className="w-10 h-10" />
            </div>
        </div>
    )
  }

  // Se passou do loading e user ainda é null (caso raro de erro), não mostra nada
  if (!user) return null

  return (
    <section className="relative min-h-screen py-12 bg-gradient-sunset overflow-hidden flex items-center justify-center px-4">
      
      {/* Background Animado */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-ocean/20 rounded-full blur-3xl animate-pulse-soft" />
      </div>

      {/* Card Principal */}
      <div className="relative z-10 w-full max-w-2xl bg-card/80 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
        
        {/* Header do Card */}
        <div className="px-8 py-6 border-b border-border/50 flex items-center gap-4 bg-white/5">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/dashboard/prestador")} // Melhor forçar ir pro dashboard do que -1 (histórico)
            className="rounded-full hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">Editar Perfil</h1>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          {/* --- SEÇÃO DA FOTO --- */}
          <div className="flex flex-col items-center">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              {/* Círculo da Imagem */}
              <div className="w-32 h-32 rounded-full border-4 border-card bg-muted flex items-center justify-center overflow-hidden shadow-lg transition-transform group-hover:scale-105">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-muted-foreground/50" />
                )}
              </div>
              
              {/* Botão Flutuante da Câmera */}
              <div className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-md hover:bg-primary/90 transition-colors">
                <Camera className="w-5 h-5" />
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground font-medium">Toque para alterar a foto</p>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* --- CAMPOS READ-ONLY (Não editáveis) --- */}
            <div className="space-y-2 opacity-70">
              <label className="text-sm font-medium text-muted-foreground ml-1">Nome Completo</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/50 border border-border">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{user.name}</span>
              </div>
            </div>

            <div className="space-y-2 opacity-70">
              <label className="text-sm font-medium text-muted-foreground ml-1">E-mail</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/50 border border-border">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{user.email}</span>
              </div>
            </div>

            {/* --- CAMPOS EDITÁVEIS --- */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-foreground ml-1">Categoria de Serviço</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-input bg-card/50 px-10 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Selecione sua categoria</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-foreground ml-1">Sobre você e seu trabalho</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Trabalho com elétrica há 10 anos, sou pontual e..."
                className="flex min-h-[120px] w-full rounded-xl border border-input bg-card/50 px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              />
              <p className="text-xs text-muted-foreground text-right">
                {description.length} caracteres
              </p>
            </div>
          </div>

          {/* Footer com Ações */}
          <div className="flex items-center gap-4 pt-4 border-t border-border/50">
            <Button 
              type="button" 
              variant="ghost" 
              className="w-full rounded-xl"
              onClick={() => navigate("/dashboard/prestador")}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="hero" 
              className="w-full rounded-xl shadow-lg shadow-primary/20"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Salvar Alterações
                </>
              )}
            </Button>
          </div>

        </form>
      </div>
    </section>
  )
}