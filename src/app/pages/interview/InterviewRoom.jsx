
// import { useEffect, useRef, useState, useCallback } from "react";
// import { useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { createSession, getQuestion } from "../../Reducer/QuestionSlice";
// import { WebRTCService } from "./webrtcService";

// const InterviewRoom = () => {
//   const { token } = useParams();
//   const dispatch = useDispatch();

//   const { allquestions, loading, error } = useSelector(
//     (state) => state.questions
//   );

//   const webrtcRef = useRef(null);
//   const currentIndexRef = useRef(-1);
//   const isAISpeakingRef = useRef(false);
//   const sessionReadyRef = useRef(false);

//   // Always-fresh ref for questions — avoids stale closure bugs
//   const allquestionsRef = useRef([]);
//   useEffect(() => {
//     if (allquestions && allquestions.length > 0) {
//       allquestionsRef.current = allquestions;
//       console.log("✅ Questions in ref:", allquestions.length);
//     }
//   }, [allquestions]);

//   const [status, setStatus] = useState("waiting");
//   const [displayIndex, setDisplayIndex] = useState(-1);

//   useEffect(() => {
//     if (token) dispatch(getQuestion({ token }));
//   }, [token, dispatch]);

//   /* ─────────────────────────────────────────────────────────────────
//      askQuestion
//      Uses browser SpeechSynthesis — 100% verbatim, no AI hallucination.
//      onEnd callback fires when TTS finishes → moves status to "listening"
//   ───────────────────────────────────────────────────────────────── */
//   const askQuestion = useCallback((index) => {
//     const questions = allquestionsRef.current;

//     if (!questions || questions.length === 0) {
//       console.error("❌ No questions in ref");
//       return;
//     }
//     if (index >= questions.length) {
//       console.error("❌ Index out of range:", index);
//       return;
//     }

//     const questionText = questions[index].question;
//     console.log(`📢 Q${index + 1}/${questions.length}: ${questionText}`);

//     setStatus("speaking");
//     isAISpeakingRef.current = true;
//     setDisplayIndex(index);

//     // Browser TTS reads the exact question text
//     webrtcRef.current.speakExact(questionText, () => {
//       // onEnd: TTS finished → now listen for user's answer
//       isAISpeakingRef.current = false;
//       setStatus("listening");
//     });
//   }, []);

//   /* ─────────────────────────────────────────────────────────────────
//      sendGreeting
//   ───────────────────────────────────────────────────────────────── */
//   const sendGreeting = useCallback(() => {
//     setStatus("speaking");
//     isAISpeakingRef.current = true;

//     webrtcRef.current.speakExact(
//       "Hello! Welcome to the interview. I am your AI interviewer today. Please go ahead and introduce yourself.",
//       () => {
//         isAISpeakingRef.current = false;
//         setStatus("listening");
//       }
//     );
//   }, []);

//   /* ─────────────────────────────────────────────────────────────────
//      finishInterview
//   ───────────────────────────────────────────────────────────────── */
//   const finishInterview = useCallback(() => {
//     setStatus("speaking");
//     isAISpeakingRef.current = true;

//     webrtcRef.current.speakExact(
//       "Thank you so much for your time today. It was a pleasure speaking with you. We will review your responses and get back to you soon. Have a wonderful day!",
//       () => {
//         isAISpeakingRef.current = false;
//         setStatus("finished");
//       }
//     );
//   }, []);

//   /* ─────────────────────────────────────────────────────────────────
//      handleUserFinishedSpeaking
//   ───────────────────────────────────────────────────────────────── */
//   const handleUserFinishedSpeaking = useCallback(() => {
//     const questions = allquestionsRef.current;
//     console.log(`👤 User done | idx: ${currentIndexRef.current} | total: ${questions.length}`);

//     if (!questions || questions.length === 0) {
//       console.warn("⚠️ No questions yet");
//       return;
//     }

//     if (currentIndexRef.current === -1) {
//       // Introduction done → first question
//       currentIndexRef.current = 0;
//       askQuestion(0);
//     } else {
//       const next = currentIndexRef.current + 1;
//       currentIndexRef.current = next;
//       if (next < questions.length) {
//         askQuestion(next);
//       } else {
//         finishInterview();
//       }
//     }
//   }, [askQuestion, finishInterview]);

