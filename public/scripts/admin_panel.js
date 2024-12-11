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
function applySort(tBody) {
    const sortValue = document.getElementById('sortOptions').value;
    const [columnIndex, direction] = sortValue.split('_');
    sortTable(tBody, parseInt(columnIndex), direction === 'asc');
}

function searchRecords(searchFormId) {
    const form = document.getElementById(searchFormId); // Контекст формы
    if (!form) {
        console.error(`Форма с ID ${searchFormId} не найдена.`);
        return;
    }
    
    const searchConfig = {
        searchFormUsers: {
            tableBodyId: 'usersBody',
            searchFields: [
                { inputSelector: '[name="searchId"]', cellIndex: 0 },
                { inputSelector: '[name="searchEmail"]', cellIndex: 3, isCaseInsensitive: true, isPartialMatch: true },
            ],
        },
        searchFormCandidates: {
            tableBodyId: 'candidatesBody',
            searchFields: [
                { inputSelector: '[name="searchCandidateId"]', cellIndex: 0 },
                { inputSelector: '[name="searchId"]', cellIndex: 1 },
            ],
        },
        searchFormEmployers: {
            tableBodyId: 'employersBody',
            searchFields: [
                { inputSelector: '[name="searchEmployerId"]', cellIndex: 0 },
                { inputSelector: '[name="searchId"]', cellIndex: 1 },
                { inputSelector: '[name="searchCompanyName"]', cellIndex: 2, isCaseInsensitive: true, isPartialMatch: true },
            ],
        },
        searchFormVacancies: {
            tableBodyId: 'vacanciesBody',
            searchFields: [
                { inputSelector: '[name="searchVacancyId"]', cellIndex: 0 },
                { inputSelector: '[name="searchTitle"]', cellIndex: 2, isCaseInsensitive: true, isPartialMatch: true },
            ],
        },
        searchFormCandidateSkills: {
            tableBodyId: 'candidateSkillsBody',
            searchFields: [
                { inputSelector: '[name="searchCandidateId"]', cellIndex: 0 },
            ],
        },
        searchFormVacancySkills: {
            tableBodyId: 'vacancySkillsBody',
            searchFields: [
                { inputSelector: '[name="searchVacancyId"]', cellIndex: 0 },
            ],
        },
        searchFormApplications: {
            tableBodyId: 'applicationsBody',
            searchFields: [
                { inputSelector: '[name="searchApplicationId"]', cellIndex: 0 },
                { inputSelector: '[name="searchCandidateId"]', cellIndex: 1 },
                { inputSelector: '[name="searchVacancyId"]', cellIndex: 2 },
            ],
        },
        searchFormResumes: {
            tableBodyId: 'resumesBody',
            searchFields: [
                { inputSelector: '[name="searchResumeId"]', cellIndex: 0 },
                { iinputSelector: '[name="searchCandidateId"]', cellIndex: 1 },
            ],
        },
        searchFormResumeApplications: {
            tableBodyId: 'resumeApplicationsBody',
            searchFields: [
                { inputSelector: '[name="searchApplicationId"]', cellIndex: 0 },
                { inputSelector: '[name="searchEmployerId"]', cellIndex: 1 },
                { inputSelector: '[name="searchResumeId"]', cellIndex: 2 },
            ],
        },
    };

    const config = searchConfig[searchFormId];

    if (!config) {
        console.warn(`Форма с ID ${searchFormId} не поддерживается.`);
        return;
    }

    const tableBody = document.getElementById(config.tableBodyId);
    if (!tableBody) {
        console.error(`Таблица с ID ${config.tableBodyId} не найдена.`);
        return;
    }

    const rows = tableBody.getElementsByTagName('tr');

    for (let row of rows) {
        let isVisible = true;

        for (let field of config.searchFields) {
            const inputElement = form.querySelector(field.inputSelector);
            if (!inputElement) continue;

            const searchValue = inputElement.value.trim();
            const cellValue = row.cells[field.cellIndex]?.innerText.trim() || "";

            if (searchValue) {
                const normalizedSearchValue = field.isCaseInsensitive ? searchValue.toLowerCase() : searchValue;
                const normalizedCellValue = field.isCaseInsensitive ? cellValue.toLowerCase() : cellValue;

                const matches = field.isPartialMatch
                    ? normalizedCellValue.includes(normalizedSearchValue)
                    : normalizedCellValue === normalizedSearchValue;

                if (!matches) {
                    isVisible = false;
                    break;
                }
            }
        }

        row.style.display = isVisible ? '' : 'none';
    }
}

function applyFilters(filterFormId) {
    const filterConfig = {
        userFilterForm: {
            tableBodyId: 'usersBody',
            filters: [
                { inputId: 'nameFilter', columnIndex: 1, match: (value, filter) => value.toLowerCase().includes(filter.toLowerCase()) },
                { inputId: 'surnameFilter', columnIndex: 2, match: (value, filter) => value.toLowerCase().includes(filter.toLowerCase()) },
                { inputId: 'roleFilter', columnIndex: 6, match: (value, filter) => value === filter },
                { inputId: 'dateFilter', columnIndex: 7, match: (value, filter) => value === filter }
            ]
        },
        candidateFilterForm: {
            tableBodyId: 'candidatesBody',
            filters: [
                { inputId: 'educationFilter', columnIndex: 4, match: (value, filter) => value.toLowerCase() === filter.toLowerCase() }
            ]
        },
        employerFilterForm: {
            tableBodyId: 'employersBody',
            filters: [
                { inputId: 'companyNameFilter', columnIndex: 2, match: (value, filter) => value.toLowerCase().includes(filter.toLowerCase()) }
            ]
        },
        vacanciesFilterForm: {
            tableBodyId: 'vacanciesBody',
            filters: [
                { inputId: 'employmentFilter', columnIndex: 6, match: (value, filter) => value === filter },
                { inputId: 'dateFilter', columnIndex: 8, match: (value, filter) => value === filter }
            ]
        },
        applicationsFilterForm: {
            tableBodyId: 'applicationsBody',
            filters: [
                { inputId: 'statusFilter', columnIndex: 3, match: (value, filter) => value.includes(filter) },
                { inputId: 'dateFilter', columnIndex: 4, match: (value, filter) => value === filter }
            ]
        },
        resumeApplicationsFilterForm: {
            tableBodyId: 'resumeApplicationsBody',
            filters: [
                { inputId: 'statusFilter', columnIndex: 3, match: (value, filter) => value === filter },
                { inputId: 'dateFilter', columnIndex: 4, match: (value, filter) => value === filter }
            ]
        }
    };
    
    const config = filterConfig[filterFormId];
    if (!config) {
        console.warn(`Форма с ID ${filterFormId} не поддерживается.`);
        return;
    }

    const form = document.getElementById(filterFormId);
    if (!form) {
        console.warn(`Форма с ID ${filterFormId} не найдена.`);
        return;
    }

    const rows = document.querySelectorAll(`#${config.tableBodyId} tr`);
    rows.forEach(row => {
        const matchesAllFilters = config.filters.every(({ inputId, columnIndex, match }) => {
            // Найти поле ввода внутри текущей формы
            const filterInput = form.querySelector(`#${inputId}`);
            const filterValue = filterInput ? filterInput.value : '';
            const cellValue = row.cells[columnIndex]?.innerText || '';
            return !filterValue || match(cellValue, filterValue);
        });

        row.style.display = matchesAllFilters ? '' : 'none';
    });
}

// Функция для сортировки таблицы
function sortTable(tBody, columnIndex, isAscending) {
    const tableBody = document.getElementById(tBody);
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