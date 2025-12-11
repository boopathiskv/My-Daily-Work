$(document).ready(function () {

    let bucketList = [];

    const categories = ["Travel", "Career", "Health", "Adventure", "Personal"];

    function updateProgress() {
        let total = bucketList.length;
        let done = bucketList.filter(i => i.completed).length;
        let percent = total === 0 ? 0 : Math.round((done / total) * 100);
        $("#progress-bar").css("width", percent + "%").text(percent + "%");
    }

    // function renderCategoryTables() {
    //     const container = $("#category-tables");
    //     container.empty();

    //     categories.forEach(category => {
    //         let items = bucketList.filter(i => i.category === category);

    //         let table = $(`
    //             <h5 class="fw-bold mt-4">${category} Goals</h5>
    //             <table class="table table-striped rounded-3 shadow-sm">
    //                 <thead class="table-dark">
    //                     <tr>
    //                         <th>#</th>
    //                         <th>Goal</th>
    //                         <th>Time Type</th>
    //                         <th>Status</th>
    //                     </tr>
    //                 </thead>
    //                 <tbody id="${category.toLowerCase()}-table"></tbody>
    //             </table>
    //         `);

    //         container.append(table);

    //         let tbody = $(`#${category.toLowerCase()}-table`);
    //         if (items.length === 0) {
    //             tbody.append(`<tr><td colspan="4" class="text-center">No goals</td></tr>`);
    //         } else {
    //             items.forEach((item, index) => {
    //                 tbody.append(`
    //                     <tr>
    //                         <td>${index + 1}</td>
    //                         <td>${item.text}</td>
    //                         <td>${item.timeType}</td>
    //                         <td>${item.completed ? "Completed" : "Pending"}</td>
    //                     </tr>
    //                 `);
    //             });
    //         }
    //     });
    // }

    function renderList() {
        $("#bucket-list").empty();

        let fCat = $("#filter-category").val();
        let fTime = $("#filter-time").val();
        let fStat = $("#filter-status").val();

        bucketList.forEach(item => {
            if (fCat !== "All Categories" && item.category !== fCat) return;
            if (fTime !== "All Time Types" && item.timeType !== fTime) return;
            if (fStat === "Completed" && !item.completed) return;
            if (fStat === "Pending" && item.completed) return;

            let li = $(`
                <li class="list-group-item rounded-3 ${item.completed ? "completed" : ""}">
                    <div>
                        <input type="checkbox" class="form-check-input me-3" ${item.completed ? "checked" : ""}>
                        <strong>${item.text}</strong>
                        <span class="badge bg-primary ms-2">${item.category}</span>
                        <span class="badge bg-secondary ms-2">${item.timeType}</span>
                    </div>
                    <div>
                        <button class="btn btn-sm btn-warning me-2 edit-btn"><i class="bi bi-pencil"></i></button>
                        <button class="btn btn-sm btn-danger del-btn"><i class="bi bi-trash"></i></button>
                    </div>
                </li>
            `);

            li.find("input").change(() => {
                item.completed = !item.completed;
                renderList();
                updateProgress();
            });

            li.find(".del-btn").click(() => {
                bucketList = bucketList.filter(x => x.id !== item.id);
                renderList();
                updateProgress();
            });

            li.find(".edit-btn").click(() => {
                $("#edit-text").val(item.text);
                $("#edit-category").val(item.category);
                $("#edit-time").val(item.timeType);
                $("#editModal").modal("show");

                $("#save-edit").off().click(() => {
                    item.text = $("#edit-text").val();
                    item.category = $("#edit-category").val();
                    item.timeType = $("#edit-time").val();
                    renderList();
                    updateProgress();
                    $("#editModal").modal("hide");
                });
            });

            $("#bucket-list").append(li);
        });

        //renderCategoryTables();
    }

    $("#add-item").click(function () {
        let text = $("#new-item").val().trim();
        let category = $("#category").val();
        let timeType = $("#time-type").val();
        if (!text) return;

        bucketList.push({ id: Date.now(), text, category, timeType, completed: false });
        renderList();
        updateProgress();
        $("#new-item").val("");
    });

    $("#filter-category, #filter-time, #filter-status").change(renderList);

    $("#search").keyup(function () {
        let val = $(this).val().toLowerCase();
        $("#bucket-list li").filter(function () {
            $(this).toggle($(this).text().toLowerCase().includes(val));
        });
    });

	const generateFilename = (name) => {
		const now = new Date();
		const yyyy = now.getFullYear();
		const mm = String(now.getMonth() + 1).padStart(2, '0');
		const dd = String(now.getDate()).padStart(2, '0');

		let hours = now.getHours();
		const minutes = String(now.getMinutes()).padStart(2, '0');
		const ampm = hours >= 12 ? 'PM' : 'AM';

		// Convert to 12-hour format
		hours = hours % 12;
		hours = hours ? String(hours).padStart(2, '0') : '12';

		// Create the filename
		return `${name}_Y${yyyy}M${mm}D${dd}`;
		//return `${name}_Y${yyyy}M${mm}D${dd}TH${hours}M${minutes}S${ampm}`;
	};
	
    $("#export-json").click(function () {
        const dataStr = JSON.stringify(bucketList, null, 4);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
		let fileName =generateFilename("My_Bucket_List")+".json";
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    });

    $("#import-json").change(function (event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const importedData = JSON.parse(e.target.result);
                if (!Array.isArray(importedData)) { alert("Invalid JSON"); return; }
                const valid = importedData.every(item => item.text && item.category && item.timeType);
                if (!valid) { alert("JSON structure incorrect."); return; }
                bucketList = importedData;
                renderList();
                updateProgress();
                alert("JSON imported successfully!");
            } catch { alert("Error reading file."); }
        };
        reader.readAsText(file);
    });

    $("#download-pdf").click(function () {
        if (bucketList.length === 0) { alert("Your bucket list is empty!"); return; }
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        let startY = 20;
        doc.setFontSize(18);
        doc.text("My Bucket List", 105, startY, { align: "center" });
        startY += 10;

        categories.forEach(category => {
            const items = bucketList.filter(item => item.category === category);
            if (items.length === 0) return;

            doc.setFontSize(14);
            doc.setTextColor(41, 128, 185);
            doc.text(category, 14, startY);
            startY += 6;

            const tableColumn = ["#", "Goal", "Time Type", "Status"];
            const tableRows = [];
            items.forEach((item, index) => tableRows.push([
                index + 1, item.text, item.timeType, item.completed ? "Completed" : "Pending"
            ]));

            doc.autoTable({
                head: [tableColumn],
                body: tableRows,
                startY: startY,
                styles: { cellPadding: 3, fontSize: 11 },
                headStyles: { fillColor: [41, 128, 185], textColor: 255 },
                alternateRowStyles: { fillColor: [240, 240, 240] },
                theme: 'striped',
                margin: { top: startY }
            });

            startY = doc.lastAutoTable.finalY + 10;
        });

        doc.save("bucket_list_by_category.pdf");
    });

});
