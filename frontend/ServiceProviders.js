var mainArr;
var storedUsername;
var storedPassword;
var formattedDate;
var latitude;
var longitude;
var address;
var pincode; // Variable to store the extracted pincode



async function reverseGeocode(latitude, longitude, apiKey) {
    try {
        const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
            params: {
                q: latitude + ',' + longitude,
                key: apiKey
            }
        });

        const data = response.data;

        address = data.results[0].formatted;
        pincode = extractPincode(address); // Extract pincode from the address

        console.log('Address:', address);
        console.log('Pincode:', pincode); // Log the extracted pincode
        console.log(localStorage.getItem('username'),localStorage.getItem('password'))
    } catch (error) {
        console.error('Error:', error.message);
    }
}

function getLocationAndReverseGeocode(apiKey) {
    navigator.geolocation.getCurrentPosition(
        position => {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            console.log("Latitude: " + latitude + ", Longitude: " + longitude);

            reverseGeocode(latitude, longitude, apiKey);
        },
        error => {
            console.error("Error getting location:", error);
        }
    );
    let currentDate = new Date();

let year = currentDate.getFullYear(); // Get the year (yyyy)
let month = currentDate.getMonth() + 1; // Get the month (0-11, add 1 to get 1-12)
let day = currentDate.getDate(); // Get the day of the month (1-31)

// Format the date as needed (e.g., YYYY-MM-DD)
formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;

console.log(formattedDate);
}
const apiKey = '0280e65265894699979fb3b5c815f5c4';

getLocationAndReverseGeocode(apiKey);


async function fetchData() {
    try {
        // Fetch users data from the server
        const response = await fetch('http://localhost:9000/users/');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const usersArray = await response.json();
        console.log("usersArray",usersArray);
        storedUsername = localStorage.getItem('username');
        storedPassword = localStorage.getItem('password');
        // Filter users by distance using the fetched data and current coordinates
        mainArr=usersArray.filter(user=>{
            return user.username===storedUsername && user.password===storedPassword;
        }).map(user => {
            console.log("user in map",user,user.id);
            // const userID = user._id();
            // const userFind = db.users.find({_id: userID})
            // Assuming your server returns user objects with an 'id' property
            return {
                id:user.id,
                username: user.username,
                name: user.name,
                email: user.email,
                phone:user.phone,
                age: user.age,
                job_type: user.job_type,
                job_description: user.job_description,
                experience: user.experience,
                gender: user.gender,
                profilePicURL: user.profilePicURL,
                latitude: user.latitude,
                longitude: user.longitude,
                address: user.address,
                pincode: user.pincode
            };
        });
        localStorage.setItem('userData', JSON.stringify(usersArray));
        displayResults(mainArr);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}
document.addEventListener('DOMContentLoaded', (event) => {
    const form = document.getElementById('provider-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent the default form submission
       
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => (data[key] = value));
        console.log("formdata is",formData);
        // Add the additional data
        data.username = storedUsername;
        data.password = storedPassword;
        data.date = formattedDate;
        data.address = address; // Assuming you have the address from the reverse geocoding function
        data.pincode = pincode; // Assuming you have the pincode from the reverse geocoding function
        data.latitude = latitude; // Assuming you have the latitude from the geolocation function
        data.longitude = longitude; // Assuming you have the longitude from the geolocation function
        console.log('Data to be sent:', data);

        console.log(storedUsername,storedPassword,formattedDate,address,pincode,latitude,longitude);
        // Now, use fetch to post the data
        fetch('http://localhost:9000/users/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            window.location.reload();
            // Handle success, such as resetting the form or displaying a success message
            form.reset(); // Optionally reset the form after successful submission
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('varla')
        });
    });
});

function displayResults(results) {
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = "";
    console.log("results in displayrestul function: " + results);
    if (results.length === 0) {
        resultsContainer.innerHTML = "<p>No results found.</p>";
    } else {
        console.log(results)
        results.forEach(user => {
            const resultElem = document.createElement("div");
            resultElem.classList.add("result");
            resultElem.innerHTML = `<h2>${user.name} ${user.id}</h2><p>Job: ${user.job_type}</p><p>Experience: ${user.experience}</p><button onclick="editItem('${user.id}')">Edit</button>
            <button onclick="deleteItem('${user.id}')">Delete</button>`;
            resultElem.addEventListener("click", () => showModal(user));
            resultsContainer.appendChild(resultElem);
        });
    }
}


