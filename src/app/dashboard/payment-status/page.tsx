'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Building2, 
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Download,
  Share2,
  Copy,
  RefreshCw,
  Phone,
  Mail,
  MessageCircle,
  Shield,
  Eye,
  EyeOff,
  Calendar,
  DollarSign,
  User,
  QrCode,
  FileText,
  Printer,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// Types
interface PaymentStatus {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  amount: number;
  recipientName: string;
  pixKey: string;
  pixKeyType: string;
  description: string;
  category: string;
  initiatedAt: string;
  processedAt?: string;
  completedAt?: string;
  failedAt?: string;
  errorCode?: string;
  errorMessage?: string;
  fee: number;
  accountId: string;
  bank: string;
}

interface TimelineStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
  timestamp?: string;
  icon: React.ReactNode;
}

// Mock data
const mockPaymentStatus: PaymentStatus = {
  id: 'PIX123456789',
  status: 'completed',
  amount: 150.00,
  recipientName: 'João Silva',
  pixKey: '+55 11 99999-9999',
  pixKeyType: 'phone',
  description: 'Pagamento para João Silva',
  category: 'Transferência',
  initiatedAt: '2024-01-15T14:30:00Z',
  processedAt: '2024-01-15T14:30:15Z',
  completedAt: '2024-01-15T14:30:30Z',
  fee: 0.00,
  accountId: '1',
  bank: 'Banco do Brasil'
};

