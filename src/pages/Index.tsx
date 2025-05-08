
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <section className="bg-gradient py-20 md:py-32 relative overflow-hidden">
          <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 z-10 animate-fadeIn">
              <div className="flex items-end mb-8">
                <h1 className="text-5xl md:text-7xl text-gray-600 logo-robot font-bold">ROBOT</h1>
                <span className="text-robot-blue logo-cleaner text-5xl md:text-7xl -ml-2">Cleaner</span>
              </div>
              
              <div className="space-y-4">
                <p className="text-xl md:text-3xl text-robot-blue font-semibold">
                  Brinquedo <span className="text-gray-500 font-normal">para o filho</span>
                </p>
                <p className="text-xl md:text-3xl text-robot-blue font-semibold">
                  Diversão <span className="text-gray-500 font-normal">para os pais</span>
                </p>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 relative z-0 mt-12 md:mt-0">
              <svg className="robot-outline w-full h-auto" viewBox="0 0 600 400">
                <path d="M300,70 L350,140 L380,110 L410,170 L430,150 L470,240 L430,270 L340,270 L300,320 L260,270 L170,270 L130,240 L170,150 L190,170 L220,110 L250,140 L300,70" />
                <path d="M250,170 L350,170 L370,200 L350,230 L250,230 L230,200 L250,170" />
                <path d="M270,200 A10,10 0 1,1 290,200 A10,10 0 1,1 270,200" />
                <path d="M310,200 A10,10 0 1,1 330,200 A10,10 0 1,1 310,200" />
                <path d="M200,270 L200,350 L230,350 L230,270" />
                <path d="M370,270 L370,350 L400,350 L400,270" />
              </svg>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
