import React, { createContext, useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";

const SocketContext = createContext();

const socket = io("http://localhost:5000");

const ContextProvider = ({ children }) => {
  const [calling, setCalling] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const [stream, setStream] = useState(null);
  const [call, setCall] = useState(null);
  const [me, setMe] = useState(null);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        myVideo.current.srcObject = currentStream;
      });

    socket.on("me", (id) => {
      setMe(id);
      console.log(id);
    });

    socket.on("incomingCall", ({ signal, from }) => {
      setCall({ from, signal });
    });

    socket.on("callEnded", () => {
      setCalling(false);
      setCallAccepted(false);
      setCall(null);
    });
  }, []);

  const callUser = (id) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });
    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
      });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.on("callAccepted", ({ signal }) => {
      setCallAccepted(true);
      setCall({ from: id, signal });
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("answerCall", {
        signalData: data,
        idFromCall: call.from,
      });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const leaveCall = async (id) => {
    setCallAccepted(false);
    setCalling(false);
    setCall(null);
    socket.emit("callEnded", id, () => {
      connectionRef.current.destroy();
    });
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        call,
        calling,
        callAccepted,
        myVideo,
        userVideo,
        setCalling,
        callUser,
        leaveCall,
        answerCall,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
