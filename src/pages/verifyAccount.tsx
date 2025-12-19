import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Loader2, CheckCircle, AlertCircle, Timer } from "lucide-react"
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

  // --- NOVO: ESTADO DO TIMER ---
  const [timeLeft, setTimeLeft] = useState(30) // Começa com 30s de espera
  const [isResending, setIsResending] = useState(false)

  // Se não tiver email na URL, volta pro login
  useEffect(() => {
    if (!email) navigate("/login")
  }, [email, navigate])

  // --- EFEITO DO TIMER ---
  useEffect(() => {
    // Se o tempo for maior que 0, diminui 1 a cada segundo
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timerId)
    }
  }, [timeLeft])

  // --- FUNÇÃO DE REENVIAR CÓDIGO ---
  async function handleResendCode() {
    if (timeLeft > 0) return
    
    setIsResending(true)
    setError("")

    try {
        const res = await fetch("https://upaonservicesbackprototipo.onrender.com/auth/resend-code", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        })

        if (!res.ok) throw new Error("Erro ao reenviar.")

        // Sucesso: Reinicia o timer para 60 segundos
        setTimeLeft(60)
        alert("Novo código enviado! Verifique sua caixa de entrada.") // Depois mudaremos para Toast

    } catch (err) {
        setError("Não foi possível reenviar o código.")
    } finally {
        setIsResending(false)
    }
  }

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

      if (!res.ok) throw new Error(data.message || "Erro ao verificar") // Ajustei data.error para data.message

      // --- LÓGICA DE AUTO-LOGIN ---
      if (data.token) {
        localStorage.setItem("upaon_token", data.token)
        localStorage.setItem("upaon_user", JSON.stringify(data.user))
      }
      // ----------------------------

      setSuccess(true)
      
      setTimeout(() => {
        if (data.user?.role === "PROVIDER") {
            navigate("/dashboard/prestador") 
        } else {
            navigate("/dashboard/cliente") 
        }
      }, 1500)

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

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
                onKeyDown={handleKeyDown}
                placeholder="000000"
                className="text-center text-3xl tracking-[10px] font-bold h-16 rounded-2xl border-2 focus-visible:ring-primary"
                maxLength={6}
                autoFocus 
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
            
            {/* --- BOTÃO DE REENVIAR COM LÓGICA --- */}
            <div className="pt-2">
                <button 
                    onClick={handleResendCode}
                    disabled={timeLeft > 0 || isResending}
                    className={`text-sm flex items-center justify-center gap-2 mx-auto transition-colors ${
                        timeLeft > 0 
                            ? "text-muted-foreground cursor-not-allowed" 
                            : "text-primary hover:underline font-bold"
                    }`}
                >
                    {isResending ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                    ) : timeLeft > 0 ? (
                        <>
                            <Timer className="w-3 h-3" /> Reenviar em {timeLeft}s
                        </>
                    ) : (
                        "Reenviar código"
                    )}
                </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}