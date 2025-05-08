import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Upload, Folder, FolderPlus, Image, File, FilePlus, Plus, Search, Printer, Cpu, Battery, ArrowLeft } from 'lucide-react';
import ProjectCard from '@/components/ProjectCard';
import CategoryCard from '@/components/CategoryCard';

interface Project {
  id: number;
  title: string;
  description: string;
  author: string;
  thumbnail: string;
  category: 'eletronics' | '3d' | 'controls';
  downloads: number;
  likes: number;
  fileUrl?: string;
}

const Workshop = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'eletronics' | '3d' | 'controls' | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(true);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: 'eletronics' as 'eletronics' | '3d' | 'controls',
    file: null as File | null,
    thumbnail: null as File | null
  });
  const [processing, setProcessing] = useState(false);

  const sampleProjects: Project[] = [
    {
      id: 1,
      title: "Circuito de Controle LED",
      description: "Um projeto simples de controle de LED com um Arduino",
      author: "João Silva",
      thumbnail: "/placeholder.svg",
      category: "eletronics",
      downloads: 120,
      likes: 45,
      fileUrl: "/sample-files/led-control.zip"
    },
    {
      id: 2,
      title: "Robô Seguidor de Linha",
      description: "Projeto de robô que segue uma linha usando sensores",
      author: "Maria Oliveira",
      thumbnail: "/placeholder.svg",
      category: "eletronics",
      downloads: 85,
      likes: 32,
      fileUrl: "/sample-files/line-follower.zip"
    },
    {
      id: 3,
      title: "Controlador PID para Motores",
      description: "Implementação de controle PID para motores DC",
      author: "Pedro Santos",
      thumbnail: "/placeholder.svg",
      category: "controls",
      downloads: 210,
      likes: 78
    },
    {
      id: 4,
      title: "Modelo 3D para Sensor de Distância",
      description: "Case 3D para acomodar um sensor ultrassônico",
      author: "Ana Pereira",
      thumbnail: "/placeholder.svg",
      category: "3d",
      downloads: 150,
      likes: 56
    },
    {
      id: 5,
      title: "Circuito de Alimentação Solar",
      description: "Projeto de circuito para carregar baterias usando painéis solares",
      author: "Carlos Mendes",
      thumbnail: "/placeholder.svg",
      category: "eletronics",
      downloads: 95,
      likes: 41
    },
    {
      id: 6,
      title: "Modelagem 3D para Robô Hexápode",
      description: "Modelo completo para impressão das partes de um robô de 6 pernas",
      author: "Fernanda Lima",
      thumbnail: "/placeholder.svg",
      category: "3d",
      downloads: 180,
      likes: 67
    },
    {
      id: 7,
      title: "Sistema de Controle para Drone",
      description: "Algoritmo de estabilização para drone quadricóptero",
      author: "Ricardo Alves",
      thumbnail: "/placeholder.svg",
      category: "controls",
      downloads: 230,
      likes: 92
    },
    {
      id: 8,
      title: "Case 3D para Arduino",
      description: "Modelo 3D para proteção de placas Arduino Uno",
      author: "Juliana Costa",
      thumbnail: "/placeholder.svg",
      category: "3d",
      downloads: 160,
      likes: 58
    },
    {
      id: 9,
      title: "Controlador de Temperatura",
      description: "Sistema de controle para manter temperatura constante",
      author: "Eduardo Martins",
      thumbnail: "/placeholder.svg",
      category: "controls",
      downloads: 140,
      likes: 53
    }
  ];

  const [projects, setProjects] = useState<Project[]>(() => {
    const savedProjects = localStorage.getItem('workshopProjects');
    return savedProjects ? JSON.parse(savedProjects) : sampleProjects;
  });

  useEffect(() => {
    localStorage.setItem('workshopProjects', JSON.stringify(projects));
  }, [projects]);

  const filteredProjects = projects.filter(project => {
    const matchesCategory = activeTab === 'all' || project.category === activeTab;
    const matchesSearch = searchQuery === '' || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const handleCategorySelect = (category: 'eletronics' | '3d' | 'controls' | 'all') => {
    setActiveTab(category);
    setShowCategories(false);
  };

  const handleBackToCategories = () => {
    setShowCategories(true);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    
    if (!uploadForm.title || !uploadForm.description || !uploadForm.category) {
      toast({
        title: "Erro no formulário",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      setProcessing(false);
      return;
    }

    setTimeout(() => {
      try {
        let fileUrl = "";
        let thumbnailUrl = "";
        
        if (uploadForm.file) {
          fileUrl = URL.createObjectURL(uploadForm.file);
        }
        
        if (uploadForm.thumbnail) {
          thumbnailUrl = URL.createObjectURL(uploadForm.thumbnail);
        } else {
          thumbnailUrl = "/placeholder.svg";
        }
        
        const newProject: Project = {
          id: Date.now(),
          title: uploadForm.title,
          description: uploadForm.description,
          author: "Usuário Atual",
          thumbnail: thumbnailUrl,
          category: uploadForm.category,
          downloads: 0,
          likes: 0,
          fileUrl: fileUrl
        };

        setProjects(prevProjects => [...prevProjects, newProject]);
        setIsUploadModalOpen(false);
        
        setUploadForm({
          title: '',
          description: '',
          category: 'eletronics',
          file: null,
          thumbnail: null
        });

        toast({
          title: "Projeto enviado com sucesso!",
          description: "Seu projeto foi adicionado à nossa comunidade.",
        });
      } catch (error) {
        toast({
          title: "Erro ao enviar projeto",
          description: "Ocorreu um erro ao tentar enviar seu projeto. Tente novamente.",
          variant: "destructive"
        });
      } finally {
        setProcessing(false);
      }
    }, 1500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'file' | 'thumbnail') => {
    if (e.target.files && e.target.files[0]) {
      if (type === 'file') {
        setUploadForm({...uploadForm, file: e.target.files[0]});
      } else {
        setUploadForm({...uploadForm, thumbnail: e.target.files[0]});
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Workshop da Comunidade</h1>
              <p className="text-gray-600 mt-2">Compartilhe e descubra projetos incríveis da nossa comunidade</p>
            </div>
            
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input 
                  type="text"
                  placeholder="Pesquisar projetos..."
                  className="w-full md:w-64 pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Button 
                className="bg-robot-blue hover:bg-blue-800"
                onClick={() => setIsUploadModalOpen(true)}
              >
                <Upload className="mr-2 h-4 w-4" />
                Enviar Projeto
              </Button>
            </div>
          </div>
          
          <div className="mb-6">
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </div>
          
          {showCategories ? (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-6">Escolha uma Categoria</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <CategoryCard 
                  title="Todos os Projetos" 
                  description="Explore todos os projetos disponíveis em nossa comunidade" 
                  icon={<Folder className="h-8 w-8 text-robot-blue" />}
                  category="all"
                  onClick={handleCategorySelect}
                />
                <CategoryCard 
                  title="Eletrônica" 
                  description="Projetos de circuitos, sensores e componentes eletrônicos" 
                  icon={<Cpu className="h-8 w-8 text-robot-blue" />}
                  category="eletronics"
                  onClick={handleCategorySelect}
                />
                <CategoryCard 
                  title="Modelagem 3D" 
                  description="Modelos e designs para impressão 3D de peças e acessórios" 
                  icon={<Printer className="h-8 w-8 text-robot-blue" />}
                  category="3d"
                  onClick={handleCategorySelect}
                />
                <CategoryCard 
                  title="Controles & Baterias" 
                  description="Projetos de sistemas de controle, alimentação e baterias" 
                  icon={<Battery className="h-8 w-8 text-robot-blue" />}
                  category="controls"
                  onClick={handleCategorySelect}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center mb-6">
                <Button 
                  variant="outline" 
                  onClick={handleBackToCategories}
                  className="mr-4"
                >
                  Voltar às Categorias
                </Button>
                <h2 className="text-2xl font-semibold">
                  {activeTab === 'all' && 'Todos os Projetos'}
                  {activeTab === 'eletronics' && 'Projetos de Eletrônica'}
                  {activeTab === '3d' && 'Projetos de Modelagem 3D'}
                  {activeTab === 'controls' && 'Projetos de Controles & Baterias'}
                </h2>
              </div>
              
              {renderProjects(filteredProjects)}
            </>
          )}
        </div>
      </main>
      
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Enviar Novo Projeto</h2>
              
              <form onSubmit={handleUploadSubmit}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Título do Projeto</Label>
                    <Input 
                      id="title"
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                      placeholder="Ex: Controlador de LED com Arduino"
                      required
                      disabled={processing}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Categoria</Label>
                    <select 
                      id="category"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm"
                      value={uploadForm.category}
                      onChange={(e) => setUploadForm({...uploadForm, category: e.target.value as any})}
                      required
                      disabled={processing}
                    >
                      <option value="eletronics">Eletrônica</option>
                      <option value="3d">Modelagem 3D</option>
                      <option value="controls">Controles & Baterias</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea 
                      id="description"
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                      placeholder="Descreva seu projeto..."
                      rows={4}
                      required
                      disabled={processing}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="project-file">Arquivo do Projeto (obrigatório)</Label>
                    <div className="mt-1 flex items-center justify-center w-full">
                      <label
                        htmlFor="project-file"
                        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <FilePlus className="w-10 h-10 mb-3 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Clique para fazer upload</span> ou arraste e solte
                          </p>
                          <p className="text-xs text-gray-500">ZIP, PDF, STL, INO (Max. 10MB)</p>
                        </div>
                        <input
                          id="project-file"
                          type="file"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, 'file')}
                          required
                          disabled={processing}
                        />
                      </label>
                    </div>
                    {uploadForm.file && (
                      <p className="text-sm text-gray-500 mt-2">
                        Arquivo: {uploadForm.file.name}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="thumbnail">Imagem Miniatura (opcional)</Label>
                    <div className="mt-1 flex items-center justify-center w-full">
                      <label
                        htmlFor="thumbnail"
                        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Image className="w-10 h-10 mb-3 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Clique para fazer upload</span> ou arraste e solte
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF (Max. 2MB)</p>
                        </div>
                        <input
                          id="thumbnail"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, 'thumbnail')}
                          disabled={processing}
                        />
                      </label>
                    </div>
                    {uploadForm.thumbnail && (
                      <p className="text-sm text-gray-500 mt-2">
                        Imagem: {uploadForm.thumbnail.name}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsUploadModalOpen(false)}
                    disabled={processing}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-robot-blue hover:bg-blue-800"
                    disabled={processing}
                  >
                    {processing ? 'Enviando...' : 'Enviar Projeto'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

function renderProjects(projects: Project[]) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-700 mb-2">Nenhum projeto encontrado</h3>
        <p className="text-gray-500">Tente ajustar seus filtros ou termos de pesquisa</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

export default Workshop;
