var habitData = {};
var selectedMonth = null;
var selectedYear = new Date().getFullYear();

$(document).ready(function(){
    populateYearDropdown();
    generateMonths();


    $("#yearSelect").change(function(){
        selectedYear = parseInt($(this).val());
        generateMonths();
    });

    $("#addHabitBtn").click(function(){
        let name = $("#habitInput").val().trim();
        if(!name) return;
        if(!habitData[selectedMonth]) habitData[selectedMonth]=[];
        habitData[selectedMonth].push({id: Date.now(), name:name, progress:{}});
        $("#habitInput").val("");
        renderHabitList();
        buildDateTable();
        generateMonths(); // Update month list dynamically
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

    $("#exportBtn").click(function(){
		
        const dataStr = JSON.stringify(habitData, null, 2);
        const blob = new Blob([dataStr], {type:"application/json"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
		let fileName =generateFilename("Habit_Tracker_Data")+".json";
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    });

    $("#importBtn").click(()=> $("#importInput").click());
    $("#importInput").change(function(e){
        const file = e.target.files[0];
        if(!file) return;
        const reader = new FileReader();
        reader.onload = function(evt){
            try{
                const importedData = JSON.parse(evt.target.result);
                if(typeof importedData==="object"){
                    habitData = importedData;
                    generateMonths();
                    if(selectedMonth){ buildDateTable(); renderHabitList(); }
                    alert("Data imported successfully!");
                } else alert("Invalid JSON format");
            }catch(e){ alert("Failed to parse JSON."); }
        };
        reader.readAsText(file);
    });

    $("#exportPdfBtn").click(exportMonthPDF);

    $(document).on("change",".habitCheck",function(){
        const habitId = $(this).data("id");
        const dateKey = $(this).data("date");
        const checked = $(this).is(":checked");
        habitData[selectedMonth].forEach(h=>{ if(h.id===habitId) h.progress[dateKey]=checked; });
        buildDateTable();
        generateMonths(); // Update month list dynamically
    });

    $("#exportMonthPdfBtn").click(exportMonthPDF);

});

// ---------------- Functions ----------------
function populateYearDropdown(){
    const years = [selectedYear-1, selectedYear, selectedYear+1];
    $("#yearSelect").empty();
    years.forEach(y=> $("#yearSelect").append(`<option value="${y}" ${y===selectedYear?'selected':''}>${y}</option>`));
}

function generateMonths(){
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    $("#monthList").empty();

    months.forEach((monthName, monthIndex) => {
        const key = `${selectedYear}-${monthIndex}`;
        const habits = habitData[key] || [];
        const totalHabits = habits.length;

        let totalDays=0, totalCompleted=0;
        habits.forEach(h=>{
            const daysInMonth = new Date(selectedYear, monthIndex+1,0).getDate();
            totalDays+=daysInMonth;
            for(let d=1; d<=daysInMonth; d++){
                const dateKey = `${selectedYear}-${monthIndex}-${d}`;
                if(h.progress[dateKey]) totalCompleted++;
            }
        });
        const overallPercent = totalDays>0? ((totalCompleted/totalDays)*100).toFixed(0):0;

        let colorClass = "low";
        if(overallPercent>=40 && overallPercent<70) colorClass="medium";
        else if(overallPercent>=70) colorClass="high";

        const html = `
        <div class="col-3 mb-3">
            <div class="month-card" onclick="openMonth(${monthIndex})">
                <div class="month-title">${monthName}</div>
                <div class="month-details">Habits: ${totalHabits}<br>Completed: ${overallPercent}%</div>
                <div class="progress">
                    <div class="progress-bar ${colorClass}" role="progressbar" style="width:${overallPercent}%"></div>
                </div>
            </div>
        </div>`;
        $("#monthList").append(html);
    });
}

function openMonth(monthIndex){
    selectedMonth = `${selectedYear}-${monthIndex}`;
    if(!habitData[selectedMonth]) habitData[selectedMonth] = [];
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    $("#modalTitle").text(`Habit Tracker - ${months[monthIndex]} ${selectedYear}`);
    buildDateTable();
    $("#monthModal").modal("show");
}

// ---------------- Build Date Table ----------------
function buildDateTable(){
    if(!selectedMonth) return;
    const [year, monthIndex] = selectedMonth.split("-").map(Number);
    const daysInMonth = new Date(year, monthIndex+1, 0).getDate();
    const dayNames = ["Su","Mo","Tu","We","Th","Fr","Sa"];
    $("#dateTable").empty();

    let thead="<tr><th>Habit</th>";
    for(let d=1; d<=daysInMonth; d++){
        const dayOfWeek = new Date(year, monthIndex,d).getDay();
        thead+=`<th class="${(dayOfWeek===0||dayOfWeek===6)?'weekend':''}"><div>${dayNames[dayOfWeek]}</div><div>${d}</div></th>`;
    }
    thead+="<th>Total %</th></tr>";
    $("#dateTable").append("<thead>"+thead+"</thead>");

    let tbody="";
    habitData[selectedMonth].forEach(habit=>{
        let row=`<tr><td class="habit-name">${habit.name}</td>`;
        let completed=0;
        for(let d=1; d<=daysInMonth; d++){
            const dateKey=`${year}-${monthIndex}-${d}`;
            const checked=habit.progress[dateKey]? "checked":"";
            if(checked) completed++;
            const dayOfWeek=new Date(year,monthIndex,d).getDay();
            row+=`<td class="${(dayOfWeek===0||dayOfWeek===6)?'weekend':''}"><input type="checkbox" class="habitCheck" data-id="${habit.id}" data-date="${dateKey}" ${checked}></td>`;
        }
        const percent=daysInMonth>0? ((completed/daysInMonth)*100).toFixed(0):0;
        row+=`<td class="totalPercent"><div class="progress-cell"><div style="width:${percent}%">${percent}%</div></div></td></tr>`;
        tbody+=row;
    });
    $("#dateTable").append("<tbody>"+tbody+"</tbody>");
}

// ---------------- Habit Manager ----------------
function openHabitManager(){
    renderHabitList();
    $("#habitModal").modal("show");
}
function renderHabitList(){
    $("#habitList").empty();
    if(!habitData[selectedMonth]) habitData[selectedMonth]=[];
    habitData[selectedMonth].forEach(habit=>{
        $("#habitList").append(`<li class="list-group-item d-flex justify-content-between align-items-center">
            ${habit.name}
            <button class="btn btn-danger btn-sm" onclick="deleteHabit(${habit.id})">Delete</button>
        </li>`);
    });
}
function deleteHabit(id){
    habitData[selectedMonth] = habitData[selectedMonth].filter(h=>h.id!==id);
    renderHabitList();
    buildDateTable();
    generateMonths(); // Update month list dynamically
}

// ---------------- Export PDF ----------------

function exportMonthPDF(){
    if(!selectedMonth) return alert("Please select a month first.");
    buildDateTable();

    let clone = $("#dateTable").clone();
    let container = $("<div>").css({position:"absolute", left:"-9999px", top:0, display:"block", padding:"20px", background:"#fff"})
        .append(`<h2 style="text-align:center; margin-bottom:5px;">Habit Tracker Report</h2>`)
        .append(`<h4 style="text-align:center; margin-bottom:5px;">${getMonthName(selectedMonth)} Report</h4>`)
        .append(`<p style="text-align:center; font-size:0.85rem; color:#555; margin-bottom:15px;">Generated: ${getCurrentDateTime()}</p>`)
        .append(clone);
    $("body").append(container);

    html2canvas(container[0], { scale: 2, useCORS:true, allowTaint:true }).then(canvas=>{
        const imgData = canvas.toDataURL("image/png");
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF("l","pt","a4");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const imgWidth = pageWidth - 40;
        const imgHeight = (canvas.height*imgWidth)/canvas.width;
        pdf.addImage(imgData,"PNG",20,20,imgWidth,imgHeight);
        pdf.save(`HabitTracker_${selectedMonth}.pdf`);
    }).finally(()=> container.remove());
}

// ---------------- Helpers ----------------
function getMonthName(monthStr){
    const [year, monthIndex] = monthStr.split("-").map(Number);
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    return `${months[monthIndex]} ${year}`;
}
function getCurrentDateTime(){ return new Date().toLocaleString();}

