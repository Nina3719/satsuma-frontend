

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
  }).then(function(res) {
    res.json()
    .then(function(data){
      sessionStorage.setItem('user_id', data.userId)
      submitSuccess(res)
    })
  })
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
  }).then(function(res) {
    res.json()
    .then(function(data){
      sessionStorage.setItem('user_id', data.userId)
      submitSuccess(res)
    })
  })
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
    storage = sessionStorage.getItem('user_id')
    console.log(storage)
    console.log('hi')
    if (!res.ok) {
      return submitError(res);
    }
    // clearForm() to be fixed, there's ambiguity on line 95 about 'form'
    window.location = '/home'
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
    restName.style.borderTopLeftRadius = "25px"
    restName.style.borderTopRightRadius= "25px"
    restName.innerHTML = restaurants[i].name
    newRow.appendChild(restName)

    var restPic= document.createElement('tr')
    var restPicImg = document.createElement('img')
    restPicImg.src = restaurants[i].image_url
    restPicImg.style.width = 'auto'
    restPicImg.style.height = '300px'
    restPicImg.style.borderBottomLeftRadius = "25px"
    restPicImg.style.borderBottomRightRadius = "25px"
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

    // var restLink = document.createElement('BUTTON')
    // // restLink.href = '/restaurants/' + restaurants[i].id + '/id'
    //
    // function visitPage(){
    //   window.location = '/restaurants/' + restaurants[i].id + '/id'
    // }
    //
    // restLink.click = visitPage();

    var restLinkPre = document.createElement('a')

    var restLink = makeButton(restLinkPre)
    restLink.href = '/restaurants/' + restaurants[i].id + '/id'

    restLink.innerHTML = 'Eat here!'
    restGo.appendChild(restLink)
    newRow.appendChild(restGo)
    document.getElementById("yelpTable").appendChild(newRow)
  }
}

function makeButton(element) {
  element.style.textDecoration = 'none';
  element.style.fontFamily = 'Helvetica';
  element.style.backgroundColor = '#E6DADA';
  element.style.backgroundColor = '-webkit-linear-gradient(to right, #274046, #E6DADA)';
  element.style.backgroundColor = 'linear-gradient(to right, #274046, #E6DADA)';
  element.style.color = '#333333';
  element.style.padding = '2px 6px 2px 6px';
  element.style.borderTop = '1px solid #CCCCCC';
  element.style.borderRight = '1px solid #333333';
  element.style.borderBottom = '1px solid #333333';
  element.style.borderLeft = '1px solid #CCCCCC';
  element.style.borderRadius = '16px'
  element.style.borderColor = 'transparent'
  element.style.boxShadow = '2.5px 5px #888888'
  return element
}

function loadRestaurant(id) {
  loggedIn = sessionStorage.getItem('user_id')
  if (!loggedIn) {
    window.location = '/'
  }
  var restaurants = JSON.parse(localStorage.getItem('restaurants'))

  var restaurants_result = restaurants.filter(function(el) {return (el.id === id)})

  var restaurant = restaurants_result[0]

  var parent = document.getElementById('restaurantInfo')

  var restName = document.createElement('div')
  restName.innerHTML = restaurant.name
  parent.appendChild(restName)

  var restPic= document.createElement('div')
  var restPicImg = document.createElement('img')
  restPicImg.src = restaurant.image_url
  restPicImg.style.width = 'auto'
  restPicImg.style.height = '300px'
  restPic.appendChild(restPicImg)
  parent.appendChild(restPic)

  var restDes = document.createElement('div')
  var stringDes = ''
  for (var j = 0; j < restaurant.categories.length; j++) {
    stringDes += (restaurant.categories[j].title + '; ')
  }
  restDes.innerHTML = stringDes
  parent.appendChild(restDes)

  var restPrice = document.createElement('div')
  restPrice.innerHTML = restaurant.price
  parent.appendChild(restPrice)

  var restRat = document.createElement('div')
  restRat.innerHTML = restaurant.rating
  parent.appendChild(restRat)

  var restAddr = document.createElement('div')
  var stringAddr = ''
  for (var k = 0; k < restaurant.location.display_address.length; k++) {
    stringAddr += (restaurant.location.display_address[k] + ', ')
  }
  restAddr.innerHTML = stringAddr
  parent.appendChild(restAddr)

  var restPhone = document.createElement('div')
  restPhone.innerHTML = restaurant.display_phone
  parent.appendChild(restPhone)

  var restUrlDiv = document.createElement('div')
  var restUrl = document.createElement('a')
  restUrl.href = restaurant.url
  restUrl.innerHTML = 'Go to restaurant\'s website!'
  restUrlDiv.appendChild(restUrl)
  parent.appendChild(restUrlDiv)

  var aptParent = document.getElementById('resApts')

  console.log(restaurant.id)

  var reqUrl = '/appointment/' + restaurant.id + '/id'

  fetch(reqUrl, {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'GET'
  }).then(function(res) {
      if(!res.ok) {
        res.text()
        .then(function(message) {
          alert(message)
        })
      }
      res.json()
      .then(aptPopulate)
  }).catch(function(err) {
    console.log(err)
  })
}

