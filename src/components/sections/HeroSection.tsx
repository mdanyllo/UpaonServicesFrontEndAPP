import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

type Stats = {
  providers: number
  clients: number
  services: number
}

const HeroSection = () => {
  
  const cities = [
    { name: "São Luís-MA", time: 8000 },
    { name: "Paço do Lumiar-MA", time: 4000 },
    { name: "São José de Ribamar-MA", time: 4000 },
    { name: "Raposa-MA", time: 4000 },
    { name: "Ilha do Amor", time: 6000 },
  ];

  const [index, setIndex] = useState(0);

  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    const currentTime = cities[index].time;

    const timer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % cities.length);
    }, currentTime);

    return () => clearTimeout(timer);
  }, [index]);


  //Stats rota

  useEffect(() => {
    async function loadStats() {
      const res = await fetch(
        "https://upaonservicesbackprototipo.onrender.com/stats"
      )

      const data = await res.json()
      setStats(data)
    }

    loadStats()
  }, [])

  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-gradient-sunset">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-ocean/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sun/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="mt-2 inline-flex justify-center items-center gap-2 bg-card/80 backdrop-blur-sm border border-border rounded-full px-4 py-2 mb-8 animate-fade-in shadow-soft">
            {/* City block: largura fixa para não mover layout */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground flex-none min-w-[160px] md:min-w-[200px]">
              <MapPin className="w-4 h-4 text-primary" />
              <span
                className="truncate block"
                aria-live="polite"
                title={cities[index].name}
              >
                {cities[index].name}
              </span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-foreground mb-6 leading-tight animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Encontre os melhores{" "}
            <span className="text-gradient-hero">profissionais</span>{" "}
            da Ilha
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Conectamos você a trabalhadores qualificados para qualquer serviço. 
            Do conserto ao cuidado, tudo que você precisa está aqui.
          </p>

          {/* Search Bar */}
          <div className="bg-card rounded-2xl p-2 md:p-3 shadow-large max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <div className="flex flex-col md:flex-row gap-2 md:gap-0">
              <div className="flex-1 flex items-center gap-3 px-4 py-2">
                <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <Input
                  type="text"
                  placeholder="Que serviço você precisa?"
                  className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base placeholder:text-muted-foreground"
                />
              </div>
              <Button variant="hero" size="lg" className="md:rounded-l-none">
                Buscar
              </Button>
            </div>
          </div>

          {/* Popular Services */}
          <div className="mt-8 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <p className="text-sm text-muted-foreground mb-3">Buscas populares:</p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {["Eletricista", "Diarista", "Encanador", "Pintor", "Cuidador"].map((service) => (
                <button
                  key={service}
                  className="px-4 py-2 bg-card hover:bg-muted border border-border rounded-full text-sm font-medium text-foreground transition-colors"
                >
                  {service}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}  
          <div className="grid grid-cols-3 gap-4 md:gap-8 mt-16 max-w-xl mx-auto animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <div className="text-center">
              <p className="font-display font-bold text-2xl md:text-3xl text-foreground">{stats?.providers ?? 0}</p>
              <p className="text-sm text-muted-foreground">Profissionais</p>
            </div>
            <div className="text-center">
              <p className="font-display font-bold text-2xl md:text-3xl text-foreground">{stats?.clients ?? 0}</p>
              <p className="text-sm text-muted-foreground">Usuários</p>
            </div>
            <div className="text-center">
              <p className="font-display font-bold text-2xl md:text-3xl text-foreground">2.5</p>
              <p className="text-sm text-muted-foreground">Serviços</p>
            </div>
          </div>
        </div>
      </div>

      {/* Wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 120L60 105C120 90 240 60 360 52.5C480 45 600 60 720 67.5C840 75 960 75 1080 67.5C1200 60 1320 45 1380 37.5L1440 30V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
