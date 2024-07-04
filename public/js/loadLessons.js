import Cookies from 'https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.mjs';

document.addEventListener('DOMContentLoaded', async function() {
    const lessonId = new URLSearchParams(window.location.search).get('lesson');
    const userId = Cookies.get('userId');
    const lessonTitleElement = document.getElementById('lesson-title');
    const lessonDescriptionElement = document.getElementById('lesson-description');
    const lessonContentElement = document.getElementById('lesson-content');
    const lessonTextContentElement = document.getElementById('lesson-text-content');
    const nextLessonsListElement = document.getElementById('next-lessons');

    if (!lessonId) {
        displayLessonNotFoundMessage();
        return;
    }

    try {
        const lesson = await fetchLessonDetails(lessonId);
        if (lesson) {
            updateLessonInfo(lesson);
            const nextLessons = await fetchNextLessons(lesson.curso_id, lesson.orden);
            updateNextLessonsList(nextLessons, lesson.orden);
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
        if (lessonTextContentElement) lessonTextContentElement.innerHTML = '';
        if (nextLessonsListElement) {
            const noLessonMessage = document.createElement('p');
            noLessonMessage.textContent = 'La lección solicitada no existe o no se pudo cargar.';
            nextLessonsListElement.appendChild(noLessonMessage);
        }
    }

    async function fetchLessonDetails(lessonId) {
        const response = await fetch(`/api/lecciones/${lessonId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }

    function updateLessonInfo(lesson) {
        if (lessonTitleElement) lessonTitleElement.textContent = lesson.nombre;
        if (lessonDescriptionElement) lessonDescriptionElement.textContent = lesson.descripcion;
        if (lesson.tipocontenido === 'video') {
            lessonContentElement.style.display = 'block';
            lessonTextContentElement.style.display = 'none';
            const videoId = getVideoId(lesson.contenido);
            if (videoId) {
                lessonContentElement.src = `https://www.youtube.com/embed/${videoId}`;
            } else {
                lessonContentElement.style.display = 'none';
                displayLessonNotFoundMessage();
            }
        } else if (lesson.tipocontenido === 'texto') {
            lessonContentElement.style.display = 'none';
            lessonTextContentElement.style.display = 'block';
            renderEditorContent(lesson.contenido);
        }
    }

    function getVideoId(url) {
        const videoIdMatch = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)\/(?:watch\?v=|embed\/|v\/|.+\?v=)?([^&\n?/]+)/);
        return videoIdMatch ? videoIdMatch[1] : null;
    }

    async function fetchNextLessons(courseId, currentLessonOrder) {
        const response = await fetch(`/api/cursos/${courseId}/lecciones`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const allLessons = await response.json();

        if (!Array.isArray(allLessons.lecciones)) {
            throw new Error('Expected allLessons.lecciones to be an array');
        }

        // Ordenar las lecciones por la columna 'orden'
        const sortedLessons = allLessons.lecciones.sort((a, b) => a.orden - b.orden);
        const currentIndex = sortedLessons.findIndex(lesson => lesson.orden === parseInt(currentLessonOrder));

        if (currentIndex === -1) {
            throw new Error('Current lesson not found in all lessons');
        }

        return sortedLessons.slice(currentIndex + 1);
    }

    function updateNextLessonsList(nextLessons, currentLessonOrder) {
        if (nextLessons.length > 0) {
            nextLessons.forEach(lesson => {
                if (lesson.orden !== currentLessonOrder) { // Excluir la lección actual
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
                }
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
            const progreso = await getProgresoByUserAndLesson(userId, lessonId);
            if (!progreso) {
                throw new Error('Progreso no encontrado');
            }

            const response = await fetch(`/api/progresos/${progreso.id}`, {
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

    async function getProgresoByUserAndLesson(userId, lessonId) {
        const response = await fetch(`/api/progresos/user/${userId}/lesson/${lessonId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }

    function renderEditorContent(data) {
        try {
            const parsedData = JSON.parse(data);
            const edjsParser = edjsHTML();
            const html = edjsParser.parse(parsedData);
            lessonTextContentElement.innerHTML = html.join("");
        } catch (error) {
            console.error('Error parsing editor content:', error);
            lessonTextContentElement.innerHTML = data; // fallback to plain HTML
        }
    }
});
