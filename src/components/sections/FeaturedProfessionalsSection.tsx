import { Star, MapPin, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const professionals = [
  {
    id: 1,
    name: "Maria Silva",
    profession: "Diarista",
    rating: 4.9,
    reviews: 127,
    location: "Centro",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
    verified: true,
    price: "R$ 150",
    priceUnit: "/dia",
  },
  {
    id: 2,
    name: "João Santos",
    profession: "Eletricista",
    rating: 4.8,
    reviews: 89,
    location: "Cohama",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    verified: true,
    price: "R$ 80",
    priceUnit: "/hora",
  },
  {
    id: 3,
    name: "Ana Oliveira",
    profession: "Cuidadora de Idosos",
    rating: 5.0,
    reviews: 64,
    location: "Calhau",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    verified: true,
    price: "R$ 120",
    priceUnit: "/dia",
  },
  {
    id: 4,
    name: "Carlos Mendes",
    profession: "Pintor",
    rating: 4.7,
    reviews: 52,
    location: "São Francisco",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    verified: false,
    price: "R$ 200",
    priceUnit: "/cômodo",
  },
];

const FeaturedProfessionalsSection = () => {
  return (
    <section id="profissionais" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <span className="inline-block px-4 py-1.5 bg-sun/20 text-accent-foreground rounded-full text-sm font-semibold mb-4">
              Em Destaque
            </span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-2">
              Profissionais bem avaliados
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Conheça alguns dos profissionais mais bem avaliados da nossa plataforma
            </p>
          </div>
          <Button variant="outline" size="lg">
            Ver todos
          </Button>
        </div>

        {/* Professionals Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {professionals.map((pro, index) => (
            <div
              key={pro.id}
              className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-large transition-all duration-300 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={pro.image}
                  alt={pro.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {pro.verified && (
                  <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-palm" />
                    <span className="text-xs font-medium text-foreground">Verificado</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-display font-semibold text-foreground">
                      {pro.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {pro.profession}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-sun/20 px-2 py-1 rounded-lg">
                    <Star className="w-4 h-4 text-sun fill-sun" />
                    <span className="text-sm font-semibold text-accent-foreground">
                      {pro.rating}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{pro.location}</span>
                  <span className="mx-1">•</span>
                  <span>{pro.reviews} avaliações</span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <span className="font-display font-bold text-lg text-foreground">
                      {pro.price}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {pro.priceUnit}
                    </span>
                  </div>
                  <Button variant="default" size="sm">
                    Contratar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProfessionalsSection;
