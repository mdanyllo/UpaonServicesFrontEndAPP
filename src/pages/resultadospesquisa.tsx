import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { Star, User, Search, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Fora from "@/components/layout/headerFora"
import Bar from "@/components/layout/headerCliente"

type Provider = {
  id: string
  category: string
  description?: string
  rating: number
  user: {
    id: string
    name: string
    phone?: string
    avatarUrl?: string | null
    city: string
    neighborhood?: string
  }
}

function formatText(text?: string) {
  if (!text) return ""
  return text
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export function ResultadosPesquisa() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const [searchText, setSearchText] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const navigate = useNavigate()

  const category = searchParams.get("category")
  const q = searchParams.get("q")

  useEffect(() => {
    async function loadProviders() {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (category) params.append("category", category)
        if (q) params.append("q", q)

        const res = await fetch(
          `https://upaonservicesbackprototipo.onrender.com/providers?${params.toString()}`
        )

        if (!res.ok) throw new Error("Erro na resposta da API")

        const data = await res.json()
        setProviders(data)
      } catch (err) {
        console.error("Erro ao buscar prestadores", err)
        setProviders([])
      } finally {
        setLoading(false)
      }
    }

    loadProviders()
  }, [category, q])

  const CATEGORIES = [
    "Tecnologia", "Reparos", "Limpeza", "Pintura", "Construção",
    "Beleza", "Babá", "Cuidadores", "Culinária", "Mudança",
    "Fotografia", "Motoristas", "Outros",
  ]

  function handleSearch(value?: string) {
    const query = (value ?? searchText).trim()
    if (!query) return

    const params = new URLSearchParams()
    const matchedCategory = CATEGORIES.find(
      (cat) => cat.toLowerCase() === query.toLowerCase()
    )

    if (matchedCategory) {
      params.append("category", matchedCategory)
    } else {
      params.append("q", query)
    }

    navigate(`/resultados?${params.toString()}`)
  }

  function handleViewProfile(providerId: string) {
    const token = localStorage.getItem("upaon_token")

    if (!token) {
      localStorage.setItem("redirect_after_login", `/prestador/${providerId}`)
      navigate("/cadastro") 
    } else {
      navigate(`/prestador/${providerId}`)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("upaon_token")
    const user = localStorage.getItem("upaon_user")
    setIsLoggedIn(!!(token && user))
  }, [])

  return (
    <>
      {isLoggedIn ? <Bar /> : <Fora />}

      <section className="min-h-screen bg-gradient-sunset pt-28 px-4">
        <div className="container mx-auto max-w-6xl">

          {/* Busca */}
          <div className="bg-card mb-6 rounded-2xl p-2 shadow-large max-w-2xl mx-auto animate-fade-in">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex items-center gap-3 px-4">
                <Search className="w-5 h-5 text-muted-foreground" />
                <Input
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
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

          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground">
              Resultados para{" "}
              <span className="text-gradient-hero capitalize">
                {category || q || "sua pesquisa"}
              </span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Profissionais disponíveis para atender você
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center text-muted-foreground py-10">
              <div className="animate-pulse flex justify-center mb-2">Carregando...</div>
            </div>
          )}

          {/* Empty */}
          {!loading && providers.length === 0 && (
            <p className="text-center text-muted-foreground py-10">
              Nenhum prestador encontrado para essa pesquisa.
            </p>
          )}

          {/* Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className="bg-card/90 backdrop-blur-sm border border-border rounded-2xl shadow-large p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300"
              >
                <div>
                  {/* --- CABEÇALHO DO CARD COM FOTO --- */}
                  <div className="flex items-start gap-4 mb-4">
                    {/* Container da Foto */}
                    <div className="relative w-14 h-14 rounded-full overflow-hidden bg-muted flex-shrink-0 border border-border/50 shadow-sm">
                      {provider.user.avatarUrl ? (
                        <img
                          src={provider.user.avatarUrl}
                          alt={provider.user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <img 
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(provider.user.name)}&background=random`} 
                            alt={provider.user.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      )}
                    </div>

                    {/* Nome e Categoria */}
                    <div className="overflow-hidden">
                      <h2 className="font-semibold text-lg text-foreground leading-tight truncate">
                        {formatText(provider.user.name)}
                      </h2>
                      <p className="text-sm text-primary font-medium mt-1 truncate">
                        {provider.category}
                      </p>
                    </div>
                  </div>
                  
                  {provider.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {provider.description}
                    </p>
                  )}
                </div>

                {/* Localização */}
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-auto">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate max-w-[220px]">
                    {provider.user.neighborhood 
                      ? `${formatText(provider.user.neighborhood)} - ${formatText(provider.user.city)}` 
                      : formatText(provider.user.city)
                    }
                  </span>
                </div>

                {/* --- FOOTER: RATING + BOTÃO --- */}
                <div className="mt-4 flex items-center gap-3 pt-4 border-t border-border/50">
                  
                  {/* Rating Badge (VOLTOU AQUI) */}
                  <div className="flex items-center gap-1.5 bg-yellow-500/10 px-3 py-2 rounded-xl border border-yellow-500/20 shadow-sm">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    <span className="font-bold text-yellow-600 text-sm">
                      {provider.rating ? provider.rating.toFixed(1) : "5.0"}
                    </span>
                  </div>

                  {/* Botão */}
                  <Button
                    variant="hero"
                    size="sm"
                    className="rounded-xl flex-1 h-10 font-semibold"
                    onClick={() => handleViewProfile(provider.id)}
                  >
                    Ver perfil
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}