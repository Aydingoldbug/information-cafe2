import React, { useState } from 'react';
import { UserRole, ServiceItem, ReferralTicket, DelegationEmployee } from './types';
import { Header } from './components/Header';
import { KnowledgeBase } from './components/KnowledgeBase';
import { DeskAssistant } from './components/DeskAssistant';
import { DecisionTreeEngine } from './components/DecisionTreeEngine';
import { SystemSimulator } from './components/SystemSimulator';
import { AdaptiveLearning } from './components/AdaptiveLearning';
import { CertificationGate } from './components/CertificationGate';
import { MentoringDashboard } from './components/MentoringDashboard';
import { ExportCenter } from './components/ExportCenter';
import { PrintableModals } from './components/PrintableModals';
import { MentoringPhilosophyModal } from './components/MentoringPhilosophyModal';
import { INITIAL_TICKETS, INITIAL_EMPLOYEES } from './data/delegationData';
import { SERVICES_DATABASE } from './data/servicesData';
import { 
  BookOpen, 
  Compass, 
  GitFork, 
  Gamepad2, 
  GraduationCap, 
  Award, 
  LayoutDashboard, 
  Printer, 
  FileBadge
} from 'lucide-react';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('owner');
  const [activeTab, setActiveTab] = useState<
    'knowledge' | 'assistant' | 'decision_tree' | 'simulator' | 'learning' | 'certification' | 'dashboard' | 'export'
  >('knowledge');

  // Shared state
  const [selectedServiceForAssistant, setSelectedServiceForAssistant] = useState<ServiceItem | null>(
    SERVICES_DATABASE[0]
  );
  const [tickets, setTickets] = useState<ReferralTicket[]>(INITIAL_TICKETS);
  
  // Modals state
  const [activePrintType, setActivePrintType] = useState<'tariff' | 'receipt' | 'deficiency' | 'weekly_meeting' | null>(null);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [deficiencyData, setDeficiencyData] = useState<{ serviceTitle: string; missingItems: string[] } | undefined>(undefined);
  const [weeklyMeetingEmp, setWeeklyMeetingEmp] = useState<DelegationEmployee | undefined>(undefined);
  const [showPhilosophyModal, setShowPhilosophyModal] = useState(false);

  // Handlers
  const handleSelectServiceFromAnywhere = (service: ServiceItem) => {
    setSelectedServiceForAssistant(service);
    setActiveTab('assistant');
  };

  const handleCreateReferralTicket = (ticketData: Omit<ReferralTicket, 'id' | 'createdAt' | 'status'>) => {
    const newTkt: ReferralTicket = {
      ...ticketData,
      id: `tkt_${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toLocaleDateString('fa-IR') + ' - ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
    };
    setTickets((prev) => [newTkt, ...prev]);
    alert('تیکت ارجاع با موفقیت برای کارفرما ارسال شد و در کارتابل قرار گرفت.');
  };

  const handleResolveTicket = (ticketId: string, feedback: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: 'resolved',
              resolvedAt: new Date().toLocaleDateString('fa-IR') + ' - ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
              ownerFeedback: feedback,
            }
          : t
      )
    );
  };

  const handleOpenReceiptModal = (data: any) => {
    setReceiptData(data);
    setActivePrintType('receipt');
  };

  const handleOpenDeficiencyModal = (serviceTitle: string, missingItems: string[]) => {
    setDeficiencyData({ serviceTitle, missingItems });
    setActivePrintType('deficiency');
  };

  const handleOpenWeeklyMeetingModal = (employee: DelegationEmployee) => {
    setWeeklyMeetingEmp(employee);
    setActivePrintType('weekly_meeting');
  };

  const pendingTicketsCount = tickets.filter((t) => t.status !== 'resolved').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      
      {/* Top Header */}
      <Header
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        activeTicketsCount={pendingTicketsCount}
        onOpenQuickPrint={() => setActivePrintType('tariff')}
        onOpenHelpModal={() => setShowPhilosophyModal(true)}
      />

      {/* Navigation Module Tabs */}
      <nav className="bg-slate-900/90 border-b border-slate-800 sticky top-20 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 scrollbar-none text-xs">
            
            <button
              onClick={() => setActiveTab('knowledge')}
              className={`px-3 py-2 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'knowledge'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>۱. پایگاه دانش و نرخ‌نامه ۱۴۰۵</span>
            </button>

            <button
              onClick={() => setActiveTab('assistant')}
              className={`px-3 py-2 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'assistant'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>۲. دستیار هوشمند لحظه‌ای میز کار</span>
            </button>

            <button
              onClick={() => setActiveTab('decision_tree')}
              className={`px-3 py-2 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'decision_tree'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <GitFork className="w-4 h-4" />
              <span>۳. موتور رویه و درخت تصمیم</span>
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-3 py-2 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'simulator'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              <span>۴. شبیه‌ساز عملی و کتابخانه خطا</span>
            </button>

            <button
              onClick={() => setActiveTab('learning')}
              className={`px-3 py-2 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'learning'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>۵. مسیر یادگیری تطبیقی</span>
            </button>

            <button
              onClick={() => setActiveTab('certification')}
              className={`px-3 py-2 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'certification'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileBadge className="w-4 h-4" />
              <span>۶. گواهینامه‌ها و ارزیابی مهارت</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-2 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer relative ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>۷. داشبورد کارفرما و منتورینگ</span>
              {pendingTicketsCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-mono flex items-center justify-center font-bold">
                  {pendingTicketsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('export')}
              className={`px-3 py-2 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'export'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>۸. مرکز خروجی و دسترسی‌ها</span>
            </button>

          </div>
        </div>
      </nav>

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {activeTab === 'knowledge' && (
          <KnowledgeBase
            currentRole={currentRole}
            onSelectServiceForAssistant={handleSelectServiceFromAnywhere}
          />
        )}

        {activeTab === 'assistant' && (
          <DeskAssistant
            currentRole={currentRole}
            selectedService={selectedServiceForAssistant}
            onSelectService={setSelectedServiceForAssistant}
            onCreateReferralTicket={handleCreateReferralTicket}
            onOpenReceiptModal={handleOpenReceiptModal}
          />
        )}

        {activeTab === 'decision_tree' && (
          <DecisionTreeEngine
            currentRole={currentRole}
            onSelectServiceForAssistant={handleSelectServiceFromAnywhere}
            onOpenDeficiencyPrint={handleOpenDeficiencyModal}
          />
        )}

        {activeTab === 'simulator' && (
          <SystemSimulator currentRole={currentRole} />
        )}

        {activeTab === 'learning' && (
          <AdaptiveLearning currentRole={currentRole} />
        )}

        {activeTab === 'certification' && (
          <CertificationGate currentRole={currentRole} />
        )}

        {activeTab === 'dashboard' && (
          <MentoringDashboard
            currentRole={currentRole}
            tickets={tickets}
            onResolveTicket={handleResolveTicket}
            onOpenWeeklyMeetingPrint={handleOpenWeeklyMeetingModal}
          />
        )}

        {activeTab === 'export' && (
          <ExportCenter
            currentRole={currentRole}
            onOpenOfficialTariffPrint={() => setActivePrintType('tariff')}
            onOpenSampleReceiptPrint={() =>
              handleOpenReceiptModal({
                clientName: 'محمدرضا حسینی',
                clientPhone: '09123456789',
                serviceTitle: 'نوبت دهی تعویض پلاک + احراز سخا',
                portalName: 'سامانه تعویض پلاک و راهور',
                unit: 'هر نوبت',
                cafeFeeToman: 200000,
                cafeFeeRial: 2000000,
                govFees: [
                  { title: 'احراز نشانی پستی در سخا', costToman: 52000 },
                  { title: 'مالیات نقل و انتقال خودرو (مای تکس)', costToman: 850000 }
                ],
                totalGovFeeToman: 902000,
                grandTotalToman: 1102000,
                grandTotalRial: 11020000,
                date: '۱۴۰۵/۰۶/۰۲'
              })
            }
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>سامانه استقلال هدایت‌شده پرسنل کافی‌نت • مدل منتورینگ و تفویض مسالمت‌آمیز ۱۵ ساله</span>
          <span>بر اساس نرخ‌نامه خدمات کافی‌نت سال ۱۴۰۵ اتحادیه صنف عکاسان، چاپخانه‌داران و... شهرستان ری</span>
        </div>
      </footer>

      {/* Printable Modals View */}
      <PrintableModals
        activePrintType={activePrintType}
        onClose={() => setActivePrintType(null)}
        receiptData={receiptData}
        deficiencyData={deficiencyData}
        weeklyEmployee={weeklyMeetingEmp}
      />

      {/* Mentoring Philosophy Modal */}
      <MentoringPhilosophyModal
        isOpen={showPhilosophyModal}
        onClose={() => setShowPhilosophyModal(false)}
      />

    </div>
  );
}