//   /* ─────────────────────────────────────────────────────────────────
//      handleMessage — OpenAI Realtime events
//      We only care about transcription events here.
//      AI speaking events (response.done) are no longer relevant since
//      we use browser TTS for all speech.
//   ───────────────────────────────────────────────────────────────── */
//   const handleMessage = useCallback(
//     (msg) => {
//       if (!msg) return;

//       // Session ready → send greeting via browser TTS
//       if (msg.type === "session.updated" && !sessionReadyRef.current) {
//         sessionReadyRef.current = true;
//         console.log("✅ Session ready → greeting");
//         sendGreeting();
//         return;
//       }

//       // AI tried to generate a response — cancel it immediately
//       // We don't want OpenAI speaking, only listening
//       if (msg.type === "response.created" || msg.type === "response.output_item.added") {
//         webrtcRef.current?.suppressAIResponse();
//         return;
//       }

//       // VAD: user finished speaking, Whisper transcription complete
//       if (msg.type === "conversation.item.input_audio_transcription.completed") {
//         // If browser TTS is still playing, ignore (user talked over AI)
//         if (isAISpeakingRef.current) {
//           console.log("⏭ Ignoring — still speaking");
//           return;
//         }

//         const transcript = msg.transcript?.trim();
//         console.log("🎙 Transcript:", transcript);
//         if (!transcript) return;

//         setStatus("processing");

//         // Small delay so status shows "processing" briefly before next question
//         setTimeout(() => {
//           handleUserFinishedSpeaking();
//         }, 500);
//       }
//     },
//     [sendGreeting, handleUserFinishedSpeaking]
//   );

//   const handleConnectionChange = useCallback((state) => {
//     console.log("🔌 WebRTC:", state);
//     if (state === "failed" || state === "disconnected") {
//       setStatus("waiting");
//       sessionReadyRef.current = false;
//     }
//   }, []);

//   /* ─────────────────────────────────────────────────────────────────
//      startInterview
//   ───────────────────────────────────────────────────────────────── */
//   const startInterview = async () => {
//     try {
//       setStatus("connecting");
//       currentIndexRef.current = -1;
//       setDisplayIndex(-1);
//       sessionReadyRef.current = false;
//       isAISpeakingRef.current = false;

//       // Pre-load voices (some browsers need this trigger)
//       window.speechSynthesis.getVoices();

//       const result = await dispatch(createSession());
//       if (!createSession.fulfilled.match(result)) throw new Error("Session failed");

//       const clientSecret = result.payload?.client_secret?.value;
//       if (!clientSecret) throw new Error("No client secret");

//       webrtcRef.current = new WebRTCService(handleMessage, handleConnectionChange);
//       await webrtcRef.current.connect(clientSecret);
//     } catch (err) {
//       console.error("❌ Start error:", err);
//       setStatus("waiting");
//     }
//   };

//   const endInterview = () => {
//     window.speechSynthesis.cancel();
//     if (webrtcRef.current) webrtcRef.current.disconnect();
//     sessionReadyRef.current = false;
//     setStatus("finished");
//   };

//   const restartInterview = () => {
//     window.speechSynthesis.cancel();
//     if (webrtcRef.current) webrtcRef.current.disconnect();
//     currentIndexRef.current = -1;
//     setDisplayIndex(-1);
//     sessionReadyRef.current = false;
//     isAISpeakingRef.current = false;
//     setStatus("waiting");
//   };

//   // ── UI ────────────────────────────────────────────────────────────
//   const questionCount = allquestions?.length || 0;

//   const statusConfig = {
//     waiting:    { text: "Ready to begin",                  color: "text-slate-400",   dot: "bg-slate-400" },
//     connecting: { text: "Connecting...",                   color: "text-amber-400",   dot: "bg-amber-400 animate-pulse" },
//     speaking:   { text: "AI Interviewer is speaking...",   color: "text-sky-400",     dot: "bg-sky-400 animate-pulse" },
//     listening:  { text: "Listening — please answer now",  color: "text-emerald-400", dot: "bg-emerald-400 animate-pulse" },
//     processing: { text: "Processing your response...",     color: "text-violet-400",  dot: "bg-violet-400 animate-pulse" },
//     finished:   { text: "Interview Completed",             color: "text-rose-400",    dot: "bg-rose-400" },
//   };

