'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { stripeApi } from '@/lib/api';

export default function SystemSettingsPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('general');

  // ── Payment settings state ──
  const [payPublicKey, setPayPublicKey] = useState('');
  const [paySecretKey, setPaySecretKey] = useState('');
  const [payWebhookSecret, setPayWebhookSecret] = useState('');
  const [payEnabled, setPayEnabled] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const [paySaving, setPaySaving] = useState(false);
  const [payMessage, setPayMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [payTestResult, setPayTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [payTesting, setPayTesting] = useState(false);

  // Redirect if not super admin
  useEffect(() => {
    if (user && user.role !== 'super_admin') {
      router.push('/admin');
    }
  }, [user, router]);

  useEffect(() => {
    if (activeTab === 'payment' && user?.role === 'super_admin') {
      if (!token) {
        setPayLoading(false);
        return;
      }
      setPayLoading(true);
      stripeApi.getSettings(token)
        .then((settings) => {
          setPayPublicKey(settings.stripePublicKey || '');
          setPaySecretKey(settings.stripeSecretKeyMasked || '');
          setPayWebhookSecret(settings.stripeWebhookSecretMasked || '');
          setPayEnabled(settings.isEnabled);
        })
        .catch(() => setPayMessage({ type: 'error', text: 'Failed to load payment settings' }))
        .finally(() => setPayLoading(false));
    }
  }, [activeTab, user, token]);

  if (!user || user.role !== 'super_admin') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Access Denied</h3>
          <p className="text-gray-400">Super Admin privileges required to access system settings.</p>
        </div>
      </div>
    );
  }

  const handlePaySave = async () => {
    setPaySaving(true);
    setPayMessage(null);
    try {
      if (!token) throw new Error('Not authenticated');
      await stripeApi.saveSettings({
        stripePublicKey: payPublicKey,
        stripeSecretKey: paySecretKey.includes('****') ? undefined : paySecretKey,
        stripeWebhookSecret: payWebhookSecret.includes('****') ? undefined : payWebhookSecret,
        isEnabled: payEnabled,
      }, token);
      setPayMessage({ type: 'success', text: 'Payment settings saved successfully!' });
      setPayTestResult(null);
    } catch {
      setPayMessage({ type: 'error', text: 'Failed to save payment settings' });
    } finally {
      setPaySaving(false);
    }
  };

  const handlePayTest = async () => {
    setPayTesting(true);
    setPayTestResult(null);
    try {
      if (!token) throw new Error('Not authenticated');
      const result = await stripeApi.testConnection(token);
      setPayTestResult(result);
    } catch {
      setPayTestResult({ success: false, message: 'Failed to test connection' });
    } finally {
      setPayTesting(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'payment', label: 'Payment', icon: '💳' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'database', label: 'Database', icon: '💾' },
    { id: 'logs', label: 'System Logs', icon: '📋' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            System Settings
            <span className="text-sm bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/30">
              👑 Super Admin Only
            </span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Configure system-wide settings and preferences
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[#151b2e] border border-white/5 rounded-xl">
        <div className="flex border-b border-white/5 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-all duration-200 ${activeTab === tab.id
                ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-500/5'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white mb-4">General Settings</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Site Name</label>
                    <input
                      type="text"
                      defaultValue="PAFT Plastic Pallets"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Admin Email</label>
                    <input
                      type="email"
                      defaultValue="admin@paft.eg"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Timezone</label>
                    <select className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50">
                      <option value="Africa/Cairo" className="bg-[#1a2332] text-white">Africa/Cairo (Egypt)</option>
                      <option value="UTC" className="bg-[#1a2332] text-white">UTC</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Default Language</label>
                    <select className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50">
                      <option value="en" className="bg-[#1a2332] text-white">English</option>
                      <option value="ar" className="bg-[#1a2332] text-white">العربية</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Maintenance Mode</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="maintenance"
                        className="w-4 h-4 text-purple-600 bg-white/5 border-white/10 rounded focus:ring-purple-500"
                      />
                      <label htmlFor="maintenance" className="text-sm text-gray-300">
                        Enable maintenance mode
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Registration</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="registration"
                        defaultChecked
                        className="w-4 h-4 text-purple-600 bg-white/5 border-white/10 rounded focus:ring-purple-500"
                      />
                      <label htmlFor="registration" className="text-sm text-gray-300">
                        Allow new user registration
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Payment Gateway (Stripe)</h3>
                {payTestResult && (
                  <div className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-full ${payTestResult.success
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                    <div className={`w-2 h-2 rounded-full ${payTestResult.success ? 'bg-green-400' : 'bg-red-400'}`} />
                    {payTestResult.success ? 'Connected' : 'Not Connected'}
                  </div>
                )}
              </div>

              {payLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-3 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  {/* Enable toggle */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Enable Stripe Payments</p>
                      <p className="text-gray-400 text-sm">Allow customers to pay via Stripe at checkout</p>
                    </div>
                    <button
                      onClick={() => setPayEnabled(!payEnabled)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${payEnabled ? 'bg-purple-600' : 'bg-white/10'}`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${payEnabled ? 'left-[26px]' : 'left-0.5'}`} />
                    </button>
                  </div>

                  {/* Key inputs */}
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Publishable Key <span className="text-gray-500">(pk_test_... or pk_live_...)</span>
                      </label>
                      <input
                        type="text"
                        value={payPublicKey}
                        onChange={(e) => setPayPublicKey(e.target.value)}
                        placeholder="pk_test_..."
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 font-mono text-sm placeholder-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Secret Key <span className="text-gray-500">(sk_test_... or sk_live_...)</span>
                      </label>
                      <input
                        type="password"
                        value={paySecretKey}
                        onChange={(e) => setPaySecretKey(e.target.value)}
                        placeholder="sk_test_..."
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 font-mono text-sm placeholder-gray-500"
                      />
                      <p className="text-gray-500 text-xs mt-1">🔒 Stored encrypted in the database. Never exposed to the frontend.</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Webhook Secret <span className="text-gray-500">(whsec_...)</span>
                      </label>
                      <input
                        type="password"
                        value={payWebhookSecret}
                        onChange={(e) => setPayWebhookSecret(e.target.value)}
                        placeholder="whsec_..."
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 font-mono text-sm placeholder-gray-500"
                      />
                      <p className="text-gray-500 text-xs mt-1">Optional — required for webhook signature verification</p>
                    </div>
                  </div>

                  {/* Messages */}
                  {payMessage && (
                    <div className={`px-4 py-3 rounded-xl text-sm ${payMessage.type === 'success'
                      ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                      : 'bg-red-500/10 border border-red-500/20 text-red-400'
                      }`}>
                      {payMessage.text}
                    </div>
                  )}

                  {payTestResult && (
                    <div className={`px-4 py-3 rounded-xl text-sm ${payTestResult.success
                      ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                      : 'bg-red-500/10 border border-red-500/20 text-red-400'
                      }`}>
                      {payTestResult.message}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handlePaySave}
                      disabled={paySaving}
                      className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl transition-colors font-medium flex items-center gap-2"
                    >
                      {paySaving ? (
                        <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                      ) : 'Save Settings'}
                    </button>

                    <button
                      onClick={handlePayTest}
                      disabled={payTesting}
                      className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 text-white rounded-xl transition-colors font-medium flex items-center gap-2"
                    >
                      {payTesting ? (
                        <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Testing...</>
                      ) : '🔌 Test Connection'}
                    </button>
                  </div>

                  {/* Info box */}
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 text-sm text-blue-300">
                    <p className="font-medium mb-2">📋 How to get your Stripe keys:</p>
                    <ol className="list-decimal list-inside space-y-1 text-gray-400">
                      <li>Go to <span className="text-blue-300">dashboard.stripe.com/test/apikeys</span></li>
                      <li>Copy the <strong className="text-white">Publishable key</strong> (pk_test_...)</li>
                      <li>Click &quot;Reveal&quot; to copy the <strong className="text-white">Secret key</strong> (sk_test_...)</li>
                      <li>For webhooks, go to Developers → Webhooks</li>
                    </ol>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white mb-4">Security Settings</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Session Timeout (minutes)</label>
                    <input
                      type="number"
                      defaultValue="60"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Max Login Attempts</label>
                    <input
                      type="number"
                      defaultValue="5"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Two-Factor Authentication</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="2fa"
                        className="w-4 h-4 text-purple-600 bg-white/5 border-white/10 rounded focus:ring-purple-500"
                      />
                      <label htmlFor="2fa" className="text-sm text-gray-300">
                        Require 2FA for admin accounts
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Password Policy</label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="strong-password"
                          defaultChecked
                          className="w-4 h-4 text-purple-600 bg-white/5 border-white/10 rounded focus:ring-purple-500"
                        />
                        <label htmlFor="strong-password" className="text-sm text-gray-300">
                          Require strong passwords
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white mb-4">Database Management</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Backup Database
                  </h4>
                  <p className="text-gray-400 text-sm mb-4">Create a backup of the current database</p>
                  <button className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                    Create Backup
                  </button>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Optimize Database
                  </h4>
                  <p className="text-gray-400 text-sm mb-4">Optimize database tables for better performance</p>
                  <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    Optimize Now
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white mb-4">System Logs</h3>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white font-medium">Recent Activity</h4>
                  <button className="text-purple-400 hover:text-purple-300 text-sm">View All Logs</button>
                </div>

                <div className="space-y-3">
                  {[
                    { time: '2 minutes ago', action: 'User login', user: 'Abdelrahman', type: 'info' },
                    { time: '15 minutes ago', action: 'Product updated', user: 'Admin', type: 'success' },
                    { time: '1 hour ago', action: 'Failed login attempt', user: 'Unknown', type: 'warning' },
                    { time: '2 hours ago', action: 'Database backup', user: 'System', type: 'info' },
                  ].map((log, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${log.type === 'success' ? 'bg-green-400' :
                          log.type === 'warning' ? 'bg-yellow-400' :
                            'bg-blue-400'
                          }`}></div>
                        <div>
                          <p className="text-white text-sm">{log.action}</p>
                          <p className="text-gray-400 text-xs">by {log.user}</p>
                        </div>
                      </div>
                      <span className="text-gray-500 text-xs">{log.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors font-medium">
          Save Settings
        </button>
      </div>
    </div>
  );
}