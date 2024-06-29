document.addEventListener('DOMContentLoaded', () => {
    async function editLesson(lessonId, courseId) {
        const editLessonFormContainer = document.createElement('div');
        editLessonFormContainer.classList.add('edit-lesson-form');
        editLessonFormContainer.style.display = 'none';

        editLessonFormContainer.innerHTML = `
            <h3>Editar Lección</h3>
            <form id="edit-lesson-form">
                <input type="hidden" id="edit-lesson-id">
                <input type="hidden" id="edit-lesson-course-id">
                <label for="edit-lesson-name">Nombre de la Lección</label>
                <input type="text" id="edit-lesson-name" name="lesson-name" required>

                <label for="edit-lesson-description">Descripción</label>
                <textarea id="edit-lesson-description" name="lesson-description" required></textarea>

                <label for="edit-lesson-type">Tipo de Contenido</label>
                <select id="edit-lesson-type" name="lesson-type" required>
                    <option value="video">Video</option>
                    <option value="texto">Texto</option>
                </select>

                <label for="edit-lesson-content">Contenido</label>
                <textarea id="edit-lesson-content" name="lesson-content"></textarea>

                <label for="edit-lesson-order">Orden</label>
                <input type="number" id="edit-lesson-order" name="lesson-order" required>

                <button type="submit">Guardar Cambios</button>
                <button type="button" id="cancel-edit-lesson">Cancelar</button>
            </form>
        `;

        document.querySelector('.course-lessons').appendChild(editLessonFormContainer);

        try {
            const lesson = await fetchLessonDetails(lessonId);
            if (lesson) {
                populateEditLessonForm(lesson, courseId);
                editLessonFormContainer.style.display = 'block';
            }
        } catch (error) {
            console.error('Error:', error);
        }

        document.getElementById('cancel-edit-lesson').addEventListener('click', () => {
            editLessonFormContainer.style.display = 'none';
        });

        document.getElementById('edit-lesson-form').addEventListener('submit', async (event) => {
            event.preventDefault();

            const lessonId = document.getElementById('edit-lesson-id').value;
            const courseId = document.getElementById('edit-lesson-course-id').value;
            const lessonName = document.getElementById('edit-lesson-name').value;
            const lessonDescription = document.getElementById('edit-lesson-description').value;
            const lessonType = document.getElementById('edit-lesson-type').value;
            const lessonContent = document.getElementById('edit-lesson-content').value;
            const lessonOrder = document.getElementById('edit-lesson-order').value;

            const lessonData = {
                nombre: lessonName,
                descripcion: lessonDescription,
                tipocontenido: lessonType,
                contenido: lessonContent,
                curso_id: courseId,
                orden: lessonOrder
            };

            try {
                const response = await fetch(`http://localhost:3001/api/lecciones/${lessonId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(lessonData)
                });

                if (!response.ok) {
                    throw new Error('Error al actualizar la lección.');
                }

                const updatedLesson = await response.json();
                console.log('Lección actualizada:', updatedLesson);

                editLessonFormContainer.style.display = 'none';

                // Opcional: recargar la página para ver los cambios
                window.location.reload();
            } catch (error) {
                console.error('Error:', error);
            }
        });

        async function fetchLessonDetails(lessonId) {
            try {
                const response = await fetch(`http://localhost:3001/api/lecciones/${lessonId}`);
                if (!response.ok) {
                    throw new Error('Error al obtener los detalles de la lección.');
                }
                return response.json();
            } catch (error) {
                console.error('Error:', error);
            }
        }

        function populateEditLessonForm(lesson, courseId) {
            document.getElementById('edit-lesson-id').value = lesson.id;
            document.getElementById('edit-lesson-course-id').value = courseId;
            document.getElementById('edit-lesson-name').value = lesson.nombre;
            document.getElementById('edit-lesson-description').value = lesson.descripcion;
            document.getElementById('edit-lesson-type').value = lesson.tipocontenido;
            document.getElementById('edit-lesson-content').value = lesson.contenido;
            document.getElementById('edit-lesson-order').value = lesson.orden;
        }
    }

    // Exponer la función editLesson globalmente para que pueda ser llamada desde loadCourse.js
    window.editLesson = editLesson;
});
