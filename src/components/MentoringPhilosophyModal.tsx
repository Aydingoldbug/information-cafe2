import React from 'react';
import { DELEGATION_PHILOSOPHY } from '../data/delegationData';
import { 
  X, 
  Sparkles, 
  HeartHandshake, 
  CheckCircle2, 
  ShieldAlert, 
  Users, 
  Calendar, 
  HelpCircle,
  Award
} from 'lucide-react';

interface MentoringPhilosophyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MentoringPhilosophyModal: React.FC<MentoringPhilosophyModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-emerald-500/40 text-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl space-y-5 text-right relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                تفویض اختیار مسالمت‌آمیز با روش منتورینگ (تجربه ۱۵ ساله)
              </h3>
              <p className="text-xs text-slate-400">
                چگونه کارفرما از «پاسخ‌دهنده روزمره» به «مالک قواعد و مربی رشد پرسنل» تبدیل می‌شود.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Core Philosophy Box */}
        <div className="bg-gradient-to-r from-emerald-950/60 to-teal-950/60 border border-emerald-500/30 p-4 rounded-2xl text-xs text-emerald-200 leading-relaxed">
          <span className="font-bold text-white block mb-1">💡 ایده‌ی اصلی:</span>
          شما ۱۵ سال تجربه دارید و بخش بزرگی از آن فقط در ذهن شماست. تفویض یعنی این تجربه را قدم‌به‌قدم به سه کارمند منتقل کنید، نه اینکه کار را یکدفعه رها کنید یا با کوچک‌ترین خطا اعتماد را سلب نمایید.
        </div>

        {/* 1. What to delegate vs What to retain */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center">۱</span>
            <span>چه چیزی را بسپارید؟</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700">
              <span className="font-bold text-emerald-400 block mb-1">قابل تفویض (کم‌ریسک و تکراری):</span>
              <p className="text-slate-300">تخفیف جزئی تا سقف مشخص، سفارش کاغذ و جوهر، پاسخ به تلفن، ثبت‌نام‌های معمول نرخ‌نامه.</p>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700">
              <span className="font-bold text-rose-400 block mb-1">نگه‌داشتنی (کارفرما):</span>
              <p className="text-slate-300">تعرفه مصوب، مجوز و مالیات عملکرد، بیمه پرسنل، استخدام و اخراج، تصمیمات حقوقی پرونده‌ها.</p>
            </div>
          </div>
        </div>

        {/* 2. Five Levels of Delegation */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-xs flex items-center justify-center">۲</span>
            <span>پنج سطح اختیار پرسنل:</span>
          </h4>
          <div className="space-y-1.5 text-xs text-slate-300">
            {DELEGATION_PHILOSOPHY.delegationLevelsDesc.map((lvl) => (
              <div key={lvl.level} className="bg-slate-800/40 p-2.5 rounded-xl border border-slate-800 flex items-start gap-2">
                <span className="bg-cyan-500/20 text-cyan-400 font-bold px-2 py-0.5 rounded text-[11px] shrink-0">
                  سطح {lvl.level}
                </span>
                <div>
                  <span className="font-bold text-white">{lvl.title.split(':')[1]}: </span>
                  <span className="text-slate-300">{lvl.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. 4-Stage Mentoring Cycle */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center">۳</span>
            <span>چرخه‌ی چهارمرحله‌ای منتورینگ:</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {DELEGATION_PHILOSOPHY.mentoringCycle.map((stage) => (
              <div key={stage.stage} className="bg-slate-800/40 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-amber-400">{stage.title}</span>
                <p className="text-slate-300 text-[11px]">{stage.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Peaceful Kickoff Dialogue & Handling Mistakes */}
        <div className="bg-slate-800/60 border border-slate-700 p-4 rounded-2xl space-y-2 text-xs">
          <h4 className="font-bold text-white flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>گفت‌وگوی شروع و برخورد با اشتباه:</span>
          </h4>
          <p className="text-slate-300 leading-relaxed">
            در جلسه‌ای ۱۰ تا ۱۵ دقیقه‌ای به پرسنل بگویید: «می‌خواهم تو تصمیم‌های این بخش را بگیری چون به کارت اعتماد دارم و می‌خواهم رشد کنی.»
            هنگام اشتباه: اول مشکل مشتری حل شود؛ بعد در خلوت بپرسید: <em>«چه چیزی باعث شد این تصمیم را بگیری؟ دفعه بعد چه می‌کنی؟»</em> اشتباه یعنی فرصت یادگیری.
          </p>
        </div>

        {/* Close Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer"
          >
            متوجه شدم
          </button>
        </div>

      </div>
    </div>
  );
};
