
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Heart, Share2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
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
}

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  
  useEffect(() => {
    // Check if project is in favorites
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
        // Also update likes count
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
  
  // Helper function to extract file extension
  const getFileExtension = (url: string) => {
    if (url.includes('.')) {
      return url.split('.').pop() || 'file';
    }
    return 'file';
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 transform hover:scale-[1.02] transition-transform duration-300">
      <Link to={`/workshop/projeto/${project.id}`}>
        <CardHeader className="pb-2">
          <div className="h-48 bg-gray-200 rounded overflow-hidden mb-4">
            <img 
              src={project.thumbnail} 
              alt={project.title} 
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" 
            />
          </div>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg line-clamp-1">{project.title}</CardTitle>
              <p className="text-sm text-gray-500">por {project.author}</p>
            </div>
            <span className={`inline-block ${getCategoryColor(project.category)} rounded-full px-3 py-1 text-xs font-semibold animate-fade-in`}>
              {getCategoryLabel(project.category)}
            </span>
          </div>
        </CardHeader>
      </Link>
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
      <CardFooter className="pt-2">
        <div className="flex gap-2 w-full">
          <Button 
            className="flex-1 bg-robot-blue hover:bg-blue-800 transform hover:scale-105 transition-all duration-200"
            onClick={handleDownload}
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button 
            className={`px-3 border ${
              isFavorite 
                ? 'bg-pink-50 text-pink-600 border-pink-300 hover:bg-pink-100' 
                : 'hover:bg-pink-50 hover:text-pink-600 hover:border-pink-300'
            } transition-colors duration-200`}
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite();
            }}
          >
            <Heart className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
          </Button>
          <Button 
            className="px-3 border border-gray-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-colors duration-200"
            onClick={(e) => {
              e.preventDefault();
              handleShare();  
            }}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
