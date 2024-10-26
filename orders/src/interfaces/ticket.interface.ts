import mongoose from 'mongoose';

interface TicketAttrs {
   title: string;
   price: number;
}

interface TicketDocument extends mongoose.Document {
   title: string;
   price: number;
}

interface TicketModel extends mongoose.Model<TicketDocument> {
   build(attrs: TicketAttrs): TicketDocument;
}

export { TicketAttrs, TicketDocument, TicketModel };
