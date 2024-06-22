import Cookies from 'https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.mjs';

document.addEventListener('DOMContentLoaded', async function() {
    const recommendationsContainer = document.querySelector('.recommended-courses');

    try {
        const response = await fetch('http://localhost:3001/api/cursos');
        if (!response.ok) {
            throw new Error('Error al obtener los cursos');
        }
        const cursos = await response.json();
        console.log('Cursos disponibles:', cursos);

        if (cursos.length > 0) {
            const uniqueCursos = getRandomUniqueElements(cursos, 3);
            uniqueCursos.forEach(curso => {
                const cursoElement = createCursoElement(curso);
                recommendationsContainer.appendChild(cursoElement);
            });
        } else {
            displayNoRecommendationsMessage(recommendationsContainer);
        }
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        displayNoRecommendationsMessage(recommendationsContainer);
    }

    function getRandomUniqueElements(arr, count) {
        const result = [];
        const usedIndices = new Set();
        while (result.length < count && usedIndices.size < arr.length) {
            const randomIndex = Math.floor(Math.random() * arr.length);
            if (!usedIndices.has(randomIndex)) {
                usedIndices.add(randomIndex);
                result.push(arr[randomIndex]);
            }
        }
        while (result.length < count) {
            result.push({ nombreCurso: 'Curso no disponible', descripcion: 'No hay más cursos disponibles', id: null });
        }
        return result;
    }

    function createCursoElement(curso) {
        const cursoElement = document.createElement('article');
        cursoElement.classList.add('course');

        const cursoTitle = document.createElement('h3');
        cursoTitle.textContent = curso.nombreCurso || curso.nombrecurso;

        const cursoDescription = document.createElement('p');
        cursoDescription.textContent = curso.descripcion;

        const cursoLink = document.createElement('a');
        cursoLink.href = curso.id ? `course-detail.html?course=${curso.id}` : '#';
        cursoLink.classList.add('course-link');
        cursoLink.textContent = 'Ver más';

        cursoElement.appendChild(cursoTitle);
        cursoElement.appendChild(cursoDescription);
        cursoElement.appendChild(cursoLink);

        return cursoElement;
    }

    function displayNoRecommendationsMessage(container) {
        const messageElement = document.createElement('p');
        messageElement.classList.add('no-recommendations-message');
        messageElement.textContent = 'No hay recomendaciones disponibles en este momento.';
        container.appendChild(messageElement);
    }
});
