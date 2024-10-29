import { model, Schema } from 'mongoose';
import {
   PaymentAttrs,
   PaymentDocument,
   PaymentModelInterface,
} from '../interfaces/payment.interface';

const paymentSchema = new Schema(
   {
      orderId: { type: String, required: true },
      stripeId: { type: String, required: true },
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

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
   return new Payment(attrs);
};

export const Payment = model<PaymentDocument, PaymentModelInterface>(
   'Payment',
   paymentSchema
);
