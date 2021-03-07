import { Schema, Document, model } from 'mongoose';

interface PaymentAttributes {
  orderId: string;
  stripeId: string;
}

type PaymentDocument = Document & PaymentAttributes;

const paymentSchema = new Schema(
  {
    orderId: {
      type: String,
      required: true
    },
    stripeId: {
      type: String,
      required: true
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

const PaymentModel = model<PaymentDocument>('Payment', paymentSchema);

class Payment extends PaymentModel {
  constructor(attributes: PaymentAttributes) {
    super(attributes);
  }
}

export { Payment };
