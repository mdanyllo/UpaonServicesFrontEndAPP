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
  }
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
    "Tecnologia",
    "Reparos",
    "Limpeza",
    "Pintura",
    "Construção",
    "Beleza",
    "Babá",
    "Cuidadores",
    "Culinária",
    "Mudança",
    "Fotografia",
    "Motoristas",
    "Outros",
  ]

  function handleSearch(value?: string) {
    const query = (value ?? searchText).trim()
    if (!query) return

    const params = new URLSearchParams()

    // verifica se o texto é uma categoria
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
      // 1. SALVA A INTENÇÃO: "O usuário queria ver o prestador X"
      localStorage.setItem("redirect_after_login", `/prestador/${providerId}`)
      
      // 2. Manda para o Login (ou Cadastro)
      navigate("/cadastro") 
    } else {
      // Se já está logado, vai direto
      navigate(`/prestador/${providerId}`)
    }
  }

  useEffect(() => {
    // Verifica se existem os dados chaves no LocalStorage
    const token = localStorage.getItem("token")
    const user = localStorage.getItem("upaon_user")

    if (token && user) {
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
    }
  }, [])

  return (
    <>
      {/* 3. RENDERIZAÇÃO CONDICIONAL */}
      {isLoggedIn ? (
        <Bar /> 
      ) : (
        <Fora  />
      )}

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
            <p className="text-center text-muted-foreground">
              Carregando prestadores...
            </p>
          )}

          {/* Empty */}
          {!loading && providers.length === 0 && (
            <p className="text-center text-muted-foreground">
              Nenhum prestador encontrado para essa pesquisa.
            </p>
          )}

          {/* Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className="bg-card/90 backdrop-blur-sm border border-border rounded-2xl shadow-large p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform"
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
                          <User className="w-7 h-7" />
                        </div>
                      )}
                    </div>

                    {/* Nome e Categoria */}
                    <div>
                      <h2 className="font-semibold text-lg text-foreground leading-tight">
                        {provider.user.name}
                      </h2>
                      <p className="text-sm text-primary font-medium mt-1">
                        {provider.category}
                      </p>
                    </div>
                  </div>
                  
                  {provider.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {provider.description}
                    </p>
                  )}
                </div>

                {/* Cidade com Ícone */}
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-4">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate max-w-[150px]">{provider.user.city}</span>
                </div>

                <div className="mt-6 flex items-center justify-between pt-4 border-t border-border/50">
                  {/* Botão Ver Perfil com Lógica de Auth */}
                  <Button
                    variant="hero"
                    size="sm"
                    className="rounded-xl w-full"
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