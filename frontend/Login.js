function handlelogin() {
    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    // Check with database if username and password do not match session storage
    fetch(`http://localhost:9000/users?username=${usernameInput}&password=${passwordInput}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Check if any user with the provided credentials exists in the fetched data
        const matchedUser = data.find(user => user.username === usernameInput && user.password === passwordInput);

        if (matchedUser) {
            const username=localStorage.setItem('username',usernameInput);
            const password=localStorage.setItem('password',passwordInput);
            // Username and password match database, redirect to the next page
            window.location.href = 'choose.html';
        } else {
            // Neither session storage nor database contains matching credentials, display error message
            const storedUsername = localStorage.getItem('username');
            const storedPassword = localStorage.getItem('password');

            if (storedUsername === usernameInput && storedPassword === passwordInput) {
                // Move to the next page if username and password match session storage
                window.location.href = 'choose.html';
            } else {
                errorMessage.innerText = 'Incorrect username or password';
                errorMessage.style.color = 'red';
            }
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        errorMessage.innerText = 'An error occurred. Please try again later.';
        errorMessage.style.color = 'red';
    });

    // Prevent form submission
    return false;
}
