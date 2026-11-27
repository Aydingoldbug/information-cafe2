import React, { useState, useMemo } from 'react';
import { 
  ServiceItem, 
  ServiceCategory, 
  DiscretionLevel, 
  UserRole 
} from '../types';
import { 
  SERVICES_DATABASE, 
  CATEGORY_LABELS, 
  DISCRETION_LABELS, 
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
  Search, 
  Filter, 
  ExternalLink, 
  Clock, 
  Layers, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  X, 
  ChevronLeft, 
  BellRing,
  BookOpen,
  ArrowUpRight,
  ShieldAlert,
  Info
} from 'lucide-react';

interface KnowledgeBaseProps {
  currentRole: UserRole;
  onSelectServiceForAssistant: (service: ServiceItem) => void;
  onStartSimulationForService?: (serviceTitle: string) => void;
}

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({
  currentRole,
  onSelectServiceForAssistant,
  onStartSimulationForService,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDiscretion, setSelectedDiscretion] = useState<string>('all');
  const [activeServiceModal, setActiveServiceModal] = useState<ServiceItem | null>(null);
  const [showVersionNotice, setShowVersionNotice] = useState(true);

  // Filter services
  const filteredServices = useMemo(() => {
    return SERVICES_DATABASE.filter((s) => {
      const matchSearch =
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.portalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.requiredDocuments.some((d) => d.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchCategory = selectedCategory === 'all' || s.category === selectedCategory;
      const matchDiscretion = selectedDiscretion === 'all' || s.discretionLevel === selectedDiscretion;

      return matchSearch && matchCategory && matchDiscretion;
    });
  }, [searchTerm, selectedCategory, selectedDiscretion]);

  const discretionCounts = useMemo(() => {
    return {
      all: SERVICES_DATABASE.length,
      green: SERVICES_DATABASE.filter((s) => s.discretionLevel === 'green').length,
      yellow: SERVICES_DATABASE.filter((s) => s.discretionLevel === 'yellow').length,
      red: SERVICES_DATABASE.filter((s) => s.discretionLevel === 'red').length,
    };
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Version Header & Alert Notice */}
      {showVersionNotice && (
        <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 relative shadow-lg">
          <button
            onClick={() => setShowVersionNotice(false)}
            className="absolute top-3 left-3 text-slate-400 hover:text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <BellRing className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-emerald-300">
                    پایگاه دانش مصوب نرخ‌نامه نسخه {OFFICIAL_TARIFF_VERSION} (تاریخ ابلاغ: {OFFICIAL_TARIFF_DATE})
                  </h3>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[11px] px-2 py-0.5 rounded-full border border-emerald-500/30 font-semibold">
                    کاملاً به‌روز
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  مرجع رسمی خدمات الکترونیک، کافی‌نت و اینترنت {UNION_NAME} - خدمات چاپ و تکثیر حذف شده‌اند.
                </p>
              </div>
            </div>
            <div className="text-xs text-slate-300 bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700/80 shrink-0 flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-400" />
              <span>قیمت‌ها بر اساس ریال با معادل تومان و جداکننده ۳ رقمی درج شده است.</span>
            </div>
          </div>
        </div>
      )}

      {/* Discretion Level Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        
        {/* Green Box */}
        <button
          onClick={() => setSelectedDiscretion(selectedDiscretion === 'green' ? 'all' : 'green')}
          className={`p-4 rounded-xl border text-right transition flex items-start justify-between cursor-pointer ${
            selectedDiscretion === 'green'
              ? 'bg-emerald-950/80 border-emerald-500 ring-2 ring-emerald-500/30'
              : 'bg-slate-900/90 border-slate-800 hover:border-emerald-600/50'
          }`}
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500" />
              <span className="font-bold text-sm text-emerald-400">سطح سبز: انجام مستقل</span>
            </div>
            <p className="text-xs text-slate-300 mt-1 line-clamp-2">
              پرسنل با چک‌لیست پلتفرم و بدون مراجعه به کارفرما انجام می‌دهد (ثبت کتب درسی، تاییدیه پستی، سجام و...).
            </p>
          </div>
          <span className="bg-emerald-500/20 text-emerald-300 text-xs font-black px-2.5 py-1 rounded-lg border border-emerald-500/30">
            {discretionCounts.green} خدمت
          </span>
        </button>

        {/* Yellow Box */}
        <button
          onClick={() => setSelectedDiscretion(selectedDiscretion === 'yellow' ? 'all' : 'yellow')}
          className={`p-4 rounded-xl border text-right transition flex items-start justify-between cursor-pointer ${
            selectedDiscretion === 'yellow'
              ? 'bg-amber-950/80 border-amber-500 ring-2 ring-amber-500/30'
              : 'bg-slate-900/90 border-slate-800 hover:border-amber-600/50'
          }`}
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-400 shadow-sm shadow-amber-400" />
              <span className="font-bold text-sm text-amber-300">سطح زرد: تأیید سیستمی / چک‌لیست</span>
            </div>
            <p className="text-xs text-slate-300 mt-1 line-clamp-2">
              پرسنل انجام می‌دهد اما مراحل حساس (مانند تبصره ۱۰۰، تعویض پلاک، تامین اجتماعی) توسط سیستم اعتبارسنجی می‌شود.
            </p>
          </div>
          <span className="bg-amber-500/20 text-amber-300 text-xs font-black px-2.5 py-1 rounded-lg border border-amber-500/30">
            {discretionCounts.yellow} خدمت
          </span>
        </button>

        {/* Red Box */}
        <button
          onClick={() => setSelectedDiscretion(selectedDiscretion === 'red' ? 'all' : 'red')}
          className={`p-4 rounded-xl border text-right transition flex items-start justify-between cursor-pointer ${
            selectedDiscretion === 'red'
              ? 'bg-rose-950/80 border-rose-500 ring-2 ring-rose-500/30'
              : 'bg-slate-900/90 border-slate-800 hover:border-rose-600/50'
          }`}
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500" />
              <span className="font-bold text-sm text-rose-300">سطح قرمز: ارجاع به کارفرما</span>
            </div>
            <p className="text-xs text-slate-300 mt-1 line-clamp-2">
              فقط در استثنائات (اختلاف مالی، خطای لاینحل سامانه، مدارک ناقص/مشکوک، اظهارنامه گروه ۲ یا تصمیم حقوقی).
            </p>
          </div>
          <span className="bg-rose-500/20 text-rose-300 text-xs font-black px-2.5 py-1 rounded-lg border border-rose-500/30">
            {discretionCounts.red} خدمت
          </span>
        </button>

      </div>

      {/* Search & Filtering Bar */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-4 space-y-3.5 shadow-sm">
        
        {/* Main Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="جستجوی عنوان خدمت، نام سامانه، مدرک لازم، سامانه ثنا، تعویض پلاک، خودنویس، تبصره ۱۰۰..."
            className="w-full bg-slate-800/90 text-white placeholder-slate-400 text-sm py-3 pr-11 pl-4 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
            >
              پاک کردن
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            همه رسته‌ها ({SERVICES_DATABASE.length})
          </button>
          {Object.entries(CATEGORY_LABELS).map(([key, item]) => {
            const count = SERVICES_DATABASE.filter((s) => s.category === key).length;
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === key
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span>{item.label}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((service) => {
          const disc = DISCRETION_LABELS[service.discretionLevel];
          const hasMulti = service.multiSystemRequirements && service.multiSystemRequirements.length > 0;

          return (
            <div
              key={service.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 hover:border-slate-700 hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                {/* Card Top: Badges & Category */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[11px] font-medium text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md">
                    {CATEGORY_LABELS[service.category]?.label || service.category}
                  </span>

                  {/* Discretion badge */}
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                      service.discretionLevel === 'green'
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : service.discretionLevel === 'yellow'
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {disc.badge}
                  </span>
                </div>

                {/* Service Title */}
                <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition line-clamp-1">
                  {service.title}
                </h4>

                <p className="text-xs text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">
                  {service.description}
                </p>

                {/* Portal & Duration */}
                <div className="mt-3 flex items-center justify-between text-xs text-slate-300 border-t border-slate-800/80 pt-2.5">
                  <span className="truncate max-w-[180px] font-medium text-cyan-400">
                    {service.portalName}
                  </span>
                  <span className="flex items-center gap-1 text-slate-400 shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    <span>~{service.estMinutes} دقیقه</span>
                  </span>
                </div>

                {/* Multi-System Alert Tag if applicable */}
                {hasMulti && (
                  <div className="mt-2 bg-indigo-950/40 border border-indigo-800/40 rounded-lg px-2.5 py-1 text-[11px] text-indigo-300 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
                    <span className="truncate">نیازمند استعلام از {service.multiSystemRequirements!.length} سامانه موازی</span>
                  </div>
                )}
              </div>

              {/* Price & Action Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <div className="flex items-baseline justify-between mb-3">
                  <div className="text-right">
                    <div className="text-base font-extrabold text-emerald-400">
                      {formatToman(service.tomanPrice)}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      معادل {formatRial(service.rialPrice)} ({service.unit})
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setActiveServiceModal(service)}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2 px-2.5 rounded-xl border border-slate-700 transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>کارت خدمت</span>
                  </button>

                  <button
                    onClick={() => onSelectServiceForAssistant(service)}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-2 px-2.5 rounded-xl transition flex items-center justify-center gap-1 shadow-sm shadow-emerald-600/30 cursor-pointer"
                  >
                    <span>ارسال به میز کار</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-14 bg-slate-900 border border-slate-800 rounded-2xl">
          <AlertCircle className="w-10 h-10 text-slate-500 mx-auto mb-2" />
          <h4 className="text-base font-bold text-white">خدمتی با این مشخصات یافت نشد</h4>
          <p className="text-xs text-slate-400 mt-1">
            عبارت جستجو را تغییر دهید یا فیلتر رسته را روی «همه رسته‌ها» بگذارید.
          </p>
        </div>
      )}

      {/* Full Service Card Modal */}
      {activeServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-6 shadow-2xl space-y-5 text-right relative">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    {CATEGORY_LABELS[activeServiceModal.category]?.label}
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                      activeServiceModal.discretionLevel === 'green'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : activeServiceModal.discretionLevel === 'yellow'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {DISCRETION_LABELS[activeServiceModal.discretionLevel].badge}
                  </span>
                  <span className="text-xs text-slate-500">
                    نسخه {activeServiceModal.version}
                  </span>
                </div>
                <h3 className="text-lg font-black text-white">
                  {activeServiceModal.title}
                </h3>
                <p className="text-xs text-cyan-400 mt-1 flex items-center gap-1.5">
                  <span>سامانه مرجع: {activeServiceModal.portalName}</span>
                  {activeServiceModal.portalUrl && (
                    <a
                      href={activeServiceModal.portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-white"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </p>
              </div>

              <button
                onClick={() => setActiveServiceModal(null)}
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Price Box */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs text-slate-400 font-medium">تعرفه مصوب نرخ‌نامه سال ۱۴۰۵ (دستمزد کافی‌نت):</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-emerald-400">
                    {formatToman(activeServiceModal.tomanPrice)}
                  </span>
                  <span className="text-sm font-semibold text-slate-300">
                    ({formatRial(activeServiceModal.rialPrice)})
                  </span>
                </div>
              </div>
              <div className="text-xs text-slate-300 bg-slate-900/90 px-3 py-2 rounded-xl border border-slate-700/60">
                واحد محاسبه: <span className="text-white font-bold">{activeServiceModal.unit}</span>
              </div>
            </div>

            {/* Multi-System Parallel Requirements if any */}
            {activeServiceModal.multiSystemRequirements && activeServiceModal.multiSystemRequirements.length > 0 && (
              <div className="bg-indigo-950/40 border border-indigo-800/50 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <span>سامانه‌ها و استعلام‌های جانبی مورد نیاز برای تکمیل این خدمت:</span>
                </div>
                <div className="space-y-2">
                  {activeServiceModal.multiSystemRequirements.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-900/80 border border-indigo-900/40 rounded-xl p-2.5 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5"
                    >
                      <div>
                        <span className="font-semibold text-white">{item.system}</span>
                        <p className="text-slate-400 text-[11px] mt-0.5">{item.description}</p>
                      </div>
                      {item.costToman ? (
                        <span className="bg-indigo-500/20 text-indigo-300 font-bold px-2 py-0.5 rounded text-[11px] shrink-0">
                          هزینه دولتی: {formatToman(item.costToman)}
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">بدون کارمزد مازاد</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Documents & Prerequisites */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Required Documents */}
              <div className="bg-slate-800/50 border border-slate-800 rounded-2xl p-4 space-y-2.5">
                <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>مدارک و اطلاعات لازم مشتری</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {activeServiceModal.requiredDocuments.map((doc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Prerequisites */}
              <div className="bg-slate-800/50 border border-slate-800 rounded-2xl p-4 space-y-2.5">
                <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-cyan-400" />
                  <span>پیش‌نیازهای سیستمی و حقوقی</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {activeServiceModal.prerequisites.map((pre, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <span>{pre}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Step by Step Guide */}
            <div className="bg-slate-800/50 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>مراحل قدم‌به‌قدم اجرایی برای پرسنل</span>
              </h4>
              <ol className="space-y-2 text-xs text-slate-300">
                {activeServiceModal.stepByStep.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-[11px] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Common Errors & Fixes */}
            <div className="bg-rose-950/20 border border-rose-900/40 rounded-2xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <span>خطاهای رایج سامانه‌ای و راه‌حل رفع آنها</span>
              </h4>
              <div className="space-y-2.5">
                {activeServiceModal.commonErrors.map((item, idx) => (
                  <div key={idx} className="bg-slate-900/90 border border-rose-900/30 rounded-xl p-3 text-xs space-y-1">
                    <div className="font-bold text-rose-400 flex items-center gap-1">
                      <span>خطا:</span>
                      <span>{item.error}</span>
                    </div>
                    <div className="text-slate-300 flex items-start gap-1">
                      <span className="text-emerald-400 font-bold shrink-0">راه‌حل:</span>
                      <span className="leading-relaxed">{item.solution}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Referral conditions (When to escalate to employer) */}
            <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>شرایط ارجاع به کارفرما (استثنائات):</span>
              </h4>
              <ul className="space-y-1 text-xs text-slate-400">
                {activeServiceModal.referralConditions.map((cond, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-rose-400">•</span>
                    <span>{cond}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-400">
                زمان تخمینی انجام خدمت: <span className="text-white font-semibold">{activeServiceModal.estMinutes} دقیقه</span>
              </div>
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  onClick={() => setActiveServiceModal(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  بستن
                </button>
                <button
                  onClick={() => {
                    const s = activeServiceModal;
                    setActiveServiceModal(null);
                    onSelectServiceForAssistant(s);
                  }}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/30"
                >
                  <span>شروع خدمت روی میز کار</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
