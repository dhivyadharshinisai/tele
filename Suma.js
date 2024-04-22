window.onload = function() {
    console.log('fs')
    // Fetch all data from the backend
    fetch(`http://localhost:9000/users`)
      .then(response => {
        console.log('fs')
        // Check if response is successful
        if (!response.ok) {
            console.log('fs')
          throw new Error('Network response was not ok');
        }
        // Parse JSON response
        return response.json();
      })
      .then(data => {
        // Handle data from backend
        console.log(data); // Log the data to console
      })
      .catch(error => {
        // Handle errors
        console.error('There was a problem with the fetch operation:', error);
      });
};