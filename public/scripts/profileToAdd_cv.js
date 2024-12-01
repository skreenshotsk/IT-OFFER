document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', function() {
            console.log('scriptsrabotal');
            const action = button.getAttribute('data-action');
            if (action === 'create-resume') {
                location.href = '/resume';
            } else if (action === 'create-vacancy') {
                location.href = '/vacancy';
            } else if (action === 'response-to-my-vacancies'){
                location.href = '/vacancy_application/response_to_my_vacancies';
            } else if (action === 'response-to-my-resumes'){
                location.href = '/resume_application/response_to_my_resumes';
            }
        });
    });
});