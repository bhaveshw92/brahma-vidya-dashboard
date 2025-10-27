// ===================================
// Brahma Vidya Dashboard - Main JavaScript
// ===================================

// Global variables
let allData = [];
let filteredData = [];
let charts = {};

// Chart color schemes
const colors = {
    primary: '#ff6b35',
    secondary: '#004e89',
    accent: '#f77f00',
    success: '#06d6a0',
    warning: '#ffd23f',
    danger: '#ef476f',
    palette: ['#ff6b35', '#004e89', '#f77f00', '#06d6a0', '#ef476f', '#ffd23f', '#8338ec', '#3a86ff']
};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard initializing...');
    loadData();
});

// Load CSV data
function loadData() {
    // Try multiple possible paths
    const possiblePaths = [
        '../cleaned_data/combined_cleaned_data.csv',
        'cleaned_data/combined_cleaned_data.csv',
        './cleaned_data/combined_cleaned_data.csv'
    ];
    
    let currentPathIndex = 0;
    
    function tryLoadPath(pathIndex) {
        if (pathIndex >= possiblePaths.length) {
            console.error('Failed to load data from all paths');
            showErrorMessage();
            return;
        }
        
        const path = possiblePaths[pathIndex];
        console.log('Trying to load data from:', path);
        
        Papa.parse(path, {
            download: true,
            header: true,
            dynamicTyping: false, // Changed to false to handle all as strings first
            complete: function(results) {
                if (results.data && results.data.length > 1) {
                    console.log('✅ Data loaded successfully:', results.data.length, 'rows from', path);
                    allData = results.data.filter(row => row.Date && row.Date !== ''); // Filter out rows without dates
                    filteredData = [...allData];
                    
                    if (allData.length === 0) {
                        console.warn('Data loaded but no valid rows with dates found');
                        showErrorMessage();
                        return;
                    }
                    
                    initializeDashboard();
                } else {
                    console.warn('Data loaded but appears empty, trying next path...');
                    tryLoadPath(pathIndex + 1);
                }
            },
            error: function(error) {
                console.error('Error loading from', path, ':', error);
                tryLoadPath(pathIndex + 1);
            }
        });
    }
    
    tryLoadPath(0);
}

function showErrorMessage() {
    const container = document.querySelector('.container');
    const errorHTML = `
        <div style="background: #fee; border: 2px solid #f88; border-radius: 12px; padding: 30px; margin: 20px; text-align: center;">
            <h2 style="color: #c33;">⚠️ Error Loading Data</h2>
            <p style="color: #666; margin: 20px 0;">Unable to load the CSV data file. This is likely due to browser security restrictions.</p>
            
            <div style="background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin: 20px auto; max-width: 600px; text-align: left;">
                <h3 style="color: #333; margin-top: 0;">✅ Solution: Use a Local Server</h3>
                <p style="color: #666;">Open PowerShell in the dashboard folder and run:</p>
                <pre style="background: #f5f5f5; padding: 15px; border-radius: 6px; overflow-x: auto;"><code>python -m http.server 8000</code></pre>
                <p style="color: #666; margin-top: 10px;">Then open: <strong>http://localhost:8000</strong></p>
                
                <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
                
                <p style="color: #666; font-size: 0.9em;">Or install "Live Server" extension in VS Code and right-click index.html → "Open with Live Server"</p>
            </div>
            
            <div style="background: #fff9e6; border: 1px solid #ffd23f; border-radius: 8px; padding: 15px; margin: 20px auto; max-width: 600px;">
                <p style="color: #666; margin: 0;"><strong>📁 File Check:</strong> Ensure <code>combined_cleaned_data.csv</code> exists in the <code>cleaned_data</code> folder</p>
            </div>
        </div>
    `;
    container.innerHTML = errorHTML;
}

// Initialize all dashboard components
function initializeDashboard() {
    populateFilters();
    updateKPIs();
    createAllCharts();
}

