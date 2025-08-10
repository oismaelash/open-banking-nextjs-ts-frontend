'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  ArrowLeft,
  QrCode,
  Camera,
  User,
  Mail,
  Phone,
  CreditCard,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Shield,
  Eye,
  EyeOff,
  Plus,
  Minus,
  DollarSign,
  Search,
  Filter,
  Download,
  Share2,
  Copy,
  RefreshCw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// Types
interface PIXKey {
  type: 'cpf' | 'cnpj' | 'email' | 'phone' | 'random';
  value: string;
  name: string;
  bank: string;
}

interface PaymentForm {
  pixKey: string;
  pixKeyType: 'cpf' | 'cnpj' | 'email' | 'phone' | 'random';
  recipientName: string;
  amount: string;
  description: string;
  scheduledDate: string;
  category: string;
  accountId: string;
}

interface Account {
  id: string;
  name: string;
  balance: number;
  availableBalance: number;
  type: string;
  bank: string;
}

// Mock data
const mockAccounts: Account[] = [
  {
    id: '1',
    name: 'Conta Corrente Principal',
    balance: 15420.50,
    availableBalance: 15200.00,
    type: 'checking',
    bank: 'Banco do Brasil'
  },
  {
    id: '2',
    name: 'Conta Poupança',
    balance: 25000.00,
    availableBalance: 25000.00,
    type: 'savings',
    bank: 'Banco do Brasil'
  }
];

const mockPIXContacts: PIXKey[] = [
  {
    type: 'phone',
    value: '+55 11 99999-9999',
    name: 'João Silva',
    bank: 'Banco do Brasil'
  },
  {
    type: 'email',
    value: 'maria@email.com',
    name: 'Maria Santos',
    bank: 'Itaú'
  },
  {
    type: 'cpf',
    value: '123.456.789-00',
    name: 'Pedro Costa',
    bank: 'Bradesco'
  }
];

