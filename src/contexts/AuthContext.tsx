  import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { useToast } from "@/hooks/use-toast";
  import api from '@/services/api';
  import axios from 'axios';


  export interface UserProfile {
    id: string;
    name: string;
    email: string;
    photoURL?: string;
    phone?: string;
    address?: string;
    age?: string;
    provider: 'google' | 'manual';
    token?: string;
  }

  interface AuthContextType {
    currentUser: UserProfile | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    loginWithGoogle: (googleToken: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    registerWithGoogle: (googleToken: string) => Promise<void>;
    logout: () => void;
    updateUser: (updatedData: Partial<UserProfile>) => Promise<void>;
    changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
    isAuthenticated: boolean;
    deleteAccount: () => Promise<void>;
  }

  const AuthContext = createContext<AuthContextType | undefined>(undefined);

  const parseUserProfile = (data: any, provider: 'manual' | 'google', token: string): UserProfile => ({
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    address: data.address,
    age: data.age,
    photoURL: data.photoURL,
    provider,
    token,
  });

  export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleUserAuth = (user: UserProfile, token: string) => {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    };

    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('currentUser');

      if (token && savedUser) {
        try {
          await api.get('/auth/validate', {
            headers: { Authorization: `Bearer ${token}` },
          });

          setCurrentUser(JSON.parse(savedUser));
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch (error) {
          console.error('Token inválido ou expirado:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('currentUser');
        }
      }
      setLoading(false);
    };

    useEffect(() => {
      initializeAuth();
    }, []);

const login = async (email: string, password: string) => {
  console.log('Login function called with email and password:', email, password);
  setLoading(true);

  try {
    interface LoginResponse {
      user: any;
      token: string;
    }

    console.log('Making POST request to /auth/login endpoint...');
    const response = await api.post<{ data: LoginResponse }>('/auth/login', { email, password });

    // Tipando corretamente a estrutura da resposta
    const { user: userData, token } = response.data.data;

    const user = parseUserProfile(userData, 'manual', token);
    console.log('Parsed user data:', user);
    handleUserAuth(user, token);

    toast({ title: "Login bem-sucedido", description: "Você entrou com sucesso!" });
    navigate('/');
  } catch (error: any) {
    console.error('Error occurred during login:', error);
    throw error;
  } finally {
    setLoading(false);
  }
};

    

    const loginWithGoogle = async (googleToken: string) => {
      setLoading(true);
      try {
        interface GoogleLoginResponse {
          user: any;
          token: string;
        }
        const response = await api.post<GoogleLoginResponse>('/auth/google', { token: googleToken });
        const user = parseUserProfile(response.data.user, 'google', response.data.token);
        handleUserAuth(user, response.data.token);

        toast({ title: "Login com Google", description: "Autenticado com Google com sucesso!" });
        navigate('/');
      } catch (error: any) {
        toast({
          title: "Erro de login",
          description: error.response?.data?.message || "Ocorreu um erro ao tentar fazer login com Google.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    const register = async (name: string, email: string, password: string) => {
      setLoading(true);
      try {
        const passwordConfirm = password;
        await api.post('/auth/register', { name, email, password, passwordConfirm });
    
        toast({ title: "Registro bem-sucedido", description: "Sua conta foi criada com sucesso!" });
    
        navigate('/entrar', { state: { fromRegister: true } }); 
        // Redireciona para tela de login com o estado para mostrar a mensagem
      } catch (error: any) {
        toast({
          title: "Erro de registro",
          description: error.response?.data?.message || "Ocorreu um erro ao tentar criar sua conta.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    

    const registerWithGoogle = async (googleToken: string) => {
      setLoading(true);
      try {
        interface GoogleRegisterResponse {
          user: any;
          token: string;
        }
        const response = await api.post<GoogleRegisterResponse>('/auth/google/register', { token: googleToken });
        const user = parseUserProfile(response.data.user, 'google', response.data.token);
        handleUserAuth(user, response.data.token);

        toast({ title: "Registro com Google", description: "Conta criada com Google com sucesso!" });
        navigate('/');
      } catch (error: any) {
        toast({
          title: "Erro de registro",
          description: error.response?.data?.message || "Ocorreu um erro ao tentar registrar com Google.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

const API_URL = import.meta.env.VITE_API_URL;

const deleteAccount = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error("Token não encontrado");

    const res = await axios.delete(`${API_URL}/api/auth/delete`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    toast({
      title: "Conta excluída com sucesso!",
      description: "Sua conta foi removida do sistema.",
    });

    logout(); // ou redirect para /entrar
  } catch (err: any) {
    console.error("Erro ao excluir conta:", err);

    toast({
      title: "Erro ao excluir conta",
      description: err.response?.data?.message || "Ocorreu um erro inesperado. Tente novamente mais tarde.",
      variant: "destructive",
    });
  }
};
    const logout = () => {
      setCurrentUser(null);
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
      localStorage.removeItem('robotCleanerCart');
      delete api.defaults.headers.common['Authorization'];

      toast({ title: "Logout realizado", description: "Você saiu da sua conta com sucesso." });
      navigate('/entrar');
    };

    const changePassword = async (currentPassword: string, newPassword: string) => {
      setLoading(true);
      try {
        await api.post('/auth/change-password', { currentPassword, newPassword });
        toast({ title: "Senha alterada", description: "Sua senha foi alterada com sucesso!" });
      } catch (error: any) {
    toast({
      description: error.response?.data?.message || "Ocorreu um erro ao tentar alterar sua senha.",
      variant: "destructive",
    });
      } finally {
        setLoading(false);
      }
    };

const updateUser = async (updatedData: Partial<UserProfile>) => {
  if (!currentUser) return;

  setLoading(true);
  try {
    const response = await api.put('/auth/update', updatedData);
    const updatedUser = { ...currentUser, ...(typeof response.data === 'object' && response.data !== null ? response.data : {}) };
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    toast({ title: "Perfil atualizado", description: "Seus dados foram atualizados com sucesso!" });
  } catch (error: any) {
    toast({
      title: "Erro ao atualizar perfil",
      description: error.response?.data?.message || "Ocorreu um erro ao tentar atualizar seu perfil.",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};

return (
  <AuthContext.Provider value={{
    currentUser,
    loading,
    login,
    loginWithGoogle,
    register,
    registerWithGoogle,
    logout,
    updateUser,
    changePassword,
    deleteAccount, // novo
    isAuthenticated: !!currentUser
  }}>
    {children}
  </AuthContext.Provider>
);

  };

function AuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token); // ou sessionStorage
      navigate('/'); // redireciona para página principal
    } else {
      navigate('/entrar'); // volta se não tiver token
    }
  }, [navigate]);

  return <p>Autenticando...</p>;
}

export default AuthSuccess;


  export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  };
