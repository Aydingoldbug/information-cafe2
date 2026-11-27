export type DiscretionLevel = 'green' | 'yellow' | 'red';

export type UserRole = 'owner' | 'supervisor' | 'operator' | 'cashier';

export type ServiceCategory = 
  | 'judicial' 
  | 'tax' 
  | 'social_security' 
  | 'vehicle' 
  | 'housing' 
  | 'banking' 
  | 'licensing' 
  | 'university' 
  | 'general_gov';

export interface MultiSystemRequirement {
  system: string;
  costRial?: number;
  costToman?: number;
  description: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  category: ServiceCategory;
  discretionLevel: DiscretionLevel;
  rialPrice: number;
  tomanPrice: number;
  unit: string;
  portalName: string;
  portalUrl?: string;
  multiSystemRequirements?: MultiSystemRequirement[];
  description: string;
  requiredDocuments: string[];
  prerequisites: string[];
  stepByStep: string[];
  commonErrors: { error: string; solution: string }[];
  referralConditions: string[];
  version: string;
  updatedDate: string;
  popularScore: number; // 1-100
  estMinutes: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  durationMinutes: number;
  summary: string;
  content: string[];
  checklist: string[];
  quiz: QuizQuestion[];
  remedialTip?: string;
}

export interface LearningCourse {
  id: string;
  title: string;
  category: ServiceCategory | 'general';
  icon: string;
  description: string;
  level: 'مقدماتی' | 'متوسط' | 'پیشرفته';
  lessons: Lesson[];
}

export interface SimulationStep {
  stepNumber: number;
  title: string;
  instruction: string;
  systemInterface: {
    portalName: string;
    screenTitle: string;
    fields: {
      label: string;
      fieldName: string;
      type: 'text' | 'number' | 'select' | 'checkbox' | 'otp';
      options?: string[];
      placeholder?: string;
      required: boolean;
      expectedValue?: string;
      hint?: string;
    }[];
  };
  validationWarning?: string;
  failureScenario?: {
    conditionText: string;
    actionRequired: string;
  };
}

export interface SimulationScenario {
  id: string;
  title: string;
  serviceTitle: string;
  category: ServiceCategory;
  level: DiscretionLevel;
  customerProfile: {
    name: string;
    nationalId: string;
    phone: string;
    situation: string;
    documentsAvailable: string[];
  };
  steps: SimulationStep[];
  successCriteria: string[];
}

export interface ReferralTicket {
  id: string;
  clientName: string;
  clientPhone: string;
  serviceId: string;
  serviceTitle: string;
  staffName: string;
  discretionLevel: DiscretionLevel;
  priority: 'عادی' | 'فوری' | 'بحرانی';
  reasonCategory: 'نقص مدارک' | 'اختلاف مالی' | 'خطای لاینحل سامانه' | 'شکایت یا تنش' | 'تصمیم حقوقی/استثنا';
  description: string;
  systemError?: string;
  suggestedAction?: string;
  status: 'pending' | 'reviewing' | 'resolved';
  createdAt: string;
  resolvedAt?: string;
  ownerFeedback?: string;
}

export interface DelegationEmployee {
  id: string;
  name: string;
  avatar: string;
  role: string;
  accessRole: UserRole;
  delegationLevel: 1 | 2 | 3 | 4 | 5; 
  // 1: تحقیق کند و بگوید، تصمیم با من
  // 2: پیشنهاد بدهد، من تأیید کنم
  // 3: تصمیم بگیرد و قبل از انجام خبر بدهد
  // 4: تصمیم بگیرد و بعد گزارش کند
  // 5: کاملاً مستقل
  mentoringStage: 1 | 2 | 3 | 4;
  // 1: من انجام می‌دهم، تو ببین
  // 2: با هم انجام می‌دهیم
  // 3: تو انجام بده، من ببینم
  // 4: تو انجام بده، بعداً مرور می‌کنیم
  skillsAssigned: string[];
  discountCeilingToman: number;
  independentRate: number; // percentage
  weeklyReflection: {
    whatDidWell: string;
    whereGotStuck: string;
    whatToDoDifferently: string;
  };
  recentMistakesHandled: {
    situation: string;
    coachQuestion: string;
    keyLearning: string;
    date: string;
  }[];
}

export interface ServiceCertificate {
  id: string;
  employeeId: string;
  employeeName: string;
  serviceId: string;
  serviceTitle: string;
  category: ServiceCategory;
  status: 'certified' | 'in_progress' | 'needs_renewal';
  issueDate: string;
  expiryDate: string;
  examScore: number;
  practicalAttempts: number;
  supervisedCount: number;
}
