import React, { useEffect, useState } from 'react';
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
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SummaryData {
  success: boolean;
  filters: {
    user_id: string | null;
    start_date: string | null;
    end_date: string | null;
    endpoint: string | null;
  };
  totals: {
    total_requests: number;
    total_input_tokens: number;
    total_output_tokens: number;
    total_tokens: number;
    total_input_cost_usd: number;
    total_output_cost_usd: number;
    total_cost_usd: number;
  };
  by_endpoint: Record<string, {
    requests: number;
    tokens: number;
    cost_usd: number;
  }>;
}

const GptCost = () => {
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
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50/50">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin" />
          <Brain className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-600 w-6 h-6 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-6 max-w-7xl mx-auto space-y-8"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-800">
            GPT Usage Analytics
          </h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Detailed breakdown of API expenditure and token consumption
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-100 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Real-time Sync
        </div>
      </motion.div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Cost */}
        <motion.div variants={itemVariants} className="relative overflow-hidden group bg-gradient-to-br from-purple-600 to-indigo-700 rounded-[2rem] p-6 text-white shadow-xl shadow-purple-200/50">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
          <div className="relative z-10">
            <div className="p-3 bg-white/20 w-fit rounded-2xl mb-4 backdrop-blur-md">
              <DollarSign className="w-5 h-5" />
            </div>
            <p className="text-purple-100 text-xs font-bold uppercase tracking-wider opacity-80">Total Cost (USD)</p>
            <h3 className="text-3xl font-bold mt-1 tracking-tight">
              ${data?.totals.total_cost_usd.toFixed(4) || '0.0000'}
            </h3>
            <div className="mt-4 flex items-center gap-2 text-[10px] text-purple-200 bg-white/5 w-fit px-2 py-1 rounded-lg">
              <BarChart3 className="w-3 h-3" />
              <span>Live API Billing</span>
            </div>
          </div>
        </motion.div>

        {/* Total Requests */}
        <motion.div variants={itemVariants} className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="p-3 bg-blue-50 text-blue-600 w-fit rounded-2xl mb-4">
            <Activity className="w-5 h-5" />
          </div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Requests</p>
          <h3 className="text-3xl font-bold mt-1 text-gray-900">
            {data?.totals.total_requests.toLocaleString() || '0'}
          </h3>
          <p className="mt-2 text-[10px] text-blue-600 font-bold uppercase">Successful Calls</p>
        </motion.div>

        {/* Total Tokens */}
        <motion.div variants={itemVariants} className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="p-3 bg-amber-50 text-amber-600 w-fit rounded-2xl mb-4">
            <Zap className="w-5 h-5" />
          </div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Tokens</p>
          <h3 className="text-3xl font-bold mt-1 text-gray-900">
            {data?.totals.total_tokens.toLocaleString() || '0'}
          </h3>
          <div className="mt-4 flex gap-1 h-1">
            <div className="flex-[0.6] bg-amber-400 rounded-full" />
            <div className="flex-[0.4] bg-gray-100 rounded-full" />
          </div>
        </motion.div>

        {/* Average Cost */}
        <motion.div variants={itemVariants} className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="p-3 bg-emerald-50 text-emerald-600 w-fit rounded-2xl mb-4">
            <BarChart3 className="w-5 h-5" />
          </div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Avg. Cost/Req</p>
          <h3 className="text-3xl font-bold mt-1 text-gray-900">
            ${((data?.totals.total_cost_usd || 0) / (data?.totals.total_requests || 1)).toFixed(5)}
          </h3>
          <p className="mt-2 text-[10px] text-emerald-600 font-bold uppercase">Efficiency Index</p>
        </motion.div>
      </div>

      {/* Detailed Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Token Split */}
        <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-purple-50 rounded-xl text-purple-600">
                <ArrowRightLeft className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-xl text-gray-900">Input vs Output</h2>
            </div>

            <div className="space-y-8">
              {/* Input Tokens */}
              <div className="group">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Input Tokens</p>
                    <p className="text-2xl font-bold text-gray-900">{data?.totals.total_input_tokens.toLocaleString()}</p>
                  </div>
                  <p className="text-sm font-bold text-indigo-600">${data?.totals.total_input_cost_usd.toFixed(5)}</p>
                </div>
                <div className="h-3 w-full bg-gray-50 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(data?.totals.total_input_tokens || 0) / (data?.totals.total_tokens || 1) * 100}%` }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                  />
                </div>
              </div>

              {/* Output Tokens */}
              <div className="group">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Output Tokens</p>
                    <p className="text-2xl font-bold text-gray-900">{data?.totals.total_output_tokens.toLocaleString()}</p>
                  </div>
                  <p className="text-sm font-bold text-emerald-600">${data?.totals.total_output_cost_usd.toFixed(5)}</p>
                </div>
                <div className="h-3 w-full bg-gray-50 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(data?.totals.total_output_tokens || 0) / (data?.totals.total_tokens || 1) * 100}%` }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                  />
                </div>
              </div>
            </div>

            <div className="mt-10 p-4 bg-gray-50 rounded-2xl flex items-start gap-3">
              <Info className="w-4 h-4 text-gray-400 mt-0.5" />
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Input tokens consist of prompts and system messages. Output tokens are generated responses. 
                Costs are calculated based on current OpenAI model pricing.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Endpoints Table */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm h-full">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                  <LayoutGrid className="w-5 h-5" />
                </div>
                <h2 className="font-bold text-xl text-gray-900">Usage by Endpoint</h2>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Endpoint Path</th>
                    <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Requests</th>
                    <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Tokens</th>
                    <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Cost (USD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {Object.entries(data?.by_endpoint || {}).map(([path, stats], idx) => (
                    <tr key={path} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="py-5 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                            {idx + 1}
                          </div>
                          <span className="text-sm font-semibold text-gray-700 truncate max-w-[200px]" title={path}>
                            {path}
                          </span>
                        </div>
                      </td>
                      <td className="py-5 text-center">
                        <span className="text-sm font-bold text-gray-900">{stats.requests.toLocaleString()}</span>
                      </td>
                      <td className="py-5 text-center">
                        <span className="text-sm font-bold text-gray-600">{stats.tokens.toLocaleString()}</span>
                      </td>
                      <td className="py-5 text-right">
                        <div className="flex items-center justify-end gap-1 text-emerald-600 font-bold">
                          <DollarSign className="w-3 h-3" />
                          <span className="text-sm">{stats.cost_usd.toFixed(4)}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {Object.keys(data?.by_endpoint || {}).length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-12 text-center">
                        <div className="flex flex-col items-center gap-2 opacity-30">
                          <BarChart3 className="w-12 h-12" />
                          <p className="text-sm font-medium">No endpoint data available</p>
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
  );
};

export default GptCost;