// Populate filter dropdowns
function populateFilters() {
    // Get unique subjects
    const subjects = [...new Set(allData.map(d => d.Subject))].filter(s => s).sort();
    const subjectFilter = document.getElementById('subjectFilter');
    subjects.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject;
        option.textContent = subject;
        subjectFilter.appendChild(option);
    });
    
    // Get unique team members
    const members = [...new Set(allData.map(d => d.Name))].filter(m => m && m !== 'Unassigned').sort();
    const memberFilter = document.getElementById('memberFilter');
    members.forEach(member => {
        const option = document.createElement('option');
        option.value = member;
        option.textContent = member;
        memberFilter.appendChild(option);
    });
}

// Apply filters
function applyFilters() {
    const yearFilter = document.getElementById('yearFilter').value;
    const subjectFilter = document.getElementById('subjectFilter').value;
    const memberFilter = document.getElementById('memberFilter').value;
    
    filteredData = allData.filter(row => {
        let match = true;
        if (yearFilter !== 'all' && row.Year != yearFilter) match = false;
        if (subjectFilter !== 'all' && row.Subject !== subjectFilter) match = false;
        if (memberFilter !== 'all' && row.Name !== memberFilter) match = false;
        return match;
    });
    
    updateKPIs();
    updateAllCharts();
}

// Reset filters
function resetFilters() {
    document.getElementById('yearFilter').value = 'all';
    document.getElementById('subjectFilter').value = 'all';
    document.getElementById('memberFilter').value = 'all';
    filteredData = [...allData];
    updateKPIs();
    updateAllCharts();
}

// Update KPI cards
function updateKPIs() {
    const data = filteredData;
    
    // Get date range
    const dates = data.map(d => new Date(d.Date)).filter(d => !isNaN(d));
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));
    document.getElementById('dateRange').textContent = 
        `📅 Data Period: ${minDate.toLocaleDateString()} - ${maxDate.toLocaleDateString()}`;
    
    // KPI 1: Total Classes
    const totalClasses = new Set(data.map(d => `${d.Year}-${d.Subject}-${d.Class_Number}`)).size;
    document.getElementById('kpi-total-classes').textContent = totalClasses;
    document.getElementById('kpi-classes-detail').textContent = 
        `Year 1: ${new Set(data.filter(d => d.Year == 1).map(d => d.Class_Number)).size} | Year 2: ${new Set(data.filter(d => d.Year == 2).map(d => d.Class_Number)).size}`;
    
    // KPI 2: Average Duration (calculate from upload dates)
    const classData = getClassSummary(data);
    const durations = classData.map(c => c.duration).filter(d => d > 0);
    const avgDuration = durations.length > 0 ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0;
    document.getElementById('kpi-avg-duration').textContent = `${avgDuration} days`;
    document.getElementById('kpi-duration-detail').textContent = 
        `Median: ${durations.length > 0 ? Math.round(median(durations)) : 0} days`;
    
    // KPI 3: Team Size (already set in HTML as 7)
    const activeMembers = new Set(data.filter(d => d.Name && d.Name !== 'Unassigned').map(d => d.Name)).size;
    document.getElementById('kpi-team-size').textContent = activeMembers;
    
    // KPI 4: Production Rate
    const totalDays = (maxDate - minDate) / (1000 * 60 * 60 * 24);
    const totalMonths = totalDays / 30;
    const productionRate = totalMonths > 0 ? (totalClasses / totalMonths).toFixed(1) : 0;
    document.getElementById('kpi-production-rate').textContent = productionRate;
    document.getElementById('kpi-rate-detail').textContent = `${totalClasses} classes in ${Math.round(totalMonths)} months`;
    
    // KPI 5: On-Time Delivery
    const onTimeClasses = data.filter(d => d.On_Time === 'True' || d.On_Time === true).length;
    const classesWithDeadline = data.filter(d => d.On_Time !== null && d.On_Time !== undefined && d.On_Time !== '').length;
    const onTimePercent = classesWithDeadline > 0 ? Math.round((onTimeClasses / classesWithDeadline) * 100) : 0;
    document.getElementById('kpi-on-time').textContent = `${onTimePercent}%`;
    document.getElementById('kpi-ontime-detail').textContent = `${onTimeClasses}/${classesWithDeadline} classes`;
    
    // Footer tasks count
    document.getElementById('footer-tasks').textContent = data.length;
}

