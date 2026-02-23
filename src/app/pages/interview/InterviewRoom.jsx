// import { useParams } from "react-router";
// import { createSession, getQuestion } from "../../Reducer/QuestionSlice";
// import { WebRTCService } from "./webrtcService";
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect, useRef, useState } from "react";
// import * as vad from "@ricky0123/vad-web";

// const InterviewRoom = () => {
//   const { token } = useParams();
//   const dispatch = useDispatch();

//   const {
//     allquestions,
//     loadingQuestions,
//     loadingSession,
//     error,
//   } = useSelector((state) => state.questions);

//   const webrtcRef = useRef(null);
//   const vadRef = useRef(null);

//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [status, setStatus] = useState("waiting"); // waiting | connecting | speaking | listening | finished

//   useEffect(() => {
//     if (token) {
//       dispatch(getQuestion({ token }));
//     }
//   }, [token, dispatch]);

//   /* ==============================
//      START INTERVIEW
//   ============================== */
//   const startInterview = async () => {
//     setStatus("connecting");

//     const result = await dispatch(createSession());

//     if (createSession.fulfilled.match(result)) {
//         console.log("result.payload",result.payload);
        
//        const clientSecret = result.payload.client_secret;

//       webrtcRef.current = new WebRTCService(
//         handleMessage,
//         handleConnectionChange
//       );

//       await webrtcRef.current.connect(clientSecret);
//        webrtcRef.current.sendMessage({
//       type: "response.create",
//       response: {
//         instructions:
//           "Start the interview. Speak only English. Ask a Java interview question.",
//       },
//     });
  
//     }
//   };

//   console.log("allquestions",allquestions);

  
//   const handleConnectionChange = async (state) => {
//     if (state === "connected") {
//       askQuestion(0);
//       initVAD();
//     }
//   };

//   const handleMessage = (event) => {
//     console.log("AI:", event.data);
//   };

//   /* ==============================
//      ASK QUESTION
//   ============================== */
//   const askQuestion = (index) => {
//     if (!allquestions || allquestions.length === 0) return;

//     setStatus("speaking");

//     webrtcRef.current.send({
//       type: "response.create",
//       response: {
//         instructions: `
//         Ask this question clearly and wait for the candidate answer:
//         ${allquestions[index].questionText}
//         `,
//       },
//     });

//     setCurrentIndex(index);

//     // After 3 seconds assume AI finished speaking
//     setTimeout(() => {
//       setStatus("listening");
//     }, 3000);
//   };

//   /* ==============================
//      NEXT QUESTION
//   ============================== */
//   const nextQuestion = () => {
//     const nextIndex = currentIndex + 1;

//     if (nextIndex < allquestions.length) {
//       askQuestion(nextIndex);
//     } else {
//       setStatus("finished");
//     }
//   };

//   /* ==============================
//      VAD (Voice Detection)
//   ============================== */
//   const initVAD = async () => {
//     const myvad = await vad.MicVAD.new({
//       onSpeechEnd: () => {
//         nextQuestion();
//       },
//     });

//     myvad.start();
//     vadRef.current = myvad;
//   };

//   /* ==============================
//      END INTERVIEW
//   ============================== */
//   const endInterview = () => {
//     if (vadRef.current) vadRef.current.pause();
//     if (webrtcRef.current) webrtcRef.current.disconnect();
//     setStatus("finished");
//   };

//   if (loadingQuestions)
//     return <div className="text-center mt-20 text-xl">Loading Questions...</div>;

//   if (error)
//     return <div className="text-center mt-20 text-red-500">{error}</div>;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-700 to-indigo-800 flex items-center justify-center p-6">
//       <div className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-2xl w-full max-w-3xl p-10 text-white">

//         <h1 className="text-3xl font-bold text-center mb-8">
//           AI Interview Room
//         </h1>

//         {/* Question Progress */}
//         <div className="mb-6 text-center">
//           Question {currentIndex + 1} of {allquestions.length}
//         </div>

//         {/* Question Display */}
//         <div className="bg-white/20 p-6 rounded-xl text-lg text-center mb-8 min-h-[100px] flex items-center justify-center">
//           {allquestions[currentIndex]?.question}
//         </div>

//         {/* Status Indicator */}
//         <div className="text-center mb-6">
//           {status === "speaking" && (
//             <div className="animate-pulse text-yellow-300">
//               AI is speaking...
//             </div>
//           )}
//           {status === "listening" && (
//             <div className="text-green-400">
//               Listening to your answer...
//             </div>
//           )}
//           {status === "connecting" && (
//             <div>Connecting to AI...</div>
//           )}
//           {status === "finished" && (
//             <div className="text-red-400 text-xl">
//               Interview Completed
//             </div>
//           )}
//         </div>

//         {/* Buttons */}
//         <div className="flex justify-center gap-6">

//           {status === "waiting" && (
//             <button
//               onClick={startInterview}
//               disabled={loadingSession}
//               className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg transition"
//             >
//               {loadingSession ? "Starting..." : "Start Interview"}
//             </button>
//           )}

//           {status !== "finished" && status !== "waiting" && (
//             <button
//               onClick={endInterview}
//               className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg transition"
//             >
//               End Interview
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InterviewRoom;




import { useParams } from "react-router";
import { createSession, getQuestion } from "../../Reducer/QuestionSlice";
import { WebRTCService } from "./webrtcService";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";

