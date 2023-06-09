const request = require('supertest')
const db = require('../db/connection')
const app = require('../app')
const testData = require('../db/data/test-data/index')
const sorted = require('jest-sorted')
const seed = require('../db/seeds/seed')
const endpoints = require('../endpoints')

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
                    votes: expect.any(Number),
                    comment_count: "3"
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
                    votes: 7,
                    comment_count: '0'
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
        .get('/api/reviews?limit=all')
        .expect(200)
        .then(({body}) => {
            const {reviews} = body
            expect(reviews.length).toBe(13)
        })
    })
    test('200: should have valid keys/values', () => {
        return request(app)
        .get('/api/reviews?limit=all')
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
        .get('/api/reviews?limit=all')
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
        .get('/api/reviews?limit=all')
        .expect(200)
        .then(({body}) => {
            const {reviews} = body
            expect(reviews).toBeSortedBy('created_at', {descending: true})
        })
    })
})


describe('POST /api/reviews/:id/comments', () => {
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
            expect(msg).toBe('564 does not exist')
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

describe('PATCH /api/reviews/:id', () => {
    test('200: responds with updated review with votes incremented by 1', () => {
        return request(app)
        .patch('/api/reviews/2')
        .send({inc_votes: 1})
        .expect(200)
        .then(({body}) => {
            const {review} = body
            expect(review).toMatchObject({
                    review_id: 2,
                    title: 'Jenga',
                    designer: 'Leslie Scott',
                    owner: 'philippaclaire9',
                    review_img_url:
                      'https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700',
                    review_body: 'Fiddly fun for all the family',
                    category: 'dexterity',
                    created_at: "2021-01-18T10:01:41.251Z",
                    votes: 6
            })
        })
    })
    test('200: responds with updated review with votes incremented by any amount', () => {
        return request(app)
        .patch('/api/reviews/2')
        .send({inc_votes: 150})
        .expect(200)
        .then(({body}) => {
            const {review} = body
            expect(review).toMatchObject({
                    review_id: 2,
                    title: 'Jenga',
                    designer: 'Leslie Scott',
                    owner: 'philippaclaire9',
                    review_img_url:
                      'https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700',
                    review_body: 'Fiddly fun for all the family',
                    category: 'dexterity',
                    created_at: "2021-01-18T10:01:41.251Z",
                    votes: 155
            })
        })
    })
    test('200: responds with updated review with votes incremented by a negative amount', () => {
        return request(app)
        .patch('/api/reviews/2')
        .send({inc_votes: -25})
        .expect(200)
        .then(({body}) => {
            const {review} = body
            expect(review).toMatchObject({
                    review_id: 2,
                    title: 'Jenga',
                    designer: 'Leslie Scott',
                    owner: 'philippaclaire9',
                    review_img_url:
                      'https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700',
                    review_body: 'Fiddly fun for all the family',
                    category: 'dexterity',
                    created_at: "2021-01-18T10:01:41.251Z",
                    votes: -20
            })
        })
    })
    test('400: invalid object keys', () => {
        return request(app)
        .patch('/api/reviews/2')
        .send({hi: 'hello'})
        .expect(400)
        .then(({body}) => {
            const {msg} = body
            expect(msg).toBe('Please provide inc_votes key')
        })
    })
    test('400: invalid count type', () => {
        return request(app)
        .patch('/api/reviews/2')
        .send({inc_votes: 'hello'})
        .expect(400)
        .then(({body}) => {
            const {msg} = body
            expect(msg).toBe('Invalid request type')
        })
    })
    test('404: review_id is valid but does not exist', () => {
        return request(app)
        .patch('/api/reviews/500')
        .send({inc_votes: 2})
        .expect(404)
        .then(({body}) => {
            const {msg} = body
            expect(msg).toBe('Review_id does not exist')
        })
    })
    test('200: Still works with more keys on object', () => {
        return request(app)
        .patch('/api/reviews/2')
        .send({inc_votes: 2, hello: 'hi'})
        .expect(200)
        .then(({body}) => {
            const {review} = body
            expect(review).toMatchObject({
                    review_id: 2,
                    title: 'Jenga',
                    designer: 'Leslie Scott',
                    owner: 'philippaclaire9',
                    review_img_url:
                      'https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700',
                    review_body: 'Fiddly fun for all the family',
                    category: 'dexterity',
                    created_at: "2021-01-18T10:01:41.251Z",
                    votes: 7
            })
        })
    })
    test('400: review_id is invalid', () => {
        return request(app)
        .patch('/api/reviews/dog')
        .send({inc_votes: 2})
        .expect(400)
        .then(({body}) => {
            const {msg} = body
            expect(msg).toBe('Invalid request type')
        })
    })
})

describe('DELETE /api/comments/:id', () => {
    test('204: Responds with 204 no content', () => {
        return request(app)
        .delete('/api/comments/2')
        .expect(204)
    })
    test('404: Comment id is valid but does not exist', () => {
        return request(app)
        .delete('/api/comments/999')
        .expect(404)
        .then(({body}) => {
            const {msg} = body
            expect(msg).toBe('Comment ID does not exist')
        })
    })
    test('400: Comment id is invalid', () => {
        return request(app)
        .delete('/api/comments/dog')
        .expect(400)
        .then(({body}) => {
            const {msg} = body
            expect(msg).toBe('Invalid request type')
        })
    })
})



describe('GET /api/users', () => {
    test('200:Responds with correct length and key/values', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({body}) => {
            const {users} = body
            expect(users.length).toBe(4)
            users.forEach(user => {
                expect(user).toMatchObject({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String)
                })
            })
        })
    })
})

