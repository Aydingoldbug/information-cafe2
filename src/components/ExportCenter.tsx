import React, { useState } from 'react';
import { UserRole } from '../types';
import { ACCESS_LEVELS_CONFIG } from '../data/delegationData';
import { 
  SERVICES_DATABASE, 
  OFFICIAL_TARIFF_VERSION, 
  OFFICIAL_TARIFF_DATE,
  UNION_NAME 
} from '../data/servicesData';
import { 
  formatRial, 
  formatToman, 
  formatNumberWithCommas 
} from '../utils/formatters';
import { 
  Printer, 
  FileText, 
  ShieldCheck, 
  Download, 
  CheckCircle, 
  AlertCircle, 
  Layers, 
  Building2,
  Lock,
  Eye
} from 'lucide-react';

interface ExportCenterProps {
  currentRole: UserRole;
  onOpenOfficialTariffPrint: () => void;
  onOpenSampleReceiptPrint: () => void;
}

export const ExportCenter: React.FC<ExportCenterProps> = ({
  currentRole,
  onOpenOfficialTariffPrint,
  onOpenSampleReceiptPrint,
}) => {
  const [selectedRoleView, setSelectedRoleView] = useState<UserRole>(currentRole);

  const activeRoleConfig = ACCESS_LEVELS_CONFIG.find((c) => c.role === selectedRoleView) || ACCESS_LEVELS_CONFIG[0];

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-cyan-950/70 via-slate-900 to-blue-950/70 border border-cyan-500/30 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Printer className="w-6 h-6 text-cyan-400" />
            <h2 className="text-base font-bold text-white">
              مرکز خروجی‌های رسمی و ماتریس ۴ سطح دسترسی
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            تفکیک کامل اختیارات خروجی و چاپ در ۴ سطح سازمانی همراه با اسناد آماده پرینت با سربرگ اتحادیه شهرستان ری.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenOfficialTariffPrint}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>چاپ نرخ‌نامه رسمی ۱۴۰۵</span>
          </button>
        </div>
      </div>

      {/* 4 Access Levels Definition Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white">
              تعریف ۴ سطح دسترسی به ماژول خروجی و امکانات سیستم
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              هر کاربر متناسب با سطح سازمانی خود به بخش‌ها و گزارش‌ها دسترسی دارد.
            </p>
          </div>
          <span className="text-xs text-cyan-400 font-semibold bg-cyan-500/10 px-3 py-1 rounded-xl border border-cyan-500/20">
            سطح جاری سیستم: {ACCESS_LEVELS_CONFIG.find((c) => c.role === currentRole)?.titleFa}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {ACCESS_LEVELS_CONFIG.map((cfg) => {
            const isCurrent = cfg.role === currentRole;
            const isSelected = cfg.role === selectedRoleView;

            return (
              <div
                key={cfg.role}
                onClick={() => setSelectedRoleView(cfg.role as UserRole)}
                className={`p-4 rounded-2xl border text-right transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-500 ring-2 ring-cyan-500/30'
                    : 'bg-slate-800/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white">{cfg.titleFa.split(':')[0]}</span>
                    {isCurrent && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold">
                        نقش شما
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-cyan-300 line-clamp-1">
                    {cfg.titleFa.split(':')[1]}
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed">
                    {cfg.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block mb-1">مجوزهای خروجی:</span>
                  <div className="space-y-1 text-[11px] text-slate-300">
                    {cfg.permissions.slice(0, 3).map((p, i) => (
                      <div key={i} className="flex items-center gap-1.5 truncate">
                        <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="truncate">{p}</span>
                      </div>
                    ))}
                    {cfg.permissions.length > 3 && (
                      <span className="text-[10px] text-slate-400">+{cfg.permissions.length - 3} مورد دیگر</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Printable Documents Hub */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Document 1: Official Tariff 1405 Printout */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mb-3">
              <Building2 className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">
              چاپ نرخ‌نامه رسمی ۱۴۰۵ (بدون چاپ و تکثیر)
            </h4>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              نسخه تمیز و مرتب نرخ‌نامه {SERVICES_DATABASE.length} خدمت الکترونیک مصوب اتحادیه شهرستان ری همراه با سربرگ رسمی، تفکیک ریال و تومان و اعشار سه‌رقمی.
            </p>
          </div>

          <button
            onClick={onOpenOfficialTariffPrint}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>مشاهده و پرینت نرخ‌نامه رسمی</span>
          </button>
        </div>

        {/* Document 2: Customer 2-Part Invoice */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mb-3">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">
              فاکتور رسمی دوتکه مشتری
            </h4>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              فاکتور رسمی با تفکیک دستمزد کافی‌نت از واریزی‌های مستقیم سامانه‌های دولتی (مانند خلافی، تمبر، عوارض پستی) جهت شفافیت کامل با مشتری.
            </p>
          </div>

          <button
            onClick={onOpenSampleReceiptPrint}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-cyan-600/20 cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>مشاهده نمونه فاکتور چاپی</span>
          </button>
        </div>

        {/* Document 3: Weekly Mentoring Meeting Sheet */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">
              برگه جلسه هفتگی ۱۰ دقیقه‌ای منتورینگ
            </h4>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              فرم ساختاریافته جلسات هفتگی انتقال تجربه ۱۵ ساله با ۳ پرسش کلیدی: «چه کار کردی؟»، «کجا گیر کردی؟» و «دفعه بعد چه می‌کنی؟».
            </p>
          </div>

          <button
            onClick={() => {
              window.print();
            }}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>چاپ صفحه جاری (PDF)</span>
          </button>
        </div>

      </div>

    </div>
  );
};
