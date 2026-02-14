'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function DatabaseBackupPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);

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
          <p className="text-gray-400">Super Admin privileges required to access database backup.</p>
        </div>
      </div>
    );
  }

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true);
    setBackupProgress(0);

    // Simulate backup progress
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCreatingBackup(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const mockBackups = [
    {
      id: 1,
      name: 'paft_cms_backup_2024-02-13_14-30.sql',
      date: '2024-02-13 14:30:25',
      size: '2.4 MB',
      type: 'Full Backup',
      status: 'Completed'
    },
    {
      id: 2,
      name: 'paft_cms_backup_2024-02-12_12-00.sql',
      date: '2024-02-12 12:00:00',
      size: '2.3 MB',
      type: 'Scheduled',
      status: 'Completed'
    },
    {
      id: 3,
      name: 'paft_cms_backup_2024-02-11_12-00.sql',
      date: '2024-02-11 12:00:00',
      size: '2.2 MB',
      type: 'Scheduled',
      status: 'Completed'
    },
    {
      id: 4,
      name: 'paft_cms_backup_2024-02-10_12-00.sql',
      date: '2024-02-10 12:00:00',
      size: '2.1 MB',
      type: 'Scheduled',
      status: 'Completed'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Database Backup
            <span className="text-sm bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/30">
              👑 Super Admin Only
            </span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Create and manage database backups for system recovery
          </p>
        </div>
      </div>

      {/* Backup Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Create Backup */}
        <div className="bg-[#151b2e] border border-white/5 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold">Create Backup</h3>
              <p className="text-gray-400 text-sm">Generate a new database backup</p>
            </div>
          </div>

          {isCreatingBackup ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Creating backup...</span>
                <span className="text-white">{backupProgress}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${backupProgress}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <button
              onClick={handleCreateBackup}
              className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
            >
              Create Full Backup
            </button>
          )}
        </div>

        {/* Restore Backup */}
        <div className="bg-[#151b2e] border border-white/5 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold">Restore Database</h3>
              <p className="text-gray-400 text-sm">Restore from existing backup</p>
            </div>
          </div>

          <button className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">
            Select Backup to Restore
          </button>
        </div>

        {/* Schedule Backup */}
        <div className="bg-[#151b2e] border border-white/5 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold">Scheduled Backups</h3>
              <p className="text-gray-400 text-sm">Automatic daily backups</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Daily at 12:00 AM</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-xs text-green-400">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Database Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Database Size', value: '15.2 MB', icon: '💾', color: 'from-blue-500 to-blue-600' },
          { label: 'Total Tables', value: '8', icon: '📊', color: 'from-emerald-500 to-emerald-600' },
          { label: 'Total Records', value: '1,247', icon: '📝', color: 'from-purple-500 to-purple-600' },
          { label: 'Last Backup', value: '2 hours ago', icon: '🕒', color: 'from-orange-500 to-orange-600' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-[#151b2e] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                <span className="text-lg">{stat.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Backup History */}
      <div className="bg-[#151b2e] border border-white/5 rounded-xl">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Backup History</h3>
            <button className="text-purple-400 hover:text-purple-300 text-sm">
              View All Backups
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-3">
            {mockBackups.map((backup) => (
              <div
                key={backup.id}
                className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-medium">{backup.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                      <span>📅 {backup.date}</span>
                      <span>📦 {backup.size}</span>
                      <span>🏷️ {backup.type}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-medium border border-green-500/20">
                    {backup.status}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <button
                      className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all duration-200"
                      title="Download backup"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                    
                    <button
                      className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-lg transition-all duration-200"
                      title="Restore from this backup"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                    
                    <button
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                      title="Delete backup"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}