import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { Person, FakePersonTest } from "../models/person.model";
import { faker } from '@faker-js/faker';

dotenv.config();

export function generateFakePerson(): FakePersonTest {
    return {
        _id: faker.database.mongodbObjectId(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phone: faker.phone.number(),
        address: faker.location.streetAddress(true),
    };
};

export function generateFakePersons(count: number = 15): FakePersonTest[] {
    const persons: FakePersonTest[] = [];
    for (let i = 0; i < count; i++) {
        persons.push(generateFakePerson());
    }
    return persons;
}

(async () => {
    const databaseConnection = await mongoose.connect(process.env.DATABASE_URL, {
        serverSelectionTimeoutMS: 5000
    });

    try {
        await Person.create(generateFakePersons());
    } catch (e) {
        console.error('\n\nError loading data from seed...\n');
        console.error(e);
    } finally {
        await databaseConnection.disconnect();
    }
})();
