import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { 
  MapPin, Star, ArrowLeft, ShieldCheck, 
  Clock, User, MessageCircle, Shield, Rocket 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Bar from "@/components/layout/headerCliente"
import { ReviewsSection } from "@/components/ReviewsSection"
import { toast } from "sonner"
import { API_URL } from "@/config/api"

function formatText(text?: string) {
  if (!text) return ""
  return text
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export function PrestadorDetalhes() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [provider, setProvider] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("upaon_user")
    if (!storedUser) {
      navigate("/cadastro")
      return
    }

    setUser(JSON.parse(storedUser))

    async function fetchProvider() {
      try {
        const res = await fetch(`${API_URL}/providers?limit=100`) 
        const responseData = await res.json()

        let list: any[] = []
        
        if (Array.isArray(responseData)) {
            list = responseData
        } else if (responseData && Array.isArray(responseData.data)) {
            list = responseData.data
        }

        const found = list.find((p: any) => p.id === id)
        setProvider(found)

      } catch (error) {
        console.error("Erro ao buscar prestador", error)
        toast.error("Erro ao carregar detalhes do prestador.")
      } finally {
        setLoading(false)
      }
    }
    fetchProvider()
  }, [id, navigate])

  function handleWhatsApp() {
    if (!provider || !provider.user.phone) {
      toast.error("Este prestador não cadastrou um telefone válido.")
      return
    }

    if (user && user.id) {
        fetch(`${API_URL}/providers/${provider.id}/contact`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ clientId: user.id })
        }).catch(err => console.error("Erro ao salvar metrica", err))
    }

    const cleanPhone = provider.user.phone.replace(/\D/g, "")
    const finalPhone = cleanPhone.length <= 11 ? `55${cleanPhone}` : cleanPhone
    const message = `Olá ${provider.user.name}, vi seu perfil na UpaonServices e gostaria de fazer um orçamento.`
    const url = `https://wa.me/${finalPhone}?text=${encodeURIComponent(message)}`

    setIsRedirecting(true)

    setTimeout(() => {
        window.open(url, "_blank")
        setIsRedirecting(false)    
    }, 4000) 
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white bg-gradient-sunset">Carregando...</div>
  
  if (!provider) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white bg-gradient-sunset gap-4">
      <p>Prestador não encontrado.</p>
      <Button onClick={() => navigate(-1)} variant="outline">Voltar</Button>
    </div>
  )

  const providerName = provider.user.name

  return (
    <>
      <Bar />
      
      {isRedirecting && (
        <div className="fixed inset-0 z-[9999] bg-gradient-sunset flex flex-col items-center justify-center text-center px-6 animate-in fade-in duration-300">
            
            <div className="bg-white/20 p-6 rounded-full mb-6 animate-bounce border border-white/30 backdrop-blur-sm shadow-xl">
                <Star className="w-12 h-12 text-yellow-400 fill-yellow-400" />
            </div>
            
            <h2 className="text-2xl md:text-4xl font-bold font-display text-foreground drop-shadow-md">
                Estamos te conectando...
            </h2>
            <span className="text-foreground font-display font-bold block mt-4 mb-5 text-base md:text-2xl">
                Não esqueça de voltar aqui para avaliar {formatText(provider.user.name.split(" ").slice(0, 2).join(" "))}!
            </span>

            <div className="w-64 h-2 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
                <div className="h-full bg-gradient-to-r from-orange-400 to-orange-600 animate-[progress_4s_ease-in-out_forwards]" style={{ width: '0%' }} />
                <style>{`
                    @keyframes progress {
                        0% { width: 0%; }
                        100% { width: 100%; }
                    }
                `}</style>
            </div>
            
            <p className="mt-4 text-sm text-white/60">Abrindo WhatsApp em instantes...</p>
        </div>
      )}

      <div className="min-h-screen bg-gradient-sunset pt-24 pb-12 px-4">
        
        <div className="max-w-4xl mx-auto mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="text-zinc-800 hover:bg-white/20 gap-2 pl-0">
            <ArrowLeft className="w-5 h-5" /> Voltar
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          
          <div className="bg-card/90 backdrop-blur-md border border-white/20 rounded-3xl p-6 md:p-10 shadow-xl relative overflow-hidden flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
            
            <div className="absolute top-0 left-0 w-full h-24 md:h-full md:w-32 bg-gradient-to-b md:bg-gradient-to-r from-primary/10 to-transparent" />

            <div className="relative z-10 w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-card shadow-lg overflow-hidden bg-muted flex-shrink-0">
                {provider.user.avatarUrl ? (
                  <img src={provider.user.avatarUrl} className="w-full h-full object-cover" alt={providerName} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                    <User className="w-16 h-16" />
                  </div>
                )}
            </div>

            <div className="relative z-10 flex-1 space-y-4 w-full">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-1">{formatText(providerName)}</h1>
                
                {/* LÓGICA DE SELOS NO PERFIL */}
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <p className="text-primary font-bold text-lg">{provider.category}</p>
                  
                  {provider.isFeatured && (
                    <div className="flex items-center gap-1.5 ml-1">
                      <div title="Esse profissional é destaque" className="flex items-center gap-1 rounded-full bg-gradient-to-b from-yellow-300 to-yellow-500 px-2 py-0.5 text-[10px] font-bold uppercase text-yellow-950 shadow-sm border-t border-white/50">
                        <Shield className="h-3 w-3 fill-yellow-900 text-yellow-900" />
                        <span>Destaque</span>
                      </div>
                      <div title="Esse profissional é destaque" className="bg-gradient-hero rounded-full text-white shadow-sm p-1 flex items-center justify-center border-t border-white/20">
                        <Rocket className="h-3 w-3" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <span className="bg-yellow-500/10 text-yellow-600 px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1 border border-yellow-500/20">
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" /> {provider.rating ? provider.rating.toFixed(1) : "5.0"}
                </span>
                <span className="bg-muted px-3 py-1.5 rounded-full text-sm text-muted-foreground flex items-center gap-1 border border-border">
                  <MapPin className="w-3.5 h-3.5" /> {formatText(provider.user.city)}
                </span>
              </div>

              <div className="bg-background/50 rounded-xl p-4 text-sm text-muted-foreground leading-relaxed border border-white/5">
                {provider.description || "Este profissional oferece serviços especializados na categoria, mas ainda não adicionou uma descrição detalhada."}
              </div>

              <div className="pt-2">
                <Button 
                  size="lg" 
                  onClick={handleWhatsApp}
                  disabled={isRedirecting}
                  className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-bold h-14 px-8 rounded-xl shadow-lg shadow-green-600/20 flex items-center justify-center gap-2 transition-all hover:scale-105"
                >
                  <MessageCircle className="w-6 h-6" />
                  Chamar no WhatsApp
                </Button>
                <p className="text-xs text-muted-foreground mt-3">
                  Negocie valores e horários diretamente com o profissional.
                </p>
              </div>
            </div>
          </div>
        </div>
        <ReviewsSection providerId={id || ""} />
      </div>
    </>
  )
}