import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, Lock, Star, Activity, BookOpen, Camera, Zap, ChevronRight, Share2, TicketPercent } from 'lucide-react';

const QUESTION_BANK = {
  stage1: [
    { id: 1, text: "My brother ______ in a bank.", options: ["work", "works", "working", "is work"], correct: 1 },
    { id: 2, text: "______ you like to drink coffee?", options: ["Do", "Are", "Does", "Would"], correct: 3 },
    { id: 3, text: "I haven't seen her ______ last year.", options: ["for", "since", "from", "until"], correct: 1 },
    { id: 4, text: "This is the ______ movie I have ever seen.", options: ["bad", "worse", "worst", "badest"], correct: 2 },
    { id: 5, text: "They ______ dinner when I arrived.", options: ["were having", "had", "have", "are having"], correct: 0 },
    { id: 6, text: "She is good ______ playing the piano.", options: ["in", "at", "on", "with"], correct: 1 },
  ],
  stage2: [
    { id: 101, text: "If I ______ enough money, I would buy a house.", options: ["have", "had", "would have", "have had"], correct: 1 },
    { id: 102, text: "I regret ______ you that your application was rejected.", options: ["to tell", "telling", "tell", "to telling"], correct: 0 },
    { id: 103, text: "The car needs ______.", options: ["to wash", "washing", "washed", "be washed"], correct: 1 },
    { id: 104, text: "By this time next year, I ______ my degree.", options: ["will finish", "will have finished", "have finished", "finish"], correct: 1 },
    { id: 105, text: "______ having a headache, he went to the party.", options: ["Although", "Despite", "In spite", "Even"], correct: 1 },
    { id: 106, text: "I’m not used to ______ up so early.", options: ["get", "getting", "got", "be getting"], correct: 1 },
  ],
  stage3: [
    { id: 201, text: "No sooner ______ entered the house than it started raining.", options: ["had I", "I had", "did I", "have I"], correct: 0 },
    { id: 202, text: "It’s high time you ______ a job.", options: ["find", "found", "have found", "will find"], correct: 1 },
    { id: 203, text: "I’d rather you ______ smoke inside the house.", options: ["don't", "didn't", "won't", "not"], correct: 1 },
    { id: 204, text: "The government has decided to do ______ with the old tax law.", options: ["over", "up", "away", "off"], correct: 2 },
    { id: 205, text: "Had I known about the meeting, I ______ attended.", options: ["would have", "would", "will have", "had"], correct: 0 },
  ]
};

const LEVEL_DESCRIPTIONS = {
  "A1/A2": "کاربر مقدماتی: شما می‌توانید جملات ساده را درک کنید و در مورد نیازهای فوری و روزمره صحبت کنید، اما برای مکالمات پیچیده نیاز به کمک دارید.",
  "B1": "کاربر مستقل (آستانه): شما می‌توانید نکات اصلی موضوعات استاندارد را درک کنید و در سفر به کشورهای انگلیسی‌زبان گلیم خود را از آب بیرون بکشید.",
  "B2": "کاربر مستقل (پیشرو): شما می‌توانید متون پیچیده را درک کنید و با تسلط نسبی و بدون فشار زیاد با بومی‌زبانان صحبت کنید.",
  "C1": "کاربر ماهر: شما می‌توانید متون طولانی و دشوار را درک کنید، معانی ضمنی را بفهمید و بدون جستجوی لغت، روان صحبت کنید.",
  "C2": "استاد: شما تسلطی نزدیک به زبان مادری دارید و می‌توانید ریزترین ظرایف معنایی را در موقعیت‌های پیچیده درک و بیان کنید."
};

