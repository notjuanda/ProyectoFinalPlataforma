import Cookies from 'https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.mjs';

document.getElementById('logoutButton').addEventListener('click', async function() {
    try {
        const response = await fetch('/api/usuarios/logout', {
            method: 'POST',
            credentials: 'include'
        });

        if (response.ok) {
            console.log('Cierre de sesión exitoso');
            Cookies.remove('userRegistered');
            Cookies.remove('userId');
            window.location.href = 'index.html';
        } else {
            const errorData = await response.json();
            console.error('Error al cerrar sesión:', errorData.message);
        }
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
});
