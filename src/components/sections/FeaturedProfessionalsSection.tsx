import { MapPin, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

type Professional = {
  id: string
  category: string
  description?: string
  rating?: number
  city?: string 
  user: {
    name: string
    avatarUrl?: string
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

    function irCadastro() {
    navigate("/cadastro")
  } 

  return (
    <section id="profissionais" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <span className="inline-block px-4 py-1.5 bg-sun/20 text-accent-foreground rounded-full text-sm font-semibold mb-4">
              Em Destaque
            </span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-2">
            {/*Profissionais bem avaliados*/} Profissionais novos na plataforma
            </h2>
            <p className="text-muted-foreground max-w-xl">
              {/*Conheça alguns dos profissionais mais bem avaliados da nossa plataforma*/} Conheça os primeiros usuários da plataforma
            </p>
          </div>
          <Button variant="outline" size="lg">
            Ver todos
          </Button>
        </div>

        {/* Professionals Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {!loading &&
            professionals.map((pro, index) => {
              const name = pro.user?.name || "Profissional"
              const avatarUrl =
                pro.user?.avatarUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  name
                )}&background=random`

              const rating =
                typeof pro.rating === "number" ? pro.rating : 5.0

              const city = pro.city || DEFAULT_CITY

              return (
                <div
                  key={pro.id}
                  className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-large transition-all duration-300 animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={avatarUrl}
                      alt={name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-palm" />
                      <span className="text-xs font-medium text-foreground">
                        Verificado
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-display font-semibold text-foreground">
                          {name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {pro.category}
                        </p>
                      </div>
                      {/*Mais pra frente */} {/*
                      <div className="flex items-center gap-1 bg-sun/20 px-2 py-1 rounded-lg">
                        <Star className="w-4 h-4 text-sun fill-sun" />
                        <span className="text-sm font-semibold text-accent-foreground">
                          {rating.toFixed(1)}
                        </span>
                      </div>*/}
                    </div>

                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                      <MapPin className="w-4 h-4" />
                      <span>{city}</span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div>
                        <span className="font-display font-bold text-lg text-foreground">
                          Sob consulta
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {" "}
                          /serviço
                        </span>
                      </div>
                      <Button onClick={irCadastro} variant="default" size="sm">
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
