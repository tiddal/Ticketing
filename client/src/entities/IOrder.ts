import { ITicket } from './ITicket';

interface IOrder {
  id: string;
  expiresAt: string;
  status: string;
  ticket: ITicket;
  userId: string;
  version: number;
}

export type { IOrder };
