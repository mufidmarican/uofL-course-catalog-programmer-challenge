# UofL Course Catalog - Programmer Challenge


This is a responsive we app which is used to show the UofL course catalog with search functionalities with mobile responsive design

Project Overview
The application takes course catalog data from a CSV file, converts it to JSON format, and presents it in an interactive, searchable web interface.

Features

Core Features
- **Course Display**: Shows course cards with Subject, Catalog Number, and Description
- **Search Functionality**: Real-time search through course titles and descriptions
- **Responsive Design**: Mobile-first approach with breakpoints for tablet and desktop
- **Modern UI**: Clean, professional design with smooth animations and transitions
- **Error Handling**: Comprehensive error handling and user feedback
- **Loading States**: Visual feedback during data loading

Technical Features
- **CSV to JSON Conversion**: Python script to convert course data
- **Modular JavaScript**: Object-oriented JavaScript with proper separation of concerns
- **CSS Grid & Flexbox**: Modern CSS layout techniques
- **Progressive Enhancement**: Works without JavaScript (basic functionality)
- **Accessibility**: Semantic HTML and keyboard navigation support

Quick Start

 Prerequisites
- A modern web browser (Chrome)
- Python 3.2 (for CSV conversion)
- A local web server (for JSON file loading)

Installation & Setup

1. **Clone or Download the Repository**
   ```bash
   git clone <repository-url>
   cd uofl-course-catalog
   ```

2. **Convert CSV Data to JSON**
   ```bash
   python convert-csv-to-json.py "catalog dev.csv" "web-app/catalog.json"
   ```

3. **Start a Local Web Server**
   
   **Option A: Using Python (Recommended)**
   ```bash
   cd web-app
   python -m http.server 8000
   ```
   
   **Option B: Using Node.js**
   ```bash
   cd web-app
   npx serve .
   ```
   
   **Option C: Using PHP**
   ```bash
   cd web-app
   php -S localhost:8000
   ```

4. **Open in Browser**
   Navigate to `http://localhost:8000` in your web browser

 📁 Project Structure

```
Programmer Challenge/
├── README.md                    # This file
├── programmer-challenge.md      # Original challenge requirements
├── catalog dev.csv             # Original course data
├── convert-csv-to-json.py      # CSV to JSON conversion script
└── web-app/                    # Web application files
    ├── index.html              # Main HTML file
    ├── styles.css              # CSS styles and responsive design
    ├── script.js               # JavaScript functionality
    └── catalog.json            # Converted course data (generated)
```

Technical Implementation

Data Processing
- **Input**: CSV file with course catalog data
- **Processing**: Python script extracts and cleans required fields
- **Output**: JSON file with structured course data
- **Fields**: CRSE_ID, SUBJECT, CATALOG_NBR, DESCR

Frontend Architecture
- **HTML5**: Semantic markup with proper structure
- **CSS3**: Modern styling with CSS Grid, Flexbox, and animations
- **JavaScript**: ES6+ with classes, async/await, and modern APIs
- **Responsive**: Mobile-first design with breakpoints at 768px, 1024px, 1200px

Key Components
1. **CourseCatalog Class**: Main application controller
2. **Search Engine**: Real-time filtering with debouncing
3. **Card Renderer**: Dynamic course card generation
4. **Error Handler**: Comprehensive error management
5. **Logger**: Debug and error logging system

 Design Features

 Visual Design
- **Color Scheme**: Professional gradient background with clean white cards
- **Typography**: Inter font family for modern, readable text
- **Animations**: Smooth hover effects and staggered card animations
- **Icons**: SVG icons for search and visual elements

Responsive Breakpoints
- **Mobile**: 320px - 767px (Single column layout)
- **Tablet**: 768px - 1023px (Two column grid)
- **Desktop**: 1024px - 1199px (Three column grid)
- **Large Desktop**: 1200px+ (Four column grid)

User Experience
- **Search**: Instant search with visual feedback
- **Loading**: Elegant loading spinner and states
- **Error Handling**: User-friendly error messages with retry options
- **Accessibility**: Keyboard navigation and screen reader support

 Configuration

### Search Configuration
The search functionality can be customized in `script.js`:

```javascript
const searchFields = ['SUBJECT', 'CATALOG_NBR', 'DESCR'];
const searchDebounceDelay = 300;
```

Display Configuration
Modify the number of courses displayed:

```javascript

const coursesToShow = this.filteredCourses.slice(0, 10);
```

 Testing

### Manual Testing
1. **Load Test**: Verify all courses load correctly
2. **Search Test**: Test search with various terms
3. **Responsive Test**: Test on different screen sizes
4. **Error Test**: Test error handling (disable network, invalid JSON)
5. **Performance Test**: Test with large datasets


