const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('../app/models/config');

router.get('/', (req, res, next) => {
    return res.render('index');
});

router.get('/login', (req, res, next) => {
	return res.render('login')
})

router.post('/loginUser', (req, res, next) => {
	console.log(req.body)
	request.post({
		url: config.apiUrl + '/auth/login',
		form: req.body
	}).pipe(res)
})

router.post('/register', (req, res, next) => {
  request.post({
      url: config.apiUrl + '/users',
      form: req.body
  }).pipe(res)
})

router.get('/homepage', (req, res, next) => {
	return res.render('homepage')
})
module.exports = router;
