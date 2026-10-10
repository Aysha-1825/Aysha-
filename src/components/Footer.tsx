import React from 'react';
import { Box, Heart, Sparkles, BookOpen, Ruler, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 no-print mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-slate-800">
          {/* Brand & Teacher Credit */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black">
                <Box className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-white">عالم المجسمات وشبكاتها</h3>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              منصة تفاعلية تعليمية ثلاثية الأبعاد صُممت لتمكين الطلاب والمعلمين من استكشاف هندسة المجسمات، ومحاكاة فرد وطي الشبكات بدقة مع قياسات الأضلاع والمساحات والحجوم.
            </p>
            <div className="mt-2 inline-flex items-center gap-2 p-2.5 rounded-xl bg-indigo-950/70 border border-indigo-800/80 text-white text-xs w-fit">
              <Award className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>إعداد وتصميم وتنفيذ:</span>
              <strong className="text-amber-300 font-black">أ. عائشة ناصر السنيدية</strong>
            </div>
          </div>

          {/* Quick Features */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-sm font-extrabold text-white">الميزات التعليمية للمنصة</h4>
            <ul className="text-xs space-y-2 text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span>محاكاة طي وفرد الشبكات ثلاثية الأبعاد بالوقت الفعلي</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>مخططات هندسية ثنائية الأبعاد مع قياسات أطوال الأضلاع</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>حسابات لحظية للمساحة الكلية والجانبية والحجوم وعلاقة أويلر</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span>ألغاز تفاعلية وتحدي كاشف الشبكات الخادعة وبنك أسئلة مع شهادات</span>
              </li>
            </ul>
          </div>

          {/* Educational Note */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-sm font-extrabold text-white">إرشادات الاستخدام الصفي</h4>
            <p className="text-xs leading-relaxed text-slate-400">
              يمكن للمعلمين والطلاب طباعة شبكات المجسمات مباشرة عبر زر الطباعة المخصص، واستخدام ألسنة اللصق لتنفيذ أنشطة ورقية ومجسمات ملموسة داخل الغرفة الصفية.
            </p>
            <p className="text-[11px] text-slate-500 mt-2">
              جميع الحقوق التعليمية محفوظة • مادة الرياضيات
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} عالم المجسمات وشبكاتها • تنفيذ أ. عائشة ناصر السنيدية</p>
          <div className="flex items-center gap-2">
            <span>صُنع بشغف لتعليم الرياضيات والتميز الهندسي</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
        </div>
      </div>
    </footer>
  );
};
