import React, { useState, useEffect } from 'react';
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
  const navigate = useNavigate();;

  // Modal estados
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const { currentUser, logout, isAuthenticated, deleteAccount } = useAuth();

  // Dados endereço
  const [addressForm, setAddressForm] = useState({
    cep: '',
    estado: '',
    cidade: '',
    rua: '',
    numero: ''
  });

  // Dados perfil
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    password: ''
  });

  // Dados para alteração de senha
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/entrar');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (currentUser?.address) {
      setAddressForm({
        cep: currentUser.cep || '',
        estado: currentUser.estado || '',
        cidade: currentUser.cidade || '',
        rua: currentUser.rua || '',
        numero: currentUser.numero || ''
      });
    }
  }, [currentUser]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Endereço salvo:\nCEP: ${addressForm.cep}\nEstado: ${addressForm.estado}\nCidade: ${addressForm.cidade}\nRua: ${addressForm.rua}\nNúmero: ${addressForm.numero}`);
    setIsAddressModalOpen(false);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.name.trim() || !profileForm.email.trim()) {
      alert('Nome e email são obrigatórios.');
      return;
    }
    if (profileForm.password && profileForm.password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    alert(`Perfil atualizado:\nNome: ${profileForm.name}\nEmail: ${profileForm.email}`);
    setIsEditProfileOpen(false);
    setProfileForm(prev => ({ ...prev, password: '' }));
  };

  // Validação e submissão de troca de senha
  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (!passwordForm.currentPassword.trim() || !passwordForm.newPassword.trim() || !passwordForm.confirmPassword.trim()) {
      setPasswordError('Preencha todos os campos.');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('A confirmação da nova senha não confere.');
      return;
    }

    // Aqui você pode chamar o método do contexto para alterar senha
    // Exemplo:
    /*
    changePassword(passwordForm.currentPassword, passwordForm.newPassword)
      .then(() => {
        alert('Senha alterada com sucesso!');
        setIsChangePasswordOpen(false);
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      })
      .catch(err => {
        setPasswordError('Erro ao alterar senha. Verifique a senha atual.');
      });
    */

    // Como exemplo, simular sucesso:
    alert('Senha alterada com sucesso!');
    setIsChangePasswordOpen(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleBack = () => {
    navigate(-1);
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

                <div className="ml-auto flex flex-col gap-2">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 text-red-500 hover:text-red-600"
                    onClick={logout}
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </Button>
                  <Button
                    variant="secondary"
                    className="bg-black text-white hover:bg-gray-800"
                    onClick={() => setIsAddressModalOpen(true)}
                  >
                    Dados de Entrega
                  </Button>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Botões */}
              <div className="flex flex-col md:flex-row gap-4">
                <Button
                  variant="outline"
                  className="flex-1 bg-black text-white hover:bg-gray-800"
                  onClick={() => setIsEditProfileOpen(true)}
                >
                  Editar Perfil
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 bg-black text-white hover:bg-gray-800"
                  onClick={() => setIsChangePasswordOpen(true)}
                >
                  Alterar Senha
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 bg-red-600 text-white hover:bg-red-950"
                  onClick={async () => {
                    if (confirm('Tem certeza que deseja excluir sua conta? Essa ação é irreversível.')) {
                      try {
                        await deleteAccount();
                        navigate('/'); // Redirecionar após exclusão
                      } catch (err) {
                        alert('Erro ao excluir conta. Tente novamente.');
                      }
                    }
                  }}
                >
                  Excluir Conta
                </Button>
              </div>
            </div>

            {/* Modal Dados de Entrega */}
            {isAddressModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
                  <h2 className="text-xl font-semibold mb-4">Dados de Entrega</h2>
                  <form onSubmit={handleAddressSubmit} className="space-y-4">
                    {/* Campos de endereço... (mesmo que antes) */}
                    <div>
                      <label htmlFor="cep" className="block text-sm font-medium text-gray-700">CEP</label>
                      <input
                        type="text"
                        name="cep"
                        id="cep"
                        value={addressForm.cep}
                        onChange={handleAddressChange}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        placeholder="00000-000"
                      />
                    </div>
                    <div>
                      <label htmlFor="estado" className="block text-sm font-medium text-gray-700">Estado</label>
                      <input
                        type="text"
                        name="estado"
                        id="estado"
                        value={addressForm.estado}
                        onChange={handleAddressChange}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        placeholder="Ex: São Paulo"
                      />
                    </div>
                    <div>
                      <label htmlFor="cidade" className="block text-sm font-medium text-gray-700">Cidade</label>
                      <input
                        type="text"
                        name="cidade"
                        id="cidade"
                        value={addressForm.cidade}
                        onChange={handleAddressChange}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        placeholder="Ex: Campinas"
                      />
                    </div>
                    <div>
                      <label htmlFor="rua" className="block text-sm font-medium text-gray-700">Rua</label>
                      <input
                        type="text"
                        name="rua"
                        id="rua"
                        value={addressForm.rua}
                        onChange={handleAddressChange}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        placeholder="Ex: Rua das Flores"
                      />
                    </div>
                    <div>
                      <label htmlFor="numero" className="block text-sm font-medium text-gray-700">Número</label>
                      <input
                        type="text"
                        name="numero"
                        id="numero"
                        value={addressForm.numero}
                        onChange={handleAddressChange}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        placeholder="Ex: 123"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddressModalOpen(false)}
                      >
                        Fechar
                      </Button>
                      <Button type="submit" className="flex-1 bg-black text-white hover:bg-robot-blue transition-colors duration-300">
                        Salvar
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Modal Editar Perfil */}
            {isEditProfileOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
                  <h2 className="text-xl font-semibold mb-4">Editar Perfil</h2>
                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    {/* Campos editar perfil (nome, email, senha opcional) */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={profileForm.name}
                        onChange={handleProfileChange}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        placeholder="Seu nome completo"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={profileForm.email}
                        onChange={handleProfileChange}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        placeholder="Seu email"
                      />
                    </div>
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        value={profileForm.password}
                        onChange={handleProfileChange}
                        placeholder="Nova senha (deixe em branco para manter)"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                      />
                    </div>

                    <h3 className="font-semibold mt-4 mb-2">Dados de Entrega</h3>

                    {/* Campos endereço */}
                    <div>
                      <label htmlFor="cep" className="block text-sm font-medium text-gray-700">CEP</label>
                      <input
                        type="text"
                        name="cep"
                        id="cep"
                        value={addressForm.cep}
                        onChange={handleAddressChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        placeholder="00000-000"
                      />
                    </div>
                    <div>
                      <label htmlFor="estado" className="block text-sm font-medium text-gray-700">Estado</label>
                      <input
                        type="text"
                        name="estado"
                        id="estado"
                        value={addressForm.estado}
                        onChange={handleAddressChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        placeholder="Ex: São Paulo"
                      />
                    </div>
                    <div>
                      <label htmlFor="cidade" className="block text-sm font-medium text-gray-700">Cidade</label>
                      <input
                        type="text"
                        name="cidade"
                        id="cidade"
                        value={addressForm.cidade}
                        onChange={handleAddressChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        placeholder="Ex: Campinas"
                      />
                    </div>
                    <div>
                      <label htmlFor="rua" className="block text-sm font-medium text-gray-700">Rua</label>
                      <input
                        type="text"
                        name="rua"
                        id="rua"
                        value={addressForm.rua}
                        onChange={handleAddressChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        placeholder="Ex: Rua das Flores"
                      />
                    </div>
                    <div>
                      <label htmlFor="numero" className="block text-sm font-medium text-gray-700">Número</label>
                      <input
                        type="text"
                        name="numero"
                        id="numero"
                        value={addressForm.numero}
                        onChange={handleAddressChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        placeholder="Ex: 123"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditProfileOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" className="flex-1 bg-black text-white hover:bg-robot-blue transition-colors duration-300">
                        Salvar
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Modal Alterar Senha */}
            {isChangePasswordOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
                  <h2 className="text-xl font-semibold mb-4">Alterar Senha</h2>
                  <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                        Senha Atual
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                        Nova Senha
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirmar Nova Senha
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                      />
                    </div>
                    {passwordError && (
                      <p className="text-red-600 text-sm">{passwordError}</p>
                    )}
                    <div className="flex justify-end gap-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsChangePasswordOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" className="flex-1 bg-black text-white hover:bg-robot-blue transition-colors duration-300">
                        Salvar Senha
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </PageTransition>

      <Footer />
    </div>
  );
};

export default UserProfile;
