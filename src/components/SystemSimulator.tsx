import React, { useState } from 'react';
import { SimulationScenario, UserRole } from '../types';
import { SIMULATION_SCENARIOS, ERROR_LIBRARY } from '../data/simulationData';
import { 
  Gamepad2, 
  Library, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  ShieldCheck, 
  ArrowLeft, 
  Sparkles, 
  Check, 
  Search,
  User,
  Smartphone,
  ExternalLink,
  Award
} from 'lucide-react';

interface SystemSimulatorProps {
  currentRole: UserRole;
}

export const SystemSimulator: React.FC<SystemSimulatorProps> = ({ currentRole }) => {
  const [activeTab, setActiveTab] = useState<'simulator' | 'error_library'>('simulator');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(SIMULATION_SCENARIOS[0].id);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [simScore, setSimScore] = useState<number | null>(null);
  const [feedbackNotes, setFeedbackNotes] = useState<string[]>([]);
  const [errorSearch, setErrorSearch] = useState<string>('');

  const scenario = SIMULATION_SCENARIOS.find((s) => s.id === selectedScenarioId) || SIMULATION_SCENARIOS[0];
  const currentStep = scenario.steps[currentStepIndex];

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    // Validate current step
    const missing = currentStep.systemInterface.fields.filter(
      (f) => f.required && !formData[f.fieldName]
    );

    if (missing.length > 0) {
      alert(`لطفاً فیلد «${missing[0].label}» را پر کنید یا از اطلاعات پرونده مشتری استفاده فرمایید.`);
      return;
    }

    if (currentStepIndex < scenario.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // Calculate score
      let correctFields = 0;
      let totalFields = 0;
      scenario.steps.forEach((st) => {
        st.systemInterface.fields.forEach((f) => {
          totalFields++;
          if (f.expectedValue && formData[f.fieldName] === f.expectedValue) {
            correctFields++;
          } else if (!f.expectedValue && formData[f.fieldName]) {
            correctFields++;
          }
        });
      });

      const score = Math.round((correctFields / totalFields) * 100);
      setSimScore(score);
      setFeedbackNotes([
        score >= 90 ? 'عملکرد عالی! تسلط کامل بر رویه‌های اداری و سامانه.' : 'نیاز به مرور مجدد پیش‌نیازهای استعلامی.',
        'اطلاعات با موفقیت در محیط امن شبیه‌سازی ثبت شد.'
      ]);
    }
  };

  const handleRestart = () => {
    setCurrentStepIndex(0);
    setFormData({});
    setSimScore(null);
    setFeedbackNotes([]);
  };

  const filteredErrors = ERROR_LIBRARY.filter((err) => 
    err.title.includes(errorSearch) ||
    err.portal.includes(errorSearch) ||
    err.rootCause.includes(errorSearch) ||
    err.actionRequired.includes(errorSearch)
  );

  return (
    <div className="space-y-6">
      
      {/* Tab Switcher */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'simulator'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>محیط امن شبیه‌ساز عملی سامانه‌ها</span>
          </button>

          <button
            onClick={() => setActiveTab('error_library')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'error_library'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Library className="w-4 h-4" />
            <span>کتابخانه خطاهای رایج سامانه‌ای ({ERROR_LIBRARY.length})</span>
          </button>
        </div>

        <span className="text-xs text-slate-400 hidden sm:inline px-3">
          تمرین بدون ریسک خراب‌کاری در سامانه‌های اصلی
        </span>
      </div>

      {activeTab === 'simulator' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Scenario Info & Customer Briefing (Lg 4) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Scenario Selector */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
              <label className="text-xs font-bold text-slate-300 block">انتخاب سناریوی تمرینی:</label>
              <select
                value={selectedScenarioId}
                onChange={(e) => {
                  setSelectedScenarioId(e.target.value);
                  handleRestart();
                }}
                className="w-full bg-slate-800 text-white text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-700"
              >
                {SIMULATION_SCENARIOS.map((sc) => (
                  <option key={sc.id} value={sc.id}>
                    {sc.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Customer Briefing Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 border-b border-slate-800 pb-2">
                <User className="w-4 h-4" />
                <span>پرونده متقاضی فرضی پشت باجه:</span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">نام متقاضی:</span>
                  <span className="text-white font-bold">{scenario.customerProfile.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">کد ملی:</span>
                  <span className="text-white font-mono">{scenario.customerProfile.nationalId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">شماره همراه:</span>
                  <span className="text-white font-mono">{scenario.customerProfile.phone}</span>
                </div>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 text-xs text-slate-300 leading-relaxed">
                <span className="font-bold text-amber-300 block mb-1">شرح وضعیت و خواسته:</span>
                {scenario.customerProfile.situation}
              </div>

              <div className="space-y-1 text-xs">
                <span className="text-slate-400 font-semibold block">مدارک فیزیکی همراه مشتری:</span>
                {scenario.customerProfile.documentsAvailable.map((doc, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-slate-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Success criteria */}
            <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-2xl p-4 space-y-2 text-xs">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                <span>معیارهای نمره‌دهی آزمون شبیه‌ساز:</span>
              </span>
              <ul className="space-y-1 text-slate-300">
                {scenario.successCriteria.map((crit, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-400">•</span>
                    <span>{crit}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Interactive Simulated Portal Screen (Lg 8) */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Simulation Finished Card */}
            {simScore !== null ? (
              <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-8 text-center space-y-5 animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <Award className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-xl font-black text-white">
                    پایان موفقیت‌آمیز آزمون شبیه‌ساز!
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    سناریوی «{scenario.serviceTitle}» با موفقیت در محیط امن تمرین شد.
                  </p>
                </div>

                <div className="bg-slate-800/80 max-w-xs mx-auto p-4 rounded-2xl border border-slate-700">
                  <span className="text-xs text-slate-400">نمره کسب شده:</span>
                  <div className="text-3xl font-black text-emerald-400 mt-1">
                    {simScore} از ۱۰۰
                  </div>
                </div>

                <div className="space-y-1 text-xs text-slate-300">
                  {feedbackNotes.map((note, i) => (
                    <p key={i}>{note}</p>
                  ))}
                </div>

                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={handleRestart}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer"
                  >
                    تمرین مجدد سناریو
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                
                {/* Browser-like Mock Header */}
                <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                    <span className="text-slate-400 font-mono text-[11px] mr-2">
                      {currentStep.systemInterface.portalName}
                    </span>
                  </div>

                  <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono text-[11px]">
                    مرحله {currentStepIndex + 1} از {scenario.steps.length}
                  </span>
                </div>

                {/* Step Content */}
                <div className="p-6 space-y-5">
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {currentStep.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {currentStep.instruction}
                    </p>
                  </div>

                  {currentStep.validationWarning && (
                    <div className="bg-amber-950/40 border border-amber-900/50 rounded-2xl p-3 text-xs text-amber-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{currentStep.validationWarning}</span>
                    </div>
                  )}

                  {/* Form Mockup Inside Simulator */}
                  <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-4">
                    <div className="text-xs font-bold text-cyan-400 border-b border-slate-800/80 pb-2">
                      {currentStep.systemInterface.screenTitle}
                    </div>

                    <div className="space-y-3.5">
                      {currentStep.systemInterface.fields.map((field, idx) => (
                        <div key={idx} className="space-y-1 text-xs">
                          <label className="text-slate-300 font-semibold flex items-center justify-between">
                            <span>
                              {field.label} {field.required && <span className="text-rose-400">*</span>}
                            </span>
                            {field.expectedValue && (
                              <button
                                type="button"
                                onClick={() => handleFieldChange(field.fieldName, field.expectedValue!)}
                                className="text-[10px] text-cyan-400 hover:underline"
                              >
                                درج از پرونده متقاضی
                              </button>
                            )}
                          </label>

                          {field.type === 'select' ? (
                            <select
                              value={formData[field.fieldName] || ''}
                              onChange={(e) => handleFieldChange(field.fieldName, e.target.value)}
                              className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-700 text-xs focus:ring-1 focus:ring-emerald-500"
                            >
                              <option value="">-- انتخاب کنید --</option>
                              {field.options?.map((opt, i) => (
                                <option key={i} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          ) : field.type === 'otp' ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                placeholder={field.placeholder || 'کد تایید پیامک'}
                                value={formData[field.fieldName] || ''}
                                onChange={(e) => handleFieldChange(field.fieldName, e.target.value)}
                                className="flex-1 bg-slate-900 text-white p-2.5 rounded-xl border border-slate-700 text-xs text-center font-mono tracking-widest"
                              />
                              <span className="text-[11px] text-slate-400 bg-slate-800 px-2.5 py-2 rounded-xl border border-slate-700">
                                پیامک شبیه‌سازی: {field.expectedValue || '74125'}
                              </span>
                            </div>
                          ) : (
                            <input
                              type="text"
                              placeholder={field.placeholder || ''}
                              value={formData[field.fieldName] || ''}
                              onChange={(e) => handleFieldChange(field.fieldName, e.target.value)}
                              className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-700 text-xs focus:ring-1 focus:ring-emerald-500 font-sans"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Simulator Controls */}
                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={handleRestart}
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>شروع مجدد</span>
                    </button>

                    <button
                      onClick={handleNextStep}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer"
                    >
                      <span>
                        {currentStepIndex === scenario.steps.length - 1 ? 'تایید نهایی و ارزیابی نمره' : 'گام بعدی شبیه‌ساز'}
                      </span>
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </div>
            )}

          </div>

        </div>
      ) : (
        /* Error Library Tab */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Library className="w-5 h-5 text-indigo-400" />
                <span>کتابخانه جامع خطاهای رایج سامانه‌ای و راهکارهای تاییدشده</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                پرسنل در مواجهه با ارور سامانه‌ها، ابتدا این پایگاه را بررسی کرده و راهکار را اجرا می‌نمایند.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="جستجو در متن خطا..."
                value={errorSearch}
                onChange={(e) => setErrorSearch(e.target.value)}
                className="w-full bg-slate-800 text-white text-xs py-2 pr-9 pl-3 rounded-xl border border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredErrors.map((item) => (
              <div
                key={item.id}
                className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <h4 className="text-xs font-bold text-rose-300">{item.title}</h4>
                  <span className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
                    تکرار: {item.frequency}
                  </span>
                </div>

                <div className="text-xs text-slate-300">
                  <span className="text-slate-400">سامانه: </span>
                  <span className="text-cyan-400 font-semibold">{item.portal}</span>
                </div>

                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700 text-xs text-slate-300 space-y-1">
                  <span className="font-bold text-amber-300 block">علت ریشه‌ای:</span>
                  <p className="text-[11px] text-slate-400">{item.rootCause}</p>
                </div>

                <div className="bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-900/40 text-xs text-slate-200">
                  <span className="font-bold text-emerald-400 block mb-0.5">راه‌حل عملیاتی:</span>
                  <p className="text-[11px] leading-relaxed">{item.actionRequired}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
