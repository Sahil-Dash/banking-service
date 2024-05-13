import mongoose, { Schema, model, models } from 'mongoose';

interface UserInterface {
    firstName: string;
    lastName: string;
    email: string;
    password: string;

}

const userSchema = new Schema<UserInterface>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },

});

const User = models.User ||  model<UserInterface>('User', userSchema);

export default User;

