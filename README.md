# Signaling and Real-Time Communication API Documentation

## Overview
This API provides real-time communication features using WebSockets and peer-to-peer connections (via PeerJS). The system allows users to join rooms, send messages, and manage video/audio status (mute/unmute) in a scalable and modular manner.

## Base URL
- **HTTP/RESTful API**: `http://localhost:4000`
- **WebSocket (Socket.IO)**: `ws://localhost:4000`

---

## Table of Contents
1. [REST API](#rest-api)
   - [GET /peer](#get-peer)
2. [WebSocket API](#websocket-api)
   - [Events](#events)
     - [Connection/Disconnection](#connectiondisconnection)
     - [Room Management](#room-management)
     - [Messaging](#messaging)
     - [Mute/Unmute](#muteunmute)

---

# REST API

## GET /peer
Returns information about the PeerJS server.

- **URL**: `/peer`
- **Method**: `GET`

### Response:
```json
{
  "name": "PeerJS Server",
  "description": "A server side element to broker connections between PeerJS clients.",
  "website": "https://peerjs.com/"
}
```

# WebSocket API

## WebSocket Connection
- **URL**: `ws://localhost:4000`
- **Protocol**: `Socket.IO`

Once connected, users can listen to and emit events for room management, messaging, and media controls (e.g., mute/unmute).

---

## WebSocket Events

### Connection/Disconnection

#### `connection`
- **Description**: Fired when a user connects to the WebSocket server.
- **Payload**: `client.id` is automatically assigned.

**Server Log Example**:
```arduino
Client connected: abc123
```
#### `disconnect`
- **Description**: Fired when a user disconnects from the server.
- **Payload**: None..

**Server Log Example**:
```arduino
Client disconnected:  abc123
```

#### Broadcasted Event: `user-disconnected`
- **Payload**:
```json
{
  "id": "abc123"
}
```

### Room Management

#### `join-room`

- **Description**: User joins a specific room.

**Client Emits**:
```javascript
socket.emit('join-room', 'room1');
```

- **Payload**: Room name as string.

**Server Response**:
- Joins the room, emits an event to the client about the user list and notifies others.

**Broadcast Event**:
- `room1-update-user-list`: Sends the list of users in the room to the joining client.
- `room1-add-user`: Notifies other users in the room about the new user.

**Payload for `room1-update-user-list`**:
```json
{
  "users": ["userId1", "userId2"],  // Existing users
  "current": "abc123"  // Joining user
}
```

**Payload for `room1-add-user`**:
```json
{
  "user": "abc123"
}
```

### Messaging

#### `send-message`

- **Description**: Sends a message to all users in the room.

**Client Emits**:
```javascript
socket.emit('send-message', { room: 'room1', message: 'Hello everyone!' });
```

- **Payload**:
```json
{
  "room": "room1",
  "message": "Hello everyone!"
}
```

**Broadcast Event**: `receive-message`

- **Payload**:
```json
{
  "sender": "abc123",  // Sender's ID
  "message": "Hello everyone!"  // The message
}
```

### Mute/Unmute

#### `mute-unmute`

- **Description**: Toggle mute/unmute status for audio or video in a room.

**Client Emits**:
```javascript
socket.emit('mute-unmute', { room: 'room1', mute: true });
```
- **Payload:**

```json
{
  "room": "room1",
  "mute": true  // true for mute, false for unmute
}
```


### List of websocket Events from the server
1. `mute-unmute`
2. `user-disconnected`
3. `${NameOfRoom}-update-user-list` 
4. `${NameOfRoom}-add-user`
5. `receive-message`

### List of websocket Events sent to the server
1. `join-room`
2. `send-message`
3. `mute-unmute`