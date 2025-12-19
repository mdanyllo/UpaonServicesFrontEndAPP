import { Search, MessageSquare, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Busque o serviço",
    description: "Pesquise pelo serviço que você precisa ou navegue pelas categorias disponíveis.",
    color: "bg-primary text-primary-foreground",
  },
  {
    icon: MessageSquare,
    number: "02",
    title: "Converse com profissionais",
    description: "Entre em contato diretamente com os profissionais, compare preços e avaliações.",
    color: "bg-ocean text-secondary-foreground",
  },
  {
    icon: CheckCircle,
    number: "03",
    title: "Contrate e avalie",
    description: "Feche o serviço com confiança e deixe sua avaliação para ajudar outros usuários.",
    color: "bg-palm text-primary-foreground",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="como-funciona" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-ocean/10 text-ocean rounded-full text-sm font-semibold mb-4">
            Como Funciona
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4">
            Simples e rápido
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Em apenas 3 passos você encontra o profissional ideal para o seu serviço na <span className="text-gradient-hero">UpaonServices</span>
          </p>
        </div>

        {/* Steps */}
        {/* MUDANÇA AQUI: Adicionei [zoom:0.85] para mobile e md:[zoom:1] para resetar no desktop */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto [zoom:0.85] md:[zoom:1]">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative animate-fade-in-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-border" />
              )}

              <div className="relative bg-card rounded-3xl p-8 border border-border hover:shadow-large transition-shadow duration-300">
                {/* Number badge */}
                <span className="absolute -top-3 -right-3 w-10 h-10 bg-sun text-accent-foreground rounded-xl flex items-center justify-center font-display font-bold text-sm shadow-soft">
                  {step.number}
                </span>

                {/* Icon */}
                <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <step.icon className="w-8 h-8" />
                </div>

                {/* Content */}
                <h3 className="font-display font-bold text-xl text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;