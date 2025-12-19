import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { 
  MapPin, Star, ArrowLeft, ShieldCheck, 
  Clock, User, MessageCircle 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Bar from "@/components/layout/headerCliente"
import { ReviewsSection } from "@/components/ReviewsSection"
import { toast } from "sonner"

// 1. HELPER PARA FORMATAR TEXTO (Adicionado aqui)
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

  // ESTADO NOVO: Controla a tela de redirecionamento
  const [isRedirecting, setIsRedirecting] = useState(false)

  // 1. Carrega Prestador
  useEffect(() => {
    const storedUser = localStorage.getItem("upaon_user")
    if (!storedUser) {
      navigate("/cadastro")
      return
    }

    setUser(JSON.parse(storedUser))

    async function fetchProvider() {
      try {
        const res = await fetch("https://upaonservicesbackprototipo.onrender.com/providers")
        const data = await res.json()
        const found = data.find((p: any) => p.id === id)
        setProvider(found)
      } catch (error) {
        console.error("Erro ao buscar prestador", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProvider()
  }, [id, navigate])

  // 2. Função do WhatsApp com DELAY e TELA DE AVISO
  function handleWhatsApp() {
    if (!provider || !provider.user.phone) {
      toast.error("Este prestador não cadastrou um telefone válido.")
      return
    }

    // Salva a métrica de clique
    if (user && user.id) {
        fetch(`https://upaonservicesbackprototipo.onrender.com/providers/${provider.id}/contact`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ clientId: user.id })
        }).catch(err => console.error("Erro ao salvar metrica", err))
    }

    // Prepara o link
    const cleanPhone = provider.user.phone.replace(/\D/g, "")
    const finalPhone = cleanPhone.length <= 11 ? `55${cleanPhone}` : cleanPhone
    const message = `Olá ${provider.user.name}, vi seu perfil na UpaonServices e gostaria de fazer um orçamento.`
    const url = `https://wa.me/${finalPhone}?text=${encodeURIComponent(message)}`

    // --- AQUI A MÁGICA ACONTECE ---
    setIsRedirecting(true) // Mostra a tela de aviso

    setTimeout(() => {
        window.open(url, "_blank") // Abre o WhatsApp
        setIsRedirecting(false)    // Fecha a tela de aviso
    }, 4000) // Espera 4 segundos (4000ms)
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
      
      {/* --- TELA DE REDIRECIONAMENTO (OVERLAY) --- */}
      {isRedirecting && (
        <div className="fixed inset-0 z-[9999] bg-gradient-sunset flex flex-col items-center justify-center text-center px-6 animate-in fade-in duration-300">
            
            {/* Ícone Estrela */}
            <div className="bg-white/20 p-6 rounded-full mb-6 animate-bounce border border-white/30 backdrop-blur-sm shadow-xl">
                <Star className="w-12 h-12 text-yellow-400 fill-yellow-400" />
            </div>
            
            <h2 className="text-2xl md:text-4xl font-bold font-display text-foreground drop-shadow-md">
                Estamos te conectando...
            </h2>
            <span className="text-foreground font-display font-bold block mt-4 mb-5 text-base md:text-2xl">
                Não esqueça de voltar aqui para avaliar {formatText(provider.user.name.split(" ").slice(0, 2).join(" "))}!
            </span>

            {/* BARRA DE PROGRESSO LARANJA */}
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

      {/* --- CONTEÚDO NORMAL DA PÁGINA --- */}
      <div className="min-h-screen bg-gradient-sunset pt-24 pb-12 px-4">
        
        <div className="max-w-4xl mx-auto mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="text-zinc-800 hover:bg-white/20 gap-2 pl-0">
            <ArrowLeft className="w-5 h-5" /> Voltar
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          
          {/* CARTÃO PRINCIPAL */}
          <div className="bg-card/90 backdrop-blur-md border border-white/20 rounded-3xl p-6 md:p-10 shadow-xl relative overflow-hidden flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
            
            <div className="absolute top-0 left-0 w-full h-24 md:h-full md:w-32 bg-gradient-to-b md:bg-gradient-to-r from-primary/10 to-transparent" />

            {/* AVATAR */}
            <div className="relative z-10 w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-card shadow-lg overflow-hidden bg-muted flex-shrink-0">
                {provider.user.avatarUrl ? (
                  <img src={provider.user.avatarUrl} className="w-full h-full object-cover" alt={providerName} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                    <User className="w-16 h-16" />
                  </div>
                )}
            </div>

            {/* INFORMAÇÕES */}
            <div className="relative z-10 flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-1">{formatText(providerName)}</h1>
                <p className="text-primary font-bold text-lg">{provider.category}</p>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <span className="bg-yellow-500/10 text-yellow-600 px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1 border border-yellow-500/20">
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" /> {provider.rating.toFixed(1)}
                </span>
                <span className="bg-muted px-3 py-1.5 rounded-full text-sm text-muted-foreground flex items-center gap-1 border border-border">
                  <MapPin className="w-3.5 h-3.5" /> {formatText(provider.user.city)}
                </span>
              </div>

              {/* DESCRIÇÃO */}
              <div className="bg-background/50 rounded-xl p-4 text-sm text-muted-foreground leading-relaxed border border-white/5">
                {provider.description || "Este profissional oferece serviços especializados na categoria, mas ainda não adicionou uma descrição detalhada."}
              </div>

              {/* BOTÃO WHATSAPP */}
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

          {/* BENEFÍCIOS / SELOS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-card/50 backdrop-blur-sm border border-white/10 p-4 rounded-2xl flex items-center gap-4">
              <div className="bg-green-500/10 p-3 rounded-full">
                <ShieldCheck className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Identidade Verificada</h3>
                <p className="text-xs text-muted-foreground">Profissional checado pela plataforma</p>
              </div>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-white/10 p-4 rounded-2xl flex items-center gap-4">
              <div className="bg-blue-500/10 p-3 rounded-full">
                <Clock className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Resposta Rápida</h3>
                <p className="text-xs text-muted-foreground">Costuma responder em menos de 1h</p>
              </div>
            </div>
          </div>

        </div>
        <ReviewsSection providerId={id || ""} />
      </div>
    </>
  )
}