const App = () => {
  const [view, setView] = useState('start'); 
  const [currentStage, setCurrentStage] = useState(1);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [stageScore, setStageScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [finalLevel, setFinalLevel] = useState(null);
  const [analysis, setAnalysis] = useState("");
  const [roadmap, setRoadmap] = useState("");

  const getCurrentQuestions = () => {
    if (currentStage === 1) return QUESTION_BANK.stage1;
    if (currentStage === 2) return QUESTION_BANK.stage2;
    return QUESTION_BANK.stage3;
  };

  const handleAnswer = (optionIndex) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIndex);
    const currentQ = getCurrentQuestions()[questionIndex];
    if (optionIndex === currentQ.correct) setStageScore(prev => prev + 1);
    setTimeout(() => handleNextLogic(), 800);
  };

  const handleNextLogic = () => {
    setSelectedOption(null);
    const questions = getCurrentQuestions();
    if (questionIndex < questions.length - 1) setQuestionIndex(prev => prev + 1);
    else evaluateBucket(questions.length);
  };

  const evaluateBucket = (totalStageQuestions) => {
    const percentage = (stageScore / totalStageQuestions) * 100;
    const passedStage = percentage >= 50;

    if (currentStage === 1) {
      if (!passedStage) finishTest("A1/A2", "مبتدی (Elementary)", LEVEL_DESCRIPTIONS["A1/A2"]);
      else { setCurrentStage(2); setQuestionIndex(0); setStageScore(0); }
    } else if (currentStage === 2) {
      if (!passedStage) finishTest("B1", "متوسط (Intermediate)", LEVEL_DESCRIPTIONS["B1"]);
      else { setCurrentStage(3); setQuestionIndex(0); setStageScore(0); }
    } else if (currentStage === 3) {
      if (passedStage) finishTest("C1", "پیشرفته (Advanced)", LEVEL_DESCRIPTIONS["C1"]);
      else finishTest("B2", "فرامتوسط (Upper Intermediate)", LEVEL_DESCRIPTIONS["B2"]);
    }
  };

  const finishTest = (level, label, standardDesc) => {
    setFinalLevel({ code: level, label: label, desc: standardDesc });
    if (level.includes("A")) {
      setAnalysis("شما در ابتدای مسیر هستید. دانش واژگان شما محدود به نیازهای اولیه است و ساختار جملات را گاهی اشتباه می‌چنید. این کاملاً طبیعی است.");
      setRoadmap("برای جهش به سطح بعدی، باید روی «زمان‌های حال و گذشته ساده» مسلط شوید و روزانه ۱۰ لغت کاربردی حفظ کنید. فیلم‌های ساده با زیرنویس انگلیسی ببینید.");
    } else if (level === "B1") {
      setAnalysis("شما بنیان خوبی دارید اما هنوز در جملات شرطی و افعال مجهول دچار تردید می‌شوید. دایره لغاتتان خوب است اما بیشتر «منفعل» هستند تا «فعال».");
      setRoadmap("کلید موفقیت شما در «Listening» و «Reading» است. پادکست‌های سطح متوسط گوش دهید و سعی کنید جملات مرکب بسازید.");
    } else if (level === "B2") {
      setAnalysis("تبریک می‌گویم! شما وارد فاز حرفه‌ای شده‌اید. بزرگترین چالش شما اکنون «طبیعی صحبت کردن» و استفاده از اصطلاحات (Idioms) به جای کلمات ساده است.");
      setRoadmap("روی افعال عبارتی (Phrasal Verbs) تمرکز کنید. اخبار انگلیسی ببینید و سعی کنید با خودتان انگلیسی صحبت کنید تا روانی کلامتان افزایش یابد.");
    } else {
      setAnalysis("سطح شما تحسین‌برانگیز است. شما ساختارهای پیچیده گرامری را می‌شناسید. چالش اصلی شما درک ظرایف فرهنگی و لهجه‌های غلیظ است.");
      setRoadmap("برای رسیدن به سطح استادی (Native-like)، باید روی انگلیسی تجاری، ادبیات کلاسیک و نوشتن مقالات آکادمیک تمرکز کنید.");
    }
    setIsAnimating(true);
    setView('result');
  };

  const GlobalStyles = () => (
    <style>{`
      @import url('https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css');
      :root { --font-vazir: 'Vazirmatn', sans-serif; }
      body { font-family: var(--font-vazir) !important; }
      .glass-card { background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.5); }
      .neon-text { text-shadow: 0 0 5px rgba(255, 255, 255, 0.5); }
    `}</style>
  );

  if (view === 'start') {
    return (
      <div dir="rtl" className="min-h-screen bg-[#F8FAFC] relative overflow-hidden font-vazir text-slate-800">
        <GlobalStyles />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-200/40 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6 text-center">
          <div className="w-28 h-28 bg-gradient-to-tr from-teal-400 to-purple-600 rounded-3xl flex items-center justify-center mb-10 shadow-[0_20px_50px_rgba(126,34,206,0.3)] rotate-6 transform transition-all duration-700 hover:rotate-12 hover:scale-105">
            <Star className="text-white w-14 h-14 drop-shadow-md" fill="white" />
          </div>
          <h1 className="text-5xl font-black text-slate-900 mb-3 tracking-tight">آکادمی زبان بتی</h1>
          <div className="h-1.5 w-16 bg-purple-600 rounded-full mb-6"></div>
          <p className="text-slate-500 mb-12 max-w-xs text-lg leading-8 font-medium">دقیق‌ترین آزمون تعیین سطح هوشمند.<br/><span className="text-purple-600 font-extrabold bg-purple-50 px-2 rounded-lg">سطح واقعی</span> خود را بشناسید.</p>
          <div className="grid grid-cols-1 gap-4 w-full max-w-xs mb-12">
            {[{icon: Activity, text: "تطبیق با سطح شما", color: "text-teal-600", bg: "bg-teal-50"}, {icon: Zap, text: "تحلیل هوشمند و فوری", color: "text-purple-600", bg: "bg-purple-50"}, {icon: BookOpen, text: "سوالات استاندارد جهانی", color: "text-blue-600", bg: "bg-blue-50"}].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 glass-card p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className={`${item.bg} p-2.5 rounded-xl ${item.color}`}><item.icon size={22} strokeWidth={2.5} /></div>
                <span className="text-slate-700 font-bold text-sm">{item.text}</span>
              </div>
            ))}
          </div>
          <button onClick={() => setView('test')} className="w-full max-w-xs bg-slate-900 text-white font-bold py-5 rounded-2xl shadow-2xl hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-3 text-lg ring-4 ring-slate-100">شروع آزمون حرفه‌ای <ArrowLeft className="w-6 h-6" /></button>
        </div>
      </div>
    );
  }

  if (view === 'test') {
    const questions = getCurrentQuestions();
    const currentQ = questions[questionIndex];
    const progress = ((questionIndex + 1) / questions.length) * 100;
    return (
      <div dir="rtl" className="min-h-screen bg-[#F8FAFC] flex flex-col font-vazir">
        <GlobalStyles />
        <div className="bg-white/80 backdrop-blur-md px-6 py-5 shadow-sm flex justify-between items-center sticky top-0 z-20 border-b border-slate-100">
          <div className="flex items-center gap-2"><span className="text-xs font-black text-white bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-1.5 rounded-full shadow-lg shadow-purple-200">سطح {currentStage}</span></div>
          <span className="text-slate-400 font-mono font-bold text-lg dir-ltr">{questionIndex + 1}<span className="text-slate-300 text-sm">/{questions.length}</span></span>
        </div>
        <div className="w-full bg-slate-100 h-1.5" dir="ltr"><div className="bg-purple-600 h-1.5 shadow-[0_0_15px_rgba(147,51,234,0.6)] transition-all duration-500 ease-out rounded-r-full" style={{ width: `${progress}%` }}></div></div>
        <div className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full justify-center">
          <div dir="ltr" className="glass-card p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 mb-8 relative overflow-hidden group border-0 ring-1 ring-white">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-teal-100 to-transparent rounded-bl-[4rem] -mr-4 -mt-4 opacity-50 transition-transform group-hover:scale-110"></div>
            <h2 className="text-2xl font-bold text-slate-800 text-center leading-relaxed relative z-10 font-sans">{currentQ.text}</h2>
          </div>
          <div className="space-y-4" dir="ltr">
            {currentQ.options.map((opt, idx) => (
              <button key={idx} onClick={() => handleAnswer(idx)} className={`w-full p-5 rounded-2xl text-left transition-all duration-300 border-2 font-semibold text-lg flex items-center justify-between group font-sans ${selectedOption === idx ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-lg shadow-purple-100 scale-[1.02]' : 'border-transparent bg-white text-slate-600 shadow-sm hover:border-purple-200 hover:bg-purple-50/30'}`}>
                <span>{opt}</span>{selectedOption === idx ? (<CheckCircle className="w-6 h-6 text-purple-600 drop-shadow-sm" />) : (<div className="w-5 h-5 rounded-full border-2 border-slate-200 group-hover:border-purple-300 transition-colors"></div>)}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'result') {
    return (
      <div dir="rtl" className="min-h-screen bg-[#F1F5F9] font-vazir pb-10">
        <GlobalStyles />
        <div className="bg-[#0F172A] text-white pt-12 pb-24 px-6 rounded-b-[3.5rem] shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black opacity-80"></div>
          <div className="absolute top-[-50%] right-[-20%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-20%] left-[-20%] w-[400px] h-[400px] bg-teal-500/20 rounded-full blur-[100px]"></div>
          <div className="relative z-10 text-center">
            <h2 className="text-teal-300/80 text-xs font-bold uppercase tracking-[0.2em] mb-6">نتیجه نهایی آزمون</h2>
            <div className="relative w-64 h-32 mx-auto mb-8 overflow-hidden">
              <div className="absolute bottom-0 w-full h-full border-[24px] border-slate-800 rounded-t-full border-b-0"></div>
              <div className={`absolute bottom-0 w-full h-full border-[24px] border-teal-400 rounded-t-full border-b-0 origin-bottom transition-all duration-[2000ms] cubic-bezier(0.34, 1.56, 0.64, 1) shadow-[0_0_40px_rgba(45,212,191,0.5)]`} style={{ transform: isAnimating ? 'rotate(0deg)' : 'rotate(-180deg)', opacity: isAnimating ? 1 : 0 }}></div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-white ring-4 ring-teal-500/50 rounded-full z-10 shadow-lg"></div>
            </div>
            <div className="animate-fade-in-up">
              <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 mb-2 font-sans tracking-tighter drop-shadow-lg">{finalLevel.code}</h1>
              <p className="text-xl text-purple-200 font-medium">{finalLevel.label}</p>
            </div>
          </div>
        </div>
        <div className="px-5 -mt-16 relative z-20 space-y-5 max-w-lg mx-auto">
          <div className="bg-white/95 backdrop-blur-xl p-6 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-white">
            <div className="flex items-center gap-3 mb-3 border-b border-slate-100 pb-3"><div className="bg-blue-50 p-2.5 rounded-2xl text-blue-600 shadow-inner"><BookOpen size={22} /></div><h3 className="font-extrabold text-slate-800 text-lg">این سطح به چه معناست؟</h3></div>
            <p className="text-slate-600 leading-7 text-sm text-justify font-medium">{finalLevel.desc}</p>
          </div>
          <div className="bg-white/95 backdrop-blur-xl p-6 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-white">
            <div className="flex items-center gap-3 mb-3"><div className="bg-teal-50 p-2.5 rounded-2xl text-teal-600 shadow-inner"><Activity size={22} /></div><h3 className="font-extrabold text-slate-800 text-lg">تحلیل تخصصی عملکرد</h3></div>
            <p className="text-slate-600 leading-7 text-sm text-justify font-medium">{analysis}</p>
          </div>
          <div className="bg-white/95 backdrop-blur-xl p-6 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-white">
            <div className="flex items-center gap-3 mb-3"><div className="bg-purple-50 p-2.5 rounded-2xl text-purple-600 shadow-inner"><Lock size={22} /></div><h3 className="font-extrabold text-slate-800 text-lg">نقشه راه پیشرفت شما</h3></div>
            <p className="text-slate-600 leading-7 text-sm text-justify font-medium">{roadmap}</p>
          </div>
          <div className="mt-8 text-center px-4 animate-fade-in-up delay-300">
             <div className="inline-block bg-teal-50 border border-teal-100 rounded-2xl p-4 shadow-sm">
                 <div className="flex items-center justify-center gap-2 text-teal-700 font-black text-sm mb-2"><TicketPercent className="w-5 h-5" />پیشنهاد ویژه ثبت‌نام</div>
                 <p className="text-slate-700 font-bold text-sm leading-7">با ارائه اسکرین‌شات این صفحه به پشتیبانی،<br/><span className="text-purple-600 font-black text-xl mx-1 bg-purple-100 px-2 rounded-md inline-block my-1">۲۰٪ تخفیف ویژه</span><br/>برای ثبت‌نام در دوره جامع آکادمی زبان بتی دریافت کنید.</p>
             </div>
          </div>
          <div className="pt-6 pb-8">
            <div className="relative group cursor-default">
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-400 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
              <div className="relative bg-[#0F172A] rounded-2xl p-1 flex items-center justify-center">
                 <div className="w-full bg-[#0F172A] border border-teal-500/50 rounded-xl py-4 px-6 flex items-center justify-center gap-3 shadow-[inset_0_0_20px_rgba(45,212,191,0.2)]">
                    <Camera className="text-teal-400 w-6 h-6 animate-pulse" />
                    <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-white neon-text tracking-wide">اسکرین‌شات بگیرید</span>
                 </div>
              </div>
            </div>
          </div>
          <div className="text-center pb-2 opacity-50"><p className="text-slate-400 text-[10px] tracking-widest uppercase">© Betty Academy 2024</p></div>
        </div>
      </div>
    );
  }
  return null;
};
export default App;