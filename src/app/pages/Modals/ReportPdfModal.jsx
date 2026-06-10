import React, { useRef, useState } from 'react';
import { Dialog, DialogContent } from "../../components/ui/Dialog";
import { Mail, Phone, Calendar, Download, ChevronDown } from "lucide-react";

export default function ReportPdfModal({ open, setOpen, analysisData, jobData, codingAnswersData, codingData, finalResultData }) {
  const contentRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handlePrint = () => {
    window.print();
  };



  if (!open) return null;

  // Parse the new analysis string if available
  let parsedAnalysis = {};
  try {
    if (analysisData?.analysis) {
      const tempParsed = typeof analysisData.analysis === 'string' 
        ? JSON.parse(analysisData.analysis) 
        : analysisData.analysis;
        
      // Extract the nested 'analysis' object if it exists (handles nested JSON structure)
      parsedAnalysis = tempParsed?.analysis ? tempParsed.analysis : tempParsed;
    }
  } catch(e) {
    console.error("Failed to parse analysis JSON", e);
  }

  // Safe data extraction
  const candidateName = analysisData?.candidateName || "Candidate Name";
  const candidateEmail = analysisData?.candidateEmail || "email@example.com";
  const candidatePhone = analysisData?.candidatePhone || "N/A";
  const interviewDate = analysisData?.interviewDate || new Date().toISOString().split('T')[0];
  const duration = analysisData?.duration || "0m 0s";
  const interviewLink = analysisData?.interviewLink || "";
  const videoLink = analysisData?.videoLink || "";
  const transcriptLink = analysisData?.transcriptionLink || "";
  
  // Use finalResultData score if available, fallback to parsed analysis score
  const score = finalResultData?.final_interview?.score ?? (parsedAnalysis.overall_score || analysisData?.score || 0);
  
  const categoryScores = parsedAnalysis.category_scores;
  const mustToHaveSkills = parsedAnalysis.must_to_have_skills;
  const topStrengths = parsedAnalysis.top_strengths;
  const areasForImprovement = parsedAnalysis.areas_for_improvement;
  const interviewQuestionsResponses = parsedAnalysis.interview_questions_responses || [];
  const overallAiSummary = parsedAnalysis.overall_ai_summary || "";
  
  // Coding Round specific data
  const codingRoundResult = parsedAnalysis.coding_round_result;
  const codingAiEvaluation = parsedAnalysis.coding_ai_evaluation;

  let codingQuestions = [];
  let codingAnswers = [];
  try {
    const rawQuestionData = codingData || analysisData?.codingDTO?.questionData;
    if (rawQuestionData) {
      const parsedQuestionData = typeof rawQuestionData === 'string' ? JSON.parse(rawQuestionData) : rawQuestionData;
      codingQuestions = parsedQuestionData.questions || [];
    }
    if (codingAnswersData) {
      codingAnswers = typeof codingAnswersData === 'string' ? JSON.parse(codingAnswersData) : codingAnswersData;
    } else if (analysisData?.codingDTO?.answers) {
      codingAnswers = analysisData.codingDTO.answers || [];
    }
  } catch (err) {
    console.error("Failed to parse coding questions", err);
  }

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
            /* Hide the Radix UI auto-generated close (X) button.
               The button has no aria-label; target it by its absolute positioning class. */
            [role="dialog"] button.absolute {
              display: none !important;
              visibility: hidden !important;
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
            /* Preserve dark coding backgrounds */
            .coding-block {
              background-color: #1e1e2e !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .coding-header {
              background-color: #2d2d3f !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .coding-pre {
              background-color: #000000 !important;
              color: #d1d5db !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
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
            <button onClick={handlePrint} disabled={isDownloading} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#800080] hover:bg-[#660066] rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <Download className="w-4 h-4" />
              {isDownloading ? 'Generating...' : 'Download PDF'}
            </button>
          </div>
        </div>

        {/* PDF CONTENT CONTAINER */}
        <div className="flex-1 overflow-auto flex justify-center py-8 bg-gray-200 print:py-0 print:bg-white print:block print:overflow-visible hide-scrollbar">
          
          {/* THE "A4" PAGE - Using h-max and flex-col to perfectly wrap any number of skills */}
          <div id="pdf-content-wrapper" ref={contentRef} className="bg-white w-[800px] min-h-[1123px] h-max shadow-2xl p-10 flex flex-col print:shadow-none print:w-full print:max-w-none print:h-auto print:min-h-0 print:m-0 print:p-0 print:break-after-auto mx-auto shrink-0">
            
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
                    {finalResultData?.final_interview?.select_reject ? (
                      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border whitespace-nowrap ${
                        finalResultData.final_interview.select_reject === 'Select' 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                          : 'bg-red-50 text-red-600 border-red-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          finalResultData.final_interview.select_reject === 'Select' ? 'bg-emerald-500' : 'bg-red-500'
                        }`}></span>
                        {finalResultData.final_interview.select_reject}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-bold border border-amber-200 whitespace-nowrap">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        Pending Score
                      </span>
                    )}
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
                  <a href={interviewLink} target="_blank" rel="noreferrer" className="text-sm font-semibold text-[#800080] hover:underline break-all text-right">
                    {interviewLink || "Not Available"}
                  </a>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <span className="text-sm text-gray-500 whitespace-nowrap mr-4">Video Recording</span>
                  <a href={videoLink ? (videoLink.startsWith('http') ? videoLink : `${import.meta.env.VITE_MAIN_API_URL}${videoLink}`) : "#"} target="_blank" rel="noreferrer" className="text-sm font-semibold text-[#800080] hover:underline break-all text-right">
                    {videoLink ? (videoLink.startsWith('http') ? videoLink : `${import.meta.env.VITE_MAIN_API_URL}${videoLink}`) : "Not Available"}
                  </a>
                </div>
                <div className={`flex justify-between items-center ${codingQuestions.length > 0 ? 'border-b border-gray-100 pb-4' : ''}`}>
                  <span className="text-sm text-gray-500 whitespace-nowrap mr-4">Transcript</span>
                  <a href={transcriptLink ? (transcriptLink.startsWith('http') ? transcriptLink : `${import.meta.env.VITE_MAIN_API_URL}${transcriptLink}`) : "#"} target="_blank" rel="noreferrer" className="text-sm font-semibold text-[#800080] hover:underline break-all text-right">
                    {transcriptLink ? (transcriptLink.startsWith('http') ? transcriptLink : `${import.meta.env.VITE_MAIN_API_URL}${transcriptLink}`) : "Not Available"}
                  </a>
                </div>
                {codingQuestions.length > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 whitespace-nowrap mr-4">Coding Round Link</span>
                    <a href={`${window.location.origin}/coding-report/${interviewLink.split('/').pop()}`} target="_blank" rel="noreferrer" className="text-sm font-semibold text-[#800080] hover:underline break-all text-right">
                      {`${window.location.origin}/coding-report/${interviewLink.split('/').pop()}`}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* FINAL ASSESSMENT SUMMARY */}
            {finalResultData && (() => {
              const hasAI = !!finalResultData.ai_interview;
              const hasCoding = !!finalResultData.coding_round_available;
              const numRounds = (hasAI ? 1 : 0) + (hasCoding ? 1 : 0);

              if (numRounds === 0) return null;

              return (
                <div className="mb-6 bg-white rounded-2xl p-6 shadow-md border border-gray-300 print:break-inside-avoid print:shadow-none print:border-gray-400 shrink-0">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest">
                      {numRounds === 1 ? "ROUND" : "Round-by-Round Breakdown"}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      finalResultData.final_interview?.select_reject === 'Select' 
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                        : 'bg-red-100 text-red-700 border-red-200'
                    } border`}>
                      Final Status: {finalResultData.final_interview?.select_reject || 'Pending'}
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className={`grid grid-cols-1 ${numRounds === 1 ? '' : 'md:grid-cols-2'} gap-4`}>
                      {/* AI Interview */}
                      {hasAI && (
                        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">AI Interview</span>
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full w-fit ${
                                finalResultData.ai_interview?.select_reject === 'Select' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'
                              }`}>
                                {finalResultData.ai_interview?.select_reject || 'N/A'}
                              </span>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="text-xs text-gray-400 font-medium uppercase">Score</span>
                              <span className="text-lg font-bold text-gray-900">{finalResultData.ai_interview?.score || 0}<span className="text-sm text-gray-400">/100</span></span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 mt-2 leading-relaxed whitespace-pre-wrap">
                            {finalResultData.ai_interview?.reason}
                          </p>
                        </div>
                      )}

                    {/* Coding Interview */}
                    {finalResultData.coding_round_available && (
                      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Coding Interview</span>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full w-fit ${
                              finalResultData.coding_interview?.select_reject === 'Select' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'
                            }`}>
                              {finalResultData.coding_interview?.select_reject || 'N/A'}
                            </span>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-xs text-gray-400 font-medium uppercase">Score</span>
                            <span className="text-lg font-bold text-gray-900">{finalResultData.coding_interview?.score || 0}<span className="text-sm text-gray-400">/100</span></span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mt-2 leading-relaxed whitespace-pre-wrap">
                          {finalResultData.coding_interview?.reason}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
            })()}

            {/* OVERALL AI SUMMARY */}
            {overallAiSummary && (
              <div className="mb-6 bg-[#fcf9ff] border border-purple-200 rounded-2xl p-6 shadow-sm print:break-inside-avoid print:shadow-none pt-4 shrink-0">
                <h3 className="text-xs font-semibold text-[#800080] tracking-widest uppercase mb-3">AI Executive Summary</h3>
                <p className="text-sm text-gray-700 leading-relaxed italic">{overallAiSummary}</p>
              </div>
            )}

            {/* CATEGORY SCORES */}
            {categoryScores && (
              <div className="mb-6 print:break-inside-avoid pt-4 shrink-0">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-lg font-bold text-gray-900">Category Scores</h2>
                  <span className="px-2.5 py-1 rounded-full bg-fuchsia-50 text-fuchsia-600 border border-fuchsia-200 text-[10px] font-bold tracking-widest uppercase">
                    5 CATEGORIES
                  </span>
                </div>
                
                <div className="grid grid-cols-5 gap-4">
                  {[
                    { name: "Technical Area", key: "technical_area", color: "emerald" },
                    { name: "Communication Skills", key: "communication_skills", color: "emerald" },
                    { name: "Project Experience", key: "project_experience", color: "amber" },
                    { name: "Behavioral Fit", key: "behavioral_fit", color: "emerald" },
                    { name: "Critical Thinking", key: "critical_thinking", color: "amber" },
                  ].map((cat, i) => (
                    <div key={i} className={`bg-white rounded-xl p-4 text-center border border-gray-300 shadow-md border-t-4 print:border-gray-400 print:shadow-none print:border-t-4 ${cat.color === 'emerald' ? 'border-t-emerald-500 print:border-t-emerald-500' : 'border-t-amber-500 print:border-t-amber-500'}`}>
                      <div className={`text-4xl font-normal mb-3 mt-1 ${cat.color === 'emerald' ? 'text-emerald-600' : 'text-amber-600'}`}>{categoryScores[cat.key] || 0}</div>
                      <div className="w-full h-px bg-gray-200 mb-3"></div>
                      <div className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest mx-auto leading-tight">
                        {cat.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CODING EVALUATION SCORES */}
            {(codingRoundResult || codingAiEvaluation) && (
              <div className="mb-6 print:break-inside-avoid pt-4 shrink-0">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-lg font-bold text-gray-900">Coding Metrics</h2>
                  <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-200 text-[10px] font-bold tracking-widest uppercase">
                    5 METRICS
                  </span>
                </div>
                
                <div className="grid grid-cols-5 gap-4">
                  {[
                    { name: "Technical", key: "technical_score", color: "emerald" },
                    { name: "Problem Solving", key: "problem_solving_score", color: "amber" },
                    { name: "Code Quality", key: "code_quality_score", color: "emerald" },
                    { name: "Test Cases", key: "test_case_score", color: "amber" },
                    { name: "Complexity", key: "complexity_score", color: "emerald" },
                  ].map((cat, i) => {
                    let scoreValue = codingAiEvaluation?.[cat.key] ?? codingRoundResult?.[cat.key] ?? 0;
                    return (
                      <div key={i} className={`bg-white rounded-xl p-4 text-center border border-gray-300 shadow-md border-t-4 print:border-gray-400 print:shadow-none print:border-t-4 ${cat.color === 'emerald' ? 'border-t-emerald-500 print:border-t-emerald-500' : 'border-t-amber-500 print:border-t-amber-500'}`}>
                        <div className={`text-4xl font-normal mb-3 mt-1 ${cat.color === 'emerald' ? 'text-emerald-600' : 'text-amber-600'}`}>{scoreValue}</div>
                        <div className="w-full h-px bg-gray-200 mb-3"></div>
                        <div className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest mx-auto leading-tight">
                          {cat.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {codingAiEvaluation?.summary && (
                  <div className="mt-4 bg-[#fcf9ff] border border-purple-200 rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-700 leading-relaxed italic">{codingAiEvaluation.summary}</p>
                  </div>
                )}
              </div>
            )}

            {/* MUST HAVE SKILLS */}
            {mustToHaveSkills && (
              <div className="mb-6 print:break-inside-avoid pt-2 shrink-0">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-lg font-bold text-gray-900">Must Have Skills</h2>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-bold tracking-widest">
                    {mustToHaveSkills.length} SKILLS
                  </span>
                </div>
                
                <div className="space-y-4">
                  {mustToHaveSkills.map((skill, idx) => {
                    const borderColors = [
                      '#10b981', // emerald
                      '#f59e0b', // amber
                      '#800080', // purple
                      '#ef4444', // red
                    ];
                    const textColors = [
                      'text-emerald-600',
                      'text-amber-600',
                      'text-[#800080]',
                      'text-red-600',
                    ];
                    const bgColors = [
                      'bg-emerald-500',
                      'bg-amber-500',
                      'bg-[#800080]',
                      'bg-red-500',
                    ];
                    const borderColor = borderColors[idx % borderColors.length];
                    const textColor = textColors[idx % textColors.length];
                    const bgColor = bgColors[idx % bgColors.length];
                    const skillScore = skill.percentage || 0;
                    const level = skillScore >= 80 ? "Expert" : skillScore >= 60 ? "Intermediate" : "Beginner";

                    return (
                      <div key={idx} className="bg-white rounded-xl p-5 shadow-md border border-gray-200 print:shadow-none print:break-inside-avoid" style={{ borderLeft: `4px solid ${borderColor}` }}>
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-bold text-gray-900 capitalize truncate pr-4">{skill.skill_name}</h4>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-xs text-gray-500 italic font-medium">{level}</span>
                            <span className={`text-sm font-bold ${textColor}`}>{skillScore}/100</span>
                          </div>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mb-3">
                          <div className={`h-full ${bgColor}`} style={{ width: `${skillScore}%` }}></div>
                        </div>
                        {skill.description && (
                          <p className="text-sm text-gray-600 mt-2 leading-relaxed">{skill.description}</p>
                        )}
                      </div>
                    );
                  })}
                  
                  {mustToHaveSkills.length === 0 && (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300 shadow-inner">
                      No mandatory skills data available.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TOP STRENGTHS & AREAS FOR IMPROVEMENT (AI INTERVIEW) */}
            {(topStrengths || areasForImprovement) && (
              <div className="mb-6 grid grid-cols-2 gap-6 print:break-inside-avoid shrink-0 pt-2">
                <div className="flex flex-col h-full">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                    Top Strengths <span className="bg-gray-100 border border-gray-300 text-gray-600 px-2 py-0.5 rounded-full text-[10px]">{topStrengths?.length || 0}</span>
                  </h3>
                  <div className={`flex-1 border rounded-xl p-6 flex flex-col shadow-sm ${(topStrengths?.length || 0) > 0 ? 'bg-emerald-50/30 border-emerald-200' : 'bg-emerald-50/50 border-emerald-300 border-dashed items-center justify-center text-center'}`}>
                    {(topStrengths?.length || 0) > 0 ? (
                      <ul className="space-y-3">
                        {topStrengths.map((str, i) => (
                          <li key={i} className="flex gap-2 text-sm text-gray-700">
                            <span className="text-emerald-500 mt-0.5">✓</span>
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <>
                        <p className="text-sm font-bold text-emerald-700">No data found</p>
                        <p className="text-xs text-emerald-600/80 mt-1 max-w-[200px] font-medium">Strengths will be populated once AI qualitative analysis is complete.</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-col h-full">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                    Areas for Improvement <span className="bg-gray-100 border border-gray-300 text-gray-600 px-2 py-0.5 rounded-full text-[10px]">{areasForImprovement?.length || 0}</span>
                  </h3>
                  <div className={`flex-1 border rounded-xl p-6 flex flex-col shadow-sm ${(areasForImprovement?.length || 0) > 0 ? 'bg-rose-50/30 border-rose-200' : 'bg-rose-50/50 border-rose-300 border-dashed items-center justify-center text-center'}`}>
                    {(areasForImprovement?.length || 0) > 0 ? (
                      <ul className="space-y-4">
                        {areasForImprovement.map((area, i) => (
                          <li key={i} className="flex flex-col gap-1">
                            <div className="flex gap-2">
                              <span className="text-rose-500 text-sm mt-0.5">⚠</span>
                              <span className="text-sm font-bold text-gray-800">{area.area}</span>
                            </div>
                            <span className="text-xs text-gray-600 ml-5">{area.description}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <>
                        <p className="text-sm font-bold text-rose-700">No data found</p>
                        <p className="text-xs text-rose-600/80 mt-1 max-w-[200px] font-medium">Improvement areas will be populated once AI qualitative analysis is complete.</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* CODING STRENGTHS & RED FLAGS */}
            {(codingAiEvaluation?.strengths?.length > 0 || codingAiEvaluation?.red_flags?.length > 0) && (
              <div className="mb-6 grid grid-cols-2 gap-6 print:break-inside-avoid shrink-0 pt-2">
                <div className="flex flex-col h-full">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                    Key Strengths <span className="bg-gray-100 border border-gray-300 text-gray-600 px-2 py-0.5 rounded-full text-[10px]">{codingAiEvaluation.strengths.length}</span>
                  </h3>
                  <div className={`flex-1 border rounded-xl p-6 flex flex-col shadow-sm ${codingAiEvaluation.strengths.length > 0 ? 'bg-emerald-50/30 border-emerald-200' : 'bg-emerald-50/50 border-emerald-300 border-dashed items-center justify-center text-center'}`}>
                    {codingAiEvaluation.strengths.length > 0 ? (
                      <ul className="space-y-3">
                        {codingAiEvaluation.strengths.map((str, i) => (
                          <li key={i} className="flex gap-2 text-sm text-gray-700">
                            <span className="text-emerald-500 mt-0.5">✓</span>
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <>
                        <p className="text-sm font-bold text-emerald-700">No strengths noted</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-col h-full">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                    Red Flags / Concerns <span className="bg-gray-100 border border-gray-300 text-gray-600 px-2 py-0.5 rounded-full text-[10px]">{codingAiEvaluation.red_flags.length}</span>
                  </h3>
                  <div className={`flex-1 border rounded-xl p-6 flex flex-col shadow-sm ${codingAiEvaluation.red_flags.length > 0 ? 'bg-rose-50/30 border-rose-200' : 'bg-rose-50/50 border-rose-300 border-dashed items-center justify-center text-center'}`}>
                    {codingAiEvaluation.red_flags.length > 0 ? (
                      <ul className="space-y-4">
                        {codingAiEvaluation.red_flags.map((flag, i) => (
                          <li key={i} className="flex flex-col gap-1">
                            <div className="flex gap-2">
                              <span className="text-rose-500 text-sm mt-0.5">⚠</span>
                              <span className="text-sm font-bold text-gray-800">{flag}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <>
                        <p className="text-sm font-bold text-rose-700">No red flags</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* INTERVIEW QUESTIONS & RESPONSES */}
            {interviewQuestionsResponses.length > 0 && (
              <div className="mb-6 print:break-inside-avoid shrink-0 pt-4">
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  Interview Questions & Responses <span className="bg-gray-100 border border-gray-300 text-gray-600 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider">{interviewQuestionsResponses.length} QUESTIONS</span>
                </h3>
                <div className="space-y-6">
                  {interviewQuestionsResponses.map((qr, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-6 shadow-md border border-gray-300 print:shadow-none print:border-gray-400 print:break-inside-avoid">
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <h4 className="font-bold text-gray-900 flex-1"><span className="text-[#800080] mr-2">Q{idx + 1}.</span>{qr.question}</h4>
                        <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                          Score: {qr.score}/100
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Response Summary</h5>
                        <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-200">{qr.response_summary}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        {qr.key_insights && qr.key_insights.length > 0 && (
                          <div>
                            <h5 className="text-xs font-semibold text-emerald-600 uppercase tracking-widest mb-2">Key Insights</h5>
                            <ul className="space-y-1.5">
                              {qr.key_insights.map((insight, i) => (
                                <li key={i} className="flex gap-2 text-xs text-gray-600">
                                  <span className="text-emerald-500 mt-0.5">•</span>
                                  <span>{insight}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {qr.missed_opportunities && qr.missed_opportunities.length > 0 && (
                          <div>
                            <h5 className="text-xs font-semibold text-amber-600 uppercase tracking-widest mb-2">Missed Opportunities</h5>
                            <ul className="space-y-1.5">
                              {qr.missed_opportunities.map((missed, i) => (
                                <li key={i} className="flex gap-2 text-xs text-gray-600">
                                  <span className="text-amber-500 mt-0.5">•</span>
                                  <span>{missed}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CODING ROUND */}
            {codingQuestions.length > 0 && (
              <div className="mb-6 print:break-inside-avoid shrink-0 pt-4 pb-8">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-sm font-bold text-gray-900">Coding Round</h3>
                  <span className="bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider">LIVE ASSESSMENT</span>
                </div>
                
                <div className="space-y-6">
                  {codingQuestions.map((q, idx) => {
                    const answer = codingAnswers[idx];
                    let answerText = "No answer submitted";
                    let timeData = null;
                    let evaluation = null;
                    
                    if (answer) {
                       let parsedAnswer = answer;
                       if (typeof answer === 'string') {
                         try { parsedAnswer = JSON.parse(answer); } catch(e) {}
                       }
                       
                       // Try to parse array string if it's deeply nested (like API response)
                       if (typeof parsedAnswer === 'string') {
                         try { parsedAnswer = JSON.parse(parsedAnswer); } catch(e) {}
                       }
                       
                       if (Array.isArray(parsedAnswer)) parsedAnswer = parsedAnswer[idx] || parsedAnswer[0];

                       if (parsedAnswer && parsedAnswer.candidateAnswer && parsedAnswer.candidateAnswer.submittedCode) {
                         answerText = parsedAnswer.candidateAnswer.submittedCode;
                         timeData = parsedAnswer.timeData;
                         evaluation = parsedAnswer.evaluation;
                       } else if (parsedAnswer) {
                         answerText = typeof parsedAnswer === 'string' ? parsedAnswer : (parsedAnswer.code || parsedAnswer.answer || JSON.stringify(parsedAnswer, null, 2));
                       }
                    }
                    
                    return (
                       <div key={idx} className="coding-block border border-gray-800 rounded-xl overflow-hidden print:break-inside-avoid" style={{ backgroundColor: '#1e1e2e' }}>
                         <div className="coding-header px-4 py-2 flex items-center justify-between" style={{ backgroundColor: '#2d2d3f' }}>
                           <div className="flex gap-1.5">
                              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#ef4444' }}></div>
                              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#eab308' }}></div>
                              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#22c55e' }}></div>
                            </div>
                           <div className="flex items-center gap-4">
                             {timeData && (
                               <span className="text-[10px] text-gray-400 font-mono">
                                 Submitted: {timeData.submittedAt}
                               </span>
                             )}
                             {evaluation && (
                               <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                 evaluation.status === 'PASSED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                               }`}>
                                 {evaluation.status} ({evaluation.testCasesPassed} tests)
                               </span>
                             )}
                             <span className="text-xs text-gray-400 font-mono">{q.language || 'Code'}</span>
                           </div>
                         </div>
                         <div className="p-6 text-left">
                           <h4 className="text-white font-bold mb-2 text-lg">{idx + 1}. {q.title}</h4>
                           <div className="text-sm text-gray-400 mb-6 whitespace-pre-wrap">{q.problemStatement}</div>
                           
                           <div className="mt-4">
                             <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Candidate's Solution</h5>
                             <pre className="coding-pre p-4 rounded-lg overflow-x-auto text-sm font-mono text-gray-300 whitespace-pre-wrap" style={{ backgroundColor: '#000000' }}>
                               <code>{answerText}</code>
                             </pre>
                           </div>
                         </div>
                       </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* FOOTER - mt-8 in print to stay attached to content, not float to a new page */}
            <div className="mt-auto print:mt-8 pt-6 pb-4 text-center text-xs text-gray-400 flex flex-col items-center gap-2 border-t border-gray-100 shrink-0">
              <p>✦ <span className="font-bold text-[#800080]">InterviewFold</span> — AI-powered hiring intelligence</p>
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