describe('QUERIES /api/reviews', () => {
    test('200: Responds with reviews only of category queried', () => {
        return request(app)
        .get('/api/reviews?category=social_deduction&limit=all')
        .expect(200)
        .then(({body}) => {
            const {reviews} = body
            expect(reviews.length).toBe(11)
            expect(reviews).toBeSortedBy('created_at', {descending: true})
            reviews.forEach(review => {
                expect(review.category).toBe('social deduction')
            })
        })
    })
    test('200: Responds with correct sort_by query', () => {
        return request(app)
        .get('/api/reviews?sort_by=votes&limit=all')
        .expect(200)
        .then(({body}) => {
            const {reviews} = body
            expect(reviews.length).toBe(13)
            expect(reviews).toBeSortedBy('votes', {descending: true})
        })
    })
    test('200: orders by order query ASC', () => {
        return request(app)
        .get('/api/reviews?order=asc&limit=all')
        .expect(200)
        .then(({body}) => {
            const {reviews} = body
            expect(reviews.length).toBe(13)
            expect(reviews).toBeSortedBy('created_at')
        })
    })
    test('200: Responds with correct order and sort_by query', () => {
        return request(app)
        .get('/api/reviews?order=asc&sort_by=designer&limit=all')
        .expect(200)
        .then(({body}) => {
            const {reviews} = body
            expect(reviews.length).toBe(13)
            expect(reviews).toBeSortedBy('designer')
        })
    })
    test('200: Responds with correct order and category', () => {
        return request(app)
        .get('/api/reviews?order=asc&category=social_deduction&limit=all')
        .expect(200)
        .then(({body}) => {
            const {reviews} = body
            expect(reviews.length).toBe(11)
            expect(reviews).toBeSortedBy('created_at')
        })
    })
    test('200: Responds with correct query using all queries', () => {
        return request(app)
        .get('/api/reviews?order=desc&category=social_deduction&sort_by=votes&limit=all')
        .expect(200)
        .then(({body}) => {
            const {reviews} = body
            expect(reviews.length).toBe(11)
            expect(reviews).toBeSortedBy('votes', {descending: true})
        })
    })
    test('400: Incorrect order query', () => {
        return request(app)
        .get('/api/reviews?order=sheep')
        .expect(400)
        .then(({body}) => {
            const {msg} = body
            expect(msg).toBe('Invalid order query')
        })
    })
    test('400: Incorrect sort_by query', () => {
        return request(app)
        .get('/api/reviews?sort_by=dog')
        .expect(400)
        .then(({body}) => {
            const {msg} = body
            expect(msg).toBe('Invalid sort_by query')
        })
    })
    test('404: Category queried does not exist', () => {
        return request(app)
        .get('/api/reviews?category=moon_cheese')
        .expect(404)
        .then(({body}) => {
            const {msg} = body
            expect(msg).toBe('moon cheese does not exist')
        })
    })
    test('200: Category exists but no results returns empty array', () => {
        return request(app)
        .get(`/api/reviews?category=children's_games`)
        .expect(200)
        .then(({body}) => {
            const {reviews} = body
            expect(reviews).toEqual([])
                })
    })
})

describe('GET /api', () => {
    test('responds with object detailing all endpoints', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body}) => {
            expect(body).toEqual(endpoints)
        })
    })
})

