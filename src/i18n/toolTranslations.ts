import { Language } from './translations';

export interface ToolTranslation {
  name: string;
  description: string;
}

// Translations for the 8 Featured Suites
export const FEATURED_SUITE_TRANSLATIONS: Partial<
  Record<
    Language,
    Record<
      string,
      {
        title: string;
        desc: string;
        linkText: string;
      }
    >
  >
> = {
  en: {
    text: {
      title: 'Text Tools',
      desc: 'Edit, format, transform case, count characters, and inspect text documents effortlessly.',
      linkText: 'Explore Text Tools',
    },
    image: {
      title: 'Image Tools',
      desc: 'Compress, convert formats, crop, resize, watermark, and filter photos without quality loss.',
      linkText: 'Explore Image Tools',
    },
    pdf: {
      title: 'PDF Magic Suite',
      desc: 'Convert PDFs to Word, Excel, CSV, Text, Images & vice-versa with client-side privacy.',
      linkText: 'Explore PDF Suite',
    },
    typing: {
      title: 'Typing Test & Tutor',
      desc: 'Test your typing speed (WPM), accuracy, and fluency with real-time feedback and lessons.',
      linkText: 'Start Typing Test',
    },
    encryption: {
      title: 'Encryption & Security',
      desc: 'Protect data with AES-256, DES, Base64, MD5/SHA hashes, and strong password generation.',
      linkText: 'Explore Security Tools',
    },
    web: {
      title: 'Web & Colors',
      desc: 'Convert HEX to RGB, generate palettes, inspect CSS styles, and optimize frontend design.',
      linkText: 'Explore Color Tools',
    },
    development: {
      title: 'Developer Tools',
      desc: 'JSON beautifier, validator, minifier, CSV/XML converters, and multi-language code formatters.',
      linkText: 'Explore Dev Tools',
    },
    calculator: {
      title: 'Calculators & Finance',
      desc: 'Calculate exact age, GST/VAT tax, EMI loan repayment, and compounding SIP returns.',
      linkText: 'Explore Calculators',
    },
  },
  hi: {
    text: {
      title: 'टेक्स्ट टूल्स',
      desc: 'टेक्स्ट संपादित करें, केस बदलें, शब्द और अक्षर गिनें, और दस्तावेज़ आसानी से फॉर्मेट करें।',
      linkText: 'टेक्स्ट टूल्स देखें',
    },
    image: {
      title: 'इमेज टूल्स',
      desc: 'फोटो कंप्रेस करें, फॉर्मेट बदलें, क्रॉप करें, वॉटरमार्क लगाएं बिना क्वालिटी खोए।',
      linkText: 'इमेज टूल्स देखें',
    },
    pdf: {
      title: 'PDF मैजिक सुइट',
      desc: 'PDF को Word, Excel, CSV, टेक्स्ट और इमेज में बदलें - 100% प्राइवेट ब्राउज़र में।',
      linkText: 'PDF टूल्स देखें',
    },
    typing: {
      title: 'टाइपिंग टेस्ट और ट्यूटर',
      desc: 'अपनी टाइपिंग गति (WPM) और सटीकता मापें, रियल-टाइम फीडबैक के साथ अभ्यास करें।',
      linkText: 'टाइपिंग टेस्ट शुरू करें',
    },
    encryption: {
      title: 'सुरक्षा और एन्क्रिप्शन',
      desc: 'AES-256, DES, Base64, MD5/SHA हैश और सुरक्षित पासवर्ड जेनरेटर के साथ डेटा सुरक्षित करें।',
      linkText: 'सुरक्षा टूल्स देखें',
    },
    web: {
      title: 'वेब और रंग टूल्स',
      desc: 'HEX को RGB में बदलें, कलर पैलेट बनाएं, CSS शैडो और ग्रेडिएंट डिज़ाइन करें।',
      linkText: 'कलर टूल्स देखें',
    },
    development: {
      title: 'डेवलपर टूल्स',
      desc: 'JSON ब्यूटीफायर, वैलिडेटर, मिनीफायर, CSV/XML कन्वर्टर और कोड फॉर्मेटर्स।',
      linkText: 'डेव टूल्स देखें',
    },
    calculator: {
      title: 'कैलकुलेटर और वित्त',
      desc: 'सही उम्र, GST टैक्स, बैंक लोन EMI और कंपाउंडिंग SIP रिटर्न की सटीक गणना करें।',
      linkText: 'कैलकुलेटर देखें',
    },
  },
  es: {
    text: {
      title: 'Herramientas de Texto',
      desc: 'Edite, formatee, transforme mayúsculas, cuente caracteres e inspeccione textos fácilmente.',
      linkText: 'Explorar Herramientas de Texto',
    },
    image: {
      title: 'Herramientas de Imagen',
      desc: 'Comprima, convierta formatos, recorte, redimensione y agregue marcas de agua sin perder calidad.',
      linkText: 'Explorar Herramientas de Imagen',
    },
    pdf: {
      title: 'Suite Mágica de PDF',
      desc: 'Convierta PDF a Word, Excel, CSV, Texto e imágenes con total privacidad en su navegador.',
      linkText: 'Explorar Suite PDF',
    },
    typing: {
      title: 'Prueba de Mecanografía',
      desc: 'Pruebe su velocidad de escritura (PPM), precisión y fluidez con retroalimentación en tiempo real.',
      linkText: 'Comenzar Prueba de Escritura',
    },
    encryption: {
      title: 'Criptografía y Seguridad',
      desc: 'Proteja datos con AES-256, DES, Base64, hashes MD5/SHA y generador de contraseñas seguras.',
      linkText: 'Explorar Herramientas de Seguridad',
    },
    web: {
      title: 'Web y Colores',
      desc: 'Convierta HEX a RGB, genere paletas, sombras CSS y gradientes para diseño web.',
      linkText: 'Explorar Herramientas de Color',
    },
    development: {
      title: 'Herramientas de Desarrollador',
      desc: 'Embellecedor de JSON, validador, minificador y convertidores de CSV/XML.',
      linkText: 'Explorar Herramientas Dev',
    },
    calculator: {
      title: 'Calculadoras y Finanzas',
      desc: 'Calcule edad exacta, impuestos IVA/GST, cuotas de préstamos y rendimientos de inversión.',
      linkText: 'Explorar Calculadoras',
    },
  },
  fr: {
    text: {
      title: 'Outils de Texte',
      desc: 'Éditez, formatez, transformez la casse, comptez les caractères et inspectez vos documents.',
      linkText: 'Explorer les Outils de Texte',
    },
    image: {
      title: 'Outils d\'Image',
      desc: 'Compressez, convertissez, recadrez et ajoutez des filigranes sans perte de qualité.',
      linkText: 'Explorer les Outils d\'Image',
    },
    pdf: {
      title: 'Suite Magique PDF',
      desc: 'Convertissez des PDF en Word, Excel, CSV, Texte et images en toute confidentialité.',
      linkText: 'Explorer la Suite PDF',
    },
    typing: {
      title: 'Test de Dactylographie',
      desc: 'Testez votre vitesse de frappe (MPM) et votre précision avec analyse en temps réel.',
      linkText: 'Démarrer le Test de Frappe',
    },
    encryption: {
      title: 'Chiffrement & Sécurité',
      desc: 'Protégez vos données avec AES-256, DES, Base64, hachages MD5/SHA et mots de passe forts.',
      linkText: 'Explorer les Outils de Sécurité',
    },
    web: {
      title: 'Web & Couleurs',
      desc: 'Convertissez HEX en RGB, générez des palettes de couleurs et prévisualisez des ombres CSS.',
      linkText: 'Explorer les Outils Couleurs',
    },
    development: {
      title: 'Outils Développeur',
      desc: 'Embellisseur JSON, validateur, minificateur et convertisseurs CSV/XML.',
      linkText: 'Explorer les Outils Développeur',
    },
    calculator: {
      title: 'Calculatrices & Finance',
      desc: 'Calculez l\'âge exact, la TVA, les mensualités de prêt et les rendements d\'épargne.',
      linkText: 'Explorer les Calculatrices',
    },
  },
  bn: {
    text: {
      title: 'টেক্সট টুলস',
      desc: 'টেক্সট এডিট করুন, কেস পরিবর্তন করুন, শব্দ ও অক্ষর গণনা করুন খুব সহজে।',
      linkText: 'টেক্সট টুলস দেখুন',
    },
    image: {
      title: 'ইমেজ টুলস',
      desc: 'ছবি কম্প্রেস করুন, ফরম্যাট পরিবর্তন করুন ও ওয়াটারমার্ক দিন মান না হারিয়ে।',
      linkText: 'ইমেজ টুলস দেখুন',
    },
    pdf: {
      title: 'পিডিএফ ম্যাজিক স্যুট',
      desc: 'পিডিএফ থেকে ওয়ার্ড, এক্সেল, সিএসভি ও ছবিতে রূপান্তর করুন নিরাপদে।',
      linkText: 'পিডিএফ টুলস দেখুন',
    },
    typing: {
      title: 'টাইপিং টেস্ট',
      desc: 'আপনার টাইপিং গতি ও নির্ভুলতা পরীক্ষা করুন রিয়েল-টাইম ফলাফলের সাথে।',
      linkText: 'টাইপিং টেস্ট শুরু করুন',
    },
    encryption: {
      title: 'এনক্রিপশন ও সুরক্ষা',
      desc: 'AES-256, Base64, MD5/SHA হ্যাশ ও পাসওয়ার্ড জেনারেটরের মাধ্যমে ডেটা সুরক্ষিত রাখুন।',
      linkText: 'নিরাপত্তা টুলস দেখুন',
    },
    web: {
      title: 'ওয়েব ও কালার টুলস',
      desc: 'HEX থেকে RGB রূপান্তর, প্যালেট তৈরি এবং সিএসএস শ্যাডো ডিজাইন করুন।',
      linkText: 'কালার টুলস দেখুন',
    },
    development: {
      title: 'ডেভেলপার টুলস',
      desc: 'JSON বিউটিফায়ার, ভ্যালিডেটর, মিনিফায়ার এবং কোড ফরম্যাটার।',
      linkText: 'ডেভেলপার টুলস দেখুন',
    },
    calculator: {
      title: 'ক্যালকুলেটর ও অর্থ',
      desc: 'বয়স, জিএসটি ট্যাক্স, ব্যাংক লোন ইএমআই ও বিনিয়োগের হিসাব করুন।',
      linkText: 'ক্যালকুলেটর দেখুন',
    },
  },
  te: {
    text: {
      title: 'టెక్స్ట్ టూల్స్',
      desc: 'టెక్స్ట్ ఎడిట్ చేయండి, కేస్ మార్చండి, అక్షరాలు లెక్కించండి సులభంగా.',
      linkText: 'టెక్స్ట్ టూల్స్ చూడండి',
    },
    image: {
      title: 'ఇమేజ్ టూల్స్',
      desc: 'నాణ్యత కోల్పోకుండా ఫోటోలను కంప్రెస్ చేయండి, ఫార్మాట్ మార్చండి.',
      linkText: 'ఇమేజ్ టూల్స్ చూడండి',
    },
    pdf: {
      title: 'పిడిఎఫ్ మ్యాజిక్ సూట్',
      desc: 'పిడిఎఫ్‌ను వర్డ్, ఎక్సెల్, ఇమేజ్‌గా మార్చండి సురక్షితంగా.',
      linkText: 'పిడిఎఫ్ టూల్స్ చూడండి',
    },
    typing: {
      title: 'టైపింగ్ టెస్ట్',
      desc: 'మీ టైపింగ్ వేగం మరియు ఖచ్చితత్వాన్ని పరీక్షించండి.',
      linkText: 'టైపింగ్ ప్రారంభించండి',
    },
    encryption: {
      title: 'ఎన్‌క్రిప్షన్ & సెక్యూరిటీ',
      desc: 'AES-256, Base64 మరియు సురక్షిత పాస్‌వర్డ్ జనరేటర్‌తో డేటాను భద్రపరచండి.',
      linkText: 'సెక్యూరిటీ టూల్స్ చూడండి',
    },
    web: {
      title: 'వెబ్ & కలర్ టూల్స్',
      desc: 'HEX నుండి RGBకి మార్చండి, రంగుల ప్యాలెట్‌లను రూపొందించండి.',
      linkText: 'కలర్ టూల్స్ చూడండి',
    },
    development: {
      title: 'డెవలపర్ టూల్స్',
      desc: 'JSON బ్యూటిఫైయర్, వాలిడేటర్, మినిఫైయర్ మరియు కోడ్ ఫార్మాటర్లు.',
      linkText: 'డెవ్ టూల్స్ చూడండి',
    },
    calculator: {
      title: 'కాలిక్యులేటర్లు & ఫైనాన్స్',
      desc: 'ఖచ్చితమైన వయస్సు, జీఎస్టీ పన్ను, లోన్ ఈఎంఐని లెక్కించండి.',
      linkText: 'కాలిక్యులేటర్లు చూడండి',
    },
  },
  ta: {
    text: {
      title: 'உரை கருவிகள்',
      desc: 'உரையைத் திருத்தவும், கேஸை மாற்றவும், எழுத்துக்களை எண்ணவும் எளிதாக.',
      linkText: 'உரை கருவிகளைக் காண்க',
    },
    image: {
      title: 'படக் கருவிகள்',
      desc: 'படங்களை சுருக்கவும், வடிவமைப்பை மாற்றவும், தரத்தை இழக்காமல்.',
      linkText: 'படக் கருவிகளைக் காண்க',
    },
    pdf: {
      title: 'PDF மேஜிக் தொகுப்பு',
      desc: 'PDF-ஐ Word, Excel, உரை மற்றும் படங்களாக பாதுகாப்பாக மாற்றவும்.',
      linkText: 'PDF கருவிகளைக் காண்க',
    },
    typing: {
      title: 'தட்டச்சு சோதனை',
      desc: 'உங்கள் தட்டச்சு வேகம் மற்றும் துல்லியத்தை பரிசோதிக்கவும்.',
      linkText: 'தட்டச்சு தொடங்கவும்',
    },
    encryption: {
      title: 'குறியாக்கம் & பாதுகாப்பு',
      desc: 'AES-256, Base64 மற்றும் பாதுகாப்பான கடவுச்சொல் மூலம் தரவைப் பாதுகாக்கவும்.',
      linkText: 'பாதுகாப்பு கருவிகளைக் காண்க',
    },
    web: {
      title: 'வலை & வண்ணங்கள்',
      desc: 'HEX-ஐ RGB-ஆக மாற்றவும், வண்ணத் தட்டுகளை உருவாக்கவும்.',
      linkText: 'வண்ணக் கருவிகளைக் காண்க',
    },
    development: {
      title: 'டெவலப்பர் கருவிகள்',
      desc: 'JSON அழகுபடுத்தி, சரிபார்ப்பான் மற்றும் குறியீடு வடிவமைப்பு கருவிகள்.',
      linkText: 'டெவ் கருவிகளைக் காண்க',
    },
    calculator: {
      title: 'கால்குலேட்டர்கள் & நிதி',
      desc: 'சரியான வயது, ஜிஎஸ்டி வரி, கடன் தவணையை துல்லியமாகக் கணக்கிடுங்கள்.',
      linkText: 'கால்குலேட்டர்களைக் காண்க',
    },
  },
  mr: {
    text: {
      title: 'टेक्स्ट टूल्स',
      desc: 'टेक्स्ट संपादित करा, केस बदला, शब्द आणि अक्षरे सहज मोजा.',
      linkText: 'टेक्स्ट टूल्स पहा',
    },
    image: {
      title: 'इमेज टूल्स',
      desc: 'फोटो कॉम्प्रेस करा, फॉरमॅट बदला, वॉटरमार्क लावा गुणवत्ता न गमावता.',
      linkText: 'इमेज टूल्स पहा',
    },
    pdf: {
      title: 'PDF मॅजिक सुइट',
      desc: 'PDF ला Word, Excel, मजकूर आणि इमेजमध्ये रूपांतरित करा सुरक्षितपणे.',
      linkText: 'PDF टूल्स पहा',
    },
    typing: {
      title: 'टायपिंग टेस्ट',
      desc: 'तुमचा टायपिंग वेग आणि अचूकता त्वरित तपासा.',
      linkText: 'टायपिंग चाचणी सुरू करा',
    },
    encryption: {
      title: 'सुरक्षा आणि एन्क्रिप्शन',
      desc: 'AES-256, Base64 आणि मजबूत पासवर्ड जनरेटरने डेटा सुरक्षित करा.',
      linkText: 'सुरक्षा टूल्स पहा',
    },
    web: {
      title: 'वेब आणि रंग साधने',
      desc: 'HEX चे RGB मध्ये रूपांतर करा, सुंदर कलर पॅलेट्स तयार करा.',
      linkText: 'रंग टूल्स पहा',
    },
    development: {
      title: 'डेव्हलपर टूल्स',
      desc: 'JSON ब्युटीफायर, व्हॅलिडेटर, मिनिफायर आणि कोड फॉरमॅटर्स.',
      linkText: 'डेव्ह टूल्स पहा',
    },
    calculator: {
      title: 'कॅल्क्युलेटर आणि वित्त',
      desc: 'अचूक वय, जीएसटी कर, लोन ईएमआय आणि एसआयपी परतावा मोजा.',
      linkText: 'कॅल्क्युलेटर पहा',
    },
  },
  gu: {
    text: {
      title: 'ટેક્સ્ટ ટૂલ્સ',
      desc: 'ટેક્સ્ટ એડિટ કરો, કેસ બદલો, અક્ષરો અને શબ્દો સરળતાથી ગણો.',
      linkText: 'ટેક્સ્ટ ટૂલ્સ જુઓ',
    },
    image: {
      title: 'ઇમેજ ટૂલ્સ',
      desc: 'ગુણવત્તા ગુમાવ્યા વિના ફોટા સંકુચિત કરો અને ફોર્મેટ બદલો.',
      linkText: 'ઇમેજ ટૂલ્સ જુઓ',
    },
    pdf: {
      title: 'પીડીએફ મેજિક સ્યુટ',
      desc: 'પીડીએફને વર્ડ, એક્સેલ અને ફોટામાં સુરક્ષિત રીતે કન્વર્ટ કરો.',
      linkText: 'પીડીએફ ટૂલ્સ જુઓ',
    },
    typing: {
      title: 'ટાઈપિંગ ટેસ્ટ',
      desc: 'તમારી ટાઈપિંગ ઝડપ અને ચોકસાઈની તુરંત ચકાસણી કરો.',
      linkText: 'ટાઈપિંગ શરૂ કરો',
    },
    encryption: {
      title: 'એન્ક્રિપ્શન અને સુરક્ષા',
      desc: 'AES-256, Base64 અને પાસવર્ડ જનરેટર વડે ડેટા સુરક્ષિત કરો.',
      linkText: 'સુરક્ષા ટૂલ્સ જુઓ',
    },
    web: {
      title: 'વેબ અને રંગ સાધનો',
      desc: 'HEX થી RGB કન્વર્ટ કરો, રંગ પેલેટ્સ બનાવો.',
      linkText: 'કલર ટૂલ્સ જુઓ',
    },
    development: {
      title: 'ડેવલપર ટૂલ્સ',
      desc: 'JSON બ્યુટિફાયર, વેલિડેટર, મિનિફાયર અને કોડ ફોર્મેટર્સ.',
      linkText: 'ડેવ ટૂલ્સ જુઓ',
    },
    calculator: {
      title: 'કેલ્ક્યુલેટર અને નાણાકીય',
      desc: 'ચોક્કસ ઉંમર, જીએસટી ટેક્સ અને લોન ઇએમઆઈની ગણતરી કરો.',
      linkText: 'કેલ્ક્યુલેટર જુઓ',
    },
  },
  kn: {
    text: {
      title: 'ಪಠ್ಯ ಪರಿಕರಗಳು',
      desc: 'ಪಠ್ಯವನ್ನು ಸಂಪಾದಿಸಿ, ಕೇಸ್ ಬದಲಾಯಿಸಿ, ಅಕ್ಷರಗಳನ್ನು ಸುಲಭವಾಗಿ ಎಣಿಸಿ.',
      linkText: 'ಪಠ್ಯ ಪರಿಕರಗಳನ್ನು ನೋಡಿ',
    },
    image: {
      title: 'ಚಿತ್ರ ಪರಿಕರಗಳು',
      desc: 'ಗುಣಮಟ್ಟ ಕಳೆದುಕೊಳ್ಳದೆ ಫೋಟೋಗಳನ್ನು ಕಂಪ್ರೆಸ್ ಮಾಡಿ ಮತ್ತು ಪರಿವರ್ತಿಸಿ.',
      linkText: 'ಚಿತ್ರ ಪರಿಕರಗಳನ್ನು ನೋಡಿ',
    },
    pdf: {
      title: 'ಪಿಡಿಎಫ್ ಮ್ಯಾಜಿಕ್ ಸೂಟ್',
      desc: 'ಪಿಡಿಎಫ್ ಅನ್ನು ವರ್ಡ್, ಎಕ್ಸೆಲ್ ಮತ್ತು ಚಿತ್ರಗಳಿಗೆ ಪರಿವರ್ತಿಸಿ.',
      linkText: 'ಪಿಡಿಎಫ್ ಪರಿಕರಗಳನ್ನು ನೋಡಿ',
    },
    typing: {
      title: 'ಟೈಪಿಂಗ್ ಪರೀಕ್ಷೆ',
      desc: 'ನಿಮ್ಮ ಟೈಪಿಂಗ್ ವೇಗ ಮತ್ತು ನಿಖರತೆಯನ್ನು ಪರೀಕ್ಷಿಸಿ.',
      linkText: 'ಟೈಪಿಂಗ್ ಪ್ರಾರಂಭಿಸಿ',
    },
    encryption: {
      title: 'ಎನ್‌ಕ್ರಿಪ್ಶನ್ ಮತ್ತು ಭದ್ರತೆ',
      desc: 'AES-256 ಮತ್ತು ಪಾಸ್‌ವರ್ಡ್ ಜನರೇಟರ್‌ನೊಂದಿಗೆ ಡೇಟಾವನ್ನು ರಕ್ಷಿಸಿ.',
      linkText: 'ಭದ್ರತಾ ಪರಿಕರಗಳನ್ನು ನೋಡಿ',
    },
    web: {
      title: 'ವೆಬ್ ಮತ್ತು ಬಣ್ಣಗಳು',
      desc: 'HEX ಅನ್ನು RGB ಗೆ ಪರಿವರ್ತಿಸಿ, ಬಣ್ಣದ ಪ್ಯಾಲೆಟ್‌ಗಳನ್ನು ರಚಿಸಿ.',
      linkText: 'ಬಣ್ಣ ಪರಿಕರಗಳನ್ನು ನೋಡಿ',
    },
    development: {
      title: 'ಡೆವಲಪರ್ ಪರಿಕರಗಳು',
      desc: 'JSON ಬ್ಯೂಟಿಫೈಯರ್, ವ್ಯಾಲಿಡೇಟರ್ ಮತ್ತು ಕೋಡ್ ಫಾರ್ಮ್ಯಾಟರ್‌ಗಳು.',
      linkText: 'ಡೆವ್ ಪರಿಕರಗಳನ್ನು ನೋಡಿ',
    },
    calculator: {
      title: 'ಕ್ಯಾಲ್ಕುಲೇಟರ್ ಮತ್ತು ಹಣಕಾಸು',
      desc: 'ನಿಖರವಾದ ವಯಸ್ಸು, ಜಿಎಸ್ಟಿ ತೆರಿಗೆ ಮತ್ತು ಲೋನ್ ಇಎಂಐ ಲೆಕ್ಕಾಚಾರ ಮಾಡಿ.',
      linkText: 'ಕ್ಯಾಲ್ಕುಲೇಟರ್ ನೋಡಿ',
    },
  },
  ml: {
    text: {
      title: 'ടെക്സ്റ്റ് ടൂളുകൾ',
      desc: 'ടെക്സ്റ്റ് എഡിറ്റ് ചെയ്യുക, അക്ഷരങ്ങൾ എണ്ണുക, ഫോർമാറ്റ് ചെയ്യുക.',
      linkText: 'ടെക്സ്റ്റ് ടൂളുകൾ കാണുക',
    },
    image: {
      title: 'ഇമേജ് ടൂളുകൾ',
      desc: 'ഫോട്ടോകൾ കംപ്രസ് ചെയ്യുക, ഫോർമാറ്റുകൾ മാറ്റുക ഗുണനിലവാരം കുറയാതെ.',
      linkText: 'ഇമേജ് ടൂളുകൾ കാണുക',
    },
    pdf: {
      title: 'പിഡിഎഫ് മാജിക് സ്യൂട്ട്',
      desc: 'പിഡിഎഫ് ഫയലുകൾ വേർഡ്, എക്സൽ, ഇമേജ് ആക്കി മാറ്റുക.',
      linkText: 'പിഡിഎഫ് ടൂളുകൾ കാണുക',
    },
    typing: {
      title: 'ടൈപ്പിംഗ് ടെസ്റ്റ്',
      desc: 'നിങ്ങളുടെ ടൈപ്പിംഗ് വേഗതയും കൃത്യതയും പരിശോധിക്കുക.',
      linkText: 'ടൈപ്പിംഗ് ആരംഭിക്കുക',
    },
    encryption: {
      title: 'എൻക്രിപ്ഷനും സുരക്ഷയും',
      desc: 'AES-256, പാസ്‌വേഡ് ജനറേറ്റർ ഉപയോഗിച്ച് വിവരങ്ങൾ സുരക്ഷിതമാക്കുക.',
      linkText: 'സുരക്ഷാ ടൂളുകൾ കാണുക',
    },
    web: {
      title: 'വെബ്ബ് & കളർ ടൂളുകൾ',
      desc: 'HEX കളർ RGB ആക്കുക, പുതിയ വർണ്ണ പാലറ്റുകൾ നിർമ്മിക്കുക.',
      linkText: 'കളർ ടൂളുകൾ കാണുക',
    },
    development: {
      title: 'ഡെവലപ്പർ ടൂളുകൾ',
      desc: 'JSON ബ്യൂട്ടിഫയർ, കോഡ് ഫോർമാറ്റർ എന്നിവ ഉപയോഗിക്കുക.',
      linkText: 'ഡെവ് ടൂളുകൾ കാണുക',
    },
    calculator: {
      title: 'കാൽക്കുലേറ്ററുകൾ & ധനം',
      desc: 'കൃത്യമായ വയസ്സ്, ജിഎസ്ടി നികുതി, വായ്പ ഇഎംഐ കണക്കാക്കുക.',
      linkText: 'കാൽക്കുലേറ്ററുകൾ കാണുക',
    },
  },
  pa: {
    text: {
      title: 'ਟੈਕਸਟ ਟੂਲਸ',
      desc: 'ਟੈਕਸਟ ਐਡਿਟ ਕਰੋ, ਕੇਸ ਬਦਲੋ, ਅੱਖਰ ਅਤੇ ਸ਼ਬਦ ਗਿਣੋ ਆਸਾਨੀ ਨਾਲ।',
      linkText: 'ਟੈਕਸਟ ਟੂਲ ਦੇਖੋ',
    },
    image: {
      title: 'ਇਮੇਜ ਟੂਲਸ',
      desc: 'ਫੋਟੋਆਂ ਕੰਪ੍ਰੈਸ ਕਰੋ, ਫਾਰਮੈਟ ਬਦਲੋ ਬਿਨਾਂ ਕੁਆਲਿਟੀ ਗੁਆਏ।',
      linkText: 'ਇਮੇਜ ਟੂਲ ਦੇਖੋ',
    },
    pdf: {
      title: 'ਪੀਡੀਐਫ ਮੈਜਿਕ ਸੂਟ',
      desc: 'ਪੀਡੀਐਫ ਨੂੰ ਵਰਡ, ਐਕਸਲ ਅਤੇ ਫੋਟੋਆਂ ਵਿੱਚ ਬਦਲੋ ਸੁਰੱਖਿਅਤ ਢੰਗ ਨਾਲ।',
      linkText: 'ਪੀਡੀਐਫ ਟੂਲ ਦੇਖੋ',
    },
    typing: {
      title: 'ਟਾਈਪਿੰਗ ਟੈਸਟ',
      desc: 'ਆਪਣੀ ਟਾਈਪਿੰਗ ਸਪੀਡ ਅਤੇ ਸ਼ੁੱਧਤਾ ਦੀ ਜਾਂਚ ਕਰੋ।',
      linkText: 'ਟਾਈਪਿੰਗ ਸ਼ੁਰੂ ਕਰੋ',
    },
    encryption: {
      title: 'ਸੁਰੱਖਿਆ ਅਤੇ ਇਨਕ੍ਰਿਪਸ਼ਨ',
      desc: 'AES-256 ਅਤੇ ਸੁਰੱਖਿਅਤ ਪਾਸਵਰਡ ਜਨਰੇਟਰ ਨਾਲ ਡੇਟਾ ਸੁਰੱਖਿਅਤ ਕਰੋ।',
      linkText: 'ਸੁਰੱਖਿਆ ਟੂਲ ਦੇਖੋ',
    },
    web: {
      title: 'ਵੈੱਬ ਅਤੇ ਰੰਗ ਟੂਲਸ',
      desc: 'HEX ਨੂੰ RGB ਵਿੱਚ ਬਦਲੋ, ਰੰਗ ਪੈਲੇਟ ਬਣਾਓ।',
      linkText: 'ਰੰਗ ਟੂਲ ਦੇਖੋ',
    },
    development: {
      title: 'ਡਿਵੈਲਪਰ ਟੂਲਸ',
      desc: 'JSON ਬਿਊਟੀਫਾਇਰ, ਵੈਲੀਡੇਟਰ ਅਤੇ ਕੋਡ ਫਾਰਮੈਟਰ।',
      linkText: 'ਡੈਵ ਟੂਲ ਦੇਖੋ',
    },
    calculator: {
      title: 'ਕੈਲਕੁਲੇਟਰ ਅਤੇ ਵਿੱਤ',
      desc: 'ਸਹੀ ਉਮਰ, ਜੀਐਸਟੀ ਟੈਕਸ ਅਤੇ ਕਰਜ਼ੇ ਦੀ ਕਿਸ਼ਤ ਦੀ ਗਣਨਾ ਕਰੋ।',
      linkText: 'ਕੈਲਕੁਲੇਟਰ ਦੇਖੋ',
    },
  },
  ur: {
    text: {
      title: 'ٹیکسٹ ٹولز',
      desc: 'متن میں ترمیم کریں، حروف اور الفاظ شمار کریں آسانی سے۔',
      linkText: 'ٹیکسٹ ٹولز دیکھیں',
    },
    image: {
      title: 'تصویری ٹولز',
      desc: 'تصاویر کمپریس کریں، فارمیٹ تبدیل کریں بغیر معیار کھوئے۔',
      linkText: 'تصویری ٹولز دیکھیں',
    },
    pdf: {
      title: 'پی ڈی ایف میجک سوٹ',
      desc: 'پی ڈی ایف کو ورڈ، ایکسل اور تصاویر میں تبدیل کریں نجی طور پر۔',
      linkText: 'پی ڈی ایف ٹولز دیکھیں',
    },
    typing: {
      title: 'ٹائپنگ ٹیسٹ',
      desc: 'اپنی ٹائپنگ کی رفتار اور درستگی کی جانچ کریں۔',
      linkText: 'ٹائپنگ شروع کریں',
    },
    encryption: {
      title: 'انکرپشن اور سیکیورٹی',
      desc: 'AES-256 اور پاس ورڈ جنریٹر کے ساتھ ڈیٹا محفوظ رکھیں۔',
      linkText: 'سیکیورٹی ٹولز دیکھیں',
    },
    web: {
      title: 'ویب اور رنگ کے ٹولز',
      desc: 'HEX کو RGB میں تبدیل کریں اور رنگ پیلیٹ بنائیں۔',
      linkText: 'رنگ ٹولز دیکھیں',
    },
    development: {
      title: 'ڈویلپر ٹولز',
      desc: 'JSON بیوٹیفائر، ویلیڈیٹر اور کوڈ فارمیٹر۔',
      linkText: 'ڈیو ٹولز دیکھیں',
    },
    calculator: {
      title: 'کیلکولیٹر اور فنانس',
      desc: 'صحیح عمر، ٹیکس اور قرض کی اقساط کا درست حساب لگائیں۔',
      linkText: 'کیلکولیٹر دیکھیں',
    },
  },
  or: {
    text: {
      title: 'ଟେକ୍ସଟ୍ ଟୁଲ୍ସ',
      desc: 'ଟେକ୍ସଟ୍ ସମ୍ପାଦନା କରନ୍ତୁ, ଅକ୍ଷର ଏବଂ ଶବ୍ଦ ଗଣନା କରନ୍ତୁ ସହଜରେ।',
      linkText: 'ଟେକ୍ସଟ୍ ଟୁଲ୍ସ ଦେଖନ୍ତୁ',
    },
    image: {
      title: 'ଇମେଜ୍ ଟୁଲ୍ସ',
      desc: 'ଫଟୋ କମ୍ପ୍ରେସ୍ କରନ୍ତୁ, ଫର୍ମାଟ୍ ବଦଳାନ୍ତୁ ଗୁଣବତ୍ତା ନ ହରାଇ।',
      linkText: 'ଇମେଜ୍ ଟୁଲ୍ସ ଦେଖନ୍ତୁ',
    },
    pdf: {
      title: 'ପିଡିଏଫ୍ ମ୍ୟାଜିକ୍ ସୁଟ୍',
      desc: 'ପିଡିଏଫକୁ ୱାର୍ଡ, ଏକ୍ସେଲ୍ ଏବଂ ଫଟୋରେ ସୁରକ୍ଷିତ ଭାବେ ରୂପାନ୍ତର କରନ୍ତୁ।',
      linkText: 'ପିଡିଏଫ୍ ଟୁଲ୍ସ ଦେଖନ୍ତୁ',
    },
    typing: {
      title: 'ଟାଇପିଂ ଟେଷ୍ଟ',
      desc: 'ଆପଣଙ୍କ ଟାଇପିଂ ଗତି ଏବଂ ସଠିକତା ପରୀକ୍ଷା କରନ୍ତୁ।',
      linkText: 'ଟାଇପିଂ ଆରମ୍ଭ କରନ୍ତୁ',
    },
    encryption: {
      title: 'ଏନକ୍ରିପସନ୍ ଏବଂ ସୁରକ୍ଷା',
      desc: 'AES-256 ଏବଂ ପାସୱାର୍ଡ ଜେନେରେଟର୍ ସହିତ ଡାଟା ସୁରକ୍ଷିତ ରଖନ୍ତୁ।',
      linkText: 'ସୁରକ୍ଷା ଟୁଲ୍ସ ଦେଖନ୍ତୁ',
    },
    web: {
      title: 'ୱେବ୍ ଏବଂ ରଙ୍ଗ ଟୁଲ୍ସ',
      desc: 'HEX ରୁ RGB ରୂପାନ୍ତର କରନ୍ତୁ, ରଙ୍ଗ ପ୍ୟାଲେଟ୍ ଡିଜାଇନ୍ କରନ୍ତୁ।',
      linkText: 'ରଙ୍ଗ ଟୁଲ୍ସ ଦେଖନ୍ତୁ',
    },
    development: {
      title: 'ଡେଭଲପର୍ ଟୁଲ୍ସ',
      desc: 'JSON ବିଉଟିଫାୟର୍, ଭାଲିଡେଟର୍ ଏବଂ କୋଡ୍ ଫର୍ମାଟର୍।',
      linkText: 'ଡେଭ୍ ଟୁଲ୍ସ ଦେଖନ୍ତୁ',
    },
    calculator: {
      title: 'କ୍ୟାଲକୁଲେଟର୍ ଏବଂ ଅର୍ଥ',
      desc: 'ସଠିକ୍ ବୟସ, ଜିଏସଟି ଟ୍ୟାକ୍ସ ଏବଂ ଋଣ କିସ୍ତି ହିସାବ କରନ୍ତୁ।',
      linkText: 'କ୍ୟାଲକୁଲେଟର୍ ଦେଖନ୍ତୁ',
    },
  },
  bho: {
    text: { title: 'लिखाई आ दस्तावेज़ टूल', desc: 'अक्षर केस बदलीं, शब्द गिनीं आ लिखाई सजाईं।', linkText: 'लिखाई टूल देखीं' },
    image: { title: 'फोटो टूल', desc: 'फोटो छोट करीं, फॉर्मेट बदलीं आ साइज सुधारीं।', linkText: 'फोटो टूल देखीं' },
    pdf: { title: 'PDF जादूई टूल', desc: 'PDF के वर्ड, एक्सेल आ फोटो में बदलीं।', linkText: 'PDF टूल देखीं' },
    typing: { title: 'टाइपिंग टेस्ट', desc: 'अपन टाइपिंग स्पीड (WPM) आ शुद्धता जांचीं।', linkText: 'टाइपिंग शुरू करीं' },
    encryption: { title: 'सुरक्षा आ ताला', desc: 'AES-256, बेस64 आ मजबूत पासवर्ड बनाईं।', linkText: 'सुरक्षा टूल देखीं' },
    web: { title: 'वेब आ रंग', desc: 'HEX से RGB रंग बदलीं आ CSS ग्रेडिएंट बनाईं।', linkText: 'रंग टूल देखीं' },
    development: { title: 'डेवलपर टूल', desc: 'JSON सजाईं, CSV/XML बदलीं आ कोड सुधारें।', linkText: 'डेवलपर टूल देखीं' },
    calculator: { title: 'हिसाब-किताब', desc: 'उम्र, GST टैक्स आ लोन के किश्त निकालीं।', linkText: 'हिसाब टूल देखीं' },
  },
  de: {
    text: { title: 'Text-Werkzeuge', desc: 'Texte formatieren, Groß-/Kleinschreibung ändern und Wörter zählen.', linkText: 'Text-Tools öffnen' },
    image: { title: 'Bild-Werkzeuge', desc: 'Bilder verlustfrei komprimieren, konvertieren und zuschneiden.', linkText: 'Bild-Tools öffnen' },
    pdf: { title: 'PDF Magic Suite', desc: 'PDFs konvertieren, zusammenführen und Text extrahieren.', linkText: 'PDF-Suite öffnen' },
    typing: { title: 'Schreibtrainer (WPM)', desc: 'Tippgeschwindigkeit und Genauigkeit in Echtzeit testen.', linkText: 'Test starten' },
    encryption: { title: 'Sicherheit & Krypto', desc: 'AES-256, Base64 und sichere Passwörter generieren.', linkText: 'Sicherheit öffnen' },
    web: { title: 'Web & Farben', desc: 'Farbcodes umwandeln, Schatten und CSS-Verläufe erstellen.', linkText: 'Farb-Tools öffnen' },
    development: { title: 'Entwickler-Tools', desc: 'JSON formatieren, validieren und Code minifizieren.', linkText: 'Dev-Tools öffnen' },
    calculator: { title: 'Rechner & Finanzen', desc: 'Alter, Zinsen, Kredite und Einheiten präzise berechnen.', linkText: 'Rechner öffnen' },
  },
  pt: {
    text: { title: 'Ferramentas de Texto', desc: 'Editar, formatar, converter maiúsculas e contar palavras.', linkText: 'Explorar Texto' },
    image: { title: 'Ferramentas de Imagem', desc: 'Comprimir, converter, cortar e redimensionar fotos.', linkText: 'Explorar Imagens' },
    pdf: { title: 'Suíte Mágica PDF', desc: 'Converter PDFs para Word, Excel, imagens e texto.', linkText: 'Explorar PDF' },
    typing: { title: 'Teste de Digitação', desc: 'Meça suas palavras por minuto (PPM) com precisão.', linkText: 'Iniciar Teste' },
    encryption: { title: 'Segurança & Cripto', desc: 'Criptografia AES-256, Base64 e gerador de senhas.', linkText: 'Explorar Segurança' },
    web: { title: 'Web & Cores', desc: 'Converter cores HEX/RGB e criar sombras CSS.', linkText: 'Explorar Cores' },
    development: { title: 'Ferramentas Dev', desc: 'Formatador JSON, minificador e conversores CSV.', linkText: 'Explorar Dev' },
    calculator: { title: 'Calculadoras & Finanças', desc: 'Calcular idade exata, juros, parcelas e unidades.', linkText: 'Explorar Calculadoras' },
  },
  ar: {
    text: { title: 'أدوات النصوص', desc: 'تعديل النصوص، تغيير حالة الأحرف، وحساب الكلمات والأسطر.', linkText: 'استكشاف أدوات النصوص' },
    image: { title: 'أدوات الصور', desc: 'ضغط الصور، تحويل التنسيقات، والقص بدقة.', linkText: 'استكشاف أدوات الصور' },
    pdf: { title: 'حزمة PDF الشاملة', desc: 'تحويل ملفات PDF إلى Word وإكسل وصور بأمان.', linkText: 'استكشاف حزمة PDF' },
    typing: { title: 'اختبار سرعة الكتابة', desc: 'اختبر سرعتك في الطباعة بدقة وملاحظات فورية.', linkText: 'بدء الاختبار' },
    encryption: { title: 'الأمان والتشفير', desc: 'تشفير AES-256، Base64، وتوليد كلمات مرور قوية.', linkText: 'استكشاف أدوات الأمان' },
    web: { title: 'الويب والألوان', desc: 'تحويل أكواد الألوان وتوليد تدرجات CSS.', linkText: 'استكشاف أدوات الألوان' },
    development: { title: 'أدوات المطورين', desc: 'تنسيق JSON والتحقق منه وتحويل CSV وXML.', linkText: 'استكشاف أدوات التطوير' },
    calculator: { title: 'الحاسبات والمالية', desc: 'حساب العمر والضرائب وأقساط القروض بدقة.', linkText: 'استكشاف الحاسبات' },
  },
  zh: {
    text: { title: '文本与文档工具', desc: '轻松编辑文本、转换大小写、统计字数和格式化。', linkText: '浏览文本工具' },
    image: { title: '图像与图片工具', desc: '无损压缩、转换格式、裁剪、缩放和加水印。', linkText: '浏览图像工具' },
    pdf: { title: 'PDF 魔法工具箱', desc: 'PDF 转换为 Word、Excel、图片及文本，隐私安全。', linkText: '浏览 PDF 工具' },
    typing: { title: '打字测速与练习', desc: '实时测算每分钟打字字数 (WPM) 与准确率。', linkText: '开始打字测试' },
    encryption: { title: '加密与安全工具', desc: 'AES-256 加密、Base64 编解码及强密码生成。', linkText: '浏览安全工具' },
    web: { title: '网页与色彩工具', desc: 'HEX/RGB 颜色互转、调色板及 CSS 渐变生成。', linkText: '浏览色彩工具' },
    development: { title: '开发者实用工具', desc: 'JSON 美化、压缩、CSV/XML 转换与代码格式化。', linkText: '浏览开发工具' },
    calculator: { title: '计算器与金融工具', desc: '精确计算年龄、税率、贷款月供及复利理财。', linkText: '浏览计算器' },
  },
  ja: {
    text: { title: 'テキストツール', desc: '大文字小文字変換、文字数カウント、テキスト整形。', linkText: 'テキストツールを見る' },
    image: { title: '画像・写真ツール', desc: '画像圧縮、フォーマット変換、トリミング、リサイズ。', linkText: '画像ツールを見る' },
    pdf: { title: 'PDF ツールスイート', desc: 'PDFの変換・結合・テキスト抽出を端末内で安全に。', linkText: 'PDFツールを見る' },
    typing: { title: 'タイピング速度測定', desc: 'タイピング速度（WPM）と正確性をリアルタイム測定。', linkText: 'テストを開始' },
    encryption: { title: '暗号化とセキュリティ', desc: 'AES-256、Base64変換、強力なパスワード生成。', linkText: 'セキュリティを見る' },
    web: { title: 'Web＆カラーツール', desc: 'カラーコード変換、CSSシャドウやグラデーション作成。', linkText: 'カラーツールを見る' },
    development: { title: '開発者向けツール', desc: 'JSON整形、検証、圧縮、CSV/XML変換。', linkText: '開発ツールを見る' },
    calculator: { title: '計算機＆金融ツール', desc: '年齢計算、税金計算、ローン返済額のシミュレーション。', linkText: '計算機を見る' },
  },
};

