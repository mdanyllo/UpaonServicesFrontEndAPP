import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { LogOut, User,} from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

const Bar = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  // Função para formatar o nome (Igual ao Hero)
  function formatName(name: string) {
    if (!name) return ""
    return name
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  useEffect(() => {
    const storedUser = localStorage.getItem("upaon_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  function handleLogout() {
    localStorage.removeItem("upaon_token")
    localStorage.removeItem("upaon_user")
    toast.success("Você saiu da conta.")
    navigate("/")
  }

  // Se não carregar o usuário ainda, exibe um placeholder ou retorna null
  if (!user) return null

  const firstName = formatName(user.name.split(" ")[0])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* ESQUERDA: Logo (Exatamente igual ao Hero) */}
          <Link to="/dashboard/cliente" className="flex items-center gap-2">
            <div className="w-10 h-10 flex items-center justify-center">
              <img className="rounded-lg" src="/logo1.png" alt="Upaon Services" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">
              UpaonServices
            </span>
          </Link>

          {/* DIREITA: Perfil + Logout */}
          <div className="flex items-center gap-3">
            
            <div className="flex items-center gap-3 pl-4 border-l border-border/50">
              {/* Nome do Usuário */}
              <span className="text-sm font-medium text-foreground hidden sm:block">
                {firstName}
              </span>
              
              {/* Foto (Avatar) */}
              <div className="w-9 h-9 rounded-full bg-muted overflow-hidden border border-border flex items-center justify-center">
                {user.avatarUrl ? (
                  <Link to="/dashboard/cliente/perfil">
                    <img 
                      src={user.avatarUrl} 
                      alt={user.name} 
                      className="w-full h-full object-cover" 
                  /></Link>
                ) : (
                  <Link to="/dashboard/cliente/perfil">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} 
                    alt={user.name} 
                    className="w-full h-full object-cover" 
                  /></Link>
                )}
              </div>

              {/* Botão Logout */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLogout}
                className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-full ml-1"
                title="Sair"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>

        </div>
      </div>
    </header>
  )
}
export default Bar;