import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Mail, ArrowLeft, ArrowRight, KeyRound, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function RecoverPassword() {
  const navigate = useNavigate()
  
  // Controle de Etapas: 1 = Email, 2 = Redefinir
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  // Dados do Formulário
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [newPassword, setNewPassword] = useState("")

  // Estado de Erro Visual
  const [error, setError] = useState("")

  // PASSO 1: Enviar Código
  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("") // Limpa erro anterior

    try {
      const res = await fetch("https://upaonservicesbackprototipo.onrender.com/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || "Erro ao enviar email.")
      }
      
      // Se deu certo, vai pro passo 2
      setStep(2)
      setError("")
    } catch (err: any) {
      setError(err.message || "Verifique o email digitado.")
    } finally {
      setLoading(false)
    }
  }

  // PASSO 2: Trocar Senha
  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("") // Limpa erro anterior

    try {
        if (newPassword.length < 6) throw new Error("A senha deve ter no mínimo 6 caracteres.")

        const res = await fetch("https://upaonservicesbackprototipo.onrender.com/auth/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, code, newPassword }),
        })
        
        if (!res.ok) {
             const data = await res.json()
             throw new Error(data.message || "Código inválido ou expirado.")
        }
        navigate("/login")

    } catch (err: any) {
        setError(err.message || "Erro ao alterar senha.")
    } finally {
        setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-sunset px-4">
      <div className="w-full max-w-md bg-card/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/20">
        
        <Link to="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Voltar para Login
        </Link>

        {step === 1 ? (
            // --- UI DO PASSO 1: EMAIL ---
            <div className="animate-fade-in">
                <div className="space-y-2 mb-8">
                    <h1 className="text-2xl font-bold text-foreground">Recuperar Senha</h1>
                    <p className="text-muted-foreground text-sm">Digite seu e-mail para receber o código.</p>
                </div>
                <form onSubmit={handleSendCode} className="space-y-6">
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                        <Input type="email" placeholder="seu@email.com" className="pl-10 h-12 rounded-xl" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>

                    {/* AVISO DE ERRO VERMELHO */}
                    {error && (
                        <div className="flex items-center gap-2 text-red-500 text-sm justify-center bg-red-500/10 p-3 rounded-lg animate-fade-in">
                            {error}
                        </div>
                    )}

                    <Button type="submit" className="w-full h-12 rounded-xl font-bold" variant="hero" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" /> : <>Enviar Código <ArrowRight className="ml-2 w-4 h-4"/></>}
                    </Button>
                </form>
            </div>
        ) : (
            // --- UI DO PASSO 2: CÓDIGO E SENHA ---
            <div className="animate-fade-in">
                 <div className="space-y-2 mb-6 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <KeyRound className="w-6 h-6 text-primary" />
                    </div>
                    <h1 className="text-xl font-bold">Definir Nova Senha</h1>
                    <p className="text-muted-foreground text-xs">Código enviado para <b>{email}</b></p>
                </div>
                <form onSubmit={handleResetPassword} className="space-y-4">
                    <div>
                        <Input value={code} onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" className="text-center text-xl tracking-widest font-bold h-12 rounded-xl" maxLength={6} required autoFocus />
                    </div>
                    <div>
                         <div className="relative">
                            <Input type="password" placeholder="Nova Senha" className="pl-9 h-12 rounded-xl" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                            <p className="text-xs text-muted-foreground ml-1 mt-1 mb-2">
                                Mínimo 8 caracteres, com maiúscula, número e símbolo (!@#$).
                            </p>
                        </div>
                    </div>

                    {/* AVISO DE ERRO VERMELHO */}
                    {error && (
                        <div className="flex items-center gap-2 text-red-500 text-sm justify-center bg-red-500/10 p-3 rounded-lg animate-fade-in">
                            <AlertCircle className="w-4 h-4" /> {error}
                        </div>
                    )}

                    <Button type="submit" className="w-full h-12 rounded-xl font-bold mt-2" variant="hero" disabled={loading}>
                         {loading ? <Loader2 className="animate-spin" /> : <>Salvar Nova Senha </>}
                    </Button>
                    
                    <p className="text-sm text-muted-foreground text-center mt-4">
                    Não recebeu?{" "}
                    <button type="button" onClick={() => { setStep(1); setError(""); }} className="text-primary font-medium hover:underline">
                        Tentar outro email
                    </button>
                    </p>
                </form>
            </div>
        )}
      </div>
    </div>
  )
}