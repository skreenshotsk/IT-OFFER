document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', function() {
            console.log('scriptsrabotal');
            const action = button.getAttribute('data-action');
            if (action === 'update-resume') {
                location.href = '/resume/update';
            } else if (action === 'update-edit-profile') {
                location.href = '/vacancy';
            }
        });
    });
});