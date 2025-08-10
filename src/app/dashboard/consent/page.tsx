'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  ArrowLeft,
  Shield,
  Eye,
  EyeOff,
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  FileText,
  Settings,
  Lock,
  Unlock,
  Info,
  ChevronDown,
  ChevronUp,
  Trash2,
  Edit,
  Save,
  X
} from 'lucide-react';

// Types
interface ConsentScope {
  id: string;
  name: string;
  description: string;
  category: string;
  isGranted: boolean;
  isRequired: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  lastUpdated: string;
  expiresAt?: string;
}

interface ConsentHistory {
  id: string;
  action: 'granted' | 'revoked' | 'modified';
  scopeId: string;
  scopeName: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
}

// Mock data
const mockConsentScopes: ConsentScope[] = [
  {
    id: 'accounts',
    name: 'Informações de Contas',
    description: 'Acesso para visualizar informações básicas das suas contas bancárias, incluindo número da conta, tipo e status.',
    category: 'Account Information',
    isGranted: true,
    isRequired: true,
    riskLevel: 'low',
    lastUpdated: '2024-01-15T10:30:00Z'
  },
  {
    id: 'balances',
    name: 'Consultas de Saldo',
    description: 'Permissão para consultar saldos atuais e disponíveis de todas as suas contas.',
    category: 'Account Information',
    isGranted: true,
    isRequired: false,
    riskLevel: 'low',
    lastUpdated: '2024-01-15T10:30:00Z'
  },
  {
    id: 'transactions',
    name: 'Histórico de Transações',
    description: 'Acesso ao histórico completo de transações, incluindo valores, datas, descrições e categorias.',
    category: 'Transaction Data',
    isGranted: true,
    isRequired: false,
    riskLevel: 'medium',
    lastUpdated: '2024-01-15T10:30:00Z'
  },
  {
    id: 'payments',
    name: 'Iniciação de Pagamentos',
    description: 'Permissão para iniciar pagamentos PIX e transferências em seu nome.',
    category: 'Payment Initiation',
    isGranted: true,
    isRequired: false,
    riskLevel: 'high',
    lastUpdated: '2024-01-15T10:30:00Z'
  },
  {
    id: 'cards',
    name: 'Informações de Cartões',
    description: 'Acesso a informações sobre seus cartões de crédito e débito.',
    category: 'Card Information',
    isGranted: false,
    isRequired: false,
    riskLevel: 'medium',
    lastUpdated: '2024-01-15T10:30:00Z'
  },
  {
    id: 'investments',
    name: 'Dados de Investimentos',
    description: 'Informações sobre seus investimentos, aplicações e rendimentos.',
    category: 'Investment Data',
    isGranted: false,
    isRequired: false,
    riskLevel: 'medium',
    lastUpdated: '2024-01-15T10:30:00Z'
  }
];

const mockConsentHistory: ConsentHistory[] = [
  {
    id: '1',
    action: 'granted',
    scopeId: 'accounts',
    scopeName: 'Informações de Contas',
    timestamp: '2024-01-15T10:30:00Z',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)'
  },
  {
    id: '2',
    action: 'granted',
    scopeId: 'balances',
    scopeName: 'Consultas de Saldo',
    timestamp: '2024-01-15T10:30:00Z',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)'
  },
  {
    id: '3',
    action: 'granted',
    scopeId: 'transactions',
    scopeName: 'Histórico de Transações',
    timestamp: '2024-01-15T10:30:00Z',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)'
  },
  {
    id: '4',
    action: 'granted',
    scopeId: 'payments',
    scopeName: 'Iniciação de Pagamentos',
    timestamp: '2024-01-15T10:30:00Z',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)'
  }
];

