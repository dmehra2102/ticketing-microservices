import { OrderStatus } from '@dmehra2102-microservices-/common';
import mongoose from 'mongoose';

export interface OrderAttrs {
   id: string;
   version: number;
   userId: string;
   price: number;
   status: OrderStatus;
}

export interface OrderDocument extends mongoose.Document {
   version: number;
   userId: string;
   price: number;
   status: OrderStatus;
}

export interface OrderModelInterface extends mongoose.Model<OrderDocument> {
   build(attrs: OrderAttrs): OrderDocument;
}
