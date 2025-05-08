
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion, Variants } from "framer-motion";

interface CategoryCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'eletronics' | '3d' | 'controls' | 'all';
  onClick: (category: 'eletronics' | '3d' | 'controls' | 'all') => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ 
  title, 
  description, 
  icon,
  category,
  onClick
}) => {
  const iconVariants: Variants = {
    initial: {
      rotate: 0,
      scale: 1
    },
    hover: {
      rotate: [0, -10, 10, -10, 0],
      scale: 1.1,
      transition: {
        duration: 0.6,
        ease: "easeInOut",
        repeat: 0,
        repeatType: "loop" as const,
        repeatDelay: 0.5
      }
    }
  };
  
  const cardVariants: Variants = {
    initial: {
      y: 0,
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
    },
    hover: {
      y: -5,
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      transition: {
        duration: 0.3
      }
    }
  };
  
  return (
    <motion.div
      initial="initial"
      whileHover="hover"
      variants={cardVariants}
      onClick={() => onClick(category)}
      className="cursor-pointer"
    >
      <Card className="h-full border border-gray-200 hover:border-robot-blue transition-colors duration-300">
        <CardHeader className="pb-2">
          <div className="mb-4 flex justify-center">
            <motion.div
              variants={iconVariants}
              className="p-3 bg-blue-50 rounded-full"
            >
              {icon}
            </motion.div>
          </div>
          <h3 className="text-lg font-semibold text-center">{title}</h3>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 text-center">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CategoryCard;
