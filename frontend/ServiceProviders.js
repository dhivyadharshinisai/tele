var mainArr;
async function reverseGeocode(latitude, longitude, apiKey) {
    try {
        const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
            params: {
                q: latitude + ',' + longitude,
                key: apiKey
            }
        });

        const data = response.data;

        const address = data.results[0].formatted;

        console.log('Address:', address);
        console.log(localStorage.getItem('username'),localStorage.getItem('password'))
    } catch (error) {
        console.error('Error:', error.message);
    }
}

function getLocationAndReverseGeocode(apiKey) {
    navigator.geolocation.getCurrentPosition(
        position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
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
let formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;

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
        const storedUsername = localStorage.getItem('username');
        const storedPassword = localStorage.getItem('password');
        // Filter users by distance using the fetched data and current coordinates
        mainArr=usersArray.filter(user=>{
            return user.username===storedUsername && user.password===storedPassword;
        })
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
            // Handle success, such as resetting the form or displaying a success message
            form.reset(); // Optionally reset the form after successful submission
        })
        .catch((error) => {
            console.error('Error:', error);
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
            resultElem.innerHTML = `<h2>${user.name}</h2><p>Job: ${user.job_type}</p><p>Experience: ${user.experience}</p><button onclick="editItem('${user.id}')">Edit</button>
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


// Function to close details overlay
function closeModal() {
    const modal = document.getElementById("detailsModal");
    modal.style.display = "none";
}
window.onclick = function(event) {
    const modal = document.getElementById("detailsModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
function editItem(itemId) {
    // Logic to edit the item with the given itemId
    console.log("Editing item", itemId);
    // This might involve displaying a form with the item's current details populated,
    // and saving changes once the user submits the form.
}

function deleteItem(itemId) {
    // Logic to delete the item with the given itemId
    console.log("Deleting item", itemId);
    // This could involve removing the item's element from the DOM,
    // and possibly updating the server-side data.
}


// Display all results initially
window.onload = fetchData;