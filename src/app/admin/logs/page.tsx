'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminLogsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('recent');

  // Redirect if not super admin
  useEffect(() => {
    if (user && user.role !== 'super_admin') {
      router.push('/admin');
    }
  }, [user, router]);

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
          <p className="text-gray-400">Super Admin privileges required to access system logs.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'recent', label: 'Recent Activity', icon: '📋' },
    { id: 'auth', label: 'Authentication', icon: '🔐' },
    { id: 'errors', label: 'Error Logs', icon: '⚠️' },
    { id: 'system', label: 'System Events', icon: '⚙️' },
  ];

  const mockLogs = {
    recent: [
      { id: 1, timestamp: '2024-02-13 14:30:25', level: 'info', action: 'User Login', user: 'Abdelrahman', details: 'Successful login from IP: 192.168.1.100' },
      { id: 2, timestamp: '2024-02-13 14:25:12', level: 'success', action: 'Product Updated', user: 'Admin', details: 'Updated product: Standard Pallet 1200x800' },
      { id: 3, timestamp: '2024-02-13 14:20:45', level: 'warning', action: 'Failed Login', user: 'Unknown', details: 'Failed login attempt for: test@example.com' },
      { id: 4, timestamp: '2024-02-13 14:15:30', level: 'info', action: 'Page Created', user: 'Admin', details: 'Created new page: About Us' },
      { id: 5, timestamp: '2024-02-13 14:10:15', level: 'info', action: 'User Registration', user: 'System', details: 'New user registered: mohamed@example.com' },
    ],
    auth: [
      { id: 1, timestamp: '2024-02-13 14:30:25', level: 'info', action: 'Login Success', user: 'Abdelrahman', details: 'IP: 192.168.1.100, Browser: Chrome' },
      { id: 2, timestamp: '2024-02-13 14:20:45', level: 'warning', action: 'Login Failed', user: 'Unknown', details: 'Email: test@example.com, IP: 192.168.1.105' },
      { id: 3, timestamp: '2024-02-13 13:45:20', level: 'info', action: 'Logout', user: 'Mohamed', details: 'Session ended normally' },
      { id: 4, timestamp: '2024-02-13 13:30:10', level: 'warning', action: 'Multiple Failed Attempts', user: 'Unknown', details: 'IP: 192.168.1.105 blocked for 15 minutes' },
    ],
    errors: [
      { id: 1, timestamp: '2024-02-13 14:25:30', level: 'error', action: 'Database Connection', user: 'System', details: 'Connection timeout to MySQL server' },
      { id: 2, timestamp: '2024-02-13 13:15:45', level: 'error', action: 'File Upload', user: 'Admin', details: 'Failed to upload image: file size too large' },
      { id: 3, timestamp: '2024-02-13 12:30:20', level: 'warning', action: 'API Rate Limit', user: 'System', details: 'Rate limit exceeded for IP: 192.168.1.200' },
    ],
    system: [
      { id: 1, timestamp: '2024-02-13 12:00:00', level: 'info', action: 'Database Backup', user: 'System', details: 'Automated backup completed successfully' },
      { id: 2, timestamp: '2024-02-13 06:00:00', level: 'info', action: 'System Maintenance', user: 'System', details: 'Scheduled maintenance completed' },
      { id: 3, timestamp: '2024-02-12 23:59:59', level: 'info', action: 'Log Rotation', user: 'System', details: 'Log files rotated and archived' },
    ]
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'warning': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'success': return 'text-green-400 bg-green-500/10 border-green-500/20';
      default: return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error': return '🔴';
      case 'warning': return '🟡';
      case 'success': return '🟢';
      default: return '🔵';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Admin Logs
            <span className="text-sm bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/30">
              👑 Super Admin Only
            </span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Monitor system activity and security events
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium">
            Export Logs
          </button>
          <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-medium">
            Clear Old Logs
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Events', value: '1,247', icon: '📊', color: 'from-blue-500 to-blue-600' },
          { label: 'Errors Today', value: '3', icon: '⚠️', color: 'from-red-500 to-red-600' },
          { label: 'Active Users', value: '12', icon: '👥', color: 'from-green-500 to-green-600' },
          { label: 'System Health', value: '98%', icon: '💚', color: 'from-emerald-500 to-emerald-600' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-[#151b2e] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                <span className="text-lg">{stat.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Logs Section */}
      <div className="bg-[#151b2e] border border-white/5 rounded-xl">
        {/* Tabs */}
        <div className="flex border-b border-white/5 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.id
                  ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-500/5'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Log Content */}
        <div className="p-6">
          <div className="space-y-3">
            {mockLogs[activeTab as keyof typeof mockLogs]?.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-200"
              >
                <div className="flex-shrink-0">
                  <span className="text-lg">{getLevelIcon(log.level)}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-white font-medium">{log.action}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getLevelColor(log.level)}`}>
                      {log.level.toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-2">{log.details}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>👤 {log.user}</span>
                    <span>🕒 {log.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {mockLogs[activeTab as keyof typeof mockLogs]?.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No logs found</h3>
              <p className="text-gray-400">No log entries available for this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}