function showModal(provider) {
    console.log("vaurhtu",provider);
    const modal = document.getElementById("detailsModal");
    const usernameElem = document.getElementById("provider-username");
    const nameElem = document.getElementById("provider-name");
    const emailElem = document.getElementById("provider-email");
    const mobileElem = document.getElementById("provider-mobile");
    const ageElem = document.getElementById("provider-age");
    const jobTypeElem = document.getElementById("provider-job-type");
    const jobDescElem = document.getElementById("provider-job-description");
    const experienceElem = document.getElementById("provider-experience");
    const genderElem = document.getElementById("provider-gender");
    const addressElem = document.getElementById("provider-address");
    const pincodeElem = document.getElementById("provider-pincode");
    const profilePicElem = document.getElementById("provider-profile-pic");
    const dateElem = document.getElementById("provider-date");

    usernameElem.textContent = provider.username;
    nameElem.textContent = `Name: ${provider.name}`;
    emailElem.textContent = `Email: ${provider.email}`; 
    mobileElem.textContent = `Mobile: ${provider.phone}`;
    ageElem.textContent = `Age: ${provider.age}`;
    jobTypeElem.textContent = `Job Type: ${provider.job_type}`;
    jobDescElem.textContent = `Job Description: ${provider.job_description}`;
    experienceElem.textContent = `Experience: ${provider.experience}`;
    genderElem.textContent = `Gender: ${provider.gender}`;
    addressElem.textContent = `Address: ${provider.address}`;
    pincodeElem.textContent = `Pincode: ${provider.pincode}`;
    profilePicElem.src = provider.profilePicURL;
    dateElem.textContent = `Date of Post: ${provider.date}`;

    modal.style.display = "block";
}

function editItem(id){
    const user = mainArr.find(user => user.id === id);
    if(user){
        console.log("Editing user:", user);
        // Populate the form fields with the user data here
        document.getElementById('name').value = user.name;
        document.getElementById('email').value = user.email;
        document.getElementById('mobilenumber').value = user.phone;
        document.getElementById('age').value = user.age;
        document.getElementById('gender').value = user.gender;
        document.getElementById('jobtype').value = user.job_type;
        document.getElementById('experience').value = user.experience;
        document.getElementById('job-description').value = user.job_description;
        const submitButton = document.getElementById('submit');
        submitButton.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent the default form submission

            // Get the updated data from the form fields
            const updatedData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('mobilenumber').value,
                age: document.getElementById('age').value,
                gender: document.getElementById('gender').value,
                job_type: document.getElementById('jobtype').value,
                experience: document.getElementById('experience').value,
                job_description: document.getElementById('job-description').value
                // Include other form fields as needed
            };

            // Call the function to update the user data on the server
            updateUserData(id, updatedData);
        });
    } else {
        console.log("User not found with id:", id);
    }
}

async function updateUserData(id, updatedData) {
    try {
        const response = await fetch(`http://localhost:9000/users/${id}`, {
            method: 'PUT', // or 'PATCH' depending on your API
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });
        if (!response.ok) {
            throw new Error('Failed to update data');
        }
        console.log('Data updated successfully');
        // Optionally, you can reload the page or perform other actions after successful update
        window.location.reload();
    } catch (error) {
        console.error('Error updating data:', error);
    }
}

function deleteItem(id) {
    fetch(`http://localhost:9000/users/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Object deleted successfully:', data);
        window.location.reload();
        // Optionally, update the UI or perform any other actions after deletion
    })
    .catch(error => {
        console.error('Error deleting object:', error);
        // Handle error scenarios, such as displaying an error message to the user
    });
}

// Function to extract pincode from the address
function extractPincode(address) {
    const pincodeRegex = /\b\d{6}\b/;
    const pincodeMatch = address.match(pincodeRegex);
    if (pincodeMatch && pincodeMatch.length > 0) {
        return pincodeMatch[0];
    } else {
        return null;
    }
}


// Function to close details overlay
function closeModal() {
    console.log('moodu');
    const modal = document.getElementById("detailsModal");
    modal.style.display = "none";
}
window.onclick = function(event) {
    const modal = document.getElementById("detailsModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
// Display all results initially
window.onload = fetchData;
