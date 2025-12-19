import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, MessageCircle, MapPin, User, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import Bar from "@/components/layout/headerCliente"
import { API_URL } from "@/config/api"

function formatText(text?: string) {
  if (!text) return ""
  return text
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function formatDate(dateString: string) {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
}

export function Historico() {
  const navigate = useNavigate()
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("upaon_user")
    if (!storedUser) {
      navigate("/login")
      return
    }
    const user = JSON.parse(storedUser)

    fetch(`${API_URL}/users/${user.id}/history`)
      .then(res => res.json())
      .then(data => {
        setLogs(data.logs || [])
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [navigate])

  return (
    <>
      <Bar />
      <div className="min-h-screen bg-gradient-sunset pt-24 pb-12 px-4">
        
        <div className="max-w-4xl mx-auto mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="text-foreground hover:bg-white/10 gap-2 pl-0">
            <ArrowLeft className="w-5 h-5" /> Voltar
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-2">Seu Histórico</h1>
          <p className="text-muted-foreground mb-8">Profissionais que você já entrou em contato.</p>

          {loading ? (
             <p className="text-center text-muted-foreground">Carregando...</p>
          ) : logs.length > 0 ? (
            <div className="space-y-4">
              {logs.map((log) => {
                const provider = log.provider
                return (
                  <div key={log.id} className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-5 shadow-md flex flex-col md:flex-row items-center gap-4 hover:bg-card transition-colors">
                    
                    {/* FOTO */}
                    <div className="w-16 h-16 rounded-full bg-muted border border-border overflow-hidden flex-shrink-0">
                        {provider.user.avatarUrl ? (
                            <img src={provider.user.avatarUrl} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground"><User /></div>
                        )}
                    </div>

                    {/* DADOS */}
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="font-bold text-lg text-foreground">{formatText(provider.user.name)}</h3>
                        <p className="text-primary font-medium text-sm">{provider.category}</p>
                        <div className="flex items-center justify-center md:justify-start gap-1 text-xs text-muted-foreground mt-1">
                            <MapPin className="w-3 h-3" /> {provider.user.city}
                        </div>
                    </div>

                    {/* DATA */}
                    <div className="text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-lg flex items-center gap-2">
                        <Calendar className="w-3 h-3" /> {formatDate(log.createdAt)}
                    </div>

                    {/* BOTÕES */}
                    <Button 
                        size="sm" 
                        variant="hero" 
                        onClick={() => navigate(`/prestador/${provider.id}`)}
                    >
                        Ver Perfil
                    </Button>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-card/30 rounded-2xl border border-dashed border-white/10">
                <p className="text-muted-foreground">Você ainda não entrou em contato com ninguém.</p>
                <Button variant="link" onClick={() => navigate("/resultados")}>Buscar profissionais</Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}