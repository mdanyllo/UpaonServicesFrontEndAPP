import Fora from "@/components/layout/headerFora";

export function TermosDeUso() {
return (
<>
<Fora />
<section className="min-h-screen bg-gradient-sunset pt-28 px-4">
<div className="container mx-auto max-w-4xl bg-card/90 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-large">
<h1 className="font-display font-bold text-3xl mb-10">TERMOS DE USO — UPAON SERVICES</h1>

<h2 className="font-display font-bold text-2xl ">1. Aceitação dos Termos</h2>
<p className="text-muted-foreground mb-6">
Ao acessar ou utilizar a plataforma Upaon Services, o usuário declara que leu, compreendeu e concorda integralmente com estes Termos de Uso. Caso não concorde, não deverá utilizar a plataforma.
</p>

<h2 className="font-display font-bold text-2xl ">2. Natureza da Plataforma</h2>
<p className="text-muted-foreground mb-6">
A Upaon Services atua exclusivamente como uma plataforma intermediadora, que conecta clientes a prestadores de serviços independentes.<br></br>
A Upaon Services NÃO:<br></br>
Presta os serviços anunciados
<br></br>
Emprega, contrata ou supervisiona prestadores
<br></br>
Garante qualidade, preço, prazo ou resultado dos serviços
<br></br>
Participa de negociações, pagamentos ou acordos entre as partes
<br></br>
Toda contratação ocorre diretamente entre cliente e prestador, sendo ambos os únicos responsáveis pela relação estabelecida.
</p>

<h2 className="font-display font-bold text-2xl ">3. Responsabilidades dos Usuários</h2>
<p className="text-muted-foreground mb-6">
<strong>Clientes:</strong>
<br></br>
Avaliar o prestador antes da contratação
<br></br>
Negociar valores, prazos e condições diretamente
<br></br>
Resolver eventuais conflitos diretamente com o prestador
<br></br>
<br></br>
<strong>Prestadores:</strong>
<br></br>
Fornecer informações verdadeiras e atualizadas
<br></br>
Cumprir a legislação vigente
<br></br>
Ser integralmente responsável pelos serviços prestados
</p>

<h2 className="font-display font-bold text-2xl ">4. Limitação de Responsabilidade</h2>
<p className="text-muted-foreground mb-6">
A Upaon Services não se responsabiliza, em nenhuma hipótese, por:
<br></br>
Danos materiais, morais ou financeiros
<br></br>
Prejuízos decorrentes da prestação do serviço
<br></br>
Descumprimento de acordos entre usuários
<br></br>
Atos ilícitos praticados por prestadores ou clientes
<br></br>   
O uso da plataforma é feito por conta e risco do usuário.
</p>

<h2 className="font-display font-bold text-2xl ">5. Conteúdo e Informações</h2>
<p className="text-muted-foreground mb-6">
As informações fornecidas pelos prestadores são de sua inteira responsabilidade. A plataforma não garante a veracidade, exatidão ou atualização dos dados publicados.
</p>

<h2 className="font-display font-bold text-2xl ">6. Suspensão e Encerramento</h2>
<p className="text-muted-foreground mb-6">
A Upaon Services se reserva o direito de:
<br></br> 
Suspender ou excluir contas que violem estes termos
<br></br> 
Remover conteúdos inadequados ou ilegais
<br></br> 
Alterar ou encerrar funcionalidades da plataforma sem aviso prévio
</p>

<h2 className="font-display font-bold text-2xl ">7. Alterações dos Termos</h2>
<p className="text-muted-foreground mb-6">
Os Termos de Uso podem ser atualizados a qualquer momento. O uso contínuo da plataforma após alterações implica concordância com os novos termos.
</p>

<h2 className="font-display font-bold text-2xl ">8. Foro</h2>
<p className="text-muted-foreground mb-6">
Fica eleito o foro da comarca do domicílio da empresa, para dirimir quaisquer controvérsias relacionadas a estes Termos, com renúncia a qualquer outro.
</p>
</div>
</section>
</>
);
}