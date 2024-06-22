import Cookies from 'https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.mjs';

document.addEventListener('DOMContentLoaded', async function() {
    const lessonId = new URLSearchParams(window.location.search).get('lesson');
    const userId = Cookies.get('userId');
    const lessonTitleElement = document.getElementById('lesson-title');
    const lessonDescriptionElement = document.getElementById('lesson-description');
    const lessonContentElement = document.getElementById('lesson-content');
    const nextLessonsListElement = document.getElementById('next-lessons');

    if (!lessonId) {
        displayLessonNotFoundMessage();
        return;
    }

    try {
        const lesson = await fetchLessonDetails(lessonId);
        if (lesson) {
            updateLessonInfo(lesson);
            const nextLessons = await fetchNextLessons(lesson.curso_id, lessonId);
            updateNextLessonsList(nextLessons);
            await markLessonAsViewed(userId, lessonId);
        } else {
            displayLessonNotFoundMessage();
        }
    } catch (error) {
        console.error('Error fetching lesson details:', error);
        displayLessonNotFoundMessage();
    }

    function displayLessonNotFoundMessage() {
        if (lessonTitleElement) lessonTitleElement.textContent = 'Lección no encontrada';
        if (lessonDescriptionElement) lessonDescriptionElement.textContent = '';
        if (lessonContentElement) lessonContentElement.innerHTML = '';
        if (nextLessonsListElement) {
            const noLessonMessage = document.createElement('p');
            noLessonMessage.textContent = 'La lección solicitada no existe o no se pudo cargar.';
            nextLessonsListElement.appendChild(noLessonMessage);
        }
    }

    async function fetchLessonDetails(lessonId) {
        const response = await fetch(`http://localhost:3001/api/lecciones/${lessonId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }

    function updateLessonInfo(lesson) {
        if (lessonTitleElement) lessonTitleElement.textContent = lesson.nombre;
        if (lessonDescriptionElement) lessonDescriptionElement.textContent = lesson.descripcion;
        if (lessonContentElement) {
            lessonContentElement.src = lesson.contenido; // Asegúrate de que 'contenido' sea la URL del video embebido de YouTube
        }
    }

    async function fetchNextLessons(courseId, currentLessonId) {
        const response = await fetch(`http://localhost:3001/api/cursos/${courseId}/lecciones`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const allLessons = await response.json();

        if (!Array.isArray(allLessons.lecciones)) {
            throw new Error('Expected allLessons.lecciones to be an array');
        }

        const currentIndex = allLessons.lecciones.findIndex(lesson => lesson.id === parseInt(currentLessonId));
        if (currentIndex === -1) {
            throw new Error('Current lesson not found in all lessons');
        }

        return allLessons.lecciones.slice(currentIndex + 1);
    }

    function updateNextLessonsList(nextLessons) {
        if (nextLessons.length > 0) {
            nextLessons.forEach(lesson => {
                const lessonElement = document.createElement('div');
                lessonElement.classList.add('next-lesson');

                const lessonLink = document.createElement('a');
                lessonLink.href = `lesson-registered.html?lesson=${lesson.id}`;

                const lessonTitle = document.createElement('h3');
                lessonTitle.textContent = lesson.nombre;

                const lessonDescription = document.createElement('p');
                lessonDescription.textContent = lesson.descripcion;

                lessonLink.appendChild(lessonTitle);
                lessonLink.appendChild(lessonDescription);
                lessonElement.appendChild(lessonLink);
                if (nextLessonsListElement) nextLessonsListElement.appendChild(lessonElement);
            });
        } else {
            if (nextLessonsListElement) {
                const noMoreLessonsMessage = document.createElement('p');
                noMoreLessonsMessage.textContent = 'Ups! Ya no hay más lecciones.';
                nextLessonsListElement.appendChild(noMoreLessonsMessage);
            }
        }
    }

    async function markLessonAsViewed(userId, lessonId) {
        try {
            const response = await fetch(`http://localhost:3001/api/progresos/${lessonId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ usuario_id: userId, leccion_id: lessonId, estado: 'Visto' })
            });

            if (!response.ok) {
                throw new Error('Error marking lesson as viewed');
            }
        } catch (error) {
            console.error('Error marking lesson as viewed:', error);
        }
    }
});
