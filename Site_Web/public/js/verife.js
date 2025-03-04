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
  
          if (username === userData.Username && hashedString === userData.password) {
              alert('Connexion réussie!');
              localStorage.setItem(`level${niveau}Completed`, 'true'); // Enregistre le succès
  
              // Vérifie si l'utilisateur a validé le niveau 4 et affiche le secret
              if (niveau === "4" && userData.secret) {
                  alert(`Félicitations ! Voici le secret : ${userData.secret}`);
              }
  
              // Redirection vers la page d'accueil après validation
              window.location.href = 'accueil.html'; 
          } else {
              if (username === userData.Username) {
                  alert('Mot de passe incorrect');
              } else {
                  alert('Nom d’utilisateur incorrect');
              }
          }
      } catch (error) {
          console.error('Erreur lors de la connexion:', error);
      }
  }
  