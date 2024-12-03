document.getElementById('filterButton').addEventListener('click', function() {
    var filterOptions = document.getElementById('filterOptions');
    if (filterOptions.style.display === 'none') {
        filterOptions.style.display = 'block';
    } else {
        filterOptions.style.display = 'none';
    }
});

document.getElementById('applyFilter').addEventListener('click', () => {
    const salaryFilter = document.getElementById('salaryFilter').value;
    const checkboxes = document.querySelectorAll('#checkboxList input[type="checkbox"]:checked');
    const selectedSkills = Array.from(checkboxes).map(checkbox => checkbox.value);
    const vacancies = document.querySelectorAll('.vacancy');

    vacancies.forEach(vacancy => {
        const salary = parseInt(vacancy.dataset.salary);
        const skills = vacancy.dataset.skills.split(',').filter(skill => skill.trim() !== '');

        // Отладка: вывод данных в консоль
        console.log('Salary:', salary);
        console.log('Skills:', skills);
        console.log('Salary Filter:', salaryFilter);
        console.log('Selected Skills:', selectedSkills);

        if ((salary >= salaryFilter || !salaryFilter) &&
            selectedSkills.every(skill => skills.includes(skill))) {
            vacancy.style.display = '';
        } else {
            vacancy.style.display = 'none';
        }
    });
});