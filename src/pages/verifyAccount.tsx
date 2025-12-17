import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function VerifyAccount() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const email = searchParams.get("email")

  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // Se não tiver email na URL, volta pro login
  useEffect(() => {
    if (!email) navigate("/login")
  }, [email, navigate])

  async function handleVerify() {
    setLoading(true)
    setError("")

    try {
      const res = await fetch("https://upaonservicesbackprototipo.onrender.com/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code })
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Erro ao verificar")

      // --- LÓGICA DE AUTO-LOGIN ---
      if (data.token) {
        localStorage.setItem("token", data.token)
        // Opcional: Salvar dados do user se quiser usar no header
        localStorage.setItem("user", JSON.stringify(data.user))
      }
      // ----------------------------

      setSuccess(true)
      
      // Espera 1.5 segundos (pra ver o check verde) e redireciona baseado no cargo
      setTimeout(() => {
        if (data.user?.role === "PROVIDER") {
            // Se for prestador, manda pro perfil dele ou painel
            navigate(`/perfil-prestador/${data.user.id}`) 
        } else {
            // Se for cliente, manda pra busca (Home)
            navigate("/") 
        }
      }, 1500)

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Função para capturar o Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && code.length === 6 && !loading) {
      handleVerify()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-sunset px-4">
      <div className="w-full max-w-md bg-card/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/20 text-center space-y-6">
        
        {success ? (
          <div className="animate-fade-in space-y-4">
            <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Conta Verificada!</h2>
            <p className="text-muted-foreground">Entrando no sistema...</p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Verifique seu Email</h2>
              <p className="text-sm text-muted-foreground">
                Enviamos um código de 6 dígitos para <br/> <span className="font-semibold text-foreground">{email}</span>
              </p>
            </div>

            <div className="space-y-4">
              <Input 
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                onKeyDown={handleKeyDown} // <--- AQUI ESTÁ O ENTER
                placeholder="000000"
                className="text-center text-3xl tracking-[10px] font-bold h-16 rounded-2xl border-2 focus-visible:ring-primary"
                maxLength={6}
                autoFocus // Foca direto no input ao abrir a tela
              />
              
              {error && (
                <div className="flex items-center gap-2 text-red-500 text-sm justify-center bg-red-500/10 p-2 rounded-lg">
                  <AlertCircle className="w-4 h-4" /> {error}
                </div>
              )}

              <Button 
                onClick={handleVerify} 
                className="w-full h-12 rounded-xl font-bold text-lg" 
                variant="hero"
                disabled={loading || code.length < 6}
              >
                {loading ? <Loader2 className="animate-spin" /> : "Confirmar Código"}
              </Button>
            </div>
            
            <button className="text-sm text-primary hover:underline">
              Reenviar código
            </button>
          </>
        )}
      </div>
    </div>
  )
}