import React, { useState } from 'react';
import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  History,
  Plus,
  AlertCircle,
  Eye,
  EyeOff,
  Copy,
  ChevronRight,
  Landmark
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [showBalance, setShowBalance] = useState(true);
  const [topUpError, setTopUpError] = useState<string | null>(null);

  const handleTopUp = () => {
    setTopUpError('Top-up service is currently unavailable. Please try again later.');
    setTimeout(() => setTopUpError(null), 5000);
  };

  const copyAccountId = () => {
    if (user?.accountId) {
      navigator.clipboard.writeText(user.accountId);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.fullName?.split(' ')[0]}!</h1>
            <p className="text-gray-500">Here's what's happening with your account today.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <History className="w-4 h-4 mr-2" />
              Recent Activity
            </Button>
            <Button size="sm" onClick={handleTopUp}>
              <Plus className="w-4 h-4 mr-2" />
              Top Up Balance
            </Button>
          </div>
        </div>

        {topUpError && (
          <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{topUpError}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Account Card */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-bank-700 text-white border-none shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Wallet className="w-32 h-32" />
              </div>
              <div className="relative z-10 space-y-8">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-bank-100 text-sm font-medium mb-1 uppercase tracking-wider">Account Overview</p>
                    <div className="flex items-center gap-2">
                      <h2 className="text-3xl font-bold">Nova Checking</h2>
                      <button onClick={() => setShowBalance(!showBalance)} className="hover:text-bank-200">
                        {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-bank-100 text-sm mb-1">Account ID</p>
                    <button
                      onClick={copyAccountId}
                      className="flex items-center gap-2 bg-bank-600/30 hover:bg-bank-600/50 px-3 py-1.5 rounded-lg text-sm transition-colors group"
                    >
                      {user?.accountId}
                      <Copy className="w-3 h-3 group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <p className="text-bank-100 text-sm mb-1 uppercase tracking-wider">Available Balance</p>
                  <div className="text-5xl font-bold">
                    {showBalance ? formatCurrency(user?.accountBalance || 0) : '••••••'}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button variant="secondary" size="sm" className="bg-white text-bank-700 hover:bg-gray-100">
                    <ArrowUpRight className="w-4 h-4 mr-2" />
                    Send
                  </Button>
                  <Button variant="outline" size="sm" className="border-bank-400 text-white hover:bg-bank-600">
                    <ArrowDownLeft className="w-4 h-4 mr-2" />
                    Receive
                  </Button>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: <CreditCard />, label: 'Cards' },
                { icon: <History />, label: 'History' },
                { icon: <Wallet />, label: 'Savings' },
                { icon: <Plus />, label: 'Payments' },
              ].map((action, i) => (
                <button key={i} className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-bank-200 transition-all group">
                  <div className="bg-bank-50 p-3 rounded-full text-bank-600 group-hover:bg-bank-100 group-hover:scale-110 transition-all">
                    {action.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{action.label}</span>
                </button>
              ))}
            </div>

            {/* Recent Transactions */}
            <Card title="Recent Transactions" className="pb-0">
              <div className="divide-y divide-gray-100 -mx-6">
                <div className="px-6 py-12 text-center">
                  <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <History className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-gray-900 font-medium">No transactions yet</h3>
                  <p className="text-gray-500 text-sm mt-1">When you make your first transaction, it will appear here.</p>
                  <Button variant="outline" size="sm" className="mt-6" onClick={handleTopUp}>
                    Top up your account
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <Card title="Your Virtual Card">
              <div className="aspect-[1.58/1] w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-white flex flex-col justify-between shadow-lg mb-6">
                <div className="flex justify-between items-start">
                  <Landmark className="w-8 h-8 text-bank-400" />
                  <div className="w-10 h-8 bg-yellow-400/80 rounded flex items-center justify-center">
                    <div className="w-6 h-4 border border-yellow-600/50 rounded-sm"></div>
                  </div>
                </div>
                <div>
                  <div className="text-lg font-mono mb-4 tracking-[0.2em]">•••• •••• •••• ••••</div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase">Card Holder</p>
                      <p className="text-sm font-medium uppercase">{user?.fullName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase">Expires</p>
                      <p className="text-sm font-medium">08/29</p>
                    </div>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full">Manage Card Settings</Button>
            </Card>

            <Card title="Insights">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <ArrowDownLeft className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-green-700 font-medium">Monthly Income</p>
                      <p className="text-lg font-bold text-green-900">$0.00</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-100 p-2 rounded-full">
                      <ArrowUpRight className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <p className="text-xs text-red-700 font-medium">Monthly Expenses</p>
                      <p className="text-lg font-bold text-red-900">$0.00</p>
                    </div>
                  </div>
                </div>
                <div className="pt-2">
                  <a href="#" className="text-bank-600 text-sm font-medium flex items-center hover:underline">
                    View full spending analysis <ChevronRight className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DashboardPage;
