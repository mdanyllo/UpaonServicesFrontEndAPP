import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Phone, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/layout/Header"

type Provider = {
  id: string
  category: string
  description?: string
  rating: number
  user: {
    id: string
    name: string
    phone?: string
  }
}

export function ResultadosPesquisa() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)

  const [searchParams] = useSearchParams()

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


  return (
    <>
      <Header />

      <section className="min-h-screen bg-gradient-sunset pt-28 px-4">
        <div className="container mx-auto max-w-6xl">

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
                  <h2 className="font-semibold text-xl text-foreground">
                    {provider.user.name}
                  </h2>

                  <p className="text-sm text-muted-foreground mt-1">
                    {provider.category}
                  </p>

                  {provider.description && (
                    <p className="text-sm text-muted-foreground mt-3">
                      {provider.description}
                    </p>
                  )}
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="w-4 h-4 text-yellow-500" />
                    {provider.rating.toFixed(1)}
                  </div>

                  {provider.user.phone && (
                    <Button
                      variant="hero"
                      size="sm"
                      onClick={() =>
                        window.open(`tel:${provider.user.phone}`)
                      }
                    >
                      <Phone className="w-4 h-4 mr-1" />
                      Contato
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
