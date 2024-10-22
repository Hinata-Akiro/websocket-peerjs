import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PeerService } from './peer/peer.service';
import * as http from 'http';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
  });

  app.use(helmet());

  // Create the HTTP server from NestJS
  const server = http.createServer(app.getHttpServer());

  // Initialize PeerJS service
  const peerService = app.get(PeerService);
  const peerServer = peerService.createPeerServer(server);

  app.use('/peerjs', peerServer);

  await app.listen(4000, () => {
    console.log('Server running on http://localhost:4000');
  });
}
bootstrap();
