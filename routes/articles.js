const express = require('express')
const Article = require('./../models/article')
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const router = express.Router()

router.get('/new', ensureAuthenticated, (req, res) => {
  res.render('articles/new', { article: new Article(), user:req.user })
})

router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
  
  const article = await Article.findById(req.params.id)
  res.render('articles/edit', { article: article , user:req.user})
})

router.get('/:slug',ensureAuthenticated, async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug })
  if (article == null) res.redirect('/')
  console.log(article)
  res.render('articles/show', { article: article , user:req.user})
})

router.post('/', async (req, res, next) => {
 
  req.article = new Article()
  next()
}, saveArticleAndRedirect('new'))

router.put('/:id', async (req, res, next) => {
  console.log("im in thus")
  req.article = await Article.findById(req.params.id)
  console.log(req.article);
  let article = req.article
    article.author=req.body.userID
    article.title = req.body.title
    article.description = req.body.description
    article.markdown = req.body.markdown
    try {
      article = await article.save()
      res.redirect('/articles')
    } catch (e) {
      res.redirect('articles')
    }
})

router.delete('/:id', async (req, res) => {
  await Article.findByIdAndDelete(req.params.id)
  res.redirect('/articles')
})

function saveArticleAndRedirect(path) {
  console.log(path)
  return async (req, res) => {
    let article = req.article
    article.author=req.body.userID
    article.title = req.body.title
    article.description = req.body.description
    article.markdown = req.body.markdown
    try {
      article = await article.save()
      res.redirect('articles')
    } catch (e) {
      res.redirect('articles')
    }
  }
}

module.exports = router