const InterviewRoom = () => {
  const { token } = useParams();
  const dispatch = useDispatch();

  const {
    allquestions,
    loading,
    clientKey,
    error,
  } = useSelector((state) => state.questions);

  const webrtcRef = useRef(null);
  const currentIndexRef = useRef(-1);

  const [status, setStatus] = useState("waiting");

  useEffect(() => {
    if (token) {
      dispatch(getQuestion({ token }));
    }
  }, [token, dispatch]);

  /* ==============================
     START INTERVIEW
  ============================== */
//   const startInterview = async () => {
//     setStatus("connecting");

//     const result = await dispatch(createSession());

//     if (createSession.fulfilled.match(result)) {
//         console.log("result.payload.client_secret",result.payload);
        
//       const clientSecret =result.payload.client_secret.value; // now string

//       webrtcRef.current = new WebRTCService(
//         handleMessage,
//         handleConnectionChange
//       );

//       await webrtcRef.current.connect(clientSecret);
//     }
//   };

  

const startInterview = async () => {
  try {
    setStatus("connecting");

    const result = await dispatch(createSession());
    console.log(result,"result");
    

    if (!createSession.fulfilled.match(result)) {
      throw new Error("Session creation failed");
    }

    const clientSecret =
      result.payload?.client_secret?.value;

    if (!clientSecret) {
      throw new Error("Client secret missing");
    }

    webrtcRef.current = new WebRTCService(
      handleMessage,
      handleConnectionChange
    );

    await webrtcRef.current.connect(clientSecret);
  } catch (err) {
    console.error("Start Interview Error:", err);
    setStatus("waiting");
  }
};




/* ==============================
     CONNECTION READY
  ============================== */
  const handleConnectionChange = (state) => {
    if (state === "connected") {
      sendGreeting();
    }
  };

  /* ==============================
     HANDLE AI EVENTS
  ============================== */
  const handleMessage = (event) => {
    const msg = JSON.parse(event.data);

    if (msg.type === "response.done") {
      setStatus("listening");

      // If greeting just finished → wait for user intro
      if (currentIndexRef.current === -1) return;

      // If AI asked question → wait for answer
    }

    // When AI finishes processing user speech
    if (msg.type === "conversation.item.input_audio_transcription.completed") {
      handleUserFinishedSpeaking();
    }
  };

  /* ==============================
     GREETING FIRST
  ============================== */
  const sendGreeting = () => {
    setStatus("speaking");

    webrtcRef.current.send({
      type: "response.create",
      response: {
        instructions: `
Say exactly this sentence and nothing else:

"Welcome to the interview. Please introduce yourself."
        `,
      },
    });
  };

  /* ==============================
     USER FINISHED SPEAKING
  ============================== */
  const handleUserFinishedSpeaking = () => {
    if (!allquestions || allquestions.length === 0) return;

    // After intro → ask first question
    if (currentIndexRef.current === -1) {
      currentIndexRef.current = 0;
      askQuestion(0);
      return;
    }

    // Move to next
    currentIndexRef.current++;

    if (currentIndexRef.current < allquestions.length) {
      askQuestion(currentIndexRef.current);
    } else {
      finishInterview();
    }
  };

  /* ==============================
     ASK QUESTION
  ============================== */
  const askQuestion = (index) => {
    setStatus("speaking");

    webrtcRef.current.send({
      type: "response.create",
      response: {
        instructions: `
Say exactly this question and nothing else:

"${allquestions[index].question}"
        `,
      },
    });
  };

  /* ==============================
     FINISH
  ============================== */
  const finishInterview = () => {
    setStatus("speaking");

    webrtcRef.current.send({
      type: "response.create",
      response: {
        instructions: `
Say exactly this sentence and nothing else:

"Thank you for attending the interview. We will get back to you soon."
        `,
      },
    });

    setTimeout(() => {
      setStatus("finished");
    }, 4000);
  };

  const endInterview = () => {
    if (webrtcRef.current) webrtcRef.current.disconnect();
    setStatus("finished");
  };

  if (loading)
    return <div className="text-center mt-20 text-xl">Loading Questions...</div>;

  if (error)
    return (
      <div className="text-center mt-20 text-red-500">
        {typeof error === "string" ? error : "Something went wrong"}
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-indigo-800 flex items-center justify-center p-6">
      <div className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-2xl w-full max-w-3xl p-10 text-white">

        <h1 className="text-3xl font-bold text-center mb-8">
          AI Interview Room
        </h1>

        <div className="mb-6 text-center">
          Question {currentIndexRef.current + 1 > 0 ? currentIndexRef.current + 1 : 0} of {allquestions?.length || 0}
        </div>

        <div className="bg-white/20 p-6 rounded-xl text-lg text-center mb-8 min-h-[100px] flex items-center justify-center">
          {currentIndexRef.current >= 0
            ? allquestions[currentIndexRef.current]?.question
            : "Interview will begin after introduction"}
        </div>

        <div className="text-center mb-6">
          {status === "speaking" && (
            <div className="animate-pulse text-yellow-300">
              AI is speaking...
            </div>
          )}
          {status === "listening" && (
            <div className="text-green-400">
              Listening to your answer...
            </div>
          )}
          {status === "connecting" && <div>Connecting to AI...</div>}
          {status === "finished" && (
            <div className="text-red-400 text-xl">
              Interview Completed
            </div>
          )}
        </div>

        <div className="flex justify-center gap-6">
          {status === "waiting" && (
            <button
              onClick={startInterview}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg transition"
            >
              Start Interview
            </button>
          )}

          {status !== "finished" && status !== "waiting" && (
            <button
              onClick={endInterview}
              className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg transition"
            >
              End Interview
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewRoom;