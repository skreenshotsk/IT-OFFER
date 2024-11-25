// Функция загрузки данных для отображения в таблице
async function loadTableData(endpoint, tableBodyId) {
    try {
        const response = await fetch(endpoint);
        const data = await response.json();

        const tableBody = document.getElementById(tableBodyId);
        tableBody.innerHTML = ""; // Очистить таблицу перед заполнением

        data.forEach(item => {
            const row = document.createElement("tr");

            Object.values(item).forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });

            // Добавляем кнопку "Удалить"
            const actionsCell = document.createElement("td");
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Удалить";
            deleteButton.onclick = () => deleteRecord(endpoint, item.id);
            actionsCell.appendChild(deleteButton);

            row.appendChild(actionsCell);
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
    }
}

// Функция для удаления записи
async function deleteRecord(endpoint, id) {
    try {
        await fetch(`${endpoint}/${id}`, { method: "DELETE" });
        alert("Запись успешно удалена!");
        location.reload(); // Обновить таблицу
    } catch (error) {
        console.error("Ошибка при удалении записи:", error);
    }
}

// Функция добавления новой записи
async function addRecord(endpoint, formData) {
    try {
        await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });
        alert("Запись успешно добавлена!");
        location.reload();
    } catch (error) {
        console.error("Ошибка при добавлении записи:", error);
    }
}

// Пример фильтрации записей
function applyFilter() {
    const filterValue = document.getElementById("searchField").value.toLowerCase();
    const rows = document.querySelectorAll(".admin-table tbody tr");

    rows.forEach(row => {
        const cells = row.querySelectorAll("td");
        const match = Array.from(cells).some(cell => 
            cell.textContent.toLowerCase().includes(filterValue)
        );
        row.style.display = match ? "" : "none";
    });
}

// Пример сортировки записей
function sortRecords(columnIndex) {
    const table = document.querySelector(".admin-table");
    const rows = Array.from(table.rows).slice(1);

    rows.sort((a, b) => {
        const aText = a.cells[columnIndex].textContent;
        const bText = b.cells[columnIndex].textContent;
        return aText.localeCompare(bText);
    });

    const tableBody = table.querySelector("tbody");
    tableBody.innerHTML = ""; // Очистить тело таблицы
    rows.forEach(row => tableBody.appendChild(row));
}

// Функция для формирования отчета
async function generateReport(endpoint, filters = {}) {
    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(filters)
        });
        const reportData = await response.json();

        // Здесь реализуйте отображение отчета
        console.log("Данные отчета:", reportData);
        alert("Отчет успешно сформирован!");
    } catch (error) {
        console.error("Ошибка при формировании отчета:", error);
    }
}
