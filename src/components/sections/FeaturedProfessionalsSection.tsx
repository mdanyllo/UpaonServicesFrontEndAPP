import { MapPin, CheckCircle2, Star } from "lucide-react" // <--- Adicionei Star aqui
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

type Professional = {
  id: string
  category: string
  description?: string
  rating?: number
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

  const navigate = useNavigate()

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await fetch(
          "https://upaonservicesbackprototipo.onrender.com/providers"
        )

        const data = await res.json()

        if (Array.isArray(data)) {
          setProfessionals(data)
        } else {
          console.error("Resposta inesperada da API", data)
          setProfessionals([])
        }
      } catch (err) {
        console.error("Erro ao carregar profissionais em destaque", err)
        setProfessionals([])
      } finally {
        setLoading(false)
      }
    }

    loadFeatured()
  }, [])

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
    <section id="profissionais" className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 md:mb-12">
          <div>
            <span className="inline-block px-3 py-1 md:px-4 md:py-1.5 bg-sun/20 text-accent-foreground rounded-full text-xs md:text-sm font-semibold mb-3 md:mb-4">
              Em Destaque
            </span>
            <h2 className="font-display font-bold text-2xl md:text-4xl text-foreground mb-2">
              Profissionais novos na plataforma
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-xl">
              Conheça os primeiros usuários da plataforma
            </p>
          </div>
        </div>

        {/* Professionals Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {!loading &&
            professionals.map((pro, index) => {
              const name = pro.user?.name || "Profissional"
              const avatarUrl =
                pro.user?.avatarUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  name
                )}&background=random`

              // --- RESTAUREI O RATING AQUI ---
              const rating = typeof pro.rating === "number" ? pro.rating : 5.0
              // -------------------------------

              const city = pro.user.city || DEFAULT_CITY

              return (
                <div
                  key={pro.id}
                  className="group bg-card rounded-xl md:rounded-2xl border border-border overflow-hidden hover:shadow-large transition-all duration-300 animate-scale-in flex flex-col"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={avatarUrl}
                      alt={name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-card/90 backdrop-blur-sm rounded-full px-2 py-0.5 md:px-3 md:py-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 text-palm" />
                      <span className="text-[10px] md:text-xs font-medium text-foreground">
                        Verificado
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3 md:p-5 flex flex-col flex-1 justify-between">
                    <div>
                      {/* Flex container para Nome e Rating lado a lado */}
                      <div className="flex items-start justify-between mb-1 md:mb-2 gap-2">
                        <div className="min-w-0"> {/* min-w-0 ajuda a truncar o texto corretamente */}
                          <h3 className="font-display font-semibold text-sm md:text-lg text-foreground truncate">
                            {name}
                          </h3>
                          <p className="text-xs md:text-sm text-muted-foreground truncate">
                            {pro.category}
                          </p>
                        </div>
                        
                        {/* --- RATING VISUAL --- */}
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
                      <div>
                        <span className="font-display font-bold text-sm md:text-lg text-foreground block md:inline">
                          Sob consulta
                        </span>
                        <span className="hidden md:inline text-sm text-muted-foreground">
                          {" "}/serviço
                        </span>
                      </div>
                      <Button 
                        onClick={() => handleViewProfile(pro.id)} 
                        variant="default" 
                        size="sm"
                        className="w-full md:w-auto text-xs md:text-sm h-8 md:h-9"
                      >
                        Contratar
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </section>
  )
}

export default FeaturedProfessionalsSection