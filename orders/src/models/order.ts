import { OrderStatus } from '@tiddal/ticketing-common';
import { Schema, Document, model } from 'mongoose';
import { TicketDocument } from './ticket';

interface OrderAttributes {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDocument;
}

type OrderDocument = Document & OrderAttributes;

const orderSchema = new Schema<OrderDocument>(
  {
    userId: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.CREATED
    },
    expiresAt: {
      type: Schema.Types.Date
    },
    ticket: {
      type: Schema.Types.ObjectId,
      ref: 'Ticket'
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      }
    }
  }
);

const OrderModel = model<OrderDocument>('Order', orderSchema);

class Order extends OrderModel {
  constructor(attributes: OrderAttributes) {
    super(attributes);
  }
}

export { Order };
