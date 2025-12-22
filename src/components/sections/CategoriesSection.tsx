import { 
  Wrench, 
  Paintbrush, 
  Scissors, 
  Truck, 
  Baby, 
  Laptop, 
  Hammer, 
  Sparkles,
  ChefHat,
  Camera,
  Car,
  Heart
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const categories = [
  { icon: Wrench, name: "Reparos", count: "120+", color: "bg-primary/10 text-primary" },
  { icon: Sparkles, name: "Limpeza", count: "85+", color: "bg-ocean/10 text-ocean" },
  { icon: Paintbrush, name: "Pintura", count: "45+", color: "bg-sun/20 text-accent-foreground" },
  { icon: Hammer, name: "Construção", count: "60+", color: "bg-palm/10 text-palm" },
  { icon: Scissors, name: "Beleza", count: "95+", color: "bg-coral-light/20 text-coral-dark" },
  { icon: Baby, name: "Babás", count: "40+", color: "bg-ocean-light/20 text-ocean-dark" },
  { icon: Heart, name: "Cuidadores", count: "35+", color: "bg-destructive/10 text-destructive" },
  { icon: Laptop, name: "Tecnologia", count: "55+", color: "bg-secondary/20 text-secondary" },
  { icon: ChefHat, name: "Culinária", count: "30+", color: "bg-sun/15 text-accent-foreground" },
  { icon: Truck, name: "Mudanças", count: "25+", color: "bg-muted text-muted-foreground" },
  { icon: Camera, name: "Fotografia", count: "20+", color: "bg-primary/10 text-primary" },
  { icon: Car, name: "Motoristas", count: "50+", color: "bg-palm/15 text-palm" },
];

const CategoriesSection = () => {
  const navigate = useNavigate();

  function handleCategoryClick(categoryName: string) {
    const params = new URLSearchParams();
    params.append("category", categoryName);

    navigate(`/resultados?${params.toString()}`);
  }

  return (
    <section id="categorias" className="py-12 mb-10 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
            Categorias
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4">
            Explore por categoria
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Encontre o profissional ideal para cada tipo de serviço que você precisa
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <button
              key={category.name}
              onClick={() => handleCategoryClick(category.name)}
              className="group p-6 bg-card rounded-2xl border border-border hover:border-primary/50 hover:shadow-medium transition-all duration-300 text-center animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className={`w-14 h-14 ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <category.icon className="w-7 h-7" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-1">
                {category.name}
              </h3>
              {/* Mais pra frente, quando tiver mais gente
              <p className="text-sm text-muted-foreground">
                {category.count} profissionais
              </p>*/}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
