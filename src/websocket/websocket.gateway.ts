import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ cors: true })
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private activeSockets: { room: string; id: string }[] = [];
  private logger: Logger = new Logger('WebsocketGateway');

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);

    this.activeSockets = this.activeSockets.filter(
      (socket) => socket.id !== client.id,
    );

    this.server.emit('user-disconnected', client.id);
  }
  @SubscribeMessage('join-room')
  public joinRoom(client: Socket, room: string): void {
    const existingSocket = this.activeSockets.find(
      (socket) => socket.room === room && socket.id === client.id,
    );

    if (!existingSocket) {
      this.activeSockets = [...this.activeSockets, { id: client.id, room }];

      client.emit(`${room}-update-user-list`, {
        users: this.activeSockets
          .filter((socket) => socket.room === room && socket.id !== client.id)
          .map((existingSocket) => existingSocket.id),
        current: client.id,
      });

      client.broadcast.to(room).emit(`${room}-add-user`, {
        user: client.id,
      });

      this.logger.log(`Client ${client.id} joined ${room}`);
    }

    client.join(room);
  }

  @SubscribeMessage('send-message')
  handleMessage(
    client: Socket,
    payload: { room: string; message: string },
  ): void {
    this.server.to(payload.room).emit('receive-message', {
      sender: client.id,
      message: payload.message,
    });
  }

  @SubscribeMessage('mute-unmute')
  handleMuteUnmute(
    client: Socket,
    payload: { room: string; mute: boolean },
  ): void {
    this.server.to(payload.room).emit('mute-unmute', {
      sender: client.id,
      mute: payload.mute,
    });
  }
}
