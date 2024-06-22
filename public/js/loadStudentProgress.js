import Cookies from 'https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.mjs';

document.addEventListener('DOMContentLoaded', async function() {
    const userId = Cookies.get('userId');
    if (!userId) {
        console.error('No user ID found');
        return;
    }

    const progressGrid = document.querySelector('.progress .progress-grid');

    try {
        const response = await fetch(`http://localhost:3001/api/usuarios/${userId}/cursos`);
        if (!response.ok) {
            throw new Error('Error al obtener los cursos del usuario');
        }
        const cursos = await response.json();
        console.log('Cursos del usuario:', cursos);

        if (cursos.length > 0) {
            for (const curso of cursos) {
                const progressResponse = await fetch(`http://localhost:3001/api/progresos/usuario/${userId}/curso/${curso.id}/progreso`);
                if (!progressResponse.ok) {
                    throw new Error(`Error al obtener el progreso del curso ${curso.id}`);
                }
                const progressData = await progressResponse.json();
                const progressElement = createProgressElement(curso, progressData.progreso);
                progressGrid.appendChild(progressElement);
            }
        } else {
            displayNoProgressMessage(progressGrid);
        }
    } catch (error) {
        console.error('Error fetching user progress:', error);
        displayNoProgressMessage(progressGrid);
    }

    function createProgressElement(curso, progreso) {
        const progressElement = document.createElement('article');
        progressElement.classList.add('progress-item');

        const courseTitle = document.createElement('h3');
        courseTitle.textContent = curso.nombrecurso;

        const progressBar = document.createElement('div');
        progressBar.classList.add('progress-bar');

        const progressFill = document.createElement('div');
        progressFill.classList.add('progress-completed');
        progressFill.style.width = `${progreso}%`;

        const progressText = document.createElement('p');
        progressText.textContent = `Progreso: ${progreso.toFixed(2)}%`;

        progressBar.appendChild(progressFill);

        progressElement.appendChild(courseTitle);
        progressElement.appendChild(progressBar);
        progressElement.appendChild(progressText);

        return progressElement;
    }

    function displayNoProgressMessage(container) {
        const messageElement = document.createElement('p');
        messageElement.classList.add('no-progress-message');
        messageElement.textContent = 'No hay progresos disponibles en este momento.';
        container.appendChild(messageElement);
    }
});
