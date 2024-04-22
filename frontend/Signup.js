
// Signup.js

// document.addEventListener('DOMContentLoaded', () => {
//     const signupForm = document.getElementById('signup-form');

//     signupForm.addEventListener('submit', async (event) => {
//         event.preventDefault(); // Prevent form submission
        
//         // Get input values
//         const username = document.getElementById('username').value;
//         const password = document.getElementById('password').value;

//         // Store the username and password in session storage
//         sessionStorage.setItem('username', username);
//         sessionStorage.setItem('password', password);

//         // Retrieve the username and password from session storage
//         const storedUsername = sessionStorage.getItem('username');
//         const storedPassword = sessionStorage.getItem('password');

// // Use the stored username and password as needed
//         // Send a GET request to check if the username already exists
//         try {
//             const response = await fetch(`/users/${username}`, {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 }
//             });

//             if (response.ok) {
//                 // Username exists, display warning or error message
//                 const data = await response.json();
//                 console.log('Username already exists:', data);
//                 // Handle username exists (display warning message, etc.)
//             } else if (response.status === 404) {
//                 // Username doesn't exist, proceed with signup
//                 console.log('Username does not exist. Proceeding with signup.');
//                 // Perform signup logic here (send POST request to create new user)
//             } else {
//                 console.error('Failed to check username:', response.statusText);
//                 // Handle other errors
//             }
//         } catch (error) {
//             console.error('Error:', error);
//             // Handle fetch error
//         }
//     });
// });
window.onload = function() {
  fetch(`http://localhost:9000/users`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      // Save the fetched user data to a variable for later use
      localStorage.setItem('userData', JSON.stringify(data));
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
};

function handleusername() {
  const usernameInput = document.getElementById('username').value;
  const userData = JSON.parse(localStorage.getItem('userData'));
  const errorMessage = document.getElementById('error-message');

  // Check if the username already exists
  const userExists = userData.some(user => user.username === usernameInput);

  if (userExists) {
      errorMessage.innerText = 'Username already exists';
      errorMessage.style.color = 'red';
  } else {
      errorMessage.innerText = '';
  }
}

function handlesignup() {
  const usernameInput = document.getElementById('username').value;
  const passwordInput = document.getElementById('password').value;
  const errorMessage = document.getElementById('error-message');

  // Check if the password is at least 8 characters long
  if (passwordInput.length < 8) {
      errorMessage.innerText = 'Password must be at least 8 characters long';
      errorMessage.style.color = 'red';
      return false; // Prevent form submission
  }

  // Save the username and password to local storage
  localStorage.setItem('username', usernameInput);
  localStorage.setItem('password', passwordInput);

  // Redirect to login page
  window.location.href = 'login.html';

  // Prevent form submission
  return false;
}

// document.getElementById("signup-form").addEventListener("submit", function(event) {
//   event.preventDefault(); 
//   var username = document.getElementById("username").value;
//   var password = document.getElementById("password").value;
  
//   localStorage.setItem("username", username);
//   localStorage.setItem("password", password);
//   console.log("s")
//   // window.location.href = "login.html";
// });

// function   Handle()
// {const username = "John1"; // Replace with the username you want to check

// // Fetch data from the backend
// fetch(`/users/${username}`)
//   .then(response => {
//     // Check if response is successful
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     // Parse JSON response
//     return response.json();
//   })
//   .then(data => {
//     // Handle data from backend
//     console.log(data); // Log the data to console
//     // Check if data contains user information
//     if (data) {
//       // User exists in the database
//       console.log("Username already exists");
//       // Perform further actions such as displaying a warning
//     } else {
//       // User does not exist in the database
//       console.log("Username does not exist");
//       // Proceed with signup process
//     }
//   })
//   .catch(error => {
//     // Handle errors
//     console.error('There was a problem with the fetch operation:', error);
//   });
// }
// Handle();