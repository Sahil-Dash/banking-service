import mongoose, { Schema, model, models } from 'mongoose';



interface BankAccountInterface {
    accessToken: string;
    userId: string;
    accountId: string;
    bankId: string;
    fundingSourceUrl: string;
    shareableId: string;
}


const bankSchema = new Schema<BankAccountInterface>({

    accessToken: { type: String, required: true },
    userId: { type: String, required: true },
    accountId: { type: String, required: true },
    bankId: { type: String, required: true },
    fundingSourceUrl: {type: String, required: true},
    shareableId: { type: String, required: true },

});

const Bank = models.Bank || model<BankAccountInterface>('Bank', bankSchema);

export default Bank;