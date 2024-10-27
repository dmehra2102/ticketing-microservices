import mongoose from 'mongoose';

interface TicketAttrs {
   id: string;
   title: string;
   price: number;
}

interface TicketDocument extends mongoose.Document {
   title: string;
   price: number;
   isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDocument> {
   build(attrs: TicketAttrs): TicketDocument;
}

export { TicketAttrs, TicketDocument, TicketModel };
