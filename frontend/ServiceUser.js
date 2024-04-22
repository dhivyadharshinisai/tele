var usersWithDistance;
async function fetchData() {
    try {
        // Get the current user's coordinates using the Geolocation API
        const position = await getCurrentPosition();

        // Check if position is available
        if (!position) {
            console.error('Unable to retrieve current position');
            return;
        }

        // Extract latitude and longitude from the position object
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // Fetch users data from the server
        const response = await fetch('http://localhost:9000/users');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const usersArray = await response.json();
        console.log(usersArray);

        // Filter users by distance using the fetched data and current coordinates
        const filteredUsers = filterByDistance(usersArray, latitude, longitude, 100);
        // console.log(filteredUsers);
        // displayResults(filteredUsers);

        // Save fetched users data to local storage
        localStorage.setItem('userData', JSON.stringify(usersArray));
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

// Function to get the current position using the Geolocation API
function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => resolve(position),
                error => reject(error)
            );
        } else {
            reject('Geolocation is not supported by this browser');
        }
    });
}





function filterByDistance(usersArray, latitude, longitude, maxDistance) {
    usersWithDistance = usersArray.map(user => {
        console.log(user.latitude,user.longitude)
        const distance = calculateDistance(latitude, longitude, user.latitude, user.longitude);
        return { ...user, distance };
    });

    usersWithDistance.sort((a, b) => a.distance - b.distance);

    console.log('Filtered users with distance:', usersWithDistance);
    // Assuming you have a function called displayUsers that accepts the sorted array
    displayResults(usersWithDistance);
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180); // Convert degrees to radians
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    console.log(distance)
    return distance;
}




// Function to filter results based on job and experience
function filterResults() {
    const jobInput = document.getElementById("job").value;
    const experienceInput = document.getElementById("experience").value;
    const genderInput = document.getElementById("gender").value;

    const filteredResults = usersWithDistance.filter(user => {
        return matchJob(user.job_type, jobInput) &&
               matchExperience(user.experience, experienceInput) &&
               matchGender(user.gender, genderInput);
    });

    displayResults(filteredResults);
}

function matchJob(userJob, inputJob) {
    // Return true (match) if there's no job input
    if (!inputJob) return true;

    // Safely handle cases where userJob might be undefined or not a string
    if (typeof userJob !== 'string') return false;

    // Perform a case-insensitive comparison
    return userJob.toLowerCase().includes(inputJob.toLowerCase());
}
function matchExperience(userExperience, inputExperience) {
    if (!inputExperience) return true; // No input for experience, so pass all

    const userExp = parseInt(userExperience, 10); // Assuming userExperience is a string that can be converted to number
    if (inputExperience.includes('+')) {
        const minExp = parseInt(inputExperience.replace('+', ''), 10);
        return userExp >= minExp;
    } else if (inputExperience.includes('-')) {
        const [minExp, maxExp] = inputExperience.split('-').map(Number);
        return userExp >= minExp && userExp <= maxExp;
    } else {
        const exactExp = parseInt(inputExperience, 10);
        return userExp === exactExp;
    }
}

function matchGender(userGender, inputGender) {
    if (!inputGender) return true; // No input for gender, so pass all
    return userGender.toLowerCase() === inputGender.toLowerCase();
}

// Function to search for a provider
function search() {
    const searchResults = usersWithDistance.filter(provider => {
        const searchTerm = document.getElementById("search").value.toLowerCase();
        // Convert provider.age to a string to safely use .includes
        const ageAsString = provider.age.toString();
    
        return provider.name.toLowerCase().includes(searchTerm) ||
               provider.job_type.toLowerCase().includes(searchTerm) ||
               provider.username.toLowerCase().includes(searchTerm) ||
               provider.email.toLowerCase().includes(searchTerm) ||
               provider.phone.toLowerCase().includes(searchTerm) ||
               provider.address.toLowerCase().includes(searchTerm) ||
               provider.pincode.toLowerCase().includes(searchTerm) ||
               ageAsString.includes(searchTerm) || // Use the converted age as a string
               provider.experience.includes(searchTerm) ||
               provider.gender.toLowerCase().includes(searchTerm) ||
               provider.job_description.toLowerCase().includes(searchTerm);
    });

    displayResults(searchResults);
}


// Function to display filtered results
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
            resultElem.innerHTML = `<h2>${user.name}</h2><p>Job: ${user.job_type}</p><p>Experience: ${user.experience}</p>`;
            resultElem.addEventListener("click", () => showModal(user));
            resultsContainer.appendChild(resultElem);
        });
    }
}


// Function to show details of a provider

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

// Display all results initially
window.onload = fetchData;