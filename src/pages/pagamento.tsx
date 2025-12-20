import { Navigate, replace, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { initMercadoPago, Payment as PaymentBrick } from '@mercadopago/sdk-react';
import { Home, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import axios from 'axios';
import { API_URL } from '@/config/api';
import { toast } from 'sonner';
import { useEffect } from 'react';

initMercadoPago('APP_USR-2ccdf4e8-03d1-4d16-98d1-53beb5e19240');

export const PaymentPage = () => {
  const { providerId } = useParams<{ providerId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate()

  // TABELA DE PREÇOS OFICIAL (Para validação)
  const precosValidos: Record<string, number> = {
    'FEATURED': 19.90,
    'ACTIVATION': 1.99
  };

  const type = searchParams.get('type') || 'FEATURED';
  const amountUrl = Number(searchParams.get('amount')) || 2.00;

  // VALIDAÇÃO: Se o valor na URL for diferente da tabela oficial, bloqueia
  const isInvalid = !precosValidos[type] || amountUrl !== precosValidos[type];

  if (isInvalid) {
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

  const initialization = {
    amount: amountUrl,
  };

  const customization: any = {
    paymentMethods: {
      bankTransfer: ["all"],
      creditCard: ["all"],
      debitCard: ["all"],
    },
    visual: {
      hidePaymentButton: false,
      preserveLayout: true,
    },
  };

  const onSubmit = async ({ formData }: any) => {
    try {
      const response = await axios.post(`${API_URL}/payment`, { 
        formData, 
        providerId,
        type,
        amount: amountUrl
      });
      
      const { status, ticket_url } = response.data;

      if (status === 'approved') {
        toast.success("Pagamento aprovado com sucesso!");
      } else if (status === 'pending' || status === 'in_process') {
        toast.success("Pagamento gerado! Redirecionando...");
        if (ticket_url) {
          setTimeout(() => { window.location.href = ticket_url; }, 2000);
        }
      } else {
        toast.error("O pagamento foi recusado.");
      }
    } catch (error) {
      toast.error("Erro ao processar");
      console.error('Erro no back:', error);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px' }}>
      <div className="mb-8 text-center animate-fade-in">
        {/* Título com o gradiente da sua marca */}
        <h1 className="text-3xl font-display font-bold text-gradient-hero mb-4">
          {type === 'ACTIVATION' ? 'Ativar Sua   Conta' : 'Destacar Seu Perfil'}
        </h1>

        {/* Card de Valor Estilizado */}
        <div className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-xl inline-block min-w-[280px]">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Total a pagar
          </p>
          
          <div className="flex items-center justify-center gap-2">
            <span className="text-4xl font-black text-foreground tracking-tight">
              {new Intl.NumberFormat('pt-BR', { 
                style: 'currency', 
                currency: 'BRL' 
              }).format(amountUrl)}
            </span>
          </div>
          
          {/* Badge de Segurança ou Info */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-primary font-semibold py-1 px-3 bg-primary/10 rounded-full border border-primary/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Pagamento Seguro via Mercado Pago
          </div>
        </div>
      </div>

      <PaymentBrick
        initialization={initialization}
        customization={customization}
        onSubmit={onSubmit}
        onError={(error) => console.error(error)}
      />
    </div>
  );
};