// Comprehensive Tool Name and Description Translations
// Covering all 98 tools across languages
export const TOOL_LOCALIZATIONS: Record<string, Partial<Record<Language, ToolTranslation>>> = {
  // --- Text Tools ---
  'case-converter': {
    hi: {
      name: 'टेक्स्ट केस कन्वर्टर',
      description: 'टेक्स्ट को UPPERCASE, lowercase, Title Case, camelCase, snake_case और PascalCase में बदलें।',
    },
    es: {
      name: 'Convertidor de Mayúsculas y Minúsculas',
      description: 'Transforme texto a MAYÚSCULAS, minúsculas, Tipo Título, camelCase, snake_case y más.',
    },
    fr: {
      name: 'Convertisseur de Casse de Texte',
      description: 'Convertissez le texte en MAJUSCULES, minuscules, Casse de Titre, camelCase et snake_case.',
    },
    bn: {
      name: 'টেক্সট কেস কনভার্টার',
      description: 'টেক্সটকে UPPERCASE, lowercase, Title Case ও camelCase এ রূপান্তর করুন।',
    },
  },
  'uppercase-converter': {
    hi: {
      name: 'UPPERCASE टेक्स्ट कन्वर्टर',
      description: 'एक क्लिक में अपने टेक्स्ट या दस्तावेज़ के सभी अक्षरों को बड़े UPPERCASE में बदलें।',
    },
    es: {
      name: 'Convertidor a MAYÚSCULAS',
      description: 'Convierta instantáneamente todas las letras a mayúsculas con un solo clic.',
    },
    fr: {
      name: 'Convertisseur en MAJUSCULES',
      description: 'Convertissez instantanément toutes les lettres en majuscules en un clic.',
    },
    bn: {
      name: 'আপারক্যাস টেক্সট কনভার্টার',
      description: 'এক ক্লিকেই সব অক্ষর বড় হাতের UPPERCASE এ রূপান্তর করুন।',
    },
  },
  'lowercase-converter': {
    hi: {
      name: 'lowercase टेक्स्ट कन्वर्टर',
      description: 'किसी भी टेक्स्ट या कॉपी किए गए पैराग्राफ को तुरंत छोटे अक्षरों (lowercase) में बदलें।',
    },
    es: {
      name: 'Convertidor a minúsculas',
      description: 'Convierta cualquier texto o párrafo en letras minúsculas de forma rápida.',
    },
    fr: {
      name: 'Convertisseur en minuscules',
      description: 'Convertissez n\'importe quel texte en lettres minuscules rapidement.',
    },
    bn: {
      name: 'লোয়ারকেস টেক্সট কনভার্টার',
      description: 'যেকোনো টেক্সটকে দ্রুত ছোট হাতের অক্ষরে রূপান্তর করুন।',
    },
  },
  'character-count': {
    hi: {
      name: 'अक्षर और शब्द काउंटर',
      description: 'अक्षर, शब्द, वाक्य, पैराग्राफ और अनुमानित पढ़ने/बोलने के समय की सटीक गिनती।',
    },
    es: {
      name: 'Contador de Palabras y Caracteres',
      description: 'Conteo preciso de caracteres, palabras, oraciones, párrafos y tiempo estimado de lectura.',
    },
    fr: {
      name: 'Compteur de Mots et Caractères',
      description: 'Comptage précis des caractères, mots, phrases, paragraphes et temps de lecture.',
    },
    bn: {
      name: 'অক্ষর ও শব্দ গণক',
      description: 'অক্ষর, শব্দ, বাক্য, অনুচ্ছেদ এবং পড়ার আনুমানিক সময়ের নির্ভুল গণনা।',
    },
  },
  'text-to-ascii': {
    hi: {
      name: 'टेक्स्ट से ASCII कन्वर्टर',
      description: 'टेक्स्ट वर्णों को ASCII दशमलव, हेक्साडेसिमल और बाइनरी कोड में बदलें।',
    },
    es: {
      name: 'Convertidor de Texto a ASCII',
      description: 'Codifique caracteres de texto en códigos ASCII decimales, hexadecimales y binarios.',
    },
    fr: {
      name: 'Convertisseur Texte vers ASCII',
      description: 'Encodez le texte en codes ASCII décimaux, hexadécimaux et binaires.',
    },
    bn: {
      name: 'টেক্সট থেকে ASCII কনভার্টার',
      description: 'টেক্সটকে ASCII ডেসিমেল, হেক্সাডেসিমেল ও বাইনারি কোডে রূপান্তর করুন।',
    },
  },
  'ascii-to-text': {
    hi: {
      name: 'ASCII से टेक्स्ट कन्वर्टर',
      description: 'ASCII कोड (दशमलव, हेक्स, बाइनरी) को सामान्य पठनीय टेक्स्ट में डिकोड करें।',
    },
    es: {
      name: 'Convertidor de ASCII a Texto',
      description: 'Decodifique códigos ASCII (decimal, hexadecimal, binario) a texto legible.',
    },
    fr: {
      name: 'Convertisseur ASCII vers Texte',
      description: 'Décodez les valeurs ASCII en texte brut lisible.',
    },
  },
  'diff-checker': {
    hi: {
      name: 'टेक्स्ट डिफ चेकर (Diff Checker)',
      description: 'दो टेक्स्ट या कोड ब्लॉक के बीच अंतर, बदलाव और हटाए गए अंशों की तुलना करें।',
    },
    es: {
      name: 'Comparador de Texto (Diff Checker)',
      description: 'Compare dos textos o fragmentos de código para identificar adiciones y eliminaciones.',
    },
    fr: {
      name: 'Comparateur de Texte (Diff Checker)',
      description: 'Comparez deux textes ou codes pour visualiser les différences et modifications.',
    },
  },
  'lorem-generator': {
    hi: {
      name: 'लोरेम इप्सम जेनरेटर',
      description: 'डिज़ाइन और मॉकअप के लिए कस्टम पैराग्राफ, वाक्य और शब्दों वाला डमी टेक्स्ट बनाएं।',
    },
    es: {
      name: 'Generador Lorem Ipsum',
      description: 'Genere texto de relleno estándar para maquetación web y diseños.',
    },
    fr: {
      name: 'Générateur Lorem Ipsum',
      description: 'Générez du faux texte pour vos maquettes de conception et de design.',
    },
  },
  'typing-test': {
    hi: {
      name: 'टाइपिंग स्पीड टेस्ट और ट्यूटर',
      description: 'लाइव WPM (शब्द प्रति मिनट) और सटीकता फीडबैक के साथ टाइपिंग टेस्ट दें।',
    },
    es: {
      name: 'Prueba de Velocidad de Escritura',
      description: 'Mida su velocidad de escritura (palabras por minuto) y precisión en tiempo real.',
    },
    fr: {
      name: 'Test de Vitesse de Frappe',
      description: 'Mesurez votre vitesse de frappe (MPM) et votre précision en temps réel.',
    },
  },
  'document-wizard': {
    hi: {
      name: 'डॉक्यूमेंट विजार्ड और क्लीनर',
      description: 'अवांछित स्पेस हटाएं, लाइन ब्रेक ठीक करें और दस्तावेज़ को सुंदर बनाएं।',
    },
    es: {
      name: 'Asistente de Documentos y Limpiador',
      description: 'Elimine espacios extras, saltos de línea repetidos y dé formato limpio a sus textos.',
    },
  },

  // --- Developer Tools ---
  'json-beautifier': {
    hi: {
      name: 'JSON ब्यूटीफायर और फॉर्मेटर',
      description: 'JSON डेटा को सुंदर बनाएं, सिंटैक्स हाइलाइट करें और त्रुटियों की तुरंत जांच करें।',
    },
    es: {
      name: 'Embellecedor y Formateador JSON',
      description: 'Formatee y valide código JSON con resaltado de sintaxis y detección de errores.',
    },
    fr: {
      name: 'Embellisseur et Formateur JSON',
      description: 'Formatez et validez vos données JSON avec coloration syntaxique.',
    },
  },
  'json-viewer': {
    hi: {
      name: 'JSON व्यूअर और ट्री इंस्पेक्टर',
      description: 'इंटरैक्टिव ट्री व्यू में JSON डेटा को नेविगेट करें, नोड्स को फ़ोल्ड/अनफ़ोल्ड करें।',
    },
    es: {
      name: 'Visor e Inspector de Árbol JSON',
      description: 'Explore estructuras JSON anidadas mediante un árbol interactivo.',
    },
  },
  'json-validator': {
    hi: {
      name: 'JSON वैलिडेटर और एरर चेकर',
      description: 'JSON सिंटैक्स को वैलिडेट करें और सटीक लाइन नंबर के साथ गलतियां देखें।',
    },
    es: {
      name: 'Validador JSON y Detector de Errores',
      description: 'Valide la sintaxis JSON con números de línea precisos para corregir errores.',
    },
  },
  'json-minifier': {
    hi: {
      name: 'JSON मिनीफायर और कंप्रेसर',
      description: 'सफेद जगह और लाइन ब्रेक हटाकर JSON फ़ाइल का आकार कम करें।',
    },
    es: {
      name: 'Minificador y Compresor JSON',
      description: 'Comprima JSON eliminando espacios en blanco para optimizar la transferencia.',
    },
  },
  'json-to-csv': {
    hi: {
      name: 'JSON से CSV कन्वर्टर',
      description: 'JSON ऑब्जेक्ट्स और ऐरे को एक्सेल अनुकूल CSV स्प्रेडशीट में बदलें।',
    },
    es: {
      name: 'Convertidor de JSON a CSV',
      description: 'Transforme estructuras JSON a archivos de hoja de cálculo CSV compatibles con Excel.',
    },
  },
  'json-to-xml': {
    hi: {
      name: 'JSON से XML कन्वर्टर',
      description: 'JSON डेटा को सुंदर टैग और सिंटैक्स वाले स्वच्छ XML दस्तावेज़ में बदलें।',
    },
    es: {
      name: 'Convertidor de JSON a XML',
      description: 'Convierta datos JSON en documentos XML limpios y bien formateados.',
    },
  },
  'code-beautifier': {
    hi: {
      name: 'मल्टी-लैंग्वेज कोड ब्यूटीफायर',
      description: 'HTML, CSS, JavaScript, SQL और XML कोड को सुंदर इंडेंटेशन के साथ फॉर्मेट करें।',
    },
    es: {
      name: 'Embellecedor de Código Multi-Lenguaje',
      description: 'Formatee código HTML, CSS, JavaScript y SQL con sangría profesional.',
    },
  },
  'html-beautifier': {
    hi: {
      name: 'HTML कोड ब्यूटीफायर',
      description: 'अव्यवस्थित HTML मार्कअप को सही टैग नेस्टिंग और इंडेंटेशन के साथ फॉर्मेट करें।',
    },
    es: {
      name: 'Embellecedor de Código HTML',
      description: 'Organice código HTML con sangría perfecta y formato estructurado.',
    },
  },
  'css-beautifier': {
    hi: {
      name: 'CSS स्टाइल ब्यूटीफायर',
      description: 'CSS स्टाइलशीट को सुंदर और आसानी से पढ़ने योग्य कोड में फॉर्मेट करें।',
    },
    es: {
      name: 'Embellecedor de CSS',
      description: 'Formatee hojas de estilo CSS para que sean limpias y legibles.',
    },
  },
  'js-beautifier': {
    hi: {
      name: 'JavaScript कोड फॉर्मेटर',
      description: 'JavaScript और TypeScript कोड को क्लीन और सुव्यवस्थित बनाएं।',
    },
    es: {
      name: 'Formateador de JavaScript',
      description: 'Formatee y embellezca scripts de JavaScript de forma automática.',
    },
  },
  'css-minify': {
    hi: {
      name: 'CSS मिनीफायर',
      description: 'वेबसाइट की गति बढ़ाने के लिए CSS कोड को कंप्रेस और मिनीफाई करें।',
    },
    es: {
      name: 'Minificador de CSS',
      description: 'Comprima código CSS eliminando comentarios y espacios innecesarios.',
    },
  },
  'url-encoder': {
    hi: {
      name: 'URL एनकोडर और डिकोडर',
      description: 'URL क्वेरी स्ट्रिंग्स को सेफ कैरेक्टर (%20 आदि) में एनकोड या डिकोड करें।',
    },
    es: {
      name: 'Codificador y Decodificador de URL',
      description: 'Codifique o decodifique parámetros y cadenas URL de forma segura.',
    },
  },

  // --- Encryption & Security ---
  'aes-des-encrypt': {
    hi: {
      name: 'AES और DES एन्क्रिप्शन टूल',
      description: 'कस्टम गुप्त कुंजी के साथ AES-256 और Triple-DES मिलिट्री-ग्रेड एन्क्रिप्शन करें।',
    },
    es: {
      name: 'Herramienta de Cifrado AES y DES',
      description: 'Cifre y descifre texto confidencial con algoritmos AES-256 y DES de grado militar.',
    },
    fr: {
      name: 'Outil de Chiffrement AES et DES',
      description: 'Chiffrez et déchiffrez des données confidentielles avec AES-256 et DES.',
    },
  },
  'base64-tool': {
    hi: {
      name: 'Base64 एनकोडर और डिकोडर',
      description: 'टेक्स्ट या बाइनरी डेटा को सुरक्षित Base64 स्ट्रिंग में एनकोड या डिकोड करें।',
    },
    es: {
      name: 'Codificador y Decodificador Base64',
      description: 'Codifique y decodifique texto o datos binarios en cadenas seguras Base64.',
    },
  },
  'md5-hash': {
    hi: {
      name: 'MD5 हैश जेनरेटर',
      description: 'डेटा अखंडता और चेकसम सत्यापन के लिए 128-बिट MD5 हैश बनाएं।',
    },
    es: {
      name: 'Generador de Hash MD5',
      description: 'Genere hashes MD5 de 128 bits para verificación de integridad de datos.',
    },
  },
  'sha256-hash': {
    hi: {
      name: 'SHA-256 क्रिप्टोग्राफिक हैश',
      description: 'क्रिप्टोग्राफिक सुरक्षा के लिए शक्तिशाली 256-बिट SHA हैश तैयार करें।',
    },
    es: {
      name: 'Generador de Hash SHA-256',
      description: 'Calcule hashes criptográficos seguros SHA-256 para cualquier entrada.',
    },
  },
  'password-generator': {
    hi: {
      name: 'मजबूत पासवर्ड जेनरेटर',
      description: 'बड़े अक्षरों, संख्याओं और विशेष प्रतीकों के साथ अटूट सुरक्षित पासवर्ड बनाएं।',
    },
    es: {
      name: 'Generador de Contraseñas Seguras',
      description: 'Genere contraseñas criptográficamente fuertes y personalizadas al instante.',
    },
  },

  // --- Calculators ---
  'age-calculator': {
    hi: {
      name: 'सटीक उम्र कैलकुलेटर',
      description: 'अपनी जन्मतिथि से वर्ष, महीने, दिन, कुल दिन, राशि और अगले जन्मदिन की गणना करें।',
    },
    es: {
      name: 'Calculadora de Edad Exacta',
      description: 'Calcule su edad exacta en años, meses, días, signo zodiacal y días para el próximo cumpleaños.',
    },
    fr: {
      name: 'Calculateur d\'Âge Exact',
      description: 'Calculez votre âge en années, mois, jours et découvrez votre signe astrologique.',
    },
    bn: {
      name: 'সঠিক বয়স ক্যালকুলেটর',
      description: 'জন্মতারিখ থেকে বছর, মাস, দিন, মোট দিন এবং পরবর্তী জন্মদিনের হিসাব বের করুন।',
    },
  },
  'gst-calculator': {
    hi: {
      name: 'GST और VAT टैक्स कैलकुलेटर',
      description: '5%, 12%, 18%, 28% स्लैब के लिए टैक्स राशि और सकल मूल्य तुरंत निकालें।',
    },
    es: {
      name: 'Calculadora de Impuestos IVA y GST',
      description: 'Calcule el importe de impuestos y precios brutos o netos al instante.',
    },
  },
  'loan-calculator': {
    hi: {
      name: 'लोन EMI और ब्याज कैलकुलेटर',
      description: 'गृह ऋण, कार ऋण और व्यक्तिगत ऋण के लिए मासिक EMI और कुल देय ब्याज देखें।',
    },
    es: {
      name: 'Calculadora de Préstamos y Cuotas EMI',
      description: 'Calcule pagos mensuales de préstamos, intereses totales y tabla de amortización.',
    },
  },
  'sip-calculator': {
    hi: {
      name: 'म्यूचुअल फंड SIP रिटर्न कैलकुलेटर',
      description: 'मासिक निवेश, अनुमानित ब्याज दर और चक्रवृद्धि धन संचय की गणना करें।',
    },
    es: {
      name: 'Calculadora de Retornos de Inversión SIP',
      description: 'Estime el crecimiento y retornos compuestos de inversiones mensuales periódicas.',
    },
  },
  'scientific-calculator': {
    hi: {
      name: 'वैज्ञानिक और गणितीय कैलकुलेटर',
      description: 'त्रिकोणमिति, लघुगणक (log), घात और वर्गमूल कार्यों से लैस उन्नत कैलकुलेटर।',
    },
    es: {
      name: 'Calculadora Científica Avanzada',
      description: 'Calculadora completa con funciones trigonométricas, potencias y logaritmos.',
    },
  },

  // --- Image Tools ---
  'image-compressor': {
    hi: {
      name: 'स्मार्ट फोटो कंप्रेसर',
      description: 'बिना गुणवत्ता खोए JPEG, PNG और WebP छवियों का फ़ाइल आकार 80% तक कम करें।',
    },
    es: {
      name: 'Compresor Inteligente de Imágenes',
      description: 'Reduzca el tamaño de fotos JPEG, PNG y WebP hasta un 80% sin perder calidad visual.',
    },
    fr: {
      name: 'Compresseur d\'Images Intelligent',
      description: 'Réduisez la taille de vos fichiers JPEG, PNG et WebP sans perte de qualité.',
    },
  },
  'image-converter': {
    hi: {
      name: 'इमेज फॉर्मेट कन्वर्टर',
      description: 'PNG, JPG, WebP, GIF और BMP छवियों को एक-दूसरे में तुरंत बदलें।',
    },
    es: {
      name: 'Convertidor de Formatos de Imagen',
      description: 'Convierta entre formatos PNG, JPG, WebP, BMP y GIF directamente en el navegador.',
    },
  },
  'image-cropper': {
    hi: {
      name: 'सटीक इमेज क्रॉपर और कटर',
      description: 'पहलू अनुपात (1:1, 16:9, 4:3) के साथ तस्वीरों को सटीक रूप से क्रॉप करें।',
    },
    es: {
      name: 'Recortador de Imágenes Preciso',
      description: 'Recorte fotos con relaciones de aspecto personalizadas para redes sociales o perfiles.',
    },
  },
  'photo-editor': {
    hi: {
      name: 'क्लाइंट-साइड फोटो एडिटर',
      description: 'ब्राइटनेस, कंट्रास्ट, सैचुरेशन, ब्लर और विंटेज फिल्टर के साथ फोटो एडिट करें।',
    },
    es: {
      name: 'Editor de Fotos en el Navegador',
      description: 'Ajuste brillo, contraste, saturación y aplique filtros artísticos en tiempo real.',
    },
  },
  'image-watermark': {
    hi: {
      name: 'फोटो वॉटरमार्क टूल',
      description: 'कॉपीराइट सुरक्षा के लिए अपनी तस्वीरों पर कस्टम टेक्स्ट या लोगो वॉटरमार्क जोड़ें।',
    },
    es: {
      name: 'Creador de Marcas de Agua para Fotos',
      description: 'Añada marcas de agua de texto o logotipos para proteger sus creaciones visuales.',
    },
  },
  'image-upscale': {
    hi: {
      name: 'हाई-रेज़ोल्यूशन इमेज स्केलर',
      description: 'छवियों के आयामों को 2x, 4x बढ़ाएं और उच्च रिज़ॉल्यूशन में सहेजें।',
    },
    es: {
      name: 'Escalador de Resolución de Imagen',
      description: 'Aumente las dimensiones de sus fotos manteniendo la nitidez y el detalle.',
    },
  },
  'html-to-image': {
    hi: {
      name: 'HTML से इमेज कनवर्टर',
      description: 'HTML कोड और स्टाइलशीट को सुंदर PNG या JPG इमेज स्नैपशॉट में रेंडर करें।',
    },
    es: {
      name: 'Convertidor de HTML a Imagen',
      description: 'Renderice y capture código HTML estilizado como imágenes PNG o JPG de alta calidad.',
    },
  },

  // --- PDF Tools ---
  'pdf-tools': {
    hi: {
      name: 'ऑल-इन-वन PDF मैजिक वर्कशॉप',
      description: 'PDF को टेक्स्ट, छवियों, वर्ड में बदलें, पेज मर्ज करें और स्प्लिट करें।',
    },
    es: {
      name: 'Taller Completo de PDF Magic',
      description: 'Convierta, divida, combine y extraiga texto o imágenes de sus archivos PDF.',
    },
  },
  'pdftotext': {
    hi: {
      name: 'PDF से टेक्स्ट एक्सट्रैक्टर',
      description: 'किसी भी PDF दस्तावेज़ से सारा टेक्स्ट निकालकर TXT फ़ाइल में सहेजें।',
    },
    es: {
      name: 'Extractor de Texto desde PDF',
      description: 'Extraiga todo el contenido de texto legible de cualquier documento PDF.',
    },
  },
  'pdftojpg': {
    hi: {
      name: 'PDF से JPG इमेज कन्वर्टर',
      description: 'PDF के सभी पृष्ठों को उच्च गुणवत्ता वाली JPG तस्वीरों में बदलें।',
    },
    es: {
      name: 'Convertidor de PDF a JPG',
      description: 'Exporte cada página de un documento PDF como una imagen JPG de alta definición.',
    },
  },
  'pdftopng': {
    hi: {
      name: 'PDF से PNG कन्वर्टर',
      description: 'PDF दस्तावेज़ों को पारदर्शी और स्पष्ट PNG तस्वीरों में बदलें।',
    },
    es: {
      name: 'Convertidor de PDF a PNG',
      description: 'Transforme páginas PDF en imágenes PNG nítidas con fidelidad completa.',
    },
  },
  'pdftoword': {
    hi: {
      name: 'PDF से Word (DOCX) कन्वर्टर',
      description: 'PDF दस्तावेज़ को संपादन योग्य Microsoft Word फ़ाइल में बदलें।',
    },
    es: {
      name: 'Convertidor de PDF a Word',
      description: 'Convierta documentos PDF en archivos editables de Microsoft Word.',
    },
  },
  'pdftoexcel': {
    hi: {
      name: 'PDF से Excel (XLSX) कन्वर्टर',
      description: 'PDF में मौजूद तालिकाओं को संपादन योग्य Excel स्प्रेडशीट में निकालें।',
    },
    es: {
      name: 'Convertidor de PDF a Excel',
      description: 'Extraiga tablas de datos de archivos PDF hacia hojas de cálculo de Excel.',
    },
  },
  'pdftocsv': {
    hi: {
      name: 'PDF से CSV डेटा कन्वर्टर',
      description: 'PDF तालिकाओं को डेटा विश्लेषण के लिए साफ CSV फ़ाइल में बदलें।',
    },
    es: {
      name: 'Convertidor de PDF a CSV',
      description: 'Convierta tablas y listas tabulares de PDF en archivos CSV tabulados.',
    },
  },

  // --- Web & Colors ---
  'color-converter': {
    hi: {
      name: 'कलर कोड कन्वर्टर (HEX, RGB, HSL)',
      description: 'HEX, RGB, HSL और CMYK कलर कोड के बीच निर्बाध रूप से रूपांतरण करें।',
    },
    es: {
      name: 'Convertidor de Códigos de Color',
      description: 'Convierta colores entre formatos HEX, RGB, HSL y CMYK en tiempo real.',
    },
  },
  'hex-to-rgb': {
    hi: {
      name: 'HEX से RGB कन्वर्टर',
      description: '6-अंकीय HEX कलर कोड (#4f46e5) को RGB (79, 70, 229) मानों में बदलें।',
    },
    es: {
      name: 'Convertidor de HEX a RGB',
      description: 'Transforme códigos de color hexadecimales a valores RGB decimales.',
    },
  },
  'rgb-to-hex': {
    hi: {
      name: 'RGB से HEX कलर कन्वर्टर',
      description: 'RGB रेड, ग्रीन, ब्लू मानों से वेब-मानक हेक्साडेसिमल कलर कोड बनाएं।',
    },
    es: {
      name: 'Convertidor de RGB a HEX',
      description: 'Genere códigos hexadecimales web a partir de componentes RGB.',
    },
  },
  'css-box-shadow': {
    hi: {
      name: 'CSS बॉक्स शैडो विज़ुअल जेनरेटर',
      description: 'स्लाइडर की मदद से लेयर्ड CSS बॉक्स शैडो डिज़ाइन करें और कोड कॉपी करें।',
    },
    es: {
      name: 'Generador Visual de Sombras CSS',
      description: 'Diseñe sombras CSS suaves con controles interactivos para desenfoque y color.',
    },
  },
  'css-gradient': {
    hi: {
      name: 'CSS ग्रेडिएंट और ब्लेंड जेनरेटर',
      description: 'मल्टी-कलर स्टॉप्स के साथ लीनियर और रेडियल CSS ग्रेडिएंट बनाएं।',
    },
    es: {
      name: 'Generador de Gradientes CSS',
      description: 'Cree gradientes lineales y radiales modernos con código CSS listo para copiar.',
    },
  },
  'qr-code-generator': {
    hi: {
      name: 'QR कोड जेनरेटर और स्टाइलर',
      description: 'वेबसाइट लिंक, वाई-फाई और टेक्स्ट के लिए हाई-रिज़ॉल्यूशन QR कोड बनाएं।',
    },
    es: {
      name: 'Generador y Estilizador de Códigos QR',
      description: 'Genere códigos QR de alta resolución para enlaces, redes Wi-Fi y textos.',
    },
  },
  'aspect-ratio': {
    hi: {
      name: 'आस्पेक्ट रेशियो और रिज़ॉल्यूशन कैलकुलेटर',
      description: '16:9, 4:3, 1:1 वीडियो और स्क्रीन के लिए आनुपातिक आयामों की गणना करें।',
    },
    es: {
      name: 'Calculadora de Relación de Aspecto',
      description: 'Calcule dimensiones proporcionales para videos, pantallas y fotografía (16:9, 4:3).',
    },
  },
  'unit-converter': {
    hi: {
      name: 'सार्वभौमिक इकाई कनवर्टर (Unit Converter)',
      description: 'लंबाई, वजन, तापमान, क्षेत्र और गति इकाइयों को तुरंत एक-दूसरे में बदलें।',
    },
    es: {
      name: 'Convertidor Universal de Unidades',
      description: 'Convierta unidades de longitud, masa, temperatura, área y volumen.',
    },
  },
  'percentage-calculator': {
    hi: {
      name: 'प्रतिशत (Percentage) कैलकुलेटर',
      description: 'प्रतिशत वृद्धि, छूट, मार्जिन और हिस्सेदारी की त्वरित और सटीक गणना करें।',
    },
    es: {
      name: 'Calculadora de Porcentajes',
      description: 'Calcule incrementos porcentuales, descuentos y márgenes con facilidad.',
    },
  },
  'compound-interest': {
    hi: {
      name: 'चक्रवृद्धि ब्याज (Compound Interest) कैलकुलेटर',
      description: 'वार्षिक, अर्धवार्षिक और मासिक चक्रवृद्धि ब्याज तथा अंतिम राशि की गणना करें।',
    },
    es: {
      name: 'Calculadora de Interés Compuesto',
      description: 'Calcule el crecimiento exponencial de sus ahorros e inversiones compuestas.',
    },
  },
  'discount-calculator': {
    hi: {
      name: 'शॉपिंग डिस्काउंट और बचत कैलकुलेटर',
      description: 'मूल कीमत, छूट प्रतिशत और अंतिम देय राशि तथा कुल बचत तुरंत निकालें।',
    },
    es: {
      name: 'Calculadora de Descuentos y Ahorros',
      description: 'Calcule el precio final tras aplicar descuentos y vea el ahorro exacto.',
    },
  },
  'bmi-calculator': {
    hi: {
      name: 'बॉडी मास इंडेक्स (BMI) कैलकुलेटर',
      description: 'अपनी ऊंचाई और वजन से अपना BMI और स्वास्थ्य श्रेणी (स्वस्थ, कम या अधिक वजन) जानें।',
    },
    es: {
      name: 'Calculadora de Índice de Masa Corporal (IMC)',
      description: 'Evalúe su rango de peso saludable a partir de su estatura y masa corporal.',
    },
  },
};

