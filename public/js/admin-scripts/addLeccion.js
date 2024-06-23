document.addEventListener('DOMContentLoaded', () => {
    const addLessonButton = document.querySelector('.add-button');
    const addLessonFormContainer = document.createElement('div');
    addLessonFormContainer.classList.add('add-lesson-form');
    addLessonFormContainer.style.display = 'none';

    addLessonFormContainer.innerHTML = `
        <h3>Añadir Lección</h3>
        <form id="add-lesson-form">
            <label for="lesson-name">Nombre de la Lección</label>
            <input type="text" id="lesson-name" name="lesson-name" required>

            <label for="lesson-description">Descripción</label>
            <textarea id="lesson-description" name="lesson-description" required></textarea>

            <label for="lesson-type">Tipo de Contenido</label>
            <input type="text" id="lesson-type" name="lesson-type" required>

            <label for="lesson-content">Contenido</label>
            <textarea id="lesson-content" name="lesson-content"></textarea>

            <button type="submit">Guardar Lección</button>
            <button type="button" id="cancel-add-lesson">Cancelar</button>
        </form>
    `;

    document.querySelector('.course-lessons').appendChild(addLessonFormContainer);

    addLessonButton.addEventListener('click', () => {
        addLessonFormContainer.style.display = 'block';
        addLessonButton.style.display = 'none';
    });

    document.getElementById('cancel-add-lesson').addEventListener('click', () => {
        addLessonFormContainer.style.display = 'none';
        addLessonButton.style.display = 'block';
    });

    document.getElementById('add-lesson-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const courseId = new URLSearchParams(window.location.search).get('id');
        const lessonName = document.getElementById('lesson-name').value;
        const lessonDescription = document.getElementById('lesson-description').value;
        const lessonType = document.getElementById('lesson-type').value;
        const lessonContent = document.getElementById('lesson-content').value;

        const lessonData = {
            nombre: lessonName,
            descripcion: lessonDescription,
            tipoContenido: lessonType,
            contenido: lessonContent,
            curso_id: courseId
        };

        try {
            const response = await fetch('http://localhost:3001/api/lecciones', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(lessonData)
            });

            if (!response.ok) {
                throw new Error('Error al crear la lección.');
            }

            const newLesson = await response.json();
            console.log('Lección creada:', newLesson);

            addLessonFormContainer.style.display = 'none';
            addLessonButton.style.display = 'block';

            // Opcional: recargar la página para ver la nueva lección
            window.location.reload();
        } catch (error) {
            console.error('Error:', error);
        }
    });
});
