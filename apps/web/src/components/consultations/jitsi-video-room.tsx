"use client";

import { JitsiMeeting } from "@jitsi/react-sdk";

interface JitsiVideoRoomProps {
  jitsiUrl: string;
  roomName: string;
  userName?: string;
  onReady?: () => void;
  onConferenceLeft?: () => void;
}

export function JitsiVideoRoom({
  jitsiUrl,
  roomName,
  userName = "Healio User",
  onReady,
  onConferenceLeft,
}: JitsiVideoRoomProps) {
  const roomId = jitsiUrl.replace("https://meet.jit.si/", "").replace("https://meet.jit.si", "");

  return (
    <div className="w-full h-full bg-gray-900 rounded-lg overflow-hidden">
      <JitsiMeeting
        roomName={roomId}
        configOverwrite={{
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          prejoinPageEnabled: false,
          disableDeepLinking: true,
          disableInviteFunctions: true,
          disableThirdPartyRequests: true,
          toolbarButtons: [
            "microphone",
            "camera",
            "desktop",
            "fullscreen",
            "floating",
            "hangup",
            "chat",
            "settings",
            "tileview",
          ],
        }}
        interfaceConfigOverwrite={{
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          DEFAULT_BACKGROUND: "#111827",
          TOOLBAR_BUTTONS: [
            "microphone",
            "camera",
            "desktop",
            "fullscreen",
            "floating",
            "hangup",
            "chat",
            "settings",
          ],
          VERTICAL_FILMSTRIP: true,
          filmStripOnly: false,
          SHOW_BRAND_WATERMARK: false,
          SHOW_POWERED_BY: false,
          SHOW_TROUBLE_SHOOTING: false,
        }}
        userInfo={{
          displayName: userName,
          email: "user@healio.app",
        }}
        getIFrameRef={(parentNode: HTMLDivElement) => {
          if (parentNode) {
            parentNode.style.height = "100%";
            parentNode.style.width = "100%";
          }
        }}
        onApiReady={(api) => {
          console.log("Jitsi API ready");
          onReady?.();
          api.addListener("videoConferenceLeft", () => {
            console.log("Conference left");
            onConferenceLeft?.();
          });
        }}
      />
    </div>
  );
}