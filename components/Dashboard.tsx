import React from 'react';
import { useStore } from '../store';
import { ContractStatus } from '../types';
import { motion } from 'framer-motion';
import { 
  FileText, 
  AlertCircle, 
  DollarSign, 
  Search,
  Plus,
  History,
  TrendingUp
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const Dashboard: React.FC = () => {
  const contracts = useStore((state) => state.contracts);
  const setView = useStore((state) => state.setView);

  // Calculate stats
  const activeContracts = contracts.filter(c => c.status === ContractStatus.ACTIVE).length;
  const expiredContracts = contracts.filter(c => c.status === ContractStatus.EXPIRED).length;
  const pendingContracts = contracts.filter(c => c.status === ContractStatus.PENDING).length;
  const totalValue = contracts.reduce((acc, curr) => acc + curr.value, 0);

  // Prepare chart data
  const chartData = [
    { name: 'Ativo', value: activeContracts, color: '#22c55e' },
    { name: 'Pendente', value: pendingContracts, color: '#f97316' },
    { name: 'Vencido', value: expiredContracts, color: '#ef4444' },
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(val);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="p-4 pb-24 md:p-8 max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="bg-gray-200 p-2 rounded-full">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                AS
            </div>
        </div>
      </div>

      <div className="mb-6 relative">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Buscar por número, fornecedor..." 
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
          />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Active Contracts Card */}
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Contratos Ativos</p>
            <h2 className="text-4xl font-bold text-gray-900">{activeContracts}</h2>
          </div>
          <div className="mt-4 flex items-center text-green-600 text-sm font-medium">
             <TrendingUp className="w-4 h-4 mr-1" /> +1.2%
          </div>
        </motion.div>

        {/* Expiring Soon Card */}
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Expirando em 30 dias</p>
            <h2 className="text-4xl font-bold text-orange-500">18</h2>
          </div>
          <div className="mt-4 text-orange-600 text-sm font-medium">
             Atenção
          </div>
        </motion.div>

        {/* Consolidated Value Card */}
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between md:col-span-2">
            <div>
                 <p className="text-sm font-medium text-gray-500 mb-1">Valor Consolidado</p>
                <h2 className="text-4xl font-bold text-gray-900">{formatCurrency(totalValue)}</h2>
            </div>
            <div className="mt-4 text-green-600 text-sm font-medium">
                 +2.5% vs ano anterior
            </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Chart */}
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-1">
          <h3 className="text-lg font-bold text-gray-900 mb-1">Status dos Contratos</h3>
          <div className="flex items-baseline space-x-2 mb-6">
             <span className="text-3xl font-bold text-gray-900">{contracts.length} Total</span>
             <span className="text-sm text-green-500 font-medium">últimos 12 meses</span>
          </div>
          
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between mt-4 text-xs text-center text-gray-500">
             <div><div className="w-3 h-3 rounded-full bg-green-500 mx-auto mb-1"></div>Ativo</div>
             <div><div className="w-3 h-3 rounded-full bg-orange-500 mx-auto mb-1"></div>Pendente</div>
             <div><div className="w-3 h-3 rounded-full bg-red-500 mx-auto mb-1"></div>Vencido</div>
          </div>
        </motion.div>

        {/* Recent Activities */}
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Atividades Recentes</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-3 bg-blue-50 rounded-xl">
                <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                    <Plus className="w-5 h-5" />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">Novo contrato adicionado</p>
                    <p className="text-xs text-gray-500">Contrato #2024-A31 com MedServ</p>
                </div>
                <span className="text-xs text-gray-400">1h atrás</span>
            </div>
            
            <div className="flex items-start space-x-4 p-3 bg-orange-50 rounded-xl">
                <div className="p-2 bg-orange-100 rounded-full text-orange-600">
                    <History className="w-5 h-5" />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">Status alterado</p>
                    <p className="text-xs text-gray-500">Contrato #2023-B02 marcado como 'Expirado'</p>
                </div>
                <span className="text-xs text-gray-400">Ontem</span>
            </div>

            <div className="flex items-start space-x-4 p-3 bg-gray-50 rounded-xl">
                <div className="p-2 bg-gray-200 rounded-full text-gray-600">
                    <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">Documento anexado</p>
                    <p className="text-xs text-gray-500">Aditivo contratual anexado ao contrato #089/2024</p>
                </div>
                <span className="text-xs text-gray-400">2d atrás</span>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.button 
        whileTap={{ scale: 0.98 }}
        onClick={() => setView('contracts')}
        className="mt-8 w-full bg-blue-600 text-white py-4 rounded-xl font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors"
      >
        Ver Todos os Contratos
      </motion.button>
    </motion.div>
  );
};