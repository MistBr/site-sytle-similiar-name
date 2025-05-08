
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ChevronLeft, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
  const navigate = useNavigate();

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
          
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Sobre Nós</h1>
          
          {/* About Us Section */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-700 mb-4">
                  A ROBOT é uma empresa brasileira fundada em 2010 com o objetivo de revolucionar a limpeza doméstica através da tecnologia. Nossa missão é criar produtos inovadores que simplificam o dia a dia de nossos clientes, proporcionando mais tempo para o que realmente importa.
                </p>
                <p className="text-gray-700 mb-4">
                  Nossa linha de aspiradores robóticos ROBOT Cleaner é o resultado de anos de pesquisa e desenvolvimento, combinando tecnologia de ponta, design elegante e funcionalidade excepcional. Todos os nossos produtos são desenvolvidos pensando na praticidade, eficiência e satisfação do consumidor.
                </p>
                <p className="text-gray-700">
                  Valorizamos seus comentários e sugestões, pois nos ajudam a melhorar constantemente. Sinta-se à vontade para compartilhar suas experiências com nossos produtos através do formulário de avaliação.
                </p>
              </div>
              <div className="flex items-center justify-center">
                <div className="bg-gray-100 p-6 rounded-lg w-full max-w-md">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Nossos Valores</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="bg-robot-blue rounded-full p-1 mr-2 mt-1">
                        <Star className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-gray-700">Inovação constante em produtos e serviços</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-robot-blue rounded-full p-1 mr-2 mt-1">
                        <Star className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-gray-700">Qualidade e durabilidade em cada produto</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-robot-blue rounded-full p-1 mr-2 mt-1">
                        <Star className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-gray-700">Compromisso com a satisfação do cliente</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-robot-blue rounded-full p-1 mr-2 mt-1">
                        <Star className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-gray-700">Responsabilidade ambiental e sustentabilidade</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-robot-blue rounded-full p-1 mr-2 mt-1">
                        <Star className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-gray-700">Suporte técnico e atendimento de excelência</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Nossa História</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-700 mb-4">
                  A ROBOT foi fundada por um grupo de engenheiros e designers apaixonados por tecnologia e inovação. Nossa jornada começou com a visão de transformar as tarefas domésticas através da automação inteligente.
                </p>
                <p className="text-gray-700 mb-4">
                  Em 2012, lançamos o primeiro ROBOT Cleaner, que rapidamente se tornou um sucesso no mercado brasileiro. Desde então, nossa linha de produtos cresceu para incluir vários modelos adaptados a diferentes necessidades e ambientes.
                </p>
                <p className="text-gray-700">
                  Atualmente, somos líderes no segmento de robôs aspiradores no Brasil, com presença em mais de 500 lojas em todo o país e mais de 200.000 unidades vendidas.
                </p>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">2010</h4>
                  <p className="text-gray-700 text-sm">Fundação da empresa</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">2012</h4>
                  <p className="text-gray-700 text-sm">Lançamento do primeiro ROBOT Cleaner</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">2015</h4>
                  <p className="text-gray-700 text-sm">Expansão para todo o território nacional</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">2018</h4>
                  <p className="text-gray-700 text-sm">Lançamento da linha ROBOT Cleaner Pro</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">2020</h4>
                  <p className="text-gray-700 text-sm">10 anos de inovação e excelência</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
