import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { 
  Search, MapPin, MapPinOff, User, Heart, Clock, 
  LogOut, Wrench, Zap, Paintbrush, Hammer,
  LayoutDashboard 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Bar from "@/components/layout/headerCliente"

const QUICK_CATEGORIES = [
  { name: "Tecnologia", icon: Zap, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { name: "Reparos", icon: Wrench, color: "text-blue-500", bg: "bg-blue-500/10" },
  { name: "Limpeza", icon: Paintbrush, color: "text-green-500", bg: "bg-green-500/10" },
  { name: "Construção", icon: Hammer, color: "text-orange-500", bg: "bg-orange-500/10" },
]

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

type Provider = {
  id: string
  category: string
  
  rating: number
  user: {
    name: string
    avatarUrl?: string | null
    city: string
  }
}

export function ClienteDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [nearbyProviders, setNearbyProviders] = useState<Provider[]>([])
  const [searchText, setSearchText] = useState("")

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
      if (!user) return 

      try {
        const params = new URLSearchParams()
        if (user.city) params.append("city", user.city)
        if (user.neighborhood) params.append("neighborhood", user.neighborhood)

        const res = await fetch(`https://upaonservicesbackprototipo.onrender.com/providers?${params.toString()}`)
        
        const data = await res.json()
        setNearbyProviders(data.slice(0, 10))
      } catch (error) {
        console.error("Erro ao carregar prestadores", error)
      }
    }

    loadProviders()
  }, [user])

  function handleSearch() {
    const rawQuery = searchText.trim()
    if (!rawQuery) return

    const queryLower = rawQuery.toLowerCase()
    const params = new URLSearchParams()

    const exactCategory = CATEGORIES_LIST.find(
      (cat) => cat.toLowerCase() === queryLower
    )

    if (exactCategory) {
      params.append("category", exactCategory)
    } else if (KEYWORD_MAP[queryLower]) {
      params.append("category", KEYWORD_MAP[queryLower])
    } else {
      params.append("q", rawQuery)
    }

    navigate(`/resultados?${params.toString()}`)
  }

  function handleLogout() {
    localStorage.removeItem("user_token")
    localStorage.removeItem("upaon_token")
    localStorage.removeItem("upaon_user")
    navigate("/")
  }

  function voltarParaPrestador() {
    navigate("/dashboard/prestador")
  }

  if (!user) return null

  const firstName = formatText(user.name.split(" ")[0])
  const userCity = user.city
  const isProvider = user.role === "PROVIDER"

  return (
    <>
      <Bar />

      {isProvider && (
        <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 animate-fade-in">
          <Button 
            onClick={voltarParaPrestador}
            className="rounded-full shadow-2xl bg-primary text-primary-foreground hover:bg-primary/90 h-12 w-12 md:h-14 md:w-auto md:px-6 gap-2 border-4 border-white dark:border-zinc-900 transition-transform hover:scale-105 flex items-center justify-center"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="hidden md:inline font-bold">Voltar para perfil de Prestador</span>
          </Button>
        </div>
      )}

      <main className="min-h-screen bg-gradient-sunset pt-20 md:pt-24 pb-6 px-4">
        <div className="container mx-auto max-w-6xl space-y-8 md:space-y-12">

          <section className="text-center space-y-4 md:space-y-6 animate-fade-in">
            
            <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-card/50 border border-white/10 text-foreground text-xs md:text-sm font-medium backdrop-blur-md shadow-sm">
              <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5 text-primary" />
              {userCity}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground">
              Olá, <span className="text-gradient-hero">{firstName}</span>. <br className="hidden sm:block"/>
              <span className="block mt-1 sm:mt-0">O que vamos resolver hoje?</span>
            </h1>

            <div className="bg-card/80 backdrop-blur-md border border-white/20 p-2 rounded-2xl shadow-2xl max-w-2xl mx-auto flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex items-center gap-3 px-3 md:px-4 h-12 bg-white/5 rounded-xl sm:bg-transparent">
                <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <Input 
                  placeholder="Eletricista, limpeza..." 
                  className="border-0 bg-transparent focus-visible:ring-0 text-base md:text-lg h-full placeholder:text-muted-foreground/50 p-0 w-full"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button size="lg" variant="hero" onClick={handleSearch} className="h-12 w-full sm:w-auto px-8 rounded-xl shadow-lg shadow-primary/20">
                Buscar
              </Button>
            </div>
          </section>

          <p className="text-xs text-center md:text-base text-muted-foreground animate-fade-in delay-100">Categorias recomendadas</p>
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto animate-fade-in delay-100">
            {QUICK_CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                onClick={() => navigate(`/resultados?category=${cat.name}`)}
                className="group bg-card/80 backdrop-blur-sm hover:bg-white border border-border hover:border-primary/30 p-4 md:p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center gap-2 md:gap-3"
              >
                <div className={`p-2.5 md:p-3 rounded-full ${cat.bg} group-hover:scale-110 transition-transform`}>
                  <cat.icon className={`w-5 h-5 md:w-6 md:h-6 ${cat.color}`} />
                </div>
                <span className="font-medium text-sm md:text-base text-foreground">{cat.name}</span>
              </button>
            ))}
          </section>
          <div className="flex items-center justify-end max-w-5xl mx-auto w-full mb-4 md:mb-6 px-1">
          <Button variant="link" size="sm" onClick={() => navigate("/categorias")}>Ver todas</Button>
          </div>

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 max-w-2xl mx-auto animate-fade-in delay-200">
            <div className="bg-card/50 border border-white/10 rounded-2xl p-4 md:p-6 flex items-center justify-between hover:bg-card/80 transition-colors cursor-pointer group">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="bg-pink-500/10 p-2.5 md:p-3 rounded-xl group-hover:bg-pink-500/20 transition-colors">
                  <Heart className="w-5 h-5 md:w-6 md:h-6 text-pink-500" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-foreground text-sm md:text-base">Favoritos</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">Profissionais salvos</p>
                </div>
              </div>
              <div className="bg-muted px-2 py-1 rounded text-xs font-bold text-muted-foreground">0</div>
            </div>

            <div className="bg-card/50 border border-white/10 rounded-2xl p-4 md:p-6 flex items-center justify-between hover:bg-card/80 transition-colors cursor-pointer group">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="bg-blue-500/10 p-2.5 md:p-3 rounded-xl group-hover:bg-blue-500/20 transition-colors">
                  <Clock className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-foreground text-sm md:text-base">Histórico</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">Serviços recentes</p>
                </div>
              </div>
              <div className="bg-muted px-2 py-1 rounded text-xs font-bold text-muted-foreground">0</div>
            </div>
          </section>

          <section className="animate-fade-in delay-300 max-w-5xl mx-auto w-full">
            <div className="flex items-center justify-between mb-4 md:mb-6 px-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                <h2 className="text-lg md:text-2xl font-bold text-foreground">Próximos de você</h2>
              </div>
              <Button variant="link" size="sm" onClick={() => navigate("/resultados")}>Ver todos</Button>
            </div>

            {nearbyProviders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {nearbyProviders.map((provider) => (
                  <div 
                    key={provider.id} 
                    className="bg-card border border-border rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md transition-all flex items-start gap-3 md:gap-4 hover:scale-[1.02] duration-300 cursor-pointer"
                    onClick={() => {navigate(`/prestador/${provider.id}`)}}
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-muted overflow-hidden flex-shrink-0 border border-border">
                      {provider.user.avatarUrl ? (
                        <img src={provider.user.avatarUrl} className="w-full h-full object-cover" alt={provider.user.name} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><User className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground"/></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 text-left">
                      <h4 className="font-bold text-foreground truncate text-sm md:text-base">{formatText(provider.user.name)}</h4>
                      
                      <p className="text-xs text-primary font-bold mb-0.5 md:mb-1 truncate">
                        {formatText(provider.category)}
                      </p>
                      
                      <div className="flex items-center gap-1 text-xs text-muted-foreground truncate">
                          <MapPin className="w-3 h-3 flex-shrink-0" /> {provider.user.city}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 bg-card/30 rounded-2xl border border-white/5 border-dashed">
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
                   <MapPinOff className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium text-foreground">Nenhum profissional por perto</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    Ainda não encontramos prestadores no seu bairro ou cidade. Tente buscar por uma categoria específica.
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate("/resultados")}>
                  Ver todos os prestadores
                </Button>
              </div>
            )}
          </section>

          <div className="flex justify-center pt-4 md:pt-8 pb-4">
            <Button variant="ghost" className="text-muted-foreground hover:text-red-500 gap-2 hover:bg-red-500/10 rounded-xl px-6 text-sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" /> Sair da conta
            </Button>
          </div>

        </div>
      </main>
    </>
  )
}