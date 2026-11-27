import React, { useState } from 'react';
import { LearningCourse, Lesson, QuizQuestion, UserRole } from '../types';
import { COURSES_DATABASE } from '../data/learningData';
import { 
  GraduationCap, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  BookOpen, 
  Sparkles, 
  CheckSquare, 
  ArrowLeft, 
  HelpCircle,
  Lightbulb,
  Award
} from 'lucide-react';

interface AdaptiveLearningProps {
  currentRole: UserRole;
  onLessonCompleted?: (lessonId: string) => void;
}

export const AdaptiveLearning: React.FC<AdaptiveLearningProps> = ({
  currentRole,
  onLessonCompleted,
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(COURSES_DATABASE[0].id);
  const [selectedLessonId, setSelectedLessonId] = useState<string>(COURSES_DATABASE[0].lessons[0].id);
  
  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [remedialSuggested, setRemedialSuggested] = useState<string | null>(null);

  const course = COURSES_DATABASE.find((c) => c.id === selectedCourseId) || COURSES_DATABASE[0];
  const lesson = course.lessons.find((l) => l.id === selectedLessonId) || course.lessons[0];

  const handleSelectLesson = (lId: string) => {
    setSelectedLessonId(lId);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setRemedialSuggested(null);
  };

  const handleAnswerSelect = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    let hasError = false;
    lesson.quiz.forEach((q, idx) => {
      if (selectedAnswers[idx] !== q.correctIndex) {
        hasError = true;
      }
    });

    if (hasError && lesson.remedialTip) {
      setRemedialSuggested(lesson.remedialTip);
    } else {
      setRemedialSuggested(null);
      if (onLessonCompleted) onLessonCompleted(lesson.id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-950/70 via-slate-900 to-emerald-950/70 border border-teal-500/30 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-teal-400" />
            <h2 className="text-base font-bold text-white">
              مسیر یادگیری تطبیقی و آزمون‌های کوتاه پرسنل
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            دوره‌های میکروآموزش ۵ الی ۱۰ دقیقه‌ای؛ با بروزرسانی نرخ‌نامه یا خطای پرسنل، درس جبرانی خودکار پیشنهاد می‌شود.
          </p>
        </div>
        <div className="bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-700 text-xs font-semibold text-teal-300">
          دسترسی: کلیه سطوح پرسنل
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Course Catalog (Lg 4) */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-400">سرفصل‌های آموزشی:</h3>
            <div className="space-y-2">
              {COURSES_DATABASE.map((c) => {
                const isActive = c.id === selectedCourseId;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCourseId(c.id);
                      setSelectedLessonId(c.lessons[0].id);
                      setSelectedAnswers({});
                      setQuizSubmitted(false);
                      setRemedialSuggested(null);
                    }}
                    className={`w-full p-3 rounded-xl border text-right transition cursor-pointer ${
                      isActive
                        ? 'bg-teal-950/60 border-teal-500 text-white ring-1 ring-teal-500/30'
                        : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">{c.title}</span>
                      <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                        {c.level}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{c.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lessons List in Selected Course */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
            <h4 className="text-xs font-bold text-white">درس‌های این دوره:</h4>
            <div className="space-y-1.5">
              {course.lessons.map((lsn, idx) => {
                const isCur = lsn.id === selectedLessonId;
                return (
                  <button
                    key={lsn.id}
                    onClick={() => handleSelectLesson(lsn.id)}
                    className={`w-full p-2.5 rounded-xl border text-right text-xs transition flex items-center justify-between cursor-pointer ${
                      isCur
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold'
                        : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] flex items-center justify-center text-slate-400 shrink-0">
                        {idx + 1}
                      </span>
                      <span className="truncate">{lsn.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1 shrink-0">
                      <Clock className="w-3 h-3" />
                      <span>{lsn.durationMinutes}دقیقه</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Lesson Content & Micro-Quiz (Lg 8) */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
            
            {/* Lesson Title & Summary */}
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2 text-xs text-teal-400 font-medium mb-1">
                <span>{course.title}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>زمان مطالعه: حدود {lesson.durationMinutes} دقیقه</span>
                </span>
              </div>
              <h3 className="text-base font-black text-white">
                {lesson.title}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                {lesson.summary}
              </p>
            </div>

            {/* Content Paragraphs */}
            <div className="space-y-3 text-xs text-slate-200 leading-relaxed bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80">
              {lesson.content.map((p, idx) => (
                <p key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{p}</span>
                </p>
              ))}
            </div>

            {/* Lesson Checklist */}
            <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-4 space-y-2.5">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-emerald-400" />
                <span>چک‌لیست عملیاتی پرسنل در این مبحث:</span>
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {lesson.checklist.map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Micro-Quiz Section */}
            <div className="bg-slate-800/50 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
                <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" />
                  <span>آزمون کوتاه پایان درس (تایید مهارت)</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  برای ثبت گواهی باید به سوال پاسخ صحیح دهید
                </span>
              </div>

              {lesson.quiz.map((q, qIdx) => (
                <div key={qIdx} className="space-y-3">
                  <p className="text-xs font-bold text-white leading-relaxed">
                    {qIdx + 1}. {q.question}
                  </p>

                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[qIdx] === optIdx;
                      const isCorrect = q.correctIndex === optIdx;
                      
                      let btnStyle = 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600';
                      if (quizSubmitted) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold';
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-300';
                        }
                      } else if (isSelected) {
                        btnStyle = 'bg-teal-950/80 border-teal-500 text-teal-200 ring-1 ring-teal-500/30';
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleAnswerSelect(qIdx, optIdx)}
                          className={`w-full p-3 rounded-xl border text-right text-xs transition cursor-pointer ${btnStyle}`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[10px] shrink-0">
                              {optIdx + 1}
                            </span>
                            <span className="leading-relaxed">{opt}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-700 text-xs text-slate-300 space-y-1">
                      <span className="font-bold text-teal-400">توضیح مربی:</span>
                      <p className="text-[11px] text-slate-300">{q.explanation}</p>
                    </div>
                  )}
                </div>
              ))}

              {/* Remedial Recommendation if wrong */}
              {remedialSuggested && (
                <div className="bg-amber-950/40 border border-amber-900/50 rounded-xl p-3.5 text-xs text-amber-300 flex items-start gap-2 animate-in fade-in">
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-0.5">پیشنهاد تطبیقی سیستم:</span>
                    <span>{remedialSuggested}</span>
                  </div>
                </div>
              )}

              {/* Quiz Submit button */}
              {!quizSubmitted ? (
                <button
                  onClick={handleQuizSubmit}
                  disabled={Object.keys(selectedAnswers).length < lesson.quiz.length}
                  className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold text-xs py-2.5 rounded-xl transition cursor-pointer"
                >
                  ثبت پاسخ و ارزیابی نتیجه
                </button>
              ) : (
                <div className="flex items-center justify-between text-xs text-emerald-400 bg-emerald-950/40 p-3 rounded-xl border border-emerald-900/50">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    <span>آزمون ثبت گردید و در کارنامه مهارت پرسنل منظور شد.</span>
                  </div>
                  <button
                    onClick={() => {
                      setQuizSubmitted(false);
                      setSelectedAnswers({});
                    }}
                    className="text-xs text-slate-400 hover:text-white underline"
                  >
                    آزمون مجدد
                  </button>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
