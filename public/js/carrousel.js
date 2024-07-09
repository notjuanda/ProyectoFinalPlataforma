function initCarousel() {
    const categoriesGrid = document.querySelector('.categories-grid');
    const categories = Array.from(categoriesGrid.children);

    if (categories.length === 0) {
        console.error('No categories available for carousel');
        return;
    }

    // Duplicar categorías para continua
    categories.forEach(category => {
        const clone = category.cloneNode(true);
        categoriesGrid.appendChild(clone);
    });

    let scrollAmount = 0;
    const speed = 1; // velocidad
    let isScrolling = true;

    function startScrolling() {
        const firstCategory = categoriesGrid.firstElementChild;
        const firstCategoryWidth = firstCategory.offsetWidth + 30; //gap entra una categoria y otra

        if (!firstCategory) {
            console.error('First category not found');
            return;
        }

        if (isScrolling) {
            scrollAmount += speed;
            categoriesGrid.style.transform = `translateX(-${scrollAmount}px)`;

            if (scrollAmount >= firstCategoryWidth) {
                scrollAmount -= firstCategoryWidth;
                categoriesGrid.appendChild(firstCategory);
                categoriesGrid.style.transform = `translateX(-${scrollAmount}px)`;
            }
        }

        requestAnimationFrame(startScrolling);
    }

    categoriesGrid.addEventListener('mouseenter', function() {
        isScrolling = false;
    });

    categoriesGrid.addEventListener('mouseleave', function() {
        isScrolling = true;
    });

    startScrolling();
}

// Llamar a initCarousel cuando el DOM cargue todo
document.addEventListener('DOMContentLoaded', function() {
    initCarousel();
});
