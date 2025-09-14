
class CourseCatalog {
    constructor() {
        this.courses = [];
        this.filteredCourses = [];
        this.searchTerm = '';
        this.isLoading = true;
        
        
        this.courseGrid = document.getElementById('courseGrid');
        this.searchButton = document.getElementById('searchButton');
        this.resetButton = document.getElementById('resetButton');
        this.resultsCount = document.getElementById('resultsCount');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.errorMessage = document.getElementById('errorMessage');
        
        
        this.subjectInput = document.getElementById('subjectInput');
        this.catalogInput = document.getElementById('catalogInput');
        this.componentSelect = document.getElementById('componentSelect');
        this.descriptionInput = document.getElementById('descriptionInput');
        
        this.init();
    }

   
    async init() {
        try {
            await this.loadCourses();
            this.setupEventListeners();
            this.renderCourses();
            this.hideLoading();
        } catch (error) {
            console.error('Failed to initialize application:', error);
            this.showError();
        }
    }

    
    async loadCourses() {
        try {
            const response = await fetch('./catalog.json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data.data || !Array.isArray(data.data)) {
                throw new Error('Invalid data format');
            }
            
            this.courses = data.data;
            this.filteredCourses = [...this.courses];
            
            console.log(`Successfully loaded ${this.courses.length} courses`);
            
        } catch (error) {
            console.error('Error loading courses:', error);
            throw error;
        }
    }

  
    setupEventListeners() {
        // Search button click event
        this.searchButton.addEventListener('click', () => {
            this.performSearch();
        });

        // Reset button click event
        this.resetButton.addEventListener('click', () => {
            this.resetForm();
        });

        // Form input events
        this.subjectInput.addEventListener('input', () => {
            this.performSearch();
        });

        this.catalogInput.addEventListener('input', () => {
            this.performSearch();
        });

        this.componentSelect.addEventListener('change', () => {
            this.performSearch();
        });

        this.descriptionInput.addEventListener('input', () => {
            this.performSearch();
        });

      
        [this.subjectInput, this.catalogInput, this.descriptionInput].forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            });
        });
    }

    
    performSearch() {
        const subjectTerm = this.subjectInput.value.trim().toLowerCase();
        const catalogTerm = this.catalogInput.value.trim().toLowerCase();
        const componentTerm = this.componentSelect.value;
        const descriptionTerm = this.descriptionInput.value.trim().toLowerCase();
        
        this.filteredCourses = this.courses.filter(course => {
            const subject = course.SUBJECT?.toLowerCase() || '';
            const catalogNumber = course.CATALOG_NBR?.toLowerCase() || '';
            const component = course.SSR_COMPONENT || '';
            const description = course.DESCR?.toLowerCase() || '';
            
            // Subject filter
            if (subjectTerm && !subject.includes(subjectTerm)) {
                return false;
            }
            
            // Catalog number filter
            if (catalogTerm && !catalogNumber.includes(catalogTerm)) {
                return false;
            }
            
            // Component filter
            if (componentTerm && component !== componentTerm) {
                return false;
            }
            
            // Description filter
            if (descriptionTerm && !description.includes(descriptionTerm)) {
                return false;
            }
            
            return true;
        });

        this.renderCourses();
        this.updateResultsCount();
    }

    
    resetForm() {
        this.subjectInput.value = '';
        this.catalogInput.value = '';
        this.componentSelect.value = '';
        this.descriptionInput.value = '';
        
        this.filteredCourses = [...this.courses];
        this.renderCourses();
        this.updateResultsCount();
    }

    
    renderCourses() {
        if (!this.courseGrid) {
            console.error('Course grid element not found');
            return;
        }

        this.courseGrid.innerHTML = '';

        if (this.filteredCourses.length === 0) {
            this.renderNoResults();
            return;
        }

        const coursesToShow = this.filteredCourses.slice(0, 10);
        
        coursesToShow.forEach((course, index) => {
            const courseCard = this.createCourseCard(course, index);
            this.courseGrid.appendChild(courseCard);
        });
    }

   
    createCourseCard(course, index) {
        const card = document.createElement('div');
        card.className = 'course-card';
        card.style.animationDelay = `${index * 0.1}s`;

        const courseCode = `${course.SUBJECT} ${course.CATALOG_NBR}`;
        const description = course.DESCR || 'No description available';

        card.innerHTML = `
            <div class="course-header">
                <div class="course-code">${courseCode}</div>
            </div>
            <div class="course-description">${description}</div>
        `;

        return card;
    }

    
    renderNoResults() {
        this.courseGrid.innerHTML = `
            <div class="no-results">
                <h3> No courses found</h3>
                <p>No courses match your search criteria. Try adjusting your search terms.</p>
            </div>
        `;
    }

    
    updateResultsCount() {
        if (!this.resultsCount) return;

        const total = this.courses.length;
        const filtered = this.filteredCourses.length;
        const displayed = Math.min(10, filtered);
        
        
        const hasActiveFilters = this.subjectInput.value.trim() || 
                                this.catalogInput.value.trim() || 
                                this.componentSelect.value || 
                                this.descriptionInput.value.trim();
        
        if (hasActiveFilters) {
            this.resultsCount.textContent = `Showing ${displayed} of ${filtered} courses (${total} total)`;
        } else {
            this.resultsCount.textContent = `Showing ${displayed} of ${total} courses`;
        }
    }

    searchCourses(subject, catalogNumber) {
        this.subjectInput.value = subject || '';
        this.catalogInput.value = catalogNumber || '';
        this.performSearch();
    }

   
    hideLoading() {
        this.isLoading = false;
        if (this.loadingSpinner) {
            this.loadingSpinner.style.display = 'none';
        }
    }

    
    showError() {
        this.isLoading = false;
        if (this.loadingSpinner) {
            this.loadingSpinner.style.display = 'none';
        }
        if (this.errorMessage) {
            this.errorMessage.style.display = 'block';
        }
    }

    
    getStats() {
        return {
            total: this.courses.length,
            filtered: this.filteredCourses.length,
            searchTerm: this.searchTerm
        };
    }
}


