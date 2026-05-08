import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {
  Brain,
  Activity,
  Zap,
  DollarSign,
  BarChart3,
  Clock,
  ArrowRightLeft,
  LayoutGrid,
  Info,
  Code2,
  Filter,
  X,
  Search,
  RotateCcw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { getCandidateData } from '../Reducer/CandidateSlice';

/* ═══ Types ═══════════════════════════════════════════════ */
interface Totals {
  total_requests: number;
  total_input_tokens: number;
  total_output_tokens: number;
  total_tokens: number;
  total_input_cost_usd: number;
  total_output_cost_usd: number;
  total_cost_usd: number;
}
interface ByEndpoint {
  [key: string]: { requests: number; total_tokens: number; total_cost_usd: number };
}
interface SummaryData {
  success: boolean;
  totals: Totals;
  by_endpoint: ByEndpoint;
}

/* ═══ Fake static data for Coding Assessment tab ═══════════ */
const CODING_TOTALS: Totals = {
  total_requests: 226,
  total_input_tokens: 31850,
  total_output_tokens: 10850,
  total_tokens: 42700,
  total_input_cost_usd: 0.03822,
  total_output_cost_usd: 0.01734,
  total_cost_usd: 0.05556,
};
const CODING_ENDPOINTS: ByEndpoint = {
  'question_generation': { requests: 128, total_tokens: 24500, total_cost_usd: 0.0312 },
  'answer_evaluation':   { requests: 98,  total_tokens: 18200, total_cost_usd: 0.0241 },
};

/* ═══ Animated counter hook ════════════════════════════════ */
function useCountUp(target: number, duration = 1.6, decimals = 0, resetKey?: string) {
  const [display, setDisplay] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    setDisplay(0);
    if (raf.current) cancelAnimationFrame(raf.current);
    if (target === 0) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, resetKey]);

  return display;
}

/* ═══ Animated progress bar ════════════════════════════════ */
interface AnimatedBarProps {
  percent: number;
  colorFrom: string;
  colorTo: string;
  glow: string;
  delay?: number;
  resetKey: string;
}
const AnimatedBar = ({ percent, colorFrom, colorTo, glow, delay = 0, resetKey }: AnimatedBarProps) => (
  <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden relative">
    <motion.div
      key={resetKey}
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: `${percent}%`, opacity: 1 }}
      transition={{ duration: 1.4, delay, ease: [0.34, 1.56, 0.64, 1] }}
      className="h-full rounded-full relative"
      style={{ background: `linear-gradient(90deg, ${colorFrom}, ${colorTo})`, boxShadow: `0 0 12px 2px ${glow}` }}
    >
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '200%' }}
        transition={{ duration: 1.2, delay: delay + 0.5, ease: 'easeInOut' }}
        className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
      />
    </motion.div>
  </div>
);

/* ═══ Animated number ═══════════════════════════════════════ */
const AnimatedNumber = ({
  value, prefix = '', decimals = 0, duration = 1.6, resetKey = '',
}: { value: number; prefix?: string; decimals?: number; duration?: number; resetKey?: string }) => {
  const counted = useCountUp(value, duration, decimals, resetKey);
  const formatted = decimals > 0 ? counted.toFixed(decimals) : Math.round(counted).toLocaleString();
  return <span>{prefix}{formatted}</span>;
};

/* ═══ Tab config ════════════════════════════════════════════ */
const TABS = [
  { id: 'interview', label: 'AI Interview',       icon: Brain },
  { id: 'coding',   label: 'Coding Assessment',   icon: Code2 },
] as const;
type TabId = typeof TABS[number]['id'];

