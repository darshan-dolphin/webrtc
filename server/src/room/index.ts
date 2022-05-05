import { Socket } from "socket.io";
import { v4 as uuidV4 } from "uuid";

const rooms: Record<string, string[]> = {};

interface IRoomParams {
  roomId: string;
  peerId: string;
}

export const roomHandler = (socket: Socket) => {
  const createRoom = () => {
    const roomId = uuidV4();
    rooms[roomId] = [];
    socket.emit("room-created", { roomId });
    console.log("user created the room");
  };

  const joinRoom = ({ roomId, peerId }: IRoomParams) => {
    if (rooms[roomId]) {
      console.log("user joined the room :", roomId, peerId);

      if (rooms[roomId].find((id) => id === peerId) !== peerId) {
        rooms[roomId].push(peerId);
      }
      socket.join(roomId);
      socket.emit("get-users", {
        roomId,
        participants: rooms[roomId],
      });
    }

    socket.on("disconnect", () => {
      console.log("user left the room");
      leaveRoom({ roomId, peerId });
    });
  };

  const leaveRoom = ({ roomId, peerId }: IRoomParams) => {
    rooms[roomId] = rooms[roomId].filter((id) => id !== peerId);
    socket.to(roomId).emit("user-disconnected", peerId);
  };

  socket.on("create-room", createRoom);
  socket.on("join-room", joinRoom);
};
