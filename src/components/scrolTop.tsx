import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // A mágica acontece aqui: Joga pro topo (0, 0) instantaneamente
    window.scrollTo(0, 0);
  }, [pathname]); // Roda toda vez que o caminho (URL) muda

  return null; // Esse componente não renderiza nada visualmente
}