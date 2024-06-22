document.addEventListener('DOMContentLoaded', function() {
    if (!Cookies.get('userRegistered')) {
        window.location.href = 'index.html';
    }
});