// Helper function to get class summary
function getClassSummary(data) {
    const classMap = {};
    
    data.forEach(row => {
        const key = `${row.Year}-${row.Subject}-${row.Class_Number}`;
        if (!classMap[key]) {
            classMap[key] = {
                year: row.Year,
                subject: row.Subject,
                classNumber: row.Class_Number,
                tasks: [],
                dates: [],
                uploadDate: row.Upload_Date
            };
        }
        classMap[key].tasks.push(row);
        if (row.Date) classMap[key].dates.push(new Date(row.Date));
    });
    
    return Object.values(classMap).map(cls => {
        const sortedDates = cls.dates.sort((a, b) => a - b);
        const startDate = sortedDates[0];
        const endDate = sortedDates[sortedDates.length - 1];
        const duration = startDate && endDate ? (endDate - startDate) / (1000 * 60 * 60 * 24) : 0;
        
        return {
            ...cls,
            startDate,
            endDate,
            duration,
            taskCount: cls.tasks.length
        };
    });
}

// Helper function for median
function median(arr) {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

// Create all charts
function createAllCharts() {
    createTimelineChart();
    createTeamChart();
    createSubjectChart();
    createWorkflowChart();
    createDurationChart();
    createMonthlyChart();
    createHeatmap();
    createTasksPerClassChart();
    createYearComparisonChart();
}

// Update all charts
function updateAllCharts() {
    destroyAllCharts();
    createAllCharts();
}

// Destroy all existing charts
function destroyAllCharts() {
    Object.values(charts).forEach(chart => {
        if (chart && typeof chart.destroy === 'function') {
            chart.destroy();
        }
    });
    charts = {};
}

// Chart 1: Timeline Chart (Line/Area Chart)
function createTimelineChart() {
    const data = filteredData;
    const classData = getClassSummary(data);
    
    // Group by month
    const monthlyClasses = {};
    classData.forEach(cls => {
        if (cls.endDate) {
            const monthKey = cls.endDate.toISOString().substring(0, 7); // YYYY-MM
            monthlyClasses[monthKey] = (monthlyClasses[monthKey] || 0) + 1;
        }
    });
    
    const sortedMonths = Object.keys(monthlyClasses).sort();
    const labels = sortedMonths.map(m => {
        const [year, month] = m.split('-');
        return new Date(year, month - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    });
    const values = sortedMonths.map(m => monthlyClasses[m]);
    
    const ctx = document.getElementById('timelineChart').getContext('2d');
    charts.timeline = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Classes Completed',
                data: values,
                borderColor: colors.primary,
                backgroundColor: colors.primary + '20',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// Chart 2: Team Contribution (Doughnut Chart)
function createTeamChart() {
    const data = filteredData.filter(d => d.Name && d.Name !== 'Unassigned');
    const teamCounts = {};
    
    data.forEach(row => {
        teamCounts[row.Name] = (teamCounts[row.Name] || 0) + 1;
    });
    
    const sortedTeam = Object.entries(teamCounts).sort((a, b) => b[1] - a[1]);
    const labels = sortedTeam.map(t => t[0]);
    const values = sortedTeam.map(t => t[1]);
    
    const ctx = document.getElementById('teamChart').getContext('2d');
    charts.team = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: colors.palette,
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        generateLabels: function(chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                return data.labels.map((label, i) => {
                                    const value = data.datasets[0].data[i];
                                    const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                                    const percentage = ((value / total) * 100).toFixed(1);
                                    return {
                                        text: `${label}: ${value} (${percentage}%)`,
                                        fillStyle: data.datasets[0].backgroundColor[i],
                                        hidden: false,
                                        index: i
                                    };
                                });
                            }
                            return [];
                        }
                    }
                }
            }
        }
    });
}

