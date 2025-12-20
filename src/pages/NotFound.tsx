import { useNavigate } from "react-router-dom"
import { Home, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-sunset px-4 text-center">
      <div className="bg-card/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-white/20 max-w-md w-full animate-fade-in-up">
        <h1 className="text-6xl font-display font-bold text-gradient-hero mb-2">404</h1>
        <h2 className="text-2xl font-bold text-foreground mb-4">Ops! Caminho errado.</h2>
        
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Parece que a página que você tentou acessar não existe ou o endereço mudou.
        </p>

        <div className="space-y-3">
          <Button 
            onClick={() => navigate("/")} 
            className="w-full h-12 text-lg rounded-xl font-bold shadow-lg shadow-primary/20" 
            variant="hero"
          >
            <Home className="mr-2 w-5 h-5" /> Ir para o Início
          </Button>

          <Button 
            onClick={() => navigate(-1)} 
            variant="ghost" 
            className="w-full h-12 rounded-xl text-muted-foreground hover:bg-muted"
          >
            <ArrowLeft className="mr-2 w-5 h-5" /> Voltar página anterior
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NotFound