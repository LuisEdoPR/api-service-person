import { getConnection } from "../utils/db-connection";
import { Person, PersonDocument, PersonInput } from "../models/person.model";
import { BussinessException } from "../models/exceptions/bussiness-exception";

export class PersonService {

    public async create(personInput: PersonInput): Promise<PersonInput> {
        await getConnection();
        const createdPerson = await Person.create(personInput);
        return createdPerson;
    }

    public async update(personInput: PersonInput, personId: string): Promise<PersonInput> {
        await getConnection();
        if (!personId) {
            throw new BussinessException(400, 'Person ID should not be empty');
        }
        let person = await Person.findById(personId);

        if (!person) {
            throw new BussinessException(404, `Person not found with ID: '${personId}'`);
        }
        
        personInput = this.populatePersonToUpdate(person, personInput);
        await Person.updateOne({ _id: personId }, personInput);
        const updatedPerson = await Person.findById(personId);
        return updatedPerson!;
    }

    public async delete(personId: string): Promise<void> {
        await getConnection();
        await Person.deleteOne({ _id: personId });
    }

    public async findAll(page: number = 1, limit: number = 10): Promise<{ persons: PersonInput[], total: number }> {
        await getConnection();
        const skip = (page - 1) * limit;
        const persons = await Person.find().skip(skip).limit(limit).exec();
        const total = await Person.countDocuments().exec();

        return {persons, total};
    }

    public async findById(personId: string): Promise<PersonInput> {
        await getConnection();
        if (!personId) {
            throw new BussinessException(400, 'Person ID should not be empty');
        }
        let person = await Person.findById(personId);

        if (!person) {
            throw new BussinessException(404, `Person not found with ID: '${personId}'`);
        }
        return person;
    }

    private populatePersonToUpdate(original: PersonDocument, input: PersonInput): PersonInput {
        input.firstName = input.firstName || original.firstName;
        input.lastName = input.lastName || original.lastName;
        input.phone = input.phone || original.phone;
        input.address = input.address || original.address;
        return input;
    }

}