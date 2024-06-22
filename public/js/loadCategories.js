import Cookies from 'https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.mjs';

document.addEventListener('DOMContentLoaded', function() {
    const categoriesGrid = document.getElementById('categories-grid');

    fetch('http://localhost:3001/api/categorias')
    .then(response => response.json())
    .then(categorias => {
        if (categorias.length > 0) {
            categorias.forEach(categoria => {
                const categoryElement = document.createElement('article');
                categoryElement.classList.add('category');
                
                const categoryLink = document.createElement('a');
                const userRegistered = Cookies.get('userRegistered');
                    if (userRegistered === 'true') {
                        categoryLink.href = `courses-registered.html?category=${categoria.id}`;
                    } else {
                        categoryLink.href = `courses.html?category=${categoria.id}`;
                    }

                    const categoryImage = document.createElement('img');
                    categoryImage.src = `data:image/png;base64,${categoria.imagencategoria}`;
                    categoryImage.alt = categoria.nombre;

                    const categoryTitle = document.createElement('h3');
                    categoryTitle.textContent = categoria.nombre;
                    
                    categoryLink.appendChild(categoryImage);
                    categoryLink.appendChild(categoryTitle);
                    categoryElement.appendChild(categoryLink);
                    
                    categoriesGrid.appendChild(categoryElement);
                });
                
                try {
                    initCarousel();
                } catch (carouselError) {
                    console.error('Error initializing carousel:', carouselError);
                }
            } else {
                displayNoCategoriesMessage();
            }
        })
        .catch(error => {
            console.error('Error fetching categories:', error);
            displayNoCategoriesMessage();
        });
        
        function displayNoCategoriesMessage() {
            const messageElement = document.createElement('p');
            messageElement.classList.add('no-categories-message');
            messageElement.textContent = 'No hay categorías disponibles en este momento.';
            categoriesGrid.appendChild(messageElement);
    }
});