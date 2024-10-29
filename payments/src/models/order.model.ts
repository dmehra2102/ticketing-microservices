import { model, Schema } from 'mongoose';
import { OrderStatus } from '@dmehra2102-microservices-/common';
import {
   OrderAttrs,
   OrderDocument,
   OrderModelInterface,
} from '../interfaces/order.interface';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

const orderSchema = new Schema(
   {
      userId: { type: String, required: true },
      price: { type: Number, required: true },
      status: {
         type: String,
         enum: Object.values(OrderStatus),
         required: true,
      },
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

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
   return new Order({
      _id: attrs.id,
      version: attrs.version,
      price: attrs.price,
      status: attrs.status,
      userId: attrs.userId,
   });
};

export const Order = model<OrderDocument, OrderModelInterface>(
   'Order',
   orderSchema
);
