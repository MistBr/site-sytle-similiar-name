
import React, { useState, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { Button, MotionButton } from "@/components/ui/button";
import { Plus, Minus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PurchaseDialog from './PurchaseDialog';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface ShoppingCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: Product[];
  updateQuantity: (productId: number, action: 'increase' | 'decrease') => void;
  totalPrice: number;
}

const ShoppingCartDrawer = ({ 
  isOpen, 
  onClose, 
  cart, 
  updateQuantity,
  totalPrice 
}: ShoppingCartDrawerProps) => {
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  
  const handleFinishPurchase = () => {
    // Generate a random order number
    const randomOrderNumber = `ROB-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderNumber(randomOrderNumber);
    setIsPurchaseDialogOpen(true);
  };
  
  const handleClosePurchaseDialog = () => {
    setIsPurchaseDialogOpen(false);
    onClose(); // Close the cart drawer when closing the purchase dialog
  };

  return (
    <>
      <Drawer open={isOpen} onClose={onClose}>
        <DrawerContent className="max-h-[80vh] overflow-auto">
          <DrawerHeader className="border-b pb-4">
            <DrawerTitle className="text-2xl font-bold text-robot-blue flex items-center justify-between">
              Carrinho de Compras
              <DrawerClose 
                onClick={onClose} 
                className="rounded-full hover:bg-gray-100 p-1 transition-colors duration-200"
              >
                <X className="h-5 w-5" />
              </DrawerClose>
            </DrawerTitle>
          </DrawerHeader>

          {cart.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6 text-center"
            >
              <p className="text-gray-500">Seu carrinho está vazio.</p>
            </motion.div>
          ) : (
            <>
              <AnimatePresence>
                <div className="divide-y">
                  {cart.map(item => (
                    <motion.div 
                      key={item.id} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center py-4 px-6"
                    >
                      <motion.div 
                        className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center mr-4"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <span className="text-gray-500 font-bold text-xs">ROBOT</span>
                      </motion.div>
                      <div className="flex-grow">
                        <h3 className="font-medium text-sm">{item.name}</h3>
                        <p className="text-robot-blue font-bold">R${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center border rounded overflow-hidden">
                        <motion.button 
                          onClick={() => updateQuantity(item.id, 'decrease')}
                          className="p-1 hover:bg-gray-100"
                          whileTap={{ scale: 0.9 }}
                        >
                          <Minus className="h-4 w-4" />
                        </motion.button>
                        <span className="px-2">{item.quantity}</span>
                        <motion.button 
                          onClick={() => updateQuantity(item.id, 'increase')}
                          className="p-1 hover:bg-gray-100"
                          whileTap={{ scale: 0.9 }}
                        >
                          <Plus className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>

              <DrawerFooter className="border-t pt-4">
                <motion.div 
                  className="flex justify-between items-center mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="font-medium">Total:</span>
                  <span className="font-bold text-robot-blue text-xl">R${totalPrice.toFixed(2)}</span>
                </motion.div>
                <MotionButton 
                  className="w-full bg-robot-blue hover:bg-blue-800 transition-colors duration-300"
                  onClick={handleFinishPurchase}
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ 
                    scale: 1.03,
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
                  }}
                >
                  Finalizar Compra
                </MotionButton>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>

      <PurchaseDialog 
        isOpen={isPurchaseDialogOpen}
        onClose={handleClosePurchaseDialog}
        totalPrice={totalPrice}
        orderNumber={orderNumber}
      />
    </>
  );
};

export default ShoppingCartDrawer;
