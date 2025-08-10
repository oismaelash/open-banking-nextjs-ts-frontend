'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  CreditCard, 
  TrendingUp, 
  ArrowRight, 
  DollarSign, 
  Wallet, 
  PiggyBank,
  BarChart3,
  Clock,
  Search,
  Download,
  Bell,
  Settings,
  Shield,
  Eye,
  EyeOff,
  Plus,
  Filter,
  Calendar,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Copy
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

interface BalanceData {
  date: string;
  balance: number;
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
    lastUpdated: '2024-01-15T10:30:00Z'
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
    lastUpdated: '2024-01-15T10:30:00Z'
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
    lastUpdated: '2024-01-15T10:30:00Z'
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
  }
];

const mockBalanceData: BalanceData[] = [
  { date: '2024-01-10', balance: 12000 },
  { date: '2024-01-11', balance: 12500 },
  { date: '2024-01-12', balance: 11800 },
  { date: '2024-01-13', balance: 12200 },
  { date: '2024-01-14', balance: 13100 },
  { date: '2024-01-15', balance: 15420 }
];

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [showBalances, setShowBalances] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('7d');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balanceData, setBalanceData] = useState<BalanceData[]>([]);

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
    setBalanceData(mockBalanceData);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-700">Carregando seu dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Open Banking Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-700 hover:text-gray-900 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-700 hover:text-gray-900 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('authToken');
                  localStorage.removeItem('consentData');
                  router.push('/');
                }}
                className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Olá! Bem-vindo ao seu Dashboard
          </h2>
          <p className="text-gray-700">
            Gerencie suas contas, visualize transações e realize pagamentos PIX
          </p>
        </div>

        {/* Account Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <button 
            onClick={() => router.push('/dashboard/pix')}
            className="bg-green-600 text-white p-4 rounded-2xl hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Enviar PIX</span>
          </button>
          <button className="bg-blue-600 text-white p-4 rounded-2xl hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
            <ArrowRight className="w-5 h-5" />
            <span>Transferir</span>
          </button>
          <button className="bg-purple-600 text-white p-4 rounded-2xl hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2">
            <Download className="w-5 h-5" />
            <span>Extrato</span>
          </button>
          <button 
            onClick={() => router.push('/dashboard/consent')}
            className="bg-orange-600 text-white p-4 rounded-2xl hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Shield className="w-5 h-5" />
            <span>Consentimento</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Accounts List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Suas Contas</h3>
                <button 
                  onClick={() => router.push('/dashboard/accounts')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Ver todas
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
                    
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-600 font-medium">{account.bank}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Transações Recentes</h3>
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
                {filteredTransactions.slice(0, 5).map((transaction) => (
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

        {/* Balance Chart Section */}
        <div className="mt-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Evolução do Saldo</h3>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-slate-600 hover:text-slate-900 transition-colors">
                  <RefreshCw className="w-4 h-4 text-gray-700" />
                </button>
                <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
                  <option value="7d">7 dias</option>
                  <option value="30d">30 dias</option>
                  <option value="90d">90 dias</option>
                </select>
              </div>
            </div>
            
            {/* Simple Chart Representation */}
            <div className="h-64 bg-gray-50 rounded-lg flex items-end justify-between p-4">
              {balanceData.map((data, index) => (
                <div key={index} className="flex flex-col items-center space-y-2">
                  <div 
                    className="bg-blue-600 rounded-t w-8 transition-all hover:bg-blue-700"
                    style={{ height: `${(data.balance / Math.max(...balanceData.map(d => d.balance))) * 200}px` }}
                  ></div>
                  <span className="text-xs text-gray-700">{new Date(data.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-700">
                Saldo atual: <span className="font-semibold text-gray-900">{formatCurrency(totalBalance)}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Consent Management Section */}
        <div className="mt-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Consent Management</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Manage your data sharing permissions
            </p>
            <button 
              onClick={() => router.push('/dashboard/consent')}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Manage Consent
            </button>
          </div>
        </div>
      </main>
    </div>
  );
} 