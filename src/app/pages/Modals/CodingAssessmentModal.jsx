
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/Dialog";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Code, Lightbulb, ClipboardList, Timer, Cpu, BookOpen, AlertCircle } from "lucide-react";

const CodingAssessmentModal = ({ open, setOpen, codingData }) => {
  if (!codingData) return null;

  let data = {};
  try {
    data = typeof codingData === 'string' ? JSON.parse(codingData) : codingData;
  } catch (e) {
    console.error("Failed to parse coding data", e);
    return null;
  }

  const questions = data.questions || [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[1000px] w-[95vw] bg-white max-h-[90vh] overflow-hidden flex flex-col p-0 border-none shadow-2xl rounded-2xl">
        <DialogHeader className="p-6 bg-slate-50/80 backdrop-blur-md border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-violet-100 rounded-xl">
                <Code className="text-violet-600 w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-slate-800">
                  Coding Assessment
                </DialogTitle>
                <p className="text-sm text-slate-500 mt-0.5">Review assignment details and problem sets</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {data.totalInterviewTimeMinutes && (
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-200/50 rounded-xl text-slate-700 text-sm font-semibold">
                  <Timer className="w-4 h-4 text-slate-500" />
                  {data.totalInterviewTimeMinutes} mins
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 bg-white custom-scrollbar">
          {questions.length > 0 ? (
            <Tabs defaultValue="q-0" className="w-full">
              <TabsList className="mb-8 bg-slate-100/80 p-1.5 rounded-2xl w-full justify-start overflow-x-auto scrollbar-hide flex-nowrap border border-slate-200/50">
                {questions.map((q, idx) => (
                  <TabsTrigger 
                    key={idx} 
                    value={`q-${idx}`}
                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl data-[state=active]:bg-white data-[state=active]:text-violet-600 data-[state=active]:shadow-md transition-all text-sm font-bold border border-transparent data-[state=active]:border-slate-100"
                  >
                    Question {idx + 1}
                  </TabsTrigger>
                ))}
              </TabsList>

              {questions.map((q, idx) => (
                <TabsContent key={idx} value={`q-${idx}`} className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* Title and Badges */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-50 pb-8">
                    <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{q.title}</h3>
                    <div className="flex items-center gap-2">
                      <Badge className={`${
                        q.difficulty === 'ADVANCE' || q.difficulty === 'HARD' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                        q.difficulty === 'MEDIUM' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        'bg-emerald-50 text-emerald-600 border-emerald-100'
                      } px-4 py-1.5 rounded-full font-bold uppercase tracking-wider text-[10px] border shadow-sm`}>
                        {q.difficulty}
                      </Badge>
                      <Badge variant="outline" className="px-4 py-1.5 rounded-full text-slate-500 font-bold capitalize border-slate-200 bg-white shadow-sm">
                        {q.language}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left Column: Context */}
                    <div className="lg:col-span-7 space-y-8">
                      <section className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100/80 shadow-inner">
                        <h4 className="text-[11px] font-black text-slate-400 mb-4 flex items-center gap-2 uppercase tracking-[0.2em]">
                          <BookOpen className="w-4 h-4 text-violet-500" />
                          Problem Statement
                        </h4>
                        <div className="text-slate-700 leading-relaxed text-base font-medium prose prose-slate">
                          {q.problemStatement}
                        </div>
                      </section>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm flex flex-col gap-2">
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Timer className="w-3.5 h-3.5 text-blue-500" />
                            Time Complexity
                          </h4>
                          <p className="text-sm font-mono font-bold text-slate-700 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                            {q.expectedTimeComplexity || 'N/A'}
                          </p>
                        </div>
                        <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm flex flex-col gap-2">
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Cpu className="w-3.5 h-3.5 text-emerald-500" />
                            Space Complexity
                          </h4>
                          <p className="text-sm font-mono font-bold text-slate-700 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                            {q.expectedSpaceComplexity || 'N/A'}
                          </p>
                        </div>
                      </div>

                      {q.constraints && q.constraints.length > 0 && (
                        <section className="px-2">
                          <h4 className="text-[11px] font-black text-slate-400 mb-4 flex items-center gap-2 uppercase tracking-[0.2em]">
                            Constraints
                          </h4>
                          <div className="grid grid-cols-1 gap-3">
                            {q.constraints.map((c, i) => (
                              <div key={i} className="flex items-center gap-3 px-4 py-3 bg-slate-50/50 rounded-2xl border border-slate-100/50 text-sm text-slate-600 font-medium">
                                <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                                {c}
                              </div>
                            ))}
                          </div>
                        </section>
                      )}
                    </div>

                    {/* Right Column: Code & Hints */}
                    <div className="lg:col-span-5 space-y-8">
                      <section className="bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-slate-800">
                        <div className="bg-slate-800 px-6 py-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Code className="w-4 h-4 text-violet-400" />
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.15em]">Starter Code</span>
                          </div>
                          <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                          </div>
                        </div>
                        <div className="p-8 overflow-x-auto bg-[#1e1e1e]">
                          <pre className="text-xs font-mono text-slate-300 leading-loose">
                            {q.starterCode}
                          </pre>
                        </div>
                      </section>

                      {q.hints && q.hints.length > 0 && (
                        <section className="bg-amber-50/40 p-6 rounded-[2.5rem] border border-amber-100/50 shadow-sm relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Lightbulb size={60} className="text-amber-500" />
                          </div>
                          <h4 className="text-[11px] font-black text-amber-700/60 mb-5 flex items-center gap-2 uppercase tracking-[0.2em]">
                            <Lightbulb className="w-4 h-4 text-amber-500" />
                            Hints
                          </h4>
                          <div className="space-y-4 relative z-10">
                            {q.hints.map((h, i) => (
                              <div key={i} className="text-xs text-amber-900 bg-white/80 p-4 rounded-2xl border border-amber-200/30 shadow-sm font-semibold leading-relaxed">
                                {h}
                              </div>
                            ))}
                          </div>
                        </section>
                      )}
                    </div>
                  </div>

                  {/* Test Cases */}
                  {q.testCases && q.testCases.length > 0 && (
                    <section className="pt-8 border-t border-slate-50">
                      <h4 className="text-[11px] font-black text-slate-400 mb-6 flex items-center gap-2 uppercase tracking-[0.2em]">
                        <ClipboardList className="w-4 h-4 text-violet-500" />
                        Test Cases
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {q.testCases.filter(tc => !tc.isHidden).map((tc, i) => (
                          <div key={i} className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:shadow-md hover:border-violet-200 transition-all group">
                            <div className="space-y-5">
                              <div>
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Input</span>
                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 font-mono text-[11px] text-slate-700 overflow-x-auto whitespace-pre group-hover:bg-violet-50/30 transition-colors">
                                  {tc.input}
                                </div>
                              </div>
                              <div>
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Output</span>
                                <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 font-mono text-[11px] text-emerald-700">
                                  {tc.expectedOutput}
                                </div>
                              </div>
                              {tc.explanation && (
                                <div className="pt-4 border-t border-slate-50 flex gap-2">
                                  <AlertCircle size={14} className="text-slate-300 shrink-0 mt-0.5" />
                                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">
                                    {tc.explanation}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="h-80 flex flex-col items-center justify-center text-slate-300">
              <div className="p-6 bg-slate-50 rounded-full mb-4">
                <Code size={48} className="opacity-20" />
              </div>
              <p className="font-bold text-lg text-slate-400">No Assessment Data</p>
              <p className="text-sm">There are no coding questions available for this candidate.</p>
            </div>
          )}
        </div>
      </DialogContent>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </Dialog>
  );
};

export default CodingAssessmentModal;
