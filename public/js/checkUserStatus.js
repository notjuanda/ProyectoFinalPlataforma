import Cookies from 'https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.mjs';

document.addEventListener('DOMContentLoaded', function() {
    const userRegistered = Cookies.get('userRegistered');
    console.log('Estado de userRegistered:', userRegistered);
    
    const currentPath = window.location.pathname.split('/').pop();
    console.log('Ruta actual:', currentPath);

    const publicPages = ['index.html', 'about.html', 'courses.html'];
    const privatePages = ['courses-registered.html', 'registered.html', 'profile.html'];

    if (userRegistered === 'true') {
        if (publicPages.includes(currentPath)) {
            console.log('Redirigiendo a registered.html desde página pública');
            window.location.href = 'registered.html';
        }
    } else {
        if (privatePages.includes(currentPath)) {
            console.log('Redirigiendo a index.html desde página privada');
            window.location.href = 'index.html';
        }
    }
});