describe('PATCH /api/comments/:id', () => {
    test('200: responds with updated comments with votes incremented by 1', () => {
        return request(app)
        .patch('/api/comments/3')
        .send({inc_votes: 1})
        .expect(200)
        .then(({body}) => {
            const {comment} = body
            expect(comment).toMatchObject({
                comment_id: 3,
                body: "I didn't know dogs could play games",
                votes: 11,
                author: 'philippaclaire9',
                review_id: 3,
                created_at: "2021-01-18T10:09:48.110Z",
              })
        })
    })
    test('200: responds with updated comment with votes incremented by any amount', () => {
        return request(app)
        .patch('/api/comments/3')
        .send({inc_votes: 150})
        .expect(200)
        .then(({body}) => {
            const {comment} = body
            expect(comment).toMatchObject({
                comment_id: 3,
                body: "I didn't know dogs could play games",
                votes: 160,
                author: 'philippaclaire9',
                review_id: 3,
                created_at: "2021-01-18T10:09:48.110Z",
              })
        })
    })
    test('200: responds with updated review with votes incremented by a negative amount', () => {
        return request(app)
        .patch('/api/comments/2')
        .send({inc_votes: -25})
        .expect(200)
        .then(({body}) => {
            const {comment} = body
            expect(comment).toMatchObject({
                comment_id: 2,
                body: 'My dog loved this game too!',
                votes: -12,
                author: 'mallionaire',
                review_id: 3,
                created_at: "2021-01-18T10:09:05.410Z",
              })
        })
    })
    test('400: invalid object keys', () => {
        return request(app)
        .patch('/api/comments/2')
        .send({hi: 'hello'})
        .expect(400)
        .then(({body}) => {
            const {msg} = body
            expect(msg).toBe('Please provide inc_votes key')
        })
    })
    test('400: invalid count type', () => {
        return request(app)
        .patch('/api/comments/2')
        .send({inc_votes: 'hello'})
        .expect(400)
        .then(({body}) => {
            const {msg} = body
            expect(msg).toBe('Invalid request type')
        })
    })
    test('404: comment_id is valid but does not exist', () => {
        return request(app)
        .patch('/api/comments/999')
        .send({inc_votes: 2})
        .expect(404)
        .then(({body}) => {
            const {msg} = body
            expect(msg).toBe('Comment_id does not exist')
        })
    })
    test('200: Still works with more keys on object', () => {
        return request(app)
        .patch('/api/comments/2')
        .send({inc_votes: 10, hello: 'hi'})
        .expect(200)
        .then(({body}) => {
            const {comment} = body
            expect(comment).toMatchObject({
                comment_id: 2,
                body: 'My dog loved this game too!',
                votes: 23,
                author: 'mallionaire',
                review_id: 3,
                created_at: "2021-01-18T10:09:05.410Z",
              })
        })
    })
    test('400: comment_id is invalid', () => {
        return request(app)
        .patch('/api/comments/cat')
        .send({inc_votes: 2})
        .expect(400)
        .then(({body}) => {
            const {msg} = body
            expect(msg).toBe('Invalid request type')
        })
    })
})

describe('/api/users/:username', () => {
    test('200: responds with correct user object', () => {
        return request(app)
        .get('/api/users/mallionaire')
        .expect(200)
        .then(({body}) => {
            const {user} = body
            expect(user).toMatchObject({
                username: 'mallionaire',
                name: 'haz',
                avatar_url:
                  'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
              })
        })
    })
    test('404: requested user does not exist', () => {
        return request(app)
        .get('/api/users/beeblebob')
        .expect(404)
        .then(({body}) => {
            const {msg} = body
            expect(msg).toBe('beeblebob does not exist')
        })
    })
})

