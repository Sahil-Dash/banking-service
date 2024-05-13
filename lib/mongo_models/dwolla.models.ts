import mongoose, { Schema, model, models } from 'mongoose';

interface DwollaInterface {
    firstName: string;
    lastName: string;
    address1?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    dateOfBirth?: string;
    ssn?: string;
    email: string;
    userId: string;
    dwollaCustomerId: string;
    dwollaCustomerUrl: string;

}

const dwollaSchema = new Schema<DwollaInterface>({
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address1: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    ssn: { type: String, required: true },
    dwollaCustomerId: { type: String, required: true },
    dwollaCustomerUrl: { type: String, required: true }

});

const Dwolla = models.Dwolla || model<DwollaInterface>('Dwolla', dwollaSchema);

export default Dwolla;

