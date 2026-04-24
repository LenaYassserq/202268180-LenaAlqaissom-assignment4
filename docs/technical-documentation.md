# Technical Documentation: Portfolio Website (Assignment 4)

## Project Overview

### Description

This project is the enhanced final version of my personal portfolio website, developed for Assignment 4.

It builds upon Assignment 3 by adding Dark Mode functionality, improved UI/UX design, better styling using CSS variables, user customization features, and a more polished professional presentation.

The website is designed as a responsive and interactive portfolio that showcases personal information, skills, projects, and a fully functional contact form.

---

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- LocalStorage
- Browser Geolocation API
- GoWeather API
- Formspree

### External Tools & APIs

- GoWeather API
- Browser Geolocation API
- Formspree
- LocalStorage

---

## Purpose

Assignment 4 required improving the previous portfolio project into a more polished and professional web application by demonstrating:

- Dark Mode implementation
- Stronger UI/UX consistency
- Improved responsiveness and accessibility
- Persistent user customization
- Clean project organization and documentation
- Presentation-ready professional quality
- Responsible AI usage transparency

---

## Project Structure

```text
202268180-LenaAlqaissom-assignment4/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── script.js
├── assets/
│   └── images/
├── docs/
│   ├── ai-usage-report.md
│   └── technical-documentation.md
├── presentation/
│   ├── slides.pdf
│   └── demo-video.mp4
└── README.md
```
## HTML Structure

Uses semantic layout with:

- `<header>`
- `<nav>`
- `<main>`
- `<section>`
- `<footer>`

### Main Sections

1. Greeting Bar  
2. Hero Section  
3. About Section  
4. Skills Section  
5. Projects Section  
6. Contact Form  
7. Footer  

### Assignment 4 Additions

- Dark Mode toggle button  
- Improved navigation bar structure  
- Better section spacing and layout consistency  
- Updated presentation-ready UI improvements  

---

## CSS Architecture

### Styling Approach

- Uses CSS variables (`:root`) for theme management  
- Light Mode and Dark Mode controlled using variables  
- Responsive layout using Flexbox and Grid  
- Reusable styling system for consistency  

### Key Components

- Dark Mode styling system  
- Navigation bar improvements  
- Project cards and section spacing  
- Contact form styling  
- Improved transitions and animations  

### Accessibility

- Better color contrast  
- Improved focus states  
- Responsive layout for all devices  
- Cleaner visual hierarchy for readability  

---

## JavaScript Functionality

### 1. Dark Mode Toggle

- Users can switch between Light Mode and Dark Mode  
- Theme preference is saved using LocalStorage  
- Saved theme automatically applies on page reload  

### 2. Greeting Bar

- Stores user name using LocalStorage  
- Displays personalized greeting  
- Allows editing saved user name  

### 3. Weather Widget

- Uses browser geolocation to detect location  
- Fetches weather data using GoWeather API  
- Includes loading state and error handling  

### 4. Project Filtering and Sorting

- Filters projects by category  
- Sorts projects alphabetically  
- Dynamically updates project display  

### 5. Contact Form

Validates:

- Name  
- Email  
- Message  

Also:

- Submits form asynchronously using Formspree  
- Displays success and error feedback  

### 6. Scroll-Based Features

- Smooth scrolling between sections  
- Active navigation highlighting  
- Animated project and skill cards  

### 7. Footer Enhancements

- Dynamic current year  
- Time-based greeting message  

---

## Performance and Optimization

### Key Improvements

- Cleaner CSS structure using reusable variables  
- Improved responsive behavior across devices  
- Reduced unused styling and code clutter  
- Better performance through lightweight transitions  
- More maintainable and scalable project structure  

---

## Features Summary

| Feature | Description | Technology |
|---|---|---|
| Dark Mode Toggle | Theme switching with persistence | JS + LocalStorage |
| Greeting Bar | Saves and restores user name | LocalStorage |
| Weather Widget | Displays weather with fallback | API + Geolocation |
| Project Filtering | Filters projects by category | JavaScript |
| Contact Form | Validation and async submission | JS + Formspree |
| Scroll Animations | Reveals elements on scroll | JavaScript |
| Navigation Highlight | Active section detection | JavaScript |
| Footer Greeting | Time-based message | JavaScript |

---

## Conclusion

This Assignment 4 portfolio demonstrates strong front-end development skills by combining structured HTML, scalable CSS architecture, and well-organized JavaScript functionality.

The final result is a polished and professional web application that includes Dark Mode, improved UI/UX, responsive design, API integration, state management, and better user experience, successfully meeting all Assignment 4 requirements.
