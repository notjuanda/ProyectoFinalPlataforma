import Cookies from 'https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.mjs';

document.addEventListener('DOMContentLoaded', async function() {
    const lessonId = new URLSearchParams(window.location.search).get('lesson');
    const userRegistered = Cookies.get('userRegistered');
    const userId = Cookies.get('userId');
    const lessonTitle = document.getElementById('lesson-title');
    const lessonDescription = document.getElementById('lesson-description');
    const lessonContent = document.getElementById('lesson-content');
    const nextLessonsList = document.getElementById('next-lessons-list');

    if (!lessonId) {
        displayLessonNotFoundMessage();
        return;
    }

    try {
        const lesson = await fetchLessonDetails(lessonId);
        if (lesson) {
            updateLessonInfo(lesson);
        } else {
            displayLessonNotFoundMessage();
            return;
        }

        const nextLessons = await fetchNextLessons(lesson.curso_id, lessonId);
        if (nextLessons.length > 0) {
            updateNextLessonsList(nextLessons);
        } else {
            displayNoMoreLessonsMessage();
        }
    } catch (error) {
        console.error('Error fetching lesson details:', error);
        displayLessonNotFoundMessage();
    }

    function createNextLessonElement(leccion) {
        const lessonElement = document.createElement('div');
        lessonElement.classList.add('next-lesson');

        const lessonLink = document.createElement('a');
        lessonLink.href = userRegistered ? `lesson-registered.html?lesson=${leccion.id}` : `lesson.html?lesson=${leccion.id}`;
        lessonLink.textContent = leccion.nombre;

        lessonElement.appendChild(lessonLink);
        return lessonElement;
    }

    function displayLessonNotFoundMessage() {
        lessonTitle.textContent = 'Lección no encontrada';
        lessonDescription.textContent = '';
        lessonContent.innerHTML = '<p>La lección solicitada no existe o no se pudo cargar.</p>';
    }

    function updateLessonInfo(leccion) {
        lessonTitle.textContent = leccion.nombre;
        lessonDescription.textContent = leccion.descripcion;
        lessonContent.src = leccion.contenido.replace('watch?v=', 'embed/');
    }

    function updateNextLessonsList(lecciones) {
        lecciones.forEach(leccion => {
            const lessonElement = createNextLessonElement(leccion);
            nextLessonsList.appendChild(lessonElement);
        });
    }

    function displayNoMoreLessonsMessage() {
        const noLessonsMessage = document.createElement('p');
        noLessonsMessage.textContent = 'Ups! Ya no hay más lecciones.';
        nextLessonsList.appendChild(noLessonsMessage);
    }

    async function fetchLessonDetails(lessonId) {
        const response = await fetch(`http://localhost:3001/api/lecciones/${lessonId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }

    async function fetchNextLessons(courseId, currentLessonId) {
        const response = await fetch(`http://localhost:3001/api/cursos/${courseId}/lecciones`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const allLessons = await response.json();
        const currentIndex = allLessons.lecciones.findIndex(leccion => leccion.id === parseInt(currentLessonId));
        return allLessons.lecciones.slice(currentIndex + 1);
    }
});
