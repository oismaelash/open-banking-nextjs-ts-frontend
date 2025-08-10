'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  ArrowLeft,
  CreditCard,
  PiggyBank,
  TrendingUp,
  Wallet,
  DollarSign,
  Calendar,
  Download,
  Filter,
  Search,
  Eye,
  EyeOff,
  RefreshCw,
  BarChart3,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Share2,
  Settings,
  Lock,
  Unlock
} from 'lucide-react';

// Types
interface Account {
  id: string;
  type: 'checking' | 'savings' | 'investment';
  name: string;
  number: string;
  balance: number;
  availableBalance: number;
  status: 'active' | 'blocked' | 'suspended';
  bank: string;
  lastUpdated: string;
  openingDate: string;
  interestRate?: number;
  monthlyFee?: number;
  dailyLimit: number;
  monthlyLimit: number;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'credit' | 'debit';
  status: 'completed' | 'pending' | 'failed';
  merchant?: string;
  accountId: string;
}

// Mock data
const mockAccounts: Account[] = [
  {
    id: '1',
    type: 'checking',
    name: 'Conta Corrente Principal',
    number: '****1234',
    balance: 15420.50,
    availableBalance: 15200.00,
    status: 'active',
    bank: 'Banco do Brasil',
    lastUpdated: '2024-01-15T10:30:00Z',
    openingDate: '2020-03-15T00:00:00Z',
    monthlyFee: 0.00,
    dailyLimit: 10000,
    monthlyLimit: 50000
  },
  {
    id: '2',
    type: 'savings',
    name: 'Conta Poupança',
    number: '****5678',
    balance: 25000.00,
    availableBalance: 25000.00,
    status: 'active',
    bank: 'Banco do Brasil',
    lastUpdated: '2024-01-15T10:30:00Z',
    openingDate: '2019-06-20T00:00:00Z',
    interestRate: 0.5,
    dailyLimit: 50000,
    monthlyLimit: 200000
  },
  {
    id: '3',
    type: 'investment',
    name: 'Conta Investimento',
    number: '****9012',
    balance: 75000.00,
    availableBalance: 75000.00,
    status: 'active',
    bank: 'Itaú',
    lastUpdated: '2024-01-15T10:30:00Z',
    openingDate: '2021-01-10T00:00:00Z',
    interestRate: 1.2,
    dailyLimit: 100000,
    monthlyLimit: 500000
  }
];

const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: '2024-01-15T14:30:00Z',
    description: 'Pagamento PIX - João Silva',
    category: 'Transferência',
    amount: 150.00,
    type: 'debit',
    status: 'completed',
    merchant: 'João Silva',
    accountId: '1'
  },
  {
    id: '2',
    date: '2024-01-15T12:15:00Z',
    description: 'Depósito - Salário',
    category: 'Salário',
    amount: 5000.00,
    type: 'credit',
    status: 'completed',
    accountId: '1'
  },
  {
    id: '3',
    date: '2024-01-14T18:45:00Z',
    description: 'Compra Cartão - Supermercado',
    category: 'Alimentação',
    amount: 89.50,
    type: 'debit',
    status: 'completed',
    merchant: 'Supermercado ABC',
    accountId: '1'
  },
  {
    id: '4',
    date: '2024-01-14T10:20:00Z',
    description: 'Transferência entre contas',
    category: 'Transferência',
    amount: 1000.00,
    type: 'debit',
    status: 'completed',
    accountId: '1'
  },
  {
    id: '5',
    date: '2024-01-13T16:30:00Z',
    description: 'Pagamento PIX - Maria Santos',
    category: 'Transferência',
    amount: 250.00,
    type: 'credit',
    status: 'completed',
    merchant: 'Maria Santos',
    accountId: '1'
  },
  {
    id: '6',
    date: '2024-01-13T09:15:00Z',
    description: 'Rendimento Poupança',
    category: 'Rendimento',
    amount: 125.00,
    type: 'credit',
    status: 'completed',
    accountId: '2'
  },
  {
    id: '7',
    date: '2024-01-12T14:20:00Z',
    description: 'Aplicação CDB',
    category: 'Investimento',
    amount: 5000.00,
    type: 'debit',
    status: 'completed',
    accountId: '3'
  }
];

