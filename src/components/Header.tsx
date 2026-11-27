import React from 'react';
import { UserRole } from '../types';
import { ACCESS_LEVELS_CONFIG } from '../data/delegationData';
import { 
  ShieldCheck, 
  UserCheck, 
  HelpCircle, 
  Printer, 
  CheckCircle2, 
  AlertTriangle,
  Building2,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeTicketsCount: number;
  onOpenQuickPrint: () => void;
  onOpenHelpModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  setCurrentRole,
  activeTicketsCount,
  onOpenQuickPrint,
  onOpenHelpModal,
}) => {
  const currentRoleConfig = ACCESS_LEVELS_CONFIG.find((c) => c.role === currentRole) || ACCESS_LEVELS_CONFIG[0];

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Main Title */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/30">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white tracking-tight">
                  سامانه استقلال هدایت‌شده کافی‌نت
                </h1>
                <span className="bg-emerald-500/15 text-emerald-400 text-xs font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  نرخ‌نامه ۱۴۰۵
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                سیستم جامع تفویض اختیار ۱۵ ساله، آموزش تطبیقی، شبیه‌ساز و دستیار میز کار پرسنل
              </p>
            </div>
          </div>

          {/* Center Info Stats */}
          <div className="hidden md:flex items-center gap-4 text-xs">
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-lg px-3 py-1.5 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-300">استقلال پرسنل:</span>
              <span className="font-bold text-emerald-400 text-sm">۸۱٪</span>
            </div>

            {activeTicketsCount > 0 && (
              <div className="bg-rose-950/60 border border-rose-800/60 rounded-lg px-3 py-1.5 flex items-center gap-2 text-rose-300">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
                <span>ارجاع به کارفرما:</span>
                <span className="font-bold text-rose-300 text-sm">{activeTicketsCount} مورد</span>
              </div>
            )}
          </div>

          {/* Right Controls: Role Selector & Actions */}
          <div className="flex items-center gap-3">
            
            {/* Quick Print Button */}
            <button
              onClick={onOpenQuickPrint}
              className="hidden sm:flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-700 transition"
              title="چاپ نرخ‌نامه یا فاکتور"
            >
              <Printer className="w-4 h-4 text-slate-300" />
              <span>چاپ رسمی</span>
            </button>

            {/* Mentoring Guide Help Button */}
            <button
              onClick={onOpenHelpModal}
              className="flex items-center gap-1 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 text-xs font-medium px-3 py-2 rounded-lg border border-teal-500/30 transition"
              title="راهنمای مدل استقلال هدایت‌شده و منتورینگ"
            >
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span className="hidden sm:inline">فلسفه ۱۵ ساله</span>
            </button>

            {/* Role Switcher (4 Access Levels) */}
            <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700 rounded-xl p-1.5 shadow-inner">
              <div className="flex items-center gap-1.5 px-2 py-1 text-xs text-slate-400">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span className="hidden lg:inline">نقش:</span>
              </div>
              <select
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value as UserRole)}
                className="bg-slate-900 text-white text-xs font-semibold py-1.5 px-2.5 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="owner">۱. کارفرما (مدیر ارشد)</option>
                <option value="supervisor">۲. ناظر فنی (کارمند ارشد)</option>
                <option value="operator">۳. متصدی خدمات الکترونیک</option>
                <option value="cashier">۴. پذیرش و صندوق (مبتدی)</option>
              </select>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
