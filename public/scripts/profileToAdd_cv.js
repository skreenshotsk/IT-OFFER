document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', function() {
            console.log('scriptsrabotal');
            const action = button.getAttribute('data-action');
            if (action === 'create-resume') {
                location.href = '/resume';
            } else if (action === 'create-vacancy') {
                location.href = '/vacancy';
            }
        });
    });
});