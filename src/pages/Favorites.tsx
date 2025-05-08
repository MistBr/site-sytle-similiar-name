
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Trash2, ExternalLink } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';
import { FavoriteItem, getFavorites, removeFromFavorites, shareItem } from '@/utils/favorites';

const Favorites = () => {
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  
  useEffect(() => {
    loadFavorites();
  }, []);
  
  const loadFavorites = () => {
    const favoritesData = getFavorites();
    setFavorites(favoritesData);
  };
  
  const handleRemoveFavorite = (id: number, type: 'product' | 'project', name: string) => {
    const removed = removeFromFavorites(id, type);
    if (removed) {
      loadFavorites();
      toast({
        title: "Item removido",
        description: `${name} foi removido dos seus favoritos.`,
      });
    }
  };
  
  const handleShare = (item: FavoriteItem) => {
    shareItem({
      id: item.id,
      type: item.type,
      name: item.name
    });
    
    toast({
      title: "Link copiado",
      description: "Link copiado para a área de transferência.",
    });
  };
  
  const filteredFavorites = activeTab === 'all' 
    ? favorites 
    : favorites.filter(item => item.type === activeTab);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };
  
  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Meus Favoritos</h1>
            <p className="text-gray-600 mb-8">Gerencie seus produtos e projetos favoritos</p>
            
            <Tabs defaultValue="all" onValueChange={setActiveTab}>
              <TabsList className="mb-8">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="product">Produtos</TabsTrigger>
                <TabsTrigger value="project">Projetos</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-0">
                {renderFavoritesList(filteredFavorites, handleRemoveFavorite, handleShare, formatDate)}
              </TabsContent>
              <TabsContent value="product" className="mt-0">
                {renderFavoritesList(filteredFavorites, handleRemoveFavorite, handleShare, formatDate)}
              </TabsContent>
              <TabsContent value="project" className="mt-0">
                {renderFavoritesList(filteredFavorites, handleRemoveFavorite, handleShare, formatDate)}
              </TabsContent>
            </Tabs>
          </div>
        </main>
        
        <Footer />
      </div>
    </PageTransition>
  );
};

const renderFavoritesList = (
  favorites: FavoriteItem[], 
  onRemove: (id: number, type: 'product' | 'project', name: string) => void,
  onShare: (item: FavoriteItem) => void,
  formatDate: (date: string) => string
) => {
  if (favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="mx-auto h-12 w-12 text-gray-300 mb-4" />
        <h3 className="text-xl font-medium text-gray-700 mb-2">Nenhum item favorito</h3>
        <p className="text-gray-500 mb-6">Você ainda não adicionou nenhum item aos seus favoritos</p>
        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link to="/loja">Ver produtos</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/workshop">Ver projetos</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {favorites.map(item => (
        <Card key={`${item.type}-${item.id}`} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="h-48 bg-gray-200 rounded overflow-hidden mb-4">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg line-clamp-1">{item.name}</CardTitle>
                <p className="text-sm text-gray-500">
                  Adicionado em {formatDate(item.date)}
                </p>
              </div>
              <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                item.type === 'product' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {item.type === 'product' ? 'Produto' : 'Projeto'}
              </span>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <CardDescription className="line-clamp-2">{item.description}</CardDescription>
          </CardContent>
          <CardFooter className="pt-2">
            <div className="flex gap-2 w-full">
              <Button 
                asChild
                className="flex-1"
              >
                <Link to={item.type === 'product' ? `/produto/${item.id}` : `/workshop/projeto/${item.id}`}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Visualizar
                </Link>
              </Button>
              <Button 
                variant="outline"
                className="px-3 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                onClick={() => onRemove(item.id, item.type as 'product' | 'project', item.name)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline"
                className="px-3 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                onClick={() => onShare(item)}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default Favorites;
