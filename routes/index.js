const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('../app/models/config');

const yelp = require('yelp-fusion');
const apiKey = 'RS05rCr-p-9U_e5gdM91NBUquv0yXn3jwY23PoPGaiBMhvYCTs3AoFNe7fhcBANkft0soBmARD6OrK227syz_zAzOauJ2i9ATqeGZw2CEynkX6TbUl4CMftK7DpeWnYx';
const client = yelp.client(apiKey)

router.get('/', (req, res, next) => {
    return res.render('index');
});

router.get('/login', (req, res, next) => {
	console.log(data)
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

router.post('/yelptest', (req, res, next) => {
	request.get({
		url: config.apiUrl + '/yelpinfo',
		form: req.body
	}).pipe(res) //.pipe(res)

	// client.search(req.body).then(function(response) {
 //    	const firstResult = response.jsonBody.businesses[0];
 //    	const prettyJson = JSON.stringify(firstResult, null, 4);
 //    	console.log(prettyJson);
 //  	}).catch(function(e) {
 //    console.log(e);
 //  	});
})

router.get('/restaurants/:id/id', (req, res, next) => {
	return res.render('restaurant-page', { id: req.params.id })
})

module.exports = router;
