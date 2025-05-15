
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Shop from "./pages/Shop";
import Ratings from "./pages/Ratings";
import Workshop from "./pages/Workshop";
import AboutUs from "./pages/AboutUs";
import Novidades from "./pages/Novidades";
import FAQ from "./pages/FAQ";
import Contato from "./pages/Contato";
import Termos from "./pages/Termos";
import ProductDetail from "./pages/ProductDetail";
import Favorites from "./pages/Favorites";
import ProjectDetail from "./pages/ProjectDetail";
import UserProfile from "./pages/UserProfile";
import ForgotPassword from "./pages/ForgotPassword";
import { useAuth } from "./contexts/AuthContext"; 
import AuthSuccess from "./pages/AuthSuccess";


// Animated routes wrapper component
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/entrar" element={<Login />} />
        <Route path="/inscrever-se" element={<Register />} />
        <Route path="/loja" element={<Shop />} />
        <Route path="/produto/:productId" element={<ProductDetail />} />
        <Route path="/avalie-nos" element={<Ratings />} />
        <Route path="/workshop" element={<Workshop />} />
        <Route path="/workshop/projeto/:projectId" element={<ProjectDetail />} />
        <Route path="/favoritos" element={<Favorites />} />
        <Route path="/perfil" element={<UserProfile />} />
        <Route path="/sobre-nos" element={<AboutUs />} />
        <Route path="/novidades" element={<Novidades />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/termos" element={<Termos />} />
        <Route path="/recuperar-senha" element={<ForgotPassword />} />
        <Route path="/auth/success" element={<AuthSuccess />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <InnerApp />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

// Esse componente agora está dentro do AuthProvider
function InnerApp() {
  const { loading } = useAuth();

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {!loading ? (
        <AnimatedRoutes />
      ) : (
        <div className="w-screen h-screen flex items-center justify-center">
          Carregando...
        </div>
      )}
    </TooltipProvider>
  );
}

export default App;
