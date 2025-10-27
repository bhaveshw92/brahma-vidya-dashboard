# 🕉️ Brahma Vidya Adhyan Course Dashboard

## Interactive HTML Dashboard with Chart.js

A comprehensive, interactive dashboard for analyzing the Brahma Vidya Adhyan Course production workflow with 5 KPIs and 9 visualizations.

---

## 📁 Files Included

### Dashboard Files (in `dashboard` folder):

1. **index.html** - Main dashboard HTML file
2. **styles.css** - Complete styling and responsive design
3. **dashboard.js** - All Chart.js visualizations and logic
4. **README.md** - This file with instructions

### Data File (required):

- **../cleaned_data/combined_cleaned_data.csv** - Cleaned data file (already created)

---

## 🚀 How to Use

### Option 1: Open Directly in Browser

1. Navigate to the `dashboard` folder
2. Double-click `index.html`
3. The dashboard will open in your default browser

### Option 2: Use Local Server (Recommended)

If you encounter CORS issues when loading CSV:

**Using Python (IMPORTANT - Run from parent directory):**

```bash
cd Class_Dashboard
python -m http.server 9000
```

Then open: http://localhost:9000/dashboard/

**Or use the provided batch file:**

```bash
START_SERVER.bat
```

**Using Node.js:**

```bash
cd Class_Dashboard
npx http-server -p 9000
```

Then open: http://localhost:9000/dashboard/

**⚠️ IMPORTANT:** The server must run from the `Class_Dashboard` directory (parent folder), NOT from the `dashboard` subfolder. This allows access to both the dashboard files and the cleaned_data folder.

Then open: http://localhost:8000

**Using VS Code:**

- Install "Live Server" extension
- Right-click on `index.html` → "Open with Live Server"

---

## 📊 Dashboard Features

### 5 Key Performance Indicators (KPIs):

1. **📚 Total Classes Produced**

   - Shows total classes across both years
   - Breakdown by Year 1 and Year 2

2. **⏱️ Average Completion Time**

   - Average days to complete a class
   - Includes median duration

3. **👥 Active Team Members**

   - Number of active contributors
   - Normalized team count

4. **📊 Production Rate**

   - Classes produced per month
   - Overall production velocity

5. **✅ On-Time Delivery**
   - Percentage of classes completed within deadline
   - Based on ±2 days tolerance

---

### 9 Interactive Visualizations:

#### 1. 📅 **Production Timeline**

- Line chart showing classes completed over time
- Identifies peak production periods
- Shows monthly trends

#### 2. 👥 **Team Contribution Distribution**

- Doughnut chart of task distribution
- Shows percentage contribution per team member
- Color-coded for each contributor

#### 3. 📖 **Subject Distribution**

- Pie chart of classes by subject
- Compares Gita, Upanishad, Parichay, Bhagwat, Mahabharat, Ramayan
- Shows subject focus areas

#### 4. 🔄 **Workflow Stage Distribution**

- Bar chart of tasks by workflow stage
- Tracks: Audio, Transcription, Notes, QnA, Presentation, Magazine
- Identifies workflow bottlenecks

#### 5. ⏰ **Average Duration by Subject**

- Horizontal bar chart
- Compares complexity across subjects
- Shows which subjects take longest

#### 6. 📈 **Monthly Productivity Trend**

- Combined bar and line chart
- Tasks completed vs classes worked on
- Shows productivity patterns over time

#### 7. 🔥 **Weekly Activity Heatmap**

- Activity intensity by day of week
- Color-coded from low to high activity
- Shows preferred work days

#### 8. 📊 **Tasks per Class by Subject**

- Bar chart showing average tasks needed
- Compares workload across subjects
- Helps with resource planning

#### 9. 📊 **Year-over-Year Comparison**

- Grouped bar chart
- Compares Year 1 vs Year 2 performance
- Shows growth and changes

---

## 🎯 Interactive Filters

### Filter Options:

- **Year Filter:** All Years | Year 1 | Year 2
- **Subject Filter:** All Subjects | Gita | Upanishad | Parichay | Bhagwat | Mahabharat | Ramayan
- **Team Member Filter:** All Members | Individual team members

### How to Use Filters:

1. Select desired filters from the dropdowns
2. All KPIs and charts update automatically
3. Click "Reset Filters" to return to full view

---

## 🎨 Design Features

### Visual Design:

