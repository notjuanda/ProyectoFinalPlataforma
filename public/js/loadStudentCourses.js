import Cookies from 'https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.mjs';

document.addEventListener('DOMContentLoaded', async function() {
    const userId = Cookies.get('userId');
    const isUserRegistered = Cookies.get('userRegistered') === 'true';

    try {
        const response = await fetch(`http://localhost:3001/api/usuarios/${userId}/cursos`);
        if (!response.ok) {
            throw new Error('Error al obtener los cursos del usuario');
        }
        const cursos = await response.json();
        console.log('Cursos del usuario:', cursos);

        const coursesGrid = document.querySelector('.my-courses .courses-grid');
        if (cursos.length > 0) {
            cursos.forEach(curso => {
                const courseElement = createCourseElement(curso, isUserRegistered);
                coursesGrid.appendChild(courseElement);
            });
        } else {
            displayNoCoursesMessage(coursesGrid);
        }
    } catch (error) {
        console.error('Error fetching user courses:', error);
        displayNoCoursesMessage(coursesGrid);
    }

    function createCourseElement(curso, isUserRegistered) {
        const courseElement = document.createElement('article');
        courseElement.classList.add('course');
        
        const courseLink = document.createElement('a');
        courseLink.href = isUserRegistered 
            ? `course-detail-registered.html?course=${curso.id}` 
            : `course-detail.html?course=${curso.id}`;

        const courseTitle = document.createElement('h3');
        courseTitle.textContent = curso.nombrecurso;

        const courseDescription = document.createElement('p');
        courseDescription.textContent = curso.descripcion;

        courseLink.appendChild(courseTitle);
        courseLink.appendChild(courseDescription);
        courseElement.appendChild(courseLink);

        return courseElement;
    }

    function displayNoCoursesMessage(container) {
        const messageElement = document.createElement('p');
        messageElement.classList.add('no-courses-message');
        messageElement.textContent = 'No hay cursos disponibles en este momento.';
        container.appendChild(messageElement);
    }
});
