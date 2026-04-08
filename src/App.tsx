import { useState, ReactNode, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { 
  Sparkles, 
  MapPin, 
  Shirt, 
  CloudSun, 
  ChevronRight, 
  Loader2,
  CheckCircle2,
  Palette,
  Wind,
  UserCircle,
  Search,
  Heart,
  Briefcase,
  Coffee,
  PartyPopper,
  Camera,
  Music,
  Moon,
  Sun,
  CloudRain,
  Snowflake,
  Thermometer
} from 'lucide-react';
import { getBeautyConsultation, BeautyConsultation } from './services/geminiService';

// Custom Cursor Component
const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 30, stiffness: 200 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      dotX.set(e.clientX);
      dotY.set(e.clientY);
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY, dotX, dotY]);

  return (
    <>
      {/* Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 border border-rose-gold/30 rounded-full pointer-events-none z-50 hidden md:block"
        style={{
          translateX: cursorXSpring,
          translateY: cursorYSpring,
          x: '-50%',
          y: '-50%',
        }}
      />
      {/* Inner Pearl */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-rose-gold rounded-full pointer-events-none z-50 hidden md:block shadow-[0_0_10px_rgba(183,110,121,0.5)]"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
    </>
  );
};

// Interactive Background Component
const InteractiveBackground = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      mouseX.set(clientX);
      mouseY.set(clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Dynamic Glow */}
      <motion.div 
        className="absolute w-[1000px] h-[1000px] rounded-full bg-gradient-to-br from-soft-pink/30 to-rose-gold-light/20 blur-[150px]"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
      
      {/* Floating Decorative Elements */}
      <div className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-rose-gold/5 blur-[80px] animate-pulse" />
      <div className="absolute bottom-[20%] right-[10%] w-96 h-96 rounded-full bg-soft-pink/10 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Subtle Texture/Grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#B76E79 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }} />
    </div>
  );
};

