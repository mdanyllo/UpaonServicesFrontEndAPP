import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/scrolTop";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Cadastro } from "./pages/cadastro";
import { Prestador } from "./pages/cadastro/prestador";
import { Cliente } from "./pages/cadastro/cliente";
import { LoginPage } from "./pages/login";
import { ResultadosPesquisa } from "./pages/resultadospesquisa";
import { CentralDeAjuda } from "./pages/suporte/centraldeajuda";
import { TermosDeUso } from "./pages/suporte/termosdeuso";
import { PoliticaDePrivacidade } from "./pages/suporte/politicadeprivacidade";
import ProviderDashboard from "./pages/dashboard/prestador";
import { EditProfilePrestador } from "./pages/dashboard/editarPerfilPrestador";
import { EditProfileCliente } from "./pages/dashboard/editarPerfilCliente";
import { ClienteDashboard } from "./pages/dashboard/cliente";
import { VerifyAccount } from "./pages/verifyAccount";
import { Categorias } from "./pages/dashboard/categorias";
import { PrestadorDetalhes } from "./pages/perfilPrestador";
import { Historico } from "./pages/Historico";
import { RecoverPassword } from "./pages/RecoverPassword";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
      <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* ROTAS ESPECÍFICAS PRIMEIRO */}
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/cadastro/prestador" element={<Prestador />} />
          <Route path="/cadastro/cliente" element={<Cliente />} />
          <Route path="/verificar-conta" element={<VerifyAccount />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/recuperar-senha" element={<RecoverPassword />} />
          
          <Route path="/dashboard/prestador" element={<ProviderDashboard/>} />
          <Route path="/dashboard/prestador/perfil" element={<EditProfilePrestador />} />
          <Route path="/dashboard/cliente/perfil" element={<EditProfileCliente />} />
          <Route path="/dashboard/cliente" element={<ClienteDashboard />} />
          
          <Route path="/historico" element={<Historico />} />
          <Route path="/prestador/:id" element={<PrestadorDetalhes />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/resultados" element={<ResultadosPesquisa />}/>
          
          <Route path="/suporte/centraldeajuda" element={<CentralDeAjuda />} />
          <Route path="/suporte/termosdeuso" element={<TermosDeUso/>} />
          <Route path="/suporte/politicadeprivacidade" element={<PoliticaDePrivacidade/>} />
          <Route path="*" element={<NotFound />} />
          
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;