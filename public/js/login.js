document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const correo = document.getElementById('correo').value;
    const contrasena = document.getElementById('contrasena').value;
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');

    console.log('Datos de inicio de sesión:', { correo, contrasena });

    try {
        const response = await fetch('http://localhost:3001/api/usuarios/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ correo, contrasena })
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Inicio de sesión exitoso:', result);

            // Establecer la cookie para indicar que el usuario está registrado
            Cookies.set('userRegistered', 'true');
            Cookies.set('userId', result.usuario.id); // Almacenar el ID del usuario

            // Mostrar mensaje de éxito
            errorMessage.style.display = "none";
            successMessage.textContent = 'Inicio de sesión exitoso. Redirigiendo...';
            successMessage.style.display = 'block';

            // Redirigir a la página principal de usuario registrado después de 4 segundos
            setTimeout(() => {
                window.location.href = 'registered.html';
            }, 4000);
        } else {
            const errorData = await response.json();
            errorMessage.textContent = errorData.message || 'Error al iniciar sesión.';
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        errorMessage.textContent = 'Error al iniciar sesión.';
        errorMessage.style.display = 'block';
    }
});
