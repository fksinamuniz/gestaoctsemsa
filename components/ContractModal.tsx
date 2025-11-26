import React, { useState, useEffect } from 'react';
import { Contract, ContractStatus } from '../types';
import { motion } from 'framer-motion';
import { X, Upload, FileText } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    contract: Contract | null;
    onSave: (data: Partial<Contract>) => void;
}

export const ContractModal: React.FC<ModalProps> = ({ isOpen, onClose, contract, onSave }) => {
    const [formData, setFormData] = useState<Partial<Contract>>({
        title: '',
        provider: '',
        contractNumber: '',
        value: 0,
        status: ContractStatus.PENDING,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        description: '',
        attachments: []
    });

    useEffect(() => {
        if (contract) {
            setFormData({ ...contract, attachments: contract.attachments || [] });
        } else {
            setFormData({
                title: '',
                provider: '',
                contractNumber: '',
                value: 0,
                status: ContractStatus.PENDING,
                startDate: new Date().toISOString().split('T')[0],
                endDate: new Date().toISOString().split('T')[0],
                description: '',
                attachments: []
            });
        }
    }, [contract, isOpen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const fileName = e.target.files[0].name;
            setFormData(prev => ({
                ...prev,
                attachments: [...(prev.attachments || []), fileName]
            }));
            // Reset input value to allow selecting same file again if needed
            e.target.value = '';
        }
    };

    const removeAttachment = (index: number) => {
        setFormData(prev => ({
            ...prev,
            attachments: (prev.attachments || []).filter((_, i) => i !== index)
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
            >
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">
                        {contract ? 'Editar Contrato' : 'Novo Contrato'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
                
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Título do Objeto</label>
                        <input 
                            className="w-full p-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                            <input 
                                className="w-full p-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.contractNumber}
                                onChange={e => setFormData({...formData, contractNumber: e.target.value})}
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
                            <input 
                                type="number"
                                className="w-full p-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.value}
                                onChange={e => setFormData({...formData, value: Number(e.target.value)})}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fornecedor</label>
                        <input 
                            className="w-full p-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.provider}
                            onChange={e => setFormData({...formData, provider: e.target.value})}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                        <textarea 
                            className="w-full p-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Início</label>
                            <input 
                                type="date"
                                className="w-full p-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.startDate}
                                onChange={e => setFormData({...formData, startDate: e.target.value})}
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fim</label>
                            <input 
                                type="date"
                                className="w-full p-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.endDate}
                                onChange={e => setFormData({...formData, endDate: e.target.value})}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select 
                            className="w-full p-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.status}
                            onChange={e => setFormData({...formData, status: e.target.value as ContractStatus})}
                        >
                            {Object.values(ContractStatus).map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    {/* Attachment Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Anexos</label>
                        <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-lg bg-gray-800 hover:bg-gray-750 transition-colors">
                            <div className="space-y-1 text-center">
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-400 justify-center">
                                    <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-blue-500 hover:text-blue-400 focus-within:outline-none">
                                        <span>Carregar arquivo</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                                    </label>
                                    <p className="pl-1">ou arraste e solte</p>
                                </div>
                                <p className="text-xs text-gray-500">PDF, DOC, JPG até 10MB</p>
                            </div>
                        </div>
                        
                        {/* File List */}
                        {formData.attachments && formData.attachments.length > 0 && (
                            <ul className="mt-3 space-y-2">
                                {formData.attachments.map((file, index) => (
                                    <li key={index} className="flex items-center justify-between p-3 bg-gray-800 border border-gray-600 rounded-lg">
                                        <div className="flex items-center space-x-2 overflow-hidden">
                                            <div className="p-1.5 bg-gray-700 rounded">
                                                <FileText className="w-4 h-4 text-gray-300" />
                                            </div>
                                            <span className="text-sm text-gray-200 truncate">{file}</span>
                                        </div>
                                        <button 
                                            onClick={() => removeAttachment(index)} 
                                            className="p-1 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Cancelar</button>
                    <button 
                        onClick={() => onSave(formData)} 
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                    >
                        Salvar
                    </button>
                </div>
            </motion.div>
        </div>
    );
};