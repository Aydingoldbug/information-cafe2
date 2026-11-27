import { SimulationScenario } from '../types';

export const SIMULATION_SCENARIOS: SimulationScenario[] = [
  {
    id: 'sim_plate_nobat',
    title: 'شبیه‌ساز گام‌به‌گام نوبت‌دهی تعویض پلاک خودرو و احراز سخا',
    serviceTitle: 'نوبت دهی تعویض پلاک + احراز آدرس سخا',
    category: 'vehicle',
    level: 'yellow',
    customerProfile: {
      name: 'مهدی کریمی',
      nationalId: '0019845231',
      phone: '09123456789',
      situation: 'خریدار یک دستگاه پژو ۲۰۷ است. می‌خواهد برای فردا در مرکز میثم یا خاوران نوبت تعویض پلاک بگیرد. هنوز مطمئن نیست آدرس سخایش تایید شده است یا نه.',
      documentsAvailable: [
        'کارت ملی و شناسنامه هوشمند',
        'برگ سبز و کارت خودرو فروشنده',
        'کد پستی ۱۰ رقمی محل سکونت جدید در شهرری',
        'تلفن همراه فعال به نام خود'
      ]
    },
    steps: [
      {
        stepNumber: 1,
        title: 'استعلام وضعیت احراز آدرس در سامانه سخا',
        instruction: 'ابتدا باید مشخص شود آیا نشانی خریدار در سامانه سخا پلیس احراز و تایید شده است یا خیر.',
        systemInterface: {
          portalName: 'سامانه خدمات الکترونیک انتظامی سخا (sakha.epolice.ir)',
          screenTitle: 'پرتال کاربری - استعلام نشانی سکونت',
          fields: [
            {
              label: 'کد ملی خریدار',
              fieldName: 'nationalId',
              type: 'text',
              placeholder: '0019845231',
              required: true,
              expectedValue: '0019845231'
            },
            {
              label: 'کد پستی ۱۰ رقمی محل سکونت',
              fieldName: 'postalCode',
              type: 'text',
              placeholder: '1843788476',
              required: true,
              expectedValue: '1843788476'
            },
            {
              label: 'وضعیت احراز پست',
              fieldName: 'postStatus',
              type: 'select',
              options: ['تایید شده توسط مامور پست (سبز)', 'در انتظار مراجعه مامور پست', 'رد شده به علت عدم حضور'],
              required: true,
              expectedValue: 'تایید شده توسط مامور پست (سبز)'
            }
          ]
        },
        validationWarning: 'بدون تاییدیه سبز مامور پست در سخا، سامانه نوبت‌دهی پلاک در مرحله بعدی قفل خواهد شد!'
      },
      {
        stepNumber: 2,
        title: 'بررسی تسویه مالیات نقل و انتقال و خلافی',
        instruction: 'از مشتری بپرسید آیا مالیات نقل و انتقال در مای‌تکس پرداخت شده است؟ برای تسریع فرآیند، استعلام شناسه واریز را فعال کنید.',
        systemInterface: {
          portalName: 'سامانه مالیات نقل و انتقال خودرو (my.tax.gov.ir)',
          screenTitle: 'استعلام مفاصا حساب نقل و انتقال وسایط نقلیه',
          fields: [
            {
              label: 'شماره پلاک ایران',
              fieldName: 'plateNumber',
              type: 'text',
              placeholder: 'ایران ۳۳ - ۴۸۵ ج ۹۱',
              required: true,
              expectedValue: 'ایران ۳۳ - ۴۸۵ ج ۹۱'
            },
            {
              label: 'وضعیت پرداخت مالیات نقل و انتقال',
              fieldName: 'taxPaid',
              type: 'select',
              options: ['پرداخت شده - مفاصا حساب صادر شد', 'دارای بدهی مالیاتی نقل و انتقال'],
              required: true,
              expectedValue: 'پرداخت شده - مفاصا حساب صادر شد'
            }
          ]
        }
      },
      {
        stepNumber: 3,
        title: 'رزرو ساعت در مرکز تعویض پلاک و صدور نوبت بارکددار',
        instruction: 'انتخاب مرکز تعویض پلاک، درج پلاک و کد ملی خریدار و صدور نهایی فیش بارکددار.',
        systemInterface: {
          portalName: 'سامانه نوبت دهی تعویض پلاک (nobatdehi.epolice.ir)',
          screenTitle: 'انتخاب مرکز، تاریخ و نهایی‌سازی نوبت',
          fields: [
            {
              label: 'استان و شهر',
              fieldName: 'city',
              type: 'select',
              options: ['تهران - مرکز میثم', 'تهران - مرکز خاوران', 'تهران - مرکز اتحاد'],
              required: true,
              expectedValue: 'تهران - مرکز خاوران'
            },
            {
              label: 'نوع خدمت',
              fieldName: 'serviceType',
              type: 'select',
              options: ['نقل و انتقال و تعویض پلاک', 'المثنی برگ سبز یا پلاک', 'تغییر آدرس'],
              required: true,
              expectedValue: 'نقل و انتقال و تعویض پلاک'
            },
            {
              label: 'کد تایید پیامکی ارسالی به متقاضی',
              fieldName: 'otpCode',
              type: 'otp',
              placeholder: 'کد ۵ رقمی',
              required: true,
              expectedValue: '74125'
            }
          ]
        }
      }
    ],
    successCriteria: [
      'تایید سخا قبل از ورود به رزرو نوبت پلاک',
      'بررسی تسویه مالیات نقل و انتقال برای جلوگیری از برگشت خوردن مشتری در مرکز تعویض پلاک',
      'صدور رسید دارای بارکد و تاریخ دقیق به مشتری'
    ]
  },
  {
    id: 'sim_marriage_loan',
    title: 'شبیه‌ساز ثبت‌نام وام قرض‌الحسنه ازدواج و املاک و اسکان',
    serviceTitle: 'ثبت نام وام ازدواج به ازای هر نفر',
    category: 'banking',
    level: 'yellow',
    customerProfile: {
      name: 'فاطمه رضایی و علی قاسمی',
      nationalId: '0021458963',
      phone: '09351234567',
      situation: '۳ ماه پیش عقد کرده‌اند. برای دریافت وام ازدواج هر کدام به مبلغ ۳۰۰ میلیون تومان آمده‌اند و می‌خواهند در بانک ملی یا ملت ثبت‌نام شوند.',
      documentsAvailable: [
        'اصل عقدنامه رسمی با شماره ثبت دفترخانه',
        'شناسنامه زوجین با ثبت واقعه ازدواج',
        'کارت ملی و کد پستی محل سکونت',
        'شماره شبای حساب بانکی متقاضی'
      ]
    },
    steps: [
      {
        stepNumber: 1,
        title: 'استعلام واقعه ازدواج در ثبت احوال و ورود به سامانه بانک مرکزی',
        instruction: 'ورود به درگاه ve.cbi.ir و درج دقیق شماره سریال شناسنامه و اطلاعات هویتی زوجه.',
        systemInterface: {
          portalName: 'سامانه تسهیلات قرض‌الحسنه ازدواج (ve.cbi.ir)',
          screenTitle: 'فرم پیش‌ثبت‌نام متقاضی',
          fields: [
            {
              label: 'کد ملی متقاضی',
              fieldName: 'nationalId',
              type: 'text',
              placeholder: '0021458963',
              required: true,
              expectedValue: '0021458963'
            },
            {
              label: 'شماره سریال شناسنامه (حرف و عدد)',
              fieldName: 'shNo',
              type: 'text',
              placeholder: 'الف / ۶۲ / ۴۵۸۹۲۱',
              required: true,
              expectedValue: 'الف/۶۲/۴۵۸۹۲۱'
            },
            {
              label: 'تاریخ دقیق وقوع عقد',
              fieldName: 'marriageDate',
              type: 'text',
              placeholder: '۱۴۰۵/۰۲/۱۵',
              required: true,
              expectedValue: '۱۴۰۵/۰۲/۱۵'
            }
          ]
        }
      },
      {
        stepNumber: 2,
        title: 'انتخاب بانک عامل دارای سهمیه اعتباری در شهرستان ری',
        instruction: 'بررسی بانک‌های دارای بودجه و انتخاب شعبه مناسب برای متقاضی.',
        systemInterface: {
          portalName: 'بانک مرکزی جمهوری اسلامی ایران',
          screenTitle: 'انتخاب استان، شهرستان و بانک عامل',
          fields: [
            {
              label: 'استان و شهرستان محل سکونت',
              fieldName: 'province',
              type: 'select',
              options: ['تهران - شهرستان ری', 'تهران - شهر تهران'],
              required: true,
              expectedValue: 'تهران - شهرستان ری'
            },
            {
              label: 'بانک‌های عامل دارای سهمیه باز',
              fieldName: 'bankSelected',
              type: 'select',
              options: ['بانک ملی ایران (دارای سهمیه)', 'بانک سپه (دارای سهمیه)', 'بانک ملت (تکمیل ظرفیت)'],
              required: true,
              expectedValue: 'بانک ملی ایران (دارای سهمیه)'
            },
            {
              label: 'شعبه مد نظر متقاضی',
              fieldName: 'branch',
              type: 'text',
              placeholder: 'شعبه فداییان اسلام ری',
              required: true,
              expectedValue: 'شعبه فداییان اسلام ری'
            }
          ]
        }
      },
      {
        stepNumber: 3,
        title: 'دریافت کد رهگیری ۱۰ رقمی محرمانه و تحویل برگه چاپی',
        instruction: 'کد رهگیری محرمانه وام را ثبت کرده و پیامک تایید را به متقاضی نشان دهید.',
        systemInterface: {
          portalName: 'سامانه ثبت‌نام ازدواج بانک مرکزی',
          screenTitle: 'صدور تاییدیه ثبت‌نام نهایی',
          fields: [
            {
              label: 'کد رهگیری ۱۰ رقمی',
              fieldName: 'trackingCode',
              type: 'text',
              placeholder: '9845123047',
              required: true,
              expectedValue: '9845123047'
            },
            {
              label: 'هزینه مصوب کافی‌نت (نرخ‌نامه ۱۴۰۵)',
              fieldName: 'feeApproved',
              type: 'text',
              placeholder: '۱۵۰,۰۰۰ تومان (۱,۵۰۰,۰۰۰ ریال)',
              required: true,
              expectedValue: '۱۵۰,۰۰۰ تومان'
            }
          ]
        }
      }
    ],
    successCriteria: [
      'عدم ثبت نام با تاریخ عقد منقضی شده',
      'انتخاب دقیق بانک دارای سهمیه بدون ارور تکمیل ظرفیت',
      'تحویل برگه رسمی کد رهگیری به متقاضی'
    ]
  },
  {
    id: 'sim_tax_tabasreh',
    title: 'شبیه‌ساز ارسال اظهارنامه تبصره ماده ۱۰۰ مالیاتی',
    serviceTitle: 'اظهارنامه مالیاتی تبصره ماده ۱۰۰',
    category: 'tax',
    level: 'yellow',
    customerProfile: {
      name: 'حسین احمدی (کسبه صنف لوازم یدکی)',
      nationalId: '0491234567',
      phone: '09121112233',
      situation: 'دارای پروانه کسب معتبر است. مجموع گردش کارتخوان در سال گذشته ۱ میلیارد و ۲۰۰ میلیون تومان بوده. مایل است از تسهیلات مقطوع تبصره ۱۰۰ استفاده کند.',
      documentsAvailable: [
        'کد رهگیری پیش‌ثبت‌نام مالیاتی گام ۴',
        'رمز عبور درگاه مای تکس',
        'پرینت صورتحساب سالانه کارتخوان'
      ]
    },
    steps: [
      {
        stepNumber: 1,
        title: 'ورود به درگاه ملی خدمات مالیاتی و استعلام گردش پوز',
        instruction: 'بررسی اتصال کارتخوان‌ها و مشاهده سرجمع واریزی‌های تجاری ثبت شده در شاپرک.',
        systemInterface: {
          portalName: 'سازمان امور مالیاتی (my.tax.gov.ir)',
          screenTitle: 'کارتابل مودی - سامانه تبصره ۱۰۰',
          fields: [
            {
              label: 'کد رهگیری مالیاتی مودی',
              fieldName: 'taxId',
              type: 'text',
              placeholder: '100489562',
              required: true,
              expectedValue: '100489562'
            },
            {
              label: 'سرجمع تراکنش‌های مشمول مالیات',
              fieldName: 'posTotal',
              type: 'text',
              placeholder: '۱۲,۰۰۰,۰۰۰,۰۰۰ ریال (۱.۲ میلیارد تومان)',
              required: true,
              expectedValue: '۱۲,۰۰۰,۰۰۰,۰۰۰ ریال'
            }
          ]
        }
      },
      {
        stepNumber: 2,
        title: 'مشاهده مالیات مقطوع محاسباتی و اعلام به مودی',
        instruction: 'مبلغ مالیات مقطوع تعیین شده توسط سامانه (مثلاً ۲۲ میلیون تومان) را به مودی نشان دهید و تایید رضایت بگیرید.',
        systemInterface: {
          portalName: 'فرم الکترونیک توافق تبصره ۱۰۰',
          screenTitle: 'محاسبه مالیات مقطوع و تقسیط قبوض',
          fields: [
            {
              label: 'مالیات مقطوع تعیین‌شده توسط سازمان (تومان)',
              fieldName: 'taxAmountToman',
              type: 'text',
              placeholder: '۲۲,۰۰۰,۰۰۰ تومان',
              required: true,
              expectedValue: '۲۲,۰۰۰,۰۰۰ تومان'
            },
            {
              label: 'تایید رضایت قطعی مودی بدون اعتراض بعدی',
              fieldName: 'clientConsent',
              type: 'select',
              options: ['مودی مبلغ را قبول دارد و درخواست تقسیط دارد', 'مودی مبلغ را بسیار بالا می‌داند و اعتراض دارد'],
              required: true,
              expectedValue: 'مودی مبلغ را قبول دارد و درخواست تقسیط دارد'
            },
            {
              label: 'تعداد اقساط درخواستی',
              fieldName: 'installments',
              type: 'select',
              options: ['۱ قسط (یکجا)', '۳ قسط ماهانه', '۵ قسط با شناسه پرداخت مجزا'],
              required: true,
              expectedValue: '۵ قسط با شناسه پرداخت مجزا'
            }
          ]
        }
      },
      {
        stepNumber: 3,
        title: 'ارسال نهایی اظهارنامه و چاپ قبوض اقساط',
        instruction: 'ارسال فرم تبصره ۱۰۰، تولید شناسه پرداخت برای هر قسط و صدور فاکتور کافی‌نت (۴۵۰,۰۰۰ تومان).',
        systemInterface: {
          portalName: 'سازمان امور مالیاتی کشور',
          screenTitle: 'برگ قطعی مالیات تبصره ۱۰۰ صادر شد',
          fields: [
            {
              label: 'کد رهگیری ثبت نهایی اظهارنامه',
              fieldName: 'finalReceipt',
              type: 'text',
              placeholder: 'TX-1405-99841',
              required: true,
              expectedValue: 'TX-1405-99841'
            },
            {
              label: 'هزینه خدمات کافی‌نت طبق نرخ‌نامه ۱۴۰۵',
              fieldName: 'cafeFee',
              type: 'text',
              placeholder: '۴۵۰,۰۰۰ تومان (۴,۵۰۰,۰۰۰ ریال)',
              required: true,
              expectedValue: '۴۵۰,۰۰۰ تومان'
            }
          ]
        }
      }
    ],
    successCriteria: [
      'اطمینان از رضایت کتبی/شفاهی مودی قبل از ثبت قطعی تبصره ۱۰۰',
      'تولید صحیح اقساط با تاریخ سررسید دقیق',
      'ثبت دستمزد مصوب ۴۵۰ هزار تومانی در سیستم'
    ]
  }
];

