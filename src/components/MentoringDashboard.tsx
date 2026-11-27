import React, { useState } from 'react';
import { UserRole, ReferralTicket, DelegationEmployee } from '../types';
import { 
  DELEGATION_PHILOSOPHY, 
  INITIAL_EMPLOYEES, 
  INITIAL_TICKETS 
} from '../data/delegationData';
import { 
  formatToman, 
  formatNumberWithCommas 
} from '../utils/formatters';
import { 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  Sparkles, 
  HeartHandshake, 
  Calendar, 
  Award, 
  FileText, 
  HelpCircle,
  MessageSquare,
  Send,
  ThumbsUp,
  AlertCircle
} from 'lucide-react';

interface MentoringDashboardProps {
  currentRole: UserRole;
  tickets: ReferralTicket[];
  onResolveTicket: (ticketId: string, feedback: string) => void;
  onOpenWeeklyMeetingPrint: (employee: DelegationEmployee) => void;
}

export const MentoringDashboard: React.FC<MentoringDashboardProps> = ({
  currentRole,
  tickets,
  onResolveTicket,
  onOpenWeeklyMeetingPrint,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'kpi_and_delegation' | 'mentoring_cycle' | 'weekly_meeting' | 'tickets_inbox'>('kpi_and_delegation');
  const [employees, setEmployees] = useState<DelegationEmployee[]>(INITIAL_EMPLOYEES);
  const [selectedEmpForMeeting, setSelectedEmpForMeeting] = useState<DelegationEmployee>(INITIAL_EMPLOYEES[0]);
  const [ticketResolveNote, setTicketResolveNote] = useState<Record<string, string>>({});

  const handleUpdateLevel = (empId: string, newLevel: 1 | 2 | 3 | 4 | 5) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === empId ? { ...e, delegationLevel: newLevel } : e))
    );
  };

  const handleUpdateStage = (empId: string, newStage: 1 | 2 | 3 | 4) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === empId ? { ...e, mentoringStage: newStage } : e))
    );
  };

  const pendingTickets = tickets.filter((t) => t.status !== 'resolved');

  return (
    <div className="space-y-6">
      
      {/* Top Banner: 15-Year Philosophy Motto */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/40 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <HeartHandshake className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white">
                  تفویض اختیار مسالمت‌آمیز با روش منتورینگ (انتقال تجربه ۱۵ ساله)
                </h2>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  کارفرما = مالک قواعد، نه پاسخ‌دهنده روزمره
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                «{DELEGATION_PHILOSOPHY.coreMotto}»
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 shrink-0">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-slate-200">مدل استقلال هدایت‌شده: سبز، زرد و قرمز</span>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setActiveSubTab('kpi_and_delegation')}
          className={`px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'kpi_and_delegation'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>شاخص‌های عملکردی و ۵ سطح اختیار پرسنل</span>
        </button>

        <button
          onClick={() => setActiveSubTab('mentoring_cycle')}
          className={`px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'mentoring_cycle'
              ? 'bg-teal-600 text-white shadow-md'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>چرخه ۴ مرحله‌ای و دستورالعمل برخورد با اشتباه</span>
        </button>

        <button
          onClick={() => setActiveSubTab('weekly_meeting')}
          className={`px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'weekly_meeting'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>جلسه هفتگی ۱۰ دقیقه‌ای (۳ سوال طلایی)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('tickets_inbox')}
          className={`px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer relative ${
            activeSubTab === 'tickets_inbox'
              ? 'bg-rose-600 text-white shadow-md'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>کارتابل استثنائات (ارجاع به کارفرما)</span>
          {pendingTickets.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-rose-500 text-white font-mono text-[10px] flex items-center justify-center font-bold">
              {pendingTickets.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab 1: KPIs & 5 Levels of Delegation */}
      {activeSubTab === 'kpi_and_delegation' && (
        <div className="space-y-6">
          
          {/* Main KPI Counters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-right">
              <span className="text-xs text-slate-400 font-medium">درصد خدمات مستقل پرسنل</span>
              <div className="text-2xl font-black text-emerald-400 mt-1">۸۱.۴٪</div>
              <p className="text-[10px] text-emerald-400/80 mt-1">↑ ۱۲٪ رشد نسبت به ماه گذشته</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-right">
              <span className="text-xs text-slate-400 font-medium">نرخ ارجاع به کارفرما (قرمز)</span>
              <div className="text-2xl font-black text-cyan-400 mt-1">۶.۲٪</div>
              <p className="text-[10px] text-slate-400 mt-1">فقط در موارد واقعاً استثنایی</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-right">
              <span className="text-xs text-slate-400 font-medium">درستی در بار اول (First-Time-Right)</span>
              <div className="text-2xl font-black text-teal-400 mt-1">۹۴.۸٪</div>
              <p className="text-[10px] text-teal-400/80 mt-1">به حداقل رسیدن خطای بازگشتی</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-right">
              <span className="text-xs text-slate-400 font-medium">میانگین زمان انجام هر خدمت</span>
              <div className="text-2xl font-black text-amber-400 mt-1">۸.۵ دقیقه</div>
              <p className="text-[10px] text-slate-400 mt-1">کاهش معطلی مراجعین</p>
            </div>
          </div>

          {/* Delegable vs Retained Tasks Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Delegable */}
            <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-3xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>۱. کارهای قابل تفویض (کم‌ریسک و تکراری):</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {DELEGATION_PHILOSOPHY.tasksClassification.delegable.map((task, i) => (
                  <li key={i} className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-emerald-900/20">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Retained */}
            <div className="bg-rose-950/20 border border-rose-900/40 rounded-3xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <ShieldAlert className="w-5 h-5" />
                <span>۲. کارهای نگه‌داشتنی (کارفرما - استراتژیک و پرریسک):</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {DELEGATION_PHILOSOPHY.tasksClassification.retained.map((task, i) => (
                  <li key={i} className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-rose-900/20">
                    <span className="text-rose-400 font-bold">✕</span>
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* 3 Employees Delegation Tracker */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  جدول سطح اختیار و پیشرفت سه کارمند شما
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  شروع از سطح ۲ یا ۳ و ارتقا با افزایش اعتماد و نمرات شبیه‌ساز
                </p>
              </div>
              <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                تفویض گام‌به‌گام
              </span>
            </div>

            <div className="space-y-4">
              {employees.map((emp) => (
                <div
                  key={emp.id}
                  className="bg-slate-800/60 border border-slate-700/70 rounded-2xl p-5 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{emp.avatar}</span>
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <span>{emp.name}</span>
                          <span className="text-xs font-normal text-slate-400">({emp.role})</span>
                        </h4>
                        <p className="text-xs text-slate-300 mt-0.5">
                          سقف تخفیف مجاز: <strong className="text-emerald-400">{formatToman(emp.discountCeilingToman)}</strong> | نرخ استقلال: <strong className="text-teal-400">{emp.independentRate}٪</strong>
                        </p>
                      </div>
                    </div>

                    {/* Level selector buttons */}
                    <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-700">
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() => handleUpdateLevel(emp.id, lvl as any)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                            emp.delegationLevel === lvl
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'text-slate-400 hover:text-white'
                          }`}
                          title={`سطح ${lvl}: ${DELEGATION_PHILOSOPHY.delegationLevelsDesc[lvl - 1].title}`}
                        >
                          سطح {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Level Description */}
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/80 text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-emerald-400 font-bold shrink-0">معنای سطح {emp.delegationLevel}:</span>
                    <span>{DELEGATION_PHILOSOPHY.delegationLevelsDesc[emp.delegationLevel - 1].description}</span>
                  </div>

                  {/* Assigned Skills */}
                  <div className="flex flex-wrap gap-1.5 text-[11px]">
                    {emp.skillsAssigned.map((skill, i) => (
                      <span key={i} className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      )}

      {/* Tab 2: Mentoring 4 Stages & Handling Mistakes */}
      {activeSubTab === 'mentoring_cycle' && (
        <div className="space-y-6">
          
          {/* 4 Stages Cycle */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-400" />
              <span>چرخه چهارمرحله‌ای منتورینگ (انتقال سینه به سینه تجربه)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {DELEGATION_PHILOSOPHY.mentoringCycle.map((stage) => (
                <div
                  key={stage.stage}
                  className="bg-slate-800/70 border border-slate-700 rounded-2xl p-4 space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <span className="w-7 h-7 rounded-full bg-teal-500/20 text-teal-400 font-black text-xs flex items-center justify-center mb-2">
                      {stage.stage}
                    </span>
                    <h4 className="text-xs font-bold text-white">{stage.title}</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{stage.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How to handle mistakes */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <span>دستورالعمل برخورد با اشتباه (امنیت روانی و یادگیری)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700 space-y-2">
                <span className="font-bold text-emerald-400 block">گام ۱: اول حل مشکل مشتری</span>
                <p className="text-slate-300 leading-relaxed">{DELEGATION_PHILOSOPHY.mistakeHandlingRule.step1}</p>
              </div>

              <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700 space-y-2">
                <span className="font-bold text-cyan-400 block">گام ۲: گفت‌وگو در خلوت بعد از رفتن مشتری</span>
                <p className="text-slate-300 leading-relaxed">{DELEGATION_PHILOSOPHY.mistakeHandlingRule.step2}</p>
              </div>

              <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700 space-y-2">
                <span className="font-bold text-amber-400 block">گام ۳: پرسش مربی‌گری به‌جای سرزنش</span>
                <p className="text-slate-300 leading-relaxed">{DELEGATION_PHILOSOPHY.mistakeHandlingRule.step3}</p>
              </div>

              <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700 space-y-2">
                <span className="font-bold text-purple-400 block">گام ۴: اشتباه = فرصت یادگیری پایدار</span>
                <p className="text-slate-300 leading-relaxed">{DELEGATION_PHILOSOPHY.mistakeHandlingRule.step4}</p>
              </div>
            </div>

            {/* Traps */}
            <div className="bg-rose-950/20 border border-rose-900/40 rounded-2xl p-4 space-y-2 text-xs">
              <span className="font-bold text-rose-400 block">دام‌های رایج که باید از آنها دوری کنید:</span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                <li className="flex items-center gap-1.5">• پس گرفتن ناگهانی اختیار بعد از یک اشتباه کوچک</li>
                <li className="flex items-center gap-1.5">• دخالت بی‌صدا یا اصلاح کار پشت سر کارمند بدون گفتن به او</li>
                <li className="flex items-center gap-1.5">• سقف مبهم اختیارات که باعث ترس یا تصمیمات بی‌حد می‌شود</li>
                <li className="flex items-center gap-1.5">• تعریف نکردن نتیجه مطلوب خدمت قبل از سپردن کار</li>
              </ul>
            </div>
          </div>

        </div>
      )}

      {/* Tab 3: 10-Minute Weekly Meeting Sheet */}
      {activeSubTab === 'weekly_meeting' && (
        <div className="space-y-6">
          
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-400" />
                  <span>برگه جلسه هفتگی ۱۰ دقیقه‌ای منتورینگ</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  یک ریتم ثابت هفتگی جدا از ساعت شلوغی با ۳ پرسش طلایی
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedEmpForMeeting.id}
                  onChange={(e) => {
                    const emp = employees.find((x) => x.id === e.target.value) || employees[0];
                    setSelectedEmpForMeeting(emp);
                  }}
                  className="bg-slate-800 text-white text-xs font-semibold py-2 px-3 rounded-xl border border-slate-700"
                >
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      کارمند: {e.name} ({e.role})
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => onOpenWeeklyMeetingPrint(selectedEmpForMeeting)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>چاپ برگه جلسه</span>
                </button>
              </div>
            </div>

            {/* The 3 Golden Questions */}
            <div className="space-y-4">
              <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-emerald-400">
                    پرسش ۱: «چه کار کردی؟» (مرور دستاوردها و کارهای مستقل)
                  </span>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs text-slate-200">
                  {selectedEmpForMeeting.weeklyReflection.whatDidWell}
                </div>
              </div>

              <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-amber-400">
                    پرسش ۲: «کجا گیر کردی؟» (جایی که معطل شدی یا مردد بودی)
                  </span>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs text-slate-200">
                  {selectedEmpForMeeting.weeklyReflection.whereGotStuck}
                </div>
              </div>

              <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-teal-400">
                    پرسش ۳: «دفعه بعد چه چیزی را متفاوت انجام می‌دهی؟» (درس‌آموخته)
                  </span>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs text-slate-200">
                  {selectedEmpForMeeting.weeklyReflection.whatToDoDifferently}
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Tab 4: Referral Tickets Inbox (سطح قرمز) */}
      {activeSubTab === 'tickets_inbox' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
                <span>کارتابل تیکت‌های ارجاع به کارفرما (مدیریت استثنائات)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                فقط مواردی که واقعاً نیازمند تصمیم‌گیری حقوقی، مالی یا استثنایی کارفرما هستند
              </p>
            </div>
            <span className="bg-rose-500/20 text-rose-300 text-xs font-bold px-3 py-1 rounded-xl border border-rose-500/30">
              {pendingTickets.length} مورد منتظر بررسی
            </span>
          </div>

          <div className="space-y-4">
            {tickets.map((tkt) => {
              const isResolved = tkt.status === 'resolved';

              return (
                <div
                  key={tkt.id}
                  className={`p-5 rounded-2xl border space-y-3 transition ${
                    isResolved
                      ? 'bg-slate-800/30 border-slate-800 opacity-60'
                      : 'bg-slate-800/80 border-rose-500/40 shadow-md'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-700/60 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                        tkt.priority === 'بحرانی'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}>
                        فوریت: {tkt.priority}
                      </span>
                      <span className="text-xs font-bold text-white">
                        {tkt.serviceTitle}
                      </span>
                      <span className="text-xs text-slate-400">
                        (مشتری: {tkt.clientName} - {tkt.clientPhone})
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span>ثبت توسط: <strong>{tkt.staffName}</strong></span>
                      <span>•</span>
                      <span>{tkt.createdAt}</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-200 leading-relaxed bg-slate-900/80 p-3 rounded-xl border border-slate-700/80 space-y-1">
                    <div className="text-rose-400 font-bold">دسته: {tkt.reasonCategory}</div>
                    <p>{tkt.description}</p>
                    {tkt.systemError && (
                      <p className="text-amber-300 font-mono text-[11px]">خطای سامانه: {tkt.systemError}</p>
                    )}
                    {tkt.suggestedAction && (
                      <p className="text-cyan-400 text-[11px]">پیشنهاد پرسنل: {tkt.suggestedAction}</p>
                    )}
                  </div>

                  {/* Resolution Input if Pending */}
                  {!isResolved ? (
                    <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                      <input
                        type="text"
                        placeholder="دستور یا بازخورد کارفرما برای حل این مورد..."
                        value={ticketResolveNote[tkt.id] || ''}
                        onChange={(e) => setTicketResolveNote({ ...ticketResolveNote, [tkt.id]: e.target.value })}
                        className="w-full sm:flex-1 bg-slate-900 text-white text-xs py-2 px-3 rounded-xl border border-slate-700"
                      />
                      <button
                        onClick={() => {
                          const note = ticketResolveNote[tkt.id] || 'موضوع توسط کارفرما بررسی و راهکار لازم ابلاغ گردید.';
                          onResolveTicket(tkt.id, note);
                        }}
                        className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>تعیین تکلیف و بستن تیکت</span>
                      </button>
                    </div>
                  ) : (
                    <div className="bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-900/40 text-xs text-emerald-300 flex items-center justify-between">
                      <span className="font-semibold">نتیجه بررسی کارفرما: {tkt.ownerFeedback || 'رسیدگی شد.'}</span>
                      <span className="text-[10px] text-slate-400">بسته شده در: {tkt.resolvedAt}</span>
                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
};
