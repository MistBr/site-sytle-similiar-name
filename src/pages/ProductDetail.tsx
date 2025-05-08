
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Share2, ChevronLeft, Plus, Minus, ShoppingCart } from 'lucide-react';
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

interface Color {
  name: string;
  label: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  image: string;
  description: string;
  category: string;
  features?: string[];
  colors?: Color[];
  reviewCount?: number;
  reviews?: {
    id: number;
    user: string;
    rating: number;
    comment: string;
    date: string;
  }[];
}

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [userRating, setUserRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Buscar produto por ID
  useEffect(() => {
    setLoading(true);
    
    // Simulação de dados - em um app real, isso viria de uma API
    const products: Product[] = [
      { 
        id: 1, 
        name: "Robô Aspirador RobotCleaner", 
        originalPrice: 250.00,
        price: 200.00, 
        discount: 25,
        rating: 4.5, 
        image: "/lovable-uploads/5d12c70a-1777-4acb-8435-bb6095da1675.png", 
        description: "O RobotCleaner é um aspirador robô de última geração, perfeito para manter sua casa limpa com o mínimo de esforço. Com sensores avançados e tecnologia de mapeamento, ele navega facilmente por toda sua casa.",
        category: "aspiradores",
        features: [
          "Navegação inteligente com mapeamento da casa",
          "Bateria de longa duração (até 120 minutos)",
          "Sensores anti-queda para escadas",
          "Programação via aplicativo",
          "Filtro HEPA para captura de alérgenos"
        ],
        colors: [
          { name: "vermelho-branco", label: "Vermelho e Branco" },
          { name: "preto-branco", label: "Preto e Branco" },
          { name: "azul-branco", label: "Azul e Branco" }
        ],
        reviewCount: 58,
        reviews: [
          {
            id: 1,
            user: "Maria S.",
            rating: 5,
            comment: "Excelente produto! Limpa muito bem e é super silencioso.",
            date: "15/03/2023"
          },
          {
            id: 2,
            user: "João P.",
            rating: 4,
            comment: "Bom custo-benefício. Apenas fica preso às vezes em tapetes mais grossos.",
            date: "22/02/2023"
          },
          {
            id: 3,
            user: "Ana L.",
            rating: 5,
            comment: "Simplesmente o melhor robô aspirador que já tive. Recomendo!",
            date: "05/01/2023"
          }
        ]
      },
      { 
        id: 2, 
        name: "ROBOT Cleaner Pro", 
        originalPrice: 399.99,
        price: 349.99, 
        discount: 12,
        rating: 5, 
        image: "/placeholder.svg", 
        description: "Nossa versão premium com sensores avançados e maior potência.",
        category: "aspiradores",
        features: [
          "Mapeamento 3D avançado",
          "Sucção 50% mais potente",
          "Sistema de auto-esvaziamento",
          "Controle por voz (Alexa e Google Assistant)",
          "Modo turbo para carpetes"
        ],
        colors: [
          { name: "preto", label: "Preto Premium" },
          { name: "branco", label: "Branco Ártico" }
        ],
        reviewCount: 32,
        reviews: [
          {
            id: 1,
            user: "Carlos M.",
            rating: 5,
            comment: "Vale cada centavo. A função de auto-esvaziamento é incrível!",
            date: "10/03/2023"
          },
          {
            id: 2,
            user: "Beatriz R.",
            rating: 5,
            comment: "Muito bom! Integração com assistentes de voz funciona perfeitamente.",
            date: "28/02/2023"
          }
        ]
      },
      { 
        id: 3, 
        name: "ROBOT Cleaner Standard", 
        originalPrice: 279.99,
        price: 249.99, 
        discount: 10,
        rating: 4, 
        image: "/placeholder.svg", 
        description: "O modelo padrão perfeito para limpezas diárias.",
        category: "aspiradores"
      }
    ];
    
    // Encontrar o produto pelo ID
    const foundProduct = products.find(p => p.id === Number(productId));
    
    // Simular tempo de carregamento
    setTimeout(() => {
      setProduct(foundProduct || null);
      if (foundProduct) {
        setIsFavorite(isInFavorites(foundProduct.id, 'product'));
        
        if (foundProduct?.colors && foundProduct.colors.length > 0) {
          setSelectedColor(foundProduct.colors[0].name);
        }
      }
      setLoading(false);
    }, 500);
  }, [productId]);
  
  // Função para buscar o carrinho do localStorage
  const getCartFromStorage = () => {
    const savedCart = localStorage.getItem('robotCleanerCart');
    if (savedCart) {
      try {
        return JSON.parse(savedCart);
      } catch (error) {
        console.error('Error parsing saved cart:', error);
        return [];
      }
    }
    return [];
  };
  
  // Função para salvar o carrinho no localStorage
  const saveCartToStorage = (cart: any[]) => {
    localStorage.setItem('robotCleanerCart', JSON.stringify(cart));
  };
  
  // Manipuladores de quantidade
  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  const decreaseQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };
  
  // Adicionar ao carrinho
  const addToCart = () => {
    if (!product) return;
    
    const cart = getCartFromStorage();
    const existingProductIndex = cart.findIndex((item: any) => item.id === product.id);
    
    if (existingProductIndex !== -1) {
      // Atualizar quantidade se o produto já existir
      cart[existingProductIndex].quantity += quantity;
    } else {
      // Adicionar novo produto ao carrinho
      cart.push({ ...product, quantity });
    }
    
    // Salvar no localStorage
    saveCartToStorage(cart);
    
    // Mostrar toast
    toast({
      title: "Produto adicionado",
      description: `${product.name} foi adicionado ao carrinho.`,
    });
  };
  
  // Toggle favoritos
  const toggleFavorite = () => {
    if (!product) return;
    
    if (isFavorite) {
      const removed = removeFromFavorites(product.id, 'product');
      if (removed) {
        setIsFavorite(false);
        toast({
          title: "Removido dos favoritos",
          description: `${product.name} foi removido dos seus favoritos.`,
        });
      }
    } else {
      const added = addToFavorites({
        id: product.id,
        name: product.name,
        type: 'product',
        image: product.image,
        description: product.description,
        date: new Date().toISOString()
      });
      
      if (added) {
        setIsFavorite(true);
        toast({
          title: "Adicionado aos favoritos",
          description: `${product.name} foi adicionado aos seus favoritos.`,
        });
      }
    }
  };
  
  // Compartilhar produto
  const handleShare = () => {
    if (!product) return;
    
    shareItem({
      id: product.id,
      type: 'product',
      name: product.name
    });
    
    toast({
      title: "Link copiado",
      description: "Link do produto copiado para a área de transferência.",
    });
  };
  
  // Enviar avaliação
  const submitReview = () => {
    if (!product || userRating === 0) return;
    
    // Em uma aplicação real, enviaríamos para o backend
    console.log('Review submitted:', {
      productId,
      rating: userRating,
      comment: reviewComment
    });
    
    toast({
      title: "Avaliação enviada",
      description: "Obrigado por avaliar este produto!",
    });
    
    setUserRating(0);
    setReviewComment('');
    setIsReviewDialogOpen(false);
  };
  
  // Compra imediata
  const buyNow = () => {
    if (!product) return;
    
    // Adicionar ao carrinho primeiro
    addToCart();
    
    // Redirecionar para a finalização de compra
    // window.location.href = '/checkout';
    toast({
      title: "Compra iniciada",
      description: "Você será redirecionado para a finalização da compra.",
    });
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl text-robot-blue">Carregando produto...</div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Produto não encontrado</h2>
        <p className="mb-6">O produto que você está procurando não existe ou foi removido.</p>
        <Button asChild>
          <Link to="/loja">Voltar para a loja</Link>
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
              <Link to="/loja" className="hover:text-robot-blue">Robôs</Link>
              <span className="mx-2">/</span>
              <Link to="/loja" className="hover:text-robot-blue">Robôs Aspiradores</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-700 font-medium">{product.name}</span>
            </div>
            
            {/* Botão Voltar */}
            <div className="mb-6">
              <Button variant="ghost" asChild className="pl-0">
                <Link to="/loja" className="flex items-center text-gray-600 hover:text-robot-blue">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Voltar para a loja
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
                            src={product.image} 
                            alt={product.name} 
                            className="object-cover w-full h-full rounded" 
                          />
                          {product.discount && (
                            <div className="absolute top-4 left-4 bg-yellow-400 text-black font-bold px-2 py-1 rounded-full text-sm">
                              {product.discount}% OFF
                            </div>
                          )}
                        </div>
                      </div>
                    </CarouselItem>
                    <CarouselItem>
                      <div className="p-1 h-full">
                        <div className="flex aspect-square items-center justify-center p-2 bg-gray-100 rounded">
                          <span className="text-gray-500 font-bold text-lg">Vista lateral</span>
                        </div>
                      </div>
                    </CarouselItem>
                    <CarouselItem>
                      <div className="p-1 h-full">
                        <div className="flex aspect-square items-center justify-center p-2 bg-gray-100 rounded">
                          <span className="text-gray-500 font-bold text-lg">Vista inferior</span>
                        </div>
                      </div>
                    </CarouselItem>
                  </CarouselContent>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </Carousel>
                
                <div className="flex justify-center gap-2 p-4">
                  <div className="w-3 h-3 bg-robot-blue rounded-full"></div>
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                </div>
              </div>
              
              {/* Detalhes do produto */}
              <div>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg 
                          key={star} 
                          className={`h-5 w-5 ${star <= Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {product.rating} ({product.reviewCount || 0} avaliações)
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-gray-700">{product.description}</p>
                  </div>
                  
                  <div className="flex items-end gap-2 mb-4">
                    {product.originalPrice && (
                      <span className="text-gray-500 line-through">R$ {product.originalPrice.toFixed(2)}</span>
                    )}
                    <span className="text-3xl font-bold text-robot-blue">R$ {product.price.toFixed(2)}</span>
                  </div>
                  
                  {/* Seletor de cores */}
                  {product.colors && product.colors.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Cor</h3>
                      <div className="flex flex-wrap gap-2">
                        {product.colors.map((color) => (
                          <button
                            key={color.name}
                            className={`px-4 py-2 border rounded-md text-sm transition-all ${
                              selectedColor === color.name 
                                ? 'border-robot-blue bg-blue-50 text-robot-blue' 
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                            onClick={() => setSelectedColor(color.name)}
                          >
                            {color.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Quantidade */}
                  <div className="flex items-center mb-6">
                    <span className="text-sm font-medium text-gray-700 mr-4">Quantidade</span>
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button
                        className="px-3 py-1 text-gray-500 hover:text-gray-700"
                        onClick={decreaseQuantity}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-4 py-1 border-x border-gray-300 min-w-[40px] text-center">
                        {quantity}
                      </span>
                      <button
                        className="px-3 py-1 text-gray-500 hover:text-gray-700"
                        onClick={increaseQuantity}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Botões de ação */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <Button 
                      onClick={addToCart}
                      className="flex-1 flex items-center justify-center gap-2 bg-robot-blue hover:bg-blue-700"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      Adicionar ao Carrinho
                    </Button>
                    
                    <MotionButton 
                      onClick={buyNow}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Comprar agora
                    </MotionButton>
                  </div>
                  
                  {/* Botões sociais */}
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      className={`flex items-center gap-2 ${
                        isFavorite 
                          ? 'bg-pink-50 text-pink-600 border-pink-300 hover:bg-pink-100' 
                          : 'hover:bg-pink-50 hover:text-pink-600 hover:border-pink-300'
                      }`}
                      onClick={toggleFavorite}
                    >
                      <Heart className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} />
                      {isFavorite ? 'Favorito' : 'Favoritar'}
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                      onClick={handleShare}
                    >
                      <Share2 className="h-5 w-5" />
                      Compartilhar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tabs para informações adicionais */}
            <div className="bg-white shadow-sm rounded-lg p-6 mb-12">
              <Tabs defaultValue="features">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="features">Características</TabsTrigger>
                  <TabsTrigger value="specifications">Especificações</TabsTrigger>
                  <TabsTrigger value="reviews">Avaliações</TabsTrigger>
                </TabsList>
                
                <TabsContent value="features" className="space-y-4">
                  <h3 className="text-xl font-semibold mb-4">Principais Características</h3>
                  {product.features ? (
                    <ul className="list-disc pl-5 space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="text-gray-700">{feature}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">Informações não disponíveis.</p>
                  )}
                </TabsContent>
                
                <TabsContent value="specifications">
                  <h3 className="text-xl font-semibold mb-4">Especificações Técnicas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border-b pb-2">
                      <span className="font-medium">Dimensões:</span> 33 x 33 x 9.5 cm
                    </div>
                    <div className="border-b pb-2">
                      <span className="font-medium">Peso:</span> 2.5 kg
                    </div>
                    <div className="border-b pb-2">
                      <span className="font-medium">Potência:</span> 25W
                    </div>
                    <div className="border-b pb-2">
                      <span className="font-medium">Capacidade do reservatório:</span> 400ml
                    </div>
                    <div className="border-b pb-2">
                      <span className="font-medium">Bateria:</span> 3600mAh Li-ion
                    </div>
                    <div className="border-b pb-2">
                      <span className="font-medium">Tempo de carregamento:</span> 4-5 horas
                    </div>
                    <div className="border-b pb-2">
                      <span className="font-medium">Tempo de execução:</span> Até 120 minutos
                    </div>
                    <div className="border-b pb-2">
                      <span className="font-medium">Nível de ruído:</span> ≤65dB
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="reviews">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold">Avaliações dos Clientes</h3>
                      <Button onClick={() => setIsReviewDialogOpen(true)}>
                        Avaliar este produto
                      </Button>
                    </div>
                    
                    {product.reviews && product.reviews.length > 0 ? (
                      <div className="space-y-6">
                        {product.reviews.map((review) => (
                          <div key={review.id} className="border-b pb-4">
                            <div className="flex justify-between mb-2">
                              <span className="font-medium">{review.user}</span>
                              <span className="text-gray-500 text-sm">{review.date}</span>
                            </div>
                            <div className="flex mb-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg 
                                  key={star} 
                                  className={`h-4 w-4 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                                  xmlns="http://www.w3.org/2000/svg" 
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
                                </svg>
                              ))}
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">Ainda não há avaliações para este produto.</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Produtos relacionados podem ser adicionados aqui */}
          </div>
        </main>
        
        {/* Dialog para avaliações */}
        <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogTitle>Avaliar {product.name}</DialogTitle>
            <DialogDescription>
              Compartilhe sua experiência com este produto para ajudar outros clientes.
            </DialogDescription>
            
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Sua avaliação</label>
                <RatingStars rating={userRating} setRating={setUserRating} />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Seu comentário (opcional)</label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-robot-blue focus:border-transparent"
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Conte sua experiência com este produto..."
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={submitReview}
                disabled={userRating === 0}
              >
                Enviar avaliação
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default ProductDetail;
