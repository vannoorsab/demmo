const fs = require('fs'); // Node.js File System module

const studentForm = document.getElementById('studentForm');
const successMessage = document.getElementById('successMessage');
const viewDataBtn = document.getElementById('viewData');
const viewTop3Btn = document.getElementById('viewTop3');
const dataDisplay = document.getElementById('dataDisplay');
const top3Display = document.getElementById('top3Display');
const allDataSection = document.getElementById('allData');
const topStudentsSection = document.getElementById('topStudents');
const scrollToAllDataBtn = document.getElementById('scrollToAllData');
const scrollToTop3Btn = document.getElementById('scrollToTop3');

// Handle form submission
studentForm.addEventListener('submit', function (event) {
    event.preventDefault();

    // Get form data
    const name = document.getElementById('name').value;
    const batch = document.getElementById('batch').value;
    const academic = parseFloat(document.getElementById('academic').value);
    const coreCourses = parseFloat(document.getElementById('core_courses').value);
    const hackathons = parseInt(document.getElementById('hackathons').value, 10);
    const papers = parseInt(document.getElementById('papers').value, 10);
    const contributions = parseFloat(document.getElementById('contributions').value);

    // Calculate score
    const score = (academic * 0.4) + 
                  (coreCourses * 0.3) + 
                  (hackathons * 0.1) + 
                  (papers * 0.1) + 
                  (contributions * 0.1);

    // Create student object
    const student = { name, batch, academic, coreCourses, hackathons, papers, contributions, score };

    // Load existing data or initialize an empty array
    let students = [];
    if (fs.existsSync('students.json')) {
        const data = fs.readFileSync('students.json', 'utf-8');
        students = JSON.parse(data);
    }

    // Add new student data
    students.push(student);
    
    // Save updated data to students.json
    fs.writeFileSync('students.json', JSON.stringify(students, null, 2));

    // Save top 3 students to top_students.json
    const top3 = students.sort((a, b) => b.score - a.score).slice(0, 3);
    fs.writeFileSync('top_students.json', JSON.stringify(top3, null, 2));

    // Show success message and buttons
    successMessage.classList.remove('hidden');
    studentForm.reset();
});

// View all submitted data
viewDataBtn.addEventListener('click', () => {
    allDataSection.classList.remove('hidden');
    const students = JSON.parse(fs.readFileSync('students.json', 'utf-8'));
    dataDisplay.innerHTML = students.map(student =>
        `<p>${student.name} (Batch: ${student.batch}) - Score: ${student.score.toFixed(2)}</p>`
    ).join('');

    // Scroll to the bottom of the data display
    dataDisplay.scrollTop = dataDisplay.scrollHeight;
});

// View top 3 students
viewTop3Btn.addEventListener('click', () => {
    topStudentsSection.classList.remove('hidden');
    const top3 = JSON.parse(fs.readFileSync('top_students.json', 'utf-8'));
    
    top3Display.innerHTML = top3.map(student =>
        `<p>${student.name} - Score: ${student.score.toFixed(2)}</p>`
    ).join('');

    // Scroll to the bottom of the top 3 display
    top3Display.scrollTop = top3Display.scrollHeight;
});

// Scroll to the bottom of All Data section
scrollToAllDataBtn.addEventListener('click', () => {
    allDataSection.scrollIntoView({ behavior: 'smooth' });
});

// Scroll to the bottom of Top 3 Students section
scrollToTop3Btn.addEventListener('click', () => {
    topStudentsSection.scrollIntoView({ behavior: 'smooth' });
});