describe('POST /api/reviews', () => {
    test('201: Responds with comment posted', () => {
        return request(app)
        .post('/api/reviews')
        .send({ title: 'A truly Quacking Game; Quacks of Quedlinburg',
        designer: 'Wolfgang Warsch',
        owner: 'mallionaire',
        review_img_url:
          'https://images.pexels.com/photos/279321/pexels-photo-279321.jpeg?w=700&h=700',
        review_body:
          "Ever wish you could try your hand at mixing potions? Quacks of Quedlinburg will have you mixing up a homebrew like no other. Each player buys different ingredients (chips) that are drawn at random to reach the most points, but watch out, you'd better not let your cauldrom explode.",
        category: 'social deduction'})
        .expect(201)
        .then(({body}) => {
            const {review} = body
            expect(review).toMatchObject({
                title: 'A truly Quacking Game; Quacks of Quedlinburg',
                designer: 'Wolfgang Warsch',
                owner: 'mallionaire',
                review_img_url:
                  'https://images.pexels.com/photos/279321/pexels-photo-279321.jpeg?w=700&h=700',
                review_body:
                  "Ever wish you could try your hand at mixing potions? Quacks of Quedlinburg will have you mixing up a homebrew like no other. Each player buys different ingredients (chips) that are drawn at random to reach the most points, but watch out, you'd better not let your cauldrom explode.",
                category: 'social deduction',
                created_at: expect.any(String),
                votes: 0,
                review_id: expect.any(Number),
                comment_count: "0"
              })
        })
    })
    test('201: review_image_url defaults when not given', () => {
        return request(app)
        .post('/api/reviews')
        .send({ title: 'A truly Quacking Game; Quacks of Quedlinburg',
        designer: 'Wolfgang Warsch',
        owner: 'mallionaire',
        review_body:
          "Ever wish you could try your hand at mixing potions? Quacks of Quedlinburg will have you mixing up a homebrew like no other. Each player buys different ingredients (chips) that are drawn at random to reach the most points, but watch out, you'd better not let your cauldrom explode.",
        category: 'social deduction'})
        .expect(201)
        .then(({body}) => {
            const {review} = body
            expect(review).toMatchObject({
                title: 'A truly Quacking Game; Quacks of Quedlinburg',
                designer: 'Wolfgang Warsch',
                owner: 'mallionaire',
                review_img_url:
                'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?w=700&h=700',
                review_body:
                  "Ever wish you could try your hand at mixing potions? Quacks of Quedlinburg will have you mixing up a homebrew like no other. Each player buys different ingredients (chips) that are drawn at random to reach the most points, but watch out, you'd better not let your cauldrom explode.",
                category: 'social deduction',
                created_at: expect.any(String),
                votes: 0,
                review_id: expect.any(Number),
                comment_count: "0"
              })
        })
    })
    test('404: given owner does not exist', () => {
        return request(app)
        .post('/api/reviews')
        .send({ title: 'A truly Quacking Game; Quacks of Quedlinburg',
        designer: 'Wolfgang Warsch',
        owner: 'beeblebob',
        review_body:
          "Ever wish you could try your hand at mixing potions? Quacks of Quedlinburg will have you mixing up a homebrew like no other. Each player buys different ingredients (chips) that are drawn at random to reach the most points, but watch out, you'd better not let your cauldrom explode.",
        category: 'social deduction'})
        .expect(404)
        .then(({body}) => {
            const {msg} = body
            expect(msg).toBe('Entity does not exist in database')
        })
    })
    test('404: given category does not exist', () => {
        return request(app)
        .post('/api/reviews')
        .send({ title: 'A truly Quacking Game; Quacks of Quedlinburg',
        designer: 'Wolfgang Warsch',
        owner: 'mallionaire',
        review_body:
          "Ever wish you could try your hand at mixing potions? Quacks of Quedlinburg will have you mixing up a homebrew like no other. Each player buys different ingredients (chips) that are drawn at random to reach the most points, but watch out, you'd better not let your cauldrom explode.",
        category: 'condunk'})
        .expect(404)
        .then(({body}) => {
            const {msg} = body
            expect(msg).toBe("Entity does not exist in database")
        })
    })
    test('404: object has missing keys', () => {
        return request(app)
        .post('/api/reviews')
        .send({ 
        designer: 'Wolfgang Warsch',
        owner: 'mallionaire',
        review_body:
          "Ever wish you could try your hand at mixing potions? Quacks of Quedlinburg will have you mixing up a homebrew like no other. Each player buys different ingredients (chips) that are drawn at random to reach the most points, but watch out, you'd better not let your cauldrom explode.",
        category: 'social deduction'})
        .expect(400)
        .then(({body}) => {
            const {msg} = body
            expect(msg).toBe('Missing required key/s')
        })
    })
})

