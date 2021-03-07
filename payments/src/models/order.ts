import { OrderStatus } from '@tiddal/ticketing-common';
import { Schema, Document, model } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface OrderAttributes {
  _id: string;
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

type OrderDocument = Document & OrderAttributes;

const orderSchema = new Schema(
  {
    userId: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      }
    }
  }
);

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

const OrderModel = model<OrderDocument>('Order', orderSchema);

class Order extends OrderModel {
  constructor(attributes: OrderAttributes) {
    super(attributes);
  }
}

export { Order };
