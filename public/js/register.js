document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const redirected = urlParams.get('redirected');
    
    if (redirected) {
        alert('Regístrate para ver nuestras lecciones');
    }

    document.getElementById('registerForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        const nombre = document.getElementById('nombre').value.trim();
        const apellido = document.getElementById('apellido').value.trim();
        const correo = document.getElementById('correo').value.trim();
        const contrasena = document.getElementById('contrasena').value.trim();
        const tipoUsuario = document.getElementById('tipoUsuario').value;
        const errorMessage = document.getElementById('error-message');
        const successMessage = document.getElementById('success-message');

        // Limpiar mensajes de error
        document.getElementById('error-nombre').textContent = '';
        document.getElementById('error-apellido').textContent = '';
        document.getElementById('error-correo').textContent = '';
        document.getElementById('error-contrasena').textContent = '';
        errorMessage.style.display = 'none';

        // Validar campos vacíos
        let isValid = true;
        if (!nombre) {
            document.getElementById('error-nombre').textContent = 'Debes ingresar un nombre.';
            isValid = false;
        }
        if (!apellido) {
            document.getElementById('error-apellido').textContent = 'Debes ingresar un apellido.';
            isValid = false;
        }
        if (!correo) {
            document.getElementById('error-correo').textContent = 'Debes ingresar un correo electrónico válido.';
            isValid = false;
        }
        if (!contrasena) {
            document.getElementById('error-contrasena').textContent = 'Debes ingresar una contraseña.';
            isValid = false;
        } else if (contrasena.length < 8) {
            document.getElementById('error-contrasena').textContent = 'La contraseña debe tener al menos 8 caracteres.';
            isValid = false;
        }

        if (!isValid) {
            errorMessage.style.display = 'block';
            return;
        }

        try {
            const response = await fetch('/api/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nombre, apellido, correo, contrasena, tipoUsuario })
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Usuario creado:', result);

                // Mostrar mensaje de éxito
                errorMessage.style.display = "none";
                successMessage.textContent = 'Cuenta creada exitosamente. Redirigiendo a la página de inicio de sesión...';
                successMessage.style.display = 'block';

                // Redirigir a la página de inicio de sesión después de 4 segundos
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 4000);
            } else {
                const errorData = await response.json();
                errorMessage.textContent = errorData.message || 'Error al crear el usuario.';
                errorMessage.style.display = 'block';
            }
        } catch (error) {
            console.error('Error al crear el usuario:', error);
            errorMessage.textContent = 'Error al crear el usuario.';
            errorMessage.style.display = 'block';
        }
    });
});