/* ═══ Main component ════════════════════════════════════════ */
const GptCost = () => {
  const dispatch = useDispatch();
  const { candidatesList } = useSelector((state: any) => state.candidate);

  const [activeTab, setActiveTab] = useState<TabId>('interview');
  const [interviewData, setInterviewData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  // Filter state
  const [userId, setUserId]       = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate]     = useState('');
  const [endpoint, setEndpoint]   = useState('');
  const [activeFilters, setActiveFilters] = useState(0);

  const fetchData = async (params?: { user_id?: string; start_date?: string; end_date?: string; endpoint?: string }) => {
    const isInitial = !params;
    isInitial ? setLoading(true) : setFilterLoading(true);
    try {
      const query = new URLSearchParams();
      if (params?.user_id)    query.set('user_id',    params.user_id);
      if (params?.start_date) query.set('start_date', params.start_date);
      if (params?.end_date)   query.set('end_date',   params.end_date);
      if (params?.endpoint)   query.set('endpoint',   params.endpoint);
      const url = `https://aiinterviewpythonmain.bestworks.cloud/api/v1/gpt-cost/summary${
        query.toString() ? '?' + query.toString() : ''
      }`;
      const res = await axios.get(url);
      if (res.data.success) setInterviewData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      isInitial ? setLoading(false) : setFilterLoading(false);
    }
  };

  useEffect(() => { 
    fetchData(); 
    dispatch(getCandidateData() as any);
  }, [dispatch]);

  const handleApplyFilter = () => {
    const count = [userId, startDate, endDate, endpoint].filter(Boolean).length;
    setActiveFilters(count);
    fetchData({
      user_id:    userId    || undefined,
      start_date: startDate || undefined,
      end_date:   endDate   || undefined,
      endpoint:   endpoint  || undefined,
    });
  };

  const handleClearFilter = () => {
    setUserId('');
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
    setEndpoint('');
    setActiveFilters(0);
    fetchData();
  };

  const candidatesArray = Array.isArray(candidatesList?.data) ? candidatesList.data : [];
  const filteredCandidates = candidatesArray.filter((c: any) =>
    c.candidateName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* Pick data based on tab — completely isolated */
  const totals: Totals = activeTab === 'interview'
    ? (interviewData?.totals ?? { total_requests:0,total_input_tokens:0,total_output_tokens:0,total_tokens:0,total_input_cost_usd:0,total_output_cost_usd:0,total_cost_usd:0 })
    : CODING_TOTALS;

  const byEndpoint: ByEndpoint = activeTab === 'interview'
    ? (interviewData?.by_endpoint ?? {})
    : CODING_ENDPOINTS;

  const inputPct  = (totals.total_input_tokens  / (totals.total_tokens || 1)) * 100;
  const outputPct = (totals.total_output_tokens / (totals.total_tokens || 1)) * 100;
  const avgCost   = totals.total_cost_usd / (totals.total_requests || 1);
  const rk = activeTab; // resetKey triggers re-animation on tab switch

  const itemV = {
    hidden:  { y: 24, opacity: 0, scale: 0.97 },
    visible: { y: 0, opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 90, damping: 15 } },
  };
  const wrapV = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  if (loading) return (
    <div className="flex h-full items-center justify-center">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-pink-200 border-t-[#800080] animate-spin" />
        <Brain className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 animate-pulse" style={{ color: '#800080' }} />
      </div>
    </div>
  );

  return (
    <motion.div initial="hidden" animate="visible" variants={wrapV} className="p-6 max-w-7xl mx-auto space-y-8">

      {/* ── Header ── */}
      <motion.div variants={itemV} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ background: 'linear-gradient(135deg, #800080, #b300b3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            GPT Usage Analytics
          </h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4" />
            Detailed breakdown of API expenditure and token consumption
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border shadow-sm"
          style={{ background: '#fff0ff', color: '#800080', borderColor: '#e5b3e5' }}>
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#800080' }} />
          Real-time Sync
        </div>
      </motion.div>

      {/* ── Tabs + Filter toggle ── */}
      <motion.div variants={itemV} className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2 p-1.5 bg-gray-100 rounded-2xl">
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 ${
                  active ? 'text-white' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="tab-active-pill"
                    className="absolute inset-0 rounded-xl shadow-md"
                    style={{ background: 'linear-gradient(135deg, #800080, #b300b3)' }}
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter button — only for AI Interview */}
        {activeTab === 'interview' && (
          <button
            onClick={() => setShowFilter(v => !v)}
            className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 hover:shadow-md"
            style={{
              background: showFilter ? '#800080' : '#fff0ff',
              color: showFilter ? '#fff' : '#800080',
              borderColor: '#e5b3e5',
            }}
          >
            <Filter className="w-4 h-4" />
            Filters
            {activeFilters > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
                style={{ background: '#800080' }}>
                {activeFilters}
              </span>
            )}
          </button>
        )}
      </motion.div>

      {/* ── Filter Panel (AI Interview only) ── */}
      <AnimatePresence>
        {activeTab === 'interview' && showFilter && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -8, overflow: 'hidden' }}
            animate={{ 
              opacity: 1, 
              height: 'auto', 
              y: 0,
              transitionEnd: { overflow: 'visible' } 
            }}
            exit={{ opacity: 0, height: 0, y: -8, overflow: 'hidden' }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative z-30"
          >
            <div className="bg-white rounded-2xl border p-6 shadow-sm" style={{ borderColor: '#e5b3e5' }}>
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Filter className="w-4 h-4" style={{ color: '#800080' }} />
                  Filter Results
                </p>
                {activeFilters > 0 && (
                  <button onClick={handleClearFilter}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                    style={{ color: '#800080', background: '#fff0ff' }}>
                    <RotateCcw className="w-3 h-3" /> Clear All
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* User Name Search */}
                <div className="space-y-1.5 relative">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Candidate Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={e => {
                        setSearchTerm(e.target.value);
                        setShowSuggestions(true);
                        if (!e.target.value) setUserId('');
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      placeholder="Search name..."
                      className="w-full px-3 py-2.5 text-sm border rounded-xl outline-none transition-all pr-10"
                      style={{ borderColor: searchTerm ? '#800080' : '#e5e7eb' }}
                    />
                    {searchTerm && (
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setUserId('');
                          setShowSuggestions(false);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Suggestions Dropdown */}
                  <AnimatePresence>
                    {showSuggestions && searchTerm && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl max-h-48 overflow-y-auto"
                      >
                        {filteredCandidates?.length > 0 ? (
                          filteredCandidates.map((c: any) => (
                            <button
                              key={c.id}
                              onClick={() => {
                                setSearchTerm(c.candidateName);
                                setUserId(c.id);
                                setShowSuggestions(false);
                              }}
                              className="w-full text-left px-4 py-3 text-sm hover:bg-pink-50 transition-colors flex items-center justify-between group"
                            >
                              <span className="font-medium text-gray-700">{c.candidateName}</span>
                              <span className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">ID: {c.id}</span>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-sm text-gray-500 italic">No candidates found</div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Start Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border rounded-xl outline-none transition-all"
                    style={{ borderColor: startDate ? '#800080' : '#e5e7eb' }}
                    onFocus={e => (e.target.style.borderColor = '#800080')}
                    onBlur={e => (e.target.style.borderColor = startDate ? '#800080' : '#e5e7eb')}
                  />
                </div>

                {/* End Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border rounded-xl outline-none transition-all"
                    style={{ borderColor: endDate ? '#800080' : '#e5e7eb' }}
                    onFocus={e => (e.target.style.borderColor = '#800080')}
                    onBlur={e => (e.target.style.borderColor = endDate ? '#800080' : '#e5e7eb')}
                  />
                </div>

                {/* AI Service Filter */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">AI Service</label>
                  <select
                    value={endpoint}
                    onChange={e => setEndpoint(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border rounded-xl outline-none transition-all bg-white"
                    style={{ borderColor: endpoint ? '#800080' : '#e5e7eb' }}
                    onFocus={e => (e.target.style.borderColor = '#800080')}
                    onBlur={e => (e.target.style.borderColor = endpoint ? '#800080' : '#e5e7eb')}
                  >
                    <option value="">All Services</option>
                    <option value="generation">generation</option>
                    <option value="evaluation">evaluation</option>
                  </select>
                </div>
              </div>

              {/* Apply button */}
              <div className="mt-5 flex justify-end">
                <button
                  onClick={handleApplyFilter}
                  disabled={filterLoading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #800080, #b300b3)' }}
                >
                  {filterLoading ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Applying...</>
                  ) : (
                    <><Search className="w-4 h-4" /> Apply Filters</>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Tab content ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={wrapV}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }}
          className="space-y-8"
        >

          {/* ── Metric cards ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Total Cost — accent card */}
            <motion.div variants={itemV} className="relative overflow-hidden group rounded-[2rem] p-6 text-white shadow-xl"
              style={{ background: 'linear-gradient(135deg, #800080, #b300b3)', boxShadow: '0 12px 32px rgba(128,0,128,0.3)' }}>
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.1), transparent 60%)' }}
              />
              <div className="relative z-10">
                <div className="p-3 bg-white/20 w-fit rounded-2xl mb-4 backdrop-blur-md">
                  <DollarSign className="w-5 h-5" />
                </div>
                <p className="text-pink-100 text-xs font-bold uppercase tracking-wider opacity-80">Total Cost (USD)</p>
                <h3 className="text-3xl font-bold mt-1 tabular-nums">
                  $<AnimatedNumber value={totals.total_cost_usd} decimals={4} duration={1.8} resetKey={rk} />
                </h3>
                <div className="mt-4 flex items-center gap-2 text-[10px] text-pink-200 bg-white/10 w-fit px-2 py-1 rounded-lg">
                  <BarChart3 className="w-3 h-3" />
                  <span>{activeTab === 'interview' ? 'Live API Billing' : 'Static Data'}</span>
                </div>
              </div>
            </motion.div>

            {/* Total Requests */}
            <motion.div variants={itemV} className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="p-3 w-fit rounded-2xl mb-4" style={{ background: '#fff0ff' }}>
                <Activity className="w-5 h-5" style={{ color: '#800080' }} />
              </div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Requests</p>
              <h3 className="text-3xl font-bold mt-1 text-gray-900 tabular-nums">
                <AnimatedNumber value={totals.total_requests} duration={1.4} resetKey={rk} />
              </h3>
              <p className="mt-2 text-[10px] font-bold uppercase" style={{ color: '#800080' }}>Successful Calls</p>
            </motion.div>

            {/* Total Tokens */}
            <motion.div variants={itemV} className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="p-3 w-fit rounded-2xl mb-4" style={{ background: '#fff0ff' }}>
                <Zap className="w-5 h-5" style={{ color: '#800080' }} />
              </div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Tokens</p>
              <h3 className="text-3xl font-bold mt-1 text-gray-900 tabular-nums">
                <AnimatedNumber value={totals.total_tokens} duration={1.6} resetKey={rk} />
              </h3>
              <div className="mt-4 flex gap-1 h-1.5 rounded-full overflow-hidden">
                <motion.div key={`inp-${rk}`} initial={{ flex: 0 }} animate={{ flex: inputPct }}
                  transition={{ duration: 1.3, delay: 0.4, ease: 'easeOut' }}
                  style={{ background: '#800080' }} className="rounded-full" />
                <motion.div key={`out-${rk}`} initial={{ flex: 0 }} animate={{ flex: outputPct }}
                  transition={{ duration: 1.3, delay: 0.4, ease: 'easeOut' }}
                  className="bg-gray-200 rounded-full" />
              </div>
            </motion.div>

            {/* Avg Cost */}
            <motion.div variants={itemV} className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="p-3 w-fit rounded-2xl mb-4" style={{ background: '#fff0ff' }}>
                <BarChart3 className="w-5 h-5" style={{ color: '#800080' }} />
              </div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Avg. Cost / Req</p>
              <h3 className="text-3xl font-bold mt-1 text-gray-900 tabular-nums">
                $<AnimatedNumber value={avgCost} decimals={5} duration={1.8} resetKey={rk} />
              </h3>
              <p className="mt-2 text-[10px] font-bold uppercase" style={{ color: '#800080' }}>Efficiency Index</p>
            </motion.div>
          </div>

          {/* ── Breakdown section ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Input vs Output */}
            <motion.div variants={itemV} className="lg:col-span-1">
              <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm h-full">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 rounded-xl" style={{ background: '#fff0ff' }}>
                    <ArrowRightLeft className="w-5 h-5" style={{ color: '#800080' }} />
                  </div>
                  <h2 className="font-bold text-xl text-gray-900">Input vs Output</h2>
                </div>

                <div className="space-y-8">
                  {/* Input */}
                  <div>
                    <div className="flex justify-between items-end mb-3">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Input Tokens</p>
                        <p className="text-2xl font-bold text-gray-900 tabular-nums">
                          <AnimatedNumber value={totals.total_input_tokens} duration={1.5} resetKey={rk} />
                        </p>
                      </div>
                      <p className="text-sm font-bold tabular-nums" style={{ color: '#800080' }}>
                        $<AnimatedNumber value={totals.total_input_cost_usd} decimals={5} duration={1.8} resetKey={rk} />
                      </p>
                    </div>
                    <AnimatedBar percent={inputPct} colorFrom="#800080" colorTo="#b300b3" glow="rgba(128,0,128,0.3)" delay={0.3} resetKey={`inp-bar-${rk}`} />
                    <p className="text-[10px] font-semibold mt-1.5 text-right" style={{ color: '#b300b3' }}>{inputPct.toFixed(1)}% of total</p>
                  </div>

                  {/* Output */}
                  <div>
                    <div className="flex justify-between items-end mb-3">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Output Tokens</p>
                        <p className="text-2xl font-bold text-gray-900 tabular-nums">
                          <AnimatedNumber value={totals.total_output_tokens} duration={1.5} resetKey={rk} />
                        </p>
                      </div>
                      <p className="text-sm font-bold tabular-nums" style={{ color: '#800080' }}>
                        $<AnimatedNumber value={totals.total_output_cost_usd} decimals={5} duration={1.8} resetKey={rk} />
                      </p>
                    </div>
                    <AnimatedBar percent={outputPct} colorFrom="#c04cc0" colorTo="#e680e6" glow="rgba(192,76,192,0.25)" delay={0.5} resetKey={`out-bar-${rk}`} />
                    <p className="text-[10px] font-semibold mt-1.5 text-right" style={{ color: '#b300b3' }}>{outputPct.toFixed(1)}% of total</p>
                  </div>
                </div>

                <div className="mt-10 p-4 bg-gray-50 rounded-2xl flex items-start gap-3">
                  <Info className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Input tokens consist of prompts and system messages. Output tokens are generated responses.
                    Costs are calculated based on current OpenAI model pricing.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Usage table */}
            <motion.div variants={itemV} className="lg:col-span-2">
              <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm h-full">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 rounded-xl" style={{ background: '#fff0ff' }}>
                    <LayoutGrid className="w-5 h-5" style={{ color: '#800080' }} />
                  </div>
                  <h2 className="font-bold text-xl text-gray-900">
                    {activeTab === 'interview' ? 'Usage by AI Service' : 'Usage by Feature'}
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                          {activeTab === 'interview' ? 'AI Service' : 'Feature'}
                        </th>
                        <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Requests</th>
                        <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Tokens</th>
                        <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Cost (USD)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {Object.entries(byEndpoint).map(([key, stats], idx) => (
                        <motion.tr
                          key={`${activeTab}-${key}`}
                          initial={{ opacity: 0, x: -14 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + idx * 0.1, duration: 0.35, ease: 'easeOut' }}
                          className="group transition-colors"
                          style={{ '--hover-bg': '#fff0ff' } as React.CSSProperties}
                          onMouseEnter={e => (e.currentTarget.style.background = '#fff0ff')}
                          onMouseLeave={e => (e.currentTarget.style.background = '')}
                        >
                          <td className="py-5 pr-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold"
                                style={{ background: '#fff0ff', color: '#800080' }}>
                                {idx + 1}
                              </div>
                              <span className="text-sm font-semibold text-gray-700 truncate max-w-[200px]" title={key}>
                                {key.replace(/_/g, ' ')}
                              </span>
                            </div>
                          </td>
                          <td className="py-5 text-center">
                            <span className="text-sm font-bold text-gray-900 tabular-nums">
                              <AnimatedNumber value={stats.requests} duration={1.2} resetKey={rk} />
                            </span>
                          </td>
                          <td className="py-5 text-center">
                            <span className="text-sm font-bold text-gray-600 tabular-nums">
                              <AnimatedNumber value={stats.total_tokens} duration={1.4} resetKey={rk} />
                            </span>
                          </td>
                          <td className="py-5 text-right">
                            <div className="flex items-center justify-end gap-1 font-bold" style={{ color: '#800080' }}>
                              <DollarSign className="w-3 h-3" />
                              <span className="text-sm tabular-nums">
                                <AnimatedNumber value={stats.total_cost_usd} decimals={4} duration={1.6} resetKey={rk} />
                              </span>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                      {Object.keys(byEndpoint).length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-12 text-center">
                            <div className="flex flex-col items-center gap-2 opacity-30">
                              <BarChart3 className="w-12 h-12" />
                              <p className="text-sm font-medium">No data available</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </div>

        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default GptCost;
