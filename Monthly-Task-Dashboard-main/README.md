# Monthly-Task-Dashboard
A modern, interactive, web-based Monthly Task Dashboard that helps users plan, organize, and track tasks throughout the year. The project features a clean design, weekly and monthly views, and import/export capabilities for tasks in JSON and PDF formats.


# Monthly Task Dashboard

**GitHub Repository: https://github.com/boopathiskv/Monthly-Task-Dashboard**

Open Source License: Free to use, modify, and distribute.

## Demo
You can check out the live version of this application by visiting the link below:

[Live Demo](https://boopathiskv.github.io/Monthly-Task-Dashboard/)

# Project Overview

The Monthly Task Dashboard is a web-based application for managing and tracking tasks throughout the year. Users can:

  **Select any year and view months with task progress
  
  View weeks and individual days for task management
  
  Add, edit, or remove tasks for specific days
  
  Export tasks as JSON or PDF for backup and offline access
  
  Import tasks from JSON to restore previous data
  
  Visual distinction for weekends vs. weekdays
  
  Responsive and professional design**

The project is open-source and suitable for personal or team task tracking.
# Repository Structure
 monthly-task-dashboard/
 │
 ├── index.html           # Main application interface
 ├── README.md            # Project overview and documentation
 ├── css/
 │   └── style.css        # Custom CSS for design
 ├── js/
 │   └── script.js        # JavaScript functionality (task management, import/export)
 ├── assets/
 │   ├── images/          # Screenshots, icons, placeholders
 │   └── demo/            # Optional demo GIFs or videos
 └── LICENSE              # MIT License file
 
# Design & Layout Details
# 1. Dashboard (Monthly View)

  Displays all 12 months for the selected year.
  
  Each month shows:
  
  Total days
  
  Weekdays & weekend count
  
  Task completion progress bar
  
  Completed vs pending task count
  
  Color scheme: modern gradient for headers, soft shadows, hover effects.

# 2. Weekly Modal

  Opens when a month is clicked.
  
  Displays 7 days per week with:
  
  Day name & date
  
  Task details (if added)
  
  Color-coded weekends
  
  Previous/Next week navigation buttons.

# 3. Day Modal

  Opens when a day card is clicked.
  
  Allows users to:
  
  Add or edit a task for that day
  
  Save changes instantly

  UI design:

  Modern modal layout
  
  Task input box with responsive height
  
  Save & close buttons

# 4. Export / Import Features

  JSON Export: Saves all year data into a structured JSON file.
  
  JSON Import: Loads JSON to restore tasks for the selected year.
  
  PDF Export: Downloads monthly tasks as a formatted PDF using jsPDF.

# 5. Color Coding

  Weekdays: Green-ish highlight
  
  Weekends: Red-ish highlight
  
  Task card background changes:
  
  Pending tasks: light orange
  
  Completed tasks: light green

# Key Technologies

  HTML5 / CSS3: Semantic structure and professional design
  
  Bootstrap 5: Responsive layout and modals
  
  JavaScript / jQuery: Dynamic rendering of months, weeks, and days
  
  jsPDF + autoTable: PDF export functionality
  
  JSON: Persistent data storage for tasks
  
 # Usage Instructions

1. Clone the repository: git clone https://github.com/boopathiskv/Monthly-Task-Dashboard.git
2. Open index.html in your browser.
3. Workflow:
4. Select the year from the dropdown.
5. Click a month to view weeks.
6. Click a day to add/edit tasks.
7. Export JSON or PDF for backup.

# Screenshots / Demo

**Monthly View**
assets/Screenshot 1.png

**Weekly View**
assets/Screenshot 2.png

**Day Modal**
assets/Screenshot 3.png

**Task Modal**
assets/Screenshot 4.png

**PDF View Modal**
assets/Screenshot 5.png

# Future Enhancements

1. Multi-user support with authentication
2. Task reminders and notifications
3. Drag & drop tasks between days/weeks
4. Calendar sync (Google Calendar)
5. Advanced charts for task completion

Open Source

