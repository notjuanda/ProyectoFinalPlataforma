document.addEventListener('DOMContentLoaded', async () => {
    const lessonsGrid = document.getElementById('lessons-grid');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const createButton = document.getElementById('create-button');

    // Función para cargar todas las lecciones
    const loadLessons = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/lecciones');
            if (!response.ok) {
                throw new Error('Error al obtener las lecciones.');
            }

            const lessons = await response.json();
            displayLessons(lessons);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Función para mostrar las lecciones
    const displayLessons = (lessons) => {
        lessonsGrid.innerHTML = '';
        lessons.forEach(lesson => {
            const lessonElement = createLessonElement(lesson);
            lessonsGrid.appendChild(lessonElement);
        });
    };

    // Función para crear el elemento de la lección
    const createLessonElement = (lesson) => {
        const lessonLink = document.createElement('a');
        lessonLink.href = `admin-lesson-detail.html?id=${lesson.id}`;
        lessonLink.classList.add('lesson-link');

        const lessonItem = document.createElement('div');
        lessonItem.classList.add('lesson-item');

        const lessonTitle = document.createElement('h3');
        lessonTitle.textContent = lesson.nombre;

        const lessonDescription = document.createElement('p');
        lessonDescription.textContent = lesson.descripcion;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.addEventListener('click', (event) => {
            event.preventDefault();
            deleteLesson(lesson.id);
        });

        lessonItem.appendChild(lessonTitle);
        lessonItem.appendChild(lessonDescription);
        lessonItem.appendChild(deleteButton);

        lessonLink.appendChild(lessonItem);
        return lessonLink;
    };

    // Función para buscar lecciones por nombre
    const searchLessons = async (nombre) => {
        try {
            const response = await fetch(`http://localhost:3001/api/lecciones/search?nombre=${nombre}`);
            if (!response.ok) {
                throw new Error('Error al buscar las lecciones.');
            }

            const lessons = await response.json();
            displayLessons(lessons);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Función para eliminar una lección
    const deleteLesson = async (id) => {
        if (confirm('¿Estás seguro de que deseas eliminar esta lección?')) {
            try {
                const response = await fetch(`http://localhost:3001/api/lecciones/${id}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    throw new Error('Error al eliminar la lección.');
                }

                alert('Lección eliminada exitosamente');
                loadLessons();
            } catch (error) {
                console.error('Error:', error);
                alert('Hubo un problema al eliminar la lección. Por favor, inténtalo de nuevo.');
            }
        }
    };

    // Evento para el botón de búsqueda
    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            searchLessons(query);
        } else {
            loadLessons();
        }
    });

    // Evento para el botón de crear lección
    createButton.addEventListener('click', () => {
        window.location.href = 'admin-create-lesson.html';
    });

    // Cargar todas las lecciones al cargar la página
    loadLessons();
});
