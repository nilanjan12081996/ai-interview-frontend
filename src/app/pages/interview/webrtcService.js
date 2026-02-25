export class WebRTCService {
  constructor(onMessage, onConnectionStateChange) {
    this.pc = null;
    this.dc = null;
    this.onMessage = onMessage;
    this.onConnectionStateChange = onConnectionStateChange;
    this.audioEl = null;
    this.synth = window.speechSynthesis;
    this.isSpeaking = false;
    this.currentQuestion = null;  // Store current question for context
    this.followUpCount = 0;        // Track follow-ups per question
    this.maxFollowUps = 2;         // Max follow-ups before moving on
  }

  async connect(token) {
    if (!token) throw new Error("Token missing");

    this.pc = new RTCPeerConnection();

    this.pc.onconnectionstatechange = () => {
      this.onConnectionStateChange(this.pc.connectionState);
    };

    // We still need ontrack to keep WebRTC happy, but we won't play AI audio
    // OpenAI requires a valid audio track setup even if we don't use AI voice
    this.pc.ontrack = () => {};

    // Capture microphone for VAD + Whisper transcription
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => this.pc.addTrack(track, stream));

    this.dc = this.pc.createDataChannel("oai-events");

    this.dc.onopen = () => {
      console.log("✅ Data channel open");
      // Configure session: Adaptive AI interviewer
      this.send({
        type: "session.update",
        session: {
          modalities: ["text"],
          input_audio_format: "pcm16",
          input_audio_transcription: {
            model: "whisper-1",
          },
          turn_detection: {
            type: "server_vad",
            threshold: 0.5,
            prefix_padding_ms: 300,
            silence_duration_ms: 1500,
          },
          instructions: this._getAdaptiveInstructions(),
        },
      });
    };

    this.dc.onmessage = (event) => {
      try {
        this.onMessage(JSON.parse(event.data));
      } catch (e) {
        console.error("Parse error", e);
      }
    };

    this.dc.onerror = (e) => console.error("Data channel error:", e);

    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);

    const response = await fetch(
      "https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/sdp",
        },
        body: offer.sdp,
      }
    );

    if (!response.ok) {
      throw new Error(`OpenAI error: ${await response.text()}`);
    }

    await this.pc.setRemoteDescription({
      type: "answer",
      sdp: await response.text(),
    });
  }

  /**
   * speakExact — uses browser SpeechSynthesis to read text verbatim.
   * This is 100% reliable: the browser reads EXACTLY what you pass in.
   * Returns a Promise that resolves when speaking finishes.
   *
   * @param {string} text - The exact text to speak
   * @param {function} onEnd - Callback when speech finishes
   */
  speakExact(text, onEnd) {
    // Cancel any ongoing speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Configure voice for Indian English accent
    // Try to find an Indian English voice, fall back to en-GB or en-US
    const voices = this.synth.getVoices();
    const indianVoice =
      voices.find((v) => v.lang === "en-IN") ||
      voices.find((v) => v.lang === "en-GB") ||
      voices.find((v) => v.lang.startsWith("en"));

    if (indianVoice) {
      utterance.voice = indianVoice;
      console.log("🎙 Using voice:", indianVoice.name, indianVoice.lang);
    }

    utterance.rate = 0.95;   // slightly slower — clearer for interview context
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    this.isSpeaking = true;

    utterance.onend = () => {
      this.isSpeaking = false;
      console.log("✅ Browser TTS done speaking");
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      this.isSpeaking = false;
      console.error("TTS error:", e);
      if (onEnd) onEnd(); // still advance on error
    };

    this.synth.speak(utterance);
  }

  /**
   * Set the current question context for AI
   * @param {string} question - The current interview question
   * @param {number} index - Question index
   * @param {number} total - Total number of questions
   */
  setCurrentQuestion(question, index = 0, total = 0) {
    this.currentQuestion = question;
    this.followUpCount = 0;
    // Send context to AI
    this.send({
      type: "conversation.item.create",
      item: {
        type: "message",
        role: "system",
        content: [
          {
            type: "input_text",
            text: `CURRENT INTERVIEW QUESTION (${index + 1}/${total}):\n${question}\n\nRemember: analyze the answer and respond accordingly.`,
          },
        ],
      },
    });
  }

  /**
   * Tell AI to move to next question
   */
  signalMoveNext() {
    this.followUpCount = 0;
    this.send({
      type: "conversation.item.create",
      item: {
        type: "message",
        role: "system",
        content: [
          {
            type: "input_text",
            text: "MOVE_TO_NEXT_QUESTION",
          },
        ],
      },
    });
  }

  /**
   * Reset follow-up counter (when moving to new question)
   */
  resetFollowUpCount() {
    this.followUpCount = 0;
  }

  /**
   * Increment follow-up counter
   */
  incrementFollowUp() {
    this.followUpCount++;
  }

  /**
   * Get current follow-up count
   */
  getFollowUpCount() {
    return this.followUpCount;
  }

  /**
   * Suppress AI from auto-responding (kept for backward compatibility)
   * Now only used if we need to cancel an ongoing response
   */
  suppressAIResponse() {
    this.send({ type: "response.cancel" });
  }

  send(message) {
    if (this.dc && this.dc.readyState === "open") {
      this.dc.send(JSON.stringify(message));
    }
  }

  /**
   * Get adaptive AI instructions
   * @private
   */
  _getAdaptiveInstructions() {
    return `You are an adaptive AI interviewer. Your role is to conduct a technical interview.

CONTEXT FLOW:
1. The system will provide you with the current interview question
2. Listen to the candidate's answer
3. After each answer, decide the next action based on quality and completeness

DECISION LOGIC:
- Answer is complete and satisfactory → respond with "NEXT_QUESTION"
- Answer needs more detail/clarification → ask a relevant follow-up question
- Answer shows confusion → provide a hint and rephrase
- Candidate seems stuck → guide them gently
- This is the final question and answer is good → respond with "INTERVIEW_COMPLETE"

RESPONSE FORMAT:
Your response should be ONLY ONE of these:
- "NEXT_QUESTION" - Move to the next pre-defined question
- "INTERVIEW_COMPLETE" - End the interview
- A brief follow-up question (1 sentence max)

RULES:
- Keep follow-ups concise and relevant
- Maximum 2 follow-up questions per main question
- Be encouraging and professional
- Don't repeat the same question
- If the answer demonstrates understanding, move on
- Avoid yes/no follow-ups - ask open-ended questions

EXAMPLE:
User: "I know JavaScript is a programming language."
You: "Can you tell me about some key features that make JavaScript unique?"

User: "JavaScript has closures, prototypes, and is single-threaded with an event loop."
You: "NEXT_QUESTION"`;
  }

  disconnect() {
    this.synth.cancel();
    if (this.audioEl) {
      this.audioEl.srcObject = null;
      this.audioEl.remove();
      this.audioEl = null;
    }
    if (this.dc) this.dc.close();
    if (this.pc) this.pc.close();
    this.dc = null;
    this.pc = null;
  }
}





