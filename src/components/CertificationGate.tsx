import React, { useState } from 'react';
import { UserRole } from '../types';
import { INITIAL_EMPLOYEES } from '../data/delegationData';
import { SERVICES_DATABASE, DISCRETION_LABELS } from '../data/servicesData';
import { 
  Award, 
  ShieldCheck, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  User, 
  Sparkles,
  FileBadge,
  RotateCw,
  Search
} from 'lucide-react';

interface CertificationGateProps {
  currentRole: UserRole;
}

export const CertificationGate: React.FC<CertificationGateProps> = ({ currentRole }) => {
  const [selectedEmpId, setSelectedEmpId] = useState<string>(INITIAL_EMPLOYEES[1].id);
  const [searchFilter, setSearchFilter] = useState('');

  const employee = INITIAL_EMPLOYEES.find((e) => e.id === selectedEmpId) || INITIAL_EMPLOYEES[0];

  // Dummy status map for demo
  const getCertStatus = (serviceId: string, empIndex: number) => {
    // Generate deterministic demo status
    const charCode = serviceId.charCodeAt(0) + empIndex;
    if (charCode % 3 === 0) return { status: 'certified', label: 'دارای گواهینامه مستقل', score: 95, expiry: '۱۴۰۶/۰۶/۰۱' };
    if (charCode % 3 === 1) return { status: 'supervised', label: 'مجاز فقط با نظارت ناظر', score: 78, expiry: '۱۴۰۵/۰۹/۰۱' };
    return { status: 'locked', label: 'فاقد گواهی (نیاز به آزمون)', score: 0, expiry: '-' };
  };

  const empIndex = INITIAL_EMPLOYEES.findIndex((e) => e.id === selectedEmpId);

  const filteredServices = SERVICES_DATABASE.filter((s) =>
    s.title.includes(searchFilter) || s.portalName.includes(searchFilter)
  );

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/70 border border-purple-500/30 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileBadge className="w-6 h-6 text-purple-400" />
            <h2 className="text-base font-bold text-white">
              دروازه ارزیابی و گواهینامه مهارت خدمت (Skill Gate)
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            پرسنل تا گواهی خدمت را دریافت نکنند، مجاز به انجام مستقل آن خدمت نیستند و سامانه تأیید ناظر را اجباری می‌کند.
          </p>
        </div>
        <div className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3.5 py-1.5 rounded-xl text-xs font-bold">
          سیستم تضمین کیفیت خدمات
        </div>
      </div>

      {/* Staff Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {INITIAL_EMPLOYEES.map((emp) => {
          const isSelected = emp.id === selectedEmpId;
          return (
            <div
              key={emp.id}
              onClick={() => setSelectedEmpId(emp.id)}
              className={`p-4 rounded-2xl border text-right transition cursor-pointer flex items-center justify-between ${
                isSelected
                  ? 'bg-purple-950/60 border-purple-500 ring-2 ring-purple-500/30'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{emp.avatar}</span>
                <div>
                  <h4 className="text-xs font-bold text-white">{emp.name}</h4>
                  <p className="text-[11px] text-slate-400">{emp.role}</p>
                  <span className="inline-block mt-1 text-[10px] bg-slate-800 px-2 py-0.5 rounded text-emerald-400 font-semibold">
                    نرخ استقلال: {emp.independentRate}٪
                  </span>
                </div>
              </div>
              <span className={`w-3 h-3 rounded-full ${isSelected ? 'bg-purple-400 shadow-md shadow-purple-400' : 'bg-slate-700'}`} />
            </div>
          );
        })}
      </div>

      {/* Filter and Services Certification Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-sm font-bold text-white">
              کارنامه و مجوزهای خدمت: <span className="text-purple-400">{employee.name}</span>
            </h3>
            <p className="text-xs text-slate-400">
              سطح تفویض جاری: سطح {employee.delegationLevel} | مرحله منتورینگ: مرحله {employee.mentoringStage}
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="جستجوی خدمت..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-slate-800 text-white text-xs py-2 pr-9 pl-3 rounded-xl border border-slate-700"
            />
          </div>
        </div>

        {/* Matrix Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredServices.map((service) => {
            const cert = getCertStatus(service.id, empIndex);

            return (
              <div
                key={service.id}
                className="bg-slate-800/60 border border-slate-700/70 rounded-2xl p-4 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] text-slate-400 font-medium">
                      {service.portalName}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        cert.status === 'certified'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : cert.status === 'supervised'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {cert.label}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white line-clamp-1">
                    {service.title}
                  </h4>
                </div>

                <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span>نمره آزمون: <strong className="text-white">{cert.score > 0 ? `${cert.score}٪` : '-'}</strong></span>
                  <span>انقضا: <strong className="text-slate-300">{cert.expiry}</strong></span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
