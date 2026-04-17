'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Video, {
  connect,
  LocalVideoTrack,
  LocalAudioTrack,
  RemoteParticipant,
  RemoteTrack,
  RemoteVideoTrack,
  RemoteAudioTrack,
} from 'twilio-video';

interface TwilioVideoRoomProps {
  token: string;
  roomName: string;
  onParticipantConnected?: (participant: RemoteParticipant) => void;
  onParticipantDisconnected?: (participant: RemoteParticipant) => void;
  onError?: (error: Error) => void;
}

interface LocalParticipantDisplay {
  identity: string;
  videoTrack?: LocalVideoTrack;
}

interface ParticipantVideoProps {
  participant: RemoteParticipant | LocalParticipantDisplay;
  isLocal?: boolean;
}

function ParticipantVideo({ participant, isLocal }: ParticipantVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  const isRemote = 'sid' in participant;

  useEffect(() => {
    if (!isRemote) return;

    const remoteParticipant = participant as RemoteParticipant;

    const videoTrackSubscribed = (track: RemoteVideoTrack) => {
      if (videoRef.current && track.attach) {
        videoRef.current.srcObject = track.attach().srcObject;
      }
    };

    const audioTrackSubscribed = (track: RemoteAudioTrack) => {
      if (track.attach) {
        const audioElement = track.attach();
        audioElement.autoplay = true;
        audioElement.play();
      }
    };

    remoteParticipant.on('trackSubscribed', videoTrackSubscribed);
    remoteParticipant.on('trackSubscribed', audioTrackSubscribed);

    const tracks = Array.from(remoteParticipant.tracks.values());
    tracks.forEach((publication) => {
      if (publication.isSubscribed && publication.track) {
        if (publication.track.kind === 'video') {
          videoTrackSubscribed(publication.track as RemoteVideoTrack);
        } else if (publication.track.kind === 'audio') {
          audioTrackSubscribed(publication.track as RemoteAudioTrack);
        }
      }
    });

    return () => {
      remoteParticipant.removeAllListeners();
    };
  }, [participant, isRemote]);

  useEffect(() => {
    if (!isLocal) return;

    const localParticipant = participant as LocalParticipantDisplay;
    if (localParticipant.videoTrack && videoRef.current) {
      const track = localParticipant.videoTrack;
      if (track.attach) {
        const mediaEl = track.attach() as HTMLVideoElement;
        mediaEl.autoplay = true;
        mediaEl.playsInline = true;
      }
    }
  }, [participant, isLocal]);

  const identity = isLocal
    ? 'You'
    : isRemote
      ? (participant as RemoteParticipant).identity
      : 'Unknown';

  return (
    <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-full">
        <span className="text-white text-sm">{identity}</span>
      </div>
      {!isVideoEnabled && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <div className="w-20 h-20 bg-gray-700 rounded-full" />
        </div>
      )}
    </div>
  );
}

export function TwilioVideoRoom({
  token,
  roomName,
  onParticipantConnected,
  onParticipantDisconnected,
  onError,
}: TwilioVideoRoomProps) {
  const [room, setRoom] = useState<Video.Room | null>(null);
  const [localTracks, setLocalTracks] = useState<
    (LocalVideoTrack | LocalAudioTrack)[]
  >([]);
  const [remoteParticipants, setRemoteParticipants] = useState<
    RemoteParticipant[]
  >([]);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const connectToRoom = async () => {
      try {
        setIsConnecting(true);
        setConnectionError(null);

        const localTracks = (await Video.createLocalTracks({
          audio: true,
          video: { width: 1280, height: 720 },
        })) as (LocalVideoTrack | LocalAudioTrack)[];

        if (!mounted) {
          localTracks.forEach((track) => track.stop());
          return;
        }

        setLocalTracks(localTracks);

        const connectedRoom = await connect(token, {
          name: roomName,
          tracks: localTracks,
          dominantSpeaker: true,
        });

        setRoom(connectedRoom);

        const participants = Array.from(connectedRoom.participants.values());
        setRemoteParticipants(participants);

        connectedRoom.on('participantConnected', (participant) => {
          setRemoteParticipants((prev) => [...prev, participant]);
          onParticipantConnected?.(participant);
        });

        connectedRoom.on('participantDisconnected', (participant) => {
          setRemoteParticipants((prev) =>
            prev.filter((p) => p.sid !== participant.sid),
          );
          onParticipantDisconnected?.(participant);
        });

        connectedRoom.on('disconnected', () => {
          setRoom(null);
          localTracks.forEach((track) => track.stop());
        });

        connectedRoom.on('trackDisabled', (track) => {
          if (track.kind === 'video') setIsVideoEnabled(false);
          if (track.kind === 'audio') setIsAudioEnabled(false);
        });

        connectedRoom.on('trackEnabled', (track) => {
          if (track.kind === 'video') setIsVideoEnabled(true);
          if (track.kind === 'audio') setIsAudioEnabled(true);
        });

        setIsConnecting(false);
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : 'Failed to connect to video room';
        console.error('Failed to connect to room:', error);
        setConnectionError(message);
        setIsConnecting(false);
        onError?.(new Error(message));
      }
    };

    connectToRoom();

    return () => {
      mounted = false;
      if (room) {
        room.disconnect();
      }
      localTracks.forEach((track) => {
        if ('stop' in track && typeof track.stop === 'function') {
          (track as LocalVideoTrack | LocalAudioTrack).stop();
        }
      });
    };
  }, [token, roomName]);

  const toggleVideo = useCallback(() => {
    localTracks.forEach((track) => {
      if (track.kind === 'video') {
        if (isVideoEnabled) {
          track.disable();
        } else {
          track.enable();
        }
      }
    });
    setIsVideoEnabled(!isVideoEnabled);
  }, [localTracks, isVideoEnabled]);

  const toggleAudio = useCallback(() => {
    localTracks.forEach((track) => {
      if (track.kind === 'audio') {
        if (isAudioEnabled) {
          track.disable();
        } else {
          track.enable();
        }
      }
    });
    setIsAudioEnabled(!isAudioEnabled);
  }, [localTracks, isAudioEnabled]);

  if (connectionError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-lg">
        <div className="text-center">
          <p className="text-red-400 mb-2">Connection Error</p>
          <p className="text-gray-400 text-sm">{connectionError}</p>
        </div>
      </div>
    );
  }

  if (isConnecting) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-lg">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Connecting to video room...</p>
        </div>
      </div>
    );
  }

  const localParticipantDisplay: LocalParticipantDisplay = {
    identity: 'You',
    videoTrack: localTracks.find((t) => t.kind === 'video') as
      | LocalVideoTrack
      | undefined,
  };

  return (
    <div className="w-full h-full relative">
      {remoteParticipants.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 h-full">
          <ParticipantVideo
            key="local"
            participant={localParticipantDisplay}
            isLocal
          />
          {remoteParticipants.map((participant) => (
            <ParticipantVideo key={participant.sid} participant={participant} />
          ))}
        </div>
      ) : (
        <ParticipantVideo
          key="local"
          participant={localParticipantDisplay}
          isLocal
        />
      )}
    </div>
  );
}

export function useVideoControls() {
  return {
    isVideoEnabled: true,
    isAudioEnabled: true,
    toggleVideo: () => {},
    toggleAudio: () => {},
  };
}
