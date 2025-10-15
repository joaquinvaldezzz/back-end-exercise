import { faker } from '@faker-js/faker';

const employees = Array.from({ length: 100 }, () => ({
  first_name: faker.person.firstName(),
  middle_name: faker.person.middleName(),
  last_name: faker.person.lastName(),
  employee_type: faker.helpers.arrayElement(['FULL_TIME', 'PART_TIME', 'CONTRACTOR']),
  salary: faker.number.int({ min: 30000, max: 120000 }),
}));

export default employees;
