import Cookies from 'https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.mjs';

document.addEventListener('DOMContentLoaded', async function() {
    const lessonId = new URLSearchParams(window.location.search).get('lesson');
    const userId = Cookies.get('userId');
    const userRegistered = Cookies.get('userRegistered');
    
    if (!lessonId || !userId || userRegistered !== 'true') {
        displayLessonNotFoundMessage();
        return;
    }

    try {
        const lesson = await fetchLessonDetails(lessonId);
        if (lesson) {
            updateLessonInfo(lesson);
            await markLessonAsViewed(userId, lessonId); // Marcar como visto
            const nextLessons = await fetchNextLessons(lessonId);
            updateNextLessonsList(nextLessons);
        } else {
            displayLessonNotFoundMessage();
        }
    } catch (error) {
        console.error('Error fetching lesson details:', error);
        displayLessonNotFoundMessage();
    }

    async function markLessonAsViewed(userId, lessonId) {
        const response = await fetch(`http://localhost:3001/api/progresos/visto/${userId}/leccion/${lessonId}`, {
            method: 'PUT'
        });
        if (!response.ok) {
            throw new Error('Error updating lesson status');
        }
        return response.json();
    }
    
    async function fetchLessonDetails(lessonId) {
        const response = await fetch(`http://localhost:3001/api/lecciones/${lessonId}`);
        if (!response.ok) {
            throw new Error('Error fetching lesson details');
        }
        return response.json();
    }

    function updateLessonInfo(lesson) {
        document.getElementById('lesson-title').textContent = lesson.nombre;
        document.getElementById('lesson-description').textContent = lesson.descripcion;
        document.getElementById('lesson-video').src = `https://www.youtube.com/embed/${lesson.contenido.split('v=')[1]}`;
    }

    async function fetchNextLessons(lessonId) {
        const response = await fetch(`http://localhost:3001/api/lecciones/${lessonId}/next`);
        if (!response.ok) {
            throw new Error('Error fetching next lessons');
        }
        return response.json();
    }

    function updateNextLessonsList(lessons) {
        const lessonsList = document.getElementById('next-lessons-list');
        lessonsList.innerHTML = '';

        if (lessons.length > 0) {
            lessons.forEach(lesson => {
                const lessonItem = document.createElement('li');
                const lessonLink = document.createElement('a');
                lessonLink.href = `lesson-registered.html?lesson=${lesson.id}`;
                lessonLink.textContent = lesson.nombre;
                lessonItem.appendChild(lessonLink);
                lessonsList.appendChild(lessonItem);
            });
        } else {
            const noLessonsMessage = document.createElement('p');
            noLessonsMessage.textContent = 'Ups! Ya no hay más lecciones';
            lessonsList.appendChild(noLessonsMessage);
        }
    }

    function displayLessonNotFoundMessage() {
        document.getElementById('lesson-title').textContent = 'Lección no encontrada';
        document.getElementById('lesson-description').textContent = 'La lección solicitada no existe o no se pudo cargar.';
    }
});
