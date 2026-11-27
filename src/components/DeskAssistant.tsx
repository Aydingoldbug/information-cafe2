import React, { useState, useEffect } from 'react';
import { 
  ServiceItem, 
  DiscretionLevel, 
  ReferralTicket, 
  UserRole 
} from '../types';
import { SERVICES_DATABASE, DISCRETION_LABELS } from '../data/servicesData';
import { 
  formatRial, 
  formatToman, 
  formatNumberWithCommas 
} from '../utils/formatters';
import { 
  CheckSquare, 
  Square, 
  Calculator, 
  AlertTriangle, 
  ShieldAlert, 
  ExternalLink, 
  CheckCircle2, 
  Send, 
  RotateCcw, 
  Printer, 
  Sparkles,
  Lock,
  Layers,
  ArrowRight,
  Plus,
  Trash2,
  FileCheck
} from 'lucide-react';

interface DeskAssistantProps {
  currentRole: UserRole;
  selectedService: ServiceItem | null;
  onSelectService: (service: ServiceItem | null) => void;
  onCreateReferralTicket: (ticket: Omit<ReferralTicket, 'id' | 'createdAt' | 'status'>) => void;
  onOpenReceiptModal: (receiptData: any) => void;
}

export const DeskAssistant: React.FC<DeskAssistantProps> = ({
  currentRole,
  selectedService,
  onSelectService,
  onCreateReferralTicket,
  onOpenReceiptModal,
}) => {
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [customGovFees, setCustomGovFees] = useState<{ title: string; costToman: number }[]>([]);
  const [newFeeTitle, setNewFeeTitle] = useState('');
  const [newFeeAmount, setNewFeeAmount] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');

  // Referral Modal State
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [ticketReason, setTicketReason] = useState<ReferralTicket['reasonCategory']>('خطای لاینحل سامانه');
  const [ticketPriority, setTicketPriority] = useState<ReferralTicket['priority']>('فوری');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketSuggestedAction, setTicketSuggestedAction] = useState('');

  // Sync state when service changes
  useEffect(() => {
    if (selectedService) {
      setCheckedDocs({});
      setCompletedSteps({});
      
      // Load preset multi-system costs if any
      if (selectedService.multiSystemRequirements) {
        const presets = selectedService.multiSystemRequirements
          .filter((req) => req.costToman && req.costToman > 0)
          .map((req) => ({
            title: req.system,
            costToman: req.costToman!,
          }));
        setCustomGovFees(presets);
      } else {
        setCustomGovFees([]);
      }
    }
  }, [selectedService]);

  const toggleDoc = (doc: string) => {
    setCheckedDocs((prev) => ({ ...prev, [doc]: !prev[doc] }));
  };

  const toggleStep = (stepIdx: number) => {
    setCompletedSteps((prev) => ({ ...prev, [stepIdx]: !prev[stepIdx] }));
  };

  const handleAddGovFee = () => {
    const cost = parseInt(newFeeAmount.replace(/,/g, ''), 10);
    if (!newFeeTitle || isNaN(cost) || cost <= 0) return;
    setCustomGovFees((prev) => [...prev, { title: newFeeTitle, costToman: cost }]);
    setNewFeeTitle('');
    setNewFeeAmount('');
  };

  const handleRemoveGovFee = (idx: number) => {
    setCustomGovFees((prev) => prev.filter((_, i) => i !== idx));
  };

  // Financial calculations
  const cafeFeeToman = selectedService ? selectedService.tomanPrice : 0;
  const totalGovFeeToman = customGovFees.reduce((acc, curr) => acc + curr.costToman, 0);
  const grandTotalToman = cafeFeeToman + totalGovFeeToman;

  const allDocsChecked = selectedService
    ? selectedService.requiredDocuments.every((d) => checkedDocs[d])
    : false;

  const allStepsCompleted = selectedService
    ? selectedService.stepByStep.every((_, idx) => completedSteps[idx])
    : false;

  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    onCreateReferralTicket({
      clientName: clientName || 'مشتری حضوری',
      clientPhone: clientPhone || 'ثبت نشده',
      serviceId: selectedService.id,
      serviceTitle: selectedService.title,
      staffName: currentRole === 'owner' ? 'کارفرما' : currentRole === 'supervisor' ? 'علی صادقی (ناظر)' : 'سارا کریمی (متصدی)',
      discretionLevel: selectedService.discretionLevel,
      priority: ticketPriority,
      reasonCategory: ticketReason,
      description: ticketDescription,
      suggestedAction: ticketSuggestedAction || 'نیازمند بررسی توسط کارفرما',
    });

    setShowReferralModal(false);
    setTicketDescription('');
    setTicketSuggestedAction('');
  };

  const handleGenerateReceipt = () => {
    if (!selectedService) return;
    onOpenReceiptModal({
      clientName: clientName || 'مشتری گرامی',
      clientPhone: clientPhone || '-',
      serviceTitle: selectedService.title,
      portalName: selectedService.portalName,
      unit: selectedService.unit,
      cafeFeeToman,
      cafeFeeRial: cafeFeeToman * 10,
      govFees: customGovFees,
      totalGovFeeToman,
      grandTotalToman,
      grandTotalRial: grandTotalToman * 10,
      date: new Date().toLocaleDateString('fa-IR'),
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Confidentiality Guarantee */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/40 border border-amber-500/30 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between text-xs text-amber-300">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white">قانون محرمانگی میز کار: </span>
            <span className="text-amber-200">
              دستیار هوشمند هرگز رمزهای بانکی، ثنا یا اطلاعات هویتی مراجعین را در هیچ سروری ذخیره نمی‌کند.
            </span>
          </div>
        </div>
        <span className="hidden sm:inline bg-amber-500/10 text-amber-300 px-2.5 py-1 rounded-md border border-amber-500/20 font-semibold text-[11px]">
          امنیت تضمین‌شده
        </span>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (Lg 4): Service Selector & Client Details */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Service Picker */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <label className="block text-xs font-bold text-slate-300">
              انتخاب خدمت جاری جهت پردازش:
            </label>
            <select
              value={selectedService?.id || ''}
              onChange={(e) => {
                const s = SERVICES_DATABASE.find((item) => item.id === e.target.value) || null;
                onSelectService(s);
              }}
              className="w-full bg-slate-800 text-white text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="">-- یک خدمت را انتخاب کنید --</option>
              {SERVICES_DATABASE.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title} ({formatToman(s.tomanPrice)})
                </option>
              ))}
            </select>

            {/* Quick Client Info Fields */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">نام متقاضی:</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="مثلاً: علی رضایی"
                  className="w-full bg-slate-800 text-white text-xs py-1.5 px-2.5 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">شماره تماس:</label>
                <input
                  type="text"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="0912..."
                  className="w-full bg-slate-800 text-white text-xs py-1.5 px-2.5 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Service Overview Card */}
          {selectedService && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3.5">
              
              <div className="flex items-start justify-between">
                <div>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                      selectedService.discretionLevel === 'green'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : selectedService.discretionLevel === 'yellow'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {DISCRETION_LABELS[selectedService.discretionLevel].title}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-1.5">
                    {selectedService.title}
                  </h3>
                </div>
              </div>

              {/* Portal Info */}
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-300">
                  <span>سامانه مرجع:</span>
                  <span className="font-semibold text-cyan-400">{selectedService.portalName}</span>
                </div>
                {selectedService.portalUrl && (
                  <div className="text-left pt-1">
                    <a
                      href={selectedService.portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-cyan-300 hover:underline inline-flex items-center gap-1"
                    >
                      <span>ورود به پرتال سامانه</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* Action Buttons: Red Ticket Trigger */}
              <div className="pt-2">
                <button
                  onClick={() => setShowReferralModal(true)}
                  className="w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold py-2.5 px-3 rounded-xl border border-rose-500/30 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>ثبت تیکت ارجاع به کارفرما (استثنا)</span>
                </button>
              </div>

            </div>
          )}

          {/* Pricing & Fee Calculator Panel */}
          {selectedService && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white border-b border-slate-800 pb-2">
                <Calculator className="w-4 h-4 text-emerald-400" />
                <span>محاسبه‌گر فاکتور دوتکه (کافی‌نت + واریزی دولتی)</span>
              </div>

              {/* Cafe Fee */}
              <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/80 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-200">دستمزد خدمات کافی‌نت:</span>
                  <p className="text-[10px] text-slate-400">بر اساس نرخ‌نامه مصوب ۱۴۰۵</p>
                </div>
                <div className="text-left font-black text-emerald-400">
                  {formatToman(cafeFeeToman)}
                </div>
              </div>

              {/* Custom Government Fees List */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 block">
                  واریزی‌های مستقیم به سامانه‌های دولتی:
                </span>
                
                {customGovFees.map((fee, idx) => (
                  <div
                    key={idx}
                    className="bg-indigo-950/30 border border-indigo-900/40 rounded-xl px-2.5 py-2 text-xs flex items-center justify-between"
                  >
                    <div>
                      <span className="text-white font-medium">{fee.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-indigo-300 font-bold">
                        {formatToman(fee.costToman)}
                      </span>
                      <button
                        onClick={() => handleRemoveGovFee(idx)}
                        className="text-slate-500 hover:text-rose-400 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add new custom fee input */}
                <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700 space-y-2">
                  <div className="grid grid-cols-2 gap-1.5">
                    <input
                      type="text"
                      placeholder="عنوان واریزی دولتی (مثلا خلافی)"
                      value={newFeeTitle}
                      onChange={(e) => setNewFeeTitle(e.target.value)}
                      className="bg-slate-900 text-white text-[11px] px-2 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <input
                      type="number"
                      placeholder="مبلغ به تومان"
                      value={newFeeAmount}
                      onChange={(e) => setNewFeeAmount(e.target.value)}
                      className="bg-slate-900 text-white text-[11px] px-2 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-left"
                    />
                  </div>
                  <button
                    onClick={handleAddGovFee}
                    className="w-full bg-indigo-600/80 hover:bg-indigo-600 text-white text-[11px] font-semibold py-1 rounded-lg transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>افزودن واریزی دولتی به فاکتور</span>
                  </button>
                </div>
              </div>

              {/* Total Summary */}
              <div className="pt-2 border-t border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>مجموع واریزی‌های دولتی:</span>
                  <span className="font-bold text-indigo-300">{formatToman(totalGovFeeToman)}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-white bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                  <span>مجموع کل دریافتی از مشتری:</span>
                  <div className="text-left">
                    <span className="text-emerald-400">{formatToman(grandTotalToman)}</span>
                    <p className="text-[10px] text-slate-400 font-normal">
                      معادل {formatRial(grandTotalToman * 10)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleGenerateReceipt}
                  className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>صدور فاکتور / رسید چاپی مشتری</span>
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Right Column (Lg 8): Interactive Step-by-Step Desk Guidance */}
        <div className="lg:col-span-8 space-y-4">
          
          {!selectedService ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center space-y-3">
              <FileCheck className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">میز کار در انتظار انتخاب خدمت است</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                از منوی سمت راست یک خدمت را انتخاب کنید تا چک‌لیست مدارک، اعتبارسنجی شاهکار، گام‌های اجرایی و رفع خطاهای لحظه‌ای فعال شوند.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Checklist 1: Required Documents Verification */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">
                      گام ۱: تطبیق و احراز چک‌لیست مدارک مشتری
                    </h3>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    allDocsChecked ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {Object.values(checkedDocs).filter(Boolean).length} از {selectedService.requiredDocuments.length} مدرک
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {selectedService.requiredDocuments.map((doc, idx) => {
                    const isChecked = !!checkedDocs[doc];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleDoc(doc)}
                        className={`p-3 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition select-none ${
                          isChecked
                            ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                            : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        <span className="font-medium leading-relaxed">{doc}</span>
                        {isChecked ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-500 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {!allDocsChecked && (
                  <div className="bg-amber-950/30 border border-amber-900/40 rounded-xl p-3 text-xs text-amber-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      هشدار: تا زمانی که تمامی مدارک فوق از مشتری دریافت و تطبیق داده نشده است، ثبت نهایی نکنید تا از بازگشت کار جلوگیری شود.
                    </span>
                  </div>
                )}
              </div>

              {/* Checklist 2: Step-by-Step Guided Execution */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-amber-400" />
                    <h3 className="text-sm font-bold text-white">
                      گام ۲: راهنمای قدم‌به‌قدم انجام خدمت در سامانه
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400">
                    {Object.values(completedSteps).filter(Boolean).length} از {selectedService.stepByStep.length} مرحله
                  </span>
                </div>

                <div className="space-y-2.5">
                  {selectedService.stepByStep.map((step, idx) => {
                    const isDone = !!completedSteps[idx];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleStep(idx)}
                        className={`p-3.5 rounded-xl border text-xs flex items-start gap-3 cursor-pointer transition select-none ${
                          isDone
                            ? 'bg-slate-800/40 border-emerald-500/40 opacity-75'
                            : 'bg-slate-800/90 border-slate-700 hover:border-amber-500/50'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                          isDone ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-200'
                        }`}>
                          {idx + 1}
                        </span>
                        <div className="flex-1">
                          <p className={`leading-relaxed ${isDone ? 'line-through text-slate-400' : 'text-slate-100 font-medium'}`}>
                            {step}
                          </p>
                        </div>
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {allStepsCompleted && (
                  <div className="bg-emerald-950/60 border border-emerald-500/50 rounded-xl p-3.5 text-xs text-emerald-300 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span className="font-bold">تمامی گام‌های خدمت با موفقیت ثبت و تایید گردید.</span>
                    </div>
                    <button
                      onClick={handleGenerateReceipt}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg font-bold text-xs transition"
                    >
                      تسویه و صدور فاکتور
                    </button>
                  </div>
                )}
              </div>

              {/* Instant Error Solver for this Service */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-rose-400 text-sm font-bold">
                  <AlertTriangle className="w-5 h-5" />
                  <span>حل‌کننده لحظه‌ای خطاهای متداول در این خدمت</span>
                </div>
                <div className="grid grid-cols-1 gap-2.5">
                  {selectedService.commonErrors.map((errItem, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 text-xs space-y-1.5"
                    >
                      <div className="text-rose-400 font-bold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                        <span>{errItem.error}</span>
                      </div>
                      <div className="text-slate-300 pr-3 border-r-2 border-emerald-500/60 mr-1 leading-relaxed">
                        <span className="text-emerald-400 font-bold">راه‌حل فوری: </span>
                        {errItem.solution}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* Referral Ticket Creation Modal (سطح قرمز) */}
      {showReferralModal && selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-rose-500/40 rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl space-y-4 text-right">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">ثبت تیکت ارجاع به کارفرما (استثنا)</h3>
                  <p className="text-[11px] text-slate-400">خدمت: {selectedService.title}</p>
                </div>
              </div>
              <button
                onClick={() => setShowReferralModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                انصراف
              </button>
            </div>

            <form onSubmit={handleCreateTicketSubmit} className="space-y-3.5 text-xs">
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 block mb-1">دلیل اصلی ارجاع:</label>
                  <select
                    value={ticketReason}
                    onChange={(e) => setTicketReason(e.target.value as any)}
                    className="w-full bg-slate-800 text-white p-2 rounded-xl border border-slate-700"
                  >
                    <option value="خطای لاینحل سامانه">خطای لاینحل سامانه</option>
                    <option value="اختلاف مالی">اختلاف مالی</option>
                    <option value="نقص مدارک">نقص مدارک / مدارک مشکوک</option>
                    <option value="شکایت یا تنش">شکایت یا تنش مشتری</option>
                    <option value="تصمیم حقوقی/استثنا">تصمیم حقوقی / استثنا</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">میزان فوریت:</label>
                  <select
                    value={ticketPriority}
                    onChange={(e) => setTicketPriority(e.target.value as any)}
                    className="w-full bg-slate-800 text-white p-2 rounded-xl border border-slate-700"
                  >
                    <option value="فوری">فوری (مشتری پشت باجه نشسته)</option>
                    <option value="بحرانی">بحرانی (خطر مالی یا حقوقی)</option>
                    <option value="عادی">عادی (امکان پیگیری تا پایان روز)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">شرح دقیق مشکل یا پیام خطای سامانه:</label>
                <textarea
                  rows={3}
                  required
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  placeholder="توضیح دهید مشتری چه مشکلی دارد یا سامانه چه اروری نشان می‌دهد..."
                  className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">پیشنهاد شما به کارفرما (اختیاری):</label>
                <input
                  type="text"
                  value={ticketSuggestedAction}
                  onChange={(e) => setTicketSuggestedAction(e.target.value)}
                  placeholder="مثلاً: لغو درخواست و بازگشت وجه، یا تماس با پشتیبانی اداره کار"
                  className="w-full bg-slate-800 text-white p-2 rounded-xl border border-slate-700"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowReferralModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-1.5 shadow-lg shadow-rose-600/30"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>ارسال تیکت به کارفرما</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
