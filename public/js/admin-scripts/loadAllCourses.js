document.addEventListener('DOMContentLoaded', async () => {
    const coursesGrid = document.getElementById('courses-grid');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    // Función para cargar todos los cursos
    const loadCourses = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/cursos');
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

        courseItem.appendChild(courseImage);
        courseItem.appendChild(courseTitle);
        courseItem.appendChild(courseDescription);

        courseLink.appendChild(courseItem);
        return courseLink;
    };

    // Función para buscar cursos por nombre
    const searchCourses = async (nombre) => {
        try {
            const response = await fetch(`http://localhost:3001/api/cursos/search?nombre=${nombre}`);
            if (!response.ok) {
                throw new Error('Error al buscar los cursos.');
            }

            const courses = await response.json();
            displayCourses(courses);
        } catch (error) {
            console.error('Error:', error);
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

    // Cargar todos los cursos al cargar la página
    loadCourses();
});
