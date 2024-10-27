import { model, Schema } from 'mongoose';
import {
   TicketAttrs,
   TicketDocument,
   TicketModel,
} from '../interfaces/ticket.interface';
import { Order } from './order.model';
import { OrderStatus } from '@dmehra2102-microservices-/common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

const ticketSchema = new Schema(
   {
      price: { type: Number, required: true, min: 0 },
      title: { type: String, required: true },
   },
   {
      timestamps: true,
      toJSON: {
         transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
         },
      },
   }
);

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
   return new Ticket({ _id: attrs.id, title: attrs.title, price: attrs.price });
};

ticketSchema.statics.findByIdAndPrevVersion = async (data: {
   id: string;
   version: number;
}) => {
   return Ticket.findOne({
      _id: data.id,
      version: data.version - 1,
   });
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
