$(document).ready(function(){
    const currentYear = new Date().getFullYear();
    let selectedYear = currentYear;
    let monthsData = {};
    let currentMonth = 0, currentWeek = 0;
    let selectedDayIndex = null;
    const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const weekModal = new bootstrap.Modal(document.getElementById('weekModal'));
    const dayModal = new bootstrap.Modal(document.getElementById('dayModal'));

    // Populate year selector
    for(let y=currentYear-1; y<=currentYear+5; y++){
        $('#year-select').append(new Option(y,y));
    }
    $('#year-select').val(currentYear);
    $('#current-year').text(`Year: ${currentYear}`);

    function initializeYear(year){
        monthsData[year] = [];
        for(let m=0;m<12;m++){
            monthsData[year].push(getMonthDays(year,m));
        }
    }

    function getMonthDays(year, month){
        let days = [];
        const date = new Date(year, month, 1);
        let weekdays = 0, weekends = 0;
        while(date.getMonth()===month){
            const dayName = date.toLocaleDateString("en-US",{weekday:'long'});
            const dayObj = { date: date.toLocaleDateString("en-GB"), day: dayName, task:"" };
            days.push(dayObj);
            if(dayName==="Saturday"||dayName==="Sunday") weekends++; else weekdays++;
            date.setDate(date.getDate()+1);
        }
        return {year, month, days, weekdays, weekends};
    }

    function renderMonths(){
        $("#calendar").empty();
        const yearData = monthsData[selectedYear];
        for(let m=0;m<12;m++){
            const month = yearData[m];
            const total = month.days.length;
            const done = month.days.filter(d=>d.task!=="").length;
            const progress = Math.round(done/total*100);
            $("#calendar").append(`
                <div class="month-box" data-month="${m}">
                    <h5>${monthNames[m]}</h5>
                    <p>${month.days.length} days</p>
                    <p>
                        <span class="badge badge-weekday">${month.weekdays} weekdays</span>
                        <span class="badge badge-weekend">${month.weekends} weekend days</span>
                    </p>
                    <div class="progress">
                        <div class="progress-bar" role="progressbar" style="width: ${progress}%" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <small>${done} / ${total} days have tasks</small>
                </div>
            `);
        }
    }

    if(!monthsData[selectedYear]) initializeYear(selectedYear);
    renderMonths();

    $('#year-select').change(function(){
        selectedYear = parseInt($(this).val());
        $('#current-year').text(`Year: ${selectedYear}`);
        if(!monthsData[selectedYear]) initializeYear(selectedYear);
        renderMonths();
    });

    $("#calendar").on("click",".month-box",function(){
        currentMonth = parseInt($(this).data("month"));
        currentWeek = 0;
        openWeekModal();
    });

    function openWeekModal(){
        $('#modal-month-title').text(`${monthNames[currentMonth]} ${selectedYear}`);
        $('#current-date-time').text(new Date().toLocaleString());
        loadWeek();
        weekModal.show();
    }

    function loadWeek(){
        const month = monthsData[selectedYear][currentMonth];
        const start = currentWeek*7;
        const end = Math.min(start+7,month.days.length);
        const weekDays = month.days.slice(start,end);

        $('#week-days').empty();
        weekDays.forEach((day,i)=>{
            const statusClass = day.task!=="" ? 'card-task-completed':'card-task-pending';
            const col = $(`<div class="col-md-4">
                    <div class="card card-day p-3 text-center ${statusClass}">
                        <h6>${day.day}</h6>
                        <p>${day.date}</p>
                        <p>${day.task || "No Task"}</p>
                    </div>
                </div>`);
            col.click(()=>{ openDayModal(start+i); });
            $('#week-days').append(col);
        });

        $('#prev-week').prop('disabled',currentWeek===0);
        $('#next-week').prop('disabled',(currentWeek+1)*7>=month.days.length);
    }

    $('#prev-week').click(function(){ if(currentWeek>0){ currentWeek--; loadWeek(); } });
    $('#next-week').click(function(){ const month = monthsData[selectedYear][currentMonth]; if((currentWeek+1)*7<month.days.length){ currentWeek++; loadWeek(); } });

    function openDayModal(index){
        selectedDayIndex = index;
        const day = monthsData[selectedYear][currentMonth].days[index];
        $('#day-modal-title').text(`${day.day} (${day.date})`);
        $('#day-task-input').val(day.task);
        dayModal.show();
    }

    $('#save-day-task').click(function(){
        const task = $('#day-task-input').val();
        monthsData[selectedYear][currentMonth].days[selectedDayIndex].task = task;
        dayModal.hide();
        renderMonths();
        loadWeek();
    });
	

    $('#download-pdf').click(function(){
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const month = monthsData[selectedYear][currentMonth];

        doc.text(`${monthNames[currentMonth]} ${selectedYear}`,10,10);
        doc.text(`Generated: ${new Date().toLocaleString()}`,10,20);
		
        const tableData = month.days.map(d=>[d.date,d.day,d.task]);
        doc.autoTable({ head:[["Date","Day","Task"]], body:tableData, startY:30 });
        doc.save(`${selectedYear}_${monthNames[currentMonth]}_Tasks.pdf`);
    });


	function generateFilename(name){
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
	
    $('#download-json').click(function(){
    const blob = new Blob([JSON.stringify(monthsData, null, 2)], { type: "application/json" });

    let fileName =generateFilename("Habit_Tracker_Data")+".json";

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
});


    $('#import-json').change(function(e){
        const file = e.target.files[0];
        if(!file) return;
        const reader = new FileReader();
        reader.onload = function(evt){
            try{
                const data = JSON.parse(evt.target.result);
                if(typeof data==="object"){
                    monthsData = data;
                    if(!monthsData[selectedYear]) initializeYear(selectedYear);
                    renderMonths();
                    alert("Tasks imported successfully!");
                } else { alert("Invalid JSON structure!"); }
            } catch(err){ alert("Invalid JSON file!"); }
        };
        reader.readAsText(file);
        $(this).val("");
    });
});
