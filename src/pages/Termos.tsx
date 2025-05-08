
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTransition from '@/components/PageTransition';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, Shield, FileText, Cookie } from 'lucide-react';

const Termos = () => {
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
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
              className="mb-8 text-center"
            >
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Termos e Políticas</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Nosso compromisso com a transparência e proteção de seus direitos e privacidade
              </p>
            </motion.div>
            
            <Tabs defaultValue="termos" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="termos" className="flex items-center justify-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Termos de Uso</span>
                  <span className="sm:hidden">Termos</span>
                </TabsTrigger>
                <TabsTrigger value="privacidade" className="flex items-center justify-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Política de Privacidade</span>
                  <span className="sm:hidden">Privacidade</span>
                </TabsTrigger>
                <TabsTrigger value="cookies" className="flex items-center justify-center gap-2">
                  <Cookie className="h-4 w-4" />
                  <span className="hidden sm:inline">Política de Cookies</span>
                  <span className="sm:hidden">Cookies</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="termos">
                <motion.div
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  className="bg-white p-6 rounded-lg shadow-sm"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Termos de Uso</h2>
                  <p className="text-gray-500 mb-6">Atualizado em: 01 de março de 2024</p>
                  
                  <div className="space-y-6 text-gray-700">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">1. Aceitação dos Termos</h3>
                      <p>
                        Ao acessar e usar o site e os serviços da ROBOT Cleaner, você concorda em cumprir e ficar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não poderá acessar ou utilizar nossos serviços.
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">2. Descrição dos Serviços</h3>
                      <p>
                        A ROBOT Cleaner oferece produtos de limpeza robótica, incluindo aspiradores robôs e acessórios relacionados. Nosso site fornece informações sobre esses produtos, bem como a capacidade de comprá-los online.
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">3. Conta de Usuário</h3>
                      <p className="mb-2">
                        Para realizar compras em nosso site, você pode precisar criar uma conta de usuário. Você é responsável por manter a confidencialidade de suas credenciais de login e por todas as atividades que ocorrerem em sua conta.
                      </p>
                      <p>
                        Você concorda em notificar-nos imediatamente sobre qualquer uso não autorizado de sua conta ou qualquer outra violação de segurança.
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">4. Propriedade Intelectual</h3>
                      <p>
                        Todo o conteúdo do site da ROBOT Cleaner, incluindo textos, gráficos, logotipos, ícones, imagens, clipes de áudio, downloads digitais e compilações de dados são propriedade da ROBOT Cleaner ou de seus fornecedores de conteúdo e estão protegidos por leis de direitos autorais internacionais.
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">5. Limitações de Uso</h3>
                      <p>
                        Você concorda em usar nosso site apenas para fins legais e de uma maneira que não infrinja os direitos de qualquer terceiro. Você não deve tentar obter acesso não autorizado a qualquer parte de nosso site, outros contas, sistemas de computador ou redes conectadas a nosso site.
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">6. Alterações nos Termos</h3>
                      <p>
                        A ROBOT Cleaner reserva-se o direito de alterar estes Termos de Uso a qualquer momento. As alterações entram em vigor imediatamente após a publicação no site. O uso continuado de nosso site após tais alterações constitui sua aceitação dos novos termos.
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">7. Lei Aplicável</h3>
                      <p>
                        Estes Termos de Uso são regidos pelas leis do Brasil. Qualquer disputa relacionada a estes termos será submetida à jurisdição exclusiva dos tribunais de São Paulo, SP.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="privacidade">
                <motion.div
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  className="bg-white p-6 rounded-lg shadow-sm"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Política de Privacidade</h2>
                  <p className="text-gray-500 mb-6">Atualizado em: 01 de março de 2024</p>
                  
                  <div className="space-y-6 text-gray-700">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">1. Informações que Coletamos</h3>
                      <p className="mb-2">
                        Coletamos informações que você nos fornece diretamente, como quando cria uma conta, faz uma compra, inscreve-se em nossa newsletter ou entra em contato conosco.
                      </p>
                      <p>
                        Estas informações podem incluir seu nome, endereço de email, endereço de entrega, número de telefone e informações de pagamento.
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">2. Como Usamos suas Informações</h3>
                      <p>
                        Usamos as informações que coletamos para processar suas compras, comunicar-nos com você sobre seu pedido, personalizar sua experiência em nosso site, melhorar nossos produtos e serviços, e enviar-lhe materiais de marketing, se você optar por recebê-los.
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">3. Compartilhamento de Informações</h3>
                      <p>
                        Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto conforme descrito nesta política de privacidade. Podemos compartilhar suas informações com prestadores de serviços terceirizados que nos ajudam a operar nosso site e fornecer nossos produtos e serviços.
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">4. Segurança de Dados</h3>
                      <p>
                        Implementamos medidas de segurança adequadas para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição. No entanto, nenhum método de transmissão pela Internet ou método de armazenamento eletrônico é 100% seguro.
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">5. Seus Direitos</h3>
                      <p>
                        Você tem o direito de acessar, corrigir ou excluir suas informações pessoais, bem como o direito de restringir ou se opor a certos tipos de processamento. Para exercer esses direitos, entre em contato conosco através das informações fornecidas abaixo.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="cookies">
                <motion.div
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  className="bg-white p-6 rounded-lg shadow-sm"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Política de Cookies</h2>
                  <p className="text-gray-500 mb-6">Atualizado em: 01 de março de 2024</p>
                  
                  <div className="space-y-6 text-gray-700">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">1. O que são Cookies</h3>
                      <p>
                        Cookies são pequenos arquivos de texto que são armazenados em seu dispositivo quando você visita um site. Eles são amplamente utilizados para fazer os sites funcionarem ou funcionarem de forma mais eficiente, bem como para fornecer informações aos proprietários do site.
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">2. Como Usamos Cookies</h3>
                      <p>
                        Usamos cookies para entender como você interage com nosso site, para lembrar suas preferências e para melhorar sua experiência geral. Também usamos cookies para ajudar a mostrar anúncios relevantes e analisar o tráfego do site.
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">3. Tipos de Cookies que Usamos</h3>
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <ChevronRight className="h-5 w-5 text-robot-blue mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-medium">Cookies Essenciais:</span>
                            <p className="ml-5">Necessários para o funcionamento básico do site, como autenticação e segurança.</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <ChevronRight className="h-5 w-5 text-robot-blue mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-medium">Cookies de Preferências:</span>
                            <p className="ml-5">Permitem que o site lembre suas escolhas para fornecer funcionalidades aprimoradas.</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <ChevronRight className="h-5 w-5 text-robot-blue mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-medium">Cookies de Estatísticas:</span>
                            <p className="ml-5">Ajudam-nos a entender como os visitantes interagem com o site, coletando e relatando informações anonimamente.</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <ChevronRight className="h-5 w-5 text-robot-blue mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-medium">Cookies de Marketing:</span>
                            <p className="ml-5">Usados para rastrear visitantes em sites, com o objetivo de exibir anúncios relevantes.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">4. Gerenciando Cookies</h3>
                      <p>
                        A maioria dos navegadores da web permite algum controle da maioria dos cookies através das configurações do navegador. Para saber mais sobre cookies e como gerenciá-los, visite www.allaboutcookies.org.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Termos;
