import { model, Schema } from 'mongoose';
import {
   TicketAttrs,
   TicketDoc,
   TicketModel,
} from '../interfaces/ticket.interface';

const ticketSchema = new Schema(
   {
      title: {
         type: String,
         required: true,
      },
      price: {
         type: Number,
         required: true,
      },
      userId: {
         type: String,
         required: true,
      },
   },
   {
      timestamps: true,
      versionKey: false,
      toJSON: {
         transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
         },
      },
   }
);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
   return new Ticket(attrs);
};

export const Ticket = model<TicketDoc, TicketModel>('ticket', ticketSchema);