const Utils = {
   
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    
    formatCourseCode: (subject, catalogNumber) => {
        return `${subject} ${catalogNumber}`.trim();
    },

   
    highlightSearchTerm: (text, searchTerm) => {
        if (!searchTerm) return text;
        
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
};


class Logger {
    static log(message, data = null) {
        console.log(`[CourseCatalog] ${message}`, data || '');
    }

    static error(message, error = null) {
        console.error(`[CourseCatalog ERROR] ${message}`, error || '');
    }

    static warn(message, data = null) {
        console.warn(`[CourseCatalog WARNING] ${message}`, data || '');
    }
}


document.addEventListener('DOMContentLoaded', () => {
    try {
        Logger.log('Initializing UofL Course Catalog...');
        window.courseCatalog = new CourseCatalog();
        Logger.log('Application initialized successfully');
    } catch (error) {
        Logger.error('Failed to initialize application', error);
    }
});

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && window.courseCatalog) {
        Logger.log('Page became visible, refreshing data...');
       
    }
});


window.addEventListener('resize', Utils.debounce(() => {
    Logger.log('Window resized, adjusting layout...');
    
}, 250));

class Chatbot {
    constructor(courseCatalog) {
        this.courseCatalog = courseCatalog;
        this.isOpen = true;
        this.conversationHistory = [];
        this.userPreferences = {};
        this.courseSimilarityMatrix = {};
        this.initializeElements();
        this.setupEventListeners();
        this.initializeAI();
    }

    initializeElements() {
        this.chatbot = document.getElementById('chatbot');
        this.chatbotToggle = document.getElementById('chatbotToggle');
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.sendButton = document.getElementById('sendMessage');
    }

    setupEventListeners() {
        this.chatbotToggle.addEventListener('click', () => this.toggleChatbot());
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    toggleChatbot() {
        this.isOpen = !this.isOpen;
        this.chatbot.classList.toggle('collapsed', !this.isOpen);
        this.chatbotToggle.textContent = this.isOpen ? '−' : '+';
    }

    sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        this.addMessage(message, 'user');
        this.chatInput.value = '';
        
        setTimeout(() => {
            this.showTypingIndicator();
            setTimeout(() => {
                this.hideTypingIndicator();
                this.processMessage(message);
            }, 1500);
        }, 500);
    }

    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = content;
        
