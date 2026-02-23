// export  class WebRTCService {
//   constructor(onMessage, onConnectionStateChange) {
//     this.pc = null;
//     this.dc = null;
//     this.onMessage = onMessage;
//     this.onConnectionStateChange = onConnectionStateChange;
//   }

//   async connect(token) {
//     if (!token) throw new Error("Token missing");

//     // 1️⃣ Create peer connection
//     this.pc = new RTCPeerConnection();

//     this.pc.onconnectionstatechange = () => {
//       this.onConnectionStateChange(this.pc.connectionState);
//     };

//     // 2️⃣ Play AI audio when received
//     this.pc.ontrack = (event) => {
//       const audio = document.createElement("audio");
//       audio.srcObject = event.streams[0];
//       audio.autoplay = true;
//     };

//     // 3️⃣ Get microphone
//     const stream = await navigator.mediaDevices.getUserMedia({
//       audio: true,
//     });

//     stream.getTracks().forEach((track) => {
//       this.pc.addTrack(track, stream);
//     });

//     // 4️⃣ Data channel
//     this.dc = this.pc.createDataChannel("oai-events");

//     this.dc.onmessage = (event) => {
//       this.onMessage(JSON.parse(event.data));
//     };

//     // 5️⃣ Create offer
//     const offer = await this.pc.createOffer();
//     await this.pc.setLocalDescription(offer);

//     // 6️⃣ Send SDP to OpenAI
//     const response = await fetch(
//       "https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview",
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/sdp",
//         },
//         body: offer.sdp,
//       }
//     );

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error("Realtime Error:", errorText);
//       throw new Error(errorText);
//     }

//     const answer = await response.text();

//     await this.pc.setRemoteDescription({
//       type: "answer",
//       sdp: answer,
//     });
//   }

//   sendMessage(message) {
//     if (this.dc && this.dc.readyState === "open") {
//       this.dc.send(JSON.stringify(message));
//     }
//   }

//   disconnect() {
//     if (this.pc) {
//       this.pc.close();
//     }
//   }
// }



export class WebRTCService {
  constructor(onMessage, onConnectionStateChange) {
    this.pc = null;
    this.dc = null;
    this.onMessage = onMessage;
    this.onConnectionStateChange = onConnectionStateChange;
  }

  async connect(token) {
    if (!token) throw new Error("Token missing");

    this.pc = new RTCPeerConnection();

    this.pc.onconnectionstatechange = () => {
      this.onConnectionStateChange(this.pc.connectionState);
    };

    this.pc.ontrack = (event) => {
      const audio = document.createElement("audio");
      audio.srcObject = event.streams[0];
      audio.autoplay = true;
    };

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => {
      this.pc.addTrack(track, stream);
    });

    this.dc = this.pc.createDataChannel("oai-events");

    this.dc.onmessage = (event) => {
      this.onMessage(JSON.parse(event.data));
    };

    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);

    const response = await fetch(
      "https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview",
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
      throw new Error(await response.text());
    }

    const answer = await response.text();

    await this.pc.setRemoteDescription({
      type: "answer",
      sdp: answer,
    });
  }

  sendMessage(message) {
    if (this.dc && this.dc.readyState === "open") {
      this.dc.send(JSON.stringify(message));
    }
  }

  disconnect() {
    if (this.pc) this.pc.close();
  }
}