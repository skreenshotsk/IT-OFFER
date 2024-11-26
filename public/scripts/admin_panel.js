// Функция для управления раскрытием списка
function toggleTable(tableId) {
    const tableSection = document.getElementById(tableId);
    const isHidden = tableSection.style.display === 'none';
    tableSection.style.display = isHidden ? 'block' : 'none';
}

function editRecord(table, recordId) {
    alert(`Редактировать запись ${recordId} из таблицы ${table}`);
}

function deleteRecord(table, recordId) {
    if (confirm(`Вы уверены, что хотите удалить запись ${recordId} из таблицы ${table}?`)) {
        alert(`Запись ${recordId} удалена из таблицы ${table}`);
    }
}

// Функция для переключения видимости элемента
function toggleElement(elementId) {
    const element = document.getElementById(elementId);
    element.style.display = element.style.display === 'none' ? 'block' : 'none';
}

// Функция для применения сортировки
function applySort() {
    const sortValue = document.getElementById('sortOptions').value;
    const [columnIndex, direction] = sortValue.split('_');
    sortUsersTable(parseInt(columnIndex), direction === 'asc');
}

// Локальная логика поиска
function searchRecords(searchFormId) {
    switch (searchFormId) {
        case 'searchFormUsers': {
            const searchId = document.getElementById('searchId').value.trim();
            const searchEmail = document.getElementById('searchEmail').value.trim().toLowerCase();
            const tableBody = document.getElementById('usersBody');
            const rows = tableBody.getElementsByTagName('tr');

            for (let row of rows) {
                const idCell = row.cells[0].innerText.trim();
                const emailCell = row.cells[3].innerText.trim().toLowerCase();

                const matchesId = searchId === "" || idCell === searchId;
                const matchesEmail = searchEmail === "" || emailCell.includes(searchEmail);

                row.style.display = (matchesId && matchesEmail) ? '' : 'none';
            }
            break;
        }

        case 'searchFormCandidates': {
            const searchCandidateId = document.getElementById('searchCandidateId').value.trim();
            const searchId = document.getElementById('searchId').value.trim();
            const tableBody = document.getElementById('candidatesBody');
            const rows = tableBody.getElementsByTagName('tr');

            for (let row of rows) {
                const candidateIdCell = row.cells[0].innerText.trim();
                const idCell = row.cells[1].innerText.trim();

                const matchesCandidateId = searchCandidateId === "" || candidateIdCell === searchCandidateId;
                const matchesId = searchId === "" || idCell === searchId;

                row.style.display = (matchesCandidateId && matchesId) ? '' : 'none';
            }
            break;
        }

        case 'searchFormEmployers': {
            const searchEmployerId = document.getElementById('searchEmployerId').value.trim();
            const searchCompanyName = document.getElementById('searchCompanyName').value.trim().toLowerCase();
            const tableBody = document.getElementById('employersBody');
            const rows = tableBody.getElementsByTagName('tr');

            for (let row of rows) {
                const employerIdCell = row.cells[0].innerText.trim();
                const companyNameCell = row.cells[2].innerText.trim().toLowerCase();

                const matchesEmployerId = searchEmployerId === "" || employerIdCell === searchEmployerId;
                const matchesCompanyName = searchCompanyName === "" || companyNameCell.includes(searchCompanyName);

                row.style.display = (matchesEmployerId && matchesCompanyName) ? '' : 'none';
            }
            break;
        }

        case 'searchFormVacancies': {
            const searchVacancyId = document.getElementById('searchVacancyId').value.trim();
            const searchTitle = document.getElementById('searchTitle').value.trim().toLowerCase();
            const tableBody = document.getElementById('vacanciesBody');
            const rows = tableBody.getElementsByTagName('tr');

            for (let row of rows) {
                const vacancyIdCell = row.cells[0].innerText.trim();
                const titleCell = row.cells[2].innerText.trim().toLowerCase();

                const matchesVacancyId = searchVacancyId === "" || vacancyIdCell === searchVacancyId;
                const matchesTitle = searchTitle === "" || titleCell.includes(searchTitle);

                row.style.display = (matchesVacancyId && matchesTitle) ? '' : 'none';
            }
            break;
        }

        case 'searchFormCandidateSkills': {
            const searchCandidateId = document.getElementById('searchCandidateId').value.trim();
            const tableBody = document.getElementById('candidateSkillsBody');
            const rows = tableBody.getElementsByTagName('tr');

            for (let row of rows) {
                const candidateIdCell = row.cells[0].innerText.trim();

                const matchesCandidateId = searchCandidateId === "" || candidateIdCell === searchCandidateId;

                row.style.display = matchesCandidateId ? '' : 'none';
            }
            break;
        }

        case 'searchFormVacancySkills': {
            const searchVacancyId = document.getElementById('searchVacancyId').value.trim();
            const tableBody = document.getElementById('vacancySkillsBody');
            const rows = tableBody.getElementsByTagName('tr');

            for (let row of rows) {
                const vacancyIdCell = row.cells[0].innerText.trim();

                const matchesVacancyId = searchVacancyId === "" || vacancyIdCell === searchVacancyId;

                row.style.display = matchesVacancyId ? '' : 'none';
            }
            break;
        }

        case 'searchFormApplications': {
            const searchApplicationId = document.getElementById('searchApplicationId').value.trim();
            const searchCandidateId = document.getElementById('searchCandidateId').value.trim();
            const searchVacancyId = document.getElementById('searchVacancyId').value.trim();
            const tableBody = document.getElementById('vacancySkillsBody');
            const rows = tableBody.getElementsByTagName('tr');

            for (let row of rows) {
                const applicationIdCell = row.cells[0].innerText.trim();
                const candidateIdCell = row.cells[1].innerText.trim();
                const vacancyIdCell = row.cells[2].innerText.trim();

                const matchesApplicationId = searchApplicationId === "" || applicationIdCell === searchApplicationId;
                const matchesCandidateId = searchCandidateId === "" || candidateIdCell === searchCandidateId;
                const matchesVacancyId = searchVacancyId === "" || vacancyIdCell === searchVacancyId;

                row.style.display = (matchesApplicationId && matchesCandidateId && matchesVacancyId) ? '' : 'none';
            }
            break;
        }

        case 'searchFormResumes': {
            const searchResumeId = document.getElementById('searchApplicationId').value.trim();
            const searchCandidateId = document.getElementById('searchCandidateId').value.trim();
            const tableBody = document.getElementById('vacancySkillsBody');
            const rows = tableBody.getElementsByTagName('tr');

            for (let row of rows) {
                const resumeIdCell = row.cells[0].innerText.trim();
                const candidateIdCell = row.cells[1].innerText.trim();

                const matchesResumeId = searchResumeId === "" || resumeIdCell === searchResumeId;
                const matchesCandidateId = searchCandidateId === "" || candidateIdCell === searchCandidateId;

                row.style.display = (matchesResumeId && matchesCandidateId) ? '' : 'none';
            }
            break;
        }

        case 'searchFormResumeApplications': {
            const searchApplicationId = document.getElementById('searchApplicationId').value.trim();
            const searchEmployerId = document.getElementById('searchEmployerId').value.trim();
            const searchResumeId = document.getElementById('searchApplicationId').value.trim();
            const tableBody = document.getElementById('vacancySkillsBody');
            const rows = tableBody.getElementsByTagName('tr');

            for (let row of rows) {
                const applicationIdCell = row.cells[0].innerText.trim();
                const employerIdCell = row.cells[1].innerText.trim();
                const resumeIdCell = row.cells[2].innerText.trim();

                const matchesApplicationId = searchApplicationId === "" || applicationIdCell === searchApplicationId;
                const matchesEmployerId = searchEmployerId === "" || employerIdCell === searchEmployerId;
                const matchesResumeId = searchResumeId === "" || resumeIdCell === searchResumeId;

                row.style.display = (matchesApplicationId && matchesEmployerId && matchesResumeId) ? '' : 'none';
            }
            break;
        }

        default:
            console.warn(`Форма с ID ${searchFormId} не поддерживается.`);
            break;
    }
}

