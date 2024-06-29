document.addEventListener('DOMContentLoaded', () => {
    async function deleteLesson(lessonId) {
        if (confirm('¿Estás seguro de que quieres eliminar esta lección?')) {
            try {
                const response = await fetch(`http://localhost:3001/api/lecciones/${lessonId}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    throw new Error('Error al eliminar la lección.');
                }

                console.log('Lección eliminada');
                // Opcional: recargar la página para ver los cambios
                window.location.reload();
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }

    // Exponer la función deleteLesson globalmente para que pueda ser llamada desde loadCourse.js
    window.deleteLesson = deleteLesson;
});
