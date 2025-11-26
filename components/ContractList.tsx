import React, { useMemo, useState } from 'react';
import { useStore } from '../store';
import { Contract, ContractStatus } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { ContractModal } from './ContractModal';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  ChevronLeft, 
  Plus,
  Trash2,
  Edit,
  X,
  FileText
} from 'lucide-react';

export const ContractList: React.FC = () => {
  const { 
    contracts, 
    searchQuery, 
    filterStatus, 
    setSearchQuery, 
    setFilterStatus,
    deleteContract,
    addContract,
    updateContract,
    setSelectedContractId,
    setView
  } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);

  const filteredContracts = useMemo(() => {
    return contracts.filter((c) => {
      const matchesSearch = 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.contractNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.provider.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = filterStatus === 'All' || c.status === filterStatus;

      return matchesSearch && matchesFilter;
    });
  }, [contracts, searchQuery, filterStatus]);

  const getStatusColor = (status: ContractStatus) => {
    switch (status) {
      case ContractStatus.ACTIVE: return 'text-green-600 bg-green-50';
      case ContractStatus.PENDING: return 'text-orange-600 bg-orange-50';
      case ContractStatus.EXPIRED: return 'text-red-600 bg-red-50';
      case ContractStatus.CONCLUDED: return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusDot = (status: ContractStatus) => {
    switch (status) {
      case ContractStatus.ACTIVE: return 'bg-green-500';
      case ContractStatus.PENDING: return 'bg-orange-500';
      case ContractStatus.EXPIRED: return 'bg-red-500';
      case ContractStatus.CONCLUDED: return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const handleEdit = (contract: Contract) => {
    setEditingContract(contract);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Tem certeza que deseja excluir este contrato?')) {
        deleteContract(id);
    }
  };

  const handleContractClick = (id: string) => {
    setSelectedContractId(id);
    setView('contract-details');
  };

  return (
    <div className="p-4 pb-24 md:p-8 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 sticky top-0 bg-gray-50 z-10 py-2">
        <div className="flex items-center space-x-3">
             <button className="md:hidden text-gray-600">
                 <div className="w-6 h-0.5 bg-gray-800 mb-1"></div>
                 <div className="w-6 h-0.5 bg-gray-800 mb-1"></div>
                 <div className="w-6 h-0.5 bg-gray-800"></div>
             </button>
             <h1 className="text-2xl font-bold text-gray-900">Contratos</h1>
        </div>
        
        <div className="flex items-center space-x-2">
            <button 
                onClick={() => {
                    setEditingContract(null);
                    setIsModalOpen(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center shadow-md transition-colors"
            >
                <Plus className="w-5 h-5 mr-1" />
                <span className="hidden md:inline">Novo</span>
            </button>
            <div className="relative">
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-full transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                </button>
            </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Buscar por nome ou número..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
          />
      </div>

      {/* Filters */}
      <div className="flex space-x-2 overflow-x-auto pb-4 no-scrollbar">
        <div className="relative group">
            <button className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 whitespace-nowrap">
                <Filter className="w-4 h-4" />
                <span>Status: {filterStatus === 'All' ? 'Todos' : filterStatus}</span>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 hidden group-focus-within:block z-20">
                    {['All', ...Object.values(ContractStatus)].map((status) => (
                        <div 
                            key={status} 
                            className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                            onClick={() => setFilterStatus(status as any)}
                        >
                            {status === 'All' ? 'Todos' : status}
                        </div>
                    ))}
                </div>
            </button>
        </div>

        <button className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 whitespace-nowrap">
            <span>Fornecedor</span>
             <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>

        <button className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 whitespace-nowrap">
            <span>Período</span>
             <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>
      </div>

      {/* Contracts List */}
      <div className="space-y-4">
        <AnimatePresence>
            {filteredContracts.map((contract) => (
            <motion.div
                key={contract.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => handleContractClick(contract.id)}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer relative group"
            >
                <div className="absolute top-5 right-5 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleEdit(contract); }}
                        className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={(e) => handleDelete(contract.id, e)}
                        className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 pr-12 line-clamp-1">{contract.title}</h3>
                </div>
                
                <div className="flex items-center mb-3">
                    <div className={`px-2 py-0.5 rounded-full text-xs font-semibold flex items-center ${getStatusColor(contract.status)}`}>
                        <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusDot(contract.status)}`}></div>
                        {contract.status}
                    </div>
                    <span className="text-xs text-gray-400 ml-3 font-mono">{contract.contractNumber}</span>
                </div>

                <div className="mb-3">
                    <p className="text-sm text-gray-600">
                        <span className="font-medium text-gray-500">Fornecedor:</span> {contract.provider}
                    </p>
                </div>

                {contract.attachments && contract.attachments.length > 0 && (
                    <div className="mb-3 flex items-center space-x-2 overflow-x-auto no-scrollbar">
                        {contract.attachments.map((att, i) => (
                            <div key={i} className="flex items-center bg-gray-100 px-2 py-1 rounded text-xs text-gray-600 whitespace-nowrap">
                                <FileText className="w-3 h-3 mr-1" />
                                <span className="max-w-[100px] truncate">{att}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                    <div className="text-sm text-gray-500">
                         Vigência: <span className="text-gray-700">{new Date(contract.endDate).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
            </motion.div>
            ))}
        </AnimatePresence>
        
        {filteredContracts.length === 0 && (
            <div className="text-center py-12">
                <p className="text-gray-500">Nenhum contrato encontrado.</p>
            </div>
        )}
      </div>

      {/* Pagination Mock */}
      <div className="flex items-center justify-between mt-8 bg-white p-4 rounded-xl border border-gray-100">
        <button className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Anterior
        </button>
        <span className="text-sm text-gray-600">Página 1 de 10</span>
        <button className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
            Próximo
            <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>

      {/* Shared Modal */}
      {isModalOpen && (
          <ContractModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            contract={editingContract}
            onSave={(data) => {
                if (editingContract) {
                    updateContract(editingContract.id, data);
                } else {
                    addContract(data as any);
                }
                setIsModalOpen(false);
            }}
          />
      )}
    </div>
  );
};
