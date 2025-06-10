import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  OpenVidu,
  Device as OpenViduDevice,
  Session as OpenViduSession,
} from "openvidu-browser";

const createSession = async (sessionId: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/sessions`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customSessionId: sessionId }),
    },
  );
  if (!response.ok) {
    throw new Error("Failed to create session");
  }
  return await response.text(); // The sessionId
};
const createToken = async (sessionId: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/sessions/${sessionId}/connections`,
    { method: "POST", headers: { "Content-Type": "application/json" } },
  );
  if (!response.ok) {
    throw new Error("Failed to create token");
  }
  return await response.text(); // The token
};

const getToken = async (mySessionId: string) => {
  const sessionId = await createSession(mySessionId);
  const token = await createToken(sessionId);
  return token;
};

const OpenViduContext = createContext<OpenVidu | null>(null);

export const OpenViduProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const ovRef = useRef<OpenVidu>(new OpenVidu());

  return (
    <OpenViduContext.Provider value={ovRef.current}>
      {children}
    </OpenViduContext.Provider>
  );
};

export const useOpenVidu = () => {
  const context = useContext(OpenViduContext);
  if (!context) {
    throw new Error("useOpenVidu must be used within an OpenViduProvider");
  }
  return context;
};

const useOpenViduDevices = () => {
  const ov = useOpenVidu();
  const [devices, setDevices] = useState<OpenViduDevice[] | null>(null);

  useEffect(() => {
    ov.getDevices().then((devices) => {
      setDevices(devices);
    });

    return () => {
      setDevices(null);
    };
  }, [ov]);

  return devices;
};

export const useOpenViduSession = (mySessionId: string, myUserName: string) => {
  const ov = useOpenVidu();
  const [session, setSession] = useState<OpenViduSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const mainVideoRef = useRef<HTMLVideoElement | null>(null);
  const videoContainerRef = useRef<HTMLDivElement | null>(null);

  const [remotes, setRemotes] = useState<
    { uid: string; element: HTMLVideoElement }[]
  >([]);

  const devices = useOpenViduDevices();
  const audioDevices = useMemo(() => {
    return devices ? devices.filter((d) => d.kind === "audioinput") : [];
  }, [devices]);
  const [selectedAudioDevice, setSelectedAudioDevice] =
    useState<OpenViduDevice>();

  useEffect(() => {
    const videoContainer = videoContainerRef.current;
    const mainVideo = mainVideoRef.current;
    if (!videoContainer || !mainVideo) return;

    setIsLoading(true);
    const session = ov.initSession();

    session.on("streamCreated", (event) => {
      const subscriber = session.subscribe(event.stream, videoContainer);

      subscriber.on("videoElementCreated", (event) => {
        setRemotes((prevRemotes) => [
          ...prevRemotes,
          {
            uid: subscriber.stream.connection.connectionId,
            // subscriber,
            // connection: subscriber.stream.connection,
            element: event.element,
          },
        ]);
      });
    });

    session.on("streamDestroyed", (event) => {
      setRemotes((prevRemotes) =>
        prevRemotes.filter(
          (remote) => remote.uid !== event.stream.connection.connectionId,
        ),
      );
    });

    session.on("exception", (exception) => {
      console.warn(exception);
    });

    (async () => {
      try {
        const token = await getToken(mySessionId);
        await session.connect(token, { clientData: myUserName });

        // --- 6) Get your own camera stream with the desired properties ---

        const publisher = ov.initPublisher("video-container", {
          audioSource: selectedAudioDevice
            ? selectedAudioDevice.deviceId
            : undefined, // The source of audio. If undefined default microphone
          videoSource: false, // The source of video. If undefined default webcam
          publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
          publishVideo: false, // Whether you want to start publishing with your video enabled or not
          // resolution: "640x480", // The resolution of your video
          // frameRate: 30, // The frame rate of your video
          // insertMode: "APPEND", // How the video is inserted in the target element 'video-container'
          // mirror: false, // Whether to mirror your local video or not
        });

        publisher.on("videoElementCreated", function (event) {
          // initMainVideo(event.element, myUserName);

          // // 내 비디오 소스 추가
          // document.querySelector("#main-video video").srcObject =
          //   event.element.srcObject;
          // document.querySelector("#main-video video")["muted"] = true;
          // document.querySelector("#main-video p").innerHTML = myUserName;
          mainVideo.srcObject = event.element.srcObject;
          mainVideo.muted = true;

          // // 내 정보 추가
          // appendUserData(event.element, myUserName);
          setRemotes((prevRemotes) => [
            ...prevRemotes,
            {
              uid: myUserName,
              // subscriber,
              // connection: subscriber.stream.connection,
              element: event.element,
            },
          ]);
          event.element["muted"] = true;
        });

        session.publish(publisher);

        setSession(session);
      } catch (error) {
        console.error("Error connecting to OpenVidu session:", error);
        setError(error instanceof Error ? error : new Error("Unknown error"));
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    })();

    return () => {
      session.disconnect();
      setSession(null);
      setIsLoading(false);
    };
  }, [ov, mySessionId, myUserName, selectedAudioDevice]);

  return {
    mainVideoRef,
    videoContainerRef,
    session,
    isLoading,
    error,
    remotes,
    audioDevices,
    selectedAudioDevice,
    setSelectedAudioDevice,
  };
};
