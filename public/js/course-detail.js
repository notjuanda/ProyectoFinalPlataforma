import Cookies from 'https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.mjs';

document.addEventListener('DOMContentLoaded', async function() {
    const courseId = new URLSearchParams(window.location.search).get('course');
    const courseImage = document.getElementById('course-image');
    const courseTitle = document.getElementById('course-title');
    const courseDescription = document.getElementById('course-description');
    const lessonsList = document.getElementById('lessons-list');
    const enrollButton = document.querySelector('.course-header .enroll-button');

    const userId = Cookies.get('userId');
    const userRegistered = Cookies.get('userRegistered');

    if (!courseId) {
        displayCourseNotFoundMessage();
        return;
    }

    try {
        const curso = await fetchCourseDetails(courseId);
        if (curso) {
            updateCourseInfo(curso);
            updateLessonsList(curso.lecciones);
        } else {
            displayCourseNotFoundMessage();
            return;
        }

        if (userRegistered && userId) {
            let isEnrolled = await checkUserEnrollment(userId, courseId);
            if (isEnrolled) {
                enrollButton.style.display = 'none';
            } else {
                enrollButton.addEventListener('click', async () => {
                    await enrollUserInCourse(userId, courseId);
                    isEnrolled = await checkUserEnrollment(userId, courseId); // Verifica nuevamente después de inscribirse
                    if (isEnrolled) {
                        enrollButton.style.display = 'none';
                        alert('Te has inscrito exitosamente en el curso.');
                    }
                });
            }
        } else {
            enrollButton.addEventListener('click', async () => {
                await enrollUserInCourse(userId, courseId);
                const isEnrolled = await checkUserEnrollment(userId, courseId); // Verifica después de inscribirse
                if (isEnrolled) {
                    enrollButton.style.display = 'none';
                    alert('Te has inscrito exitosamente en el curso.');
                }
            });
        }
    } catch (error) {
        console.error('Error fetching course details:', error);
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
        lessonContent.href = 'javascript:void(0)'; // Prevent default link behavior
        lessonContent.textContent = 'Ver contenido';
        lessonContent.addEventListener('click', async function(event) {
            event.preventDefault();
            if (!Cookies.get('userRegistered')) {
                alert('Debes registrarte para acceder a las lecciones del curso.');
                window.location.href = `register.html`;
                return;
            }
            const isEnrolled = await checkUserEnrollment(userId, courseId);
            if (isEnrolled) {
                window.location.href = `lesson-registered.html?lesson=${leccion.id}`;
            } else {
                alert('Debes inscribirte a este curso para ingresar a la lección.');
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
        const noCourseMessage = document.createElement('p');
        noCourseMessage.textContent = 'El curso solicitado no existe o no se pudo cargar.';
        lessonsList.appendChild(noCourseMessage);
    }

    async function fetchCourseDetails(courseId) {
        const response = await fetch(`/api/cursos/${courseId}/lecciones`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }

    function updateCourseInfo(curso) {
        if (curso.imagencurso) {
            courseImage.src = `data:image/png;base64,${curso.imagencurso}`;
        }
        courseTitle.textContent = curso.nombrecurso;
        courseDescription.textContent = curso.descripcion;
    }

    function updateLessonsList(lecciones) {
        if (lecciones && lecciones.length > 0) {
            // Ordenar las lecciones por la columna `orden`
            lecciones.sort((a, b) => a.orden - b.orden);

            lecciones.forEach(leccion => {
                const lessonElement = createLessonElement(leccion);
                lessonsList.appendChild(lessonElement);
            });
        } else {
            const noLessonsMessage = document.createElement('p');
            noLessonsMessage.textContent = 'No hay lecciones disponibles para este curso.';
            lessonsList.appendChild(noLessonsMessage);
        }
    }

    async function checkUserEnrollment(userId, courseId) {
        const response = await fetch(`/api/inscripciones/check-enrollment/${userId}/${courseId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const { isEnrolled } = await response.json();
        return isEnrolled;
    }

    async function enrollUserInCourse(userId, courseId) {
        // Primero, verifica si el usuario ya está inscrito en el curso
        const isEnrolled = await checkUserEnrollment(userId, courseId);
        if (isEnrolled) {
            console.log('Usuario ya inscrito en el curso.');
            return;
        }

        const response = await fetch('/api/inscripciones', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idEstudiante: userId, curso_id: courseId })
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Crear progresos para todas las lecciones del curso
        const leccionesResponse = await fetch(`/api/cursos/${courseId}/lecciones`);
        if (!leccionesResponse.ok) {
            throw new Error('Network response was not ok');
        }

        const leccionesData = await leccionesResponse.json();
        console.log('Lecciones Data:', leccionesData);

        if (!Array.isArray(leccionesData.lecciones)) {
            throw new Error('Lecciones no es un array');
        }

        const lecciones = leccionesData.lecciones;

        for (const leccion of lecciones) {
            await fetch('/api/progresos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ usuario_id: userId, leccion_id: leccion.id, estado: 'Marcado_Visto' })
            });
        }

        return response.json();
    }
});
