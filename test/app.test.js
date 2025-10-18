import supertest from 'supertest';
import { describe, it } from 'vitest';

import app from '../app.js';

const agent = supertest(app);

describe('get /', () => {
  it('should return a list of all employees', () => {
    return new Promise((done) => {
      agent.get('/employees').expect('Content-Type', /json/).expect(200, done);
    });
  });
});
