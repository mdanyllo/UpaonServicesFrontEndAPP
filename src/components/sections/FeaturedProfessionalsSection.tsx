import { MapPin, Star, Loader2, Plus, Shield, Rocket } from "lucide-react" 
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { API_URL } from "@/config/api"
import { toast } from "sonner"

type Professional = {
  id: string
  category: string
  description?: string
  rating?: number
  isFeatured: boolean
  user: {
    name: string
    avatarUrl?: string
    city?: string
  }
}

const DEFAULT_CITY = "São Luís - MA"

const FeaturedProfessionalsSection = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    loadFeatured(1, true) 
  }, [])

  async function loadFeatured(currentPage: number, isInitial = false) {
    try {
      if (isInitial) setLoading(true)
      else setLoadingMore(true)

      // Aumentamos o limite para 50 para garantir que capturemos os destaques 
      // que o backend ordenou para o topo antes de filtrarmos os normais.
      const LIMIT = 50 
      const res = await fetch(
        `${API_URL}/providers?page=${currentPage}&limit=${LIMIT}`
      )

      const responseData = await res.json()
      
      let fetchedPros: Professional[] = []
      let meta = null

      if (Array.isArray(responseData)) {
        fetchedPros = responseData
      } else if (responseData && Array.isArray(responseData.data)) {
        fetchedPros = responseData.data
        meta = responseData.meta
      }

      // --- LÓGICA DE FILTRO ADICIONADA: APENAS ISFEATURED TRUE ---
      const onlyFeatured = fetchedPros.filter(pro => pro.isFeatured === true)

      if (isInitial) {
        setProfessionals(onlyFeatured)
      } else {
        setProfessionals((prev) => {
            const combined = [...prev, ...onlyFeatured]
            const uniqueMap = new Map()
            combined.forEach(item => uniqueMap.set(item.id, item))
            return Array.from(uniqueMap.values())
        })
      }

      // Lógica de parada baseada nos dados brutos do fetch
      if (fetchedPros.length < LIMIT || (meta && currentPage >= meta.lastPage)) {
        setHasMore(false)
      }

    } catch (err) {
      toast.error("Erro ao carregar profissionais em destaque")
      console.error(err)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  function handleLoadMore() {
    const nextPage = page + 1
    setPage(nextPage)
    loadFeatured(nextPage)
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

  return (
    <section id="profissionais" className="py-12 md:py-20 overflow-hidden bg-background">
      <div className="container mx-auto px-4">
        
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 md:mb-12">
          <div>
            <span className="inline-block px-3 py-1 md:px-4 md:py-1.5 bg-yellow-500/20 text-yellow-600 rounded-full text-xs md:text-sm font-bold mb-3 md:mb-4 border border-yellow-500/20">
              Em Destaque
            </span>
            <h2 className="font-display font-bold text-2xl md:text-4xl text-foreground mb-2">
              Profissionais em Destaque
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-xl">
              Conheça os profissionais recomendados.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {professionals.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                {professionals.map((pro, index) => {
                  const name = pro.user?.name || "Profissional"
                  const avatarUrl = pro.user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
                  const rating = typeof pro.rating === "number" ? pro.rating : 5.0
                  const city = pro.user.city || DEFAULT_CITY

                  return (
                    <div
                      key={pro.id}
                      className="group bg-card rounded-xl md:rounded-2xl border border-border overflow-hidden hover:shadow-large transition-all duration-300 animate-scale-in flex flex-col"
                      style={{ animationDelay: `${(index % 8) * 0.1}s` }}
                    >
                      <div className="relative aspect-square overflow-hidden">
                        {pro.isFeatured && (
                            <div className="absolute top-2 left-2 right-2 z-20 flex justify-between items-start">
                  
                              {/* Selo 1: Destaque (Esquerda) */}
                              <div title="Esse profissional é destaque" className="flex items-center gap-1.5 rounded-full bg-gradient-to-b from-yellow-300 to-yellow-500 px-2.5 py-1 text-[10px] font-bold uppercase text-yellow-950 shadow-lg border-t border-white/50">
                                <Shield className="h-3.5 w-3.5 fill-yellow-900 text-yellow-900" />
                                <span>Destaque</span>
                              </div>

                              {/* Selo 2: Rocket (Direita) */}
                              <div title="Esse profissional é destaque" className="bg-gradient-hero rounded-full text-white shadow-lg shadow-orange-500/20 md:p-2 p-1.5 flex items-center justify-center border-t border-white/20">
                                <Rocket className="h-3.5 w-3.5" />
                              </div>
                            </div>
                        )}
                        <img
                          src={avatarUrl}
                          alt={name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      <div className="p-3 md:p-5 flex flex-col flex-1 justify-between">
                        <div>
                          <div className="flex items-start justify-between mb-1 md:mb-2 gap-2">
                            <div className="min-w-0">
                              <h3 className="font-display font-semibold text-sm md:text-lg text-foreground truncate">
                                {name}
                              </h3>
                              <p className="text-xs md:text-sm text-muted-foreground truncate">
                                {pro.category}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 bg-yellow-500/10 px-1.5 py-0.5 md:px-2 md:py-1 rounded-md flex-shrink-0 border border-yellow-500/20">
                              <Star className="w-3 h-3 md:w-3.5 md:h-3.5 fill-yellow-500 text-yellow-500" />
                              <span className="text-xs md:text-sm font-bold text-yellow-600">
                                {rating.toFixed(1)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">
                            <MapPin className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                            <span className="truncate">{city}</span>
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pt-3 md:pt-4 border-t border-border gap-2 md:gap-0">
                          <span className="font-display font-bold text-sm md:text-lg text-foreground">
                            Sob consulta
                          </span>
                          <Button 
                            onClick={() => handleViewProfile(pro.id)} 
                            variant="default" 
                            size="sm"
                            className="w-full md:w-auto text-xs md:text-sm h-8 md:h-9 bg-primary hover:opacity-90 transition-all"
                          >
                            Contratar
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-border rounded-3xl">
                <Shield className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                <p className="text-muted-foreground font-medium">Nenhum profissional em destaque ainda.</p>
              </div>
            )}
          </>
        )}

        {hasMore && !loading && professionals.length > 0 && (
          <div className="flex justify-center mt-12">
            <Button 
              variant="outline" 
              size="lg" 
              onClick={handleLoadMore} 
              disabled={loadingMore}
              className="gap-2 rounded-xl border-primary/20 hover:border-primary/50 text-primary transition-all shadow-sm"
            >
              {loadingMore ? <Loader2 className="animate-spin w-5 h-5"/> : <Plus className="w-5 h-5"/>}
              Ver mais destaques
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}

export default FeaturedProfessionalsSection