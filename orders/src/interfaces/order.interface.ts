import { OrderStatus } from '@dmehra2102-microservices-/common';
import mongoose from 'mongoose';
import { TicketDocument } from './ticket.interface';

export interface OrderAttrs {
   userId: string;
   status: OrderStatus;
   expiresAt: Date;
   ticket: TicketDocument;
}

export interface OrderDocument extends mongoose.Document {
   userId: string;
   status: OrderStatus;
   expiresAt: Date;
   ticket: TicketDocument;
   version: number;
   updatedAt: string;
   createdAt: string;
}

export interface OrderModelInterafce extends mongoose.Model<OrderDocument> {
   build(attrs: OrderAttrs): OrderDocument;
}