export default function PaymentStatusPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showSecurityDetails, setShowSecurityDetails] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [showAmount, setShowAmount] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const authToken = localStorage.getItem('authToken');
    const consentData = localStorage.getItem('consentData');

    if (!authToken || !consentData) {
      router.push('/login');
      return;
    }

    // Get payment ID from URL params or use mock data
    const paymentId = searchParams.get('id') || 'PIX123456789';
    
    // Load mock data
    setPaymentStatus(mockPaymentStatus);

    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);
  }, [router, searchParams]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-8 h-8 text-green-600" />;
      case 'pending':
        return <Clock className="w-8 h-8 text-yellow-600" />;
      case 'processing':
        return <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />;
      case 'failed':
      case 'cancelled':
        return <XCircle className="w-8 h-8 text-red-600" />;
      default:
        return <AlertCircle className="w-8 h-8 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'failed':
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'PIX Enviado com Sucesso';
      case 'pending':
        return 'Aguardando Processamento';
      case 'processing':
        return 'Processando Pagamento';
      case 'failed':
        return 'Pagamento Falhou';
      case 'cancelled':
        return 'Pagamento Cancelado';
      default:
        return 'Status Desconhecido';
    }
  };

  const getTimelineSteps = (): TimelineStep[] => {
    if (!paymentStatus) return [];

    const steps: TimelineStep[] = [
      {
        id: 'initiated',
        title: 'Pagamento Iniciado',
        description: 'PIX foi enviado para processamento',
        status: 'completed',
        timestamp: paymentStatus.initiatedAt,
        icon: <Clock className="w-5 h-5" />
      }
    ];

    if (paymentStatus.processedAt) {
      steps.push({
        id: 'processed',
        title: 'Validado pelo Banco',
        description: 'Dados validados e aprovados',
        status: 'completed',
        timestamp: paymentStatus.processedAt,
        icon: <Shield className="w-5 h-5" />
      });
    }

    if (paymentStatus.completedAt) {
      steps.push({
        id: 'completed',
        title: 'Transferência Concluída',
        description: 'Valor transferido com sucesso',
        status: 'completed',
        timestamp: paymentStatus.completedAt,
        icon: <CheckCircle className="w-5 h-5" />
      });
    } else if (paymentStatus.failedAt) {
      steps.push({
        id: 'failed',
        title: 'Falha na Transferência',
        description: paymentStatus.errorMessage || 'Erro durante o processamento',
        status: 'completed',
        timestamp: paymentStatus.failedAt,
        icon: <XCircle className="w-5 h-5" />
      });
    } else if (paymentStatus.status === 'processing') {
      steps.push({
        id: 'processing',
        title: 'Processando PIX',
        description: 'Transferência em andamento',
        status: 'current',
        icon: <RefreshCw className="w-5 h-5 animate-spin" />
      });
    } else if (paymentStatus.status === 'pending') {
      steps.push({
        id: 'pending',
        title: 'Aguardando Processamento',
        description: 'Pagamento na fila de processamento',
        status: 'current',
        icon: <Clock className="w-5 h-5" />
      });
    }

    return steps;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const downloadReceipt = () => {
    // Simulate download
    const receiptContent = `
      COMPROVANTE DE PAGAMENTO PIX
      
      ID da Transação: ${paymentStatus?.id}
      Data/Hora: ${paymentStatus?.completedAt ? formatDate(paymentStatus.completedAt) : 'N/A'}
      Valor: ${paymentStatus ? formatCurrency(paymentStatus.amount) : 'N/A'}
      Destinatário: ${paymentStatus?.recipientName}
      Chave PIX: ${paymentStatus?.pixKey}
      Descrição: ${paymentStatus?.description}
      Taxa: ${paymentStatus ? formatCurrency(paymentStatus.fee) : 'N/A'}
      Status: ${paymentStatus ? getStatusText(paymentStatus.status) : 'N/A'}
    `;
    
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comprovante-pix-${paymentStatus?.id}.txt`;
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
          <p className="text-gray-600">Carregando status do pagamento...</p>
        </div>
      </div>
    );
  }

  if (!paymentStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Pagamento não encontrado
            </h2>
            <p className="text-gray-600 mb-6">
              O pagamento solicitado não foi encontrado ou não existe.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Voltar ao Dashboard
            </button>
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
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar</span>
            </button>
            <div className="ml-6 flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Status do Pagamento</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Overview */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              {getStatusIcon(paymentStatus.status)}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {getStatusText(paymentStatus.status)}
                </h2>
                <p className="text-gray-600">ID: {paymentStatus.id}</p>
              </div>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(paymentStatus.status)}`}>
              {paymentStatus.status.toUpperCase()}
            </span>
          </div>

          {/* Amount Display */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valor Transferido</p>
                <p className="text-3xl font-bold text-gray-900">
                  {showAmount ? formatCurrency(paymentStatus.amount) : '••••••'}
                </p>
              </div>
              <button
                onClick={() => setShowAmount(!showAmount)}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                {showAmount ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {paymentStatus.fee > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                Taxa: {formatCurrency(paymentStatus.fee)}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowReceipt(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Comprovante</span>
            </button>
            <button
              onClick={() => copyToClipboard(paymentStatus.id)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Copy className="w-4 h-4" />
              <span>Copiar ID</span>
            </button>
            <button
              onClick={() => setShowReceipt(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Compartilhar</span>
            </button>
            {paymentStatus.status === 'failed' && (
              <button
                onClick={() => setShowSupport(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Suporte</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Transaction Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Detalhes da Transação</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Destinatário</span>
                  <span className="font-semibold">{paymentStatus.recipientName}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Chave PIX</span>
                  <span className="font-semibold">{paymentStatus.pixKey}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Tipo de Chave</span>
                  <span className="font-semibold capitalize">{paymentStatus.pixKeyType}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Descrição</span>
                  <span className="font-semibold">{paymentStatus.description}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Categoria</span>
                  <span className="font-semibold">{paymentStatus.category}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Banco</span>
                  <span className="font-semibold">{paymentStatus.bank}</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-gray-600">Data de Início</span>
                  <span className="font-semibold">{formatDate(paymentStatus.initiatedAt)}</span>
                </div>
                {paymentStatus.completedAt && (
                  <div className="flex justify-between py-3 border-t border-gray-100">
                    <span className="text-gray-600">Data de Conclusão</span>
                    <span className="font-semibold">{formatDate(paymentStatus.completedAt)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Progresso da Transação</h3>
              
              <div className="space-y-6">
                {getTimelineSteps().map((step, index) => (
                  <div key={step.id} className="flex items-start space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.status === 'completed' ? 'bg-green-600' : 
                      step.status === 'current' ? 'bg-blue-600' : 'bg-gray-300'
                    }`}>
                      {step.status === 'completed' ? (
                        <CheckCircle className="w-5 h-5 text-white" />
                      ) : step.status === 'current' ? (
                        step.icon
                      ) : (
                        <Clock className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{step.title}</h4>
                      <p className="text-gray-600">{step.description}</p>
                      {step.timestamp && (
                        <p className="text-sm text-gray-500 mt-1">{formatDate(step.timestamp)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Security Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Informações de Segurança</h3>
                <button
                  onClick={() => setShowSecurityDetails(!showSecurityDetails)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showSecurityDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>
              
              {showSecurityDetails && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-700">Autenticação biométrica</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-700">Criptografia SSL</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-700">Monitoramento 24h</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-4">
                    <p>IP: 192.168.1.100</p>
                    <p>Dispositivo: iPhone 15</p>
                    <p>Localização: São Paulo, SP</p>
                  </div>
                </div>
              )}
            </div>

            {/* Support */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Suporte</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-sm">Chat ao Vivo</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <Phone className="w-5 h-5 text-green-600" />
                  <span className="text-sm">0800 123 4567</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <Mail className="w-5 h-5 text-purple-600" />
                  <span className="text-sm">suporte@banco.com</span>
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
              <div className="space-y-3">
                <button
                  onClick={downloadReceipt}
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="text-sm">Comprovante PDF</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <Printer className="w-5 h-5 text-green-600" />
                  <span className="text-sm">Imprimir</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <QrCode className="w-5 h-5 text-purple-600" />
                  <span className="text-sm">QR Code do Comprovante</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Receipt Modal */}
      {showReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Comprovante de Pagamento</h3>
              <button
                onClick={() => setShowReceipt(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID:</span>
                    <span className="font-mono">{paymentStatus.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Valor:</span>
                    <span className="font-semibold">{formatCurrency(paymentStatus.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Destinatário:</span>
                    <span>{paymentStatus.recipientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data:</span>
                    <span>{paymentStatus.completedAt ? formatDate(paymentStatus.completedAt) : formatDate(paymentStatus.initiatedAt)}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={downloadReceipt}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Baixar
                </button>
                <button
                  onClick={() => copyToClipboard(paymentStatus.id)}
                  className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Copiar ID
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Support Modal */}
      {showSupport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Suporte</h3>
              <button
                onClick={() => setShowSupport(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">
                Seu pagamento falhou. Entre em contato conosco para obter ajuda.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium">Telefone</p>
                    <p className="text-sm text-gray-600">0800 123 4567</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">E-mail</p>
                    <p className="text-sm text-gray-600">suporte@banco.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Chat</p>
                    <p className="text-sm text-gray-600">Disponível 24h</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 