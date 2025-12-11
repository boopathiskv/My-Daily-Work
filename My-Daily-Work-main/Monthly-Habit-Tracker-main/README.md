Monthly Habit Tracker – Project Summary
1️⃣ Project Overview

The Monthly Habit Tracker is a front-end web application that allows users to track daily habits on a monthly basis. It is fully client-side, using HTML, CSS, Bootstrap 5, jQuery, and JavaScript, without a backend. All data is stored in a single JavaScript variable and can be imported/exported as JSON. Users can also generate PDF reports per month.

2️⃣ Key Features

Year Selection

Dropdown to select the current year, previous year, or next year.

Automatically updates monthly data based on the selected year.

Dynamic Month List

Each month is displayed as a modern card with:

Month name

Total habits

Overall completion percentage

Gradient progress bar showing habit completion.

Clicking a month opens the Month Modal.

Month Modal

Fullscreen modal showing the selected month.

Header includes month/year title and PDF download button.

Add Habit Card to add new habits.

Manage Habits Button to open a separate modal for deleting habits.

Habit Table:

Rows: Each habit

Columns: Days of the month with two-letter day names (Mo, Tu, We…)

Last column: Total completion % per habit.

Checkboxes for marking each habit as done.

Sticky headers and left column for habit names.

Scrollable table with custom scrollbars.

Habit Management

Add new habits via input in modal.

Delete habits through Habit Manager modal.

Progress per habit is tracked per day in the same variable.

JSON Import/Export

Users can export the full habit data for the selected year as a JSON file.

Users can import a JSON file to restore data.

PDF Export

Users can download month-specific reports.

PDF contains:

Month name and year

Habit table

Generated date/time

Export uses html2canvas + jsPDF.

Professional layout with clean spacing.

Progress Tracking

Each month card shows overall completion %.

Each habit row shows % completed for that month.

Table visually indicates completed days with checked checkboxes.

Progress bars change color based on completion:

Low (red), Medium (orange), High (green).

Professional Design

Modern UI with Bootstrap 5

Cards with shadows and hover effects

Sticky table headers for easy scrolling

Scrollable tables for months with many days

Responsive design for mobile and tablet devices

Custom scrollbars for aesthetic consistency

3️⃣ Technology Stack

HTML5: Structure of the app

CSS3 + Custom Styles: Professional look, responsive design, table and card styling

Bootstrap 5: Layout, modals, buttons, cards, responsive grid

jQuery: DOM manipulation, event handling

JavaScript:

Single variable habitData to store all data

Dynamic month rendering

Table building

Habit add/delete

Progress calculation

JSON import/export

PDF generation

html2canvas + jsPDF: PDF export functionality

4️⃣ Data Structure
var habitData = {
  "2025-0": [  // month key: year-monthIndex (0=January)
    {
      id: 123456,
      name: "Exercise",
      progress: {
        "2025-0-1": true,
        "2025-0-2": false,
        ...
      }
    },
    ...
  ],
  ...
};


Key: "year-monthIndex"

Array of habits per month

Each habit has:

id: unique identifier

name: habit name

progress: object with day completion (true/false)

5️⃣ Workflow

Load Page

Current year selected by default

Month cards generated dynamically

Habit progress calculated for each month

User Interactions

Click a month → open month modal

Add habit → updates table and month progress

Check/uncheck day → updates habit completion %

Delete habit → updates table and month progress

Import JSON → loads habit data

Export JSON → downloads current year habit data

Export PDF → downloads the current month report

Dynamic Updates

Month list updates automatically when habits or progress change

Completion percentages and progress bars reflect current data

6️⃣ Professional Design Highlights

Month Cards: Gradient progress bars, shadow, hover lift effect

Modal Layout:

Sticky header with PDF button

Card for adding habits

Scrollable table for all days

Table:

Sticky left column for habit names

Sticky header with day names

Weekends highlighted with subtle background

Total % column with a progress bar

Responsive: Works on mobile, tablet, desktop

PDF: Includes month, year, generated date/time, and habit table

7️⃣ Optional Enhancements

Heatmap for daily completion: Color code each cell based on completion

Year Overview Dashboard: Show all months’ progress at a glance

Notifications/Reminders (requires backend or local storage)

8️⃣ Project Structure
/project
│
├─ index.html       # Main HTML structure
├─ style.css        # Full professional CSS
├─ script.js        # JS logic for dynamic rendering, PDF, import/export
└─ README.md        # Project summary & instructions
