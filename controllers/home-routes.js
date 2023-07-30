const router = require('express').Router() //creates an instanceof Express router
const {Post, User, Comment} = require('../models') // gabs the models from post, user, and comment

router.get("/", (req, res) => { // get route for root
    Post.findAll({ // uses the Post model to find all posts in the database and return the specific attributes below
        attributes: [
            'id', 
            'title', 
            'created_at', 
            'post_content'
        ],
        include: [ // also includes the comments model with its attributes
            {
                model: Comment,
                attributes: [
                    'id', 
                    'comment_text', 
                    'post_id', 
                    'user_id', 
                    'created_at'
                ],
                include: {
                    model: User,
                    attributes: ['username'],
                },
            },
            {
                model: User,
                attributes: ['username'],
            },
        ],
    })
    .then(dbPostData => { //after fetching the data the page renders the homepage
        const posts = dbPostData.map(post => post.get({ plain:true}))
        res.render('homepage', {
        posts,
        loggedIn: req.session.loggedIn, // flags for logged in
        })
    })
    .catch(err => { // sends error if something goes wrong
        console.log(err)
        res.statusC(500).json(err)
    })
})
router.get('/post/:id', (req, res) => { // view a single post by its id
    Post.findOne({
        where: {
            id: req.params.id,
        },
        attributes: [
            'id', 
            'title', 
            'created_at', 
            'post_content'
        ],
        include: [
            {
                model: Comment,
                attributes: [
                    'id', 
                    'comment_text', 
                    'post_id', 
                    'user_id', 
                    'created_at'
                ],
                include: {
                    model: User,
                    attributes: ['username'],
                },
            },
            {
                model: User,
                attributes: ['username']
            },
        ],
    })
    .then(dbPostData => { // if the post is not found by the id then it sends a 404 error
        if (!dbPostData) {
            res.status(404).json({ message: 'No post was found with this id' });
            return;
        }
        const post = dbPostData.get({ plain: true }); // if the post is found then it will render the single-post view
        res.render('single-post', {
            post,
            loggedIn: req.session.loggedIn,
        });
    })
    .catch(err => { // if there is an error in the database sde it will send a 500 error
        console.log(err);
        res.status(500).json(err);
    });
});


router.get('/login', (req, res) => { //renders the login page
    if (req.session.loggedIn) {
        res.redirect('/') // redirects to the root page once the user logs in
        return
    }
    res.render('login')
})

router.get('/signup', (req, res) => { // signs the user up
    if (req.session.loggedIn) {
        res.redirect('/') //redirects to the login page
        return
    }
    res.render('signup')
})

module.exports = router