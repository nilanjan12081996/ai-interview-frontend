import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Brain, Activity, Zap, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GptCostSummaryProps {
  sidebarOpen: boolean;
}

interface SummaryData {
  totals: {
    total_requests: number;
    total_cost_usd: number;
    total_tokens: number;
  };
}

const GptCostSummary: React.FC<GptCostSummaryProps> = ({ sidebarOpen }) => {
  const [data, setData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://aiinterviewpythonmain.bestworks.cloud/api/v1/gpt-cost/summary');
        if (response.data.success) {
          setData(response.data);
        }
      } catch (error) {
        console.error('Error fetching GPT cost summary:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return (
      <div className="px-2 py-4">
        <div className={`h-24 bg-gray-100 rounded-xl animate-pulse ${!sidebarOpen ? 'w-10 h-10' : ''}`} />
      </div>
    );
  }

  return (
    <div className="px-2 py-4">
      <AnimatePresence mode="wait">
        {sidebarOpen ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-xl bg-gradient-to-br from-[#800080] to-[#4b0082] p-4 text-white shadow-md overflow-hidden relative group"
          >
            {/* Decorative background circle */}
            <div className="absolute -right-2 -top-2 w-12 h-12 bg-white/10 rounded-full blur-xl group-hover:scale-125 transition-transform duration-700" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-white/20 rounded-lg">
                  <Brain className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">AI Usage Cost</span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] opacity-60 uppercase font-medium">Total Expenditure</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold font-mono tracking-tight">
                      ${data?.totals.total_cost_usd.toFixed(5) || '0.00000'}
                    </span>
                    <span className="text-[10px] opacity-50">USD</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white/10 rounded-lg p-2 backdrop-blur-sm border border-white/5">
                    <p className="text-[9px] opacity-60 mb-0.5">Calls</p>
                    <div className="flex items-center gap-1">
                      <Activity className="w-3 h-3 opacity-60" />
                      <span className="text-xs font-bold">{data?.totals.total_requests || 0}</span>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-2 backdrop-blur-sm border border-white/5">
                    <p className="text-[9px] opacity-60 mb-0.5">Tokens</p>
                    <div className="flex items-center gap-1">
                      <Zap className="w-3 h-3 opacity-60" />
                      <span className="text-xs font-bold">
                        {data?.totals.total_tokens > 9999 ? `${(data.totals.total_tokens / 1000).toFixed(1)}k` : data?.totals.total_tokens || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex flex-col items-center py-2"
          >
            <div 
              className="p-2 bg-purple-50 rounded-lg text-[#800080] border border-purple-100 hover:bg-purple-100 transition-colors cursor-help" 
              title={`Total Cost: $${data?.totals.total_cost_usd.toFixed(5)}`}
            >
               <DollarSign className="w-5 h-5" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GptCostSummary;