export default function App() {
  const [tpo, setTpo] = useState('');
  const [customTpo, setCustomTpo] = useState('');
  const [outfitColor, setOutfitColor] = useState('#B76E79');
  const [weather, setWeather] = useState('');
  const [customWeather, setCustomWeather] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BeautyConsultation | null>(null);

  const tpoOptions = [
    { id: '소개팅', label: '소개팅', icon: <Heart className="w-4 h-4" /> },
    { id: '중요한 면접', label: '면접', icon: <Briefcase className="w-4 h-4" /> },
    { id: '힙한 카페 투어', label: '카페', icon: <Coffee className="w-4 h-4" /> },
    { id: '격식 있는 결혼식', label: '결혼식', icon: <PartyPopper className="w-4 h-4" /> },
    { id: '데일리 출근', label: '출근', icon: <UserCircle className="w-4 h-4" /> },
    { id: '사진 촬영', label: '촬영', icon: <Camera className="w-4 h-4" /> },
    { id: '클럽/파티', label: '파티', icon: <Music className="w-4 h-4" /> },
    { id: '심야 데이트', label: '심야', icon: <Moon className="w-4 h-4" /> },
  ];

  const weatherOptions = [
    { id: '맑음', label: '맑음', icon: <Sun className="w-4 h-4" /> },
    { id: '비/습함', label: '비/습함', icon: <CloudRain className="w-4 h-4" /> },
    { id: '추움/건조', label: '추움', icon: <Snowflake className="w-4 h-4" /> },
    { id: '흐림', label: '흐림', icon: <CloudSun className="w-4 h-4" /> },
    { id: '무더위', label: '무더위', icon: <Thermometer className="w-4 h-4" /> },
  ];

  const handleStartConsulting = async () => {
    const finalTpo = customTpo || tpo;
    const finalWeather = customWeather || weather;

    if (!finalTpo || !finalWeather) {
      alert('상황과 날씨를 선택하거나 입력해주세요.');
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const data = await getBeautyConsultation(finalTpo, outfitColor, finalWeather);
      setResult(data);
    } catch (error) {
      console.error('Consultation failed:', error);
      alert('분석 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-16 px-4 sm:px-6 selection:bg-rose-gold/20 relative">
      <CustomCursor />
      <InteractiveBackground />

      {/* Decorative Magazine Elements */}
      <div className="fixed top-0 left-0 w-full h-2 bg-rose-gold/20 z-40" />
      <div className="fixed bottom-0 left-0 w-full h-2 bg-rose-gold/20 z-40" />
      <div className="fixed top-0 left-0 w-2 h-full bg-rose-gold/20 z-40" />
      <div className="fixed top-0 right-0 w-2 h-full bg-rose-gold/20 z-40" />

      {/* Header */}
      <header className="text-center mb-20 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-block relative">
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.5em] text-rose-gold/60 uppercase font-medium">The Intelligence of Style</span>
            <h1 className="text-7xl sm:text-8xl font-serif text-rose-gold mb-2 italic tracking-tighter leading-none">
              BeautyMind
            </h1>
            <div className="flex items-center justify-center gap-4 mt-2">
              <div className="h-px w-12 bg-rose-gold/30" />
              <span className="text-rose-gold font-serif italic text-2xl">AI</span>
              <div className="h-px w-12 bg-rose-gold/30" />
            </div>
            <motion.div 
              className="absolute -right-12 top-0 text-soft-pink/40"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-12 h-12" />
            </motion.div>
          </div>
        </motion.div>
      </header>

      <main className="w-full max-w-4xl space-y-16 relative z-10">
        {/* Input Form Card */}
        <section className="magazine-card p-12 space-y-12 relative backdrop-blur-2xl bg-white/60 border-white/50 shadow-2xl">
          <div className="absolute top-8 right-8 text-rose-gold/10 font-serif italic text-8xl pointer-events-none select-none">Issue 01</div>
          
          {/* TPO Selection */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-3 text-xs font-semibold text-gray-500 uppercase tracking-[0.2em]">
                <MapPin className="w-4 h-4 text-rose-gold" />
                01. Situation (TPO)
              </label>
              <span className="text-[10px] text-gray-300 font-serif italic">Select or Type your own</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {tpoOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => { setTpo(option.id); setCustomTpo(''); }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-xs transition-all duration-300 ${
                    tpo === option.id && !customTpo
                      ? 'border-rose-gold bg-rose-gold text-white shadow-md'
                      : 'border-gray-100 hover:border-rose-gold-light text-gray-500 bg-white'
                  }`}
                >
                  {option.icon}
                  <span className="font-medium">{option.label}</span>
                </button>
              ))}
            </div>
            
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-rose-gold transition-colors" />
              <input 
                type="text"
                placeholder="직접 입력하기 (예: 한강 피크닉, 첫 출근날...)"
                value={customTpo}
                onChange={(e) => { setCustomTpo(e.target.value); setTpo(''); }}
                className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-rose-gold/20 transition-all outline-none placeholder:text-gray-300"
              />
            </div>
          </div>

          {/* Outfit Color */}
          <div className="space-y-6">
            <label className="flex items-center gap-3 text-xs font-semibold text-gray-500 uppercase tracking-[0.2em]">
              <Shirt className="w-4 h-4 text-rose-gold" />
              02. Outfit Color
            </label>
            <div className="flex flex-wrap items-center gap-6 p-6 rounded-2xl bg-gray-50/50">
              <div className="relative">
                <input
                  type="color"
                  value={outfitColor}
                  onChange={(e) => setOutfitColor(e.target.value)}
                  className="w-16 h-16 rounded-full border-4 border-white shadow-lg cursor-pointer overflow-hidden appearance-none"
                />
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                  <Palette className="w-3 h-3 text-rose-gold" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-400 uppercase tracking-widest">Selected Hue</p>
                <p className="text-xl font-serif italic text-rose-gold tracking-tighter">{outfitColor}</p>
              </div>
              <div className="flex-1 flex gap-2 justify-end">
                {['#B76E79', '#E0BFB8', '#F8C8DC', '#000000', '#FFFFFF', '#333333'].map(c => (
                  <button 
                    key={c}
                    onClick={() => setOutfitColor(c)}
                    className="w-6 h-6 rounded-full border border-white shadow-sm hover:scale-110 transition-transform"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Weather Selection */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-3 text-xs font-semibold text-gray-500 uppercase tracking-[0.2em]">
                <CloudSun className="w-4 h-4 text-rose-gold" />
                03. Weather Condition
              </label>
            </div>
            <div className="flex flex-wrap gap-2">
              {weatherOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => { setWeather(option.id); setCustomWeather(''); }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs transition-all duration-300 ${
                    weather === option.id && !customWeather
                      ? 'border-rose-gold bg-rose-gold text-white shadow-md'
                      : 'border-gray-100 hover:border-rose-gold-light text-gray-500 bg-white'
                  }`}
                >
                  {option.icon}
                  <span className="font-medium">{option.label}</span>
                </button>
              ))}
            </div>
            <input 
              type="text"
              placeholder="날씨 직접 입력 (예: 안개 자욱한 아침, 눈 내리는 밤...)"
              value={customWeather}
              onChange={(e) => { setCustomWeather(e.target.value); setWeather(''); }}
              className="w-full px-6 py-4 bg-gray-50/50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-rose-gold/20 transition-all outline-none placeholder:text-gray-300"
            />
          </div>

          {/* Action Button */}
          <div className="pt-6">
            <button
              onClick={handleStartConsulting}
              disabled={loading}
              className="btn-primary w-full h-16 flex items-center justify-center gap-3 group relative overflow-hidden shadow-xl shadow-rose-gold/20"
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-rose-gold via-soft-pink to-rose-gold opacity-0 group-hover:opacity-20 transition-opacity"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span className="text-lg font-serif italic tracking-wide">AI 컨설팅 시작</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                </>
              )}
            </button>
          </div>
        </section>

        {/* Loading State */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="magazine-card p-16 flex flex-col items-center justify-center space-y-6 backdrop-blur-md bg-white/90"
            >
              <div className="relative">
                <motion.div 
                  className="w-20 h-20 border-2 border-rose-gold/20 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
                <Loader2 className="w-10 h-10 text-rose-gold animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                <motion.div
                  className="absolute -top-4 -right-4"
                  animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-8 h-8 text-soft-pink" />
                </motion.div>
              </div>
              <div className="text-center space-y-2">
                <p className="text-rose-gold font-serif text-2xl italic tracking-tight">당신만의 뷰티 솔루션을 큐레이팅 중입니다</p>
                <p className="text-gray-400 text-[10px] uppercase tracking-[0.4em]">Curating your bespoke aesthetic profile</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result Section */}
        <AnimatePresence>
          {result && !loading && (
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-10 pb-20"
            >
              <div className="flex items-center gap-6">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-rose-gold-light" />
                <h2 className="text-4xl font-serif text-gray-800 italic tracking-tight">The Curation</h2>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-rose-gold-light" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ResultCard
                  title="Face & Mood"
                  icon={<UserCircle className="w-5 h-5" />}
                  content={result.face}
                  delay={0.1}
                  number="01"
                />
                <ResultCard
                  title="Color Palette"
                  icon={<Palette className="w-5 h-5" />}
                  content={result.color}
                  delay={0.2}
                  number="02"
                />
                <ResultCard
                  title="Hair & Accents"
                  icon={<Wind className="w-5 h-5" />}
                  content={result.hairAndPoint}
                  delay={0.3}
                  number="03"
                />
                <ResultCard
                  title="Expert Insight"
                  icon={<CheckCircle2 className="w-5 h-5" />}
                  content={result.guide}
                  delay={0.4}
                  fullWidth
                  number="04"
                />
              </div>

              <motion.div 
                className="text-center pt-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <button 
                  onClick={() => setResult(null)}
                  className="group flex items-center gap-2 mx-auto text-gray-400 hover:text-rose-gold text-[10px] uppercase tracking-[0.3em] transition-all"
                >
                  <div className="w-8 h-px bg-gray-200 group-hover:bg-rose-gold transition-colors" />
                  New Consultation
                  <div className="w-8 h-px bg-gray-200 group-hover:bg-rose-gold transition-colors" />
                </button>
              </motion.div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-auto py-10 text-gray-300 text-[9px] uppercase tracking-[0.5em] flex flex-col items-center gap-4">
        <div className="flex gap-8">
          <span>Est. 2026</span>
          <span>&bull;</span>
          <span>Seoul / Paris / New York</span>
        </div>
        <p className="opacity-50">BeautyMind AI &bull; Powered by Gemini Intelligence</p>
      </footer>
    </div>
  );
}