- **Modern gradient header** with orange-blue theme
- **Responsive layout** - works on desktop, tablet, mobile
- **Color-coded KPI cards** for quick identification
- **Interactive hover effects** on all charts
- **Professional typography** with clear hierarchy

### Color Scheme:

- Primary: #ff6b35 (Orange)
- Secondary: #004e89 (Blue)
- Accent: #f77f00 (Amber)
- Success: #06d6a0 (Green)
- Danger: #ef476f (Pink)

---

## 📱 Responsive Design

The dashboard automatically adapts to different screen sizes:

- **Desktop (>1200px):** Full multi-column layout
- **Tablet (768px-1200px):** Stacked layout with 2 columns
- **Mobile (<768px):** Single column, optimized for small screens

---

## 🔧 Technical Details

### Libraries Used:

- **Chart.js v4.4.0** - For all visualizations
- **PapaParse v5.4.1** - For CSV parsing
- **Vanilla JavaScript** - No framework dependencies
- **CSS Grid & Flexbox** - For responsive layout

### Browser Compatibility:

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ⚠️ IE11 not supported

### Performance:

- Handles 625+ data rows smoothly
- All charts render in <2 seconds
- Filters update instantly
- No external API calls

---

## 📂 File Structure

```
dashboard/
├── index.html          # Main dashboard page
├── styles.css          # All styling
├── dashboard.js        # JavaScript logic
└── README.md          # This file

cleaned_data/
└── combined_cleaned_data.csv  # Data source (required)
```

---

## 🐛 Troubleshooting

### Issue: Dashboard shows "Error loading data"

**Solution:**

- Ensure `combined_cleaned_data.csv` is in the `cleaned_data` folder
- Check that the file path in `dashboard.js` is correct
- Use a local server instead of opening file directly

### Issue: Charts not displaying

**Solution:**

- Check browser console for errors (F12)
- Ensure internet connection for CDN libraries
- Clear browser cache and reload

### Issue: Filters not working

**Solution:**

- Ensure data has loaded (wait for page to fully load)
- Check browser console for JavaScript errors
- Try resetting filters

### Issue: Mobile layout issues

**Solution:**

- Rotate device to landscape for better view
- Use desktop/tablet for full experience
- Ensure viewport meta tag is present in HTML

---

## 🎯 Key Insights from Dashboard

### What You'll Learn:

1. **Production Velocity** - How quickly classes are produced
2. **Team Performance** - Individual and collective contributions
3. **Subject Complexity** - Which subjects require more time/effort
4. **Workflow Efficiency** - Where bottlenecks occur
5. **Timeline Patterns** - When team is most productive
6. **Resource Allocation** - How work is distributed
7. **Deadline Adherence** - On-time delivery performance
8. **Year Comparison** - Growth and improvement trends

---

## 🔄 Updating Data

To update the dashboard with new data:

1. Add new rows to your CSV files
2. Run `clean_data.py` to regenerate `combined_cleaned_data.csv`
3. Refresh the dashboard in your browser
4. All charts will automatically update with new data

---

## 🖨️ Printing

The dashboard is print-friendly:

1. Click browser Print (Ctrl+P / Cmd+P)
2. Filters and footer will be hidden
3. Charts will optimize for paper
4. Save as PDF for sharing

---

## 📧 Support

For questions or issues:

1. Check this README first
2. Review browser console for errors
3. Ensure all files are in correct folders
4. Verify data file format matches expected structure

---

## 🌟 Features Summary

✅ 5 Interactive KPI cards  
✅ 9 Dynamic visualizations  
✅ 3 Filter options (Year, Subject, Member)  
✅ Fully responsive design  
✅ Professional color scheme  
✅ Real-time data updates  
✅ Print-friendly layout  
✅ No server required (can run locally)  
✅ Fast performance (625+ rows)  
✅ Modern browser support

---

## 📊 Data Source

**File:** `combined_cleaned_data.csv`  
**Rows:** 625+ tasks  
**Period:** June 2021 - May 2023  
**Classes:** 46 total (28 Year 1, 18 Year 2)  
**Team Members:** 7 active contributors

---

## 🎉 Ready to Use!

Your dashboard is complete and ready to provide insights into the Brahma Vidya Adhyan Course production workflow!

**Quick Start:**

1. Open `index.html` in a web browser
2. Explore the KPIs and visualizations
3. Use filters to dive deeper into specific areas
4. Share insights with your team!

---

_Dashboard Created: October 2025_  
_Technology: HTML5, CSS3, JavaScript, Chart.js_  
_Data Period: June 2021 - May 2023_
