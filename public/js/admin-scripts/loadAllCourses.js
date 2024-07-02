document.addEventListener('DOMContentLoaded', async () => {
    const coursesGrid = document.getElementById('courses-grid');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const createButton = document.getElementById('create-button');

    // Función para cargar todos los cursos
    const loadCourses = async () => {
        try {
            const response = await fetch('/api/cursos');
            if (!response.ok) {
                throw new Error('Error al obtener los cursos.');
            }

            const courses = await response.json();
            displayCourses(courses);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Función para mostrar los cursos
    const displayCourses = (courses) => {
        coursesGrid.innerHTML = '';
        courses.forEach(course => {
            const courseElement = createCourseElement(course);
            coursesGrid.appendChild(courseElement);
        });
    };

    // Función para crear el elemento del curso
    const createCourseElement = (course) => {
        const courseLink = document.createElement('a');
        courseLink.href = `admin-course-detail.html?id=${course.id}`;
        courseLink.classList.add('course-link');

        const courseItem = document.createElement('div');
        courseItem.classList.add('course-item');

        const courseImage = document.createElement('img');
        if (course.imagencurso) {
            courseImage.src = `data:image/png;base64,${course.imagencurso}`;
        } else {
            courseImage.src = 'image/default-course.png';
        }
        courseImage.alt = course.nombreCurso;
        courseImage.classList.add('course-image');

        const courseTitle = document.createElement('h3');
        courseTitle.textContent = course.nombrecurso;

        const courseDescription = document.createElement('p');
        courseDescription.textContent = course.descripcion;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.addEventListener('click', (event) => {
            event.preventDefault();
            deleteCourse(course.id);
        });

        courseItem.appendChild(courseImage);
        courseItem.appendChild(courseTitle);
        courseItem.appendChild(courseDescription);
        courseItem.appendChild(deleteButton);

        courseLink.appendChild(courseItem);
        return courseLink;
    };

    // Función para buscar cursos por nombre
    const searchCourses = async (nombre) => {
        try {
            const response = await fetch(`/api/cursos/search?nombre=${nombre}`);
            if (!response.ok) {
                throw new Error('Error al buscar los cursos.');
            }

            const courses = await response.json();
            displayCourses(courses);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Función para eliminar un curso
    const deleteCourse = async (id) => {
        if (confirm('¿Estás seguro de que deseas eliminar este curso?')) {
            try {
                const response = await fetch(`/api/cursos/${id}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    throw new Error('Error al eliminar el curso.');
                }

                alert('Curso eliminado exitosamente');
                loadCourses();
            } catch (error) {
                console.error('Error:', error);
                alert('Hubo un problema al eliminar el curso. Por favor, inténtalo de nuevo.');
            }
        }
    };

    // Evento para el botón de búsqueda
    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            searchCourses(query);
        } else {
            loadCourses();
        }
    });

    // Evento para el botón de crear curso
    createButton.addEventListener('click', () => {
        window.location.href = 'admin-create-course.html';
    });

    // Cargar todos los cursos al cargar la página
    loadCourses();
});
