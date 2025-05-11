import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Facebook, Smartphone, ChevronLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import PageTransition from '@/components/PageTransition';

const formSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
});

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, isAuthenticated, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleError, setGoogleError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      setIsSubmitting(false);
    };
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!email || !password) {
    toast({
      title: "Erro de login",
      description: "Por favor, preencha todos os campos.",
      variant: "destructive",
    });
    return;
  }

  setIsSubmitting(true);
  try {
    await login(email, password);
    toast({ title: 'Login bem-sucedido', description: 'Você foi autenticado com sucesso!' });
    navigate('/');
  } catch (error: any) {
    toast({
      title: 'Erro de login',
      description: error.response?.data?.message || 'Email ou senha incorretos.',
      variant: 'destructive',
    });
    setEmail(''); // Clear email field
    setPassword(''); // Clear password field
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await login(values.email, values.password);
      toast({
        title: "Login bem-sucedido",
        description: "Você foi autenticado com sucesso!",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Erro de login",
        description: error.response?.data?.message || "Email ou senha incorretos.",
        variant: "destructive",
      });
  
      setEmail(''); // Clear email field
      setPassword(''); // Clear password field
    }
  };
    
    const handleGoogleLogin = () => {
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

    // Abre em nova janela (opcional)
    const width = 600;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    
    const popup = window.open(
      `${apiUrl}/api/auth/google`,
      'googleLogin',
      `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`
    );

    const checkPopup = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(checkPopup);
        setIsSubmitting(false);
      }
    }, 1000);

    // Ou redirecionamento direto:
    // window.location.href = `${apiUrl}/api/auth/google`;
  };

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

            <h1 className="text-2xl font-medium text-gray-700 mb-8">Entrar</h1>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-full md:w-1/2">
                <form onSubmit={handleLogin}>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Seu email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Senha
                    </label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-800 text-white py-3 rounded-md hover:bg-blue-900 transition-colors mb-4"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Entrando...' : 'Entrar'}
                  </Button>
                </form>
                
                <div className="text-center text-sm mb-6">
                  <Link 
                    to="/recuperar-senha" 
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Esqueceu sua senha?
                  </Link>
                </div>
                
                <div className="text-center text-sm">
                  <span className="text-gray-600">Não tem uma conta? </span>
                  <Link 
                    to="/inscrever-se" 
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Cadastre-se
                  </Link>
                </div>
                
                <div className="mt-6 relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-gradient-to-r from-sky-100 to-blue-200 text-gray-500">ou</span>
                  </div>
                </div>
                
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={handleGoogleLogin}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50 bg-white"
                    disabled={isSubmitting}
                  >
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                    </svg>
                    <span>Entrar com Google</span>
                  </button>
                </div>
                
                {googleError && (
                  <div className="text-red-500 text-sm mt-4 text-center">{googleError}</div>
                )}
              </div>
              
              <div className="w-full md:w-1/2 hidden md:flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Bem-vindo de volta!</h2>
                  <p className="text-gray-600 mb-6">
                    Acesse sua conta para aproveitar todos os recursos da nossa plataforma.
                  </p>
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

export default Login;