//   const currentStatus = statusConfig[status] || statusConfig.waiting;

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
//           <p className="text-slate-400 text-sm tracking-widest uppercase">Loading Questions</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
//         <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-8 text-center max-w-md">
//           <p className="text-rose-400 text-lg">
//             {typeof error === "string" ? error : "Something went wrong"}
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="min-h-screen flex items-center justify-center p-6"
//       style={{
//         background: "radial-gradient(ellipse at 20% 50%, #0d1f3c 0%, #0a0f1e 50%, #07080f 100%)",
//         fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
//       }}
//     >
//       <div
//         className="fixed inset-0 pointer-events-none opacity-5"
//         style={{
//           backgroundImage:
//             "linear-gradient(rgba(100,180,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(100,180,255,0.3) 1px, transparent 1px)",
//           backgroundSize: "60px 60px",
//         }}
//       />

//       <div className="relative w-full max-w-2xl">
//         <div className="text-center mb-10">
//           <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 rounded-full px-4 py-1.5 mb-4">
//             <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
//             <span className="text-sky-400 text-xs font-medium tracking-widest uppercase">
//               AI Interview Session
//             </span>
//           </div>
//           <h1 className="text-4xl font-bold text-white" style={{ letterSpacing: "-0.03em" }}>
//             Interview Room
//           </h1>
//         </div>

//         <div
//           className="rounded-3xl overflow-hidden"
//           style={{
//             background: "rgba(255,255,255,0.03)",
//             border: "1px solid rgba(255,255,255,0.08)",
//             boxShadow: "0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
//           }}
//         >
//           <div className="h-1 bg-white/5">
//             <div
//               className="h-full bg-gradient-to-r from-sky-500 to-violet-500 transition-all duration-700"
//               style={{
//                 width: questionCount > 0 && displayIndex >= 0
//                   ? `${((displayIndex + 1) / questionCount) * 100}%`
//                   : "0%",
//               }}
//             />
//           </div>

//           <div className="p-8 md:p-10">
//             <div className="flex items-center justify-between mb-6">
//               <span className="text-slate-500 text-sm tracking-wide">
//                 {displayIndex === -1 ? "Introduction" : `Question ${displayIndex + 1} of ${questionCount}`}
//               </span>
//               <div className="flex items-center gap-2">
//                 <span className={`w-2 h-2 rounded-full ${currentStatus.dot}`} />
//                 <span className={`text-sm font-medium ${currentStatus.color}`}>{currentStatus.text}</span>
//               </div>
//             </div>

//             <div
//               className="rounded-2xl p-6 mb-8 min-h-[120px] flex items-center justify-center text-center"
//               style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
//             >
//               <p className="text-white/90 text-lg leading-relaxed font-light">
//                 {status === "waiting"
//                   ? "Click 'Start Interview' to begin your session."
//                   : status === "connecting"
//                   ? "Establishing secure connection..."
//                   : displayIndex === -1
//                   ? "Please introduce yourself to the interviewer."
//                   : allquestions?.[displayIndex]?.question || "Preparing next question..."}
//               </p>
//             </div>

