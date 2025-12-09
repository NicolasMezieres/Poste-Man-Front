import { Socket } from 'socket.io-client';

export const socketMock = {
  on: jest.fn((event: string, cb: () => void) => cb()),
  disconnect: jest.fn(),
  io: { opts: { reconnection: true } },
  emit: jest.fn(),
} as unknown as Socket;
