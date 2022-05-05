import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import VideoPlayer from "../components/VideoPlayer";
import { RoomContext } from "../context/RoomContext";

const Room = () => {
  const { id } = useParams();
  const { ws, me, stream } = useContext(RoomContext);

  useEffect(() => {
    if (me) ws.emit("join-room", { roomId: id, peerId: me._id });
  }, [id, me, ws]);

  return (
    <div>
      <h5>Room id : {id}</h5>

      <VideoPlayer stream={stream} />
    </div>
  );
};

export default Room;
