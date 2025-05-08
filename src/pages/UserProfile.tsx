
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, LogOut, Camera, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import PageTransition from '@/components/PageTransition';

const UserProfile = () => {
  const navigate = useNavigate();
  const { currentUser, logout, isAuthenticated } = useAuth();
  
  const handleBack = () => {
    navigate(-1);
  };

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    React.useEffect(() => {
      navigate('/entrar');
    }, [navigate]);
    return null;
  }

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <PageTransition>
        <div className="flex-grow bg-gradient-to-r from-sky-100 to-blue-200 py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-4">
              <Button 
                variant="outline" 
                className="flex items-center gap-2 bg-white"
                onClick={handleBack}
              >
                <ChevronLeft className="h-4 w-4" />
                Voltar
              </Button>
            </div>

            <h1 className="text-2xl font-medium text-gray-700 mb-8">Meu Perfil</h1>
            
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-2 border-white shadow-md">
                    {currentUser?.photoURL ? (
                      <AvatarImage src={currentUser.photoURL} alt={currentUser.name} />
                    ) : (
                      <AvatarFallback className="text-xl bg-blue-100 text-blue-800">
                        {getInitials(currentUser?.name || 'U')}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <Button 
                    size="icon" 
                    variant="outline"
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-white"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="text-center md:text-left">
                  <h2 className="text-xl font-semibold">{currentUser?.name}</h2>
                  <p className="text-gray-600 text-sm mt-1">{currentUser?.email}</p>
                  <div className="mt-2 text-sm text-blue-600 font-medium">
                    Conta {currentUser?.provider === 'google' ? 'Google' : 'Manual'}
                  </div>
                </div>

                <div className="ml-auto">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2 text-red-500 hover:text-red-600"
                    onClick={logout}
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </Button>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-medium mb-4">Informações de Contato</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Email</p>
                          <p className="text-gray-600">{currentUser?.email || 'Não informado'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Telefone</p>
                          <p className="text-gray-600">{currentUser?.phone || 'Não informado'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Endereço</p>
                          <p className="text-gray-600">{currentUser?.address || 'Não informado'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Idade</p>
                          <p className="text-gray-600">{currentUser?.age || 'Não informado'}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-medium mb-4">Atividade Recente</h3>
                    
                    {/* This would be populated with actual user activity in a real app */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm">Último login</span>
                        <span className="text-xs text-gray-500">Hoje, 12:35</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm">Último pedido</span>
                        <span className="text-xs text-gray-500">2 dias atrás</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm">Últimos favoritos</span>
                        <span className="text-xs text-gray-500">3 dias atrás</span>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Button variant="link" className="p-0 h-auto text-sm text-blue-600">
                        Ver todo histórico
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <Button variant="outline" className="flex-1">
                Editar Perfil
              </Button>
              <Button variant="outline" className="flex-1">
                Alterar Senha
              </Button>
              <Button variant="outline" className="flex-1 text-red-500 hover:text-red-600 hover:bg-red-50">
                Excluir Conta
              </Button>
            </div>
          </div>
        </div>
      </PageTransition>
      
      <Footer />
    </div>
  );
};

export default UserProfile;
