import { useNavigate } from "react-router-dom"
import { 
  ArrowLeft, Rocket, Shield, CheckCircle2, 
  TrendingUp, Users, Zap, Star 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Bar from "@/components/layout/headerCliente"

export function Destaque() {
  const navigate = useNavigate()
  
  // CORREÇÃO: Acessando o ID dentro do objeto provider do usuário
  const user = JSON.parse(localStorage.getItem("upaon_user") || "{}")
  const providerId = user?.provider?.id

  return (
    <>
      <Bar />
      <section className="min-h-screen bg-gradient-sunset pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="text-zinc-800 hover:bg-white/20 gap-2 pl-0">
            <ArrowLeft className="w-5 h-5" /> Voltar
          </Button>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* HERO SECTION - GATILHO: AUTORIDADE */}
          <div className="bg-card/90 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-12 shadow-xl text-center space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Rocket className="w-32 h-32 rotate-12" />
            </div>
            
            <div className="inline-flex items-center gap-2 bg-gradient-hero px-4 py-2 rounded-full text-white text-sm font-bold shadow-lg animate-bounce">
              <Rocket className="w-4 h-4" /> DESTAQUE SEU PERFIL
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold font-display text-foreground leading-tight">
              Seja a <span className="text-gradient-hero">Primeira Escolha</span> de quem precisa agora.
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Profissionais em destaque recebem até 3x mais contatos. O selo de confiança reduz a hesitação do cliente e acelera o fechamento do serviço.
            </p>
          </div>

          {/* OS 3 PILARES - GATILHO: PROVA CIENTÍFICA (DOPAMINA/STATUS) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/40 backdrop-blur-sm border border-white/30 p-6 rounded-2xl space-y-4">
              <div className="bg-yellow-500/20 gap-1 w-12 h-12 rounded-xl flex items-center justify-center">
                <Shield className="text-yellow-600 w-5 h-5 fill-yellow-600" />
                <Rocket className="text-yellow-600 w-5 h-5 fill-yellow-600" />
              </div>
              <h3 className="font-bold text-lg">Selos de Autoridade</h3>
              <p className="text-sm text-zinc-700">Os selos de Destaque ativam o gatilho da confiança instantânea no subconsciente do cliente.</p>
            </div>

            <div className="bg-white/40 backdrop-blur-sm border border-white/30 p-6 rounded-2xl space-y-4">
              <div className="bg-orange-500/20 w-12 h-12 rounded-xl flex items-center justify-center">
                <TrendingUp className="text-orange-600 w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg">Topo das Buscas</h3>
              <p className="text-sm text-zinc-700">Apareça nas primeiras posições. Quem é visto primeiro, é contratado primeiro.</p>
            </div>

            <div className="bg-white/40 backdrop-blur-sm border border-white/30 p-6 rounded-2xl space-y-4">
              <div className="bg-blue-500/20 w-12 h-12 rounded-xl flex items-center justify-center">
                <Zap className="text-blue-600 w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg">30 Dias de Poder</h3>
              <p className="text-sm text-zinc-700">Visibilidade máxima ininterrupta por um mês inteiro para alavancar sua agenda.</p>
            </div>
          </div>

          {/* ONDE OS SELOS APARECEM - GATILHO: VISUALIZAÇÃO */}
          <div className="bg-zinc-900 text-white rounded-3xl p-8 md:p-10 shadow-2xl space-y-8">
            <h2 className="text-2xl font-bold text-center">Onde você será visto?</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="text-primary w-6 h-6 mt-1" />
                <div>
                  <h4 className="font-bold">Nos Resultados de Pesquisa</h4>
                  <p className="text-zinc-400 text-sm">Seu card terá uma borda dourada e os selos ao lado do seu nome, atraindo o olhar antes de qualquer outro.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle2 className="text-primary w-6 h-6 mt-1" />
                <div>
                  <h4 className="font-bold">Na página principal da plataforma</h4>
                  <p className="text-zinc-400 text-sm">Ao entrar na plataforma, o cliente verá o seu perfil com os selos de Autoridade.</p>
                </div>
              </div>

                <div className="flex items-start gap-4">
                    <CheckCircle2 className="text-primary w-6 h-6 mt-1" />
                    <div>
                    <h4 className="font-bold">No seu Perfil Público</h4>
                    <p className="text-zinc-400 text-sm">Ao abrir seu perfil, o cliente verá os selos de Destaque e Foguete, confirmando que você é um profissional de elite.</p>
                    </div>
                </div>
            </div>

            {/* BOX DE PREÇO - GATILHO: INVESTIMENTO VS RETORNO */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center space-y-4">
              <div className="text-sm uppercase tracking-widest text-primary font-bold">Plano de Destaque Mensal</div>
              <div className="flex items-center justify-center gap-1">
                <span className="text-2xl font-bold">R$</span>
                <span className="text-5xl font-black text-gradient-hero">19,90</span>
                <span className="text-zinc-400">/mês</span>
              </div>
              <p className="text-xs text-zinc-400">Menos de R$ 1,00 por dia para transformar sua presença digital.</p>
              
              <Button 
                size="lg"
                onClick={() => navigate(`/checkout/${providerId}?type=FEATURED&amount=19.90`)}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-16 md:text-lg text-sm rounded-xl shadow-2xl transition-all hover:scale-[1.02]"
              >
                ATIVAR MEU DESTAQUE AGORA
                <Zap className="ml-2 w-5 h-5 fill-white" />
              </Button>
              
                <div className="flex items-center justify-center gap-3 text-xs text-zinc-500 pt-2">
                <img 
                    src="/mp.svg" 
                    alt="Mercado Pago" 
                    className="h-8 w-auto" 
                />
                <span className="border-l border-zinc-300 h-3 ml-1" />  
                <span className="font-medium">Pagamento 100% seguro</span>
                </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}