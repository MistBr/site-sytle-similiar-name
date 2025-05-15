
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTransition from '@/components/PageTransition';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const newsItems = [
  {
    id: 1,
    title: 'Lançamento do ROBOT Cleaner Ultra 2024',
    date: '15 de março de 2024',
    description: 'Conheça nosso mais recente modelo com tecnologia de mapeamento 3D e 4 horas de autonomia.',
    tags: ['Lançamento', 'Tecnologia'],
    image: '/placeholder.svg'
  },
  {
    id: 2,
    title: 'Novos acessórios para sua linha ROBOT',
    date: '28 de fevereiro de 2024',
    description: 'Ampliamos nossa linha de acessórios com novos filtros HEPA de alta durabilidade e escovas especiais para pets.',
    tags: ['Acessórios', 'Lançamento'],
    image: '/placeholder.svg'
  },
  {
    id: 3,
    title: 'ROBOT Cleaner agora com controle por voz',
    date: '10 de janeiro de 2024',
    description: 'Nossos modelos Pro e Ultra agora são compatíveis com assistentes de voz como Alexa e Google Assistant.',
    tags: ['Atualização', 'Tecnologia'],
    image: '/arduino.jpg'
  },
  {
    id: 4,
    title: 'Programa de reciclagem ROBOT',
    date: '5 de janeiro de 2024',
    description: 'Lançamos nosso programa de reciclagem: traga seu aspirador antigo e ganhe desconto na compra de um novo ROBOT Cleaner.',
    tags: ['Sustentabilidade', 'Programa'],
    image: '/placeholder.svg'
  }
];

const Novidades = () => {
  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Novidades</h1>
              <p className="text-gray-600">Fique por dentro das últimas atualizações e lançamentos da ROBOT Cleaner</p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {newsItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full overflow-hidden hover:shadow-md transition-shadow duration-300">
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 font-bold text-lg">ROBOT Cleaner</span>
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Calendar className="h-4 w-4 mr-1" />
                        {item.date}
                      </div>
                      <CardTitle className="text-xl">{item.title}</CardTitle>
                      <div className="flex flex-wrap gap-2 my-2">
                        {item.tags.map(tag => (
                          <Badge key={tag} className="bg-blue-50 text-robot-blue border-robot-blue">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base text-gray-600">
                        {item.description}
                      </CardDescription>
                    </CardContent>
                    <div className="px-6 pb-6">
                      <Button className="flex-1 bg-black text-white hover:bg-robot-blue transition-colors duration-300">
                        Leia mais <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Novidades;