// Функция для применения фильтров
function applyFilters(filterFormId) {
    switch(filterFormId) {
        case 'userFilterForm': {
            const nameFilter = document.getElementById('nameFilter').value.toLowerCase();
            const surnameFilter = document.getElementById('surnameFilter').value.toLowerCase();
            const roleFilter = document.getElementById('roleFilter').value;
            const dateFilter = document.getElementById('dateFilter').value;

            const rows = document.querySelectorAll('#usersBody tr');
            rows.forEach(row => {
                const name = row.cells[1].innerText.toLowerCase();
                const surname = row.cells[2].innerText.toLowerCase();
                const role = row.cells[6].innerText;
                const date = row.cells[7].innerText;

                const matchesName = !nameFilter || name.includes(nameFilter);
                const matchesSurname = !surnameFilter || surname.includes(surnameFilter);
                const matchesRole = !roleFilter || role === roleFilter;
                const matchesDate = !dateFilter || date === dateFilter;

                row.style.display = (matchesName && matchesSurname && matchesRole && matchesDate) ? '' : 'none';
            });
            break;
        }

        case 'candidateFilterForm': {
            const educationFilter = document.getElementById('educationFilter').value;

            const rows = document.querySelectorAll('#candidatesBody tr');
            rows.forEach(row => {
                const education = row.cells[4].innerText.toLowerCase();

                const matchesEducation = !educationFilter || education === educationFilter;

                row.style.display = (matchesEducation) ? '' : 'none';
            });
            break;
        }

        case 'employerFilterForm': {
            const companyNameFilter = document.getElementById('companyNameFilter').value.toLowerCase();

            const rows = document.querySelectorAll('#employersBody tr');
            rows.forEach(row => {
                const companyName = row.cells[2].innerText.toLowerCase();

                const matchesCompanyName = !companyNameFilter || companyName.includes(companyNameFilter);

                row.style.display = (matchesCompanyName) ? '' : 'none';
            });
            break;
        }

        case 'vacanciesFilterForm': {
            const employmentFilter = document.getElementById('employmentFilter').value;           
            const dateFilter = document.getElementById('dateFilter').value;

            const rows = document.querySelectorAll('#vacanciesBody tr');
            rows.forEach(row => {
                const employmentType = row.cells[6].innerText;
                const date = row.cells[8].innerText;
                
                const matchesRole = !employmentFilter || employmentType === employmentFilter;
                const matchesDate = !dateFilter || date === dateFilter;

                row.style.display = (matchesRole && matchesDate) ? '' : 'none';
            });
            break;
        }

        case 'applicationsFilterForm': {
            const statusFilter = document.getElementById('statusFilter').value;           
            const dateFilter = document.getElementById('dateFilter').value;

            const rows = document.querySelectorAll('#applicationsBody tr');
            rows.forEach(row => {
                const status = row.cells[3].innerText;
                const date = row.cells[4].innerText;
                
                const matchesStatus = !statusFilter || status.includes(statusFilter);
                const matchesDate = !dateFilter || date === dateFilter;

                row.style.display = (matchesStatus && matchesDate) ? '' : 'none';
            });
            break;
        }

        case 'resumesFilterForm': {
            const birthdateFilter = document.getElementById('birthdateFilter').value;           
            const dateFilter = document.getElementById('dateFilter').value;

            const rows = document.querySelectorAll('#resumesBody tr');
            rows.forEach(row => {
                const birthdate = row.cells[3].innerText;
                const date = row.cells[4].innerText;
                
                const matchesBirthdate = !birthdateFilter || birthdate === birthdateFilter;
                const matchesDate = !dateFilter || date === dateFilter;

                row.style.display = (matchesBirthdate && matchesDate) ? '' : 'none';
            });
            break;
        }

        case 'resumeApplicationsFilterForm': {
            const statusFilter = document.getElementById('statusFilter').value;           
            const dateFilter = document.getElementById('dateFilter').value;

            const rows = document.querySelectorAll('#applicationsBody tr');
            rows.forEach(row => {
                const status = row.cells[3].innerText;
                const date = row.cells[4].innerText;
                
                const matchesStatus = !statusFilter || status.includes(statusFilter);
                const matchesDate = !dateFilter || date === dateFilter;

                row.style.display = (matchesStatus && matchesDate) ? '' : 'none';
            });
            break;
        }

        default:
            console.warn(`Форма с ID ${filterFormId} не поддерживается.`);
            break;
    }
}



// Функция для сортировки таблицы
function sortUsersTable(columnIndex, isAscending) {
    const tableBody = document.getElementById('usersBody');
    const rows = Array.from(tableBody.rows);

    rows.sort((a, b) => {
        const aText = a.cells[columnIndex].innerText.toLowerCase();
        const bText = b.cells[columnIndex].innerText.toLowerCase();

        if (!isNaN(aText) && !isNaN(bText)) { // Numeric sort
            return isAscending ? aText - bText : bText - aText;
        }
        return isAscending ? aText.localeCompare(bText) : bText.localeCompare(aText);
    });

    rows.forEach(row => tableBody.appendChild(row));
}