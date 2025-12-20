import { useParams } from 'react-router-dom';
import { initMercadoPago, Payment as PaymentBrick } from '@mercadopago/sdk-react';
import axios from 'axios';
import { API_URL } from '@/config/api';
import { toast } from 'sonner';

initMercadoPago('TEST-52cee956-dbcc-49fe-9cbd-e4ca68daf56a');

export const PaymentPage = () => {
const { providerId } = useParams<{ providerId: string }>();

  const initialization = {
    amount: 2.00, 
  };

  const customization = {
    paymentMethods: {
      bankTransfer: ["all"],
      creditCard: ["all"],
      debitCard: ["all"],
    },
  };

  const onSubmit = async ({ formData }: any) => {
    try {
      const response = await axios.post(`${API_URL}/payment`, { 
        formData, 
        providerId 
      });
      
      console.log('Sucesso:', response.data);

      const { status, ticket_url } = response.data;

      if (status === 'approved') {
        toast.success("Pagamento aprovado com sucesso!");
      } else if (status === 'pending' || status === 'in_process') {
        toast.success("Pagamento gerado! Redirecionando para conclusão...");
        
        // Se for PIX, redireciona para a página com o QR Code
        if (ticket_url) {
          setTimeout(() => {
            window.location.href = ticket_url;
          }, 2000);
        }
      } else {
        toast.error("O pagamento foi recusado.");
      }

    } catch (error) {
      toast.error("Erro ao processar");
      console.error('Erro ao processar no back:', error);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Finalizar Pagamento</h1>
      <p>2.00</p>
      <PaymentBrick
        initialization={initialization}
        customization={customization}
        onSubmit={onSubmit}
        onError={(error) => console.error(error)}
      />
    </div>
  );
};