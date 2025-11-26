import React, { useState } from 'react';
import { useStore } from '../store';
import { motion } from 'framer-motion';
import { Lock, Mail, Cross } from 'lucide-react';

export const Login: React.FC = () => {
  const login = useStore((state) => state.login);
  const [email, setEmail] = useState('saude@parauapebas.pa.gov.br');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      login(email);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center shadow-lg">
            {/* Abstract Logo */}
            <div className="relative w-12 h-12">
               <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12 text-green-400">
                  <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" fill="currentColor" fillOpacity="0.8" />
               </svg>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Acesso ao Sistema</h1>
        <p className="text-center text-gray-500 mb-8">Bem-vindo(a) de volta!</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="seuemail@dominio.com"
              />
              <Mail className="absolute right-3 top-3.5 text-gray-400 w-5 h-5" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Digite sua senha"
              />
              <Lock className="absolute right-3 top-3.5 text-gray-400 w-5 h-5" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg transform active:scale-[0.99]"
          >
            Entrar
          </button>
        </form>
        
        <div className="mt-6 text-center">
             <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Esqueci minha senha
             </button>
        </div>
      </motion.div>
    </div>
  );
};