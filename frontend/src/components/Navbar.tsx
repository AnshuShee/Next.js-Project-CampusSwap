'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  ShoppingBag,
  PlusCircle,
  LayoutDashboard,
  UserCheck,
  ChevronDown,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { currentUser, demoUsers, loginAsDemoUser, unreadCount } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:bg-indigo-700 transition">
            CS
          </div>
          <div>
            <span className="text-xl font-black text-slate-800 tracking-tight">Campus<span className="text-indigo-600">Swap</span></span>
            <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">Student Market</span>
          </div>
        </Link>

        <nav className="flex items-center gap-3 md:gap-5">
          <Link
            href="/"
            className={`flex items-center gap-1.5 text-sm font-medium transition ${
              pathname === '/' ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden md:inline">Browse</span>
          </Link>

          <Link
            href="/sell"
            className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition ${
              pathname === '/sell'
                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-indigo-600" />
            <span>Sell / Give Away</span>
          </Link>

          <Link
            href="/dashboard"
            className={`relative flex items-center gap-1.5 text-sm font-medium transition ${
              pathname === '/dashboard' ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden md:inline">Dashboard</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </Link>

          <div className="relative group pl-2 border-l border-slate-200">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <div className="text-left text-xs">
                <p className="font-bold text-slate-800 leading-tight">
                  {currentUser ? currentUser.name.split(' ')[0] : 'Demo User'}
                </p>
                <p className="text-[10px] text-slate-500 leading-tight">
                  {currentUser ? currentUser.year : 'Switch Account'}
                </p>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>

            <div className="absolute right-0 mt-1 w-64 bg-white border border-slate-200 rounded-xl shadow-xl py-2 hidden group-hover:block z-50">
              <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Select Viva Demo Account
              </div>
              {demoUsers.map((user) => (
                <button
                  key={user._id}
                  onClick={() => loginAsDemoUser(user._id)}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-indigo-50 transition ${
                    currentUser?._id === user._id ? 'bg-indigo-50/70 font-semibold text-indigo-700' : 'text-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-medium text-slate-900">{user.name}</div>
                    <div className="text-[10px] text-slate-500">{user.department} • {user.hostelOrLocation}</div>
                  </div>
                  {currentUser?._id === user._id && (
                    <span className="text-[10px] bg-indigo-600 text-white px-1.5 py-0.5 rounded font-bold">Active</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};
