import { Schema, Document, model } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface TicketAttributes {
  title: string;
  price: number;
  userId: string;
}

type TicketDocument = Document & TicketAttributes & { version: number; };

const ticketSchema = new Schema<TicketDocument>(
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
