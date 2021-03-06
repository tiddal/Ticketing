import { OrderStatus } from '@tiddal/ticketing-common';
import { Schema, Document, model } from 'mongoose';
import { Order } from './order';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface TicketAttributes {
  _id: string;
  title: string;
  price: number;
}

export type TicketDocument = Document & TicketAttributes & {
  version: number;
  isReserved(): Promise<boolean>;
};

const ticketSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
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

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

const TicketModel = model<TicketDocument>('Ticket', ticketSchema);

class Ticket extends TicketModel {

  constructor(attributes: TicketAttributes) {
    super(attributes);
  }

  async isReserved() {
    const existingOrder = await Order.findOne({
      ticket: this,
      status: {
        $in: [
          OrderStatus.CREATED,
          OrderStatus.AWAITING_PAYMENT,
          OrderStatus.COMPLETED
        ]
      }
    });
    return !!existingOrder;
  };
}

export { Ticket };
