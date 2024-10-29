import mongoose from 'mongoose';

interface PaymentAttrs {
   orderId: string;
   stripeId: string;
}

interface PaymentDocument extends mongoose.Document {
   orderId: string;
   stripeId: string;
}

interface PaymentModelInterface extends mongoose.Model<PaymentDocument> {
   build(attrs: PaymentAttrs): PaymentDocument;
}

export { PaymentAttrs, PaymentDocument, PaymentModelInterface };
