import Cookies from 'https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.mjs';

document.addEventListener('DOMContentLoaded', function() {
    const allClassesContainer = document.getElementById('all-classes');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const noCoursesMessageContainer = document.createElement('div');

    const urlParams = new URLSearchParams(window.location.search);
    const categoriaId = urlParams.get('category');

    if (!categoriaId) {
        console.error('No category ID provided');
        displayNoCoursesMessage('No se proporcionó un ID de categoría.');
        return;
    }

    loadCourses();

    searchButton.addEventListener('click', function() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if(searchTerm.length == 0){
            loadCourses(searchTerm);
        }
        else if (searchTerm.length < 4) {
            alert("Inserta al menos 3 letras")
            return;
        }
        loadCourses(searchTerm);
    });

    function loadCourses(searchTerm = '') {
        fetch(`/api/categorias/${categoriaId}/cursos`)
            .then(response => response.json())
            .then(categoria => {
                console.log('Cursos:', categoria.cursos);
                allClassesContainer.innerHTML = '';
                noCoursesMessageContainer.innerHTML = '';
                if (categoria && categoria.cursos.length > 0) {
                    const filteredCourses = categoria.cursos.filter(curso =>
                        curso.nombreCurso.toLowerCase().includes(searchTerm) || curso.descripcion.toLowerCase().includes(searchTerm)
                    );

                    if (filteredCourses.length > 0) {
                        // Mostrar todos los cursos de la categoría
                        filteredCourses.forEach(curso => {
                            const courseElement = createCourseElement(curso);
                            allClassesContainer.appendChild(courseElement);
                        });
                    } else {
                        displayNoCoursesMessage('No hay cursos que coincidan con tu búsqueda.');
                    }
                } else {
                    displayNoCoursesMessage('No hay cursos disponibles en este momento.');
                }
            })
            .catch(error => {
                console.error('Error fetching category with courses:', error);
                displayNoCoursesMessage('Error al obtener cursos de la categoría.');
            });
    }

    function createCourseElement(curso) {
        const courseElement = document.createElement('article');
        courseElement.classList.add('course');

        const courseLink = document.createElement('a');
        const userRegistered = Cookies.get('userRegistered');
        if (userRegistered === 'true') {
            courseLink.href = `course-detail-registered.html?course=${curso.id}`;
        } else {
            courseLink.href = `course-detail.html?course=${curso.id}`;
        }

        const courseTitle = document.createElement('h3');
        courseTitle.textContent = curso.nombreCurso;

        const courseDescription = document.createElement('p');
        courseDescription.textContent = curso.descripcion;

        courseLink.appendChild(courseTitle);
        courseLink.appendChild(courseDescription);
        courseElement.appendChild(courseLink);

        return courseElement;
    }

    function displayNoCoursesMessage(message) {
        const messageElement = document.createElement('p');
        messageElement.classList.add('no-courses-message');
        messageElement.textContent = message;
        noCoursesMessageContainer.appendChild(messageElement);
        allClassesContainer.appendChild(noCoursesMessageContainer);
    }
});