//             <div className="flex justify-center mb-8">
//               <div className="relative">
//                 <div
//                   className={`absolute inset-0 rounded-full transition-all duration-500 ${
//                     status === "speaking"
//                       ? "scale-125 opacity-30 bg-sky-500 blur-xl animate-pulse"
//                       : status === "listening"
//                       ? "scale-125 opacity-20 bg-emerald-500 blur-xl animate-pulse"
//                       : "scale-100 opacity-0"
//                   }`}
//                 />
//                 <div
//                   className="w-20 h-20 rounded-full flex items-center justify-center relative z-10"
//                   style={{
//                     background: "linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)",
//                     border: "2px solid rgba(255,255,255,0.1)",
//                   }}
//                 >
//                   <svg viewBox="0 0 24 24" fill="none" className="w-9 h-9 text-white" stroke="currentColor" strokeWidth="1.5">
//                     <path strokeLinecap="round" strokeLinejoin="round"
//                       d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
//                     />
//                   </svg>
//                 </div>
//                 {(status === "speaking" || status === "listening") && (
//                   <div className="absolute -right-8 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
//                     {[1, 2, 3, 4].map((i) => (
//                       <div
//                         key={i}
//                         className={`w-1 rounded-full ${status === "speaking" ? "bg-sky-400" : "bg-emerald-400"}`}
//                         style={{
//                           height: `${8 + i * 5}px`,
//                           animation: `waveBounce 0.8s ease-in-out ${i * 0.1}s infinite alternate`,
//                         }}
//                       />
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="flex justify-center gap-4">
//               {status === "waiting" && (
//                 <button
//                   onClick={startInterview}
//                   className="px-8 py-3.5 rounded-xl font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95"
//                   style={{
//                     background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
//                     boxShadow: "0 4px 24px rgba(99,102,241,0.4)",
//                   }}
//                 >
//                   Start Interview
//                 </button>
//               )}
//               {status === "finished" && (
//                 <button
//                   onClick={restartInterview}
//                   className="px-8 py-3.5 rounded-xl font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95"
//                   style={{
//                     background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
//                     boxShadow: "0 4px 24px rgba(99,102,241,0.4)",
//                   }}
//                 >
//                   Start New Interview
//                 </button>
//               )}
//               {status !== "finished" && status !== "waiting" && (
//                 <button
//                   onClick={endInterview}
//                   className="px-8 py-3.5 rounded-xl font-semibold text-white/80 border border-white/10 transition-all duration-200 hover:bg-white/5 hover:scale-105 active:scale-95"
//                 >
//                   End Interview
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         <p className="text-center text-slate-600 text-xs mt-6 tracking-wide">
//           Browser TTS (Indian English) · OpenAI Whisper VAD
//         </p>
//       </div>

//       <style>{`
//         @keyframes waveBounce {
//           from { transform: scaleY(0.4); }
//           to   { transform: scaleY(1.4); }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default InterviewRoom;




import { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createSession, getQuestion } from "../../Reducer/QuestionSlice";
import { WebRTCService } from "./webrtcService";
import { RecordingService } from "./Recordingservice";


const UPLOAD_URL = "http://localhost:8085/api/goodmood/recording/upload-recording"; // your Java endpoint

