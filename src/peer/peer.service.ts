import { Injectable } from '@nestjs/common';
import { ExpressPeerServer, PeerServerEvents } from 'peer';
import { Express } from 'express';
import * as http from 'http';

@Injectable()
export class PeerService {
  peerServer: Express & PeerServerEvents;

  createPeerServer(server: http.Server) {
    this.peerServer = ExpressPeerServer(server, {
      host: 'localhost',
      port: 4000,
      path: '/peerjs',
    });
    return this.peerServer;
  }

  public getPeerInfo() {
    return {
      name: 'PeerJS Server',
      description:
        'A server side element to broker connections between PeerJS clients.',
      website: 'https://peerjs.com/',
    };
  }
}
