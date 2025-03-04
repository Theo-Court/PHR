function navigateToPage(page) {
    const currentUrl = window.location.href;
    // Check if already on inscription.html
    if (!currentUrl.includes('inscription.html')) {
        const params = new URLSearchParams(window.location.search);
        const niveau = params.get("niveau");
        window.location.href = niveau ? `${page}?niveau=${niveau}` : `${page}`;
    } else {
        location.reload();
    }
}
function navigateToConnexionPage(page) {
    const currentUrl = window.location.href;
    // Check if already on connexion.html
    if (!currentUrl.includes(page)) {
        const params = new URLSearchParams(window.location.search);
        const niveau = params.get("niveau");
        window.location.href = niveau ? `${page}?niveau=${niveau}` : `${page}`;
    } else {
        location.reload();
    }
}

function navigateToTemplatePage(page) {
    const currentUrl = window.location.href;
    // Check if already on template.html
    if (!currentUrl.includes(page)) {
        const params = new URLSearchParams(window.location.search);
        const niveau = params.get("niveau");
        window.location.href = niveau ? `${page}?niveau=${niveau}` : `${page}`;
    } else {
        location.reload();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Target the Accueil button (Home button)
    const accueilButton = document.querySelector('a[href="Accueil.html"]');
    if(accueilButton) {
        accueilButton.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent the default anchor link behavior
            window.location.href = 'Accueil.html'; // Replace 'Accueil.html' with the actual URL
        });
    }
    const Back = document.querySelector('a.Back-bt');
    if(Back) {
        Back.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent the default link behavior
            navigateToTemplatePage('template.html') // Use the actual login page URL here
        });
    }
    // Target the Connect (Login) button
    const loginButton = document.querySelector('a.connect-button');
    if(loginButton) {
        loginButton.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent the default link behavior
            navigateToConnexionPage('connexion.html') // Use the actual login page URL here
        });
    }

    // Target the Create Account (Register) button
    const registerButton = document.querySelector('a.create-account-button');
    if(registerButton) {
        registerButton.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent the default link behavior
            navigateToPage('inscription.html'); // Use the actual register page URL here
        });
    }
    
    // Function to load recent posts
    function loadRecentPosts() {
        fetch('recent-posts-url') // Replace with the actual URL to fetch posts
            .then(response => response.json())
            .then(data => {
                const postsContainer = document.querySelector('.content');
                postsContainer.innerHTML = ''; // Clear current content
                data.forEach(post => {
                    const postElement = document.createElement('div');
                    postElement.innerHTML = `<h4>${post.title}</h4><p>${post.summary}</p>`;
                    postsContainer.appendChild(postElement);
                });
            })
            .catch(error => console.error('Error loading recent posts:', error));
    }

    // Call this function to load posts when the page loads or when needed.
    loadRecentPosts();

    const loginForm = document.querySelector('#loginForm'); // Assuming the form has an id="loginForm"
    if(loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent form from submitting
            // Example validation: check if the email input is not empty
            const username = document.querySelector('#email').value; // Assuming there's an input with id="email"
            if (!email) {
                alert('Please enter your email.');
                return;
            }
            // Further validation can be added here
            // If all validations pass, submit the form
            this.submit();
        });
    }
});
