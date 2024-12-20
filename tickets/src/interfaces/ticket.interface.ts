import mongoose from 'mongoose';

interface TicketAttrs {
   title: string;
   price: number;
   userId: string;
}

interface TicketDoc extends mongoose.Document {
   title: string;
   price: number;
   userId: string;
   version: number;
   updatedAt: string;
   createdAt: string;
   orderId?: string;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
   build(attrs: TicketAttrs): TicketDoc;
}

export { TicketModel, TicketAttrs, TicketDoc };
