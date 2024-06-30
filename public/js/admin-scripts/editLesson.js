document.addEventListener('DOMContentLoaded', () => {
    async function editLesson(lessonId) {
        const editLessonFormContainer = document.createElement('div');
        editLessonFormContainer.classList.add('edit-lesson-form');
        editLessonFormContainer.style.display = 'none';

        editLessonFormContainer.innerHTML = `
            <h3>Editar Lección</h3>
            <form id="edit-lesson-form">
                <input type="hidden" id="edit-lesson-id">
                <input type="hidden" id="edit-lesson-course-id">
                <label for="edit-lesson-name">Nombre de la Lección:</label>
                <input type="text" id="edit-lesson-name" name="lesson-name" required>
                <label for="edit-lesson-description">Descripción:</label>
                <textarea id="edit-lesson-description" name="lesson-description" required></textarea>
                <label for="edit-lesson-type">Tipo de Contenido:</label>
                <select id="edit-lesson-type" name="lesson-type" required>
                    <option value="video">Video</option>
                    <option value="texto">Texto</option>
                </select>
                <div id="editor-container" class="editor-container">
                    <label for="edit-lesson-content">Contenido:</label>
                    <div id="editorjs"></div>
                </div>
                <div id="video-url-container">
                    <label for="video-url">URL del Video:</label>
                    <input type="text" id="video-url" name="video-url">
                </div>
                <label for="edit-lesson-order">Orden:</label>
                <input type="number" id="edit-lesson-order" name="lesson-order" required>
                <button type="submit">Guardar Cambios</button>
                <button type="button" id="cancel-edit-lesson">Cancelar</button>
            </form>
        `;

        document.querySelector('.course-lessons').appendChild(editLessonFormContainer);

        let editorInstance;

        try {
            const lesson = await fetchLessonDetails(lessonId);
            if (lesson) {
                populateEditLessonForm(lesson);
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
            const lessonOrder = document.getElementById('edit-lesson-order').value;

            let lessonContent = '';

            if (lessonType === 'texto') {
                lessonContent = await editorInstance.save().then((outputData) => {
                    return JSON.stringify(outputData);
                }).catch((error) => {
                    console.log('Saving failed: ', error);
                    return '';
                });
            } else if (lessonType === 'video') {
                lessonContent = document.getElementById('video-url').value;
            }

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

        function populateEditLessonForm(lesson) {
            document.getElementById('edit-lesson-id').value = lesson.id;
            document.getElementById('edit-lesson-course-id').value = lesson.curso_id;
            document.getElementById('edit-lesson-name').value = lesson.nombre;
            document.getElementById('edit-lesson-description').value = lesson.descripcion;
            document.getElementById('edit-lesson-type').value = lesson.tipocontenido;
            document.getElementById('edit-lesson-order').value = lesson.orden;

            const lessonTypeSelect = document.getElementById('edit-lesson-type');
            const editorContainer = document.getElementById('editor-container');
            const videoUrlContainer = document.getElementById('video-url-container');
            const editorContentTextarea = document.getElementById('edit-lesson-content');

            lessonTypeSelect.addEventListener('change', (event) => {
                if (event.target.value === 'texto') {
                    editorContainer.classList.add('show');
                    videoUrlContainer.classList.remove('show');
                    if (!editorInstance) {
                        editorInstance = new EditorJS({
                            holder: 'editorjs',
                            tools: {
                                header: Header,
                                list: List,
                                quote: Quote,
                                marker: Marker,
                                code: CodeTool,
                                delimiter: Delimiter,
                                inlineCode: InlineCode,
                                linkTool: LinkTool,
                                embed: Embed
                            }
                        });
                    }
                } else if (event.target.value === 'video') {
                    editorContainer.classList.remove('show');
                    videoUrlContainer.classList.add('show');
                } else {
                    editorContainer.classList.remove('show');
                    videoUrlContainer.classList.remove('show');
                }
            });

            if (lesson.tipocontenido === 'texto') {
                editorContainer.classList.add('show');
                videoUrlContainer.classList.remove('show');
                editorInstance = new EditorJS({
                    holder: 'editorjs',
                    tools: {
                        header: Header,
                        list: List,
                        quote: Quote,
                        marker: Marker,
                        code: CodeTool,
                        delimiter: Delimiter,
                        inlineCode: InlineCode,
                        linkTool: LinkTool,
                        embed: Embed
                    },
                    data: JSON.parse(editorContentTextarea.value) // Cargar el contenido existente en el editor
                });
            } else if (lesson.tipocontenido === 'video') {
                editorContainer.classList.remove('show');
                videoUrlContainer.classList.add('show');
                document.getElementById('video-url').value = lesson.contenido;
            } else {
                editorContainer.classList.remove('show');
                videoUrlContainer.classList.remove('show');
            }
        }
    }

    // Exponer la función editLesson globalmente para que pueda ser llamada desde loadCourse.js
    window.editLesson = editLesson;
});
