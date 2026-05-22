import React, { useRef } from 'react';
import { Dialog, DialogContent } from "../../components/ui/Dialog";
import { Mail, Phone, Calendar, Download, ChevronDown } from "lucide-react";

export default function ReportPdfModal({ open, setOpen, analysisData, jobData }) {
  const contentRef = useRef(null);

  const handlePrint = () => {
    window.print();
  };

  if (!open) return null;

  // Safe data extraction
  const candidateName = analysisData?.candidateName || "Candidate Name";
  const candidateEmail = analysisData?.candidateEmail || "email@example.com";
  const candidatePhone = analysisData?.candidatePhone || "N/A";
  const interviewDate = analysisData?.interviewDate || new Date().toISOString().split('T')[0];
  const duration = analysisData?.duration || "0m 0s";
  const interviewLink = analysisData?.interviewLink || "";
  const videoLink = analysisData?.videoLink || "";
  const transcriptLink = analysisData?.transcriptionLink || "";
  const score = analysisData?.score || 0;
  
  const mandatorySkills = jobData?.mandatorySkills || [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent 
        className="p-0 overflow-y-auto bg-gray-100 flex flex-col hide-scrollbar print:static print:w-full print:h-auto print:max-w-none print:overflow-visible print:transform-none print:p-0 print:m-0 print:shadow-none print:border-none" 
        style={{ maxWidth: '1000px', width: '95vw', height: '90vh', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          @media print {
            @page { size: A4 portrait; margin: 10mm; }
            body { 
              -webkit-print-color-adjust: exact !important; 
              print-color-adjust: exact !important; 
              background: white !important;
            }
            /* Hide EVERYTHING except the dialog */
            body * {
              visibility: hidden;
            }
            [role="dialog"], [role="dialog"] * {
              visibility: visible;
            }
            [role="dialog"] {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              height: auto !important;
              max-height: none !important;
              overflow: visible !important;
              transform: none !important;
              padding: 0 !important;
              border: none !important;
              background: white !important;
              box-shadow: none !important;
            }
          }
        `}</style>

        {/* Toolbar (Sticky) */}
        <div className="sticky top-0 z-50 flex justify-between items-center bg-white border-b px-6 py-3 shadow-sm print:hidden flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-800">Report Preview</h2>
          <div className="flex gap-3">
            <button onClick={() => setOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              Close
            </button>
            <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#800080] hover:bg-[#660066] rounded-lg shadow-sm transition-colors">
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>

        {/* PDF CONTENT CONTAINER */}
        <div className="flex-1 overflow-auto flex justify-center py-8 bg-gray-200 print:py-0 print:bg-white print:block print:overflow-visible hide-scrollbar">
          
          {/* THE "A4" PAGE - Using h-max and flex-col to perfectly wrap any number of skills */}
          <div ref={contentRef} className="bg-white w-[800px] min-h-[1123px] h-max shadow-2xl p-10 flex flex-col print:shadow-none print:w-full print:max-w-none print:h-auto print:m-0 print:p-0 print:break-after-auto mx-auto shrink-0">
            
            {/* HEADER CARD */}
            <div className="mb-6 relative rounded-2xl overflow-hidden shadow-sm text-white print:break-inside-avoid print:shadow-none shrink-0" style={{ backgroundColor: '#800080' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-[#6b006b] via-[#8a008a] to-[#b300b3]"></div>
              <div className="relative p-8 flex justify-between items-start">
                <div className="max-w-[70%]">
                  <p className="text-xs font-semibold tracking-widest text-purple-200 uppercase mb-4">
                    Interview Analysis Report
                  </p>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-pink-400"></div>
                    <span className="text-sm font-medium">InterviewFold</span>
                  </div>
                  
                  <h1 className="text-4xl font-serif mb-6 tracking-tight capitalize truncate" title={candidateName}>{candidateName}</h1>
                  
                  <div className="flex flex-wrap items-center gap-5 text-sm text-purple-100">
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="w-4 h-4 flex-shrink-0" /> <span className="truncate">{candidateEmail}</span>
                    </div>
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <Phone className="w-4 h-4 flex-shrink-0" /> {candidatePhone}
                    </div>
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <Calendar className="w-4 h-4 flex-shrink-0" /> {interviewDate}
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-center border border-white/20 min-w-[120px] flex-shrink-0">
                  <p className="text-xs font-medium text-purple-200 uppercase tracking-widest mb-1">Score</p>
                  <div className="text-4xl font-bold mb-1">{score}</div>
                  <div className="text-purple-200 text-xs">/ 100</div>
                </div>
              </div>
            </div>

            {/* TWO COLUMNS */}
            <div className="mb-6 grid grid-cols-2 gap-6 print:break-inside-avoid shrink-0">
              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-300 print:shadow-none print:border-gray-400">
                <h3 className="text-xs font-semibold text-gray-500 tracking-widest uppercase mb-6">Candidate Details</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <span className="text-sm text-gray-500 whitespace-nowrap mr-4">Full Name</span>
                    <span className="text-sm font-semibold text-gray-900 truncate text-right">{candidateName}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <span className="text-sm text-gray-500 whitespace-nowrap mr-4">Email</span>
                    <span className="text-sm font-semibold text-gray-900 truncate text-right">{candidateEmail}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 whitespace-nowrap mr-4">Phone</span>
                    <span className="text-sm font-semibold text-gray-900 whitespace-nowrap text-right">{candidatePhone}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-300 print:shadow-none print:border-gray-400">
                <h3 className="text-xs font-semibold text-gray-500 tracking-widest uppercase mb-6">Session Info</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <span className="text-sm text-gray-500 whitespace-nowrap mr-4">Date</span>
                    <span className="text-sm font-semibold text-gray-900 whitespace-nowrap text-right">{interviewDate}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <span className="text-sm text-gray-500 whitespace-nowrap mr-4">Duration</span>
                    <span className="text-sm font-semibold text-gray-900 whitespace-nowrap text-right">{duration}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 whitespace-nowrap mr-4">Status</span>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-bold border border-amber-200 whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      Pending Score
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* LINKS & RESOURCES */}
            <div className="mb-6 bg-white rounded-2xl p-6 shadow-md border border-gray-300 print:break-inside-avoid print:shadow-none print:border-gray-400 shrink-0">
              <h3 className="text-xs font-semibold text-gray-500 tracking-widest uppercase mb-6">Links & Resources</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <span className="text-sm text-gray-500 whitespace-nowrap mr-4">Interview Link</span>
                  <a href={interviewLink} target="_blank" rel="noreferrer" className="text-sm font-semibold text-[#800080] hover:underline truncate max-w-[400px] text-right">
                    {interviewLink || "Not Available"}
                  </a>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <span className="text-sm text-gray-500 whitespace-nowrap mr-4">Video Recording</span>
                  <a href={videoLink ? `${import.meta.env.VITE_MAIN_API_URL}${videoLink}` : "#"} target="_blank" rel="noreferrer" className="text-sm font-semibold text-[#800080] hover:underline truncate max-w-[400px] text-right">
                    {videoLink ? `${import.meta.env.VITE_MAIN_API_URL}${videoLink}` : "Not Available"}
                  </a>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 whitespace-nowrap mr-4">Transcript</span>
                  <a href={transcriptLink ? `${import.meta.env.VITE_MAIN_API_URL}${transcriptLink}` : "#"} target="_blank" rel="noreferrer" className="text-sm font-semibold text-[#800080] hover:underline truncate max-w-[400px] text-right">
                    {transcriptLink ? `${import.meta.env.VITE_MAIN_API_URL}${transcriptLink}` : "Not Available"}
                  </a>
                </div>
              </div>
            </div>

            {/* CATEGORY SCORES */}
            <div className="mb-6 print:break-inside-avoid pt-4 shrink-0">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-lg font-bold text-gray-900">Category Scores</h2>
                <span className="px-2.5 py-1 rounded-full bg-fuchsia-50 text-fuchsia-600 border border-fuchsia-200 text-[10px] font-bold tracking-widest uppercase">
                  5 CATEGORIES
                </span>
              </div>
              
              <div className="grid grid-cols-5 gap-4">
                {[
                  { name: "Technical Area", color: "emerald" },
                  { name: "Communication Skills", color: "emerald" },
                  { name: "Project Experience", color: "amber" },
                  { name: "Behavioral Fit", color: "emerald" },
                  { name: "Critical Thinking", color: "amber" },
                ].map((cat, i) => (
                  <div key={i} className={`bg-white rounded-xl p-4 text-center border border-gray-300 shadow-md border-t-4 print:border-gray-400 print:shadow-none print:border-t-4 ${cat.color === 'emerald' ? 'border-t-emerald-500 print:border-t-emerald-500' : 'border-t-amber-500 print:border-t-amber-500'}`}>
                    <div className={`text-4xl font-normal mb-3 mt-1 ${cat.color === 'emerald' ? 'text-emerald-600' : 'text-amber-600'}`}>0</div>
                    <div className="w-full h-px bg-gray-200 mb-3"></div>
                    <div className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest mx-auto leading-tight">
                      {cat.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* MUST HAVE SKILLS */}
            <div className="mb-6 print:break-inside-avoid pt-2 shrink-0">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-lg font-bold text-gray-900">Must Have Skills</h2>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-bold tracking-widest">
                  {mandatorySkills.length} SKILLS
                </span>
              </div>
              
              <div className="space-y-4">
                {mandatorySkills.map((skill, idx) => {
                  const colors = [
                    { bg: "bg-emerald-500", border: "border-l-emerald-500", text: "text-emerald-600" },
                    { bg: "bg-amber-500", border: "border-l-amber-500", text: "text-amber-600" },
                    { bg: "bg-[#800080]", border: "border-l-[#800080]", text: "text-[#800080]" },
                    { bg: "bg-red-500", border: "border-l-red-500", text: "text-red-600" },
                  ];
                  const c = colors[idx % colors.length];
                  const skillScore = 0; // default score
                  const level = "N/A"; // default level

                  return (
                    <div key={skill.id || idx} className={`bg-white rounded-xl p-5 shadow-md border border-gray-300 border-l-4 print:shadow-none print:border-gray-400 ${c.border}`}>
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-bold text-gray-900 capitalize truncate pr-4">{skill.skillName}</h4>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs text-gray-500 italic font-medium">{level}</span>
                          <span className={`text-sm font-bold ${c.text}`}>{skillScore}/100</span>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full ${c.bg}`} style={{ width: `${skillScore}%` }}></div>
                      </div>
                    </div>
                  );
                })}
                
                {mandatorySkills.length === 0 && (
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300 shadow-inner">
                    No mandatory skills defined for this job.
                  </div>
                )}
              </div>
            </div>

            {/* TOP STRENGTHS & AREAS FOR IMPROVEMENT */}
            <div className="mb-6 grid grid-cols-2 gap-6 print:break-inside-avoid shrink-0 pt-2">
              <div className="flex flex-col h-full">
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  Top Strengths <span className="bg-gray-100 border border-gray-300 text-gray-600 px-2 py-0.5 rounded-full text-[10px]">0</span>
                </h3>
                <div className="bg-emerald-50/50 flex-1 border border-emerald-300 rounded-xl p-8 flex flex-col items-center justify-center text-center border-dashed shadow-sm">
                  <p className="text-sm font-bold text-emerald-700">No data found</p>
                  <p className="text-xs text-emerald-600/80 mt-1 max-w-[200px] font-medium">Strengths will be populated once AI qualitative analysis is complete.</p>
                </div>
              </div>

              <div className="flex flex-col h-full">
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  Areas for Improvement <span className="bg-gray-100 border border-gray-300 text-gray-600 px-2 py-0.5 rounded-full text-[10px]">0</span>
                </h3>
                <div className="bg-rose-50/50 flex-1 border border-rose-300 rounded-xl p-8 flex flex-col items-center justify-center text-center border-dashed shadow-sm">
                  <p className="text-sm font-bold text-rose-700">No data found</p>
                  <p className="text-xs text-rose-600/80 mt-1 max-w-[200px] font-medium">Improvement areas will be populated once AI qualitative analysis is complete.</p>
                </div>
              </div>
            </div>

            {/* INTERVIEW QUESTIONS & RESPONSES */}
            <div className="mb-6 print:break-inside-avoid shrink-0 pt-4">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                Interview Questions & Responses <span className="bg-gray-100 border border-gray-300 text-gray-600 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider">0 QUESTIONS</span>
              </h3>
              <div className="bg-gray-50 border border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center text-center border-dashed shadow-sm">
                <p className="text-sm font-bold text-gray-600">No questions found</p>
                <p className="text-xs text-gray-500 mt-1 font-medium">Detailed Q&A transcript data is currently unavailable for this session.</p>
              </div>
            </div>

            {/* CODING ROUND */}
            <div className="mb-6 print:break-inside-avoid shrink-0 pt-4 pb-8">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-sm font-bold text-gray-900">Coding Round</h3>
                <span className="bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider">LIVE ASSESSMENT</span>
              </div>
              <div className="bg-[#1e1e2e] border border-gray-800 rounded-xl p-12 text-center shadow-inner relative overflow-hidden print:bg-gray-50 print:border-gray-200 print:shadow-none">
                {/* Mac window dots */}
                <div className="absolute top-4 left-4 flex gap-1.5 print:hidden">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                </div>
                
                <div className="flex flex-col items-center justify-center pt-2">
                  <p className="text-sm font-medium text-gray-400 font-mono print:text-gray-500">No coding assessment found</p>
                  <p className="text-xs text-gray-500/60 mt-2 font-mono print:text-gray-400">// The candidate did not participate in a coding round.</p>
                </div>
              </div>
            </div>

            {/* FOOTER - mt-auto pushes it to the absolute bottom of the A4 page */}
            <div className="mt-auto pt-10 pb-4 text-center text-xs text-gray-400 flex flex-col items-center gap-2 print:pb-4 border-t border-gray-100 shrink-0">
              <p>✦ <span className="font-bold text-[#800080]">InterviewFold</span> — AI-powered hiring intelligence</p>
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
