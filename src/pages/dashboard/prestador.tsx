import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { 
  User, 
  Star, 
  LogOut, 
  MapPin, 
  Settings,
  Loader2,
  ShoppingBag,
  MessageCircle, 
  Eye,
  Calendar,
  ArrowRight,
  Rocket
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { API_URL } from "@/config/api"

function statusAvaliacao(rating: number) {
  // Lógica das faixas de nota
  if (rating >= 4.5) {
    return { label: "Excelente", color: "text-green-500", bg: "bg-green-500/10" }
  }
  
  if (rating >= 3.5) {
    return { label: "Bom", color: "text-cyan-500", bg: "bg-cyan-500/10" }
  }

  if (rating >= 2.5) {
    return { label: "Ruim", color: "text-red-500", bg: "bg-red-500/10" }
  }

  // Abaixo de 2.5
  return { label: "Atenção", color: "text-red-800", bg: "bg-red-800/10" }
}



// Função auxiliar para formatar data
function formatDate(dateString: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

function formatText(text?: string) {
  if (!text) return ""
  return text
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export default function ProviderDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Stats guarda contagem e logs
  const [stats, setStats] = useState<{ contacts: number, logs: any[] }>({ contacts: 0, logs: [] }) 

  useEffect(() => {
    const storedUser = localStorage.getItem("upaon_user")
    const storedToken = localStorage.getItem("upaon_token")

    if (!storedUser || !storedToken) {
      navigate("/login")
      return
    }

    // --- LÓGICA DE CARREGAMENTO CORRIGIDA ---
    async function loadDashboardData() {
      try {
        const parsedUser = JSON.parse(storedUser!)

        // 1. Verifica Permissão
        if (parsedUser.role !== "PROVIDER") {
          toast.error("Acesso restrito a prestadores.")
          navigate("/dashboard/cliente", { replace: true })
          return
        }

        // 2. BUSCA DADOS ATUALIZADOS DO USUÁRIO (Corrige o bug de dados sumindo)
        // Primeiro setamos o do cache pra ser rápido
        let currentUser = parsedUser 
        
        try {
            const userRes = await fetch(`${API_URL}/users/${parsedUser.id}`, {
                headers: { "Authorization": `Bearer ${storedToken}` }
            })
            
            if (userRes.ok) {
                const freshUser = await userRes.json()
                currentUser = freshUser
                localStorage.setItem("upaon_user", JSON.stringify(freshUser))
            }
        } catch (err) {
            console.error("Erro ao atualizar perfil, usando cache.", err)
        }

        setUser(currentUser)

        // 3. BUSCA ESTATÍSTICAS E LOGS
        // Usa o ID do provider (pode vir do cache ou do freshUser)
        const providerId = currentUser.provider?.id || parsedUser.provider?.id

        if (providerId) {
          const statsRes = await fetch(`${API_URL}/providers/${providerId}/stats`)
          const statsData = await statsRes.json()
          
          setStats({
            contacts: statsData.contacts || 0,
            logs: statsData.logs || []
          })
        }

      } catch (error) {
        console.error("Erro geral no dashboard", error)
        localStorage.clear()
        navigate("/login")
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()

  }, [navigate])

  function handleLogout() {
    localStorage.removeItem("upaon_token")
    localStorage.removeItem("upaon_user")
    toast.success("Você saiu da conta.")
    navigate("/")
  }

  function editarPerfil() {
    navigate("/dashboard/prestador/perfil")
  } 

  function irParaModoCliente() {
    navigate("/dashboard/cliente")
  }

  if (isLoading || !user) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-sunset">
            <div className="animate-spin text-primary">
                <Loader2 className="w-10 h-10" />
            </div>
        </div>
    )
  }

  const currentRating = user.provider?.rating || 0
  const status = statusAvaliacao(currentRating)

  return (
    <section className="relative min-h-screen pt-14 md:pt-18 pb-12 bg-gradient-sunset overflow-hidden">
      
      {/* --- BG ANIMADO --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-ocean/10 rounded-full blur-3xl animate-pulse-soft" />
      </div>

    <div className="container flex flex-col mx-auto px-4 relative z-10">
        
        {/* --- HEADER DO DASHBOARD --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 animate-fade-in">
          <div className="md:ml-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-2 border border-primary/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Painel do Prestador
            </div>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground">
              Olá, <span className="text-gradient-hero">{formatText(user.name.split(" ")[0])}</span>
            </h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> 
              {user.city || "São Luís - MA"} • {user.provider?.category || "Profissional"}
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Button 
                onClick={irParaModoCliente} 
                variant="ghost" 
                size="sm" 
                className="rounded-xl gap-2 shadow-lg hover:shadow-primary/25 transition-all"
            >
                <ShoppingBag className="w-4 h-4" /> Modo Cliente
            </Button>

            <Button onClick={editarPerfil} size="sm" variant="ghost"  className="rounded-xl gap-2 shadow-lg hover:shadow-primary/25 transition-all">
              <Settings className="w-4 h-4" /> Editar Perfil
            </Button>
            
            <Button variant="outline" size="sm" className="rounded-xl gap-2 shadow-lg hover:shadow-primary/25 transition-all" onClick={handleLogout}>
              <LogOut className="w-4 h-4" /> Sair
            </Button>
          </div>
        </div>

        {/* --- GRID DE ESTATÍSTICAS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 animate-fade-in order-2 lg:order-1" style={{ animationDelay: "100ms" }}>
          
          {/* Card 1: Avaliação */}
          <div className="bg-card/60 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-large hover:bg-card/80 transition-colors group">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500 group-hover:scale-110 transition-transform">
                <Star className="w-6 h-6 fill-yellow-500" />
              </div>
              <div id="avaliacao">
                <span className={`text-xs font-medium ${status.bg} ${status.color} px-2 py-1 rounded-full`}>
                  {status.label}
                </span>
              </div>
            </div>
            <h3 className={`text-3xl font-bold mt-4 text-foreground`}>
              {user.provider?.rating ? user.provider.rating.toFixed(1) : "5.0"}
            </h3>
            <p className="text-sm text-muted-foreground">Avaliação Média</p>
          </div>

          {/* Card 2: CLIQUES NO WHATSAPP */}
          <div className="bg-card/60 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-large hover:bg-card/80 transition-colors group">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-green-500/10 rounded-xl text-green-500 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium bg-green-500/10 text-green-500 px-2 py-1 rounded-full">
                Interessados
              </span>
            </div>
            
            <h3 className="text-3xl font-bold mt-4 text-foreground">
              {stats.contacts}
            </h3>
            
            <p className="text-sm text-muted-foreground">Cliques no WhatsApp</p>
          </div>

          {/* Card 3: DESTAQUE / IMPULSIONAR (Transformado) */}
          <div 
            onClick={() => toast.info("Funcionalidade de Destaque em breve!")} // Aqui você colocará a lógica de pagamento depois
            className="relative overflow-hidden bg-gradient-to-br from-white to-orange-500/5 backdrop-blur-md border border-orange-500/20 p-6 rounded-2xl shadow-large hover:shadow-orange-500/20 transition-all duration-300 group cursor-pointer hover:scale-[1.02]"
          >
            {/* Efeito de brilho no fundo */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity group-hover:opacity-75" />

            <div className="flex justify-between items-start relative z-10">
              <div className="p-3 bg-gradient-hero rounded-xl text-white shadow-lg shadow-orange-500/20 group-hover:rotate-12 transition-transform duration-300">
                <Rocket className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium bg-gradient-hero text-white px-2 py-1 rounded-full backdrop-blur-md">
                Premium
              </span>
            </div>

            <div className="relative z-10">
              <h3 className="text-xl font-bold mt-4 text-foreground group-hover:text-gradient-hero transition-colors">
                Turbinar Perfil
              </h3>
              <p className="text-sm text-muted-foreground mt-1 leading-tight">
                Apareça no topo das buscas e receba <span className="text-foreground font-bold">3x mais clientes</span>.
              </p>
              
              <div className="mt-3 flex items-center text-xs font-bold text-gradient-hero group-hover:text-gradient-hero transition-colors">
                Saiba como funciona <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform"/>
              </div>
            </div>
          </div>
        </div>


        {/* --- ÁREA PRINCIPAL --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in order-1 lg:order-2 mb-10 lg:mb-0" style={{ animationDelay: "200ms" }}>
          
          {/* Coluna Esquerda: Histórico */}
          <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <MessageCircle className="w-5 ml-5 h-5 text-primary" /> Histórico de Contatos
            </h2>

            {stats.logs && stats.logs.length > 0 ? (
                
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    
                    {stats.logs.map((log: any) => (
                        <div key={log.id} className="bg-card/40 backdrop-blur-sm border border-white/5 p-4 rounded-xl flex items-center gap-4 hover:bg-card/60 transition-colors">
                            {/* Avatar do Cliente */}
                            <div className="w-10 h-10 rounded-full bg-muted border border-white/10 overflow-hidden flex-shrink-0">
                                {log.client.avatarUrl ? (
                                    <img src={log.client.avatarUrl} alt={log.client.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-primary/20 text-primary text-xs font-bold">
                                        {log.client.name.charAt(0)}
                                    </div>
                                )}
                            </div>
                            
                            {/* Dados do Cliente */}
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-foreground">{formatText(log.client.name)}</h4>
                                <p className="text-xs text-muted-foreground">Clicou no botão de contato</p>
                            </div>

                            {/* Data do Clique */}
                            <div className="text-right">
                                <span className="text-xs text-muted-foreground/70 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(log.createdAt)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 text-center shadow-sm">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageCircle className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground">Acompanhe seus contatos</h3>
                    <p className="text-muted-foreground text-sm max-w-xs mx-auto mt-2">
                        Aqui você verá detalhes de quem clicou no seu WhatsApp. Mantenha seu perfil atualizado e o seu número correto para receber mais clientes.
                    </p>
                </div>
            )}

          </div>

          {/* Coluna Direita: Perfil Rápido */}
          <div className="space-y-6 order-1 lg:order-2">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <User className="w-5 h-5 text-primary" /> Meu Cartão
            </h2>

            <div className="bg-card border border-border rounded-2xl p-6 shadow-large relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary/20 to-purple-500/20" />
              
              <div className="relative mt-8 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full border-4 border-card bg-muted flex items-center justify-center overflow-hidden shadow-md mb-4">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl font-bold text-muted-foreground">{user.name.charAt(0)}</span>
                    )}
                </div>

                <h3 className="font-bold text-lg">{formatText(user.name)}</h3>
                <p className="text-sm text-primary font-medium mb-4">{user.provider?.category || "Categoria não definida"}</p>
                
                <p className="text-sm text-muted-foreground mb-6 line-clamp-3">
                  {user.provider?.description || "Adicione uma descrição para atrair mais clientes."}
                </p>

                <div className="w-full flex justify-center">
                    <Button 
                      className="w-full rounded-xl" 
                      variant="hero" 
                      size="sm"
                      onClick={() => navigate(`/prestador/${user.provider?.id || user.id}`)}
                    >
                      Ver como público
                    </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}