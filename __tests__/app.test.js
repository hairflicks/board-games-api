const request = require('supertest')
const db = require('../db/connection')
const app = require('../app')
const testData = require('../db/data/test-data/index')
const sorted = require('jest-sorted')
const seed = require('../db/seeds/seed')

beforeEach(() => {return seed(testData)});
afterAll(() => {db.end()});

describe('GET /api/categories', () => {
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
})

describe('GET /api/reviews/:id', () => {
    test('200: Should be a single object with valid key/values', () => {
        return request(app)
        .get('/api/reviews/2')
        .expect(200)
        .then(({body}) => {
            const {review} = body
            expect(review.length).toBe(1)
            review.forEach(review => {
                expect(review).toMatchObject({
                    review_id: expect.any(Number),
                    title: expect.any(String),
                    designer: expect.any(String),
                    owner: expect.any(String),
                    review_img_url: expect.any(String),
                    review_body: expect.any(String),
                    category: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number)
                })
            })
        })
    })
    test('200: Should return requested review by ID', () => {
        return request(app)
        .get('/api/reviews/4')
        .expect(200)
        .then(({body}) => {
            const {review} = body
            expect(review.length).toBe(1)
            review.forEach(review => {
                expect(review).toMatchObject({
                    title: 'Dolor reprehenderit',
                    designer: 'Gamey McGameface',
                    owner: 'mallionaire',
                    review_img_url:
                      'https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg?w=700&h=700',
                    review_body:
                      'Consequat velit occaecat voluptate do. Dolor pariatur fugiat sint et proident ex do consequat est. Nisi minim laboris mollit cupidatat et adipisicing laborum do. Sint sit tempor officia pariatur duis ullamco labore ipsum nisi voluptate nulla eu veniam. Et do ad id dolore id cillum non non culpa. Cillum mollit dolor dolore excepteur aliquip. Cillum aliquip quis aute enim anim ex laborum officia. Aliqua magna elit reprehenderit Lorem elit non laboris irure qui aliquip ad proident. Qui enim mollit Lorem labore eiusmod',
                    category: 'social deduction',
                    created_at: "2021-01-22T11:35:50.936Z",
                    votes: 7
                  })
            })
        })
    })
    test('404: review ID not found eg:9999', () => {
        return request(app)
        .get('/api/reviews/999')
        .expect(404)
        .then(({body}) => {
            const {msg} = body
            expect(msg).toBe('No review found for ID:999')
        })
    })
    test('400: invalid id request eg:"dog"', () => {
        return request(app)
        .get('/api/reviews/dog')
        .expect(400)
        .then(({body}) => {
            const {msg} = body
            expect(msg).toBe("Invalid request type")
        })
    })
})


describe('GET /api/reviews', () => {
    test('200: should have length 13', () => {
        return request(app)
        .get('/api/reviews')
        .expect(200)
        .then(({body}) => {
            const {reviews} = body
            expect(reviews.length).toBe(13)
        })
    })
    test('200: should have valid keys/values', () => {
        return request(app)
        .get('/api/reviews')
        .expect(200)
        .then(({body}) => {
            const {reviews} = body
            expect(reviews.length).toBe(13)
            reviews.forEach(review => {
                expect(review).toMatchObject({
                   owner: expect.any(String),
                   title: expect.any(String),
                   review_id: expect.any(Number),
                   category: expect.any(String),
                   review_img_url: expect.any(String),
                   created_at: expect.any(String),
                   votes: expect.any(Number),
                   designer: expect.any(String),
                   comment_count: expect.any(String)
                })
            })
        })
    })
    test('200: has correct comment count for the reviews', () => {
        return request(app)
        .get('/api/reviews')
        .expect(200)
        .then(({body}) => {
            const {reviews} = body
            expect(reviews.length).toBe(13)
            expect(reviews[12].comment_count).toBe("0")
            expect(reviews[11].comment_count).toBe("0")
            expect(reviews[5].comment_count).toBe("3")
            expect(reviews[1].comment_count).toBe("0")
        })
    })
    test('200: sorted by date (descending)', () => {
        return request(app)
        .get('/api/reviews')
        .expect(200)
        .then(({body}) => {
            const {reviews} = body
            expect(reviews).toBeSortedBy('created_at', {descending: true})
        })
    })
})


describe('/api/reviews/:id/comments', () => {
    test('201: Responds with comment posted', () => {
        return request(app)
        .post('/api/reviews/2/comments')
        .send({username: 'dav3rid', body: 'This is a comment'})
        .expect(201)
        .then(({body}) => {
            const {addedComment} = body
            expect(addedComment).toMatchObject({
                comment_id: expect.any(Number),
                body: 'This is a comment',
                review_id: 2,
                author: 'dav3rid',
                votes: 0,
                created_at: expect.any(String),
            })
        })
    })
    test('404: review id does not exist', () => {
        return request(app)
        .post('/api/reviews/126/comments')
        .send({username: 'dav3rid', body: 'This is a comment'})
        .expect(404)
        .then(({body}) => {
            const {msg} = body
            expect(msg).toBe('Entity does not exist in database')
        })
    })
    test('400: invalid id type', () => {
        return request(app)
        .post('/api/reviews/dog/comments')
        .send({username: 'dav3rid', body: 'This is a comment'})
        .expect(400)
        .then(({body}) => {
            const {msg} = body
            expect(msg).toBe("Invalid request type")
        })
    })
    test('400: missing keys in object', () => {
        return request(app)
        .post('/api/reviews/2/comments')
        .send({hello: 'hi'})
        .expect(400)
        .then(({body}) => {
            const {msg} = body
            expect(msg).toBe("Object missing required keys")
        })
    })
    test('404: author does not exist in database', () => {
        return request(app)
        .post('/api/reviews/2/comments')
        .send({username: 'fakeUser', body: 'This is a comment'})
        .expect(404)
        .then(({body}) => {
            const {msg} = body
            expect(msg).toBe('Entity does not exist in database')
        })
    })
})

describe('GET /api/reviews/:id/comments', () => {
    test('200: should have correct keys/values and length', () => {
        return request(app)
        .get('/api/reviews/2/comments')
        .expect(200)
        .then(({body}) => {
            const {comments} = body
            expect(comments.length).toBe(3)
            comments.forEach(comment => {
                expect(comment).toMatchObject({
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    review_id: 2
                })
            })
        })
    })
    test('200: Is sorted in order of most recent comment', () => {
        return request(app)
        .get('/api/reviews/2/comments')
        .expect(200)
        .then(({body}) => {
            const {comments} = body
            console.log(comments)
            expect(comments.length).toBe(3)
            expect(comments).toBeSortedBy('created_at', {descending: true})
        })
    })
    test('404: id is correct type but does not exist', () => {
        return request(app)
        .get('/api/reviews/564/comments')
        .expect(404)
        .then(({body}) => {
            const {msg} = body
            expect(msg).toBe('Review id does not exist')
        })
    })
    test('400: id is incorrect type', () => {
        return request(app)
        .get('/api/reviews/dog/comments')
        .expect(400)
        .then(({body}) => {
            const {msg} = body
            expect(msg).toBe('Invalid request type')
        })
    })
    test('200: id exists but has no comments', () => {
        return request(app)
        .get('/api/reviews/1/comments')
        .expect(200)
        .then(({body}) => {
            const {msg} = body
            expect(msg).toBe('No comments for this review')
        })
    })
})




describe('mistyped endpoint', () => {
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