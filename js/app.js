// variables
const courses = document.getElementById('courses-list');
const shoppingCart = document.querySelector('#cart-content tbody');
const clearCartBtn = document.querySelector('#clear-cart');
const closeCart = document.getElementById('close-cart');
const cartImg = document.getElementById('img-cart');
const cart = document.getElementById('shopping-cart');


// listeners
eventListeners();

function eventListeners() {
   // when a new course is added
   courses.addEventListener('click', buyCourse);

   // remove course from the cart
   shoppingCart.addEventListener('click', removeCourseFromCart);

   // clear the objects/courses in the shopping cart
   clearCartBtn.addEventListener('click', clearShoppingCart);

   cartImg.addEventListener('click', () => {
      cart.style.display = 'block';
   });

   cart.addEventListener('click', () => {
      cart.style.display = 'none';
   })
}


// functions

function buyCourse(e) {
   e.preventDefault();

   // delegation to find the course that was added to the shopping cart
   if (e.target.classList.contains('add-to-cart')) {
      // read the course values
      const course = e.target.parentElement.parentElement;
      // read values
      getCourseInfo(course);
   }
}

// reads the html info of the selected course
function getCourseInfo(course) {
   // create function that has the object of the courses
   courseObject(course);
}

// making this object of the courses global, as we're going to reuse the function..
// note: function not reusable as the queryselector overrides the looped course in the function we're calling it in..
function courseObject(course){
   // create object
   const coursesInfo = {
      image: course.querySelector('img').src,
      title: course.querySelector('h4').textContent,
      price: course.querySelector('.price span').textContent,
      id: course.querySelector('a').getAttribute('data-id')
   }

   // insert courseInfo into the shopping cart
   addIntoCart(coursesInfo);
   // add course into local storage
   saveIntoLocalStorage(coursesInfo);
}

// creates table body in the shopping cart and passes coursesInfo into the table
function addIntoCart(coursesInfo) {
   // create table row <tr></tr>
   const row = document.createElement('tr');

   // add html with our course info into the row
   row.innerHTML = `
      <tr>
         <td>
               <img src="${coursesInfo.image}" width=120>
         </td>
         <td><h4>${coursesInfo.title}</h4></td>
         <td>${coursesInfo.price}</td>
         <td>
               <a href="#" class="remove" data-id="${coursesInfo.id}">X</a>
         </td>
      </tr>
   `;

   // insert new row into our shopping cart 
   shoppingCart.appendChild(row);
}

// function to add the courses into the local storage
function saveIntoLocalStorage(courses) {
   let course = getCoursesFromLocalStorage();
   // push new course into the array
   course.push(courses)

   // set the array created and pass into the local storage by converting to json string
   localStorage.setItem('courses', JSON.stringify(course));
}

// gets info from storage
function getCoursesFromLocalStorage() {
   const courseLS = localStorage.getItem('courses');
   let course;

   // condition to create array to be passed into the storage
   if (courseLS === null) {
      course = [];
   } else {
      course = JSON.parse(courseLS);
   }
   return course;
}

// prints content of the local storage into the DOM
// turning this function into a self-invoking function.. thus, the function is already being called as soon as the page loads
(function () {
   let courses = getCoursesFromLocalStorage();
   
   courses.forEach(course => {
         // create table row <tr></tr>
      const row = document.createElement('tr');

      // add html with our course info into the row
      row.innerHTML = `
         <tr>
               <td>
                  <img src="${course.image}" width=120>
               </td>
               <td><h4>${course.title}</h4></td>
               <td>${course.price}</td>
               <td>
                  <a href="#" class="remove" data-id="${course.id}">X</a>
               </td>
         </tr>
      `;

      // insert new row into our shopping cart 
      shoppingCart.appendChild(row);
   })
})(); // the function works just fine

// function to remove courses from the shopping cart
function removeCourseFromCart(e) {
   let course, courseId;

   // delegation to check for target card to be deleted from the dom
   if (e.target.classList.contains('remove')) {
      // remove the parent of the parent element of the target
      e.target.parentElement.parentElement.remove();
      course = e.target.parentElement.parentElement;
      courseId = course.querySelector('a').getAttribute('data-id');
   }

   // removes card from the local storage
   removeFromLocalStorage(courseId);
}

// function to remove the course from tthe local storage
function removeFromLocalStorage(id) {
   let coursesLS = getCoursesFromLocalStorage();
   
   coursesLS.forEach((course, index) => {
      if (course.id === id) {
         coursesLS.splice(index, 1);
      }
   })

   // saved the data back to the storage
   localStorage.setItem('courses', JSON.stringify(coursesLS))
}

// function to clear out courses from the cart
function clearShoppingCart() {
   // two ways to clear the cart
   // shoppingCart.innerHTML = '';
   // a more recommended way would be:
   while (shoppingCart.firstElementChild) {
      shoppingCart.removeChild(shoppingCart.firstElementChild);
   }

   // clears the storage of all saved couurse
   localStorage.clear();
}