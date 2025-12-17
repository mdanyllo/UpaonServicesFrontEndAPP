import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, MapPin } from "lucide-react";
import { Link } from "react-router-dom"

const Fora = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50  bg-card/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="relative flex items-center h-16 md:h-20">
          {/* Left: Logo */}
          <a href="/" className="flex items-center gap-2 z-20">
            <div className="w-10 h-10 flex items-center justify-center">
              <img className="rounded-lg" src="/logo1.png" alt="" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">
              UpaonServices
            </span>
          </a>

          {/* Right: City + CTAs */}
          <div className="ml-auto flex items-center z-20">
            {/* Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Entrar</Link>
              </Button>
              <Button variant="hero" size="sm" asChild>
                <Link to="/cadastro">Cadastrar</Link>
              </Button>
            </div>

            {/* Mobile menu button */}
              <Button variant="ghost" className="justify-start md:hidden" asChild>
                <Link to="/login">Entrar</Link>
              </Button>

            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen((s) => !s)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu (aparece abaixo do header sem deslocar o layout) */}
        <div
          className={`md:hidden origin-top transition-all duration-150 overflow-hidden ${
            isMenuOpen ? "max-h-[500px] py-4 border-t border-border" : "max-h-0"
          }`}
        >
            <div className="flex flex-col gap-2 pt-4 border-t border-border">
              <Button variant="hero" size="sm" asChild>
                <Link to="/cadastro">Cadastrar</Link>
              </Button>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Fora;
