
export enum ContractStatus {
  ACTIVE = 'Ativo',
  PENDING = 'Pendente',
  EXPIRED = 'Vencido',
  CONCLUDED = 'Concluído'
}

export interface ContractHistoryItem {
  id: string;
  date: string;
  action: string;
  user: string;
  details: string;
}

export interface Contract {
  id: string;
  title: string;
  provider: string;
  contractNumber: string;
  value: number;
  startDate: string;
  endDate: string;
  status: ContractStatus;
  description: string;
  lastUpdate: string;
  attachments?: string[];
  history?: ContractHistoryItem[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export type ViewState = 'login' | 'dashboard' | 'contracts' | 'settings' | 'contract-details';

export interface ContractStats {
  total: number;
  active: number;
  expired: number;
  pending: number;
  concluded: number;
  totalValue: number;
  expiringSoon: number;
}
