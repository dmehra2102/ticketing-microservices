import { model, Schema } from 'mongoose';
import {
   TicketAttrs,
   TicketDoc,
   TicketModel,
} from '../interfaces/ticket.interface';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

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
      orderId: { type: String },
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
   return new Ticket(attrs);
};

export const Ticket = model<TicketDoc, TicketModel>('Ticket', ticketSchema);