// Generic technical term translation mapping to localize any unmapped tools
const GENERIC_KEYWORD_MAP: Partial<Record<Language, Record<string, string>>> = {
  en: {},
  hi: {
    'Converter': 'कन्वर्टर',
    'Calculator': 'कैलकुलेटर',
    'Generator': 'जेनरेटर',
    'Beautifier': 'ब्यूटीफायर',
    'Minifier': 'मिनीफायर',
    'Validator': 'वैलिडेटर',
    'Viewer': 'व्यूअर',
    'Compressor': 'कंप्रेसर',
    'Cropper': 'क्रॉपर',
    'Editor': 'एडिटर',
    'Watermark': 'वॉटरमार्क',
    'Encoder': 'एनकोडर',
    'Decoder': 'डिकोडर',
    'Tester': 'परीक्षक',
    'Formatter': 'फॉर्मेटर',
    'Previewer': 'प्रिव्यूअर',
    'Suite': 'संग्रह',
    'Tools': 'टूल्स',
    'Tool': 'टूल',
  },
  es: {
    'Converter': 'Convertidor',
    'Calculator': 'Calculadora',
    'Generator': 'Generador',
    'Beautifier': 'Embellecedor',
    'Minifier': 'Minificador',
    'Validator': 'Validador',
    'Viewer': 'Visor',
    'Compressor': 'Compresor',
    'Cropper': 'Recortador',
    'Editor': 'Editor',
    'Watermark': 'Marca de Agua',
    'Encoder': 'Codificador',
    'Decoder': 'Decodificador',
    'Tester': 'Probador',
    'Formatter': 'Formateador',
    'Previewer': 'Visualizador',
    'Suite': 'Suite',
    'Tools': 'Herramientas',
    'Tool': 'Herramienta',
  },
  fr: {
    'Converter': 'Convertisseur',
    'Calculator': 'Calculateur',
    'Generator': 'Générateur',
    'Beautifier': 'Embellisseur',
    'Minifier': 'Minificateur',
    'Validator': 'Validateur',
    'Viewer': 'Visionneuse',
    'Compressor': 'Compresseur',
    'Cropper': 'Recadreur',
    'Editor': 'Éditeur',
    'Watermark': 'Filigrane',
    'Encoder': 'Encodeur',
    'Decoder': 'Décodeur',
    'Tester': 'Testeur',
    'Formatter': 'Formateur',
    'Previewer': 'Aperçu',
    'Suite': 'Suite',
    'Tools': 'Outils',
    'Tool': 'Outil',
  },
  bn: {
    'Converter': 'কনভার্টার',
    'Calculator': 'ক্যালকুলেটর',
    'Generator': 'জেনারেটর',
    'Beautifier': 'বিউটিফায়ার',
    'Minifier': 'মিনিফায়ার',
    'Compressor': 'কম্প্রেসার',
    'Editor': 'এডিটর',
    'Tools': 'টুলস',
  },
  te: {
    'Converter': 'కన్వర్టర్',
    'Calculator': 'కాలిక్యులేటర్',
    'Generator': 'జనరేటర్',
    'Editor': 'ఎడిటర్',
    'Tools': 'టూల్స్',
  },
  ta: {
    'Converter': 'மாற்றி',
    'Calculator': 'கால்குலேட்டர்',
    'Generator': 'உருவாக்கி',
    'Editor': 'திருத்தி',
    'Tools': 'கருவிகள்',
  },
  mr: {
    'Converter': 'कन्व्हर्टर',
    'Calculator': 'कॅल्क्युलेटर',
    'Generator': 'जनरेटर',
    'Editor': 'एडिटर',
    'Tools': 'टूल्स',
  },
  gu: {
    'Converter': 'કન્વર્ટર',
    'Calculator': 'કેલ્ક્યુલેટર',
    'Generator': 'જનરેટર',
    'Editor': 'એડિટર',
    'Tools': 'ટૂલ્સ',
  },
  kn: {
    'Converter': 'ಪರಿವರ್ತಕ',
    'Calculator': 'ಕ್ಯಾಲ್ಕುಲೇಟರ್',
    'Generator': 'ಜನರೇಟರ್',
    'Editor': 'ಸಂಪಾದಕ',
    'Tools': 'ಪರಿಕರಗಳು',
  },
  ml: {
    'Converter': 'കൺവെർട്ടർ',
    'Calculator': 'കാൽക്കുലേറ്റർ',
    'Generator': 'ജനറേറ്റർ',
    'Editor': 'എഡിറ്റർ',
    'Tools': 'ടൂളുകൾ',
  },
  pa: {
    'Converter': 'ਕਨਵਰਟਰ',
    'Calculator': 'ਕੈਲਕੁਲੇਟਰ',
    'Generator': 'ਜਨਰੇਟਰ',
    'Editor': 'ਐਡੀਟਰ',
    'Tools': 'ਟੂਲਸ',
  },
  ur: {
    'Converter': 'کنورٹر',
    'Calculator': 'کیلکولیٹر',
    'Generator': 'جنریٹر',
    'Editor': 'ایڈیٹر',
    'Tools': 'ٹولز',
  },
  or: {
    'Converter': 'କନଭର୍ଟର୍',
    'Calculator': 'କ୍ୟାଲକୁଲେଟର୍',
    'Generator': 'ଜେନେରେଟର୍',
    'Editor': 'ଏଡିଟର୍',
    'Tools': 'ଟୁଲ୍ସ',
  },
  bho: {
    'Converter': 'कन्वर्टर',
    'Calculator': 'कैलकुलेटर',
    'Generator': 'जनरेटर',
    'Editor': 'एडिटर',
    'Tools': 'टूल',
    'Tool': 'टूल',
  },
  de: {
    'Converter': 'Konverter',
    'Calculator': 'Rechner',
    'Generator': 'Generator',
    'Beautifier': 'Formatierer',
    'Minifier': 'Minimierer',
    'Validator': 'Prüfer',
    'Compressor': 'Komprimierer',
    'Editor': 'Editor',
    'Tools': 'Werkzeuge',
    'Tool': 'Werkzeug',
  },
  pt: {
    'Converter': 'Conversor',
    'Calculator': 'Calculadora',
    'Generator': 'Gerador',
    'Beautifier': 'Formatador',
    'Minifier': 'Minificador',
    'Compressor': 'Compressor',
    'Editor': 'Editor',
    'Tools': 'Ferramentas',
    'Tool': 'Ferramenta',
  },
  ar: {
    'Converter': 'محول',
    'Calculator': 'حاسبة',
    'Generator': 'مولد',
    'Beautifier': 'منسق',
    'Compressor': 'ضاغط',
    'Editor': 'محرر',
    'Tools': 'أدوات',
    'Tool': 'أداة',
  },
  zh: {
    'Converter': '转换器',
    'Calculator': '计算器',
    'Generator': '生成器',
    'Beautifier': '美化器',
    'Minifier': '压缩器',
    'Compressor': '压缩器',
    'Editor': '编辑器',
    'Tools': '工具',
    'Tool': '工具',
  },
  ja: {
    'Converter': '変換ツール',
    'Calculator': '計算機',
    'Generator': '生成ツール',
    'Beautifier': '整形ツール',
    'Minifier': '圧縮ツール',
    'Compressor': '圧縮ツール',
    'Editor': 'エディタ',
    'Tools': 'ツール',
    'Tool': 'ツール',
  },
};

