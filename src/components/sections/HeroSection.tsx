import { Search, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { API_URL } from "@/config/api"

type Stats = {
  providers: number
  clients: number
  services: number
}

const HeroSection = () => {
  const navigate = useNavigate()

  const cities = [
    { name: "São Luís-MA", time: 3000 },
    { name: "Paço do Lumiar-MA", time: 3000 },
    { name: "São José de Ribamar-MA", time: 3000 },
    { name: "Raposa-MA", time: 3000 },
    { name: "Ilha do Amor", time: 4000 },
  ]

  const [index, setIndex] = useState(0)
  const [stats, setStats] = useState<Stats | null>(null)
  const [searchText, setSearchText] = useState("")

  //Vê se tá logado
      useEffect(() => {
        const storedUser = localStorage.getItem("upaon_user")
        const storedToken = localStorage.getItem("upaon_token")
    
        if (storedUser && storedToken) {
          const user = JSON.parse(storedUser)
          
          // Redireciona imediatamente baseado no tipo de usuário
          if (user.role === "PROVIDER") {
            navigate("/dashboard/prestador", { replace: true })
          } else {
            navigate("/dashboard/cliente", { replace: true })
          }
        }
      }, [navigate])

  // animação das cidades
  useEffect(() => {
    const timer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % cities.length)
    }, cities[index].time)

    return () => clearTimeout(timer)
  }, [index])

  // stats
  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch(
          `${API_URL}/stats`
        )
        const data = await res.json()
        setStats(data)
      } catch (error) {
        console.error("Erro ao carregar stats", error)
      }
    }

    loadStats()
  }, [])

  // --- LÓGICA DE PESQUISA INTELIGENTE ---

  const CATEGORIES = [
    "Tecnologia", "Reparos", "Limpeza", "Pintura", "Construção",
    "Beleza", "Babá", "Cuidadores", "Culinária", "Mudança",
    "Fotografia", "Motoristas", "Outros",
  ]

  // Mapa para traduzir termos comuns em Categorias do sistema
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

  function handleSearch(value?: string) {
    // 1. Pega o termo digitado ou clicado
    const rawQuery = (value ?? searchText).trim()
    if (!rawQuery) return

    const queryLower = rawQuery.toLowerCase()
    const params = new URLSearchParams()

    // 2. Verifica se o termo JÁ É uma categoria exata (Ex: clicou em "Limpeza")
    const exactCategory = CATEGORIES.find(
      (cat) => cat.toLowerCase() === queryLower
    )

    if (exactCategory) {
      params.append("category", exactCategory)
    } 
    // 3. Verifica se o termo está no nosso MAPA (Ex: digitou "Eletricista" -> vira "Reparos")
    else if (KEYWORD_MAP[queryLower]) {
      params.append("category", KEYWORD_MAP[queryLower])
    }
    // 4. Se não achou categoria, manda como busca de texto genérica (q)
    else {
      params.append("q", rawQuery)
    }

    navigate(`/resultados?${params.toString()}`)
  }

  // -------------------------------------

  return (
    <section className="relative py-10 md:py-16 md:mt-10 md:min-h-[85vh] flex items-center pt-20 overflow-hidden bg-gradient-sunset">
      {/* BG */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-ocean/10 rounded-full blur-3xl animate-pulse-soft" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">

          {/* Cidade */}
          <div className="inline-flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-border rounded-full px-4 py-2 mb-8 animate-fade-in">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              {cities[index].name}
            </span>
          </div>

          <h1 className="font-display font-bold text-4xl md:text-6xl text-foreground mb-6 animate-fade-in">
            Encontre os melhores{" "}
            <span className="text-gradient-hero">profissionais</span>{" "}
            da Ilha
          </h1>

          <p className="text-lg text-muted-foreground mb-10 animate-fade-in">
            Conectamos você a trabalhadores qualificados para qualquer serviço. Do conserto ao cuidado, tudo que você precisa está aqui
          </p>

          {/* Busca */}
          <div className="bg-card rounded-2xl p-2 shadow-large max-w-2xl mx-auto animate-fade-in">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex items-center gap-3 px-4">
                <Search className="w-5 h-5 text-muted-foreground" />
                <Input
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleSearch()
                  }
                  placeholder="Que serviço você precisa?"
                  className="border-0 bg-transparent focus-visible:ring-0"
                />
              </div>

              <Button
                variant="hero"
                size="lg"
                onClick={() => handleSearch()}
              >
                Buscar
              </Button>
            </div>
          </div>

          {/* Recomendadas */}
          <div className="mt-8">
            <p className="text-sm text-muted-foreground mb-3 animate-fade-in">
              Buscas recomendadas:
            </p>

            <div className="flex justify-center gap-2 animate-fade-in">
              {["Eletricista", "Diarista", "Babá", "Encanador"].map(
                (service) => (
                  <button
                    key={service}
                    onClick={() => handleSearch(service)}
                    className="px-4 py-2 bg-card border border-border rounded-full text-sm hover:bg-muted"
                  >
                    {service}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Stats - Desativado por enquanto
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-xl mx-auto animate-fade-in">
            <div>
              <p className="font-bold text-2xl">{stats?.providers ?? 0}</p>
              <p className="text-sm text-muted-foreground">Profissionais</p>
            </div>
            <div>
              <p className="font-bold text-2xl">{stats?.clients ?? 0}</p>
              <p className="text-sm text-muted-foreground">Usuários</p>
            </div>
            <div>
              <p className="font-bold text-2xl">10+</p>
              <p className="text-sm text-muted-foreground">Categorias</p>
            </div>
          </div> */}

        </div>
      </div>
    </section>
  )
}

export default HeroSection