function aptPopulate(res) {

  var parentApt = document.getElementById('resApts')

  var names = []
  var emails = []
  var restLength = res.length 

  for (var i = 0; i < res.length; i++) {
    var reqAd = '/user/' + res[i].userId + '/id' 

    fetch(reqAd, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'GET'
    }).then(function(response) {
      if(!response.ok) {
        response.text()
        .then(function(message) {
          alert(message)
        })
      }
      response.json()
      .then(function(data) {

        names.push(data.name)
        emails.push(data.email)

      })
    })
  }

  window.setTimeout(function() {
    for (var j = 0; j < res.length; j++) {
      console.log('hi')
      var aptRow= document.createElement('tr')

      var aptTime = document.createElement('td')
      aptTime.innerHTML = res[j].time.toLocaleString()
      aptRow.appendChild(aptTime)

      var aptUser = document.createElement('td')
      console.log(names)
      aptUser.innerHTML = names[j]
      aptRow.appendChild(aptUser)

      var aptEmail = document.createElement('td')
      aptEmail.innerHTML = emails[j]
      aptRow.appendChild(aptEmail)

      parentApt.appendChild(aptRow)
    } 
  }, (restLength * 50))

}

function makeAppointment(restId) {

  var form = document.forms[0]
  var data = {}

  if (form.appointment_time.value) {
    data.time = form.appointment_time.value
  } else return displayError('Must provide time')
  if (sessionStorage.getItem('user_id')) {
    data.user_id = sessionStorage.getItem('user_id')
  } else return displayError('Not logged in')

  if(restId) {
    data.rest_id = restId
  } else return displayError('Invalid Restaurant')

  console.log("PRE FETCH")
  fetch('/appointment', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(data)
  }).then(function(res) {
    console.log("HELLO")
    if (!res.ok) {
      console.log("Not Okay!")
    }
    console.log(res)
    window.location = ('/restaurants/' + restId + '/id')
  })
  .catch(function(err) {
    console.log(err)
  })
  console.log("POST FETCH")

}

function testPage() {
  window.location = '/homepage'
}

function logout() {
  sessionStorage.clear();
  window.location = '/homepage'
}

function updateUser() {

}


function addFriend(params){
  console.log('q')
  data = {}
  if (params) {
    data.ratings = params
    data.id = sessionStorage.getItem('user_id')
  }
  fetch('/addfriend', {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'PUT',
    body: JSON.stringify(data)
  }).then(function(res) {
    console.log(res)
    res.json()
    .then(window.alert(params + ' has been added to your friends!'))
    window.location = '/profiles'
  })
  .catch(submitError)
  return false
}


function updateUser() {
  var form = document.forms[0]
  const data = {}

  data.id = sessionStorage.getItem('user_id')
  if(form.name.value) data.name = form.name.value
  if(form.password.value) data.password = form.password.value
  if(form.phoneNumber.value) data.phoneNumber = form.phoneNumber.value
  if(form.phoneProvider.value) data.phoneProvider = form.phoneProvider.value
  if(form.classYear.value) data.classYear = form.classYear.value
  if(form.picture.value) data.picture = form.picture.value
  if(form.description.value) data.description = form.description.value

  console.log(data)

  fetch('/update', {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'PUT',
    body: JSON.stringify(data)
  }).then(function(res){
    res.json()
    .then(window.alert('Your Account has been Updated!'))
    window.location = '/update'
  })
  .catch(submitError)
  return false
}