function ResultCard({ title, icon, content, delay, fullWidth = false, number }: { 
  title: string; 
  icon: ReactNode; 
  content: string; 
  delay: number;
  fullWidth?: boolean;
  number: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`magazine-card p-10 space-y-8 relative group hover:shadow-3xl hover:shadow-rose-gold/10 transition-all duration-700 ${fullWidth ? 'md:col-span-2' : ''}`}
    >
      <div className="absolute top-6 right-8 text-6xl font-serif italic text-rose-gold/5 group-hover:text-rose-gold/10 transition-colors duration-700 pointer-events-none select-none">
        {number}
      </div>
      
      <div className="flex items-center gap-4">
        <div className="p-3 bg-rose-gold/5 rounded-2xl text-rose-gold group-hover:bg-rose-gold group-hover:text-white transition-all duration-500">
          {icon}
        </div>
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-[0.3em] text-rose-gold/50 font-medium">Curated Advice</p>
          <h3 className="text-2xl font-serif italic tracking-tight text-gray-800">{title}</h3>
        </div>
      </div>
      
      <div className="h-px w-full bg-gradient-to-r from-rose-gold/20 via-rose-gold/5 to-transparent" />
      
      <p className="text-gray-600 text-base leading-[1.8] whitespace-pre-wrap font-light tracking-wide">
        {content}
      </p>
      
      <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-rose-gold to-soft-pink group-hover:w-full transition-all duration-1000 ease-in-out" />
    </motion.div>
  );
}
