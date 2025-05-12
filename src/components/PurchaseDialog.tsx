
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { ClipboardCopy, QrCode, Phone, Info, CheckCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import QRCode from 'react-qr-code';


interface PurchaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  totalPrice: number;
  orderNumber: string;
}

const PurchaseDialog = ({ isOpen, onClose, totalPrice, orderNumber }: PurchaseDialogProps) => {
  const { toast } = useToast();

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(orderNumber);
    toast({
      title: "Copiado!",
      description: "Número do pedido copiado para a área de transferência.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <CheckCircle className="text-green-500 h-6 w-6" />
            Compra Realizada com Sucesso!
          </DialogTitle>
          <DialogDescription>
            Seu pedido foi recebido e será processado em breve.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <motion.div 
            className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-center mb-4">
              <h3 className="font-medium text-gray-800 mb-1">Escaneie o QR Code para acompanhar seu pedido</h3>
              <p className="text-sm text-gray-500">Ou acesse através do número do pedido</p>
            </div>
            
            <motion.div 
              className="bg-white p-3 rounded-lg border mb-3 relative"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
           <div style={{ background: '#FFFFFF', padding: '8px', borderRadius: '8px' }}>
            <QRCode
              value={`http://localhost:5173/loja/${orderNumber}`}
              size={128}
              fgColor="#1E3A8A" />
           </div>
 

            </motion.div>
            
            <div className="flex items-center gap-2 mb-1">
              <p className="font-medium">Número do pedido:</p>
              <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                <span className="font-mono text-sm">{orderNumber}</span>
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={copyOrderNumber}
                  className="p-1 rounded-full hover:bg-gray-200"
                >
                  <ClipboardCopy className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
            <p className="text-robot-blue font-bold text-lg">
              Total: R${totalPrice.toFixed(2)}
            </p>
          </motion.div>
          
          <motion.div 
            className="space-y-3 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-start gap-2 p-3 border rounded-lg">
              <Info className="h-5 w-5 text-robot-blue mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium mb-1">Direitos de compra online</h4>
                <p className="text-gray-600">
                  De acordo com o Código de Defesa do Consumidor, você tem 7 dias para desistir da compra 
                  e solicitar a devolução. Caso tenha algum problema, entre em contato conosco.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-2 p-3 border rounded-lg">
              <Phone className="h-5 w-5 text-robot-blue mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium mb-1">Atendimento ao Cliente</h4>
                <p className="text-gray-600">
                  Se precisar de ajuda, entre em contato pelo telefone: <br />
                  <span className="font-medium">(11) 4002-8922</span> <br />
                  Segunda a sexta, das 9h às 18h
                </p>
              </div>
            </div>
          </motion.div>
        </div>
        
        <Button 
          onClick={onClose} 
          className="w-full mt-2"
        >
          Voltar para a loja
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseDialog;
