/**
 * RecordingService
 * ─────────────────
 * Handles:
 *  1. Camera + mic access
 *  2. Screen share access
 *  3. Combined MediaRecorder (camera PiP over screen)
 *  4. Uploading recorded blob to backend
 */
export class RecordingService {
  constructor() {
    this.cameraStream = null;
    this.screenStream = null;
    this.combinedStream = null;
    this.mediaRecorder = null;
    this.chunks = [];
    this.canvas = null;
    this.ctx = null;
    this.animationFrame = null;
    this.cameraVideo = null;
    this.screenVideo = null;
    this.isRecording = false;
  }

  /**
   * Step 1: Request camera + mic
   * Returns { success, error }
   */
  async requestCamera() {
    try {
      this.cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: "user" },
        audio: true,
      });
      console.log("✅ Camera access granted");
      return { success: true };
    } catch (err) {
      console.error("❌ Camera error:", err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Step 2: Request screen share
   * Returns { success, error }
   */
  async requestScreen() {
    try {
      this.screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: "monitor" },
        audio: false, // screen audio optional
      });

      // Handle user clicking "Stop Sharing" button
      this.screenStream.getVideoTracks()[0].onended = () => {
        console.warn("⚠️ Screen share stopped by user");
        if (this.onScreenShareStopped) this.onScreenShareStopped();
      };

      console.log("✅ Screen share granted");
      return { success: true };
    } catch (err) {
      console.error("❌ Screen share error:", err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Step 3: Start recording
   * Combines screen + camera-in-picture onto a canvas, records it.
   * @param {function} onScreenShareStopped - called if user stops screen share mid-interview
   */
  async startRecording(onScreenShareStopped) {
    this.onScreenShareStopped = onScreenShareStopped;
    this.chunks = [];

    // Create hidden video elements to draw from
    this.screenVideo = document.createElement("video");
    this.screenVideo.srcObject = this.screenStream;
    this.screenVideo.muted = true;
    await this.screenVideo.play();

    this.cameraVideo = document.createElement("video");
    this.cameraVideo.srcObject = this.cameraStream;
    this.cameraVideo.muted = true;
    await this.cameraVideo.play();

    // Canvas: full HD recording
    this.canvas = document.createElement("canvas");
    this.canvas.width = 1280;
    this.canvas.height = 720;
    this.ctx = this.canvas.getContext("2d");

    // Draw loop: screen background + camera PiP (bottom-right)
    const draw = () => {
      if (!this.isRecording) return;

      const W = this.canvas.width;
      const H = this.canvas.height;
      const pipW = 240;
      const pipH = 135;
      const pipX = W - pipW - 16;
      const pipY = H - pipH - 16;

      // Draw screen capture as background
      this.ctx.drawImage(this.screenVideo, 0, 0, W, H);

      // Draw camera as PiP with rounded border
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.roundRect(pipX, pipY, pipW, pipH, 8);
      this.ctx.clip();
      this.ctx.drawImage(this.cameraVideo, pipX, pipY, pipW, pipH);
      this.ctx.restore();

      // PiP border
      this.ctx.strokeStyle = "rgba(99,179,237,0.8)";
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.roundRect(pipX, pipY, pipW, pipH, 8);
      this.ctx.stroke();

      this.animationFrame = requestAnimationFrame(draw);
    };

    // Capture canvas stream at 30fps
    const canvasStream = this.canvas.captureStream(30);

    // Add audio from camera mic
    const audioTrack = this.cameraStream.getAudioTracks()[0];
    if (audioTrack) canvasStream.addTrack(audioTrack);

    this.combinedStream = canvasStream;

    // Start MediaRecorder
    const mimeType = this._getSupportedMimeType();
    this.mediaRecorder = new MediaRecorder(canvasStream, { mimeType });

    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        this.chunks.push(e.data);
      }
    };

    this.isRecording = true;
    this.mediaRecorder.start(1000); // collect data every 1 second
    draw();

    console.log("🔴 Recording started with mime:", mimeType);
  }

  /**
   * Step 4: Stop recording and return the blob
   * Returns Promise<Blob>
   */
  stopRecording() {
    return new Promise((resolve) => {
      this.isRecording = false;

      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
      }

      if (!this.mediaRecorder || this.mediaRecorder.state === "inactive") {
        resolve(null);
        return;
      }

      this.mediaRecorder.onstop = () => {
        const mimeType = this._getSupportedMimeType();
        const blob = new Blob(this.chunks, { type: mimeType });
        console.log("✅ Recording stopped. Size:", (blob.size / 1024 / 1024).toFixed(2), "MB");
        resolve(blob);
      };

      this.mediaRecorder.stop();
    });
  }

  /**
   * Step 5: Upload recording blob to backend
   * @param {Blob} blob - recorded video blob
   * @param {string} token - interview token (used as identifier)
   * @param {string} uploadUrl - your backend endpoint
   */
  async uploadRecording(blob, token, uploadUrl) {
    try {
      const ext = this._getSupportedMimeType().includes("mp4") ? "mp4" : "webm";
      const filename = `interview_${token}_${Date.now()}.${ext}`;

      const formData = new FormData();
      formData.append("recording", blob, filename);
      formData.append("token", token);

      console.log("⬆️ Uploading recording:", filename);

      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
        // Don't set Content-Type — browser sets it with boundary for FormData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Upload success:", data);
      return { success: true, data };
    } catch (err) {
      console.error("❌ Upload error:", err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Get camera stream for preview (attach to a <video> element)
   */
  getCameraStream() {
    return this.cameraStream;
  }

  /**
   * Cleanup all streams
   */
  cleanup() {
    this.isRecording = false;
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
    this.cameraStream?.getTracks().forEach((t) => t.stop());
    this.screenStream?.getTracks().forEach((t) => t.stop());
    this.cameraStream = null;
    this.screenStream = null;
    this.combinedStream = null;
    this.chunks = [];
  }

  _getSupportedMimeType() {
    const types = [
      "video/webm;codecs=vp9,opus",
      "video/webm;codecs=vp8,opus",
      "video/webm",
      "video/mp4",
    ];
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) return type;
    }
    return "video/webm";
  }
}