        messageDiv.appendChild(contentDiv);
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    addCourseSuggestions(courses) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        courses.forEach(course => {
            const suggestion = document.createElement('div');
            suggestion.className = 'course-suggestion';
            suggestion.innerHTML = `
                <div class="course-code">${course.SUBJECT} ${course.CATALOG_NBR}</div>
                <div class="course-desc">${course.DESCR}</div>
            `;
            suggestion.addEventListener('click', () => {
                this.courseCatalog.searchCourses(course.SUBJECT, course.CATALOG_NBR);
                this.learnFromUserInteraction(this.conversationHistory[this.conversationHistory.length - 1]?.query || '', course);
                this.addMessage(`I've searched for ${course.SUBJECT} ${course.CATALOG_NBR} for you! I'll remember your interest in ${course.SUBJECT} courses.`, 'bot');
            });
            contentDiv.appendChild(suggestion);
        });
        
        messageDiv.appendChild(contentDiv);
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-content">
                <span>Assistant is typing</span>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        this.chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const typingIndicator = this.chatMessages.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    processMessage(message) {
        this.enhancedProcessMessage(message);
    }

    handlePhilosophyQuery() {
        const philosophyCourses = this.courseCatalog.courses
            .filter(course => course.SUBJECT === 'PHIL')
            .slice(0, 3);
        
        this.addMessage("Here are some Philosophy courses I found:", 'bot');
        this.addCourseSuggestions(philosophyCourses);
    }

    handleScienceQuery() {
        const scienceCourses = this.courseCatalog.courses
            .filter(course => course.SUBJECT === 'CHEM' || course.SUBJECT === 'BIOL' || course.SUBJECT === 'PHYS')
            .slice(0, 3);
        
        this.addMessage("Here are some Science courses I found:", 'bot');
        this.addCourseSuggestions(scienceCourses);
    }

    handleMathQuery() {
        const mathCourses = this.courseCatalog.courses
            .filter(course => course.SUBJECT === 'MATH')
            .slice(0, 3);
        
        this.addMessage("Here are some Mathematics courses I found:", 'bot');
        this.addCourseSuggestions(mathCourses);
    }

    handleRecommendationQuery() {
        const popularCourses = this.courseCatalog.courses
            .filter(course => course.SUBJECT && course.CATALOG_NBR && course.DESCR)
            .slice(0, 3);
        
        this.addMessage("Based on our catalog, here are some popular courses I recommend:", 'bot');
        this.addCourseSuggestions(popularCourses);
    }

    handleSearchQuery(message) {
        const searchTerms = message.replace(/search|find|for/gi, '').trim();
        const matchingCourses = this.courseCatalog.courses
            .filter(course => 
                course.DESCR.toLowerCase().includes(searchTerms.toLowerCase()) ||
                course.SUBJECT.toLowerCase().includes(searchTerms.toLowerCase())
            )
            .slice(0, 3);
        
        if (matchingCourses.length > 0) {
            this.addMessage(`I found ${matchingCourses.length} courses matching "${searchTerms}":`, 'bot');
            this.addCourseSuggestions(matchingCourses);
        } else {
            this.addMessage(`I couldn't find any courses matching "${searchTerms}". Try searching for subjects like PHIL, CHEM, MATH, or specific topics.`, 'bot');
        }
    }

    handleHelpQuery() {
        this.addMessage("I can help you with:\n• Finding courses by subject (PHIL, CHEM, MATH, etc.)\n• Recommending popular courses\n• Searching for specific topics\n• Answering questions about our catalog\n\nJust ask me anything about courses!", 'bot');
    }