describe('Pagination /api/reviews', () => {
    test('200: Limit query returns correct amount', () => {
        return request(app)
        .get('/api/reviews?limit=5')
        .expect(200)
        .then(({body}) => {
            const {reviews} = body
            expect(reviews.length).toBe(5)
        })
    })
    test('200: Limit query defaults to 10', () => {
        return request(app)
        .get('/api/reviews')
        .expect(200)
        .then(({body}) => {
            const {reviews} = body
            expect(reviews.length).toBe(10)
        })
    })
    test('200: page query goes to specific page', () => {
        return request(app)
        .get('/api/reviews?p=2')
        .expect(200)
        .then(({body}) => {
            const {reviews} = body
            expect(reviews.length).toBe(3)
        })
    })
    test('200: page query combined with limit', () => {
        return request(app)
        .get('/api/reviews?p=2&limit=5')
        .expect(200)
        .then(({body}) => {
            const { reviews} = body
            expect(reviews.length).toBe(5)
        })
    })
    test('200: returns empty array when page is out of bounds', () => {
        return request(app)
        .get('/api/reviews?p=4')
        .expect(200)
        .then(({body}) => {
            const {reviews} = body
            expect(reviews).toEqual([])
        })
    })
    test('200: returns with a total_count property showing total number of results without limits', () => {
        return request(app)
        .get('/api/reviews?p=2')
        .expect(200)
        .then(({body}) => {
            const { total_count } = body
            expect(total_count).toBe(13)
        })
    })
    test('200: returns with a total_count property showing total number of results without limits (more queries)', () => {
        return request(app)
        .get('/api/reviews?p=2&limit=4&category=social_deduction')
        .expect(200)
        .then(({body}) => {
            const { total_count } = body
            expect(total_count).toBe(11)
        })
    })
    test('400: invalid limit query', () => {
        return request(app)
        .get('/api/reviews?limit=dog')
        .expect(400)
        .then(({body}) => {
            const {msg} = body
            expect(msg).toBe('invalid limit query')
        })
    })
    test('400: invalid p query', () => {
        return request(app)
        .get('/api/reviews?p=cat')
        .expect(400)
        .then(({body}) => {
            const {msg} = body
            expect(msg).toBe('Invalid page query')
        })
    })
})

describe('pagination /api/reviews/:id/comments', () => {
    test('200: returns correct limit query', () => {
        return request(app)
        .get('/api/reviews/2/comments?limit=2')
        .expect(200)
        .then(({body}) => {
            const {comments} = body
            expect(comments.length).toBe(2)
        })
    })
    test('200: returns correct page query', () => {
        return request(app)
        .get('/api/reviews/2/comments?limit=2&p=2')
        .expect(200)
        .then(({body}) => {
            const {comments} = body
            expect(comments.length).toBe(1)
        })
    })
    test('400: incorrect page query', () => {
        return request(app)
        .get('/api/reviews/2/comments?p=dog')
        .expect(400)
        .then(({body}) => {
            const {msg} = body
            expect(msg).toBe('Invalid page query')
        })
    })
    test('400: incorrect limit query', () => {
        return request(app)
        .get('/api/reviews/2/comments?limit=cat')
        .expect(400)
        .then(({body}) => {
            const {msg} = body
            expect(msg).toBe('invalid limit query')
        })
    })
})

describe('POST /api/categories', () => {
    test('201: responds with category added', () => {
        return request(app)
        .post('/api/categories')
        .send({
            slug: 'adult',
            description: 'games for a more mature audience'
        })
        .expect(201)
        .then(({body}) => {
            const {category} = body
            expect(category).toMatchObject({
                    slug: 'adult',
                    description: 'games for a more mature audience'
             })
         })
    })
    test('400: missing keys from object', () => {
        return request(app)
        .post('/api/categories')
        .send({
            slug: 'adult',
            bloob: 'games for a more mature audience'
        })
        .expect(400)
        .then(({body}) => {
            const {msg} = body
            expect(msg).toBe('Missing keys from object')
         })
    })
    test('201: Still adds category if extra keys are present', () => {
        return request(app)
        .post('/api/categories')
        .send({
            slug: 'adult',
            description: 'games for a more mature audience',
            boob: 'not a valid key'
        })
        .expect(201)
        .then(({body}) => {
            const {category} = body
            expect(category).toMatchObject({
                    slug: 'adult',
                    description: 'games for a more mature audience'
             })
         }) 
    })
})

describe('DELETE /api/reviews/:id', () => {
    test('204: Responds with 204 no content', () => {
        return request(app)
        .delete('/api/reviews/2')
        .expect(204)
    })
    test('404: Review id is valid but does not exist', () => {
        return request(app)
        .delete('/api/reviews/999')
        .expect(404)
        .then(({body}) => {
            const {msg} = body
            expect(msg).toBe('Review ID does not exist')
        })
    })
    test('400: Review id is invalid', () => {
        return request(app)
        .delete('/api/reviews/cat')
        .expect(400)
        .then(({body}) => {
            const {msg} = body
            expect(msg).toBe('Invalid request type')
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
