import mongoose, { Schema, model, models } from 'mongoose';

interface UserInterface {
    firstName: string;
    lastName: string;
    // address1?: string;
    // city?: string;
    // state?: string;
    // postalCode?: string;
    // dateOfBirth?: string;
    // ssn?: string;
    email: string;
    password: string;

}

const userSchema = new Schema<UserInterface>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    // address1: { type: String, required: true },
    // city: { type: String, required: true },
    // state: { type: String, required: true },
    // postalCode: { type: String, required: true },
    // dateOfBirth: { type: String, required: true },
    // ssn: { type: String, required: true },

});

const User = models.User ||  model<UserInterface>('User', userSchema);

export default User;

