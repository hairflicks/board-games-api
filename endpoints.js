const endpoints = {
  "GET /api": {
    "description": "serves up a json representation of all the available endpoints of the api"
  },
  "GET /api/categories": {
    "description": "serves an array of all categories",
    "queries": [],
    "exampleResponse": {
      "categories": [
        {
          "description": "Players attempt to uncover each other's hidden role",
          "slug": "Social deduction"
        }
      ]
    }
  },
  "GET /api/reviews": {
    "description": "serves an array of all reviews",
    "queries": ["category", "sort_by", "order", "limit", "p"],
    "exampleResponse": {
      "reviews": [
        {
          "title": "One Night Ultimate Werewolf",
          "designer": "Akihisa Okui",
          "owner": "happyamy2016",
          "review_img_url": "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
          "category": "hidden-roles",
          "created_at": 1610964101251,
          "votes": 5,
          "comment_count": '2'
        }
      ],
      "total_count" : 132
    }
  },
  "GET /api/reviews/:id": {
    "description": "serves an array of all reviews corresponding to the review id",
    "queries": [],
    "exampleResponse": {
      "reviews": [
        {
          "title": "One Night Ultimate Werewolf",
          "designer": "Akihisa Okui",
          "owner": "happyamy2016",
          "review_img_url": "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
          "category": "hidden-roles",
          "created_at": 1610964101251,
          "votes": 5,
          "comment_count": '3'
        }
      ]
    }
  }, 
  "GET /api/reviews/:id/comments": {
    "description": "serves an array of all comments associated with the review id sorted by most recent first",
    "queries": ["limit" , "p"],
    "exampleResponse": {
      "comments": [
        {
          "comment_id": 3,
          "votes": 5,
          "author": "beeblebob",
          "body": "What a great review!",
          "created_at": 1610964101251,
          "review_id": 5
        }
      ]
    }
  },
  "POST /api/reviews/:id/comments": {
    "description": "posts a new comment to the corresponding review id",
    "queries": [],
    "exampleRequest": {
      "username": "beeblebob",
      "body": "This review offends me"
    },
    "exampleResponse": {
      "comment": [
        {
          "comment_id": 5,
          "votes": 0,
          "author": "beeblebob",
          "body": "This review offends me",
          "created_at": 16109641015451,
          "review_id": 2
        }
      ]
    }
  },
  "PATCH /api/reviews/:id": {
    "description": "Updates the votes on the corresponding review id by the amount given",
    "queries": [],
    "exampleRequest": {
      "inc_votes": 5
    },
    "exampleResponse":  {
      "review": [
        {
          "title": "One Night Ultimate Werewolf",
          "designer": "Akihisa Okui",
          "owner": "happyamy2016",
          "review_img_url": "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
          "category": "hidden-roles",
          "created_at": 1610964101251,
          "votes": 10,
          "comment_count": '2'
        }
      ]
    }
  },
  "DELETE /api/comments/:id": {
    "description": "Deletes a comment by corresponding comment_id (no response given)",
    "queries": []
  },
  "GET /api/users": {
    "description": "Returns an array of all the users",
    "queries": [],
    "exampleResponse": [
      {
        "username": "beeblebob",
        "name": "Steve",
        "avatar_url": 'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4'
      }
    ]
  },
  "PATCH /api/comments/:id": {
    "description": "Updates the votes on the corresponding comment id given",
    "queries": [],
    "exampleRequest": {
      "inc_votes": 2
    },
    "exampleResponse": {
      "comment_id": 3,
      "body": "I didn't know dogs could play games",
      "votes": 160,
      "author": 'philippaclaire9',
      "review_id": 3,
      "created_at": "2021-01-18T10:09:48.110Z",
      }
   },
  "GET /api/users/:username": {
    "description": "Return an object containing the requested user",
    "queries": [],
    "exampleResponse": {
      "username": 'mallionaire',
      "name": 'haz',
      "avatar_url":
        'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
    }
  },
  "POST /api/reviews": {
    "description": "Posts a new review",
    "queries": [],
    "exampleRequest": { "title": 'A truly Quacking Game; Quacks of Quedlinburg',
    "designer": 'Wolfgang Warsch',
    "owner": 'mallionaire',
    "review_body":
      "Ever wish you could try your hand at mixing potions? Quacks of Quedlinburg will have you mixing up a homebrew like no other. Each player buys different ingredients (chips) that are drawn at random to reach the most points, but watch out, you'd better not let your cauldrom explode.",
    "category": 'social deduction'},
    "exampleResponse" : {
      "title": 'A truly Quacking Game; Quacks of Quedlinburg',
      "designer": 'Wolfgang Warsch',
      "owner": 'mallionaire',
      "review_img_url":
      'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?w=700&h=700',
      "review_body":
        "Ever wish you could try your hand at mixing potions? Quacks of Quedlinburg will have you mixing up a homebrew like no other. Each player buys different ingredients (chips) that are drawn at random to reach the most points, but watch out, you'd better not let your cauldrom explode.",
      "category": 'social deduction',
      "created_at": "2021-01-18T10:09:48.110Z",
      "votes": 0,
      "review_id": 3,
      "comment_count": "0"
    }
  },
  "POST /api/categories": {
    "description": "Adds given category to categories table",
    "queries": [],
    "exampleRequest": {
      "slug": "category name",
      "description": "description of category"
    },
    "exampleResponse": {
      "slug": "category name",
      "description": "description of category"
    }
  },
  "DELETE /api/reviews/:id": {
    "description": "Deletes a review by the given id (no response given)",
  }
}
module.exports = endpoints