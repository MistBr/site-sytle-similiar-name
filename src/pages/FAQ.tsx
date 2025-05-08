
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTransition from '@/components/PageTransition';
import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const faqCategories = [
  {
    category: "Produtos e Funcionalidades",
    questions: [
      {
        id: "q1",
        question: "Quanto tempo de bateria tem o ROBOT Cleaner?",
        answer: "Nossos modelos variam entre 90 minutos a 240 minutos de autonomia, dependendo do modelo e modo de limpeza selecionado. O ROBOT Cleaner Pro tem até 180 minutos, enquanto o ROBOT Cleaner Ultra pode funcionar por até 240 minutos com uma única carga."
      },
      {
        id: "q2",
        question: "Os aspiradores ROBOT funcionam em carpetes?",
        answer: "Sim! Todos os nossos modelos são projetados para limpar múltiplos tipos de superfícies, incluindo pisos duros, carpetes e tapetes. Os modelos Pro e Ultra têm potência extra para carpetes mais espessos."
      },
      {
        id: "q3",
        question: "Posso programar horários de limpeza?",
        answer: "Sim, todos os aspiradores ROBOT podem ser programados para limpeza automática através do aplicativo ROBOT Home, disponível para Android e iOS. Você pode definir horários específicos para cada dia da semana."
      }
    ]
  },
  {
    category: "Compra e Garantia",
    questions: [
      {
        id: "q4",
        question: "Qual é o prazo de garantia dos produtos ROBOT?",
        answer: "Todos os aspiradores ROBOT têm garantia de 12 meses contra defeitos de fabricação. Registrando seu produto em nosso site, você ganha mais 6 meses de garantia estendida gratuitamente."
      },
      {
        id: "q5",
        question: "Como posso comprar peças de reposição?",
        answer: "Peças de reposição podem ser adquiridas diretamente em nossa loja online ou em revendedores autorizados. Recomendamos usar apenas peças originais ROBOT para manter o desempenho do seu aparelho."
      },
      {
        id: "q6",
        question: "Vocês oferecem frete grátis?",
        answer: "Sim, oferecemos frete grátis para compras acima de R$300 para todo o Brasil. Produtos menores podem ter frete grátis em promoções especiais."
      }
    ]
  },
  {
    category: "Suporte Técnico",
    questions: [
      {
        id: "q7",
        question: "Meu ROBOT não está conectando ao Wi-Fi, o que fazer?",
        answer: "Primeiro, verifique se seu roteador está utilizando a rede 2.4GHz, pois nossos dispositivos não são compatíveis com 5GHz. Depois, reinicie tanto o aspirador quanto o roteador e tente o processo de conexão novamente. Se o problema persistir, contate nosso suporte técnico."
      },
      {
        id: "q8",
        question: "Com que frequência devo limpar o filtro?",
        answer: "Recomendamos limpar o filtro após cada uso, especialmente se você tem animais de estimação. O filtro deve ser substituído a cada 2-3 meses, dependendo da frequência de uso."
      },
      {
        id: "q9",
        question: "O que fazer se o aspirador parar durante a limpeza?",
        answer: "Se o aspirador parar inesperadamente, verifique se há obstruções nas escovas ou rodas. Verifique também se a bateria está carregada. Caso persista, consulte o manual do usuário para ver os códigos de erro mostrados no LED ou no aplicativo, ou entre em contato com nosso suporte técnico."
      }
    ]
  }
];

const FAQ = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filteredFAQs, setFilteredFAQs] = React.useState(faqCategories);

  React.useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredFAQs(faqCategories);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = faqCategories
      .map(category => ({
        category: category.category,
        questions: category.questions.filter(
          q => q.question.toLowerCase().includes(query) || q.answer.toLowerCase().includes(query)
        )
      }))
      .filter(category => category.questions.length > 0);

    setFilteredFAQs(filtered);
  }, [searchQuery]);

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
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-10 text-center"
            >
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Perguntas Frequentes</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Encontre respostas para as dúvidas mais comuns sobre nossos produtos e serviços
              </p>
            </motion.div>
            
            <div className="relative mb-8 max-w-xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Pesquisar perguntas..."
                className="pl-10 border-gray-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <motion.div
              className="space-y-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredFAQs.length === 0 ? (
                <motion.div 
                  variants={itemVariants}
                  className="text-center py-8"
                >
                  <p className="text-gray-500">Nenhum resultado encontrado para "{searchQuery}"</p>
                </motion.div>
              ) : (
                filteredFAQs.map((category, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">{category.category}</h2>
                    <Accordion type="single" collapsible className="bg-white rounded-lg shadow-sm">
                      {category.questions.map(faq => (
                        <AccordionItem key={faq.id} value={faq.id}>
                          <AccordionTrigger className="px-4 text-left font-medium">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="px-4 text-gray-600">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </motion.div>
                ))
              )}
            </motion.div>
          </div>
        </main>
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default FAQ;
