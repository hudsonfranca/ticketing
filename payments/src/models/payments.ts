import mongoose from 'mongoose';

interface PaymentsAttrs {
  orderId: string;
  stripeId: string;
}

interface PaymentsDoc extends mongoose.Document {
  orderId: string;
  stripeId: string;
}

interface PaymentsModel extends mongoose.Model<PaymentsDoc> {
  build(attrs: PaymentsAttrs): PaymentsDoc;
}

const paymentsSchema = new mongoose.Schema(
  {
    orderId: {
      required: true,
      type: String,
    },
    stripeId: {
      required: true,
      type: String,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);

paymentsSchema.statics.build = (attrs: PaymentsAttrs) => {
  return new Payment(attrs);
};

const Payment = mongoose.model<PaymentsDoc, PaymentsModel>(
  'Payment',
  paymentsSchema,
);

export default Payment;
