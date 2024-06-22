// Incluir js-cookie
import Cookies from 'https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.js';

document.addEventListener('DOMContentLoaded', function() {
    const courseId = new URLSearchParams(window.location.search).get('course');
    const courseImage = document.getElementById('course-image');
    const courseTitle = document.getElementById('course-title');
    const courseDescription = document.getElementById('course-description');
    const courseFullDescription = document.getElementById('course-full-description');
    const lessonsList = document.getElementById('lessons-list');

    if (courseId) {
        fetch(`http://localhost:3001/api/cursos/${courseId}/lecciones`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(curso => {
                if (curso) {
                    // Actualizar información del curso
                    if (curso.imagencurso) {
                        courseImage.src = `data:image/png;base64,${curso.imagencurso}`;
                    }
                    courseTitle.textContent = curso.nombreCurso;
                    courseDescription.textContent = curso.descripcion;
                    courseFullDescription.textContent = curso.descripcion; // O cualquier otra propiedad que contenga la descripción completa

                    // Actualizar lecciones
                    if (curso.lecciones && curso.lecciones.length > 0) {
                        curso.lecciones.forEach(leccion => {
                            const lessonElement = createLessonElement(leccion);
                            lessonsList.appendChild(lessonElement);
                        });
                    } else {
                        const noLessonsMessage = document.createElement('p');
                        noLessonsMessage.textContent = 'No hay lecciones disponibles para este curso.';
                        lessonsList.appendChild(noLessonsMessage);
                    }
                } else {
                    displayCourseNotFoundMessage();
                }
            })
            .catch(error => {
                console.error('Error fetching course details:', error);
                displayCourseNotFoundMessage();
            });
    } else {
        displayCourseNotFoundMessage();
    }

    function createLessonElement(leccion) {
        const lessonElement = document.createElement('div');
        lessonElement.classList.add('lesson');

        const lessonTitle = document.createElement('h3');
        lessonTitle.textContent = leccion.nombre;

        const lessonDescription = document.createElement('p');
        lessonDescription.textContent = leccion.descripcion;

        const lessonContent = document.createElement('a');
        lessonContent.href = leccion.contenido;
        lessonContent.textContent = 'Ver contenido';
        lessonContent.addEventListener('click', function(event) {
            if (!Cookies.get('userRegistered')) {
                event.preventDefault();
                alert('Regístrate para ver nuestras lecciones');
                window.location.href = 'register.html';
            }
        });

        lessonElement.appendChild(lessonTitle);
        lessonElement.appendChild(lessonDescription);
        lessonElement.appendChild(lessonContent);

        return lessonElement;
    }

    function displayCourseNotFoundMessage() {
        courseTitle.textContent = 'Curso no encontrado';
        courseDescription.textContent = '';
        courseFullDescription.textContent = '';
        const noCourseMessage = document.createElement('p');
        noCourseMessage.textContent = 'El curso solicitado no existe o no se pudo cargar.';
        lessonsList.appendChild(noCourseMessage);
    }
});
