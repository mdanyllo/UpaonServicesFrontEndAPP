import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { initMercadoPago, Payment as PaymentBrick } from '@mercadopago/sdk-react';
import { Home, ArrowLeft, TriangleAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import axios from 'axios';
import { API_URL } from '@/config/api';
import { toast } from 'sonner';

initMercadoPago('APP_USR-2ccdf4e8-03d1-4d16-98d1-53beb5e19240');

export const PaymentPage = () => {
  const { providerId } = useParams<{ providerId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate()

  const precosValidos: Record<string, number> = {
    'FEATURED': 19.90,
    'ACTIVATION': 1.99
  };

  const type = searchParams.get('type') || 'FEATURED';
  const amountUrl = Number(searchParams.get('amount')) || 2.00;
  const isInvalid = !precosValidos[type] || amountUrl !== precosValidos[type];

  if (isInvalid) {
     return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-sunset px-4 text-center">
      <div className="bg-card/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-white/20 max-w-md w-full">
        <h1 className="text-6xl font-bold text-orange-500 mb-2">404</h1>
        <h2 className="text-2xl font-bold mb-4">Caminho inválido</h2>
        <Button onClick={() => navigate("/")} variant="default" className="w-full mb-3">Ir para o Início</Button>
        <Button onClick={() => navigate(-1)} variant="ghost" className="w-full">Voltar</Button>
      </div>
    </div>
  )}

const onSubmit = async ({ formData }: any) => {
  try {
    const response = await axios.post(`${API_URL}/payment`, { 
      formData, providerId, type, amount: amountUrl
    });
    
    const { status, ticket_url } = response.data;

    if (status === 'approved') {
      toast.success("Pagamento aprovado!");
      window.location.assign("/dashboard/prestador");
    } 
    else if (status === 'pending' || status === 'in_process') {
      
      if (type === 'ACTIVATION' || type === 'FEATURED') {
        toast.success("Pagamento gerado! Aguardando confirmação...");
        
        if (ticket_url) {
          window.open(ticket_url, '_blank');
        }

        setTimeout(() => {
          window.location.assign("/dashboard/prestador");
        }, 2000);
      }
    } 
    else {
      toast.error("Pagamento recusado.");
    }
  } catch (error) {
    console.error(error);
    toast.error("Erro na comunicação com o servidor.");
  }
};

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px' }}>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4 text-black">
          {type === 'ACTIVATION' ? 'Ativar Sua Conta' : 'Destacar Seu Perfil'}
          <div className='flex justify-center items-center mt-1'>
            <p className='md:text-sm text-xs font-normal'>Ao realizar o pagamento, volte para o seu perfil na plataforma</p>
          </div>
        </h1>
        <div className="bg-white p-6 rounded-2xl shadow-lg border inline-block min-w-[280px]">
          <p className="text-sm text-gray-500 uppercase font-bold mb-2">Total a pagar</p>
          <span className="text-4xl font-black">
             {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amountUrl)}
          </span>
        </div>
      </div>

    <PaymentBrick
      initialization={{ amount: amountUrl }}
      customization={{ 
        paymentMethods: { bankTransfer: ["all"], creditCard: ["all"], debitCard: ["all"] },
        visual: {
          // @ts-ignore
          preserveLayout: true,
          // @ts-ignore
          showStatusScreen: false, 
        }
      }}
      onSubmit={onSubmit}
      onReady={() => {
        // Esse código RODA SIM, mesmo com @ts-ignore nas linhas acima
        const monitor = setInterval(() => {
          // Procuramos qualquer texto ou classe de sucesso que o MP injeta na tela
          const textoSucesso = document.body.innerText.includes("sucesso") || 
                              document.body.innerText.includes("aprovado") ||
                              document.querySelector('.mp-status-container');

          if (textoSucesso) {
            clearInterval(monitor);
            window.location.href = "/dashboard/prestador";
          }
        }, 2000);
      }}
    />
    </div>
  );
};