export const ERROR_LIBRARY = [
  {
    id: 'err_shahkar_mismatch',
    title: 'خطای تطابق شاهکار (کد ۱۲ سامانه ثنا یا سخا)',
    portal: 'سامانه احراز هویت شاهکار وزارت ارتباطات',
    frequency: 'بسیار بالا (۴۵٪ مراجعین اول وقت)',
    symptom: 'پیام خطای: شماره تلفن همراه با کد ملی متقاضی همخوانی ندارد.',
    rootCause: 'سیم‌کارت به نام پدر، همسر یا فرد دیگری خریده شده است، یا کمتر از ۲۴ ساعت است که تغییر مالکیت یافته.',
    actionRequired: 'استفاده از سیم‌کارت به نام خود متقاضی یا راهنمایی به نمایندگی اپراتور برای تغییر مالکیت برخط.'
  },
  {
    id: 'err_post_address_unverified',
    title: 'عدم تایید نشانی توسط شرکت پست در سخا',
    portal: 'سامانه سخا و شرکت ملی پست',
    frequency: 'بالا',
    symptom: 'سیستم نوبت‌دهی تعویض پلاک اجازه ثبت نمی‌دهد و خطای "عدم احراز نشانی" می‌دهد.',
    rootCause: 'مامور پست به آدرس مراجعه نکرده یا کد رهگیری پستی فعال نشده است.',
    actionRequired: 'ثبت مجدد درخواست در سخا، پرداخت عوارض پستی و تماس با باجه پستی منطقه برای اولویت‌دهی به تایید میدانی.'
  },
  {
    id: 'err_tabasreh_exceeded',
    title: 'رد درخواست تبصره ۱۰۰ به دلیل سقف فروش',
    portal: 'درگاه ملی خدمات مالیاتی my.tax',
    frequency: 'متوسط',
    symptom: 'گزینه فرم توافق تبصره ۱۰۰ در کارتابل غیرفعال است.',
    rootCause: 'تراکنش‌های واریزی بیش از سقف مقرر در آیین‌نامه بوده یا اینتاکد مودی جزو رسته‌های مشمول حذف از تبصره است.',
    actionRequired: 'ارسال اظهارنامه عادی ماده ۱۰۰ یا ارجاع به کارفرما جهت تنظیم دفتر درآمد و هزینه.'
  },
  {
    id: 'err_khodnevis_witness_otp',
    title: 'انقضای پیامک کد تایید شاهدین در سامانه خودنویس',
    portal: 'سامانه ثبت قرارداد خودنویس khodnevis.mrud.ir',
    frequency: 'بالا',
    symptom: 'قرارداد در مرحله امضای دیجیتال قفل می‌شود.',
    rootCause: 'مهلت کد پیامکی ۵ دقیقه است و یکی از شاهدین در دسترس نیست.',
    actionRequired: 'اطمینان از دسترسی هم‌زمان به هر دو شاهد قبل از فشردن دکمه امضای نهایی و ارسال مجدد پیامک.'
  }
];
