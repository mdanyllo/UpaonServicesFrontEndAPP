import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { 
  Search, MapPin, User, Heart, Clock, 
  LogOut, Wrench, Zap, Paintbrush, Hammer,
  LayoutDashboard // <--- Ícone para o botão de voltar
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Bar from "@/components/layout/headerCliente"

// Categorias visuais (Grid de ícones)
const QUICK_CATEGORIES = [
  { name: "Tecnologia", icon: Zap, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { name: "Reparos", icon: Wrench, color: "text-blue-500", bg: "bg-blue-500/10" },
  { name: "Limpeza", icon: Paintbrush, color: "text-green-500", bg: "bg-green-500/10" },
  { name: "Construção", icon: Hammer, color: "text-orange-500", bg: "bg-orange-500/10" },
]

// --- LÓGICA DE INTELIGÊNCIA DE PESQUISA (Importada do Hero) ---
const CATEGORIES_LIST = [
  "Tecnologia", "Reparos", "Limpeza", "Pintura", "Construção",
  "Beleza", "Babá", "Cuidadores", "Culinária", "Mudança",
  "Fotografia", "Motoristas", "Outros",
]

const KEYWORD_MAP: Record<string, string> = {
  "eletricista": "Reparos",
  "encanador": "Reparos",
  "conserto": "Reparos",
  "técnico": "Reparos",
  "diarista": "Limpeza",
  "faxina": "Limpeza",
  "limpeza": "Limpeza",
  "pedreiro": "Construção",
  "obra": "Construção",
  "pintor": "Pintura",
  "pintura": "Pintura",
  "babá": "Babá",
  "cuidador": "Cuidadores",
  "enfermeira": "Cuidadores",
  "motorista": "Motoristas",
  "uber": "Motoristas",
  "frete": "Mudança",
  "mudança": "Mudança",
  "bolo": "Culinária",
  "comida": "Culinária",
  "unha": "Beleza",
  "cabelo": "Beleza",
  "maquiagem": "Beleza",
  "computador": "Tecnologia",
  "formatar": "Tecnologia"
}
// ------------------------------------------------------------

type Provider = {
  id: string
  category: string
  city: string
  rating: number
  user: {
    name: string
    avatarUrl?: string | null
  }
}

export function ClienteDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [nearbyProviders, setNearbyProviders] = useState<Provider[]>([])
  const [searchText, setSearchText] = useState("")

  // --- FUNÇÃO AUXILIAR PARA FORMATAR TEXTO (Tira o Caps Lock) ---
  function formatText(text: string) {
    if (!text) return ""
    return text
      .toLowerCase()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  useEffect(() => {
    const storedUser = localStorage.getItem("upaon_user")
    if (!storedUser) {
      navigate("/login")
      return
    }
    setUser(JSON.parse(storedUser))
  }, [navigate])

  useEffect(() => {
    async function loadProviders() {
      try {
        const res = await fetch("https://upaonservicesbackprototipo.onrender.com/providers")
        const data = await res.json()
        setNearbyProviders(data.slice(0, 3))
      } catch (error) {
        console.error("Erro ao carregar prestadores", error)
      }
    }
    loadProviders()
  }, [])

  // --- LÓGICA DE PESQUISA INTELIGENTE ---
  function handleSearch() {
    const rawQuery = searchText.trim()
    if (!rawQuery) return

    const queryLower = rawQuery.toLowerCase()
    const params = new URLSearchParams()

    // 1. Verifica se é Categoria Exata
    const exactCategory = CATEGORIES_LIST.find(
      (cat) => cat.toLowerCase() === queryLower
    )

    if (exactCategory) {
      params.append("category", exactCategory)
    } 
    // 2. Verifica se está no Mapa de Palavras-Chave
    else if (KEYWORD_MAP[queryLower]) {
      params.append("category", KEYWORD_MAP[queryLower])
    }
    // 3. Busca Genérica
    else {
      params.append("q", rawQuery)
    }

    navigate(`/resultados?${params.toString()}`)
  }
  // -----------------------------------------------

  function handleLogout() {
    localStorage.removeItem("upaon_token")
    localStorage.removeItem("upaon_user")
    navigate("/")
  }

  // --- FUNÇÃO PARA VOLTAR AO PAINEL DE PRESTADOR ---
  function voltarParaPrestador() {
    navigate("/dashboard/prestador")
  }

  if (!user) return null

  const firstName = formatText(user.name.split(" ")[0])
  const userCity = user.provider?.city || "São Luís - MA"
  
  // Verifica se o usuário atual tem permissão de PROVIDER
  const isProvider = user.role === "PROVIDER"

  return (
    <>
      <Bar />

      {/* --- BOTÃO FLUTUANTE EXCLUSIVO PARA PRESTADORES --- */}
      {isProvider && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <Button 
            onClick={voltarParaPrestador}
            className="rounded-full shadow-2xl bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-6 gap-2 border-4 border-white dark:border-zinc-900 transition-transform hover:scale-105"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-bold">Voltar para Meu Painel</span>
          </Button>
        </div>
      )}
      {/* -------------------------------------------------- */}

      <main className="min-h-screen bg-gradient-sunset pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl space-y-12">

          {/* --- HERO SECTION DO USUÁRIO --- */}
          <section className="text-center space-y-6 animate-fade-in">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card/50 border border-white/10 text-foreground text-sm font-medium backdrop-blur-md shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              {userCity}
            </div>

            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">
              Olá, <span className="text-gradient-hero">{firstName}</span>. <br/>
              O que vamos resolver hoje?
            </h1>

            {/* Barra de Busca */}
            <div className="bg-card/80 backdrop-blur-md border border-white/20 p-2 rounded-2xl shadow-2xl max-w-2xl mx-auto flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex items-center gap-3 px-4 h-12">
                <Search className="w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="Busque por eletricista, limpeza, técnico..." 
                  className="border-0 bg-transparent focus-visible:ring-0 text-lg h-full placeholder:text-muted-foreground/50"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button size="lg" variant="hero" onClick={handleSearch} className="h-12 px-8 rounded-xl shadow-lg shadow-primary/20">
                Buscar
              </Button>
            </div>
          </section>


          {/* --- GRID DE ATALHOS RÁPIDOS --- */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto animate-fade-in delay-100">
            {QUICK_CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                onClick={() => navigate(`/resultados?category=${cat.name}`)}
                className="group bg-card/80 backdrop-blur-sm hover:bg-white border border-border hover:border-primary/30 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center gap-3"
              >
                <div className={`p-3 rounded-full ${cat.bg} group-hover:scale-110 transition-transform`}>
                  <cat.icon className={`w-6 h-6 ${cat.color}`} />
                </div>
                <span className="font-medium text-foreground">{cat.name}</span>
              </button>
            ))}
          </section>


          {/* --- MENU DE AÇÕES --- */}
          <section className="grid grid-cols-2 gap-4 max-w-2xl mx-auto animate-fade-in delay-200">
            {/* Card Favoritos */}
            <div className="bg-card/50 border border-white/10 rounded-2xl p-6 flex items-center justify-between hover:bg-card/80 transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="bg-pink-500/10 p-3 rounded-xl group-hover:bg-pink-500/20 transition-colors">
                  <Heart className="w-6 h-6 text-pink-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Favoritos</h3>
                  <p className="text-sm text-muted-foreground">Profissionais salvos</p>
                </div>
              </div>
              <div className="bg-muted px-2 py-1 rounded text-xs font-bold text-muted-foreground">0</div>
            </div>

            {/* Card Histórico */}
            <div className="bg-card/50 border border-white/10 rounded-2xl p-6 flex items-center justify-between hover:bg-card/80 transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="bg-blue-500/10 p-3 rounded-xl group-hover:bg-blue-500/20 transition-colors">
                  <Clock className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Histórico</h3>
                  <p className="text-sm text-muted-foreground">Serviços recentes</p>
                </div>
              </div>
              <div className="bg-muted px-2 py-1 rounded text-xs font-bold text-muted-foreground">0</div>
            </div>
          </section>


          {/* --- PRÓXIMOS DE VOCÊ --- */}
          <section className="animate-fade-in delay-300 max-w-5xl mx-auto w-full">
            <div className="flex items-center justify-between mb-6 px-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Próximos de você</h2>
              </div>
              <Button variant="link" onClick={() => navigate("/resultados")}>Ver todos</Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {nearbyProviders.map((provider) => (
                <div 
                  key={provider.id} 
                  className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-start gap-4 hover:scale-[1.02] duration-300 cursor-pointer"
                  onClick={() => {/* Futuro: Ir para detalhes do prestador */}}
                >
                  <div className="w-12 h-12 rounded-full bg-muted overflow-hidden flex-shrink-0 border border-border">
                    {provider.user.avatarUrl ? (
                      <img src={provider.user.avatarUrl} className="w-full h-full object-cover" alt={provider.user.name} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><User className="w-6 h-6 text-muted-foreground"/></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-foreground truncate">{formatText(provider.user.name)}</h4>
                    
                    <p className="text-xs text-primary font-bold mb-1 truncate">
                      {formatText(provider.category)}
                    </p>
                    
                    <div className="flex items-center gap-1 text-xs text-muted-foreground truncate">
                       <MapPin className="w-3 h-3 flex-shrink-0" /> {provider.city}
                    </div>
                  </div>
                  
                  {/* Mais pra frente */} {/*
                  <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-lg self-start">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-bold text-yellow-700">{provider.rating.toFixed(1)}</span>
                  </div>*/}
                </div>
              ))}
            </div>
          </section>

          {/* Botão de Logout */}
          <div className="flex justify-center pt-8">
            <Button variant="ghost" className="text-muted-foreground hover:text-red-500 gap-2 hover:bg-red-500/10 rounded-xl px-6" onClick={handleLogout}>
              <LogOut className="w-4 h-4" /> Sair da conta
            </Button>
          </div>

        </div>
      </main>
    </>
  )
}