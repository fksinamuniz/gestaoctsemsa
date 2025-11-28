
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Contract } from '../types';
import { Clock, AlertTriangle, ChevronRight } from 'lucide-react';
import { useStore } from '../store';

interface NotificationMenuProps {
  isOpen: boolean;
  onClose: () => void;
  expiringContracts: Contract[];
}

export const NotificationMenu: React.FC<NotificationMenuProps> = ({ isOpen, onClose, expiringContracts }) => {
  const { setView, setSelectedContractId } = useStore();

  if (!isOpen) return null;

  const handleItemClick = (id: string) => {
    setSelectedContractId(id);
    setView('contract-details');
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
      >
        <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50">
          <h3 className="font-semibold text-gray-900 flex items-center">
            <AlertTriangle className="w-4 h-4 text-orange-500 mr-2" />
            Processos a Vencer
            <span className="ml-2 bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full font-bold">
              {expiringContracts.length}
            </span>
          </h3>
          <button 
            onClick={onClose}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            Fechar
          </button>
        </div>

        <div className="max-h-[300px] overflow-y-auto">
          {expiringContracts.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {expiringContracts.map((contract) => {
                const daysLeft = Math.ceil((new Date(contract.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                return (
                  <div 
                    key={contract.id}
                    onClick={() => handleItemClick(contract.id)}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors group"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-sm font-semibold text-gray-900 line-clamp-1 pr-2">
                        {contract.title}
                      </p>
                      <span className={`text-xs font-bold px-2 py-1 rounded-md whitespace-nowrap ${
                        daysLeft <= 10 ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                      }`}>
                        {daysLeft} dias
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{contract.provider}</p>
                    <div className="flex items-center text-xs text-gray-400">
                      <Clock className="w-3 h-3 mr-1" />
                      Vence em {new Date(contract.endDate).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p className="text-sm">Nenhum processo próximo do vencimento.</p>
            </div>
          )}
        </div>

        <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
          <button onClick={() => setView('contracts')} className="text-xs font-medium text-gray-600 hover:text-blue-600 flex items-center justify-center w-full">
            Ver todos os contratos
            <ChevronRight className="w-3 h-3 ml-1" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
