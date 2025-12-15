import { Search, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

type Stats = {
  providers: number
  clients: number
  services: number
}

const HeroSection = () => {
  const navigate = useNavigate()

  const cities = [
    { name: "São Luís-MA", time: 8000 },
    { name: "Paço do Lumiar-MA", time: 4000 },
    { name: "São José de Ribamar-MA", time: 4000 },
    { name: "Raposa-MA", time: 4000 },
    { name: "Ilha do Amor", time: 6000 },
  ]

  const [index, setIndex] = useState(0)
  const [stats, setStats] = useState<Stats | null>(null)
  const [searchText, setSearchText] = useState("")

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
      const res = await fetch(
        "https://upaonservicesbackprototipo.onrender.com/stats"
      )
      const data = await res.json()
      setStats(data)
    }

    loadStats()
  }, [])

 //pesquisar categorias e serviços
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

  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-gradient-sunset">
      {/* BG */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-ocean/10 rounded-full blur-3xl animate-pulse-soft" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">

          {/* Cidade */}
          <div className="mt-2 inline-flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-border rounded-full px-4 py-2 mb-8">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              {cities[index].name}
            </span>
          </div>

          <h1 className="font-display font-bold text-4xl md:text-6xl text-foreground mb-6">
            Encontre os melhores{" "}
            <span className="text-gradient-hero">profissionais</span>
          </h1>

          <p className="text-lg text-muted-foreground mb-10">
            Do conserto ao cuidado, tudo que você precisa em um só lugar.
          </p>

          {/* Busca */}
          <div className="bg-card rounded-2xl p-2 shadow-large max-w-2xl mx-auto">
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

          {/* Populares */}
          <div className="mt-8">
            <p className="text-sm text-muted-foreground mb-3">
              Buscas populares:
            </p>

            <div className="flex flex-wrap justify-center gap-2">
              {["Eletricista", "Diarista", "Encanador", "Pintor", "Cuidador"].map(
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

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-xl mx-auto">
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
          </div>

        </div>
      </div>
    </section>
  )
}

export default HeroSection
