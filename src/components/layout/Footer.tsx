import { MapPin, Mail, Phone, Instagram,} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const Footer = () => {

  const anoAtual: number = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-primary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <a href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
                <img className="rounded-lg" src="/logo1.png" alt="" />
              </div>
              <span className="font-display font-bold text-xl">
                UpaonServices
              </span>
            </a>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-6">
              Conectando trabalhadores e clientes em São Luís do Maranhão. 
              A melhor plataforma de serviços da Ilha.
            </p>
            <div className="flex items-center gap-3">
              <a
                target="blank"
                href="https://www.instagram.com/upaonservices/"
                className="w-10 h-10 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-xl flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
               <a
               target="blank"
                href="https://w.app/upaonservices"
                className="w-10 h-10 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-xl flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <FaWhatsapp className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Links Rápidos</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
                  Buscar Serviços
                </a>
              </li>
              <li>
                <a href="#categorias" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
                  Categorias
                </a>
              </li>
              <li>
                <a href="#como-funciona" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
                  Como Funciona?
                </a>
              </li>
              <li>
                <a href="/cadastro/prestador" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
                  Seja um Profissional
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Suporte</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
                  Central de Ajuda
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
                  Fale Conosco
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Contato</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-primary-foreground/70 text-sm">
                  São Luís, Maranhão
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a target="blank" href="mailto:contato@upaonservices.com" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
                  contatoupaonservices@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a target="blank" href="tel:+5598984800522" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
                  (98) 989480-0522
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-primary-foreground/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/50 text-sm">
              © {anoAtual} UpaonServices. Todos os direitos reservados.
            </p>
            <p className="text-primary-foreground/50 text-sm">
              Conectando toda a Ilha do Amor
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