// Chart 3: Subject Distribution (Pie Chart)
function createSubjectChart() {
    const data = filteredData;
    const classData = getClassSummary(data);
    const subjectCounts = {};
    
    classData.forEach(cls => {
        subjectCounts[cls.subject] = (subjectCounts[cls.subject] || 0) + 1;
    });
    
    const labels = Object.keys(subjectCounts);
    const values = Object.values(subjectCounts);
    
    const ctx = document.getElementById('subjectChart').getContext('2d');
    charts.subject = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: colors.palette,
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        generateLabels: function(chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                return data.labels.map((label, i) => {
                                    const value = data.datasets[0].data[i];
                                    return {
                                        text: `${label}: ${value} classes`,
                                        fillStyle: data.datasets[0].backgroundColor[i],
                                        hidden: false,
                                        index: i
                                    };
                                });
                            }
                            return [];
                        }
                    }
                }
            }
        }
    });
}

// Chart 4: Workflow Stage Distribution (Bar Chart)
function createWorkflowChart() {
    const data = filteredData;
    
    // Categorize tasks into workflow stages
    const stages = {
        'Audio Received': 0,
        'Transcription': 0,
        'Notes Creation': 0,
        'QnA Creation': 0,
        'Presentation': 0,
        'Magazine': 0,
        'Review/Approval': 0,
        'Other': 0
    };
    
    data.forEach(row => {
        const task = (row.Task || '').toLowerCase();
        if (task.includes('audio')) stages['Audio Received']++;
        else if (task.includes('transcription') || task.includes('scripting')) stages['Transcription']++;
        else if (task.includes('notes')) stages['Notes Creation']++;
        else if (task.includes('qna') || task.includes('q&a') || task.includes('quiz') || task.includes('mcq')) stages['QnA Creation']++;
        else if (task.includes('presentation') || task.includes('slides')) stages['Presentation']++;
        else if (task.includes('magazine')) stages['Magazine']++;
        else if (task.includes('proof') || task.includes('approval') || task.includes('review')) stages['Review/Approval']++;
        else stages['Other']++;
    });
    
    const labels = Object.keys(stages);
    const values = Object.values(stages);
    
    const ctx = document.getElementById('workflowChart').getContext('2d');
    charts.workflow = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Tasks',
                data: values,
                backgroundColor: colors.palette,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Chart 5: Duration by Subject (Horizontal Bar Chart)
function createDurationChart() {
    const data = filteredData;
    const classData = getClassSummary(data);
    
    // Calculate average duration by subject
    const subjectDurations = {};
    classData.forEach(cls => {
        if (!subjectDurations[cls.subject]) {
            subjectDurations[cls.subject] = [];
        }
        if (cls.duration > 0) {
            subjectDurations[cls.subject].push(cls.duration);
        }
    });
    
    const subjects = Object.keys(subjectDurations);
    const avgDurations = subjects.map(subject => {
        const durations = subjectDurations[subject];
        return durations.reduce((a, b) => a + b, 0) / durations.length;
    });
    
    const ctx = document.getElementById('durationChart').getContext('2d');
    charts.duration = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: subjects,
            datasets: [{
                label: 'Average Duration (days)',
                data: avgDurations,
                backgroundColor: colors.palette,
                borderWidth: 0
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Chart 6: Monthly Productivity (Bar + Line Chart)
function createMonthlyChart() {
    const data = filteredData;
    
    // Group tasks by month
    const monthlyData = {};
    data.forEach(row => {
        if (row.Date) {
            const date = new Date(row.Date);
            const monthKey = date.toISOString().substring(0, 7);
            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = { tasks: 0, classes: new Set() };
            }
            monthlyData[monthKey].tasks++;
            monthlyData[monthKey].classes.add(`${row.Year}-${row.Subject}-${row.Class_Number}`);
        }
    });
    
    const sortedMonths = Object.keys(monthlyData).sort();
    const labels = sortedMonths.map(m => {
        const [year, month] = m.split('-');
        return new Date(year, month - 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    });
    const taskValues = sortedMonths.map(m => monthlyData[m].tasks);
    const classValues = sortedMonths.map(m => monthlyData[m].classes.size);
    
    const ctx = document.getElementById('monthlyChart').getContext('2d');
    charts.monthly = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Tasks Completed',
                    data: taskValues,
                    backgroundColor: colors.primary + '80',
                    borderColor: colors.primary,
                    borderWidth: 1,
                    yAxisID: 'y'
                },
                {
                    label: 'Classes Worked On',
                    data: classValues,
                    type: 'line',
                    borderColor: colors.secondary,
                    backgroundColor: colors.secondary + '20',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Tasks'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Classes'
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                }
            }
        }
    });
}

