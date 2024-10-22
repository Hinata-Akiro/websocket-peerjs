import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebsocketGateway } from './websocket/websocket.gateway';
import { PeerService } from './peer/peer.service';
import { PeerController } from './peer/peer.controller';
import { PeerModule } from './peer/peer.module';

@Module({
  imports: [PeerModule],
  controllers: [AppController, PeerController],
  providers: [AppService, WebsocketGateway, PeerService],
})
export class AppModule {}
