const loginForm = document.getElementById('loginForm');
  
loginForm.addEventListener('submit', async function(event) {
      event.preventDefault();
  
      const username = document.getElementById('UserName').value;
      const password = document.getElementById('password').value;
  
      await handleLogin(username, password);
    });
  
    async function handleLogin(username, password) {
      try {
        const params = new URLSearchParams(window.location.search);
        const niveau = params.get("niveau");
        const response = await fetch(`/json/niveau${niveau}`);
        if (!response.ok) throw new Error('Failed to fetch user data');
        
        const userData = await response.json();
    
        const hashedString = CryptoJS.MD5(password).toString();
        if (username === userData.profileName && hashedString === userData.password) {
          alert('Connexion réussie!');
          localStorage.setItem(`level${niveau}Completed`, 'true'); // Enregistre le succès
          window.location.href = 'accueil.html'; // Remplacez par le chemin correct vers votre page d'accueil
      } else {
          alert('Nom d’utilisateur ou mot de passe incorrect');
      }
      } catch (error) {
        console.error('Erreur lors de la connexion:', error);
      }
  };