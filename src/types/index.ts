import { ObjectId, Types } from "mongoose";

//socket.io
interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
  hello: () => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  name: string;
  age: number;
}
export interface IMessage {
  user: Types.ObjectId;
  message: string;
  room: Types.ObjectId;
  _id: Types.ObjectId;
  created_at: Date;
}
export interface IUser {
  username: string;
  password: string;
  email: string;
  isAdmin: Boolean;
}
