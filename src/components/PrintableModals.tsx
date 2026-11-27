import React from 'react';
import { 
  SERVICES_DATABASE, 
  OFFICIAL_TARIFF_DATE, 
  OFFICIAL_TARIFF_VERSION, 
  UNION_NAME 
} from '../data/servicesData';
import { 
  formatRial, 
  formatToman, 
  formatNumberWithCommas 
} from '../utils/formatters';
import { 
  Printer, 
  X, 
  Building2, 
  FileText, 
  AlertTriangle, 
  CheckCircle,
  Phone,
  MapPin,
  Mail
} from 'lucide-react';
import { DelegationEmployee } from '../types';

interface PrintableModalsProps {
  activePrintType: 'tariff' | 'receipt' | 'deficiency' | 'weekly_meeting' | null;
  onClose: () => void;
  receiptData?: any;
  deficiencyData?: { serviceTitle: string; missingItems: string[] };
  weeklyEmployee?: DelegationEmployee;
}

export const PrintableModals: React.FC<PrintableModalsProps> = ({
  activePrintType,
  onClose,
  receiptData,
  deficiencyData,
  weeklyEmployee,
}) => {
  if (!activePrintType) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-y-auto p-6 shadow-2xl relative print:bg-white print:text-black print:border-none print:shadow-none print:max-w-none print:w-full print:p-4 print:max-h-none print:rounded-none">
        
        {/* Modal Top Bar (Hidden in print) */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4 no-print">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              پیش‌نمایش چاپ رسمی
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-emerald-600/30 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>ارسال به چاپگر / ذخیره PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ==================== 1. OFFICIAL TARIFF PRINTOUT ==================== */}
        {activePrintType === 'tariff' && (
          <div className="space-y-6 text-right print:text-black print:bg-white">
            
            {/* Official Header */}
            <div className="border-b-2 border-slate-700 print:border-black pb-4 text-center space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-400 print:text-neutral-600">
                <span>جمهوری اسلامی ایران</span>
                <span className="font-bold text-base text-white print:text-black">بسمه‌تعالی</span>
                <span>تاریخ ابلاغ: {OFFICIAL_TARIFF_DATE}</span>
              </div>
              <h2 className="text-lg font-black text-white print:text-black tracking-tight">
                اتحادیه صنف عکاسان، چاپخانه‌داران و... شهرستان ری
              </h2>
              <h3 className="text-base font-bold text-emerald-400 print:text-neutral-800">
                نرخ خدمات کافی‌نت و اینترنت سال ۱۴۰۵ (خدمات الکترونیک دولتی و عمومی)
              </h3>
              <p className="text-[11px] text-slate-400 print:text-neutral-600">
                کلیه مبالغ بدون احتساب خدمات چاپ و تکثیر می‌باشد • درج قیمت به ریال و تومان با جداکننده سه رقمی
              </p>
            </div>

            {/* Official Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-800 print:bg-neutral-100 text-slate-200 print:text-black border-y border-slate-700 print:border-neutral-300">
                    <th className="py-2.5 px-3 font-bold w-12 text-center">ردیف</th>
                    <th className="py-2.5 px-3 font-bold">نوع خدمات الکترونیک</th>
                    <th className="py-2.5 px-3 font-bold text-left">قیمت مصوب (ریال)</th>
                    <th className="py-2.5 px-3 font-bold text-left">معادل مصوب (تومان)</th>
                    <th className="py-2.5 px-3 font-bold text-center w-24">سطح اختیار</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 print:divide-neutral-200">
                  {SERVICES_DATABASE.map((service, index) => (
                    <tr
                      key={service.id}
                      className="hover:bg-slate-800/40 print:hover:bg-transparent"
                    >
                      <td className="py-2 px-3 text-center text-slate-400 print:text-neutral-500 font-mono">
                        {index + 1}
                      </td>
                      <td className="py-2 px-3 font-medium text-slate-100 print:text-black">
                        <div>{service.title}</div>
                        <div className="text-[10px] text-slate-500 print:text-neutral-500">
                          {service.portalName} • واحد: {service.unit}
                        </div>
                      </td>
                      <td className="py-2 px-3 text-left font-mono font-semibold text-slate-300 print:text-black">
                        {formatNumberWithCommas(service.rialPrice)} ریال
                      </td>
                      <td className="py-2 px-3 text-left font-mono font-bold text-emerald-400 print:text-black">
                        {formatNumberWithCommas(service.tomanPrice)} تومان
                      </td>
                      <td className="py-2 px-3 text-center text-[10px]">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold ${
                            service.discretionLevel === 'green'
                              ? 'bg-emerald-500/15 text-emerald-400 print:text-neutral-800'
                              : service.discretionLevel === 'yellow'
                              ? 'bg-amber-500/15 text-amber-300 print:text-neutral-800'
                              : 'bg-rose-500/15 text-rose-400 print:text-neutral-800'
                          }`}
                        >
                          {service.discretionLevel === 'green' ? 'سبز' : service.discretionLevel === 'yellow' ? 'زرد' : 'قرمز'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Official Union Footer from PDF */}
            <div className="pt-4 border-t-2 border-slate-700 print:border-black flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 print:text-neutral-600 gap-3">
              <div className="space-y-1 text-center sm:text-right">
                <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 print:text-black" />
                  <span>شهرری، خیابان قم، خیابان غیبی، نبش خیابان کاشانی، پلاک ۶۶، طبقه اول</span>
                </div>
                <div className="flex items-center gap-3 justify-center sm:justify-start">
                  <span>صندوق پستی: ۸۸۴۷۶ - ۱۸۴۳۷</span>
                  <span>•</span>
                  <span>تلفن: ۵۵۹۵۱۷۹۲ - ۰۹۰۲۹۶۵۸۲۴۱</span>
                </div>
              </div>

              {/* Union Stamp Simulation */}
              <div className="border border-slate-600 print:border-neutral-400 rounded-xl p-3 text-center min-w-[150px]">
                <div className="text-[10px] text-slate-400 print:text-neutral-600">مهر و امضای رئیس اتحادیه:</div>
                <div className="text-xs font-bold text-white print:text-black mt-1">امیر علی اصغر</div>
                <div className="text-[9px] text-slate-500 print:text-neutral-500">رئیس اتحادیه شهرستان ری</div>
              </div>
            </div>

          </div>
        )}

        {/* ==================== 2. CUSTOMER 2-PART INVOICE PRINTOUT ==================== */}
        {activePrintType === 'receipt' && (
          <div className="space-y-6 text-right print:text-black print:bg-white max-w-xl mx-auto">
            
            {/* Receipt Header */}
            <div className="border-b-2 border-slate-700 print:border-black pb-4 text-center space-y-1">
              <h2 className="text-base font-black text-white print:text-black">
                فاکتور رسمی خدمات الکترونیک و کافی‌نت
              </h2>
              <p className="text-xs text-slate-400 print:text-neutral-600">
                بر اساس نرخ‌نامه مصوب سال ۱۴۰۵ اتحادیه صنف شهرستان ری
              </p>
              <div className="pt-2 flex justify-between text-xs text-slate-400 print:text-neutral-600 border-t border-slate-800 print:border-neutral-300">
                <span>نام مشتری: <strong className="text-white print:text-black">{receiptData?.clientName || 'مشتری گرامی'}</strong></span>
                <span>شماره تماس: <strong className="text-white print:text-black">{receiptData?.clientPhone || '-'}</strong></span>
                <span>تاریخ: <strong className="text-white print:text-black">{receiptData?.date || 'امروز'}</strong></span>
              </div>
            </div>

            {/* Part 1: Cafe Service Fee */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-400 print:text-black block border-b border-slate-800 print:border-neutral-300 pb-1">
                بخش اول: دستمزد خدمات اپراتور کافی‌نت (طبق نرخ‌نامه مصوب)
              </span>
              <div className="bg-slate-800/60 print:bg-neutral-50 p-3 rounded-xl border border-slate-700 print:border-neutral-200 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-white print:text-black">{receiptData?.serviceTitle || 'ثبت خدمت'}</span>
                  <p className="text-[10px] text-slate-400 print:text-neutral-500">
                    سامانه: {receiptData?.portalName || '-'} ({receiptData?.unit || 'هر فقره'})
                  </p>
                </div>
                <div className="text-left font-mono font-bold text-emerald-400 print:text-black">
                  {formatToman(receiptData?.cafeFeeToman || 150000)}
                </div>
              </div>
            </div>

            {/* Part 2: Government Direct Portal Fees */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-indigo-400 print:text-black block border-b border-slate-800 print:border-neutral-300 pb-1">
                بخش دوم: واریزی‌های مستقیم سامانه‌های دولتی
              </span>
              
              {receiptData?.govFees && receiptData.govFees.length > 0 ? (
                <div className="space-y-1.5">
                  {receiptData.govFees.map((fee: any, i: number) => (
                    <div
                      key={i}
                      className="bg-slate-800/60 print:bg-neutral-50 p-2.5 rounded-xl border border-slate-700 print:border-neutral-200 flex justify-between items-center text-xs"
                    >
                      <span className="text-slate-200 print:text-black">{fee.title}</span>
                      <span className="font-mono text-indigo-300 print:text-black">{formatToman(fee.costToman)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-xs text-slate-400 print:text-neutral-600 pt-1">
                    <span>مجموع واریزی به حساب دولت:</span>
                    <span className="font-bold font-mono text-indigo-300 print:text-black">
                      {formatToman(receiptData?.totalGovFeeToman || 0)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-400 print:text-neutral-500 italic p-2 bg-slate-800/40 print:bg-neutral-50 rounded-xl">
                  این خدمت فاقد هزینه استعلام یا عوارض دولتی مازاد می‌باشد.
                </div>
              )}
            </div>

            {/* Grand Total */}
            <div className="border-t-2 border-slate-700 print:border-black pt-3 space-y-1">
              <div className="bg-slate-800 print:bg-neutral-100 p-3.5 rounded-2xl flex justify-between items-center text-sm font-black text-white print:text-black">
                <span>مجموع کل پرداختی مشتری:</span>
                <div className="text-left font-mono">
                  <span className="text-emerald-400 print:text-black">{formatToman(receiptData?.grandTotalToman || 150000)}</span>
                  <div className="text-[10px] text-slate-400 print:text-neutral-500 font-normal">
                    معادل {formatRial(receiptData?.grandTotalRial || 1500000)}
                  </div>
                </div>
              </div>
            </div>

            {/* Receipt Footer & Confidentiality Guarantee */}
            <div className="text-center text-[10px] text-slate-500 print:text-neutral-500 pt-3 border-t border-slate-800 print:border-neutral-300 space-y-1">
              <p>ضمن تشکر از اعتماد شما، هیچ‌یک از رمزها یا اطلاعات خصوصی شما در سیستم ذخیره نمی‌شود.</p>
              <p>این فاکتور دارای شناسه رهگیری الکترونیک رسمی می‌باشد.</p>
            </div>

          </div>
        )}

        {/* ==================== 3. CLIENT DEFICIENCY SHEET PRINTOUT ==================== */}
        {activePrintType === 'deficiency' && (
          <div className="space-y-6 text-right print:text-black print:bg-white max-w-xl mx-auto">
            
            <div className="border-b-2 border-slate-700 print:border-black pb-4 text-center space-y-1">
              <h2 className="text-base font-black text-white print:text-black">
                برگه کسری مدارک و مراجعه مجدد متقاضی
              </h2>
              <p className="text-xs text-slate-400 print:text-neutral-600">
                مرکز خدمات رایانه و اینترنت شهرستان ری
              </p>
            </div>

            <div className="bg-amber-950/20 print:bg-neutral-50 border border-amber-900/40 print:border-neutral-300 p-4 rounded-2xl space-y-2 text-xs">
              <span className="font-bold text-amber-300 print:text-black block">
                متقاضی محترم خدمت: {deficiencyData?.serviceTitle || 'ثبت خدمت'}
              </span>
              <p className="text-slate-300 print:text-neutral-700 leading-relaxed">
                به منظور انجام بدون نقص و جلوگیری از رد شدن درخواست شما در سامانه‌های دولتی، لطفاً هنگام مراجعه بعدی موارد تیک‌خورده زیر را به همراه داشته باشید:
              </p>
            </div>

            {/* Missing items checklist */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-white print:text-black block border-b border-slate-800 print:border-neutral-300 pb-1">
                فهرست مدارک مورد نیاز:
              </span>
              <div className="space-y-2">
                {deficiencyData?.missingItems && deficiencyData.missingItems.length > 0 ? (
                  deficiencyData.missingItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-slate-700 print:border-neutral-300 flex items-center gap-2 bg-slate-800/50 print:bg-white"
                    >
                      <span className="w-4 h-4 rounded border border-rose-500 bg-rose-500/20 flex items-center justify-center text-[10px] text-rose-300 print:text-black font-bold">
                        ✕
                      </span>
                      <span className="font-medium text-slate-200 print:text-black">{item}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-slate-400">موردی ثبت نشده است.</div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 print:border-neutral-300 text-xs text-slate-400 print:text-neutral-600 flex justify-between">
              <span>ساعات پاسخگویی: ۸ صبح الی ۲۰ شب</span>
              <span>تلفن تماس: ۵۵۹۵۱۷۹۲</span>
            </div>

          </div>
        )}

        {/* ==================== 4. WEEKLY MEETING SHEET PRINTOUT ==================== */}
        {activePrintType === 'weekly_meeting' && weeklyEmployee && (
          <div className="space-y-6 text-right print:text-black print:bg-white max-w-2xl mx-auto">
            
            <div className="border-b-2 border-slate-700 print:border-black pb-4 text-center space-y-1">
              <h2 className="text-base font-black text-white print:text-black">
                صورت‌جلسه هفتگی ۱۰ دقیقه‌ای منتورینگ و تفویض اختیار
              </h2>
              <p className="text-xs text-slate-400 print:text-neutral-600">
                انتقال تجربه ۱۵ ساله • کارفرما و پرسنل
              </p>
              <div className="pt-2 flex justify-between text-xs text-slate-400 print:text-neutral-600">
                <span>کارمند: <strong className="text-white print:text-black">{weeklyEmployee.name} ({weeklyEmployee.role})</strong></span>
                <span>سطح اختیار فعلی: <strong className="text-white print:text-black">سطح {weeklyEmployee.delegationLevel}</strong></span>
                <span>مرحله منتورینگ: <strong className="text-white print:text-black">مرحله {weeklyEmployee.mentoringStage}</strong></span>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="border border-slate-700 print:border-neutral-300 p-4 rounded-2xl space-y-1.5">
                <span className="font-bold text-emerald-400 print:text-black block">
                  پرسش ۱: «چه کار کردی؟» (مرور دستاوردها و تصمیمات مستقل):
                </span>
                <p className="text-slate-300 print:text-neutral-800 leading-relaxed">
                  {weeklyEmployee.weeklyReflection.whatDidWell}
                </p>
              </div>

              <div className="border border-slate-700 print:border-neutral-300 p-4 rounded-2xl space-y-1.5">
                <span className="font-bold text-amber-400 print:text-black block">
                  پرسش ۲: «کجا گیر کردی؟» (خطاهای سامانه، تردید در تصمیم یا مشتری معترض):
                </span>
                <p className="text-slate-300 print:text-neutral-800 leading-relaxed">
                  {weeklyEmployee.weeklyReflection.whereGotStuck}
                </p>
              </div>

              <div className="border border-slate-700 print:border-neutral-300 p-4 rounded-2xl space-y-1.5">
                <span className="font-bold text-teal-400 print:text-black block">
                  پرسش ۳: «دفعه بعد چه چیزی را متفاوت انجام می‌دهی؟» (درس‌آموخته کارمند):
                </span>
                <p className="text-slate-300 print:text-neutral-800 leading-relaxed">
                  {weeklyEmployee.weeklyReflection.whatToDoDifferently}
                </p>
              </div>
            </div>

            <div className="border-t-2 border-slate-700 print:border-black pt-4 flex justify-between text-xs text-slate-400 print:text-neutral-600">
              <div className="text-center min-w-[120px]">
                <span>امضای کارمند:</span>
                <div className="h-10" />
                <span className="font-bold text-white print:text-black">{weeklyEmployee.name}</span>
              </div>
              <div className="text-center min-w-[120px]">
                <span>امضای کارفرما (منتور):</span>
                <div className="h-10" />
                <span className="font-bold text-white print:text-black">مدیریت واحد صنفی</span>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
