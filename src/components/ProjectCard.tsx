import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Heart, Share2, Eye } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { addToFavorites, isInFavorites, removeFromFavorites, shareItem } from '@/utils/favorites';
import { useAuth } from '@/contexts/AuthContext';

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

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  console.log("Project thumbnail URL:", project.thumbnail);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    setIsFavorite(isInFavorites(project.id, 'project'));
  }, [project.id]);

  const handleDownload = () => {
    if (!project.fileUrl) {
      toast({
        title: "Erro ao baixar",
        description: "Este projeto não possui arquivo para download.",
        variant: "destructive"
      });
      return;
    }

    const link = document.createElement('a');
    link.href = project.fileUrl;
    link.download = `${project.title.replace(/\s+/g, '-').toLowerCase()}.${getFileExtension(project.fileUrl)}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

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
    if (!isAuthenticated) {
      toast({
        title: "É necessário estar logado",
        description: "Faça login para favoritar um projeto.",
      });
      navigate('/entrar');
      return;
    }

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
        const savedProjects = localStorage.getItem('workshopProjects');
        if (savedProjects) {
          const projects = JSON.parse(savedProjects);
          const updatedProjects = projects.map((p: Project) => {
            if (p.id === project.id) {
              return { ...p, likes: p.likes + 1 };
            }
            return p;
          });
          localStorage.setItem('workshopProjects', JSON.stringify(updatedProjects));
        }

        setIsFavorite(true);
        toast({
          title: "Adicionado aos favoritos",
          description: `${project.title} foi adicionado aos seus favoritos.`,
        });
      }
    }
  };

  const handleShare = () => {
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

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'eletronics': return 'Eletrônica';
      case '3d': return 'Modelagem 3D';
      case 'controls': return 'Controles & Baterias';
      default: return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'eletronics': return 'bg-blue-100 text-blue-800';
      case '3d': return 'bg-green-100 text-green-800';
      case 'controls': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFileExtension = (url: string) => {
    if (url.includes('.')) {
      return url.split('.').pop() || 'file';
    }
    return 'file';
  };

  
  return (
    <Card className="overflow-hidden hover:shadow-md duration-300 transform hover:scale-[1.02] transition-transform">
        <CardHeader className="pb-2">
            <div className="h-48 bg-gray-100 rounded-xl overflow-hidden mb-4 flex items-center justify-center">
              {project.thumbnail ? (
                <img
                  src={`/${project.thumbnail.replace(/^\/+/, '')}`}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              ) : (
                <span className="text-gray-400 text-sm">Sem imagem</span>
              )}
            </div>
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold truncate">{project.title}</CardTitle>
              <p className="text-sm text-gray-500 truncate">por {project.author}</p>
            </div>

            <span className={`flex-shrink-0 ${getCategoryColor(project.category)} rounded-full px-3 py-1 text-xs font-semibold`}>
              {getCategoryLabel(project.category)}
            </span>
          </div>
        </CardHeader>
      <CardContent className="pb-2">
        <CardDescription className="line-clamp-2">{project.description}</CardDescription>
        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>{project.downloads}</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
            <span>{project.likes}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex flex-wrap gap-2">
        {project.fileUrl ? (
          <a 
            href={project.fileUrl} 
            download={`${project.title.replace(/\s+/g, '-').toLowerCase()}.${getFileExtension(project.fileUrl)}`}
            onClick={handleDownload}
            className="w-full sm:w-auto"
          >
            <Button className="w-full flex items-center justify-center gap-2 bg-black text-white hover:bg-gray-900 transition-colors duration-200">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </a>
        ) : (
          <Button 
            disabled 
            className="w-full flex items-center justify-center gap-2 bg-gray-300 text-gray-500 cursor-not-allowed"
          >
            <Download className="mr-2 h-4 w-4" />
            Download indisponível
          </Button>
        )}
          <Button
            className={`px-3 ${
              isFavorite
                ? 'bg-black text-white border-black hover:bg-gray-900'
                : 'bg-white text-black border-gray-300 hover:bg-gray-100'
            } border transition-colors`}
            onClick={toggleFavorite}
          >
            <Heart className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
          </Button>
          <Button
            className="px-3 bg-white text-black border border-gray-300 hover:bg-gray-100 transition-colors"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            className="flex-1 bg-black text-white hover:bg-gray-900 transition-colors"
            onClick={() => navigate(`/workshop/projeto/${project.id}`)}
          >
            <Eye className="mr-2 h-4 w-4" />
            Ver Mais
          </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
