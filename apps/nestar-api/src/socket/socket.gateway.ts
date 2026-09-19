import { Logger } from '@nestjs/common';
import { OnGatewayInit, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Server } from 'ws';

/** +++++++++++++++++++++++++++++ WebSocketGateway +++++++++++++++++++++++ **///   WebSocket gateway, ya'ni real-time (jonli) aloqa markazi.
@WebSocketGateway({transports: ["websocket"], secure: false})
export class SocketGateway  implements OnGatewayInit{
 private logger: Logger = new Logger('SocketEventsGetway')
 private summaryClient: number = 0; //nechta client connect bolganini hissoblaydi

  public afterInit(server: Server){      // Server ishga tushgach bir marta avtomatik chaqiriladi
    this.logger.log(`WebSocket Server Initialized total: ${this.summaryClient}`); 
 
  }

  handleConnection(client: WebSocket, ...args: any []) { //Har safar yangi client (foydalanuvchi) ulanganda bu metod chaqiriladi.
    this.summaryClient++;       //hisoblagichni oshiradi
    this.logger.log(`== Client connected total: ${this.summaryClient} ==`);
  }

  handleDisconnect(client: WebSocket) { //  // Client uzilganda chaqiriladi — hisoblagichni kamaytiradi
    this.summaryClient--;
    this.logger.log(`== Client disconnected left total: ${this.summaryClient} ==`) //hisoblagichni bittaga kamaytiryapti va logga "client uzildi,
  }


  // Client 'message' nomli xabar yuborganda ishga tushadi va javob qaytaradi
  @SubscribeMessage('message')
  public handleMessage(client: WebSocket, payload: any): string {
    return 'Hello world!';
  }
}