    handleGeneralQuery() {
        const responses = [
            "I can help you find courses! Try asking about specific subjects like 'philosophy courses' or 'chemistry classes'.",
            "Looking for something specific? I can search our course catalog for you. Just tell me what you're interested in!",
            "I'm here to help with course recommendations. What subject area interests you?",
            "Try asking me to 'recommend courses' or search for specific topics like 'technology' or 'writing'."
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        this.addMessage(randomResponse, 'bot');
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    initializeAI() {
        this.buildCourseSimilarityMatrix();
        this.analyzeCoursePatterns();
    }

    buildCourseSimilarityMatrix() {
        const courses = this.courseCatalog.courses;
        this.courseSimilarityMatrix = {};
        
        for (let i = 0; i < courses.length; i++) {
            this.courseSimilarityMatrix[courses[i].CRSE_ID] = {};
            for (let j = 0; j < courses.length; j++) {
                if (i !== j) {
                    const similarity = this.calculateCourseSimilarity(courses[i], courses[j]);
                    this.courseSimilarityMatrix[courses[i].CRSE_ID][courses[j].CRSE_ID] = similarity;
                }
            }
        }
    }

    calculateCourseSimilarity(course1, course2) {
        let similarity = 0;
        
        if (course1.SUBJECT === course2.SUBJECT) similarity += 0.4;
        if (course1.SSR_COMPONENT === course2.SSR_COMPONENT) similarity += 0.2;
        
        const desc1 = course1.DESCR.toLowerCase();
        const desc2 = course2.DESCR.toLowerCase();
        const commonWords = this.findCommonWords(desc1, desc2);
        similarity += commonWords * 0.1;
        
        const catalog1 = parseInt(course1.CATALOG_NBR);
        const catalog2 = parseInt(course2.CATALOG_NBR);
        if (!isNaN(catalog1) && !isNaN(catalog2)) {
            const levelDiff = Math.abs(catalog1 - catalog2);
            if (levelDiff <= 100) similarity += 0.3;
        }
        
        return Math.min(similarity, 1.0);
    }

    findCommonWords(text1, text2) {
        const words1 = text1.split(/\s+/).filter(word => word.length > 3);
        const words2 = text2.split(/\s+/).filter(word => word.length > 3);
        const common = words1.filter(word => words2.includes(word));
        return common.length;
    }

    analyzeCoursePatterns() {
        this.coursePatterns = {
            popularSubjects: this.findPopularSubjects(),
            difficultyLevels: this.analyzeDifficultyLevels(),
            courseClusters: this.createCourseClusters()
        };
    }

    findPopularSubjects() {
        const subjectCount = {};
        this.courseCatalog.courses.forEach(course => {
            if (course.SUBJECT) {
                subjectCount[course.SUBJECT] = (subjectCount[course.SUBJECT] || 0) + 1;
            }
        });
        return Object.entries(subjectCount)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([subject]) => subject);
    }

    analyzeDifficultyLevels() {
        const levels = {};
        this.courseCatalog.courses.forEach(course => {
            const catalogNum = parseInt(course.CATALOG_NBR);
            if (!isNaN(catalogNum)) {
                let level = 'beginner';
                if (catalogNum >= 300) level = 'intermediate';
                if (catalogNum >= 500) level = 'advanced';
                levels[level] = (levels[level] || 0) + 1;
            }
        });
        return levels;
    }

    createCourseClusters() {
        const clusters = {
            'STEM': ['CHEM', 'MATH', 'PHYS', 'BIOL', 'CS', 'ENG'],
            'Humanities': ['PHIL', 'HIST', 'ENGL', 'LANG', 'ART'],
            'Social Sciences': ['PSYC', 'SOC', 'POLS', 'ECON'],
            'Professional': ['BUS', 'LAW', 'MED', 'NURS']
        };
        return clusters;
    }

    getSmartRecommendations(userQuery, limit = 3) {
        const queryWords = userQuery.toLowerCase().split(/\s+/);
        const scoredCourses = [];
        
        this.courseCatalog.courses.forEach(course => {
            let score = 0;
            const courseText = `${course.SUBJECT} ${course.CATALOG_NBR} ${course.DESCR}`.toLowerCase();
            
            queryWords.forEach(word => {
                if (courseText.includes(word)) {
                    score += 1;
                }
            });
            
            if (course.SUBJECT && this.coursePatterns.popularSubjects.includes(course.SUBJECT)) {
                score += 0.5;
            }
            
            if (score > 0) {
                scoredCourses.push({ course, score });
            }
        });
        
        return scoredCourses
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map(item => item.course);
    }

    learnFromUserInteraction(query, selectedCourse) {
        if (!this.userPreferences[selectedCourse.SUBJECT]) {
            this.userPreferences[selectedCourse.SUBJECT] = 0;
        }
        this.userPreferences[selectedCourse.SUBJECT]++;
        
        this.conversationHistory.push({
            query,
            selectedCourse: selectedCourse.CRSE_ID,
            timestamp: Date.now()
        });
    }

    getPersonalizedRecommendations(limit = 3) {
        const userSubjects = Object.keys(this.userPreferences);
        if (userSubjects.length === 0) return this.getSmartRecommendations('popular courses', limit);
        
        const topSubject = userSubjects.reduce((a, b) => 
            this.userPreferences[a] > this.userPreferences[b] ? a : b
        );
        
        return this.courseCatalog.courses
            .filter(course => course.SUBJECT === topSubject)
            .slice(0, limit);
    }

    enhancedProcessMessage(message) {
        const lowerMessage = message.toLowerCase();
        this.conversationHistory.push({ query: message, timestamp: Date.now() });
        
        if (lowerMessage.includes('philosophy') || lowerMessage.includes('phil')) {
            this.handlePhilosophyQuery();
        } else if (lowerMessage.includes('science') || lowerMessage.includes('chemistry') || lowerMessage.includes('chem')) {
            this.handleScienceQuery();
        } else if (lowerMessage.includes('math') || lowerMessage.includes('mathematics')) {
            this.handleMathQuery();
        } else if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest')) {
            this.handleSmartRecommendationQuery(message);
        } else if (lowerMessage.includes('search') || lowerMessage.includes('find')) {
            this.handleSmartSearchQuery(message);
        } else if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
            this.handleHelpQuery();
        } else if (lowerMessage.includes('popular') || lowerMessage.includes('trending')) {
            this.handlePopularCoursesQuery();
        } else {
            this.handleSmartGeneralQuery(message);
        }
    }

    handleSmartRecommendationQuery(message) {
        const recommendations = this.getSmartRecommendations(message, 3);
        if (recommendations.length > 0) {
            this.addMessage("Based on your query, here are my AI-powered recommendations:", 'bot');
            this.addCourseSuggestions(recommendations);
        } else {
            const personalized = this.getPersonalizedRecommendations(3);
            this.addMessage("Here are some personalized recommendations based on your interests:", 'bot');
            this.addCourseSuggestions(personalized);
        }
    }

    handleSmartSearchQuery(message) {
        const searchTerms = message.replace(/search|find|for/gi, '').trim();
        const recommendations = this.getSmartRecommendations(searchTerms, 3);
        
        if (recommendations.length > 0) {
            this.addMessage(`I found ${recommendations.length} courses matching "${searchTerms}" using AI analysis:`, 'bot');
            this.addCourseSuggestions(recommendations);
        } else {
            this.addMessage(`No courses found for "${searchTerms}". Try broader terms or ask me to recommend popular courses.`, 'bot');
        }
    }

    handlePopularCoursesQuery() {
        const popularCourses = this.coursePatterns.popularSubjects
            .slice(0, 3)
            .map(subject => this.courseCatalog.courses.find(course => course.SUBJECT === subject))
            .filter(Boolean);
        
        this.addMessage("Here are the most popular subjects in our catalog:", 'bot');
        this.addCourseSuggestions(popularCourses);
    }

    handleSmartGeneralQuery(message) {
        const recommendations = this.getSmartRecommendations(message, 2);
        if (recommendations.length > 0) {
            this.addMessage("I think you might be interested in these courses:", 'bot');
            this.addCourseSuggestions(recommendations);
        } else {
            const responses = [
                "I can help you find courses using AI! Try asking about specific subjects or topics.",
                "Let me use my AI to recommend some courses. What interests you?",
                "I can analyze our course catalog to find what you're looking for. What subject interests you?",
                "My AI can help you discover courses. Try asking about 'philosophy', 'science', or 'popular courses'."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            this.addMessage(randomResponse, 'bot');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const catalog = new CourseCatalog();
    const chatbot = new Chatbot(catalog);
});


if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CourseCatalog, Utils, Logger, Chatbot };
}
