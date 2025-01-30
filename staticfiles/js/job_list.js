// 定义 Status 的排序顺序
const statusOrder = {
    "Submitted": 1,
    "Reviewed": 2,
    "Rejected": 3,
    "To Apply": 4,
    "Interviewing": 5,
    "Offer Received": 6,
    "Withdraw": 7
};

// 记录当前的排序状态（升序 or 降序）
let sortDirections = {};  

document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".status-dropdown").forEach(selectElement => {
        applyStatusColor(selectElement);
        selectElement.addEventListener("change", function() {
            updateStatus(selectElement.dataset.jobId, selectElement);
        });
    });

    document.querySelectorAll(".edit-notes-btn").forEach(button => {
        button.addEventListener("click", function() {
            editNotes(button.dataset.jobId);
        });
    });
});

// 让 Status 颜色在页面加载时应用
function applyStatusColor(selectElement) {
    var selectedStatus = selectElement.value;
    var parentSpan = selectElement.parentElement;

    // 移除所有旧颜色
    parentSpan.classList.remove(
        "status-Submitted", "status-Reviewed", "status-Rejected",
        "status-To-Apply", "status-Interviewing",
        "status-Offer-Received", "status-Withdraw"
    );

    // 添加新的状态颜色
    parentSpan.classList.add("status-" + selectedStatus.replace(/\s/g, '-'));

    // ✅ 让 select 继承 span 的颜色
    selectElement.style.color = getComputedStyle(parentSpan).color;
}

// 发送 AJAX 请求更新 Status
function updateStatus(jobId, selectElement) {
    var newStatus = selectElement.value;
    var csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    fetch(`/jobs/update-status/${jobId}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({ "status": newStatus })  // ✅ 确保 JSON 格式正确
    }).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP status ${response.status}`);
        }
        return response.json();
    }).then(data => {
        if (data.status === "success") {
            applyStatusColor(selectElement);
        } else {
            alert("Failed to update status: " + data.error);
        }
    }).catch(error => {
        alert("Request failed: " + error);
    });
}


// 让 Notes 变成可编辑状态
function editNotes(jobId) {
    var notesSpan = document.getElementById(`notes-${jobId}`);
    var currentText = notesSpan.innerText.trim();

    // 变成可编辑输入框
    notesSpan.innerHTML = `
        <input type="text" id="notes-input-${jobId}" class="notes-input" value="${currentText}">
        <button onclick="saveNotes(${jobId})">Save</button>
        <button onclick="cancelEdit(${jobId}, '${currentText}')">Cancel</button>
    `;
}

// 取消编辑
function cancelEdit(jobId, originalText) {
    var notesSpan = document.getElementById(`notes-${jobId}`);
    notesSpan.innerHTML = originalText + ` <button class="edit-notes-btn" onclick="editNotes(${jobId})">Edit</button>`;
}

// 发送 AJAX 请求保存 Notes
function saveNotes(jobId) {
    var inputField = document.getElementById(`notes-input-${jobId}`);
    var newNotes = inputField.value.trim();
    var csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    fetch(`/jobs/update-notes/${jobId}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({ "notes": newNotes })  // ✅ 确保 JSON 格式正确
    }).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP status ${response.status}`);
        }
        return response.json();
    }).then(data => {
        if (data.status === "success") {
            var notesSpan = document.getElementById(`notes-${jobId}`);
            notesSpan.innerHTML = newNotes + ` <button class="edit-notes-btn" onclick="editNotes(${jobId})">Edit</button>`;
        } else {
            alert("Failed to update notes: " + data.error);
        }
    }).catch(error => {
        alert("Request failed: " + error);
    });
}


// ✅ 修正 Status 排序，保持颜色不变
function sortTable(columnIndex) {
    var table = document.getElementById("jobTable");
    var tbody = table.querySelector("tbody");
    var rows = Array.from(tbody.rows);

    // 切换排序方向
    let direction = sortDirections[columnIndex] || "asc";
    sortDirections[columnIndex] = direction === "asc" ? "desc" : "asc";

    rows.sort((rowA, rowB) => {
        let cellA = rowA.cells[columnIndex].innerText.trim();
        let cellB = rowB.cells[columnIndex].innerText.trim();

        // 如果是 Status 列，按照自定义顺序排序
        if (columnIndex === 2) {  // ✅ Status 在第 3 列
            return direction === "asc"
                ? (statusOrder[cellA] || 99) - (statusOrder[cellB] || 99)
                : (statusOrder[cellB] || 99) - (statusOrder[cellA] || 99);
        }

        // 数字排序
        let numA = parseFloat(cellA);
        let numB = parseFloat(cellB);
        if (!isNaN(numA) && !isNaN(numB)) {
            return direction === "asc" ? numA - numB : numB - numA;
        }

        // 按字符串排序（忽略大小写）
        return direction === "asc"
            ? cellA.localeCompare(cellB)
            : cellB.localeCompare(cellA);
    });

    // ✅ 重新排列行，但不改变 select 颜色
    rows.forEach(row => {
        tbody.appendChild(row);
        let selectElement = row.querySelector(".status-dropdown");
        if (selectElement) {
            applyStatusColor(selectElement);
        }
    });
}
