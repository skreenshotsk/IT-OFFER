document.getElementById('filterButton').addEventListener('click', () => {
    document.getElementById('filterOptions').style.display = 'block';
});

document.getElementById('applyFilter').addEventListener('click', () => {
    const salaryFilter = document.getElementById('salaryFilter').value;
    const checkboxes = document.querySelectorAll('#checkboxList input[type="checkbox"]:checked');
    const selectedSkills = Array.from(checkboxes).map(checkbox => checkbox.value);
    const vacancies = document.querySelectorAll('.vacancy');

    vacancies.forEach(vacancy => {
        const salary = parseInt(vacancy.dataset.salary);
        const skills = vacancy.dataset.skills.split(', ');

        if ((salary >= salaryFilter || !salaryFilter) &&
            selectedSkills.every(skill => skills.includes(skill))) {
            vacancy.style.display = '';
        } else {
            vacancy.style.display = 'none';
        }
    });
});
