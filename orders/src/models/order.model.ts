import mongoose, { model, Schema } from 'mongoose';
import { OrderModelInterafce } from '../interfaces/order.interface';
import { OrderAttrs, OrderDocument } from './../interfaces/order.interface';
import { OrderStatus } from '@dmehra2102-microservices-/common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

const orderSchema = new Schema(
   {
      userId: {
         type: String,
         required: true,
      },
      status: {
         type: String,
         enum: Object.values(OrderStatus),
         default: OrderStatus.CREATED,
      },
      expiresAt: {
         type: mongoose.Schema.Types.Date,
      },
      ticket: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Ticket',
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
   return new Order(attrs);
};

export const Order = model<OrderDocument, OrderModelInterafce>(
   'Order',
   orderSchema
);
