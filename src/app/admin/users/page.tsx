'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { adminUsersApi, UserResponse } from '@/lib/api';

export default function AdminUsersPage() {
  const { token, user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'user' | 'super_admin'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'role' | 'createdAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' as 'admin' | 'user' | 'super_admin'
  });

  useEffect(() => {
    if (!token) return;
    fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminUsersApi.getAll(token!);
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: number, newRole: 'admin' | 'user' | 'super_admin') => {
    // Check if this is a protected user
    const user = users.find(u => u.id === userId);
    if (user && isProtectedUser(user.email, user.role)) {
      alert('Cannot modify super admin role - super admin accounts are protected');
      return;
    }

    // Only super admins can assign super_admin role
    if (newRole === 'super_admin' && currentUser?.role !== 'super_admin') {
      alert('Only super admins can assign super admin privileges');
      return;
    }

    try {
      await adminUsersApi.updateRole(userId, newRole, token!);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role. Please try again.');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    // Check if this is a protected user
    const user = users.find(u => u.id === userId);
    if (user && isProtectedUser(user.email, user.role)) {
      alert('Cannot delete super admin account - super admin accounts are protected');
      return;
    }

    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await adminUsersApi.delete(userId, token!);
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please try again.');
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const createdUser = await adminUsersApi.create(newUser, token!);
      setUsers([...users, createdUser]);
      setNewUser({ name: '', email: '', password: '', role: 'user' });
      setShowAddUser(false);
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create user. Please try again.');
    }
  };

  const isProtectedUser = (email: string, role?: string) => {
    // Protect any super_admin user
    if (role === 'super_admin') {
      return true;
    }
    // Also protect specific emails
    return email === 'admin@paft.com' || email === 'abdelrahman@paft.eg' || email.includes('abdelrahman');
  };

  // Filter and sort users
  const filteredUsers = users
    .filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === 'all' || user.role === filterRole;
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      let aValue: string | number = a[sortBy];
      let bValue: string | number = b[sortBy];
      
      if (sortBy === 'createdAt') {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-white/5 rounded w-48 animate-pulse"></div>
            <div className="h-4 bg-white/5 rounded w-32 mt-2 animate-pulse"></div>
          </div>
        </div>
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-[#151b2e] border border-white/5 rounded-lg p-4">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-white/5 rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-white/5 rounded w-1/4 animate-pulse"></div>
                  <div className="h-3 bg-white/5 rounded w-1/3 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            Users Management
            {currentUser?.role === 'super_admin' && (
              <span className="text-sm bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/30">
                👑 Full Access
              </span>
            )}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {currentUser?.role === 'super_admin' 
              ? `Manage all user accounts and permissions (${filteredUsers.length} users)` 
              : `Manage user accounts and permissions (${filteredUsers.length} users)`
            }
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddUser(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add User
          </button>
          <button
            onClick={fetchUsers}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards - Dashboard Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Users',
            value: users.length,
            icon: (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            ),
            color: 'from-blue-500 to-blue-600',
            bgGlow: 'shadow-blue-500/20',
          },
          {
            label: 'Administrators',
            value: users.filter(u => u.role === 'admin' || u.role === 'super_admin').length,
            icon: (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
              </svg>
            ),
            color: 'from-purple-500 to-purple-600',
            bgGlow: 'shadow-purple-500/20',
          },
          {
            label: 'Regular Users',
            value: users.filter(u => u.role === 'user').length,
            icon: (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7C14.65 7 14.32 7.1 14.04 7.28L11.58 9.54C11.22 9.86 10.66 9.84 10.34 9.48C10.02 9.12 10.04 8.56 10.4 8.24L12.85 6H9.15L6.7 8.24C7.06 8.56 7.08 9.12 6.76 9.48C6.44 9.84 5.88 9.86 5.52 9.54L3.06 7.28C2.78 7.1 2.45 7 2.1 7H2V9H3.8L6 22H18L20.2 9H21Z"/>
              </svg>
            ),
            color: 'from-emerald-500 to-emerald-600',
            bgGlow: 'shadow-emerald-500/20',
          },
          {
            label: 'New This Month',
            value: users.filter(u => new Date(u.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length,
            icon: (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
              </svg>
            ),
            color: 'from-orange-500 to-red-500',
            bgGlow: 'shadow-orange-500/20',
          }
        ].map((card) => (
          <div
            key={card.label}
            className={`group bg-[#151b2e] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all duration-300 hover:shadow-xl ${card.bgGlow}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm">{card.label}</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {loading ? (
                    <span className="inline-block w-12 h-8 bg-white/5 rounded animate-pulse" />
                  ) : (
                    card.value
                  )}
                </p>
              </div>
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-lg ${card.bgGlow}`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-[#151b2e] border border-white/5 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Search</label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Role</label>
            <div className="relative">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as 'all' | 'admin' | 'user' | 'super_admin')}
                className="w-full appearance-none px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 hover:bg-white/10 cursor-pointer pr-10"
              >
                <option value="all" className="bg-[#1a2332] text-white">All Roles</option>
                <option value="admin" className="bg-[#1a2332] text-white">Admin</option>
                <option value="user" className="bg-[#1a2332] text-white">User</option>
                <option value="super_admin" className="bg-[#1a2332] text-white">Super Admin</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Sort by</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'email' | 'role' | 'createdAt')}
                  className="w-full appearance-none px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 hover:bg-white/10 cursor-pointer pr-10"
                >
                  <option value="createdAt" className="bg-[#1a2332] text-white">Date</option>
                  <option value="name" className="bg-[#1a2332] text-white">Name</option>
                  <option value="email" className="bg-[#1a2332] text-white">Email</option>
                  <option value="role" className="bg-[#1a2332] text-white">Role</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all duration-200 group flex items-center justify-center min-w-[48px]"
                title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
              >
                <svg className={`w-5 h-5 transition-transform duration-200 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#151b2e] border border-white/10 rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Add New User</h3>
            
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter user name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email address"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter password"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'admin' | 'user' | 'super_admin' })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="user" className="bg-[#1a2332] text-white">User</option>
                  <option value="admin" className="bg-[#1a2332] text-white">Admin</option>
                  {/* Only super admins can create other super admins */}
                  {currentUser?.role === 'super_admin' && (
                    <option value="super_admin" className="bg-[#1a2332] text-white">Super Admin</option>
                  )}
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
                >
                  Create User
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddUser(false);
                    setNewUser({ name: '', email: '', password: '', role: 'user' });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users List */}
      <div className="space-y-3">
        {filteredUsers.length === 0 ? (
          <div className="bg-[#151b2e] border border-white/5 rounded-xl p-12 text-center">
            <div className="w-16 h-16 bg-gray-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No users found</h3>
            <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <>
            {/* Enhanced User Cards */}
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="group bg-[#151b2e] border border-white/5 rounded-xl p-5 hover:border-white/10 hover:shadow-lg hover:shadow-black/20 transition-all duration-300"
              >
                {/* Desktop Layout */}
                <div className="hidden lg:flex items-center justify-between">
                  {/* Left Side - User Info */}
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    {/* Avatar */}
                    <div className={`relative w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg ${
                      user.role === 'super_admin' 
                        ? 'bg-gradient-to-br from-purple-500 to-purple-600' 
                        : user.role === 'admin' 
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                        : 'bg-gradient-to-br from-gray-500 to-gray-600'
                    }`}>
                      {user.name.charAt(0).toUpperCase()}
                      {/* Online indicator */}
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-[#151b2e] rounded-full"></div>
                    </div>

                    {/* User Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-white font-semibold text-lg truncate">{user.name}</h3>
                        {/* Role Badge */}
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          user.role === 'super_admin'
                            ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                            : user.role === 'admin' 
                            ? 'bg-blue-500/10 text-blue-300 border-blue-500/30' 
                            : 'bg-gray-500/10 text-gray-300 border-gray-500/30'
                        }`}>
                          {user.role === 'super_admin' ? '👑 Super Admin' : user.role === 'admin' ? '🛡️ Admin' : '👤 User'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                          </svg>
                          <span className="truncate max-w-[200px]">{user.email}</span>
                        </div>
                        
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m-6 0h6m-6 0V7a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V8a1 1 0 00-1-1h-2" />
                          </svg>
                          <span>ID: {user.id}</span>
                        </div>
                        
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m-6 0h6m-6 0V7a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V8a1 1 0 00-1-1h-2" />
                          </svg>
                          <span>Joined {formatDate(user.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Actions */}
                  <div className="flex items-center gap-3 ml-4">
                    {/* Role Selector */}
                    <div className="relative">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value as 'admin' | 'user' | 'super_admin')}
                        disabled={isProtectedUser(user.email, user.role)}
                        className={`appearance-none text-sm px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 hover:bg-white/10 cursor-pointer pr-10 min-w-[120px] ${
                          isProtectedUser(user.email, user.role) ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <option value="user" className="bg-[#1a2332] text-white">👤 User</option>
                        <option value="admin" className="bg-[#1a2332] text-white">🛡️ Admin</option>
                        {/* Only show super_admin option to super admins */}
                        {currentUser?.role === 'super_admin' && (
                          <option value="super_admin" className="bg-[#1a2332] text-white">👑 Super Admin</option>
                        )}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      {/* Edit Button */}
                      <button
                        className="p-2.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-xl transition-all duration-200 group/edit"
                        title="Edit user"
                      >
                        <svg className="w-4 h-4 group-hover/edit:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={isProtectedUser(user.email)}
                        className={`p-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-200 group/delete ${
                          isProtectedUser(user.email) ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        title={isProtectedUser(user.email) ? 'Cannot delete super admin' : 'Delete user'}
                      >
                        <svg className="w-4 h-4 group-hover/delete:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mobile/Tablet Layout */}
                <div className="lg:hidden">
                  {/* Top Row - Avatar, Name, Role */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`relative w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg ${
                        user.role === 'super_admin' 
                          ? 'bg-gradient-to-br from-purple-500 to-purple-600' 
                          : user.role === 'admin' 
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                          : 'bg-gradient-to-br from-gray-500 to-gray-600'
                      }`}>
                        {user.name.charAt(0).toUpperCase()}
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-[#151b2e] rounded-full"></div>
                      </div>
                      
                      <div>
                        <h3 className="text-white font-semibold text-lg">{user.name}</h3>
                        <p className="text-gray-400 text-sm">ID: {user.id}</p>
                      </div>
                    </div>

                    {/* Role Badge */}
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                      user.role === 'super_admin'
                        ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                        : user.role === 'admin' 
                        ? 'bg-blue-500/10 text-blue-300 border-blue-500/30' 
                        : 'bg-gray-500/10 text-gray-300 border-gray-500/30'
                    }`}>
                      {user.role === 'super_admin' ? '👑 Super Admin' : user.role === 'admin' ? '🛡️ Admin' : '👤 User'}
                    </span>
                  </div>

                  {/* Middle Row - Email and Date */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                      <span className="truncate">{user.email}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m-6 0h6m-6 0V7a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V8a1 1 0 00-1-1h-2" />
                      </svg>
                      <span>Joined {formatDate(user.createdAt)}</span>
                    </div>
                  </div>

                  {/* Bottom Row - Actions */}
                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/5">
                    {/* Role Selector */}
                    <div className="relative flex-1">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value as 'admin' | 'user' | 'super_admin')}
                        disabled={isProtectedUser(user.email, user.role)}
                        className={`appearance-none w-full text-sm px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 hover:bg-white/10 cursor-pointer pr-10 ${
                          isProtectedUser(user.email, user.role) ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <option value="user" className="bg-[#1a2332] text-white">👤 User</option>
                        <option value="admin" className="bg-[#1a2332] text-white">🛡️ Admin</option>
                        {/* Only show super_admin option to super admins */}
                        {currentUser?.role === 'super_admin' && (
                          <option value="super_admin" className="bg-[#1a2332] text-white">👑 Super Admin</option>
                        )}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      {/* Edit Button */}
                      <button
                        className="p-2.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-xl transition-all duration-200 group/edit"
                        title="Edit user"
                      >
                        <svg className="w-4 h-4 group-hover/edit:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={isProtectedUser(user.email)}
                        className={`p-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-200 group/delete ${
                          isProtectedUser(user.email) ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        title={isProtectedUser(user.email) ? 'Cannot delete super admin' : 'Delete user'}
                      >
                        <svg className="w-4 h-4 group-hover/delete:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Protected User Warning */}
                {isProtectedUser(user.email, user.role) && (
                  <div className="mt-3 pt-3 border-t border-white/5">
                    <div className="flex items-center gap-2 text-xs text-amber-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span>Protected account - Super admin accounts cannot be modified or deleted</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}