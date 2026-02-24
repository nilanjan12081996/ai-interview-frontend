export class WebRTCService {
  constructor(onMessage, onConnectionStateChange) {
    this.pc = null;
    this.dc = null;
    this.onMessage = onMessage;
    this.onConnectionStateChange = onConnectionStateChange;
    this.audioEl = null;
    this.synth = window.speechSynthesis;
    this.isSpeaking = false;
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
      // Configure session: only VAD + transcription — NO voice output needed
      // We use browser TTS for speaking, OpenAI only listens to the user
      this.send({
        type: "session.update",
        session: {
          modalities: ["text"],           // text only — no audio output from AI
          input_audio_format: "pcm16",
          input_audio_transcription: {
            model: "whisper-1",
          },
          turn_detection: {
            type: "server_vad",
            threshold: 0.5,
            prefix_padding_ms: 300,
            silence_duration_ms: 1000,   // 1s silence = user done speaking
          },
          // Lock the AI: do not respond conversationally, just transcribe
          instructions:
            "You are a silent transcription service. " +
            "Do NOT generate any responses. Do NOT speak. Do NOT answer questions. " +
            "Your only job is to transcribe what the user says. Stay completely silent.",
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
   * Suppress AI from auto-responding to user speech.
   * After VAD detects the user stopped, OpenAI may try to generate a response.
   * We cancel it immediately since we handle flow control ourselves.
   */
  suppressAIResponse() {
    this.send({ type: "response.cancel" });
  }

  send(message) {
    if (this.dc && this.dc.readyState === "open") {
      this.dc.send(JSON.stringify(message));
    }
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





