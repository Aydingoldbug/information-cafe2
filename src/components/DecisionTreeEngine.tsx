import React, { useState } from 'react';
import { ServiceItem, DiscretionLevel, UserRole } from '../types';
import { SERVICES_DATABASE } from '../data/servicesData';
import { formatToman } from '../utils/formatters';
import { 
  GitFork, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  FileQuestion, 
  Printer, 
  RotateCcw, 
  ChevronLeft, 
  ArrowRight,
  HelpCircle,
  FileText
} from 'lucide-react';

interface DecisionTreeEngineProps {
  currentRole: UserRole;
  onSelectServiceForAssistant: (service: ServiceItem) => void;
  onOpenDeficiencyPrint: (serviceTitle: string, missingItems: string[]) => void;
}

export const DecisionTreeEngine: React.FC<DecisionTreeEngineProps> = ({
  currentRole,
  onSelectServiceForAssistant,
  onOpenDeficiencyPrint,
}) => {
  const [selectedServiceId, setSelectedServiceId] = useState<string>('sana_register');
  const [stepIndex, setStepIndex] = useState<number>(0);
  
  // Decision states
  const [docsStatus, setDocsStatus] = useState<'complete' | 'incomplete' | 'suspicious' | null>(null);
  const [missingDocsList, setMissingDocsList] = useState<string[]>([]);
  const [shahkarMatch, setShahkarMatch] = useState<'yes' | 'no' | null>(null);
  const [portalCondition, setPortalCondition] = useState<'normal' | 'error_known' | 'server_down' | null>(null);
  const [financialAgreement, setFinancialAgreement] = useState<'agreed' | 'disputed' | null>(null);

  const currentService = SERVICES_DATABASE.find((s) => s.id === selectedServiceId) || SERVICES_DATABASE[0];

  const handleReset = () => {
    setStepIndex(0);
    setDocsStatus(null);
    setMissingDocsList([]);
    setShahkarMatch(null);
    setPortalCondition(null);
    setFinancialAgreement(null);
  };

  const handleAddMissingDoc = (doc: string) => {
    setMissingDocsList((prev) => 
      prev.includes(doc) ? prev.filter((d) => d !== doc) : [...prev, doc]
    );
  };

  // Determine final outcome
  let outcome: {
    level: DiscretionLevel | 'deficiency';
    title: string;
    description: string;
    actionLabel: string;
    actionType: 'proceed' | 'print_missing' | 'ticket' | 'retry';
  } | null = null;

  if (docsStatus === 'incomplete') {
    outcome = {
      level: 'deficiency',
      title: 'مدارک مشتری ناقص است -> صدور برگه کسری مدارک',
      description: 'کار را متوقف کنید. چک‌لیست مدارک ناقص را چاپ کرده و به مشتری تحویل دهید تا پس از تکمیل مدارک مراجعه نماید.',
      actionLabel: 'چاپ برگه کسری مدارک مشتری',
      actionType: 'print_missing',
    };
  } else if (docsStatus === 'suspicious') {
    outcome = {
      level: 'red',
      title: 'مدارک مشکوک یا دارای تناقض -> ارجاع فوری به کارفرما',
      description: 'هرگونه شائبه جعل، کارت ملی مخدوش، مدارک تحصیلی دست‌کاری شده یا هویت ناهمخوان سریعاً نیازمند نظر مستقیم کارفرماست.',
      actionLabel: 'ثبت تیکت امنیتی کارفرما',
      actionType: 'ticket',
    };
  } else if (shahkarMatch === 'no') {
    outcome = {
      level: 'yellow',
      title: 'عدم تطابق شماره همراه با کد ملی (شاهکار)',
      description: 'سامانه‌های دولتی سیم‌کارت غیرمنطبق را مسدود می‌کنند. به مشتری راهکار خرید سیم‌کارت جدید یا تغییر مالکیت را توضیح دهید.',
      actionLabel: 'راهنمایی مشتری به اپراتور سیم‌کارت',
      actionType: 'retry',
    };
  } else if (financialAgreement === 'disputed') {
    outcome = {
      level: 'red',
      title: 'عدم رضایت مودی از مبلغ مالیات/تعرفه -> ارجاع به کارفرما',
      description: 'اگر مشتری به رقم مالیات تبصره ۱۰۰ یا کارمزد مصوب معترض است، خودسرانه وارد فرآیند ارسال قطعی یا تخفیف خارج از ضابطه نشوید.',
      actionLabel: 'ارجاع پرونده به کارفرما',
      actionType: 'ticket',
    };
  } else if (portalCondition === 'server_down') {
    outcome = {
      level: 'yellow',
      title: 'قطعی سراسری سرور دولتی -> ثبت در نوبت و اطلاع‌رسانی',
      description: 'پیام خطای رسمی سرور را به مشتری نشان دهید، شماره تماس وی را یادداشت کنید تا پس از رفع اشکال درگاه اقدام شود.',
      actionLabel: 'ثبت در لیست انتظار مشتریان',
      actionType: 'retry',
    };
  } else if (docsStatus === 'complete' && shahkarMatch === 'yes' && financialAgreement === 'agreed' && portalCondition === 'normal') {
    outcome = {
      level: currentService.discretionLevel,
      title: currentService.discretionLevel === 'green' ? 'مجوز انجام مستقل خدمت (سطح سبز)' : 'مجوز انجام با نظارت سیستمی (سطح زرد)',
      description: 'کلیه شرایط، مدارک، احراز شاهکار و رضایت مالی تایید شد. خدمت را طبق چک‌لیست گام‌به‌گام در میز کار انجام دهید.',
      actionLabel: 'انتقال پرونده به میز کار جهت اجرا',
      actionType: 'proceed',
    };
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GitFork className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">
              موتور رویه و درخت تصمیم تعاملی پرسنل
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            این ماژول پاسخ استاندارد به تمام «چه کنم؟»های روزمره است و جلوی پرسیدن مکرر از کارفرما را می‌گیرد.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedServiceId}
            onChange={(e) => {
              setSelectedServiceId(e.target.value);
              handleReset();
            }}
            className="bg-slate-800 text-white text-xs font-semibold py-2 px-3 rounded-xl border border-slate-700"
          >
            {SERVICES_DATABASE.map((s) => (
              <option key={s.id} value={s.id}>
                خدمت: {s.title}
              </option>
            ))}
          </select>

          <button
            onClick={handleReset}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-xl border border-slate-700 transition"
            title="شروع مجدد درخت تصمیم"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Decision Tree Interactive Stepper */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
        
        {/* Step Indicator */}
        <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
          <span>شاخه تصمیمی خدمت: <strong className="text-white">{currentService.title}</strong></span>
          <span>تعرفه مصوب: <strong className="text-emerald-400">{formatToman(currentService.tomanPrice)}</strong></span>
        </div>

        {/* Step 1: Document completeness */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center text-xs font-bold">۱</span>
            <span>وضعیت مدارک فیزیکی / دیجیتال مشتری چگونه است؟</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => {
                setDocsStatus('complete');
                setStepIndex(1);
              }}
              className={`p-3.5 rounded-2xl border text-right transition cursor-pointer ${
                docsStatus === 'complete'
                  ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/20'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
              }`}
            >
              <div className="font-bold text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>مدارک کامل و منطبق است</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">کلیه کارت‌ها، شناسنامه، سند و شماره‌های لازم موجود است.</p>
            </button>

            <button
              onClick={() => {
                setDocsStatus('incomplete');
                setStepIndex(1);
              }}
              className={`p-3.5 rounded-2xl border text-right transition cursor-pointer ${
                docsStatus === 'incomplete'
                  ? 'bg-amber-950/70 border-amber-500 text-amber-200 ring-2 ring-amber-500/20'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
              }`}
            >
              <div className="font-bold text-xs flex items-center gap-1.5">
                <FileQuestion className="w-4 h-4 text-amber-400" />
                <span>مدارک ناقص است</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">حداقل یکی از مدارک اجباری (کدپستی، سریال، شبا) کسری دارد.</p>
            </button>

            <button
              onClick={() => {
                setDocsStatus('suspicious');
                setStepIndex(1);
              }}
              className={`p-3.5 rounded-2xl border text-right transition cursor-pointer ${
                docsStatus === 'suspicious'
                  ? 'bg-rose-950/70 border-rose-500 text-rose-200 ring-2 ring-rose-500/20'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
              }`}
            >
              <div className="font-bold text-xs flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>مدارک مشکوک یا مخدوش است</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">شائبه جعل یا مغایرت نام صاحب مدرک با مراجعه‌کننده.</p>
            </button>
          </div>

          {/* If incomplete, show checklist picker */}
          {docsStatus === 'incomplete' && (
            <div className="bg-slate-800/70 border border-amber-500/30 rounded-2xl p-4 space-y-2 mt-3">
              <span className="text-xs font-bold text-amber-300">
                کدام مدارک ناقص است؟ (جهت صدور برگه کسری مدارک به مشتری انتخاب کنید):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                {currentService.requiredDocuments.map((doc, idx) => (
                  <label
                    key={idx}
                    className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-700 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={missingDocsList.includes(doc)}
                      onChange={() => handleAddMissingDoc(doc)}
                      className="accent-amber-500"
                    />
                    <span className="text-slate-200">{doc}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Shahkar Validation (Only if docs complete) */}
        {docsStatus === 'complete' && (
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center text-xs font-bold">۲</span>
              <span>آیا سیم‌کارت فعال به نام خود متقاضی (احراز شاهکار) همراه او هست؟</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setShahkarMatch('yes')}
                className={`p-3.5 rounded-2xl border text-right transition cursor-pointer ${
                  shahkarMatch === 'yes'
                    ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/20'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300'
                }`}
              >
                <div className="font-bold text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>بله، سیم‌کارت به نام خود شخص است</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">کد پیامکی احراز هویت مستقیماً به گوشی متقاضی ارسال می‌شود.</p>
              </button>

              <button
                onClick={() => setShahkarMatch('no')}
                className={`p-3.5 rounded-2xl border text-right transition cursor-pointer ${
                  shahkarMatch === 'no'
                    ? 'bg-amber-950/70 border-amber-500 text-amber-200 ring-2 ring-amber-500/20'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300'
                }`}
              >
                <div className="font-bold text-xs flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>خیر، سیم‌کارت به نام فرد دیگری است</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">سیم‌کارت به نام همسر، پدر یا بدون سند قطعی است.</p>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Portal & Server Condition */}
        {docsStatus === 'complete' && shahkarMatch === 'yes' && (
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center text-xs font-bold">۳</span>
              <span>وضعیت پاسخ‌دهی سرور و سامانه دولتی چگونه است؟</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setPortalCondition('normal')}
                className={`p-3.5 rounded-2xl border text-right transition cursor-pointer ${
                  portalCondition === 'normal'
                    ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/20'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300'
                }`}
              >
                <div className="font-bold text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>سامانه باز و عادی است</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">بدون تاخیر و ارور بالا می‌آید.</p>
              </button>

              <button
                onClick={() => setPortalCondition('server_down')}
                className={`p-3.5 rounded-2xl border text-right transition cursor-pointer ${
                  portalCondition === 'server_down'
                    ? 'bg-amber-950/70 border-amber-500 text-amber-200 ring-2 ring-amber-500/20'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300'
                }`}
              >
                <div className="font-bold text-xs flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>سامانه قطع یا دارای اختلال است</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">ارور ۵۰۲ یا قطعی زیرساخت دولت هوشمند.</p>
              </button>

              <button
                onClick={() => setPortalCondition('error_known')}
                className={`p-3.5 rounded-2xl border text-right transition cursor-pointer ${
                  portalCondition === 'error_known'
                    ? 'bg-indigo-950/70 border-indigo-500 text-indigo-200 ring-2 ring-indigo-500/20'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300'
                }`}
              >
                <div className="font-bold text-xs flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-indigo-400" />
                  <span>خطای فیلد یا داده سامانه</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">نیاز به تطبیق با کتابخانه خطا دارد.</p>
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Financial & Customer Consent */}
        {docsStatus === 'complete' && shahkarMatch === 'yes' && portalCondition === 'normal' && (
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center text-xs font-bold">۴</span>
              <span>رضایت مالی مودی و پذیرش مبالغ تعرفه و واریزی</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setFinancialAgreement('agreed')}
                className={`p-3.5 rounded-2xl border text-right transition cursor-pointer ${
                  financialAgreement === 'agreed'
                    ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/20'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300'
                }`}
              >
                <div className="font-bold text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>مشتری تعرفه و واریزی را پذیرفته است</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">هزینه کافی‌نت و هزینه‌های دولتی شفاف اعلام و تایید شد.</p>
              </button>

              <button
                onClick={() => setFinancialAgreement('disputed')}
                className={`p-3.5 rounded-2xl border text-right transition cursor-pointer ${
                  financialAgreement === 'disputed'
                    ? 'bg-rose-950/70 border-rose-500 text-rose-200 ring-2 ring-rose-500/20'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300'
                }`}
              >
                <div className="font-bold text-xs flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>اعتراض مالی / تقاضای تخفیف خارج از سقف</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">مشتری به ارقام اعتراض دارد یا تخفیف بالا می‌خواهد.</p>
              </button>
            </div>
          </div>
        )}

        {/* Final Decision Outcome Card */}
        {outcome && (
          <div className={`p-5 rounded-3xl border space-y-4 animate-in fade-in transition ${
            outcome.level === 'green'
              ? 'bg-emerald-950/80 border-emerald-500'
              : outcome.level === 'yellow' || outcome.level === 'deficiency'
              ? 'bg-amber-950/80 border-amber-500'
              : 'bg-rose-950/80 border-rose-500'
          }`}>
            <div className="flex items-center gap-2.5">
              {outcome.level === 'green' && <CheckCircle2 className="w-6 h-6 text-emerald-400" />}
              {(outcome.level === 'yellow' || outcome.level === 'deficiency') && <AlertTriangle className="w-6 h-6 text-amber-400" />}
              {outcome.level === 'red' && <ShieldAlert className="w-6 h-6 text-rose-400" />}
              <h3 className="text-base font-black text-white">
                {outcome.title}
              </h3>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed">
              {outcome.description}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800/60">
              <span className="text-[11px] text-slate-300">
                دستورالعمل سیستم: از اقدامات خودسرانه پرهیز و رویه مصوب فوق را اجرا نمایید.
              </span>

              {outcome.actionType === 'proceed' && (
                <button
                  onClick={() => onSelectServiceForAssistant(currentService)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer"
                >
                  <span>{outcome.actionLabel}</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}

              {outcome.actionType === 'print_missing' && (
                <button
                  onClick={() => onOpenDeficiencyPrint(currentService.title, missingDocsList.length > 0 ? missingDocsList : currentService.requiredDocuments)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-600/30 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>{outcome.actionLabel}</span>
                </button>
              )}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
