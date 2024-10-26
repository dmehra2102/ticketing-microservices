import mongoose, { model, Schema } from 'mongoose';
import { OrderModelInterafce } from '../interfaces/order.interface';
import { OrderAttrs, OrderDocument } from './../interfaces/order.interface';
import { OrderStatus } from '@dmehra2102-microservices-/common';

const orderSchema = new Schema<OrderDocument, OrderModelInterafce>(
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
      versionKey: false,
      toJSON: {
         transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
         },
      },
   }
);

orderSchema.statics.build = (attrs: OrderAttrs) => {
   return new Order(attrs);
};

export const Order = model<OrderDocument, OrderModelInterafce>(
   'Order',
   orderSchema
);
