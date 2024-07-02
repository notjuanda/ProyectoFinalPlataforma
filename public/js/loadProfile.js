import Cookies from 'https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.mjs';

document.addEventListener('DOMContentLoaded', async function() {
    const userId = Cookies.get('userId');
    
    if (!userId) {
        console.error('No user ID found');
        return;
    }

    try {
        const response = await fetch(`/api/usuarios/${userId}`);
        if (!response.ok) {
            throw new Error('Error al obtener los datos del usuario');
        }
        const user = await response.json();
        updateProfileInfo(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
    }

    function updateProfileInfo(user) {
        document.getElementById('profile-name').textContent = user.nombre;
        document.getElementById('profile-lastname').textContent = user.apellido;
        document.getElementById('profile-email').textContent = user.correo;
        document.getElementById('profile-type').textContent = user.tipousuario;
    }
});
