
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTransition from '@/components/PageTransition';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';

const Contato = () => {
  const { toast } = useToast();
  const [formState, setFormState] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    toast({
      title: "Mensagem enviada",
      description: "Agradecemos seu contato! Responderemos em breve.",
    });
    // Reset form
    setFormState({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };
  
  const contactInfo = [
    {
      icon: <Phone className="h-5 w-5 text-robot-blue" />,
      title: "Telefone",
      content: "(11) 4002-8922",
      details: "Seg a Sex, 9h às 18h"
    },
    {
      icon: <Mail className="h-5 w-5 text-robot-blue" />,
      title: "Email",
      content: "atendimento@robotcleaner.com",
      details: "Respondemos em até 24h"
    },
    {
      icon: <MapPin className="h-5 w-5 text-robot-blue" />,
      title: "Endereço",
      content: "Av. Paulista, 1578",
      details: "São Paulo, SP - 01310-200"
    },
    {
      icon: <Clock className="h-5 w-5 text-robot-blue" />,
      title: "Horário de Atendimento",
      content: "Segunda a Sexta",
      details: "9h às 18h"
    }
  ];
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

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
              className="mb-10 text-center"
            >
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Entre em Contato</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Estamos à disposição para ouvir você. Entre em contato por qualquer um dos canais abaixo ou preencha o formulário.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <motion.div 
                className="lg:col-span-2"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <form onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nome</Label>
                          <Input 
                            id="name" 
                            name="name" 
                            placeholder="Seu nome completo" 
                            value={formState.name}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            name="email" 
                            type="email" 
                            placeholder="seu-email@exemplo.com" 
                            value={formState.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2 mb-6">
                        <Label htmlFor="subject">Assunto</Label>
                        <Input 
                          id="subject" 
                          name="subject" 
                          placeholder="Motivo do contato" 
                          value={formState.subject}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2 mb-6">
                        <Label htmlFor="message">Mensagem</Label>
                        <Textarea 
                          id="message" 
                          name="message" 
                          placeholder="Detalhe sua mensagem..." 
                          className="min-h-[150px]"
                          value={formState.message}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full md:w-auto bg-robot-blue hover:bg-blue-700">
                        <Send className="h-4 w-4 mr-2" />
                        Enviar Mensagem
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {contactInfo.map((item, index) => (
                  <motion.div 
                    key={index} 
                    variants={itemVariants}
                  >
                    <Card>
                      <CardContent className="p-4 flex items-start space-x-4">
                        <div className="bg-blue-50 p-3 rounded-full">
                          {item.icon}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">{item.title}</h3>
                          <p className="text-robot-blue font-medium">{item.content}</p>
                          <p className="text-sm text-gray-500">{item.details}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-12"
            >
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="h-[400px] bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-500 font-bold mb-2">MAPA DA LOCALIZAÇÃO</p>
                    <p className="text-sm text-gray-400">Av. Paulista, 1578 - São Paulo, SP</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Contato;
