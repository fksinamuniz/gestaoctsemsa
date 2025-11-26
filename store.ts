
import { create } from 'zustand';
import { Contract, ContractStatus, User, ViewState } from './types';

interface AppState {
  user: User | null;
  currentView: ViewState;
  contracts: Contract[];
  searchQuery: string;
  filterStatus: ContractStatus | 'All';
  selectedContractId: string | null;
  
  // Actions
  login: (email: string) => void;
  logout: () => void;
  setView: (view: ViewState) => void;
  setSearchQuery: (query: string) => void;
  setFilterStatus: (status: ContractStatus | 'All') => void;
  addContract: (contract: Omit<Contract, 'id' | 'lastUpdate'>) => void;
  updateContract: (id: string, data: Partial<Contract>) => void;
  deleteContract: (id: string) => void;
  setSelectedContractId: (id: string | null) => void;
}

// Mock Data Generation
const generateMockContracts = (): Contract[] => [
  {
    id: '1',
    title: 'Aquisição de Equipamentos Hospitalares',
    provider: 'MedEquip Soluções LTDA',
    contractNumber: '123/2024',
    value: 1250000.00,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: ContractStatus.ACTIVE,
    description: 'Compra de respiradores e monitores multiparamétricos para a UPA.',
    lastUpdate: '2024-05-20T10:00:00Z',
    attachments: ['contrato_assinado.pdf', 'anexo_tecnico.pdf'],
    history: [
      { id: 'h1', date: '2024-01-01T08:00:00Z', action: 'Criação', user: 'Admin Saúde', details: 'Contrato cadastrado no sistema' },
      { id: 'h2', date: '2024-05-20T10:00:00Z', action: 'Anexo Adicionado', user: 'Admin Saúde', details: 'Anexo técnico incluído' }
    ]
  },
  {
    id: '2',
    title: 'Serviço de Manutenção Preventiva',
    provider: 'Health Tech Services',
    contractNumber: '058/2023',
    value: 85000.00,
    startDate: '2023-06-15',
    endDate: '2023-12-14',
    status: ContractStatus.EXPIRED,
    description: 'Manutenção de aparelhos de raio-x.',
    lastUpdate: '2023-12-15T09:30:00Z',
    attachments: ['termo_encerramento.pdf'],
    history: [
      { id: 'h1', date: '2023-06-15T09:00:00Z', action: 'Criação', user: 'Roberto Silva', details: 'Contrato iniciado' },
      { id: 'h2', date: '2023-12-14T18:00:00Z', action: 'Expiração', user: 'Sistema', details: 'Contrato venceu automaticamente' }
    ]
  },
  {
    id: '3',
    title: 'Fornecimento de Medicamentos',
    provider: 'Distribuidora Farma+',
    contractNumber: '215/2024',
    value: 4500000.00,
    startDate: '2024-03-10',
    endDate: '2025-03-09',
    status: ContractStatus.PENDING,
    description: 'Medicamentos da farmácia básica.',
    lastUpdate: '2024-06-01T14:20:00Z',
    attachments: [],
    history: [
       { id: 'h1', date: '2024-03-10T10:00:00Z', action: 'Criação', user: 'Admin Saúde', details: 'Processo licitatório finalizado' }
    ]
  },
  {
    id: '4',
    title: 'Consultoria em Gestão de Saúde',
    provider: 'Innova Consultoria',
    contractNumber: '007/2022',
    value: 200000.00,
    startDate: '2022-02-01',
    endDate: '2023-01-31',
    status: ContractStatus.CONCLUDED,
    description: 'Otimização de fluxos de atendimento.',
    lastUpdate: '2023-02-01T11:00:00Z',
    history: [
      { id: 'h1', date: '2022-02-01T08:00:00Z', action: 'Criação', user: 'Admin Saúde', details: 'Início da vigência' },
      { id: 'h2', date: '2023-02-01T11:00:00Z', action: 'Conclusão', user: 'Admin Saúde', details: 'Serviço entregue e finalizado' }
    ]
  },
  {
    id: '5',
    title: 'Locação de Ambulâncias',
    provider: 'RapidRescue Transportes',
    contractNumber: '089/2024',
    value: 600000.00,
    startDate: '2024-01-01',
    endDate: '2025-01-01',
    status: ContractStatus.ACTIVE,
    description: 'Locação de 5 ambulâncias UTI móvel.',
    lastUpdate: '2024-02-15T08:00:00Z',
    attachments: ['edital_licitacao.pdf', 'proposta_vencedora.pdf'],
    history: [
      { id: 'h1', date: '2024-01-01T08:00:00Z', action: 'Criação', user: 'Admin Saúde', details: 'Início do contrato' },
      { id: 'h2', date: '2024-02-15T08:00:00Z', action: 'Atualização', user: 'Admin Saúde', details: 'Adicionado aditivo de prazo' }
    ]
  }
];

export const useStore = create<AppState>((set) => ({
  user: null,
  currentView: 'login',
  contracts: generateMockContracts(),
  searchQuery: '',
  filterStatus: 'All',
  selectedContractId: null,

  login: (email) => set({
    user: {
      id: 'u1',
      name: 'Admin Saúde',
      email: email,
      avatar: 'https://picsum.photos/100/100'
    },
    currentView: 'dashboard'
  }),

  logout: () => set({ user: null, currentView: 'login' }),

  setView: (view) => set({ currentView: view }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setFilterStatus: (status) => set({ filterStatus: status }),

  addContract: (contractData) => set((state) => ({
    contracts: [
      {
        ...contractData,
        id: Math.random().toString(36).substr(2, 9),
        lastUpdate: new Date().toISOString(),
        history: [{
          id: Math.random().toString(36).substr(2, 9),
          date: new Date().toISOString(),
          action: 'Criação',
          user: state.user?.name || 'Sistema',
          details: 'Contrato criado no sistema'
        }]
      },
      ...state.contracts
    ]
  })),

  updateContract: (id, data) => set((state) => ({
    contracts: state.contracts.map((c) => 
      c.id === id ? { 
        ...c, 
        ...data, 
        lastUpdate: new Date().toISOString(),
        history: [
          ...(c.history || []),
          {
            id: Math.random().toString(36).substr(2, 9),
            date: new Date().toISOString(),
            action: 'Edição',
            user: state.user?.name || 'Sistema',
            details: 'Dados do contrato atualizados'
          }
        ]
      } : c
    )
  })),

  deleteContract: (id) => set((state) => ({
    contracts: state.contracts.filter((c) => c.id !== id)
  })),

  setSelectedContractId: (id) => set({ selectedContractId: id })
}));
