


/*=============================================
=            Form Submit Functions            =
=============================================*/

function submitUser() {
  var form = document.forms[0]
  var data = {}

  console.log('hi')
  if (form.email.value) data.email = form.email.value
  if (form.password.value) data.password = form.password.value
  if (form.name.value) data.name = form.name.value
  if (form.phoneNumber.value) data.phoneNumber = form.phoneNumber.value
  if (form.phoneProvider.value) data.phoneProvider = form.phoneProvider.value
  if (form.classYear.value) data.classYear = form.classYear.value

  if (!data.email) return displayError('Must provide email')
  if (!data.password) return displayError('Must provide password')
  if (!data.name) return displayError('Must provide name')
  if (!data.phoneNumber) return displayError('Must provide phone number')
  if (!data.phoneProvider) return displayError('Must provide phone provider')
  if (!data.classYear) return displayError('Must provide class year')
  if (data.password !== form.confirm.value) return displayError('Passwords do not match')

  fetch('/register', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(data)
  }).then(submitSuccess)
  .catch(submitError)

}

function getYelp() {

  const searchRequest = {
      location: 'cambridge, ma',
      categories: 'restaurants',
      limit: 50,
      sort_by: 'rating',
      open_now: true
    };

  fetch('/yelptest', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(searchRequest)
  }).then(function(res) {
    if(!res.ok) {
      res.text()
      .then(function(message) {
        alert(message)
      })
    }
    res.json()
    .then(populateYelp)
  }).catch(function(err) {
    console.log(err)
  })

}

function loginUser() {
  var form = document.forms[0]

  var data = {}
  if (form.email.value) data.email = form.email.value
  if (form.password.value) data.password = form.password.value

  if (!data.email) return displayError('Must provide email')
  if (!data.password) return displayError('Must provide password')
  console.log(data)
  fetch('/loginUser', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(data)
  }).then(submitSuccess)
  .catch(submitError)
}

/*=============================================
=            Form Submit Callbacks            =
=============================================*/
function clearForm() {
    form.reset();
    clearError('message');
    var divs = document.getElementsByClassName('hidden');
    for (var i = 0; i < divs.length; i++)
        divs[i].style.display = '';
}

function clearError(target) {
    if (target === 'message')
        return document.getElementById('js-error-message').style.visibility = 'hidden';
    target.style.border = '1px solid #888';
}


function submitSuccess(res) {
    console.log(res.ok)
    console.log('hi')
    if (!res.ok) {
      return submitError(res);
    }
    // clearForm() to be fixed, there's ambiguity on line 95 about 'form'
    window.location = '/homepage'
}

function submitError(res, message) {
    if (res.status >= 400 && res.status < 500)
        return res.text().then(function(message) {displayError(message)});
    if (message)
        return displayError(message);
}

function displayError(message) {
    var errorDiv = document.getElementById('js-error-message');
    errorDiv.innerHTML = message;
    errorDiv.style.visibility = 'visible';
}

function populateYelp(res) {

  if(localStorage.getItem('restaurants')) {
    localStorage.setItem('restaurants', '')
  }

  var restaurants = JSON.parse(res.body).businesses
  localStorage.setItem('restaurants', JSON.stringify(restaurants))

  for(var i = 0; i < restaurants.length; i++) {
    var newRow = document.createElement('td')

    var restName = document.createElement('th')
    restName.innerHTML = restaurants[i].name
    newRow.appendChild(restName)

    var restPic= document.createElement('tr')
    var restPicImg = document.createElement('img')
    restPicImg.src = restaurants[i].image_url
    restPicImg.style.width = '300px'
    restPicImg.style.height = '300px'
    restPic.appendChild(restPicImg)
    newRow.appendChild(restPic)

    var restDes = document.createElement('tr')
    var string = ''
    for (var j = 0; j < restaurants[i].categories.length; j++) {
      string += (restaurants[i].categories[j].title + '; ')
    }
    restDes.innerHTML = string
    newRow.appendChild(restDes)

    var restPrice = document.createElement('tr')
    restPrice.innerHTML = restaurants[i].price
    newRow.appendChild(restPrice)

    var restRat = document.createElement('tr')
    restRat.innerHTML = restaurants[i].rating
    newRow.appendChild(restRat)

    var restGo = document.createElement('tr')
    var restLink = document.createElement('a')
    restLink.href = '/restaurants/' + restaurants[i].id + '/id'
    restLink.innerHTML = 'Eat here!'
    restGo.appendChild(restLink)
    newRow.appendChild(restGo)

    document.getElementById("yelpTable").appendChild(newRow)
  }
}

function loadRestaurant(id) {
  var restaurants = JSON.parse(localStorage.getItem('restaurants'))

  var restaurant = restaurants.filter(function(el) {return (el.id === id)})

  alert(JSON.stringify(restaurant))
}
