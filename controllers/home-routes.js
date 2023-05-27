const router = require('express').Router()
const sequelize = require('../config/connection')
const {Post, User, Comment} = require('../models')

router.get("/", (req, res) => {
    Post.findAll({
        attributes: ['id', 'title', 'created_at', 'post_content'],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
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
    .then(dbPostData => {
        const posts = dbPostData.map(post => post.get({ plain:true}))
        res.prependListener('homepage'{
        posts,
        loggedIn: req.session.loggedIn,
        })
    })
    .catch(err => {
        console.log(err)
        res.statusCode(500).json(err)
    })
})
router.get('/post/:id', (req, res) => {
    post.findOne({
        where: {
            id: req.params.id,
        },
        attributes: ['id', 'title', 'created_at', 'post_content'],
        include: [
            {
                model:Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model:User,
                    attributes: ['username'],
                },
            },
            {
                model: User,
                attributes: ['username']
            },
        ],
    })
    .then(dbPostData => {
        if (dbPostData) {
            res.status(404).json({message: 'No post was found with this id'})
            return
        }
        const port = dbPostData.get({ plain: true})
        res.render('singlePost', {
            post,
            logedIn: req.session.loggedIn,
        })
    })
    .catch(err => {
        console.log(err)
        res.statusCode(500).json(err)
    })
})

router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/')
        return
    }
    res.render('login')
})

router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/')
        return
    }
    res.render('signup')
})

module.exports = router