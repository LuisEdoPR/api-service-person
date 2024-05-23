import mongoose, { Document, Schema } from 'mongoose';

type PersonDocument = Document & {
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
};

type FakePersonTest = {
    _id:  PersonDocument['_id'];
    firstName: PersonDocument['firstName'];
    lastName: PersonDocument['lastName'];
    phone: PersonDocument['phone'];
    address: PersonDocument['address'];
};

type PersonInput = {
    firstName: PersonDocument['firstName'];
    lastName: PersonDocument['lastName'];
    phone: PersonDocument['phone'];
    address: PersonDocument['address'];
};

const personSchema = new Schema({
    firstName: {
        type: Schema.Types.String,
        required: true,
    },
    lastName: {
        type: Schema.Types.String,
        required: true,
    },
    phone: {
        type: Schema.Types.String,
        required: true,
    },
    address: {
        type: Schema.Types.String,
        required: true,
    }
}, {
    collection: "persons",
    timestamps: true,
});

const Person = mongoose.model<PersonDocument>('Person', personSchema);

export { Person, PersonDocument, PersonInput, FakePersonTest };
