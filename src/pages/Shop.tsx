
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Star, Plus, Minus, Search, Filter, X, Eye } from 'lucide-react';
import ShoppingCartDrawer from '@/components/ShoppingCartDrawer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageTransition from '@/components/PageTransition';

interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  image: string;
  description: string;
  category: string;
}

const Shop = () => {
  const { toast } = useToast();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<(Product & { quantity: number })[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [sortOrder, setSortOrder] = useState('default');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
  const products: Product[] = [
    { 
      id: 1, 
      name: "ROBOT Cleaner Mini", 
      price: 199.99, 
      rating: 4.5, 
      image: "/placeholder.svg", 
      description: "Versão compacta do nosso aspirador robô para espaços menores.",
      category: "aspiradores"
    },
    { 
      id: 2, 
      name: "ROBOT Cleaner Pro", 
      price: 349.99, 
      rating: 5, 
      image: "/placeholder.svg", 
      description: "Nossa versão premium com sensores avançados e maior potência.",
      category: "aspiradores"
    },
    { 
      id: 3, 
      name: "ROBOT Cleaner Standard", 
      price: 249.99, 
      rating: 4, 
      image: "/placeholder.svg", 
      description: "O modelo padrão perfeito para limpezas diárias.",
      category: "aspiradores"
    },
    { 
      id: 4, 
      name: "ROBOT Cleaner Kit de Peças", 
      price: 59.99, 
      rating: 4.5, 
      image: "/placeholder.svg", 
      description: "Kit de peças de reposição para todos os modelos.",
      category: "acessorios"
    },
    { 
      id: 5, 
      name: "ROBOT Mop Attachment", 
      price: 49.99, 
      rating: 4, 
      image: "/placeholder.svg", 
      description: "Acessório para limpeza úmida, compatível com todos os modelos.",
      category: "acessorios"
    },
    { 
      id: 6, 
      name: "ROBOT Filtro HEPA (3-pack)", 
      price: 29.99, 
      rating: 5, 
      image: "/placeholder.svg", 
      description: "Filtros HEPA de substituição para captura de alérgenos.",
      category: "filtros"
    },
  ];

  useEffect(() => {
    const savedCart = localStorage.getItem('robotCleanerCart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing saved cart:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('robotCleanerCart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    let filtered = products;
    
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'todos') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    switch (sortOrder) {
      case 'price-asc':
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered = [...filtered].sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    
    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, sortOrder, products]);

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingProduct = prevCart.find(item => item.id === product.id);
      
      if (existingProduct) {
        return prevCart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
    
    toast({
      title: "Produto adicionado",
      description: `${product.name} foi adicionado ao carrinho.`,
    });
  };

  const updateQuantity = (productId: number, action: 'increase' | 'decrease') => {
    setCart(prevCart => 
      prevCart.map(item => {
        if (item.id === productId) {
          const newQuantity = action === 'increase' ? item.quantity + 1 : Math.max(0, item.quantity - 1);
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(item => item.quantity > 0)
    );
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i} 
          className={`h-4 w-4 ${i <= rating ? 'fill-robot-blue text-robot-blue' : 'text-gray-300'}`} 
        />
      );
    }
    return stars;
  };

  const categories = [
    { value: 'todos', label: 'Todos os Produtos' },
    { value: 'aspiradores', label: 'Aspiradores' },
    { value: 'acessorios', label: 'Acessórios' },
    { value: 'filtros', label: 'Filtros' },
  ];

  const sortOptions = [
    { value: 'default', label: 'Padrão' },
    { value: 'price-asc', label: 'Preço: Menor para Maior' },
    { value: 'price-desc', label: 'Preço: Maior para Menor' },
    { value: 'rating', label: 'Avaliação' },
  ];

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Loja ROBOT Cleaner</h1>
              <Button 
                className="outline relative" 
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="mr-2" />
                Carrinho
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-robot-blue text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {totalItems}
                  </span>
                )}
              </Button>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input 
                    type="text"
                    placeholder="Pesquisar produtos..."
                    className="pl-10 pr-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-500"
                      onClick={clearSearch}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                <div className="flex gap-4">
                  <div className="min-w-[200px]">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="min-w-[240px]">
                    <Select value={sortOrder} onValueChange={setSortOrder}>
                      <SelectTrigger>
                        <SelectValue placeholder="Ordenar por" />
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <Tabs defaultValue="todos" value={selectedCategory} onValueChange={setSelectedCategory}>
                <TabsList className="bg-gray-100">
                  {categories.map(category => (
                    <TabsTrigger key={category.value} value={category.value}>
                      {category.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
                {searchQuery && ` para "${searchQuery}"`}
                {selectedCategory !== 'todos' && ` em ${categories.find(c => c.value === selectedCategory)?.label}`}
              </p>
            </div>
            
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-gray-700 mb-2">Nenhum produto encontrado</h3>
                <p className="text-gray-500">Tente ajustar seus filtros ou termos de pesquisa</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
                    <CardHeader className="pb-2">
                      <div className="h-40 bg-gray-200 rounded flex items-center justify-center mb-4 relative">
                        <span className="text-gray-500 font-bold text-lg">ROBOT Cleaner</span>
                        
                        {/* Link para a página de detalhes do produto */}
                        <Link 
                          to={`/produto/${product.id}`} 
                          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 opacity-0 hover:opacity-100"
                        >
                          <span className="bg-white text-robot-blue rounded-full p-3">
                            <Eye className="h-5 w-5" />
                          </span>
                        </Link>
                      </div>
                      <div className="flex justify-between items-start">
                        <Link to={`/produto/${product.id}`}>
                          <CardTitle className="text-lg hover:text-robot-blue transition-colors duration-200">{product.name}</CardTitle>
                        </Link>
                        <div className="font-bold text-robot-blue">R${product.price.toFixed(2)}</div>
                      </div>
                      <div className="flex">
                        {renderStars(product.rating)}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <CardDescription>{product.description}</CardDescription>
                      <div className="mt-2">
                        <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs font-semibold text-gray-700 mr-2">
                          {categories.find(c => c.value === product.category)?.label}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="flex gap-2 w-full">
                        <Button 
                          className="flex-1 bg-black text-white hover:bg-robot-blue transition-colors duration-300" 
                          onClick={() => addToCart(product)}
                        >
                          Adicionar ao Carrinho
                        </Button>
                        <Button asChild className="p-2 outline">
                          <Link to={`/produto/${product.id}`}>
                            <Eye className="h-5 w-5" />
                          </Link>
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
        
        <ShoppingCartDrawer 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
          cart={cart} 
          updateQuantity={updateQuantity}
          totalPrice={totalPrice}
        />
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Shop;
