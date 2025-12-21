import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { initMercadoPago, Payment as PaymentBrick } from '@mercadopago/sdk-react';
import { Home, ArrowLeft } from "lucide-react"
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
      
      const { status, status_detail, ticket_url } = response.data;

      if (status === 'approved') {
        toast.success("Pagamento aprovado com sucesso!");
        navigate("/dashboard/prestador")
      } else if (status === 'pending' || status === 'in_process') {
        toast.success("Pagamento pendente ou em processamento.");
        if (ticket_url) window.location.href = ticket_url;
      } else if (status === 'rejected') {
        const erros: any = {
          'cc_rejected_bad_filled_card_number': "Número do cartão inválido.",
          'cc_rejected_bad_filled_date': "Data de validade incorreta.",
          'cc_rejected_bad_filled_other': "Dados do cartão incorretos.",
          'cc_rejected_insufficient_amount': "Saldo insuficiente.",
        };
        toast.error(erros[status_detail] || "Pagamento recusado pelo Mercado Pago.");
      } else {
        toast.error("Ocorreu um problema com o seu pagamento.");
      }
    } catch (error: any) {
      const msg = error.response?.data?.error || "Erro de conexão com o servidor.";
      toast.error(msg);
      console.error('Erro Front:', error);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px' }}>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4 text-orange-500">
          {type === 'ACTIVATION' ? 'Ativar Sua Conta' : 'Destacar Seu Perfil'}
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
        customization={{ paymentMethods: { bankTransfer: ["all"], creditCard: ["all"], debitCard: ["all"] } }}
        onSubmit={onSubmit}
      />
    </div>
  );
};