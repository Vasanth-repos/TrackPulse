export type Language = 'en' | 'ta' | 'hi';

export interface Translations {
  appName: string;
  appSubtitle: string;
  controlRoom: string;
  passenger: string;
  stationBoard: string;
  dataStatus: string;
  liveReplay: string;
  lastUpdate: string;
  engineStatus: string;
  apiStatus: string;
  modelVersion: string;
  demoNotice: string;
  trainNo: string;
  trainName: string;
  currentLocation: string;
  nextStation: string;
  expectedArrival: string;
  estimatedRange: string;
  reliability: string;
  operatingRegime: string;
  currentDelay: string;
  normal: string;
  delayed: string;
  disrupted: string;
  high: string;
  medium: string;
  low: string;
  onTime: string;
  searchPlaceholder: string;
  checkEta: string;
  useMyJourney: string;
  recentSearches: string;
  journeyProgress: string;
  etaUpdates: string;
  connectionRisk: string;
  safe: string;
  atRisk: string;
  likelyMissed: string;
  smsTitle: string;
  smsSubtitle: string;
  howItWorks: string;
  stationPassengerInfo: string;
  importantInfo: string;
  platform: string;
  scheduled: string;
  expected: string;
  disclaimerText: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: "TRACKPULSE",
    appSubtitle: "Adaptive ETA Reliability & Forecasting System",
    controlRoom: "CONTROL ROOM",
    passenger: "PASSENGER",
    stationBoard: "STATION BOARD",
    dataStatus: "DATA STATUS",
    liveReplay: "LIVE / REPLAY",
    lastUpdate: "Last railway data update",
    engineStatus: "Prediction engine: Operational",
    apiStatus: "API: Operational",
    modelVersion: "Model: TrackPulse ETA v1.0",
    demoNotice: "DEMO — HISTORICAL REPLAY (Simulated Indian Railways Data)",
    trainNo: "TRAIN NUMBER",
    trainName: "TRAIN NAME",
    currentLocation: "CURRENT LOCATION",
    nextStation: "NEXT STATION",
    expectedArrival: "EXPECTED ARRIVAL",
    estimatedRange: "ESTIMATED RANGE",
    reliability: "RELIABILITY",
    operatingRegime: "OPERATING REGIME",
    currentDelay: "CURRENT DELAY",
    normal: "NORMAL",
    delayed: "DELAYED",
    disrupted: "DISRUPTED",
    high: "HIGH",
    medium: "MEDIUM",
    low: "LOW",
    onTime: "ON TIME",
    searchPlaceholder: "Enter 5-digit Train Number (e.g. 12627)",
    checkEta: "CHECK ETA",
    useMyJourney: "Use My Journey",
    recentSearches: "Recent Searches",
    journeyProgress: "JOURNEY PROGRESS",
    etaUpdates: "ETA Prediction History",
    connectionRisk: "Connection Risk Analysis",
    safe: "SAFE",
    atRisk: "AT RISK",
    likelyMissed: "LIKELY MISSED",
    smsTitle: "No Smartphone? Get ETA by SMS",
    smsSubtitle: "Fast, universal keypad phone access over standard telecom networks",
    howItWorks: "How It Works",
    stationPassengerInfo: "Station Passenger Information",
    importantInfo: "IMPORTANT INFORMATION",
    platform: "Platform",
    scheduled: "Scheduled",
    expected: "Expected",
    disclaimerText: "Arrival times are statistical estimates based on section telemetry and may change with operational conditions."
  },
  ta: {
    appName: "ட்ராக்பல்ஸ்",
    appSubtitle: "தகவமைப்பு இரயில் வருகை நம்பகத்தன்மை மற்றும் முன்னறிவிப்பு அமைப்பு",
    controlRoom: "கட்டுப்பாட்டு அறை",
    passenger: "பயணிகள் தளம்",
    stationBoard: "நிலைய பலகை",
    dataStatus: "தரவு நிலை",
    liveReplay: "நேரலை / மறுஒளிபரப்பு",
    lastUpdate: "கடைசி புதுப்பிப்பு",
    engineStatus: "முன்னறிவிப்பு இயந்திரம்: செயல்படுகிறது",
    apiStatus: "API: செயல்படுகிறது",
    modelVersion: "மாதிரி: TrackPulse ETA v1.0",
    demoNotice: "மாதிரி காட்சி — வரலாற்று மறுஒளிபரப்பு (இந்திய ரயில்வே தரவு மாதிரி)",
    trainNo: "இரயில் எண்",
    trainName: "இரயில் பெயர்",
    currentLocation: "தற்போதைய இடம்",
    nextStation: "அடுத்த நிலையம்",
    expectedArrival: "எதிர்பார்க்கப்படும் வருகை",
    estimatedRange: "மதிப்பிடப்பட்ட வரம்பு",
    reliability: "நம்பகத்தன்மை",
    operatingRegime: "இயக்க முறைமை",
    currentDelay: "தற்போதைய தாமதம்",
    normal: "வழக்கமானது",
    delayed: "தாமதம்",
    disrupted: "தடைபட்டது",
    high: "அதிகம்",
    medium: "நடுத்தரம்",
    low: "குறைவு",
    onTime: "சரியான நேரம்",
    searchPlaceholder: "5 இலக்க ரயில் எண்ணை உள்ளிடவும் (எ.கா. 12627)",
    checkEta: "வருகை நேரம் பார்",
    useMyJourney: "எனது பயணம்",
    recentSearches: "சமீபத்திய தேடல்கள்",
    journeyProgress: "பயண முன்னேற்றம்",
    etaUpdates: "வருகை நேர மாற்ற வரலாறு",
    connectionRisk: "இணைப்பு இரயில் ஆபத்து ஆய்வு",
    safe: "பாதுகாப்பானது",
    atRisk: "ஆபத்து உள்ளது",
    likelyMissed: "தவறவிட வாய்ப்பு",
    smsTitle: "ஸ்மார்ட்போன் இல்லையா? SMS மூலம் அறியலாம்",
    smsSubtitle: "எளிய விசைப்பலகை தொலைபேசி மூலம் உடனடித் தகவல்",
    howItWorks: "இது எவ்வாறு செயல்படுகிறது",
    stationPassengerInfo: "நிலைய பயணிகள் தகவல் பலகை",
    importantInfo: "முக்கிய தகவல்",
    platform: "நடைமேடை",
    scheduled: "திட்டமிடப்பட்ட நேரம்",
    expected: "எதிர்பார்க்கப்படும் நேரம்",
    disclaimerText: "வருகை நேரங்கள் புள்ளிவிவர அடிப்படையிலான மதிப்பீடுகள் மட்டுமே, அவை இயக்க நிலைமைகளைப் பொறுத்து மாறக்கூடும்."
  },
  hi: {
    appName: "ट्रैकपल्स",
    appSubtitle: "अनुकूली ट्रेन ईटीए विश्वसनीयता और पूर्वानुमान प्रणाली",
    controlRoom: "नियंत्रण कक्ष",
    passenger: "यात्री पोर्टल",
    stationBoard: "स्टेशन बोर्ड",
    dataStatus: "डेटा स्थिति",
    liveReplay: "लाइव / रीप्ले",
    lastUpdate: "अंतिम रेलवे डेटा अपडेट",
    engineStatus: "पूर्वानुमान इंजन: कार्यरत",
    apiStatus: "एपीआई: कार्यरत",
    modelVersion: "मॉडल: TrackPulse ETA v1.0",
    demoNotice: "डेमो — ऐतिहासिक रीप्ले (भारतीय रेल डेटा सिमुलेशन)",
    trainNo: "गाड़ी संख्या",
    trainName: "गाड़ी का नाम",
    currentLocation: "वर्तमान स्थान",
    nextStation: "अगला स्टेशन",
    expectedArrival: "अनुमानित आगमन",
    estimatedRange: "अनुमानित समय सीमा",
    reliability: "विश्वसनीयता",
    operatingRegime: "परिचालन स्थिति",
    currentDelay: "वर्तमान विलंब",
    normal: "सामान्य",
    delayed: "विलंबित",
    disrupted: "बाधित",
    high: "उच्च",
    medium: "मध्यम",
    low: "निम्न",
    onTime: "समय पर",
    searchPlaceholder: "5-अंकीय ट्रेन नंबर दर्ज करें (उदा. 12627)",
    checkEta: "ईटीए देखें",
    useMyJourney: "मेरी यात्रा",
    recentSearches: "हाल की खोजें",
    journeyProgress: "यात्रा प्रगति",
    etaUpdates: "ईटीए पूर्वानुमान इतिहास",
    connectionRisk: "कनेक्टिंग ट्रेन जोखिम विश्लेषण",
    safe: "सुरक्षित",
    atRisk: "जोखिम में",
    likelyMissed: "छूटने की संभावना",
    smsTitle: "स्मार्टफोन नहीं है? एसएमएस से ईटीए पाएं",
    smsSubtitle: "साधारण कीपैड फोन से तुरंत ट्रेन स्थिति प्राप्त करें",
    howItWorks: "यह कैसे काम करता है",
    stationPassengerInfo: "स्टेशन यात्री सूचना बोर्ड",
    importantInfo: "महत्वपूर्ण सूचना",
    platform: "प्लेटफॉर्म",
    scheduled: "निर्धारित",
    expected: "अनुमानित",
    disclaimerText: "आगमन समय सांख्यिकीय अनुमान हैं और परिचालन स्थितियों के अनुसार बदल सकते हैं।"
  }
};