export default function PIXPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  const [showContacts, setShowContacts] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [pixContacts, setPixContacts] = useState<PIXKey[]>([]);
  const [selectedContact, setSelectedContact] = useState<PIXKey | null>(null);
  const [formData, setFormData] = useState<PaymentForm>({
    pixKey: '',
    pixKeyType: 'cpf',
    recipientName: '',
    amount: '',
    description: '',
    scheduledDate: '',
    category: 'transfer',
    accountId: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAmount, setShowAmount] = useState(true);
  const [dailyLimit, setDailyLimit] = useState(10000);
  const [usedLimit, setUsedLimit] = useState(2500);
  const [remainingLimit, setRemainingLimit] = useState(7500);

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
    setPixContacts(mockPIXContacts);
    if (mockAccounts.length > 0) {
      setFormData(prev => ({ ...prev, accountId: mockAccounts[0].id }));
    }

    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);
  }, [router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.pixKey) {
      newErrors.pixKey = 'Chave PIX é obrigatória';
    }

    if (!formData.recipientName) {
      newErrors.recipientName = 'Nome do destinatário é obrigatório';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Valor deve ser maior que zero';
    } else if (parseFloat(formData.amount) > remainingLimit) {
      newErrors.amount = `Valor excede o limite diário disponível (${formatCurrency(remainingLimit)})`;
    }

    if (!formData.accountId) {
      newErrors.accountId = 'Selecione uma conta';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      // Redirect to payment status page with the payment ID
      router.push(`/dashboard/payment-status?id=PIX${Date.now()}`);
    }, 2000);
  };

  const handlePIXKeyTypeChange = (type: string) => {
    setFormData(prev => ({ ...prev, pixKeyType: type as any, pixKey: '' }));
    setErrors(prev => ({ ...prev, pixKey: '' }));
  };

  const handleContactSelect = (contact: PIXKey) => {
    setSelectedContact(contact);
    setFormData(prev => ({
      ...prev,
      pixKey: contact.value,
      pixKeyType: contact.type,
      recipientName: contact.name
    }));
    setShowContacts(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getPIXKeyIcon = (type: string) => {
    switch (type) {
      case 'cpf':
      case 'cnpj':
        return <User className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'phone':
        return <Phone className="w-4 h-4" />;
      case 'random':
        return <CreditCard className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getPIXKeyPlaceholder = (type: string) => {
    switch (type) {
      case 'cpf':
        return '000.000.000-00';
      case 'cnpj':
        return '00.000.000/0000-00';
      case 'email':
        return 'exemplo@email.com';
      case 'phone':
        return '(00) 00000-0000';
      case 'random':
        return 'Chave aleatória';
      default:
        return 'Digite a chave PIX';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-700">Carregando...</p>
        </div>
      </div>
    );
  }

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                PIX Enviado com Sucesso!
              </h2>
              <p className="text-gray-700 mb-6">
                Seu pagamento PIX foi processado e enviado com sucesso.
              </p>
              
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Destinatário:</span>
                    <span className="font-semibold">{formData.recipientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Valor:</span>
                    <span className="font-semibold text-green-600">{formatCurrency(parseFloat(formData.amount))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Data/Hora:</span>
                    <span className="font-semibold">{new Date().toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">ID da Transação:</span>
                    <span className="font-mono text-sm">PIX{Date.now()}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Voltar ao Dashboard
                </button>
                <button
                  onClick={() => {
                    setShowConfirmation(false);
                    setFormData({
                      pixKey: '',
                      pixKeyType: 'cpf',
                      recipientName: '',
                      amount: '',
                      description: '',
                      scheduledDate: '',
                      category: 'transfer',
                      accountId: formData.accountId
                    });
                  }}
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-xl hover:bg-green-700 transition-colors"
                >
                  Novo PIX
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
              <span className="text-gray-700">Voltar</span>
            </button>
            <div className="ml-6 flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <QrCode className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Enviar PIX</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Dados do Pagamento</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* PIX Key Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Tipo de Chave PIX
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {[
                      { type: 'cpf', label: 'CPF', icon: <User className="w-4 h-4" /> },
                      { type: 'cnpj', label: 'CNPJ', icon: <User className="w-4 h-4" /> },
                      { type: 'email', label: 'E-mail', icon: <Mail className="w-4 h-4" /> },
                      { type: 'phone', label: 'Telefone', icon: <Phone className="w-4 h-4" /> },
                      { type: 'random', label: 'Aleatória', icon: <CreditCard className="w-4 h-4" /> }
                    ].map(({ type, label, icon }) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handlePIXKeyTypeChange(type)}
                        className={`p-3 rounded-xl border-2 transition-colors ${
                          formData.pixKeyType === type
                            ? 'border-green-600 bg-green-50 text-green-800'
                            : 'border-gray-200 hover:border-gray-300 text-gray-800'
                        }`}
                      >
                        <div className="flex flex-col items-center space-y-1 text-gray-800">
                          {icon}
                          <span className="text-xs font-medium">{label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* PIX Key Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chave PIX
                  </label>
                  <div className="flex space-x-3">
                    <div className="flex-1 relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        {getPIXKeyIcon(formData.pixKeyType)}
                      </div>
                      <input
                        type="text"
                        value={formData.pixKey}
                        onChange={(e) => setFormData(prev => ({ ...prev, pixKey: e.target.value }))}
                        placeholder={getPIXKeyPlaceholder(formData.pixKeyType)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-600 ${
                          errors.pixKey ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowQRScanner(true)}
                      className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowContacts(!showContacts)}
                      className="px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                    >
                      <User className="w-5 h-5" />
                    </button>
                  </div>
                  {errors.pixKey && (
                    <p className="mt-1 text-sm text-red-600">{errors.pixKey}</p>
                  )}
                </div>

                {/* Recipient Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Destinatário
                  </label>
                  <input
                    type="text"
                    value={formData.recipientName}
                    onChange={(e) => setFormData(prev => ({ ...prev, recipientName: e.target.value }))}
                    placeholder="Nome completo do destinatário"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-600 ${
                      errors.recipientName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.recipientName && (
                    <p className="mt-1 text-sm text-red-600">{errors.recipientName}</p>
                  )}
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <button
                        type="button"
                        onClick={() => setShowAmount(!showAmount)}
                        className="text-slate-400 hover:text-slate-600 text-gray-700"
                      >
                        {showAmount ? <EyeOff className="w-5 h-5 text-gray-700" /> : <Eye className="w-5 h-5 text-gray-700" />}
                      </button>
                    </div>
                    <input
                      type={showAmount ? "number" : "password"}
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="0,00"
                      step="0.01"
                      min="0"
                      className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-600 ${
                        errors.amount ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.amount && (
                    <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição (opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descrição do pagamento"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-600"
                  />
                </div>

                {/* Account Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Conta de Origem
                  </label>
                  <select
                    value={formData.accountId}
                    onChange={(e) => setFormData(prev => ({ ...prev, accountId: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.accountId ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Selecione uma conta</option>
                    {accounts.map(account => (
                      <option key={account.id} value={account.id}>
                        {account.name} - {formatCurrency(account.availableBalance)}
                      </option>
                    ))}
                  </select>
                  {errors.accountId && (
                    <p className="mt-1 text-sm text-red-600">{errors.accountId}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-green-600 text-white py-4 px-6 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin text-white" />
                      <span className="text-white">Processando...</span>
                    </>
                  ) : (
                    <>
                      <QrCode className="w-5 h-5 text-white" />
                      <span className="text-white">Enviar PIX</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Limits Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Limites Diários</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-800 font-medium">Limite Total</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(dailyLimit)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${(usedLimit / dailyLimit) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-800 font-medium">Utilizado</span>
                  <span className="text-red-600 font-semibold">{formatCurrency(usedLimit)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-800 font-medium">Disponível</span>
                  <span className="text-green-600 font-semibold">{formatCurrency(remainingLimit)}</span>
                </div>
              </div>
            </div>

            {/* Security Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Segurança</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-800 font-medium">Autenticação biométrica</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-800 font-medium">Criptografia SSL</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-800 font-medium">Monitoramento 24h</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowQRGenerator(true)}
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <QrCode className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-900 font-medium">Gerar QR Code</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <Download className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-900 font-medium">Histórico PIX</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <Share2 className="w-5 h-5 text-purple-600" />
                  <span className="text-sm text-gray-900 font-medium">Compartilhar</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contacts Modal */}
        {showContacts && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Contatos PIX</h3>
                <button
                  onClick={() => setShowContacts(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-3">
                {pixContacts.map((contact, index) => (
                  <button
                    key={index}
                    onClick={() => handleContactSelect(contact)}
                    className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      {getPIXKeyIcon(contact.type)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{contact.name}</p>
                      <p className="text-sm text-gray-700">{contact.value}</p>
                    </div>
                    <div className="text-xs text-gray-600">{contact.bank}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* QR Scanner Modal */}
        {showQRScanner && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Escanear QR Code</h3>
                <button
                  onClick={() => setShowQRScanner(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center">
                  <Camera className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                  <p className="text-gray-700">Funcionalidade de câmera em desenvolvimento</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* QR Generator Modal */}
        {showQRGenerator && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Gerar QR Code</h3>
                <button
                  onClick={() => setShowQRGenerator(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center">
                  <QrCode className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                  <p className="text-gray-700">QR Code será gerado aqui</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 