export default function ConsentPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [consentScopes, setConsentScopes] = useState<ConsentScope[]>([]);
  const [consentHistory, setConsentHistory] = useState<ConsentHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showRiskInfo, setShowRiskInfo] = useState(false);
  const [editingScope, setEditingScope] = useState<string | null>(null);
  const [isRevoking, setIsRevoking] = useState(false);
  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);

  useEffect(() => {
    // Check if user is authenticated
    const authToken = localStorage.getItem('authToken');
    const consentData = localStorage.getItem('consentData');

    if (!authToken || !consentData) {
      router.push('/login');
      return;
    }

    // Load mock data
    setConsentScopes(mockConsentScopes);
    setConsentHistory(mockConsentHistory);

    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);
  }, [router]);

  const handleScopeToggle = (scopeId: string) => {
    if (editingScope === scopeId) {
      setEditingScope(null);
      return;
    }
    setEditingScope(scopeId);
  };

  const handleScopeChange = (scopeId: string, isGranted: boolean) => {
    setConsentScopes(prev => 
      prev.map(scope => 
        scope.id === scopeId 
          ? { ...scope, isGranted, lastUpdated: new Date().toISOString() }
          : scope
      )
    );
  };

  const handleRevokeSelected = async () => {
    if (selectedScopes.length === 0) return;

    setIsRevoking(true);

    // Simulate API call
    setTimeout(() => {
      setConsentScopes(prev => 
        prev.map(scope => 
          selectedScopes.includes(scope.id)
            ? { ...scope, isGranted: false, lastUpdated: new Date().toISOString() }
            : scope
        )
      );
      setSelectedScopes([]);
      setIsRevoking(false);
    }, 2000);
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'high':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskLevelText = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return 'Baixo Risco';
      case 'medium':
        return 'Médio Risco';
      case 'high':
        return 'Alto Risco';
      default:
        return 'Risco Desconhecido';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'granted':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'revoked':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'modified':
        return <Edit className="w-4 h-4 text-blue-600" />;
      default:
        return <Info className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const grantedScopes = consentScopes.filter(scope => scope.isGranted);
  const revokedScopes = consentScopes.filter(scope => !scope.isGranted);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-700">Carregando configurações de consentimento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
              <span className="text-gray-700">Voltar</span>
            </button>
            <div className="ml-6 flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Gerenciamento de Consentimento</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-sm text-gray-700">Permissões Ativas</p>
            <p className="text-2xl font-bold text-gray-900">
              {consentScopes.filter(scope => scope.isGranted).length}
            </p>
            <div className="text-sm text-gray-700">
              {consentScopes.filter(scope => scope.isGranted && !scope.isRequired).length} opcionais
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-sm text-gray-700">Permissões Revogadas</p>
            <p className="text-2xl font-bold text-gray-900">
              {consentScopes.filter(scope => !scope.isGranted).length}
            </p>
            <div className="text-sm text-gray-700">
              {consentScopes.filter(scope => !scope.isGranted && !scope.isRequired).length} opcionais
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-sm text-gray-700">Alto Risco</p>
            <p className="text-2xl font-bold text-gray-900">
              {consentScopes.filter(scope => scope.riskLevel === 'high').length}
            </p>
            <div className="text-sm text-gray-700">
              {consentScopes.filter(scope => scope.riskLevel === 'high' && scope.isGranted).length} ativas
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-sm text-gray-700">Última Atualização</p>
            <p className="text-2xl font-bold text-gray-900">
              {new Date().toLocaleDateString('pt-BR')}
            </p>
            <div className="text-sm text-gray-700">
              {new Date().toLocaleTimeString('pt-BR')}
            </div>
          </div>
        </div>

        {/* Risk Information */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                Importante: Seus Dados Estão Seguros
              </h3>
              <p className="text-yellow-800 mb-4">
                Você tem controle total sobre suas permissões. Pode revogar qualquer acesso a qualquer momento. 
                Todas as transações são monitoradas e protegidas por criptografia de ponta a ponta.
              </p>
              <button
                onClick={() => setShowRiskInfo(!showRiskInfo)}
                className="text-yellow-900 hover:text-yellow-950 font-semibold flex items-center space-x-1 underline"
              >
                <span className="text-gray-700">Saiba mais sobre segurança</span>
                {showRiskInfo ? <ChevronUp className="w-4 h-4 text-gray-700" /> : <ChevronDown className="w-4 h-4 text-gray-700" />}
              </button>
              
              {showRiskInfo && (
                <div className="mt-4 p-4 bg-white rounded-lg">
                  <div className="space-y-3 text-sm text-yellow-800">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span>Criptografia SSL/TLS em todas as comunicações</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span>Autenticação biométrica obrigatória</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span>Monitoramento 24/7 de transações suspeitas</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span>Conformidade com LGPD e regulamentações do Banco Central</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedScopes.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedScopes.length} permissão{selectedScopes.length > 1 ? 'ões' : ''} selecionada{selectedScopes.length > 1 ? 's' : ''}
                </h3>
                <p className="text-gray-700 font-medium">Revogar acesso às permissões selecionadas</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedScopes([])}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleRevokeSelected}
                  disabled={isRevoking}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isRevoking ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Revogando...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>Revogar Selecionadas</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Consent Scopes */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Permissões de Acesso</h3>
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Ver histórico
                </button>
              </div>
              
              <div className="space-y-4">
                {consentScopes.map((scope) => (
                  <div key={scope.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{scope.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(scope.riskLevel)}`}>
                            {getRiskLevelText(scope.riskLevel)}
                          </span>
                          {scope.isRequired && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Obrigatório
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700 text-sm mb-3">{scope.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-600">
                          <span>Última atualização: {formatDate(scope.lastUpdated)}</span>
                          <span>Categoria: {scope.category}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {!scope.isRequired && (
                          <input
                            type="checkbox"
                            checked={selectedScopes.includes(scope.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedScopes(prev => [...prev, scope.id]);
                              } else {
                                setSelectedScopes(prev => prev.filter(id => id !== scope.id));
                              }
                            }}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        )}
                        
                        {editingScope === scope.id ? (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleScopeChange(scope.id, !scope.isGranted)}
                              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                scope.isGranted
                                  ? 'bg-red-600 text-white hover:bg-red-700'
                                  : 'bg-green-600 text-white hover:bg-green-700'
                              }`}
                            >
                              {scope.isGranted ? 'Revogar' : 'Conceder'}
                            </button>
                            <button
                              onClick={() => setEditingScope(null)}
                              className="p-1 text-gray-500 hover:text-gray-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                              scope.isGranted
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {scope.isGranted ? 'Ativo' : 'Inativo'}
                            </span>
                            {!scope.isRequired && (
                              <button
                                onClick={() => handleScopeToggle(scope.id)}
                                className="p-1 text-slate-400 hover:text-slate-600"
                              >
                                <ChevronUp className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Consent History */}
            {showHistory && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Histórico de Alterações</h3>
                <div className="space-y-4">
                  {consentHistory.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      {getActionIcon(item.action)}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {item.action === 'granted' ? 'Permissão concedida' : 
                           item.action === 'revoked' ? 'Permissão revogada' : 
                           'Permissão modificada'}: {item.scopeName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatDate(item.timestamp)} • IP: {item.ipAddress}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <Download className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-900 font-medium">Exportar Dados</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <FileText className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-900 font-medium">Política de Privacidade</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <Settings className="w-5 h-5 text-purple-600" />
                  <span className="text-sm text-gray-900 font-medium">Configurações Avançadas</span>
                </button>
              </div>
            </div>

            {/* Security Status */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status de Segurança</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-700">Autenticação biométrica ativa</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-700">Criptografia SSL ativa</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-700">Monitoramento 24h ativo</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-700">Conformidade LGPD</span>
                </div>
              </div>
            </div>

            {/* Third-party App Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Aplicação Conectada</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-700">Nome da App</span>
                  <span className="font-semibold text-gray-900">Open Banking App</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-700">Desenvolvedor</span>
                  <span className="font-semibold text-gray-900">Open Banking Corp</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-700">Data de Conexão</span>
                  <span className="font-semibold text-gray-900">15/01/2024</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-gray-700">Último Acesso</span>
                  <span className="font-semibold text-gray-900">15/01/2024, 14:30</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 