// Chart 7: Weekly Activity Heatmap
function createHeatmap() {
    const data = filteredData;
    const container = document.getElementById('heatmapContainer');
    container.innerHTML = '';
    
    // Count tasks by day of week
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayCounts = [0, 0, 0, 0, 0, 0, 0];
    
    data.forEach(row => {
        if (row.Date) {
            const date = new Date(row.Date);
            const day = date.getDay();
            dayCounts[day]++;
        }
    });
    
    const maxCount = Math.max(...dayCounts);
    
    // Create heatmap cells
    dayNames.forEach((day, index) => {
        const cell = document.createElement('div');
        cell.className = 'heatmap-cell';
        
        const count = dayCounts[index];
        const intensity = maxCount > 0 ? count / maxCount : 0;
        
        // Color gradient from light to dark
        const r = Math.round(255 - (intensity * 100));
        const g = Math.round(107 - (intensity * 50));
        const b = Math.round(53 + (intensity * 50));
        
        cell.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        cell.innerHTML = `<div style="text-align: center;"><div style="font-size: 0.7rem;">${day}</div><div style="font-size: 1.2rem; font-weight: bold;">${count}</div></div>`;
        cell.title = `${day}: ${count} tasks`;
        
        container.appendChild(cell);
    });
}

// Chart 8: Tasks per Class by Subject (Grouped Bar Chart)
function createTasksPerClassChart() {
    const data = filteredData;
    const classData = getClassSummary(data);
    
    // Calculate tasks per class by subject
    const subjectTaskCounts = {};
    classData.forEach(cls => {
        if (!subjectTaskCounts[cls.subject]) {
            subjectTaskCounts[cls.subject] = [];
        }
        subjectTaskCounts[cls.subject].push(cls.taskCount);
    });
    
    const subjects = Object.keys(subjectTaskCounts);
    const avgTasks = subjects.map(subject => {
        const counts = subjectTaskCounts[subject];
        return counts.reduce((a, b) => a + b, 0) / counts.length;
    });
    
    const ctx = document.getElementById('tasksPerClassChart').getContext('2d');
    charts.tasksPerClass = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: subjects,
            datasets: [{
                label: 'Average Tasks per Class',
                data: avgTasks,
                backgroundColor: colors.palette,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Tasks per Class'
                    }
                }
            }
        }
    });
}

// Chart 9: Year-over-Year Comparison (Grouped Bar Chart)
function createYearComparisonChart() {
    const data = filteredData;
    
    // Group data by year and subject
    const year1Classes = {};
    const year2Classes = {};
    const year1Tasks = {};
    const year2Tasks = {};
    
    data.forEach(row => {
        const subject = row.Subject;
        const classKey = `${row.Year}-${row.Subject}-${row.Class_Number}`;
        
        if (row.Year == 1) {
            year1Classes[classKey] = true;
            year1Tasks[subject] = (year1Tasks[subject] || 0) + 1;
        } else if (row.Year == 2) {
            year2Classes[classKey] = true;
            year2Tasks[subject] = (year2Tasks[subject] || 0) + 1;
        }
    });
    
    const allSubjects = [...new Set([...Object.keys(year1Tasks), ...Object.keys(year2Tasks)])];
    
    const ctx = document.getElementById('yearComparisonChart').getContext('2d');
    charts.yearComparison = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: allSubjects,
            datasets: [
                {
                    label: 'Year 1 - Tasks',
                    data: allSubjects.map(s => year1Tasks[s] || 0),
                    backgroundColor: colors.primary,
                    borderWidth: 0
                },
                {
                    label: 'Year 2 - Tasks',
                    data: allSubjects.map(s => year2Tasks[s] || 0),
                    backgroundColor: colors.secondary,
                    borderWidth: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Tasks'
                    }
                }
            }
        }
    });
}

// Console log for debugging
console.log('Dashboard script loaded successfully');
