import { PersonService } from '../../src/services/person';
import { FakePersonTest, Person } from "../../src/models/person.model";
import { generateFakePerson, generateFakePersons } from '../../src/utils/seed';
import assert from 'assert';
import { BussinessException } from '../../src/models/exceptions/bussiness-exception';


let service: PersonService;


jest.mock('../../src/utils/db-connection', () => ({
    getConnection: jest.fn().mockResolvedValue({})
}));

jest.mock('../../src/models/person.model', () => ({
    Person: {
        create: jest.fn(),
        findById: jest.fn(),
        findAll: jest.fn(),
        deleteOne: jest.fn(),
        updateOne: jest.fn(),
        find: jest.fn(),
        countDocuments: jest.fn(),
    },
    PersonInput: jest.fn(),
    populatePersonToUpdate: jest.fn(),
}));

const personMocked = jest.mocked(Person);

describe('PersonService', () => {

    beforeEach(async () => {
        service = new PersonService();
    });

    it('should create a person', async () => {
        // given
        const fakePerson: FakePersonTest = generateFakePerson();
        personMocked.create.mockResolvedValue(fakePerson as any);

        // when
        const person = await service.create(fakePerson);

        //then
        expect(person).toEqual(fakePerson);
    });

    it('should return error when call findById and personId is not found', async () => {
        // given
        const personId = '12345';
        personMocked.findById.mockResolvedValue(null);
        const expectedError = new BussinessException(404, `Person not found with ID: '${personId}'`);

        // then
        await assert.rejects(service.findById(personId), expectedError);
    });

    it('should return error when call findById with empty personId', async () => {
        // given
        const personId = null;
        personMocked.findById.mockResolvedValue(null);
        const expectedError = new BussinessException(400, 'Person ID should not be empty');

        // then
        await assert.rejects(service.findById(personId!), expectedError);
    });

    it('should find all persons', async () => {
        // given
        const fakePersons = generateFakePersons();
        const limit = jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(fakePersons) });
        const skip = jest.fn().mockReturnValue({ limit });
        personMocked.find.mockReturnValue({ skip } as any);
        personMocked.countDocuments.mockReturnValue({ exec: jest.fn().mockResolvedValue(fakePersons.length) } as any);

        // when
        const persons = await service.findAll();

        //then
        expect(limit).toHaveBeenCalledWith(10);
        expect(persons).not.toBeNull();
        expect(persons).toHaveProperty('total', fakePersons.length);
    });

    it('should update person by id', async () => {
        // given
        const newName = 'nameUpdated';
        const fakePerson = generateFakePerson();
        const updatePerson: FakePersonTest = {
            ...fakePerson,
            firstName: newName
        };
        personMocked.findById.mockResolvedValueOnce(fakePerson);
        personMocked.findById.mockResolvedValueOnce(updatePerson);

        // when
        const person = await service.update(updatePerson, updatePerson._id as string);

        //then
        expect(person).not.toBeNull();
        expect(person).toHaveProperty('firstName', newName);
        expect(person).toHaveProperty('lastName', updatePerson.lastName);
        expect(person).toHaveProperty('phone', updatePerson.phone);
        expect(person).toHaveProperty('address', updatePerson.address);

    });

    it('should return error when call update and personId is not found', async () => {
        // given
        const fakePerson = generateFakePerson();
        const personId = fakePerson._id as string;
        personMocked.findById.mockResolvedValue(null);
        const expectedError = new BussinessException(404, `Person not found with ID: '${personId}'`);

        // then
        await assert.rejects(service.update(fakePerson, personId), expectedError);
    });

    it('should return error when call update with empty personId', async () => {
        // given
        const fakePerson = generateFakePerson();
        const personId = null;
        personMocked.findById.mockResolvedValue(null);
        const expectedError = new BussinessException(400, 'Person ID should not be empty');

        // then
        await assert.rejects(service.update(fakePerson, personId!), expectedError);
    });

    it('should delete a person by Id', async () => {
        // given
        const fakePerson = generateFakePerson();

        // when
        await service.delete(fakePerson._id as string);

        //then
        expect(personMocked.deleteOne).toHaveBeenCalledTimes(1);
    });
});
