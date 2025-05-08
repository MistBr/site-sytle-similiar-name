
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Star, User, ChevronLeft } from 'lucide-react';
import RatingStars from '@/components/RatingStars';
import { useNavigate } from 'react-router-dom';

interface Review {
  id: number;
  name: string;
  date: string;
  rating: number;
  comment: string;
  product: string;
}

const Ratings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [product, setProduct] = useState('');
  
  // Initial reviews data
  const initialReviews: Review[] = [
    {
      id: 1,
      name: "Maria Silva",
      date: "15/05/2023",
      rating: 5,
      comment: "Estou realmente impressionada com o ROBOT Cleaner Pro! Ele limpa todos os cantos da minha casa com perfeição e o aplicativo é super intuitivo. Recomendo!",
      product: "ROBOT Cleaner Pro"
    },
    {
      id: 2,
      name: "João Oliveira",
      date: "28/04/2023",
      rating: 4,
      comment: "Muito bom para manter a casa limpa diariamente. A bateria dura bastante tempo e ele é silencioso. O único problema é que às vezes tem dificuldade com tapetes mais grossos.",
      product: "ROBOT Cleaner Standard"
    },
    {
      id: 3,
      name: "Ana Costa",
      date: "10/06/2023",
      rating: 5,
      comment: "Perfeito para o meu apartamento! O ROBOT Cleaner Mini é compacto mas muito eficiente. A limpeza é excelente e ele navega facilmente entre os móveis.",
      product: "ROBOT Cleaner Mini"
    }
  ];

  // Load reviews from localStorage on initial render
  const [reviews, setReviews] = useState<Review[]>(() => {
    const savedReviews = localStorage.getItem('robotReviews');
    return savedReviews ? JSON.parse(savedReviews) : initialReviews;
  });

  // Save reviews to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('robotReviews', JSON.stringify(reviews));
  }, [reviews]);

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name.trim() === '' || comment.trim() === '' || rating === 0 || product.trim() === '') {
      toast({
        title: "Erro ao enviar avaliação",
        description: "Por favor, preencha todos os campos e selecione uma classificação.",
        variant: "destructive"
      });
      return;
    }
    
    const newReview: Review = {
      id: reviews.length + 1,
      name,
      date: new Date().toLocaleDateString('pt-BR'),
      rating,
      comment,
      product
    };
    
    setReviews([newReview, ...reviews]);
    
    // Reset form
    setName('');
    setComment('');
    setRating(0);
    setProduct('');
    
    toast({
      title: "Avaliação enviada",
      description: "Obrigado por compartilhar sua experiência conosco!",
    });
  };

  const productOptions = [
    "ROBOT Cleaner Mini",
    "ROBOT Cleaner Standard",
    "ROBOT Cleaner Pro",
    "ROBOT Cleaner Kit de Peças",
    "ROBOT Mop Attachment",
    "ROBOT Filtro HEPA"
  ];

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-4">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleBack}
            >
              <ChevronLeft className="h-4 w-4" />
              Voltar
            </Button>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Avalie-nos</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Avaliações de Clientes</h2>
                
                <div className="space-y-6">
                  {reviews.map(review => (
                    <div key={review.id} className="border-b pb-6 last:border-0">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <div className="bg-robot-blue rounded-full p-2 mr-3">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium">{review.name}</p>
                            <p className="text-sm text-gray-500">{review.date}</p>
                          </div>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < review.rating ? 'fill-robot-blue text-robot-blue' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">{review.comment}</p>
                      <p className="text-xs text-robot-blue mt-2">Produto: {review.product}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Deixe Sua Avaliação</h2>
                
                <form onSubmit={submitReview}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Seu Nome</label>
                      <Input 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        placeholder="Digite seu nome"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Produto</label>
                      <select 
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                        value={product} 
                        onChange={e => setProduct(e.target.value)}
                      >
                        <option value="">Selecione um produto</option>
                        {productOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Classificação</label>
                      <RatingStars rating={rating} setRating={setRating} />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Seu Comentário</label>
                      <Textarea 
                        value={comment} 
                        onChange={e => setComment(e.target.value)} 
                        placeholder="Compartilhe sua experiência com o produto"
                        rows={4}
                      />
                    </div>
                    
                    <Button type="submit" className="w-full bg-robot-blue hover:bg-blue-800">
                      Enviar Avaliação
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Ratings;
