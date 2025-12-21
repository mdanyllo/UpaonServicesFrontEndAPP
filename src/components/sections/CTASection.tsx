import { ArrowRight, Briefcase, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CTASection = () => {

  const navigate = useNavigate()
  
  function handleChoose(path: "/cadastro/cliente" | "/cadastro/prestador") {
    navigate(path)
  }

  return (
    <section className="py-20 bg-gradient-hero relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-sun/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 [zoom:0.85] md:[zoom:1]">
          
          {/* For Service Seekers - Adicionado flex flex-col justify-between */}
          <div className="bg-card/10 backdrop-blur-sm rounded-3xl p-8 md:p-10 border border-primary-foreground/20 flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 bg-primary-foreground/20 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-display font-bold text-2xl md:text-3xl text-primary-foreground mb-4">
                Precisa de um serviço?
              </h3>
              <p className="text-primary-foreground/80 mb-8 leading-relaxed">
                Encontre profissionais qualificados para qualquer tipo de serviço. 
                Compare preços, leia avaliações e contrate com segurança.
              </p>
            </div>
            <div>
              <Button 
                variant="white" 
                size="lg"
                className="group"
                onClick={() => handleChoose("/cadastro/cliente")}
              >
                Buscar profissionais
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          {/* For Professionals - Adicionado flex flex-col justify-between */}
          <div className="bg-card/10 backdrop-blur-sm rounded-3xl p-8 md:p-10 border border-primary-foreground/20 flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 bg-primary-foreground/20 rounded-2xl flex items-center justify-center mb-6">
                <Briefcase className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-display font-bold text-2xl md:text-3xl text-primary-foreground mb-4">
                É profissional?
              </h3>
              <p className="text-primary-foreground/80 mb-8 leading-relaxed">
                Cadastre-se gratuitamente e comece a receber propostas de trabalho. 
                Aumente sua renda e conquiste novos clientes em São Luís.
              </p>
            </div>
            <div>
              <Button 
                variant="white" 
                size="lg"
                className="group w-full md:w-auto"
                onClick={() => handleChoose("/cadastro/prestador")}
              >
                Cadastrar como profissional
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;