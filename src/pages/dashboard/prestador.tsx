import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { 
  User, 
  Star, 
  Briefcase, 
  Calendar, 
  LogOut, 
  MapPin, 
  Settings,
  Clock,
  Loader2,
  ShoppingBag,
  MessageCircle, // Ícone do Zap
  Eye
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ProviderDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({ contacts: 0 }) // Estado para os cliques

  useEffect(() => {
    // 1. Pega os dados
    const storedUser = localStorage.getItem("upaon_user")
    const storedToken = localStorage.getItem("upaon_token")

    // 2. Se não tiver dados, tchau -> Login
    if (!storedUser || !storedToken) {
      navigate("/login")
      return
    }

    try {
      const parsedUser = JSON.parse(storedUser)

      // 3. Se não for PRESTADOR -> Vai para Dashboard de Cliente
      if (parsedUser.role !== "PROVIDER") {
        console.warn("Acesso negado: Usuário não é prestador")
        navigate("/dashboard/cliente", { replace: true })
        return
      }

      // 4. Tudo certo? Salva o user e libera o carregamento
      setUser(parsedUser)
      setIsLoading(false)

      // --- BUSCA OS CLIQUES (CONTACT LOGS) ---
      if (parsedUser.provider?.id) {
        fetch(`https://upaonservicesbackprototipo.onrender.com/providers/${parsedUser.provider.id}/stats`)
          .then(res => res.json())
          .then(data => setStats(data))
          .catch(err => console.error("Erro ao buscar stats", err))
      }

    } catch (error) {
      // Se der erro no JSON, limpa tudo e manda pro login
      localStorage.clear()
      navigate("/login")
    }
  }, [navigate])

  function handleLogout() {
    localStorage.removeItem("upaon_token")
    localStorage.removeItem("upaon_user")
    navigate("/")
  }

  function editarPerfil() {
    navigate("/dashboard/editarperfil")
  } 

  // --- FUNÇÃO PARA IR COMPRAR (MODO CLIENTE) ---
  function irParaModoCliente() {
    navigate("/dashboard/cliente")
  }

  // --- TELA DE LOADING ---
  if (isLoading || !user) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-sunset">
            <div className="animate-spin text-primary">
                <Loader2 className="w-10 h-10" />
            </div>
        </div>
    )
  }

  return (
    <section className="relative min-h-screen pt-24 pb-12 bg-gradient-sunset overflow-hidden">
      
      {/* --- BG ANIMADO --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-ocean/10 rounded-full blur-3xl animate-pulse-soft" />
      </div>

    <div className="container flex flex-col mx-auto px-4 relative z-10">
        
        {/* --- HEADER DO DASHBOARD --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 animate-fade-in">
          <div className="md:ml-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-2 border border-primary/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Painel do Prestador
            </div>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground">
              Olá, <span className="text-gradient-hero">{user.name.split(" ")[0]}</span>
            </h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> 
              {user.city || "São Luís - MA"} • {user.provider?.category || "Profissional"}
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            {/* --- BOTÃO MODO CLIENTE --- */}
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
              <span className="text-xs font-medium bg-green-500/10 text-green-500 px-2 py-1 rounded-full">
                Excelente
              </span>
            </div>
            <h3 className="text-3xl font-bold mt-4 text-foreground">
              {user.provider?.rating ? user.provider.rating.toFixed(1) : "5.0"}
            </h3>
            <p className="text-sm text-muted-foreground">Avaliação Média</p>
          </div>

          {/* Card 2: CLIQUES NO WHATSAPP (Substituindo Serviços Realizados) */}
          <div className="bg-card/60 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-large hover:bg-card/80 transition-colors group">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-green-500/10 rounded-xl text-green-500 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium bg-green-500/10 text-green-500 px-2 py-1 rounded-full">
                Interessados
              </span>
            </div>
            
            {/* VALOR DINÂMICO VINDO DO BACKEND */}
            <h3 className="text-3xl font-bold mt-4 text-foreground">
              {stats.contacts}
            </h3>
            
            <p className="text-sm text-muted-foreground">Cliques no WhatsApp</p>
          </div>

          {/* Card 3: Visualizações (Mockup por enquanto ou Status) */}
          <div className="bg-card/60 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-large hover:bg-card/80 transition-colors group">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500 group-hover:scale-110 transition-transform">
                <Eye className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
                Ativo
              </span>
            </div>
            <h3 className="text-xl font-bold mt-4 text-foreground">Disponível</h3>
            <p className="text-sm text-muted-foreground">Perfil visível na busca</p>
          </div>
        </div>

        {/* --- ÁREA PRINCIPAL --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in order-1 lg:order-2 mb-10 lg:mb-0" style={{ animationDelay: "200ms" }}>
          
          {/* Coluna Esquerda: Lista de Interessados (Pode ser uma futura lista de quem clicou) */}
          <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <MessageCircle className="w-5 ml-5 h-5 text-primary" /> Histórico de Contatos
            </h2>

            {/* Lista Vazia (Placeholder) */}
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 text-center shadow-sm">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-medium text-foreground">Acompanhe seus contatos</h3>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto mt-2">
                Aqui você verá detalhes de quem clicou no seu WhatsApp. Mantenha seu perfil atualizado e o seu número de WhatsApp correto para receber mais clientes.
              </p>
            </div>
          </div>

          {/* Coluna Direita: Perfil Rápido */}
          <div className="space-y-6 order-1 lg:order-2">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <User className="w-5 h-5 text-primary" /> Meu Cartão
            </h2>

            <div className="bg-card border border-border rounded-2xl p-6 shadow-large relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary/20 to-purple-500/20" />
              
              <div className="relative mt-8 flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="w-24 h-24 rounded-full border-4 border-card bg-muted flex items-center justify-center overflow-hidden shadow-md mb-4">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl font-bold text-muted-foreground">{user.name.charAt(0)}</span>
                    )}
                </div>

                <h3 className="font-bold text-lg">{user.name}</h3>
                <p className="text-sm text-primary font-medium mb-4">{user.provider?.category || "Categoria não definida"}</p>
                
                <p className="text-sm text-muted-foreground mb-6 line-clamp-3">
                  {user.provider?.description || "Adicione uma descrição para atrair mais clientes."}
                </p>

                <div className="w-full flex justify-center">
                    <Button className="w-full rounded-xl" variant="hero" size="sm">Divulgar</Button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}