const InterviewRoom = () => {
  const { token } = useParams();
  const dispatch = useDispatch();

  const { allquestions, loading, error } = useSelector(
    (state) => state.questions
  );

  // ── Refs ──────────────────────────────────────────────────────────────────
  const webrtcRef = useRef(null);
  const recordingRef = useRef(new RecordingService());
  const currentIndexRef = useRef(-1);
  const isAISpeakingRef = useRef(false);
  const sessionReadyRef = useRef(false);
  const allquestionsRef = useRef([]);
  const cameraPreviewRef = useRef(null);

  // ── State ─────────────────────────────────────────────────────────────────
  // setupStep: "camera" | "screen" | "ready" | "interview" | "done" | "error"
  const [setupStep, setSetupStep] = useState("camera");
  const [cameraGranted, setCameraGranted] = useState(false);
  const [screenGranted, setScreenGranted] = useState(false);
  const [setupError, setSetupError] = useState("");
  const [status, setStatus] = useState("waiting");
  const [displayIndex, setDisplayIndex] = useState(-1);
  const [uploadProgress, setUploadProgress] = useState("");

  useEffect(() => {
    if (allquestions?.length > 0) allquestionsRef.current = allquestions;
  }, [allquestions]);

  useEffect(() => {
    if (token) dispatch(getQuestion({ token }));
  }, [token, dispatch]);

  // Attach camera stream to preview video once granted
  useEffect(() => {
    if (cameraGranted && cameraPreviewRef.current) {
      cameraPreviewRef.current.srcObject = recordingRef.current.getCameraStream();
    }
  }, [cameraGranted, setupStep]);

  /* ─────────────────────────────────────────────────────────────────
     SETUP: Step 1 — Camera
  ───────────────────────────────────────────────────────────────── */
  const handleRequestCamera = async () => {
    setSetupError("");
    const result = await recordingRef.current.requestCamera();
    if (result.success) {
      setCameraGranted(true);
      setSetupStep("screen");
    } else {
      setSetupError("Camera access denied. Please allow camera access and try again.");
    }
  };

  /* ─────────────────────────────────────────────────────────────────
     SETUP: Step 2 — Screen share
  ───────────────────────────────────────────────────────────────── */
  const handleRequestScreen = async () => {
    setSetupError("");
    const result = await recordingRef.current.requestScreen();
    if (result.success) {
      setScreenGranted(true);
      setSetupStep("ready");
    } else {
      setSetupError("Screen share was cancelled. Screen sharing is required for this interview.");
    }
  };

  /* ─────────────────────────────────────────────────────────────────
     Interview flow
  ───────────────────────────────────────────────────────────────── */
  const speakThenListen = useCallback((text, onAfter) => {
    isAISpeakingRef.current = true;
    setStatus("speaking");
    webrtcRef.current.speakExact(text, () => {
      isAISpeakingRef.current = false;
      if (onAfter) onAfter();
      else setStatus("listening");
    });
  }, []);

  const askQuestion = useCallback((index) => {
    const questions = allquestionsRef.current;
    if (!questions?.[index]) return;
    console.log(`📢 Q${index + 1}/${questions.length}: ${questions[index].question}`);
    setDisplayIndex(index);
    speakThenListen(questions[index].question);
  }, [speakThenListen]);

  const sendGreeting = useCallback(() => {
    speakThenListen(
      "Hello! Welcome to the interview. I am your AI interviewer today. Please go ahead and introduce yourself."
    );
  }, [speakThenListen]);

  const handleStopAndUpload = useCallback(async () => {
    window.speechSynthesis.cancel();
    if (webrtcRef.current) webrtcRef.current.disconnect();
    setStatus("uploading");
    setUploadProgress("Stopping recording...");

    const blob = await recordingRef.current.stopRecording();

    if (!blob || blob.size === 0) {
      setUploadProgress("No recording data.");
      setSetupStep("done");
      recordingRef.current.cleanup();
      return;
    }

    setUploadProgress(`Uploading (${(blob.size / 1024 / 1024).toFixed(1)} MB)...`);
    const uploadResult = await recordingRef.current.uploadRecording(blob, token, UPLOAD_URL);

    setUploadProgress(
      uploadResult.success
        ? "Recording saved successfully!"
        : `Upload failed: ${uploadResult.error}`
    );
    setSetupStep("done");
    recordingRef.current.cleanup();
  }, [token]);

  const finishInterview = useCallback(() => {
    speakThenListen(
      "Thank you so much for your time today. It was a pleasure speaking with you. We will review your responses and get back to you soon. Have a wonderful day!",
      () => handleStopAndUpload()
    );
  }, [speakThenListen, handleStopAndUpload]);

  const handleUserFinishedSpeaking = useCallback(() => {
    const questions = allquestionsRef.current;
    if (!questions?.length) return;

    if (currentIndexRef.current === -1) {
      currentIndexRef.current = 0;
      askQuestion(0);
    } else {
      const next = currentIndexRef.current + 1;
      currentIndexRef.current = next;
      if (next < questions.length) askQuestion(next);
      else finishInterview();
    }
  }, [askQuestion, finishInterview]);

  const handleMessage = useCallback((msg) => {
    if (!msg) return;
    if (msg.type === "session.updated" && !sessionReadyRef.current) {
      sessionReadyRef.current = true;
      sendGreeting();
      return;
    }
    if (msg.type === "response.created" || msg.type === "response.output_item.added") {
      webrtcRef.current?.suppressAIResponse();
      return;
    }
    if (msg.type === "conversation.item.input_audio_transcription.completed") {
      if (isAISpeakingRef.current) return;
      const transcript = msg.transcript?.trim();
      if (!transcript) return;
      setStatus("processing");
      setTimeout(() => handleUserFinishedSpeaking(), 400);
    }
  }, [sendGreeting, handleUserFinishedSpeaking]);

  const handleConnectionChange = useCallback((state) => {
    if (state === "failed" || state === "disconnected") {
      setStatus("waiting");
      sessionReadyRef.current = false;
    }
  }, []);

  /* ─────────────────────────────────────────────────────────────────
     START INTERVIEW
  ───────────────────────────────────────────────────────────────── */
  const startInterview = async () => {
    try {
      setSetupStep("interview");
      setStatus("connecting");
      currentIndexRef.current = -1;
      setDisplayIndex(-1);
      sessionReadyRef.current = false;
      isAISpeakingRef.current = false;

      // Start recording BEFORE WebRTC
      await recordingRef.current.startRecording(() => {
        // User stopped screen share mid-interview
        handleStopAndUpload();
      });

      window.speechSynthesis.getVoices();

      const result = await dispatch(createSession());
      if (!createSession.fulfilled.match(result)) throw new Error("Session failed");

      const clientSecret = result.payload?.client_secret?.value;
      if (!clientSecret) throw new Error("No client secret");

      webrtcRef.current = new WebRTCService(handleMessage, handleConnectionChange);
      await webrtcRef.current.connect(clientSecret);
    } catch (err) {
      console.error("❌ Start error:", err);
      setSetupStep("error");
      setSetupError(err.message);
    }
  };

  const questionCount = allquestions?.length || 0;

  const statusConfig = {
    waiting:    { text: "Ready to begin",                 color: "text-slate-400",   dot: "bg-slate-400" },
    connecting: { text: "Connecting...",                  color: "text-amber-400",   dot: "bg-amber-400 animate-pulse" },
    speaking:   { text: "AI Interviewer is speaking...",  color: "text-sky-400",     dot: "bg-sky-400 animate-pulse" },
    listening:  { text: "Listening — please answer now", color: "text-emerald-400", dot: "bg-emerald-400 animate-pulse" },
    processing: { text: "Processing your response...",    color: "text-violet-400",  dot: "bg-violet-400 animate-pulse" },
    uploading:  { text: "Saving recording...",            color: "text-amber-400",   dot: "bg-amber-400 animate-pulse" },
  };
  const currentStatus = statusConfig[status] || statusConfig.waiting;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm tracking-widest uppercase">Loading Questions</p>
        </div>
      </div>
    );
  }

  /* ─── SETUP: Step 1 — Camera ─────────────────────────────────────────────── */
  if (setupStep === "camera") {
    return (
      <SetupScreen
        icon="📷"
        title="Camera Access Required"
        description="This interview requires your camera and microphone. Your camera will be recorded alongside your screen."
        buttonText="Allow Camera & Microphone"
        onAction={handleRequestCamera}
        error={setupError}
        step={1} totalSteps={2}
      />
    );
  }

  /* ─── SETUP: Step 2 — Screen share ───────────────────────────────────────── */
  if (setupStep === "screen") {
    return (
      <SetupScreen
        icon="🖥️"
        title="Screen Sharing Required"
        description="Please share your entire screen for the interview recording. Select 'Entire Screen' when the browser prompt appears."
        buttonText="Share My Screen"
        onAction={handleRequestScreen}
        error={setupError}
        step={2} totalSteps={2}
        note="⚠️ Select 'Entire Screen', not a window or browser tab."
      />
    );
  }

  /* ─── SETUP: Step 3 — Ready, show preview ────────────────────────────────── */
  if (setupStep === "ready") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6"
        style={{ background: "radial-gradient(ellipse at 20% 50%, #0d1f3c 0%, #0a0f1e 50%, #07080f 100%)" }}>
        <div className="w-full max-w-xl text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-emerald-400 text-xs font-medium tracking-widest uppercase">All Permissions Granted</span>
          </div>

          <h2 className="text-3xl font-bold text-white mb-2">You're all set!</h2>
          <p className="text-slate-400 mb-8">Camera and screen share are ready. Your interview will be recorded.</p>

          {/* Camera preview */}
          <div className="relative mb-8 rounded-2xl overflow-hidden bg-black/40 border border-white/10"
            style={{ aspectRatio: "16/9" }}>
            <video ref={cameraPreviewRef} autoPlay muted playsInline
              className="w-full h-full object-cover scale-x-[-1]" />
            <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 rounded-full px-3 py-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-white text-xs">Camera Preview</span>
            </div>
          </div>

          {/* Checklist */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-8 text-left space-y-3">
            <CheckItem label="Camera & microphone access" checked={cameraGranted} />
            <CheckItem label="Screen sharing enabled" checked={screenGranted} />
            <CheckItem label="Interview will be recorded and saved" checked={true} />
          </div>

          <button onClick={startInterview}
            className="w-full py-4 rounded-xl font-bold text-white text-lg transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)", boxShadow: "0 4px 32px rgba(99,102,241,0.5)" }}>
            🎬 Start Interview
          </button>
          <p className="text-slate-500 text-xs mt-4">Recording begins when you click Start Interview</p>
        </div>
      </div>
    );
  }

  /* ─── Done ───────────────────────────────────────────────────────────────── */
  if (setupStep === "done") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6"
        style={{ background: "radial-gradient(ellipse at 20% 50%, #0d1f3c 0%, #0a0f1e 50%, #07080f 100%)" }}>
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">✅</div>
          <h2 className="text-3xl font-bold text-white mb-3">Interview Complete</h2>
          <p className="text-slate-400 mb-4">{uploadProgress || "Your interview has been recorded and saved."}</p>
          <p className="text-slate-500 text-sm">You may now close this window.</p>
        </div>
      </div>
    );
  }

  /* ─── Error ──────────────────────────────────────────────────────────────── */
  if (setupStep === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6"
        style={{ background: "radial-gradient(ellipse at 20% 50%, #0d1f3c 0%, #0a0f1e 50%, #07080f 100%)" }}>
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">⚠️</div>
          <h2 className="text-3xl font-bold text-white mb-3">Something went wrong</h2>
          <p className="text-rose-400 mb-6">{setupError}</p>
          <button onClick={() => { setSetupStep("camera"); setSetupError(""); }}
            className="px-8 py-3 rounded-xl text-white font-semibold"
            style={{ background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)" }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /* ─── INTERVIEW SCREEN ───────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "radial-gradient(ellipse at 20% 50%, #0d1f3c 0%, #0a0f1e 50%, #07080f 100%)", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>

      <div className="fixed inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: "linear-gradient(rgba(100,180,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(100,180,255,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

      {/* REC badge */}
      <div className="fixed top-4 right-4 flex items-center gap-2 bg-black/70 border border-red-500/40 rounded-full px-3 py-1.5 z-50">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-red-400 text-xs font-medium tracking-wider">REC</span>
      </div>

      {/* Camera PiP - bottom left */}
      <div className="fixed bottom-4 left-4 z-50 rounded-xl overflow-hidden shadow-2xl"
        style={{ width: 180, height: 101, border: "2px solid rgba(99,179,237,0.5)" }}>
        <video ref={cameraPreviewRef} autoPlay muted playsInline
          className="w-full h-full object-cover scale-x-[-1]" />
      </div>

      <div className="relative w-full max-w-2xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 rounded-full px-4 py-1.5 mb-4">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            <span className="text-sky-400 text-xs font-medium tracking-widest uppercase">AI Interview Session</span>
          </div>
          <h1 className="text-4xl font-bold text-white" style={{ letterSpacing: "-0.03em" }}>Interview Room</h1>
        </div>

        <div className="rounded-3xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)" }}>

          <div className="h-1 bg-white/5">
            <div className="h-full bg-gradient-to-r from-sky-500 to-violet-500 transition-all duration-700"
              style={{ width: questionCount > 0 && displayIndex >= 0 ? `${((displayIndex + 1) / questionCount) * 100}%` : "0%" }} />
          </div>

          <div className="p-8 md:p-10">
            <div className="flex items-center justify-between mb-6">
              <span className="text-slate-500 text-sm tracking-wide">
                {displayIndex === -1 ? "Introduction" : `Question ${displayIndex + 1} of ${questionCount}`}
              </span>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${currentStatus.dot}`} />
                <span className={`text-sm font-medium ${currentStatus.color}`}>{currentStatus.text}</span>
              </div>
            </div>

            <div className="rounded-2xl p-6 mb-8 min-h-[120px] flex items-center justify-center text-center"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-white/90 text-lg leading-relaxed font-light">
                {status === "connecting" ? "Establishing secure connection..."
                  : status === "uploading" ? (uploadProgress || "Saving your interview...")
                  : displayIndex === -1 ? "Please introduce yourself to the interviewer."
                  : allquestions?.[displayIndex]?.question || "Preparing next question..."}
              </p>
            </div>

            {/* Avatar */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className={`absolute inset-0 rounded-full transition-all duration-500 ${
                  status === "speaking" ? "scale-125 opacity-30 bg-sky-500 blur-xl animate-pulse"
                  : status === "listening" ? "scale-125 opacity-20 bg-emerald-500 blur-xl animate-pulse"
                  : "scale-100 opacity-0"}`} />
                <div className="w-20 h-20 rounded-full flex items-center justify-center relative z-10"
                  style={{ background: "linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)", border: "2px solid rgba(255,255,255,0.1)" }}>
                  <svg viewBox="0 0 24 24" fill="none" className="w-9 h-9 text-white" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                  </svg>
                </div>
                {(status === "speaking" || status === "listening") && (
                  <div className="absolute -right-8 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i}
                        className={`w-1 rounded-full ${status === "speaking" ? "bg-sky-400" : "bg-emerald-400"}`}
                        style={{ height: `${8 + i * 5}px`, animation: `waveBounce 0.8s ease-in-out ${i * 0.1}s infinite alternate` }} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center">
              {status !== "uploading" && (
                <button onClick={handleStopAndUpload}
                  className="px-8 py-3.5 rounded-xl font-semibold text-white/80 border border-white/10 transition-all duration-200 hover:bg-white/5 hover:scale-105 active:scale-95">
                  End Interview
                </button>
              )}
            </div>
          </div>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6 tracking-wide">
          🔴 Recording in progress · Browser TTS · OpenAI Whisper VAD
        </p>
      </div>

      <style>{`
        @keyframes waveBounce {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1.4); }
        }
      `}</style>
    </div>
  );
};

/* ── Reusable sub-components ─────────────────────────────────────────────── */

const SetupScreen = ({ icon, title, description, buttonText, onAction, error, step, totalSteps, note }) => (
  <div className="min-h-screen flex items-center justify-center p-6"
    style={{ background: "radial-gradient(ellipse at 20% 50%, #0d1f3c 0%, #0a0f1e 50%, #07080f 100%)" }}>
    <div className="w-full max-w-md text-center">
      <div className="flex justify-center gap-2 mb-8">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className={`h-1 w-16 rounded-full transition-all ${i < step ? "bg-sky-500" : "bg-white/10"}`} />
        ))}
      </div>
      <div className="text-6xl mb-6">{icon}</div>
      <h2 className="text-3xl font-bold text-white mb-3">{title}</h2>
      <p className="text-slate-400 mb-4 leading-relaxed">{description}</p>
      {note && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 mb-4 text-amber-300 text-sm">{note}</div>
      )}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 mb-4 text-rose-400 text-sm">{error}</div>
      )}
      <button onClick={onAction}
        className="w-full py-4 rounded-xl font-bold text-white text-lg transition-all duration-200 hover:scale-105 active:scale-95"
        style={{ background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)", boxShadow: "0 4px 24px rgba(99,102,241,0.4)" }}>
        {buttonText}
      </button>
      <p className="text-slate-500 text-xs mt-4">Step {step} of {totalSteps}</p>
    </div>
  </div>
);

const CheckItem = ({ label, checked }) => (
  <div className="flex items-center gap-3">
    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${checked ? "bg-emerald-500/20" : "bg-white/5"}`}>
      {checked && <span className="text-emerald-400 text-xs">✓</span>}
    </div>
    <span className={`text-sm ${checked ? "text-white/80" : "text-slate-500"}`}>{label}</span>
  </div>
);

export default InterviewRoom;