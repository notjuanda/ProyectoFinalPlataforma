import Cookies from 'https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.mjs';

document.addEventListener('DOMContentLoaded', () => {
    const createCourseForm = document.getElementById('create-course-form');

    // Obtener el userId del administrador desde la cookie
    const userId = Cookies.get('userId');
    const userRegistered = Cookies.get('userRegistered');

    // Asegurarse de que el usuario está registrado y autenticado
    if (!userId || !userRegistered) {
        alert('No estás autenticado. Por favor, inicia sesión.');
        window.location.href = 'login.html';
        return;
    }

    // Rellenar el campo oculto usuario_id con el userId del administrador
    document.getElementById('course-user').value = userId;

    createCourseForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(createCourseForm);

        const description = formData.get('descripcion');
        if (description.length > 78) {
            alert('La descripción no puede exceder los 78 caracteres.');
            return;
        }

        // Convertir la imagen del curso a base64
        const imageFile = formData.get('imagenCurso');
        const imageBase64 = await toBase64(imageFile);
        formData.set('imagenCurso', imageBase64);

        // Crear un objeto con los datos del formulario
        const courseData = {
            nombreCurso: formData.get('nombreCurso'),
            descripcion: description,
            imagenCurso: imageBase64,
            bannerCurso: null,  // Campo oculto siempre nulo
            categoria_id: formData.get('categoria_id'),
            usuario_id: userId
        };

        try {
            const response = await fetch('http://localhost:3001/api/cursos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('authToken')}`
                },
                body: JSON.stringify(courseData)
            });

            if (!response.ok) {
                throw new Error('Error al crear el curso.');
            }

            const result = await response.json();
            alert('Curso creado exitosamente');
            window.location.href = 'admin-load-all-courses.html';
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un problema al crear el curso. Por favor, inténtalo de nuevo.');
        }
    });

    // Función para convertir archivo a base64
    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
    });

    // Cargar categorías dinámicamente
    const loadCategories = async () => {
        try {
            console.log('Cargando categorías...');
            const response = await fetch('http://localhost:3001/api/categorias');
            if (!response.ok) {
                throw new Error('Error al obtener las categorías.');
            }

            const categories = await response.json();
            console.log('Categorías recibidas:', categories);
            const categorySelect = document.getElementById('course-category');
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.nombre;
                categorySelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error al cargar las categorías:', error);
        }
    };

    // Cargar las categorías al cargar la página
    loadCategories();
});
