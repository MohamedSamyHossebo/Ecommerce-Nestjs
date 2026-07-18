import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;
  handleConnection(client: Socket) {
    console.log('Client connected: ', client.id);
  }
  handleDisconnect(client: Socket) {
    console.log('Client disconnected: ', client.id);
  }

  @SubscribeMessage('join')
  handleJoinRoom(
    @MessageBody() payload: any,
    @ConnectedSocket() client: Socket,
  ) {
    let roomName: string | undefined;

    if (typeof payload === 'string') {
      try {
        const parsed = JSON.parse(payload);
        roomName = parsed.roomName;
      } catch (e) {
        roomName = payload;
      }
    } else {
      roomName = payload?.roomName;
    }
    
    if (!roomName) {
      console.log(`[Socket] Client ${client.id} failed to join! Payload was:`, payload);
      return { status: 'error', message: 'roomName is missing' };
    }

    client.join(roomName);
    console.log(`[Socket] Client ${client.id} joined room: "${roomName}"`);
    return {
      status: 'success',
      event: 'joined',
      data: roomName,
    };
  }
}
