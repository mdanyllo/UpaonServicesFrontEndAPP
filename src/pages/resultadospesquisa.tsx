import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { Star, User, Search, MapPin, Loader2, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Fora from "@/components/layout/headerFora"
import Bar from "@/components/layout/headerCliente"
import { API_URL } from "@/config/api"

type Provider = {
  id: string
  category: string
  description?: string
  rating: number
  user: {
    id: string
    name: string
    avatarUrl?: string | null
    city: string
    neighborhood?: string
  }
}

function formatText(text?: string) {
  if (!text) return ""
  return text.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
}

export function ResultadosPesquisa() {
  // ESTADOS
  // Inicializamos com array vazio para garantir que nunca seja undefined
  const [providers, setProviders] = useState<Provider[]>([]) 
  const [loading, setLoading] = useState(false)
  
  // ESTADOS DE PAGINAÇÃO
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const [searchParams] = useSearchParams()
  const [searchText, setSearchText] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate()

  const category = searchParams.get("category")
  const q = searchParams.get("q")

  // 1. Reseta e recarrega quando muda a busca
  useEffect(() => {
    setProviders([])
    setPage(1)
    setHasMore(true)
    loadProviders(1, true)
  }, [category, q])

  // 2. LÓGICA DE PAGINAÇÃO CORRIGIDA E BLINDADA
  async function loadProviders(currentPage: number, isNewSearch = false) {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (category) params.append("category", category)
      if (q) params.append("q", q)
      
      // Parâmetros de Paginação
      params.append("page", currentPage.toString())
      params.append("limit", "10") 

      const res = await fetch(`${API_URL}/providers?${params.toString()}`)
      
      if (!res.ok) throw new Error("Erro na API")
      
      const responseData = await res.json()

      let newList: Provider[] = []
      let meta = null

      // --- PROTEÇÃO CONTRA FORMATO DE DADOS ---
      if (Array.isArray(responseData)) {
        // Caso o Backend ainda esteja mandando o formato antigo (Array direto)
        newList = responseData
      } else if (responseData && Array.isArray(responseData.data)) {
        // Caso o Backend esteja mandando o formato novo (Objeto com data)
        newList = responseData.data
        meta = responseData.meta
      } else {
        // Se vier qualquer outra coisa (erro ou objeto vazio), garantimos lista vazia
        newList = []
      }

      if (isNewSearch) {
        setProviders(newList)
      } else {
        setProviders((prev) => [...(prev || []), ...newList])
      }

      // Verifica se acabou as páginas
      if (meta && currentPage >= meta.lastPage) {
        setHasMore(false)
      } else if (newList.length === 0) {
        // Se não veio nada e não tem meta, assumimos que acabou
        setHasMore(false)
      }

    } catch (err) {
      console.error("Erro ao buscar", err)
      // Em caso de erro, não quebramos a lista existente se for carregamento extra
      if (isNewSearch) setProviders([]) 
    } finally {
      setLoading(false)
    }
  }

  function handleLoadMore() {
    const nextPage = page + 1
    setPage(nextPage)
    loadProviders(nextPage, false)
  }

  const CATEGORIES = ["Tecnologia", "Reparos", "Limpeza", "Pintura", "Construção", "Beleza", "Babá", "Cuidadores", "Culinária", "Mudança", "Fotografia", "Motoristas", "Outros"]

  function handleSearch(value?: string) {
    const query = (value ?? searchText).trim()
    if (!query) return
    const params = new URLSearchParams()
    const matchedCategory = CATEGORIES.find((cat) => cat.toLowerCase() === query.toLowerCase())
    if (matchedCategory) params.append("category", matchedCategory)
    else params.append("q", query)
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
    setIsLoggedIn(!!token)
  }, [])

  return (
    <>
      {isLoggedIn ? <Bar /> : <Fora />}

      <section className="min-h-screen bg-gradient-sunset pt-28 px-4 pb-20">
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
              <Button variant="hero" size="lg" onClick={() => handleSearch()}>Buscar</Button>
            </div>
          </div>

          <div className="mb-10 text-center">
             <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground">
              Resultados para <span className="text-gradient-hero capitalize">{category || q || "sua pesquisa"}</span>
            </h1>
            <p className="text-muted-foreground mt-2">
               Profissionais disponíveis para atender você
            </p>
          </div>

          {/* GRID DE CARDS */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* AQUI ESTAVA O ERRO: Adicionei (providers || []).map para proteger */}
            {Array.isArray(providers) && providers.map((provider) => (
              <div key={provider.id} className="bg-card/90 backdrop-blur-sm border border-border rounded-2xl shadow-large p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300">
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden bg-muted flex-shrink-0 border border-border/50 shadow-sm">
                      {provider.user.avatarUrl ? (
                        <img src={provider.user.avatarUrl} alt={provider.user.name} className="w-full h-full object-cover" />
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
                    
                    <div className="overflow-hidden">
                      <h2 className="font-semibold text-lg text-foreground leading-tight truncate">{formatText(provider.user.name)}</h2>
                      <p className="text-sm text-primary font-medium mt-1 truncate">{provider.category}</p>
                    </div>
                  </div>

                  {provider.description && <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{provider.description}</p>}
                </div>

                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-auto">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate max-w-[220px]">
                    {provider.user.neighborhood ? `${formatText(provider.user.neighborhood)} - ${formatText(provider.user.city)}` : formatText(provider.user.city)}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-3 pt-4 border-t border-border/50">
                  <div className="flex items-center gap-1.5 bg-yellow-500/10 px-3 py-2 rounded-xl border border-yellow-500/20 shadow-sm">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    <span className="font-bold text-yellow-600 text-sm">{provider.rating ? provider.rating.toFixed(1) : "5.0"}</span>
                  </div>
                  <Button variant="hero" size="sm" className="rounded-xl flex-1 h-10 font-semibold" onClick={() => handleViewProfile(provider.id)}>Ver perfil</Button>
                </div>
              </div>
            ))}
          </div>
          
          {/* MENSAGEM DE VAZIO */}
          {!loading && providers.length === 0 && (
            <p className="text-center text-muted-foreground py-10">Nenhum prestador encontrado.</p>
          )}

          {/* LOADING INICIAL */}
          {loading && providers.length === 0 && (
             <div className="text-center text-muted-foreground py-10">
                <div className="animate-pulse flex justify-center mb-2">Carregando...</div>
             </div>
          )}

          {/* BOTÃO CARREGAR MAIS */}
          {hasMore && providers.length > 0 && (
            <div className="flex justify-center mt-12">
                <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={handleLoadMore} 
                    disabled={loading}
                    className="gap-2 rounded-xl border-primary/20 hover:bg-primary/5 hover:border-primary/50 text-primary transition-all"
                >
                    {loading ? <Loader2 className="animate-spin w-5 h-5"/> : <Plus className="w-5 h-5"/>}
                    {loading ? "Carregando..." : "Carregar mais profissionais"}
                </Button>
            </div>
          )}

        </div>
      </section>
    </>
  )
}