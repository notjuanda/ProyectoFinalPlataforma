document.addEventListener('DOMContentLoaded', () => {
    let editorInstance;

    async function editLesson(lessonId) {
        const editLessonFormContainer = document.getElementById('edit-lesson-form-container');

        let originalLesson = {};

        try {
            const lesson = await fetchLessonDetails(lessonId);
            if (lesson) {
                originalLesson = { ...lesson }; // Guardar copia original de la lección
                populateEditLessonForm(lesson);
                editLessonFormContainer.style.display = 'block';
            }
        } catch (error) {
            console.error('Error:', error);
        }

        document.getElementById('cancel-edit-lesson-unique').addEventListener('click', () => {
            populateEditLessonForm(originalLesson); // Restaurar valores originales
            editLessonFormContainer.style.display = 'none';
            clearEditorInstance();
        });

        document.getElementById('edit-lesson-form-unique').addEventListener('submit', async (event) => {
            event.preventDefault();

            const lessonId = document.getElementById('edit-lesson-id-unique').value;
            const courseId = document.getElementById('edit-lesson-course-id-unique').value;
            const lessonName = document.getElementById('edit-lesson-name-unique').value;
            const lessonDescription = document.getElementById('edit-lesson-description-unique').value;
            const lessonType = document.getElementById('edit-lesson-type-unique').value;
            const lessonOrder = document.getElementById('edit-lesson-order-unique').value;

            let lessonContent = '';

            if (lessonType === 'texto') {
                lessonContent = await editorInstance.save().then((outputData) => {
                    return JSON.stringify(outputData);
                }).catch((error) => {
                    console.log('Saving failed: ', error);
                    return '';
                });
            } else if (lessonType === 'video') {
                lessonContent = document.getElementById('video-url-unique').value;
            }

            const lessonData = {
                nombre: lessonName,
                descripcion: lessonDescription,
                tipoContenido: lessonType, // Usamos tipoContenido para enviar
                contenido: lessonContent,
                curso_id: courseId,
                orden: lessonOrder
            };

            try {
                const response = await fetch(`/api/lecciones/${lessonId}`, {
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
                clearEditorInstance();
                window.location.reload();
            } catch (error) {
                console.error('Error:', error);
            }
        });

        async function fetchLessonDetails(lessonId) {
            try {
                const response = await fetch(`/api/lecciones/${lessonId}`);
                if (!response.ok) {
                    throw new Error('Error al obtener los detalles de la lección.');
                }
                const lesson = await response.json();
                // Convertimos el campo tipocontenido a tipoContenido para ser usado en el formulario
                lesson.tipoContenido = lesson.tipocontenido;
                return lesson;
            } catch (error) {
                console.error('Error:', error);
            }
        }

        function populateEditLessonForm(lesson) {
            document.getElementById('edit-lesson-id-unique').value = lesson.id;
            document.getElementById('edit-lesson-course-id-unique').value = lesson.curso_id;
            document.getElementById('edit-lesson-name-unique').value = lesson.nombre;
            document.getElementById('edit-lesson-description-unique').value = lesson.descripcion;
            document.getElementById('edit-lesson-type-unique').value = lesson.tipoContenido; // Usamos tipoContenido aquí
            document.getElementById('edit-lesson-order-unique').value = lesson.orden;

            const lessonTypeSelect = document.getElementById('edit-lesson-type-unique');
            const editorContainer = document.getElementById('editor-container-unique');
            const videoUrlContainer = document.getElementById('video-url-container-unique');

            lessonTypeSelect.removeEventListener('change', handleContentChange);
            lessonTypeSelect.addEventListener('change', handleContentChange);

            handleContentChange({ target: { value: lesson.tipoContenido } }, lesson.contenido);
        }

        function handleContentChange(event, content = '') {
            const lessonType = event.target.value;
            const editorContainer = document.getElementById('editor-container-unique');
            const videoUrlContainer = document.getElementById('video-url-container-unique');

            if (lessonType === 'texto') {
                editorContainer.style.display = 'block';
                videoUrlContainer.style.display = 'none';

                let parsedContent = {};
                if (content) {
                    parsedContent = JSON.parse(content);
                }

                if (!editorInstance) {
                    editorInstance = new EditorJS({
                        holder: 'editorjs-unique',
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
                        data: parsedContent
                    });
                } else {
                    editorInstance.clear().then(() => {
                        editorInstance.render(parsedContent);
                    });
                }
            } else if (lessonType === 'video') {
                editorContainer.style.display = 'none';
                videoUrlContainer.style.display = 'block';
                document.getElementById('video-url-unique').value = content;
                clearEditorInstance();
            } else {
                editorContainer.style.display = 'none';
                videoUrlContainer.style.display = 'none';
                clearEditorInstance();
            }
        }

        function clearEditorInstance() {
            if (editorInstance) {
                document.getElementById('editorjs-unique').innerHTML = '';
                editorInstance = null;
            }
        }
    }

    // Exponer la función editLesson globalmente para que pueda ser llamada desde loadCourse.js
    window.editLesson = editLesson;
});
