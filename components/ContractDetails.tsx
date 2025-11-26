import React, { useState } from 'react';
import { useStore } from '../store';
import { ContractStatus } from '../types';
import { motion } from 'framer-motion';
import { ContractModal } from './ContractModal';
import { 
  ArrowLeft, 
  Calendar, 
  Building2, 
  FileText, 
  Download,
  Clock,
  AlertCircle,
  Edit
} from 'lucide-react';

export const ContractDetails: React.FC = () => {
  const { contracts, selectedContractId, setView, updateContract } = useStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const contract = contracts.find(c => c.id === selectedContractId);

  if (!contract) {
    return (
        <div className="p-8 text-center">
            <h2 className="text-xl font-bold text-gray-700">Contrato não encontrado</h2>
            <button 
                onClick={() => setView('contracts')}
                className="mt-4 text-blue-600 hover:underline"
            >
                Voltar para lista
            </button>
        </div>
    );
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  const getStatusColor = (status: ContractStatus) => {
    switch (status) {
      case ContractStatus.ACTIVE: return 'text-green-600 bg-green-50 border-green-200';
      case ContractStatus.PENDING: return 'text-orange-600 bg-orange-50 border-orange-200';
      case ContractStatus.EXPIRED: return 'text-red-600 bg-red-50 border-red-200';
      case ContractStatus.CONCLUDED: return 'text-gray-600 bg-gray-100 border-gray-200';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="p-4 pb-24 md:p-8 max-w-7xl mx-auto min-h-screen"
    >
      {/* Navigation & Header */}
      <div className="mb-8">
        <button 
            onClick={() => setView('contracts')}
            className="flex items-center text-gray-500 hover:text-blue-600 transition-colors mb-4 group"
        >
            <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            Voltar para lista
        </button>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{contract.title}</h1>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(contract.status)}`}>
                        {contract.status}
                    </span>
                </div>
                <p className="text-gray-500 flex items-center">
                    <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-sm mr-2">{contract.contractNumber}</span>
                    <span className="text-sm">Atualizado em {new Date(contract.lastUpdate).toLocaleDateString('pt-BR')}</span>
                </p>
            </div>
            
            {/* Action Buttons */}
            <div>
                <button 
                    onClick={() => setIsEditModalOpen(true)}
                    className="flex items-center space-x-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-4 py-2 rounded-lg font-medium shadow-sm transition-colors"
                >
                    <Edit className="w-4 h-4" />
                    <span>Editar Informações</span>
                </button>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* General Info Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-500" />
                    Informações Gerais
                </h2>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-500 font-medium">Descrição do Objeto</label>
                        <p className="text-gray-800 mt-1 leading-relaxed">{contract.description || "Sem descrição informada."}</p>
                    </div>
                </div>
            </div>

            {/* Attachments Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Download className="w-5 h-5 mr-2 text-blue-500" />
                    Anexos e Documentos
                </h2>
                {contract.attachments && contract.attachments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {contract.attachments.map((file, idx) => (
                            <div key={idx} className="flex items-center p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
                                <div className="p-2 bg-red-50 rounded-lg text-red-500 mr-3">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{file}</p>
                                    <p className="text-xs text-gray-500">PDF Document</p>
                                </div>
                                <Download className="w-4 h-4 text-gray-300 group-hover:text-blue-600 transition-colors" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        Nenhum documento anexado
                    </div>
                )}
            </div>

            {/* History Timeline */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                 <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-blue-500" />
                    Histórico de Alterações
                </h2>
                <div className="relative pl-4 border-l-2 border-gray-100 space-y-8">
                    {contract.history && contract.history.length > 0 ? (
                        [...contract.history].reverse().map((item, index) => (
                            <div key={item.id} className="relative">
                                <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-blue-500 border-2 border-white ring-4 ring-blue-50"></div>
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{item.action}</p>
                                        <p className="text-sm text-gray-600 mt-1">{item.details}</p>
                                        <p className="text-xs text-gray-400 mt-2 flex items-center">
                                            <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-600 mr-1.5 font-bold">
                                                {item.user.charAt(0)}
                                            </span>
                                            {item.user}
                                        </p>
                                    </div>
                                    <span className="text-xs font-mono text-gray-400 mt-2 sm:mt-0 bg-gray-50 px-2 py-1 rounded">
                                        {new Date(item.date).toLocaleDateString('pt-BR')} às {new Date(item.date).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 italic text-sm">Nenhum histórico registrado.</p>
                    )}
                </div>
            </div>
        </div>

        {/* Sidebar Info Column */}
        <div className="space-y-6">
            {/* Value Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <p className="text-sm font-medium text-gray-500 mb-1">Valor Total</p>
                <div className="flex items-center text-3xl font-bold text-gray-900">
                    {formatCurrency(contract.value)}
                </div>
            </div>

            {/* Provider Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                 <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Fornecedor</h3>
                 <div className="flex items-start">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600 mr-3">
                        <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900">{contract.provider}</p>
                        <p className="text-sm text-gray-500 mt-1">CNPJ não informado</p>
                        <button className="text-xs text-blue-600 font-medium mt-2 hover:underline">Ver detalhes do fornecedor</button>
                    </div>
                 </div>
            </div>

            {/* Dates Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Vigência</h3>
                <div className="space-y-4">
                    <div className="flex items-start">
                        <Calendar className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                            <p className="text-xs text-gray-500">Data de Início</p>
                            <p className="font-medium text-gray-900">{new Date(contract.startDate).toLocaleDateString('pt-BR')}</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <AlertCircle className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                            <p className="text-xs text-gray-500">Data de Término</p>
                            <p className="font-medium text-gray-900">{new Date(contract.endDate).toLocaleDateString('pt-BR')}</p>
                            <div className="mt-2 text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded inline-block">
                                Restam {Math.max(0, Math.ceil((new Date(contract.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} dias
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
          <ContractModal 
            isOpen={isEditModalOpen} 
            onClose={() => setIsEditModalOpen(false)} 
            contract={contract}
            onSave={(data) => {
                updateContract(contract.id, data);
                setIsEditModalOpen(false);
            }}
          />
      )}
    </motion.div>
  );
};
