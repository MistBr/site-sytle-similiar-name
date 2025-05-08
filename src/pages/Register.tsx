import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import PageTransition from '@/components/PageTransition';

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register, isAuthenticated, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleError, setGoogleError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro no cadastro",
        description: "As senhas não coincidem.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await register(formData.name, formData.email, formData.password);
      // O AuthContext já vai mostrar o toast e redirecionar para /entrar
    } catch (error) {
      console.error('Registration error:', error);
      // Já tratado dentro do AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const handleGoogleRegister = () => {
    setIsSubmitting(true);
    setGoogleError('');
    
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      console.error('API URL não configurada');
      toast({
        title: "Erro de configuração",
        description: "Serviço indisponível no momento.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    window.location.href = `${apiUrl}/api/auth/google?action=register`;
  };
  const location = useLocation();
useEffect(() => {
  if (location.state?.fromRegister) {
    toast({
      title: "Cadastro realizado!",
      description: "Por favor, faça login com suas credenciais.",
      variant: "default"
    });
    // Limpa o estado para não mostrar a mensagem novamente
    window.history.replaceState({}, document.title);
  }
}, [location]);


  // Don't render the form if already authenticated or loading
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <PageTransition>
        <div className="flex-grow bg-gradient-to-r from-sky-100 to-blue-200 py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-4">
              <Button 
                className="flex items-center gap-2 bg-white"
                onClick={handleBack}
              >
                <ChevronLeft className="h-4 w-4" />
                Voltar
              </Button>
            </div>

            <h1 className="text-2xl font-medium text-gray-700 mb-8">Criar conta</h1>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-full md:w-1/2">
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome completo
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Seu nome completo"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Seu email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Senha
                    </label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Sua senha (mínimo 6 caracteres)"
                      value={formData.password}
                      onChange={handleChange}
                      minLength={6}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirmar senha
                    </label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirme sua senha"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-800 text-white py-3 rounded-md hover:bg-blue-900 transition-colors mb-4"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Criando conta...' : 'Criar conta'}
                  </Button>
                </form>
                
                <div className="mt-6 relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-gradient-to-r from-sky-100 to-blue-200 text-gray-500">ou</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button 
                    onClick={handleGoogleRegister}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50 bg-white"
                    disabled={isSubmitting}
                  >
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                    </svg>
                    <span>Cadastrar com Google</span>
                  </button>
                </div>
                
                {googleError && (
                  <div className="text-red-500 text-sm mt-4 text-center">{googleError}</div>
                )}
                
                <div className="mt-6 text-center text-sm">
                  <span className="text-gray-600">Já tem uma conta? </span>
                  <Link 
                    to="/entrar" 
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Faça login
                  </Link>
                </div>
              </div>
              
              <div className="w-full md:w-1/2 hidden md:flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Junte-se a nós!</h2>
                  <p className="text-gray-600 mb-6">
                    Crie sua conta para acessar recursos exclusivos e personalizar sua experiência.
                  </p>
                  <img 
                    src="/images/signup-illustration.svg" 
                    alt="Signup Illustration" 
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
      
      <Footer />
    </div>
  );
};

export default Register;