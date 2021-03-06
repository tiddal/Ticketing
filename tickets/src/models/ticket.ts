import { Schema, Document, model } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface TicketAttributes {
  title: string;
  price: number;
  userId: string;
}

interface TicketDocument extends Document, TicketAttributes {
  version: number;
  orderId?: string;
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
    },
    userId: {
      type: String,
      required: true
    },
    orderId: {
      type: String
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
}

export { Ticket };
