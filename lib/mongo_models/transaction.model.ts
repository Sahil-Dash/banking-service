import mongoose, { Schema, model, models } from "mongoose";

interface TransactionAccountInterface {
  name: string;
  amount: string;
  channel: string;
  category: string;
  senderId: string;
  receiverId: string;
  senderBankId: string;
  receiverBankId: string;
  createdAt: Date;
  email: string;
}

const transactionSchema = new Schema<TransactionAccountInterface>({
  name: { type: String, required: true },
  amount: { type: String, required: true },
  channel: { type: String, required: true },
  category: { type: String, required: true },
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  senderBankId: { type: String, required: true },
  receiverBankId: { type: String, required: true },
  email: { type: String, required: true },
});

transactionSchema.add({ createdAt: { type: Date, default: Date.now() } });

const Transaction =
  models.Transaction ||
  model<TransactionAccountInterface & { createdAt: Date }>(
    "Transaction",
    transactionSchema
  );

export default Transaction;
