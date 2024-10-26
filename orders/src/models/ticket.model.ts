import { model, Schema } from 'mongoose';
import {
   TicketAttrs,
   TicketDocument,
   TicketModel,
} from '../interfaces/ticket.interface';

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

export const Ticket = model('Ticket', ticketSchema);
