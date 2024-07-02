document.addEventListener('DOMContentLoaded', async () => {
    const courseId = new URLSearchParams(window.location.search).get('id');
    const courseTitle = document.getElementById('course-title');
    const courseImage = document.getElementById('course-image');
    const courseDescription = document.getElementById('course-description');
    const courseCategory = document.getElementById('course-category');
    const courseLessonsList = document.getElementById('course-lessons-list');

    if (!courseId) {
        console.error('ID del curso no encontrado en la URL');
        return;
    }

    try {
        const response = await fetch(`/api/cursos/${courseId}/lecciones`);
        if (!response.ok) {
            throw new Error('Error al obtener los detalles del curso.');
        }

        const course = await response.json();
        console.log('Detalles del curso:', course);
        courseTitle.textContent = course.nombrecurso || '';
        courseDescription.textContent = course.descripcion || '';

        if (course.imagencurso) {
            courseImage.src = `data:image/png;base64,${course.imagencurso}`;
        } else {
            courseImage.src = 'image/default-course.png';
        }

        const categoryResponse = await fetch(`/api/categorias/${course.categoria_id}`);
        if (categoryResponse.ok) {
            const category = await categoryResponse.json();
            courseCategory.textContent = category.nombre || 'Sin categoría';
            courseCategory.dataset.categoryId = category.id; // Agregamos un dataset para almacenar el ID de la categoría
        } else {
            courseCategory.textContent = 'Sin categoría';
        }

        const lessons = course.lecciones;
        console.log('Lecciones del curso:', lessons);

        // Ordenar lecciones por el campo de orden
        lessons.sort((a, b) => a.orden - b.orden);

        courseLessonsList.innerHTML = '';
        lessons.forEach(lesson => {
            const lessonItem = document.createElement('li');
            lessonItem.dataset.lessonId = lesson.id; // Añadir el ID de la lección como data attribute
            const lessonTitle = document.createElement('span');
            lessonTitle.classList.add('lesson-title');
            lessonTitle.textContent = lesson.nombre;

            const lessonActions = document.createElement('div');
            lessonActions.classList.add('lesson-actions');
            const editButton = document.createElement('button');
            editButton.classList.add('edit-button');
            editButton.textContent = 'Editar';
            editButton.addEventListener('click', () => window.editLesson(lesson.id, courseId)); // Añadir evento de clic con courseId

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.addEventListener('click', () => window.deleteLesson(lesson.id)); // Añadir evento de clic

            lessonActions.appendChild(editButton);
            lessonActions.appendChild(deleteButton);
            lessonItem.appendChild(lessonTitle);
            lessonItem.appendChild(lessonActions);
            courseLessonsList.appendChild(lessonItem);
        });
    } catch (error) {
        console.error('Error:', error);
    }
});
