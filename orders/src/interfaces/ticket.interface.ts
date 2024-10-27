import mongoose from 'mongoose';

interface TicketAttrs {
   id: string;
   title: string;
   price: number;
}

interface TicketDocument extends mongoose.Document {
   title: string;
   price: number;
   version: number;
   isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDocument> {
   build(attrs: TicketAttrs): TicketDocument;
   findByIdAndPrevVersion(event: {
      id: string;
      version: number;
   }): Promise<TicketDocument | null>;
}

export { TicketAttrs, TicketDocument, TicketModel };
