import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { 
  MapPin, Star, ArrowLeft, ShieldCheck, 
  Clock, User, MessageCircle 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Bar from "@/components/layout/headerCliente"

export function PrestadorDetalhes() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [provider, setProvider] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const [user, setUser] = useState<any>(null)

  // 1. Carrega Prestador
  useEffect(() => {
    // Verifica se tem usuário logado (proteção básica)
    const storedUser = localStorage.getItem("upaon_user")
    if (!storedUser) {
      navigate("/cadastro")
      return
    }

    async function fetchProvider() {
      try {
        // Buscando da lista geral (mesma lógica de antes)
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

  // 2. Função do WhatsApp
  function handleWhatsApp() {
    if (!provider || !provider.user.phone) {
      alert("Este prestador não cadastrou um telefone válido.")
      return
    }

    if (user && user.id) {
        fetch(`https://upaonservicesbackprototipo.onrender.com/providers/${provider.id}/contact`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ clientId: user.id })
        }).catch(err => console.error("Erro ao salvar metrica", err))
    }

    // Limpa o telefone (deixa apenas números)
    const cleanPhone = provider.user.phone.replace(/\D/g, "")
    
    // Adiciona o código do Brasil (55) se não tiver
    // Assume que se tiver 10 ou 11 dígitos, é um número BR sem DDI
    const finalPhone = cleanPhone.length <= 11 ? `55${cleanPhone}` : cleanPhone

    // Mensagem automática
    const message = `Olá ${provider.user.name}, vi seu perfil na UpaonServices e gostaria de fazer um orçamento.`
    
    // Cria o link da API
    const url = `https://wa.me/${finalPhone}?text=${encodeURIComponent(message)}`

    // Abre em nova aba
    window.open(url, "_blank")
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
      <div className="min-h-screen bg-gradient-sunset pt-24 pb-12 px-4">
        
        {/* HEADER DE VOLTAR */}
        <div className="max-w-4xl mx-auto mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="text-zinc-800 hover:bg-white/20 gap-2 pl-0">
            <ArrowLeft className="w-5 h-5" /> Voltar
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          
          {/* CARTÃO PRINCIPAL */}
          <div className="bg-card/90 backdrop-blur-md border border-white/20 rounded-3xl p-6 md:p-10 shadow-xl relative overflow-hidden flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
            
            {/* Fundo decorativo no topo (mobile) ou lateral (desktop) */}
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
                <h1 className="text-3xl font-bold text-foreground mb-1">{providerName}</h1>
                <p className="text-primary font-bold text-lg">{provider.category}</p>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <span className="bg-yellow-500/10 text-yellow-600 px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1 border border-yellow-500/20">
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" /> {provider.rating.toFixed(1)}
                </span>
                <span className="bg-muted px-3 py-1.5 rounded-full text-sm text-muted-foreground flex items-center gap-1 border border-border">
                  <MapPin className="w-3.5 h-3.5" /> {provider.user.city}
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

          {/* BENEFÍCIOS / SELOS (Opcional, pra dar credibilidade) */}
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
      </div>
    </>
  )
}