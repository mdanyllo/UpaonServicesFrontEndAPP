import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { 
  Zap, Wrench, Paintbrush, Hammer, Palette, 
  Scissors, Baby, HeartHandshake, ChefHat, Truck, 
  Camera, Car, MoreHorizontal, ArrowLeft, Search 
} from "lucide-react"
import { Button } from "@/components/ui/button"

// --- MAPEAMENTO COMPLETO DE CATEGORIAS ---
const ALL_CATEGORIES = [
  { name: "Tecnologia", icon: Zap, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { name: "Reparos", icon: Wrench, color: "text-blue-500", bg: "bg-blue-500/10" },
  { name: "Limpeza", icon: Paintbrush, color: "text-green-500", bg: "bg-green-500/10" },
  { name: "Construção", icon: Hammer, color: "text-orange-500", bg: "bg-orange-500/10" },
  { name: "Pintura", icon: Palette, color: "text-purple-500", bg: "bg-purple-500/10" },
  { name: "Beleza", icon: Scissors, color: "text-pink-500", bg: "bg-pink-500/10" },
  { name: "Babá", icon: Baby, color: "text-teal-500", bg: "bg-teal-500/10" },
  { name: "Cuidadores", icon: HeartHandshake, color: "text-red-500", bg: "bg-red-500/10" },
  { name: "Culinária", icon: ChefHat, color: "text-amber-600", bg: "bg-amber-600/10" },
  { name: "Mudança", icon: Truck, color: "text-slate-500", bg: "bg-slate-500/10" },
  { name: "Fotografia", icon: Camera, color: "text-indigo-500", bg: "bg-indigo-500/10" },
  { name: "Motoristas", icon: Car, color: "text-zinc-500", bg: "bg-zinc-500/10" },
  { name: "Outros", icon: MoreHorizontal, color: "text-primary", bg: "bg-primary/10" },
]

export function Categorias() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)

  // --- 1. BLOQUEADOR DE USUÁRIO NÃO LOGADO ---
  useEffect(() => {
    const storedUser = localStorage.getItem("upaon_user")
    const token = localStorage.getItem("token") // Verifica token também por segurança

    if (!storedUser || !token) {
      // Se não tiver usuário ou token, manda pro login
      navigate("/login", { replace: true }) 
    } else {
      setUser(JSON.parse(storedUser))
    }
  }, [navigate])

  if (!user) return null // Evita piscar a tela antes de redirecionar

  return (
    <div className="min-h-screen bg-gradient-sunset p-4 md:p-8">
      
      {/* HEADER SIMPLES */}
      <div className="max-w-6xl mx-auto mb-8 flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} // Volta para a página anterior (Dashboard)
          className="hover:bg-white/10 gap-2 pl-0 text-foreground"
        >
          <ArrowLeft className="w-6 h-6" /> 
          <span className="text-lg font-medium">Voltar</span>
        </Button>
      </div>

      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
        
        {/* TÍTULO */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            Todas as Categorias
          </h1>
          <p className="text-muted-foreground">
            Selecione o tipo de serviço que você precisa hoje
          </p>
        </div>

        {/* GRID DE CATEGORIAS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => navigate(`/resultados?category=${cat.name}`)}
              className="group bg-card/80 backdrop-blur-md hover:bg-white border border-white/20 hover:border-primary/50 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center gap-4 h-full"
            >
              <div className={`p-4 rounded-full ${cat.bg} group-hover:scale-110 transition-transform duration-300`}>
                <cat.icon className={`w-8 h-8 ${cat.color}`} />
              </div>
              <span className="font-semibold text-foreground text-center group-hover:text-primary transition-colors">
                {cat.name}
              </span>
            </button>
          ))}
        </div>

        {/* DICA DE RODAPÉ */}
        <div className="text-center mt-12 pt-8 border-t border-white/10">
          <p className="text-muted-foreground mb-4">Não achou o que procura?</p>
          <Button 
            variant="outline" 
            className="rounded-xl gap-2 border-primary/20 hover:bg-primary/10"
            onClick={() => navigate("/resultados")}
          >
            <Search className="w-4 h-4" />
            Fazer uma busca personalizada
          </Button>
        </div>

      </div>
    </div>
  )
}