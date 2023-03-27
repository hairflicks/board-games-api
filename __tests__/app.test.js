const request = require('supertest')
const db = require('../db/connection')
const app = require('../app')
const testData = require('../db/data/test-data/index')
const seed = require('../db/seeds/seed')

beforeEach(() => {return seed(test)});
afterAll(() => {db.end()});

describe('/api/categories', () => {
    test('', () => {
        
    })
})