document.addEventListener('DOMContentLoaded', () => {
    const editTitleButton = document.getElementById('edit-title-button');
    const saveTitleButton = document.getElementById('save-title-button');
    const courseTitle = document.getElementById('course-title');
    const editCourseTitle = document.getElementById('edit-course-title');

    const editDescriptionButton = document.getElementById('edit-description-button');
    const saveDescriptionButton = document.getElementById('save-description-button');
    const courseDescription = document.getElementById('course-description');
    const editCourseDescription = document.getElementById('edit-course-description');

    const editCategoryButton = document.getElementById('edit-category-button');
    const saveCategoryButton = document.getElementById('save-category-button');
    const courseCategory = document.getElementById('course-category');
    const editCourseCategory = document.getElementById('edit-course-category');

    const editImageButton = document.getElementById('edit-image-button');
    const saveImageButton = document.getElementById('save-image-button');
    const courseImage = document.getElementById('course-image');
    const editCourseImage = document.getElementById('edit-course-image');

    let originalTitle = '';
    let originalDescription = '';
    let originalCategory = '';
    let originalImage = '';

    // Funcionalidad de edición y escape
    function setupEditButton(editButton, saveButton, originalValue, displayElement, editElement) {
        editButton.addEventListener('click', () => {
            originalValue = displayElement.textContent;
            editElement.value = displayElement.textContent;
            displayElement.style.display = 'none';
            editElement.style.display = 'block';
            editButton.style.display = 'none';
            saveButton.style.display = 'block';
        });

        saveButton.addEventListener('click', async () => {
            if (editElement.id === 'edit-course-description' && editElement.value.length > 78) {
                alert('La descripción no puede exceder los 78 caracteres.');
                return;
            }
            displayElement.textContent = editElement.value || originalValue;
            displayElement.style.display = 'block';
            editElement.style.display = 'none';
            editButton.style.display = 'block';
            saveButton.style.display = 'none';
            await saveCourseDetails();
        });

        editElement.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                editElement.value = originalValue;
                displayElement.style.display = 'block';
                editElement.style.display = 'none';
                editButton.style.display = 'block';
                saveButton.style.display = 'none';
            }
        });
    }

    setupEditButton(editTitleButton, saveTitleButton, originalTitle, courseTitle, editCourseTitle);
    setupEditButton(editDescriptionButton, saveDescriptionButton, originalDescription, courseDescription, editCourseDescription);

    editCategoryButton.addEventListener('click', async () => {
        originalCategory = courseCategory.textContent;
        try {
            const response = await fetch('http://localhost:3001/api/categorias');
            if (!response.ok) {
                throw new Error('Error al obtener las categorías.');
            }

            const categories = await response.json();
            editCourseCategory.innerHTML = '';
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.nombre;
                if (category.nombre === courseCategory.textContent) {
                    option.selected = true;
                }
                editCourseCategory.appendChild(option);
            });

            courseCategory.style.display = 'none';
            editCourseCategory.style.display = 'block';
            editCategoryButton.style.display = 'none';
            saveCategoryButton.style.display = 'block';
        } catch (error) {
            console.error('Error:', error);
        }
    });

    saveCategoryButton.addEventListener('click', async () => {
        const selectedOption = editCourseCategory.options[editCourseCategory.selectedIndex];
        courseCategory.textContent = selectedOption.textContent || originalCategory;
        courseCategory.dataset.categoryId = selectedOption.value || originalCategoryId;
        courseCategory.style.display = 'block';
        editCourseCategory.style.display = 'none';
        editCategoryButton.style.display = 'block';
        saveCategoryButton.style.display = 'none';
        await saveCourseDetails();
    });

    editImageButton.addEventListener('click', () => {
        originalImage = courseImage.src;
        editCourseImage.value = '';
        editCourseImage.style.display = 'block';
        editImageButton.style.display = 'none';
        saveImageButton.style.display = 'block';
    });

    saveImageButton.addEventListener('click', async () => {
        const file = editCourseImage.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                courseImage.src = reader.result;
                editCourseImage.style.display = 'none';
                editImageButton.style.display = 'block';
                saveImageButton.style.display = 'none';
                await saveCourseDetails();
            };
            reader.readAsDataURL(file);
        } else {
            courseImage.src = originalImage;
            editCourseImage.style.display = 'none';
            editImageButton.style.display = 'block';
            saveImageButton.style.display = 'none';
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            if (editCourseTitle.style.display === 'block') {
                editCourseTitle.value = originalTitle;
                courseTitle.style.display = 'block';
                editCourseTitle.style.display = 'none';
                editTitleButton.style.display = 'block';
                saveTitleButton.style.display = 'none';
            }

            if (editCourseDescription.style.display === 'block') {
                editCourseDescription.value = originalDescription;
                courseDescription.style.display = 'block';
                editCourseDescription.style.display = 'none';
                editDescriptionButton.style.display = 'block';
                saveDescriptionButton.style.display = 'none';
            }

            if (editCourseCategory.style.display === 'block') {
                editCourseCategory.value = originalCategory;
                courseCategory.style.display = 'block';
                editCourseCategory.style.display = 'none';
                editCategoryButton.style.display = 'block';
                saveCategoryButton.style.display = 'none';
            }

            if (editCourseImage.style.display === 'block') {
                courseImage.src = originalImage;
                editCourseImage.style.display = 'none';
                editImageButton.style.display = 'block';
                saveImageButton.style.display = 'none';
            }
        }
    });

    async function saveCourseDetails() {
        const courseId = new URLSearchParams(window.location.search).get('id');
        const newTitle = courseTitle.textContent;
        const newDescription = courseDescription.textContent;
        const newCategory = courseCategory.dataset.categoryId;

        let newImage = courseImage.src;
        if (newImage.startsWith('data:image')) {
            newImage = newImage.split(',')[1];
        } else {
            newImage = null;
        }

        try {
            const response = await fetch(`http://localhost:3001/api/cursos/${courseId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombreCurso: newTitle,
                    descripcion: newDescription,
                    categoria_id: newCategory,
                    imagenCurso: newImage
                })
            });

            if (!response.ok) {
                throw new Error('Error al actualizar los detalles del curso.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
});
