(function () {
  'use strict';

  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav a');

  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const currentYear = document.getElementById('year');
  const footerGreeting = document.getElementById('footerGreeting');

  const greetingBar = document.querySelector('.greeting-bar');
  const greetingForm = document.getElementById('greetingForm');
  const greetingMessageDisplay = document.getElementById('greetingMessage');
  const userNameInput = document.getElementById('userName');
  const saveNameBtn = document.getElementById('saveName');
  const clearNameBtn = document.getElementById('clearName');
  const editNameBtn = document.getElementById('editName');
  const displayedName = document.getElementById('displayName');
  const greetingPrefix = document.getElementById('greetingPrefix');

  const weatherDisplay = document.getElementById('weatherDisplay');
  const weatherLoading = document.getElementById('weatherLoading');
  const weatherContent = document.getElementById('weatherContent');
  const weatherError = document.getElementById('weatherError');
  const weatherTemp = document.getElementById('weatherTemp');
  const weatherDesc = document.getElementById('weatherDesc');

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');

  const skillItems = document.querySelectorAll('.skill');
  const projectCards = document.querySelectorAll('.project');

  const projectFilter = document.getElementById('projectFilter');
  const projectSort = document.getElementById('projectSort');
  const projectsGrid = document.getElementById('projectsGrid');

  let currentSection = 'top';

  function debounce(func, wait) {
    let timeout;

    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  function getOffsetTop(element) {
    const rect = element.getBoundingClientRect();
    return rect.top + window.pageYOffset;
  }

  const USER_NAME_KEY = 'portfolio_user_name';

  function saveUserName(name) {
    try {
      localStorage.setItem(USER_NAME_KEY, name.trim());
      return true;
    } catch (error) {
      console.error('Error saving name:', error);
      return false;
    }
  }

  function getUserName() {
    try {
      return localStorage.getItem(USER_NAME_KEY);
    } catch (error) {
      console.error('Error getting name:', error);
      return null;
    }
  }

  function showGreetingForm() {
    if (!greetingForm || !greetingMessageDisplay) return;

    greetingMessageDisplay.hidden = true;
    greetingMessageDisplay.classList.remove('fade-in');
    greetingMessageDisplay.classList.add('fade-out');

    greetingForm.hidden = false;
    greetingForm.classList.remove('fade-out');
    greetingForm.classList.add('fade-in');
  }

  function showGreetingMessage(name, isReturningUser = false) {
    if (!greetingForm || !greetingMessageDisplay || !displayedName) return;

    displayedName.textContent = name;

    if (greetingPrefix) {
      greetingPrefix.textContent = isReturningUser ? 'Welcome back' : 'Welcome';
    }

    greetingForm.classList.remove('fade-in');
    greetingForm.classList.add('fade-out');

    setTimeout(() => {
      greetingForm.hidden = true;
      greetingMessageDisplay.hidden = false;
      greetingMessageDisplay.classList.remove('fade-out');
      greetingMessageDisplay.classList.add('fade-in');
    }, 250);
  }

  function resetGreetingInputState() {
    if (!userNameInput) return;

    userNameInput.style.borderColor = '';
    userNameInput.placeholder = 'Enter your name';
  }

  function showGreetingInputError(message) {
    if (!userNameInput) return;

    userNameInput.style.borderColor = '#ff6b6b';
    userNameInput.value = '';
    userNameInput.placeholder = message;

    setTimeout(() => {
      resetGreetingInputState();
    }, 2000);
  }

  function handleSaveName() {
    if (!userNameInput) return;

    const name = userNameInput.value.trim();

    if (!name) {
      showGreetingInputError('Please enter your name');
      return;
    }

    if (name.length < 2) {
      showGreetingInputError('Name must be at least 2 characters');
      return;
    }

    if (saveUserName(name)) {
      showGreetingMessage(name, false);
      userNameInput.value = '';
      resetGreetingInputState();

      setTimeout(() => {
        initWeatherDisplay();
      }, 250);
    }
  }

  function handleClearName() {
    if (!userNameInput) return;

    userNameInput.value = '';
    resetGreetingInputState();
    userNameInput.focus();
  }

  function handleEditName() {
    const currentName = getUserName();

    if (currentName && userNameInput) {
      userNameInput.value = currentName;
      showGreetingForm();

      setTimeout(() => {
        userNameInput.focus();
        userNameInput.select();
      }, 250);
    }
  }

  function handleNameInputKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSaveName();
    }
  }

  function initGreetingBar() {
    if (!greetingBar) return;

    const savedName = getUserName();

    if (savedName) {
      showGreetingMessage(savedName, true);
    } else {
      showGreetingForm();
    }

    setTimeout(() => {
      greetingBar.classList.add('show');
    }, 300);
  }

  async function getUserLocation() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({
          city: 'Dhahran',
          latitude: 26.2361,
          longitude: 50.0393
        });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const reverseGeocodeUrl =
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

            const response = await fetch(reverseGeocodeUrl);

            if (!response.ok) {
              resolve({
                city: 'Dhahran',
                latitude,
                longitude
              });
              return;
            }

            const data = await response.json();
            resolve({
              city: data.city || data.locality || 'Dhahran',
              latitude,
              longitude
            });
          } catch (error) {
            console.error('Error detecting city:', error);
            resolve({
              city: 'Dhahran',
              latitude,
              longitude
            });
          }
        },
        () => {
          resolve({
            city: 'Dhahran',
            latitude: 26.2361,
            longitude: 50.0393
          });
        },
        { timeout: 5000 }
      );
    });
  }

  function mapWeatherCode(code) {
    const weatherMap = {
      0: 'Clear',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Cloudy',
      45: 'Fog',
      48: 'Fog',
      51: 'Light drizzle',
      53: 'Drizzle',
      55: 'Heavy drizzle',
      61: 'Light rain',
      63: 'Rain',
      65: 'Heavy rain',
      71: 'Light snow',
      73: 'Snow',
      75: 'Heavy snow',
      80: 'Rain showers',
      81: 'Rain showers',
      82: 'Heavy showers',
      95: 'Thunderstorm'
    };

    return weatherMap[code] || 'Weather updated';
  }

  async function fetchWeatherData(location) {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,weather_code`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Weather request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (!data || !data.current) {
      throw new Error('Invalid weather data');
    }

    return {
      city: location.city,
      temp: `${Math.round(data.current.temperature_2m)}°C`,
      description: mapWeatherCode(data.current.weather_code)
    };
  }

  function showWeatherLoading() {
    if (!weatherDisplay) return;

    if (weatherLoading) weatherLoading.hidden = false;
    if (weatherContent) weatherContent.hidden = true;
    if (weatherError) weatherError.hidden = true;
  }

  function showWeatherData(weatherData) {
    if (!weatherTemp || !weatherDesc || !weatherContent) return;

    weatherTemp.textContent = weatherData.temp;
    weatherDesc.textContent = weatherData.description;

    if (weatherLoading) weatherLoading.hidden = true;
    if (weatherError) weatherError.hidden = true;
    weatherContent.hidden = false;
  }

  function showWeatherError() {
    if (weatherLoading) weatherLoading.hidden = true;
    if (weatherContent) weatherContent.hidden = true;
    if (weatherError) weatherError.hidden = false;
  }

  async function initWeatherDisplay() {
    if (!weatherDisplay) return;

    showWeatherLoading();

    try {
      const location = await getUserLocation();
      const weatherData = await fetchWeatherData(location);
      showWeatherData(weatherData);
    } catch (error) {
      console.error('Failed to load weather:', error);
      showWeatherError();
    }
  }

  function scrollToSection(sectionId) {
    const targetElement = document.getElementById(sectionId);
    if (!targetElement || !header) return;

    const targetPosition = getOffsetTop(targetElement) - header.offsetHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }

  function setActiveNavLink(sectionId) {
    currentSection = sectionId;

    navLinks.forEach((link) => {
      const href = link.getAttribute('href').substring(1);
      link.classList.toggle('active', href === sectionId);
    });
  }

  function handleNavLinkClick(event) {
    event.preventDefault();

    const href = event.currentTarget.getAttribute('href');
    const targetSection = href.substring(1);

    scrollToSection(targetSection);
    setActiveNavLink(targetSection);
  }

  function updateActiveNavLink() {
    if (!header) return;

    const sections = ['top', 'about', 'skills', 'projects', 'contact'];
    const scrollPosition = window.pageYOffset + header.offsetHeight + 120;

    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = document.getElementById(sections[i]);

      if (section && getOffsetTop(section) <= scrollPosition) {
        if (currentSection !== sections[i]) {
          setActiveNavLink(sections[i]);
        }
        break;
      }
    }
  }

  function setFieldError(input, errorEl, message) {
    if (input) {
      input.classList.toggle('error', Boolean(message));
      input.setAttribute('aria-invalid', Boolean(message));
    }

    if (errorEl) {
      errorEl.textContent = message || '';
    }
  }

  function validateName() {
    if (!nameInput) return true;

    const value = nameInput.value.trim();

    if (!value) {
      setFieldError(nameInput, nameError, 'Name is required');
      return false;
    }

    if (value.length < 2) {
      setFieldError(nameInput, nameError, 'Name must be at least 2 characters long');
      return false;
    }

    setFieldError(nameInput, nameError, '');
    return true;
  }

  function validateEmail() {
    if (!emailInput) return true;

    const value = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!value) {
      setFieldError(emailInput, emailError, 'Email is required');
      return false;
    }

    if (!emailRegex.test(value)) {
      setFieldError(emailInput, emailError, 'Please enter a valid email address');
      return false;
    }

    setFieldError(emailInput, emailError, '');
    return true;
  }

  function validateMessage() {
    if (!messageInput) return true;

    const value = messageInput.value.trim();

    if (!value) {
      setFieldError(messageInput, messageError, 'Message is required');
      return false;
    }

    if (value.length < 5) {
      setFieldError(messageInput, messageError, 'Message must be at least 5 characters long');
      return false;
    }

    setFieldError(messageInput, messageError, '');
    return true;
  }

  function showFormStatus(message, type = 'error') {
    if (!formStatus) return;

    formStatus.textContent = message;
    formStatus.className = '';
    formStatus.classList.add(type);
  }

  function clearFormErrors() {
    setFieldError(nameInput, nameError, '');
    setFieldError(emailInput, emailError, '');
    setFieldError(messageInput, messageError, '');
  }

  async function handleFormSubmit(event) {
    event.preventDefault();

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isMessageValid = validateMessage();

    if (!isNameValid || !isEmailValid || !isMessageValid) {
      if (!isNameValid && nameInput) {
        nameInput.focus();
      } else if (!isEmailValid && emailInput) {
        emailInput.focus();
      } else if (!isMessageValid && messageInput) {
        messageInput.focus();
      }

      showFormStatus('Please fix the highlighted fields', 'error');
      return;
    }

    if (!contactForm) return;

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton ? submitButton.textContent : '';

    try {
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
      }

      const formData = new FormData(contactForm);

      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Form submission failed');
      }

      showFormStatus('Thank you! Your message has been sent successfully.', 'success');
      contactForm.reset();
      clearFormErrors();
    } catch (error) {
      console.error('Form submission error:', error);
      showFormStatus('Oops! There was a problem sending your message. Please try again.', 'error');
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    }
  }

  function getSortedProjects(cards, sortValue) {
    const cardsArray = [...cards];

    if (sortValue === 'title-asc') {
      cardsArray.sort((a, b) =>
        a.dataset.title.toLowerCase().localeCompare(b.dataset.title.toLowerCase())
      );
    } else if (sortValue === 'title-desc') {
      cardsArray.sort((a, b) =>
        b.dataset.title.toLowerCase().localeCompare(a.dataset.title.toLowerCase())
      );
    }

    return cardsArray;
  }

  function renderProjects() {
    if (!projectsGrid || !projectCards.length) return;

    const selectedCategory = projectFilter ? projectFilter.value : 'all';
    const selectedSort = projectSort ? projectSort.value : 'default';

    const sortedCards = getSortedProjects(projectCards, selectedSort);

    sortedCards.forEach((card) => {
      const category = card.dataset.category;
      const matchesFilter = selectedCategory === 'all' || category === selectedCategory;

      card.classList.toggle('is-hidden', !matchesFilter);
      projectsGrid.appendChild(card);
    });
  }

  function updateFooterYear() {
    if (currentYear) {
      currentYear.textContent = new Date().getFullYear();
    }
  }

  function updateFooterGreeting() {
    if (!footerGreeting) return;

    const hour = new Date().getHours();
    let greetingText = '';

    if (hour >= 5 && hour < 12) {
      greetingText = 'Good morning! Thank you for visiting my portfolio.';
    } else if (hour >= 12 && hour < 17) {
      greetingText = 'Good afternoon! Thank you for visiting my portfolio.';
    } else if (hour >= 17 && hour < 21) {
      greetingText = 'Good evening! Thank you for visiting my portfolio.';
    } else {
      greetingText = 'Good night! Thank you for visiting my portfolio.';
    }

    footerGreeting.textContent = greetingText;
  }

  function initSkillAnimations() {
    if (!skillItems.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
          }
        });
      },
      {
        threshold: 0.15
      }
    );

    skillItems.forEach((item, index) => {
      item.style.transitionDelay = `${index * 0.08}s`;
      observer.observe(item);
    });
  }

  function initProjectAnimations() {
    if (!projectCards.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
          }
        });
      },
      {
        threshold: 0.15
      }
    );

    projectCards.forEach((card, index) => {
      card.style.transitionDelay = `${index * 0.12}s`;
      observer.observe(card);
    });
  }

  function initEventListeners() {
    navLinks.forEach((link) => {
      link.addEventListener('click', handleNavLinkClick);
    });

    if (contactForm) {
      contactForm.addEventListener('submit', handleFormSubmit);
    }

    if (nameInput) {
      nameInput.addEventListener('blur', validateName);
      nameInput.addEventListener('input', validateName);
    }

    if (emailInput) {
      emailInput.addEventListener('blur', validateEmail);
      emailInput.addEventListener('input', validateEmail);
    }

    if (messageInput) {
      messageInput.addEventListener('blur', validateMessage);
      messageInput.addEventListener('input', validateMessage);
    }

    if (saveNameBtn) {
      saveNameBtn.addEventListener('click', handleSaveName);
    }

    if (clearNameBtn) {
      clearNameBtn.addEventListener('click', handleClearName);
    }

    if (editNameBtn) {
      editNameBtn.addEventListener('click', handleEditName);
    }

    if (userNameInput) {
      userNameInput.addEventListener('keydown', handleNameInputKeyDown);
    }

    if (projectFilter) {
      projectFilter.addEventListener('change', renderProjects);
    }

    if (projectSort) {
      projectSort.addEventListener('change', renderProjects);
    }

    window.addEventListener(
      'scroll',
      debounce(() => {
        updateActiveNavLink();
      }, 100)
    );
  }

  function init() {
    updateFooterYear();
    updateFooterGreeting();
    initEventListeners();
    initGreetingBar();
    initSkillAnimations();
    initProjectAnimations();
    renderProjects();
    setActiveNavLink('top');

    if (getUserName()) {
      setTimeout(() => {
        initWeatherDisplay();
      }, 400);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();