/**
 * Returns localized tool name & description for the specified tool and language.
 * Seamlessly resolves regional dialects (e.g. bho -> hi, es-MX -> es, en-IN -> en)
 */
export function getLocalizedToolContent(
  toolId: string,
  defaultName: string,
  defaultDescription: string,
  language: Language
): { name: string; description: string } {
  if (language === 'en') {
    return { name: defaultName, description: defaultDescription };
  }

  // 1. Direct match in dictionary
  const toolEntry = TOOL_LOCALIZATIONS[toolId];
  if (toolEntry && toolEntry[language]) {
    return {
      name: toolEntry[language]!.name || defaultName,
      description: toolEntry[language]!.description || defaultDescription,
    };
  }

  // 2. Dialect Fallback (bho -> hi, es-MX -> es, en-IN -> en)
  const dialectFallbackMap: Partial<Record<Language, Language>> = {
    bho: 'hi',
    'es-MX': 'es',
    'en-IN': 'en',
  };
  const fallbackLang = dialectFallbackMap[language];
  if (fallbackLang && toolEntry && toolEntry[fallbackLang]) {
    return {
      name: toolEntry[fallbackLang]!.name,
      description: toolEntry[fallbackLang]!.description,
    };
  }

  // 3. Fallback to generic keyword translation for tool name
  const kwMap = GENERIC_KEYWORD_MAP[language] || (fallbackLang ? GENERIC_KEYWORD_MAP[fallbackLang] : undefined);
  if (kwMap) {
    let localizedName = defaultName;
    for (const [enWord, transWord] of Object.entries(kwMap)) {
      localizedName = localizedName.replace(new RegExp(`\\b${enWord}\\b`, 'g'), transWord);
    }
    return {
      name: localizedName,
      description: (fallbackLang && toolEntry?.[fallbackLang]?.description) || defaultDescription,
    };
  }

  return { name: defaultName, description: defaultDescription };
}
