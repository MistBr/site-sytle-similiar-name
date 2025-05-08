
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Share2, ChevronLeft, Download, ArrowLeft } from 'lucide-react';
import { Button, MotionButton } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RatingStars from '@/components/RatingStars';
import PageTransition from '@/components/PageTransition';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { addToFavorites, isInFavorites, removeFromFavorites, shareItem } from '@/utils/favorites';

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
  details?: string;
  createdAt?: string;
  updatedAt?: string;
  comments?: {
    id: number;
    author: string;
    content: string;
    date: string;
  }[];
}

const ProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  
  // Buscar projeto por ID
  useEffect(() => {
    setLoading(true);
    
    // Obter projetos do localStorage
    const savedProjects = localStorage.getItem('workshopProjects');
    if (savedProjects) {
      try {
        const projects = JSON.parse(savedProjects);
        const foundProject = projects.find((p: Project) => p.id === Number(projectId));
        
        if (foundProject) {
          setProject(foundProject);
          setIsFavorite(isInFavorites(foundProject.id, 'project'));
        }
      } catch (error) {
        console.error('Error parsing projects:', error);
      }
    }
    
    setLoading(false);
  }, [projectId]);
  
  const handleDownload = () => {
    if (!project || !project.fileUrl) {
      toast({
        title: "Erro ao baixar",
        description: "Este projeto não possui arquivo para download.",
        variant: "destructive"
      });
      return;
    }
    
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = project.fileUrl;
    link.download = `${project.title.replace(/\s+/g, '-').toLowerCase()}.${getFileExtension(project.fileUrl)}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Update project downloads count in localStorage
    const savedProjects = localStorage.getItem('workshopProjects');
    if (savedProjects) {
      const projects = JSON.parse(savedProjects);
      const updatedProjects = projects.map((p: Project) => {
        if (p.id === project.id) {
          return { ...p, downloads: p.downloads + 1 };
        }
        return p;
      });
      localStorage.setItem('workshopProjects', JSON.stringify(updatedProjects));
    }
    
    toast({
      title: "Download iniciado",
      description: `${project.title} está sendo baixado.`,
    });
  };
  
  const toggleFavorite = () => {
    if (!project) return;
    
    if (isFavorite) {
      const removed = removeFromFavorites(project.id, 'project');
      if (removed) {
        setIsFavorite(false);
        toast({
          title: "Removido dos favoritos",
          description: `${project.title} foi removido dos seus favoritos.`,
        });
      }
    } else {
      const added = addToFavorites({
        id: project.id,
        name: project.title,
        type: 'project',
        image: project.thumbnail,
        description: project.description,
        date: new Date().toISOString()
      });
      
      if (added) {
        setIsFavorite(true);
        toast({
          title: "Adicionado aos favoritos",
          description: `${project.title} foi adicionado aos seus favoritos.`,
        });
      }
    }
  };
  
  const handleShare = () => {
    if (!project) return;
    
    shareItem({
      id: project.id,
      type: 'project',
      name: project.title
    });
    
    toast({
      title: "Link copiado",
      description: "Link do projeto copiado para a área de transferência.",
    });
  };
  
  const submitComment = () => {
    if (!project || !comment.trim()) return;
    
    toast({
      title: "Comentário enviado",
      description: "Seu comentário foi enviado com sucesso.",
    });
    
    setComment('');
    setIsCommentDialogOpen(false);
  };
  
  // Helper function to extract file extension
  const getFileExtension = (url: string) => {
    if (url.includes('.')) {
      return url.split('.').pop() || 'file';
    }
    return 'file';
  };
  
  const getCategoryLabel = (category: string) => {
    switch(category) {
      case 'eletronics': return 'Eletrônica';
      case '3d': return 'Modelagem 3D';
      case 'controls': return 'Controles & Baterias';
      default: return category;
    }
  };
  
  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'eletronics': return 'bg-blue-100 text-blue-800';
      case '3d': return 'bg-green-100 text-green-800';
      case 'controls': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl text-robot-blue">Carregando projeto...</div>
      </div>
    );
  }
  
  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Projeto não encontrado</h2>
        <p className="mb-6">O projeto que você está procurando não existe ou foi removido.</p>
        <Button asChild>
          <Link to="/workshop">Voltar para o Workshop</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <Link to="/" className="hover:text-robot-blue">Início</Link>
              <span className="mx-2">/</span>
              <Link to="/workshop" className="hover:text-robot-blue">Workshop</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-700 font-medium">{project.title}</span>
            </div>
            
            {/* Botão Voltar */}
            <div className="mb-6">
              <Button variant="ghost" asChild className="pl-0">
                <Link to="/workshop" className="flex items-center text-gray-600 hover:text-robot-blue">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Voltar para o Workshop
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Galeria de imagens */}
              <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                <Carousel className="w-full">
                  <CarouselContent>
                    <CarouselItem>
                      <div className="p-1 h-full">
                        <div className="flex aspect-square items-center justify-center p-2 relative">
                          <img 
                            src={project.thumbnail} 
                            alt={project.title} 
                            className="object-cover w-full h-full rounded" 
                          />
                          <span className={`absolute top-4 right-4 ${getCategoryColor(project.category)} rounded-full px-3 py-1 text-xs font-semibold`}>
                            {getCategoryLabel(project.category)}
                          </span>
                        </div>
                      </div>
                    </CarouselItem>
                    {/* Poderíamos adicionar mais imagens se o projeto tivesse */}
                  </CarouselContent>
                </Carousel>
              </div>
              
              {/* Detalhes do projeto */}
              <div>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{project.title}</h1>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-gray-500">
                      Por <span className="font-medium">{project.author}</span>
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-gray-700">{project.description}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 items-center mb-6">
                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">{project.downloads} downloads</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">{project.likes} curtidas</span>
                    </div>
                  </div>
                  
                  {/* Botões de ação */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <Button 
                      onClick={handleDownload}
                      className="flex-1 flex items-center justify-center gap-2 bg-robot-blue hover:bg-blue-700"
                      disabled={!project.fileUrl}
                    >
                      <Download className="h-5 w-5" />
                      Download
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className={`flex-1 flex items-center justify-center gap-2 ${
                        isFavorite 
                          ? 'bg-pink-50 text-pink-600 border-pink-300 hover:bg-pink-100' 
                          : 'hover:bg-pink-50 hover:text-pink-600 hover:border-pink-300'
                      }`}
                      onClick={toggleFavorite}
                    >
                      <Heart className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} />
                      {isFavorite ? 'Favorito' : 'Favoritar'}
                    </Button>
                  </div>
                  
                  {/* Botão compartilhar */}
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 w-full sm:w-auto"
                    onClick={handleShare}
                  >
                    <Share2 className="h-5 w-5" />
                    Compartilhar Projeto
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Tabs para informações adicionais */}
            <div className="bg-white shadow-sm rounded-lg p-6 mb-12">
              <Tabs defaultValue="description">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="description">Descrição</TabsTrigger>
                  <TabsTrigger value="files">Arquivos</TabsTrigger>
                  <TabsTrigger value="comments">Comentários</TabsTrigger>
                </TabsList>
                
                <TabsContent value="description" className="space-y-4">
                  <h3 className="text-xl font-semibold mb-4">Sobre este Projeto</h3>
                  <p className="text-gray-700 whitespace-pre-line">
                    {project.details || project.description}
                  </p>
                  <div className="flex flex-col gap-2 mt-6">
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">Categoria:</span>
                      <span>{getCategoryLabel(project.category)}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">Autor:</span>
                      <span>{project.author}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">Downloads:</span>
                      <span>{project.downloads}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">Curtidas:</span>
                      <span>{project.likes}</span>
                    </div>
                    {project.createdAt && (
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">Criado em:</span>
                        <span>{new Date(project.createdAt).toLocaleDateString('pt-BR')}</span>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="files">
                  <h3 className="text-xl font-semibold mb-4">Arquivos do Projeto</h3>
                  {project.fileUrl ? (
                    <div className="border rounded-md p-4 flex justify-between items-center">
                      <div>
                        <p className="font-medium">{project.title}.{getFileExtension(project.fileUrl)}</p>
                        <p className="text-sm text-gray-500">Arquivo do projeto</p>
                      </div>
                      <Button onClick={handleDownload}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  ) : (
                    <p className="text-gray-500">Este projeto não possui arquivos para download.</p>
                  )}
                </TabsContent>
                
                <TabsContent value="comments">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold">Comentários</h3>
                      <Button onClick={() => setIsCommentDialogOpen(true)}>
                        Adicionar comentário
                      </Button>
                    </div>
                    
                    {project.comments && project.comments.length > 0 ? (
                      <div className="space-y-6">
                        {project.comments.map((comment) => (
                          <div key={comment.id} className="border-b pb-4">
                            <div className="flex justify-between mb-2">
                              <span className="font-medium">{comment.author}</span>
                              <span className="text-gray-500 text-sm">{comment.date}</span>
                            </div>
                            <p className="text-gray-700">{comment.content}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">Ainda não há comentários para este projeto.</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Projetos relacionados poderiam ser adicionados aqui */}
          </div>
        </main>
        
        {/* Dialog para comentário */}
        <Dialog open={isCommentDialogOpen} onOpenChange={setIsCommentDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogTitle>Comentar sobre {project.title}</DialogTitle>
            <DialogDescription>
              Compartilhe sua opinião sobre este projeto com a comunidade.
            </DialogDescription>
            
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Seu comentário</label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-robot-blue focus:border-transparent"
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Escreva seu comentário sobre este projeto..."
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCommentDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={submitComment}
                disabled={!comment.trim()}
              >
                Enviar comentário
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default ProjectDetail;
