"use server";

import Transaction from "../mongo_models/transaction.model";

export const createTransaction = async (
  transaction: CreateTransactionProps
) => {
  try {
    const newTransaction = new Transaction({
      channel: "online",
      category: "Transfer",
      ...transaction,
    });

    await newTransaction.save();

    return true;
  } catch (error) {
    console.log(error);
  }
};

export const getTransactionsByBankId = async ({
  bankId,
}: getTransactionsByBankIdProps) => {
  try {
    const senderTransactions = await Transaction.find({
      senderBankId: bankId,
    }).lean();

    const receiverTransactions = await Transaction.find({
      receiverBankId: bankId,
    }).lean();

    const transactions =
      senderTransactions.length === 0
        ? receiverTransactions
        : senderTransactions;

    return transactions;
  } catch (error) {
    console.log(error);
  }
};
