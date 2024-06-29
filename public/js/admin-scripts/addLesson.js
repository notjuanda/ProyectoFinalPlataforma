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
            <select id="lesson-type" name="lesson-type" required>
                <option value="video">Video</option>
                <option value="texto">Texto</option>
            </select>

            <div id="editor-container" class="editor-container">
                <label for="lesson-content">Contenido</label>
                <div id="editorjs"></div>
            </div>

            <div id="video-url-container">
                <label for="video-url">URL del Video</label>
                <input type="text" id="video-url" name="video-url">
            </div>

            <label for="lesson-order">Orden</label>
            <input type="number" id="lesson-order" name="lesson-order" required>

            <button type="submit">Guardar Lección</button>
            <button type="button" id="cancel-add-lesson">Cancelar</button>
        </form>
    `;

    document.querySelector('.course-lessons').appendChild(addLessonFormContainer);

    let editorInstance;

    addLessonButton.addEventListener('click', () => {
        addLessonFormContainer.style.display = 'block';
        addLessonButton.style.display = 'none';

        const lessonTypeSelect = document.getElementById('lesson-type');
        const editorContainer = document.getElementById('editor-container');
        const videoUrlContainer = document.getElementById('video-url-container');

        lessonTypeSelect.addEventListener('change', (event) => {
            if (event.target.value === 'texto') {
                editorContainer.classList.add('show');
                videoUrlContainer.classList.remove('show');

                // Inicializar EditorJS cuando se selecciona "texto"
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

        // Verificar el valor inicial al abrir el formulario
        if (lessonTypeSelect.value === 'texto') {
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
        } else if (lessonTypeSelect.value === 'video') {
            editorContainer.classList.remove('show');
            videoUrlContainer.classList.add('show');
        } else {
            editorContainer.classList.remove('show');
            videoUrlContainer.classList.remove('show');
        }
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
        const lessonOrder = document.getElementById('lesson-order').value;

        let lessonContent = '';

        if (lessonType === 'texto') {
            lessonContent = await editorInstance.save().then((outputData) => {
                const edjsParser = edjsHTML();
                const htmlData = edjsParser.parse(outputData);
                return htmlData.join(""); // Combina los datos HTML en una sola cadena
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
            tipoContenido: lessonType,
            contenido: lessonContent,
            curso_id: courseId,
            orden: lessonOrder
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

    async function fetchAndDisplayLessons() {
        const courseId = new URLSearchParams(window.location.search).get('id');
        if (!courseId) {
            console.error('ID del curso no encontrado en la URL');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3001/api/cursos/${courseId}/lecciones`);
            if (!response.ok) {
                throw new Error('Error al obtener los detalles del curso.');
            }

            const course = await response.json();
            const lessons = course.lecciones;

            lessons.sort((a, b) => a.orden - b.orden);

            const courseLessonsList = document.getElementById('course-lessons-list');
            courseLessonsList.innerHTML = '';
            lessons.forEach(lesson => {
                const lessonItem = document.createElement('li');
                lessonItem.dataset.lessonId = lesson.id;
                const lessonTitle = document.createElement('span');
                lessonTitle.classList.add('lesson-title');
                lessonTitle.textContent = lesson.nombre;

                const lessonActions = document.createElement('div');
                lessonActions.classList.add('lesson-actions');
                const editButton = document.createElement('button');
                editButton.classList.add('edit-button');
                editButton.textContent = 'Editar';
                editButton.addEventListener('click', () => editLesson(lesson.id));

                const deleteButton = document.createElement('button');
                deleteButton.classList.add('delete-button');
                deleteButton.textContent = 'Eliminar';
                deleteButton.addEventListener('click', () => deleteLesson(lesson.id));

                lessonActions.appendChild(editButton);
                lessonActions.appendChild(deleteButton);
                lessonItem.appendChild(lessonTitle);
                lessonItem.appendChild(lessonActions);
                courseLessonsList.appendChild(lessonItem);
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }

    fetchAndDisplayLessons();
});
