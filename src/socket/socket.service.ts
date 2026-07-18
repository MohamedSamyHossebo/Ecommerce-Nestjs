import { Injectable } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';

@Injectable()
export class SocketService {
  constructor(private readonly socketGateway: SocketGateway) {}

  emitToRoom(roomName: string, eventName: string, data: any) {
    this.socketGateway.server.to(roomName).emit(eventName, data);
  }

  emitToAll(eventName: string, data: any) {
    this.socketGateway.server.emit(eventName, data);
  }

  emitToOne(socketId: string, eventName: string, data: any) {
    this.socketGateway.server.to(socketId).emit(eventName, data);
  }
}
