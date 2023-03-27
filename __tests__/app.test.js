const request = require('supertest')
const db = require('../db/connection')
const app = require('../app')
const testData = require('../db/data/test-data/index')
const seed = require('../db/seeds/seed')

beforeEach(() => {return seed(testData)});
afterAll(() => {db.end()});

describe('/api/categories', () => {
    test('200: Should have length 4', () => {
        return request(app)
        .get('/api/categories')
        .expect(200)
        .then(({body}) => {
            const {categories} = body
            expect(categories.length).toBe(4)
        })
    })
    test('200: Should have valid keys/values', () => {
        return request(app)
        .get('/api/categories')
        .expect(200)
        .then(({body}) => {
            const {categories} = body
            expect(categories.length).toBe(4)
            categories.forEach(category => {
                expect(category).toMatchObject({
                    slug: expect.any(String),
                    description: expect.any(String)
                })
            })
        })
    })
    test('404: Responds with error message if endpoint is mistyped', () => {
        return request(app)
        .get('/api/categoris')
        .expect(404)
        .then(({res}) => {
           const {statusMessage} = res
           expect(statusMessage).toBe('Not Found')
        })
    })
})