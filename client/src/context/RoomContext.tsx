import { createContext, useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import { useNavigate } from "react-router-dom";
import Peer from "peerjs";
import { v4 as uuidv4 } from "uuid";

const WS = "http://192.168.4.153:8080";

export const RoomContext = createContext<null | any>(null);

const ws = socketIOClient(WS);

export const RoomProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [me, setMe] = useState<Peer>();
  const [stream, setStream] = useState<MediaStream | null>();
  const enterRoom = ({ roomId }: { roomId: string }) => {
    console.log({ roomId });
    navigate(`/room/${roomId}`);
  };

  const getUsers = ({ participants }: { participants: string[] }) => {
    console.log({ participants });
  };

  useEffect(() => {
    const meId = uuidv4();

    const peer = new Peer(meId);
    setMe(peer);

    // async function enableStream() {
    //   try {
    //     const st = await navigator.mediaDevices.getUserMedia({
    //       video: true,
    //       audio: true,
    //     });

    //     console.log("_dp stream", st);

    //     setStream(st);
    //   } catch (error) {
    //     console.error(error);
    //   }
    // }

    // enableStream();

    const askPermission = async (): Promise<MediaStream | null> =>
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    let localstream: MediaStream | null;
    askPermission()
      .then((response) => {
        localstream = response;
      })
      .then(() => {
        localstream?.getTracks().forEach((track) => {
          track.stop();
        });
      });

    ws.on("room-created", enterRoom);
    ws.on("get-users", getUsers);
  }, []);

  return (
    <RoomContext.Provider value={{ ws, me, stream }}>
      {children}
    </RoomContext.Provider>
  );
};
