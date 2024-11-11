document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('toggleButton');
    const dropdown = document.getElementById('dropdown');

    button.addEventListener('click', function() {
        dropdown.classList.toggle('show');
    });

    // Закрытие выпадающего окна при клике вне его
    window.addEventListener('click', function(event) {
        if (!event.target.matches('#toggleButton')) {
            if (dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
            }
        }
    });
});