export default function AccountsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('30d');
  const [showBalances, setShowBalances] = useState(true);
  const [showAccountDetails, setShowAccountDetails] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    const authToken = localStorage.getItem('authToken');
    const consentData = localStorage.getItem('consentData');

    if (!authToken || !consentData) {
      router.push('/login');
      return;
    }

    // Load mock data
    setAccounts(mockAccounts);
    setTransactions(mockTransactions);

    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);
  }, [router]);

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const totalAvailable = accounts.reduce((sum, account) => sum + account.availableBalance, 0);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (transaction.merchant && transaction.merchant.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesAccount = selectedAccount === 'all' || transaction.accountId === selectedAccount;
    
    return matchesSearch && matchesAccount;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'checking': return <CreditCard className="w-5 h-5" />;
      case 'savings': return <PiggyBank className="w-5 h-5" />;
      case 'investment': return <TrendingUp className="w-5 h-5" />;
      default: return <Wallet className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'blocked': return 'text-red-600 bg-red-100';
      case 'suspended': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTransactionIcon = (type: string) => {
    return type === 'credit' ? 
      <CheckCircle className="w-4 h-4 text-green-600" /> : 
      <XCircle className="w-4 h-4 text-red-600" />;
  };

  const downloadStatement = (accountId: string) => {
    // Simulate download
    const account = accounts.find(a => a.id === accountId);
    const accountTransactions = transactions.filter(t => t.accountId === accountId);
    
    const statementContent = `
      EXTRATO BANCÁRIO
      
      Conta: ${account?.name}
      Número: ${account?.number}
      Banco: ${account?.bank}
      Período: ${new Date().toLocaleDateString('pt-BR')}
      
      SALDO INICIAL: ${formatCurrency(account?.balance || 0)}
      
      TRANSAÇÕES:
      ${accountTransactions.map(t => 
        `${formatDate(t.date)} - ${t.description} - ${t.type === 'credit' ? '+' : '-'}${formatCurrency(t.amount)}`
      ).join('\n')}
      
      SALDO FINAL: ${formatCurrency(account?.balance || 0)}
    `;
    
    const blob = new Blob([statementContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `extrato-${account?.name}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-700">Carregando suas contas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
              <span className="text-gray-700">Voltar</span>
            </button>
            <div className="ml-6 flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Suas Contas</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-700">Saldo Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {showBalances ? formatCurrency(totalBalance) : '••••••'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowBalances(!showBalances)}
                className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                {showBalances ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-700">Disponível:</span>
              <span className="font-semibold text-green-600">
                {showBalances ? formatCurrency(totalAvailable) : '••••••'}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-700">Contas Ativas</p>
                <p className="text-2xl font-bold text-gray-900">{accounts.length}</p>
              </div>
            </div>
            <div className="text-sm text-gray-700">
              {accounts.filter(a => a.status === 'active').length} contas disponíveis
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-700">Transações Hoje</p>
                <p className="text-2xl font-bold text-gray-900">
                  {transactions.filter(t => 
                    new Date(t.date).toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-700">
              Última atualização: {new Date().toLocaleTimeString('pt-BR')}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-700">Rendimento Mensal</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(accounts.reduce((sum, account) => sum + (account.balance * 0.005), 0))}
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-700">
              Baseado no saldo atual
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Accounts List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Todas as Contas</h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  + Nova Conta
                </button>
              </div>
              
              <div className="space-y-4">
                {accounts.map((account) => (
                  <div key={account.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          {getAccountIcon(account.type)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{account.name}</p>
                          <p className="text-sm text-gray-700">{account.number}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(account.status)}`}>
                        {account.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-700">Saldo</p>
                        <p className="font-semibold text-gray-900">
                          {showBalances ? formatCurrency(account.balance) : '••••••'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-700">Disponível</p>
                        <p className="font-semibold text-green-600">
                          {showBalances ? formatCurrency(account.availableBalance) : '••••••'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                      <span>Última atualização: {formatDate(account.lastUpdated)}</span>
                      <span>Banco: {account.bank}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setShowAccountDetails(showAccountDetails === account.id ? null : account.id)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                      >
                        <span>Detalhes</span>
                        {showAccountDetails === account.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => downloadStatement(account.id)}
                        className="text-green-600 hover:text-green-700 text-sm font-medium"
                      >
                        Extrato
                      </button>
                    </div>

                    {showAccountDetails === account.id && (
                      <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-700">Data de Abertura:</span>
                          <span className="text-gray-900">{formatDate(account.openingDate)}</span>
                        </div>
                        {account.interestRate && (
                          <div className="flex justify-between">
                            <span className="text-gray-700">Taxa de Juros:</span>
                            <span className="text-gray-900">{account.interestRate}%</span>
                          </div>
                        )}
                        {account.monthlyFee && (
                          <div className="flex justify-between">
                            <span className="text-gray-700">Taxa Mensal:</span>
                            <span className="text-gray-900">{formatCurrency(account.monthlyFee)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-700">Limite Mensal:</span>
                          <span className="text-gray-900">{formatCurrency(account.monthlyLimit)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Transactions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Histórico de Transações</h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Ver todas
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Buscar transações..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Todas as contas</option>
                  {accounts.map(account => (
                    <option key={account.id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
                </select>
                
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="7d">Últimos 7 dias</option>
                  <option value="30d">Últimos 30 dias</option>
                  <option value="90d">Últimos 90 dias</option>
                </select>
              </div>

              {/* Transactions List */}
              <div className="space-y-4">
                {filteredTransactions.slice(0, 10).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-700">
                          <span>{transaction.category}</span>
                          <span>•</span>
                          <span>{formatDate(transaction.date)}</span>
                          {transaction.merchant && (
                            <>
                              <span>•</span>
                              <span>{transaction.merchant}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className={`font-semibold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${transaction.status === 'completed' ? 'bg-green-100 text-green-800' : transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {filteredTransactions.length === 0 && (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-700">Nenhuma transação encontrada</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 