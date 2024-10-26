import { model, Schema } from 'mongoose';
import {
   TicketAttrs,
   TicketDocument,
   TicketModel,
} from '../interfaces/ticket.interface';
import { Order } from './order.model';
import { OrderStatus } from '@dmehra2102-microservices-/common';

const ticketSchema = new Schema<TicketDocument, TicketModel>(
   {
      price: { type: Number, required: true, min: 0 },
      title: { Type: String, required: true },
   },
   {
      timestamps: true,
      versionKey: false,
      toJSON: {
         transform(ret, doc) {
            ret.id = ret._id;
            delete ret._id;
         },
      },
   }
);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
   return new Ticket(attrs);
};

ticketSchema.methods.isReserved = async function () {
   const existingOrder = await Order.findOne({
      ticket: this,
      status: {
         $in: [
            OrderStatus.CREATED,
            OrderStatus.COMPLETE,
            OrderStatus.AWAITINGPAYMENT,
         ],
      },
   });

   return !!existingOrder;
};

export const Ticket = model<TicketDocument, TicketModel>(
   'Ticket',
   ticketSchema
);
