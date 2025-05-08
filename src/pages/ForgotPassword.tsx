import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import PageTransition from '@/components/PageTransition';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, informe seu email.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Simulação de envio de email
      await new Promise(resolve => setTimeout(resolve, 1500));
      setEmailSent(true);
      toast({
        title: "Email enviado",
        description: "Verifique sua caixa de entrada para as instruções de recuperação.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erro ao enviar",
        description: "Ocorreu um erro ao tentar enviar o email de recuperação.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <PageTransition>
        <div className="flex-grow bg-gradient-to-r from-sky-100 to-blue-200 py-12 px-6">
          <div className="max-w-md mx-auto">
            <div className="mb-4">
              <Button 
                className="flex items-center gap-2 bg-white"
                onClick={handleBack}
              >
                <ChevronLeft className="h-4 w-4" />
                Voltar
              </Button>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h1 className="text-2xl font-medium text-gray-700 mb-2">Recuperar senha</h1>
              
              {!emailSent ? (
                <>
                  <p className="text-gray-600 mb-6">
                    Digite o email associado à sua conta e enviaremos um link para redefinir sua senha.
                  </p>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Seu email cadastrado"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-blue-800 text-white py-3 rounded-md hover:bg-blue-900 transition-colors mb-4"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Enviando...' : 'Enviar instruções'}
                    </Button>
                  </form>
                </>
              ) : (
                <div className="text-center">
                  <div className="mb-6 p-4 bg-green-50 rounded-lg">
                    <svg 
                      className="mx-auto h-12 w-12 text-green-500" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Email enviado com sucesso!</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
                    </p>
                  </div>
                  
                  <p className="text-sm text-gray-600">
                    Não recebeu o email?{' '}
                    <button 
                      onClick={() => setEmailSent(false)}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      Tentar novamente
                    </button>
                  </p>
                </div>
              )}
              
              <div className="mt-6 text-center text-sm">
                <Link 
                  to="/entrar" 
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Voltar para o login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
      
      <Footer />
    </div>
  );
};

export default ForgotPassword;