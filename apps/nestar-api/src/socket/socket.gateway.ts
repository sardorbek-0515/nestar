import { Logger } from '@nestjs/common';
import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'ws';
import * as WebSocket from 'ws';

interface MessagePayload {
  event: string;
  text: string;
}

interface InfoPayload {
  event: string;
  totalClients: number;
}

@WebSocketGateway({ transports: ['websocket'], secure: false })
export class SocketGateway implements OnGatewayInit {
  private logger: Logger = new Logger('SocketEventsGetway');
  private summaryClient: number = 0;

  @WebSocketServer()
  server: Server;

  public afterInit(server: Server) {
    this.logger.verbose(
      `WebSocket Server Initialized && total: [${this.summaryClient}]`,
    );
  }

  // HANDLE CONNECTION
  handleConnection(client: WebSocket, ...args: any[]) {
    this.summaryClient++;

    this.logger.verbose(
      `Connection & total [${this.summaryClient}]`,
    );

    const infoMsg: InfoPayload = {
      event: 'info',
      totalClients: this.summaryClient,
    };

    this.emitMessage(infoMsg);
  }

  // HANDLE DISCONNECTION
  handleDisconnect(client: WebSocket) {
    this.summaryClient--;

    this.logger.verbose(
      `Disconnection & total [${this.summaryClient}]`,
    );

    const infoMsg: InfoPayload = {
      event: 'info',
      totalClients: this.summaryClient,
    };

    this.broadcastMessage(client, infoMsg);
  }

  // HANDLE MESSAGE
  @SubscribeMessage('message')
  public async handleMessage(
    client: WebSocket,
    payload: string,
  ): Promise<void> {
    const newMessage: MessagePayload = {
      event: 'message',
      text: payload,
    };

    this.logger.verbose(`NEW MESSAGE: ${payload}`);

    this.emitMessage(newMessage);
  }

  // BROADCAST MESSAGE
  private broadcastMessage(
    sender: WebSocket,
    message: InfoPayload | MessagePayload,
  ) {
    this.server.clients.forEach((client) => {
      if (
        client !== sender &&
        client.readyState === WebSocket.OPEN
      ) {
        client.send(JSON.stringify(message));
      }
    });
  }

  // EMIT MESSAGE
  private emitMessage(
    message: InfoPayload | MessagePayload,
  ) {
    this.server.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
}