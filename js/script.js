(function () {
  "use strict";

  // =========================
  // Element References
  // =========================
  const header = document.getElementById("siteHeader");
  const navLinks = document.querySelectorAll(".nav a");

  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  const currentYear = document.getElementById("year");
  const footerGreeting = document.getElementById("footerGreeting");
  const submitBtn = document.getElementById("submitBtn");

  const greetingBar = document.getElementById("greetingBar");
  const greetingForm = document.getElementById("greetingForm");
  const greetingMessageDisplay = document.getElementById("greetingMessage");
  const userNameInput = document.getElementById("userName");
  const saveNameBtn = document.getElementById("saveName");
  const clearNameBtn = document.getElementById("clearName");
  const editNameBtn = document.getElementById("editName");
  const displayedName = document.getElementById("displayName");
  const greetingPrefix = document.getElementById("greetingPrefix");

  const weatherDisplay = document.getElementById("weatherDisplay");
  const weatherLoading = document.getElementById("weatherLoading");
  const weatherContent = document.getElementById("weatherContent");
  const weatherError = document.getElementById("weatherError");
  const weatherTemp = document.getElementById("weatherTemp");
  const weatherDesc = document.getElementById("weatherDesc");

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");

  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const messageError = document.getElementById("messageError");

  const skillItems = document.querySelectorAll(".skill");
  const projectCards = document.querySelectorAll(".project");

  const projectFilter = document.getElementById("projectFilter");
  const projectSort = document.getElementById("projectSort");
  const projectsGrid = document.getElementById("projectsGrid");
  const projectsStatus = document.getElementById("projectsStatus");

  const themeToggle = document.getElementById("themeToggle");

  // =========================
  // Constants
  // =========================
  const USER_NAME_KEY = "portfolio_user_name";
  const THEME_KEY = "portfolio_theme";
  const DEFAULT_CITY = "Dhahran";
  const WEATHER_TIMEOUT_MS = 6000;

  let currentSection = "top";

  // =========================
  // Utility Functions
  // =========================
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

  function saveUserName(name) {
    try {
      localStorage.setItem(USER_NAME_KEY, name.trim());
      return true;
    } catch (error) {
      console.error("Error saving name:", error);
      return false;
    }
  }

  function getUserName() {
    try {
      return localStorage.getItem(USER_NAME_KEY);
    } catch (error) {
      console.error("Error getting name:", error);
      return null;
    }
  }

  function withTimeout(promise, timeoutMs) {
    return Promise.race([
      promise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out")), timeoutMs)
      ),
    ]);
  }

  // =========================
  // Theme Functions
  // =========================
  function saveTheme(theme) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  }

  function getSavedTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (error) {
      console.error("Error getting theme:", error);
      return null;
    }
  }

  function updateThemeToggleLabel(theme) {
    if (!themeToggle) return;
    themeToggle.textContent = theme === "dark" ? "☀️ Light" : "🌙 Dark";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    updateThemeToggleLabel(theme);
  }

  function initTheme() {
    const savedTheme = getSavedTheme() || "light";
    applyTheme(savedTheme);
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    applyTheme(nextTheme);
    saveTheme(nextTheme);
  }

  // =========================
  // Greeting Bar Functions
  // =========================
  function showGreetingForm() {
    if (!greetingForm || !greetingMessageDisplay) return;

    greetingMessageDisplay.hidden = true;
    greetingMessageDisplay.classList.remove("fade-in");
    greetingMessageDisplay.classList.add("fade-out");

    greetingForm.hidden = false;
    greetingForm.classList.remove("fade-out");
    greetingForm.classList.add("fade-in");
  }

  function showGreetingMessage(name, isReturningUser) {
    if (!greetingForm || !greetingMessageDisplay || !displayedName) return;

    displayedName.textContent = name;
    greetingPrefix.textContent = isReturningUser ? "Welcome back" : "Welcome";

    greetingForm.classList.remove("fade-in");
    greetingForm.classList.add("fade-out");

    setTimeout(() => {
      greetingForm.hidden = true;
      greetingMessageDisplay.hidden = false;
      greetingMessageDisplay.classList.remove("fade-out");
      greetingMessageDisplay.classList.add("fade-in");
    }, 250);
  }

  function resetGreetingInputState() {
    if (!userNameInput) return;

    userNameInput.style.borderColor = "";
    userNameInput.placeholder = "Enter your name";
  }

  function showGreetingInputError(message) {
    if (!userNameInput) return;

    userNameInput.style.borderColor = "#ff6b6b";
    userNameInput.value = "";
    userNameInput.placeholder = message;

    setTimeout(resetGreetingInputState, 2000);
  }

  function handleSaveName() {
    if (!userNameInput) return;

    const name = userNameInput.value.trim();

    if (!name) {
      showGreetingInputError("Please enter your name");
      return;
    }

    if (name.length < 2) {
      showGreetingInputError("Name must be at least 2 characters");
      return;
    }

    if (saveUserName(name)) {
      showGreetingMessage(name, false);
      userNameInput.value = "";
      resetGreetingInputState();

      setTimeout(initWeatherDisplay, 300);
    }
  }

  function handleClearName() {
    if (!userNameInput) return;

    userNameInput.value = "";
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
    if (event.key === "Enter") {
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
      greetingBar.classList.add("show");
    }, 250);
  }

  // =========================
  // Weather Functions
  // =========================
  async function getUserLocation() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(DEFAULT_CITY);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const reverseGeocodeUrl =
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

            const response = await withTimeout(fetch(reverseGeocodeUrl), WEATHER_TIMEOUT_MS);

            if (!response.ok) {
              resolve(DEFAULT_CITY);
              return;
            }

            const data = await response.json();
            const city = data.city || data.locality || DEFAULT_CITY;
            resolve(city);
          } catch (error) {
            console.error("Error detecting city:", error);
            resolve(DEFAULT_CITY);
          }
        },
        () => resolve(DEFAULT_CITY),
        { timeout: 5000 }
      );
    });
  }

  async function fetchWeatherData(city) {
    const url = `https://goweather.herokuapp.com/weather/${encodeURIComponent(city)}`;
    const response = await withTimeout(fetch(url), WEATHER_TIMEOUT_MS);

    if (!response.ok) {
      throw new Error(`Weather request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (!data || !data.temperature) {
      throw new Error("Invalid weather data");
    }

    return {
      city,
      temp: data.temperature,
      description: data.description || "No description available",
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

    weatherTemp.textContent = `${weatherData.city}: ${weatherData.temp}`;
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
      const city = await getUserLocation();
      const weatherData = await fetchWeatherData(city);
      showWeatherData(weatherData);
    } catch (error) {
      console.error("Failed to load weather:", error);
      showWeatherError();
    }
  }

  // =========================
  // Navigation Functions
  // =========================
  function scrollToSection(sectionId) {
    const targetElement = document.getElementById(sectionId);
    if (!targetElement || !header) return;

    const targetPosition = getOffsetTop(targetElement) - header.offsetHeight - 12;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });
  }

  function setActiveNavLink(sectionId) {
    currentSection = sectionId;

    navLinks.forEach((link) => {
      const href = link.getAttribute("href").substring(1);
      link.classList.toggle("active", href === sectionId);
    });
  }

  function handleNavLinkClick(event) {
    event.preventDefault();

    const href = event.currentTarget.getAttribute("href");
    const targetSection = href.substring(1);

    scrollToSection(targetSection);
    setActiveNavLink(targetSection);
  }

  function updateActiveNavLink() {
    if (!header) return;

    const sections = ["top", "about", "skills", "projects", "contact"];
    const scrollPosition = window.pageYOffset + header.offsetHeight + 140;

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

  // =========================
  // Form Validation Functions
  // =========================
  function setFieldError(input, errorEl, message) {
    if (input) {
      input.classList.toggle("error", Boolean(message));
      input.setAttribute("aria-invalid", Boolean(message) ? "true" : "false");
    }

    if (errorEl) {
      errorEl.textContent = message || "";
    }
  }

  function validateName() {
    if (!nameInput) return true;

    const value = nameInput.value.trim();

    if (!value) {
      setFieldError(nameInput, nameError, "Name is required");
      return false;
    }

    if (value.length < 2) {
      setFieldError(nameInput, nameError, "Name must be at least 2 characters long");
      return false;
    }

    setFieldError(nameInput, nameError, "");
    return true;
  }

  function validateEmail() {
    if (!emailInput) return true;

    const value = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!value) {
      setFieldError(emailInput, emailError, "Email is required");
      return false;
    }

    if (!emailRegex.test(value)) {
      setFieldError(emailInput, emailError, "Please enter a valid email address");
      return false;
    }

    setFieldError(emailInput, emailError, "");
    return true;
  }

  function validateMessage() {
    if (!messageInput) return true;

    const value = messageInput.value.trim();

    if (!value) {
      setFieldError(messageInput, messageError, "Message is required");
      return false;
    }

    if (value.length < 5) {
      setFieldError(messageInput, messageError, "Message must be at least 5 characters long");
      return false;
    }

    setFieldError(messageInput, messageError, "");
    return true;
  }

  function showFormStatus(message, type) {
    if (!formStatus) return;

    formStatus.textContent = message;
    formStatus.className = "";
    formStatus.classList.add(type);
  }

  function clearFormErrors() {
    setFieldError(nameInput, nameError, "");
    setFieldError(emailInput, emailError, "");
    setFieldError(messageInput, messageError, "");
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

      showFormStatus("Please fix the highlighted fields.", "error");
      return;
    }

    if (!contactForm) return;

    const originalButtonText = submitBtn ? submitBtn.textContent : "Send";

    try {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
      }

      const formData = new FormData(contactForm);

      const response = await fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      showFormStatus("Thank you! Your message has been sent successfully.", "success");
      contactForm.reset();
      clearFormErrors();
    } catch (error) {
      console.error("Form submission error:", error);
      showFormStatus(
        "Oops! There was a problem sending your message. Please try again.",
        "error"
      );
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalButtonText;
      }
    }
  }

  // =========================
  // Projects Functions
  // =========================
  function getSortedProjects(cards, sortValue) {
    const cardsArray = [...cards];

    if (sortValue === "title-asc") {
      cardsArray.sort((a, b) =>
        a.dataset.title.toLowerCase().localeCompare(b.dataset.title.toLowerCase())
      );
    } else if (sortValue === "title-desc") {
      cardsArray.sort((a, b) =>
        b.dataset.title.toLowerCase().localeCompare(a.dataset.title.toLowerCase())
      );
    }

    return cardsArray;
  }

  function updateProjectsStatus(visibleCount) {
    if (!projectsStatus) return;

    if (visibleCount === 0) {
      projectsStatus.textContent = "No projects match the selected filter.";
      return;
    }

    if (visibleCount === 1) {
      projectsStatus.textContent = "Showing 1 project.";
      return;
    }

    projectsStatus.textContent = `Showing ${visibleCount} projects.`;
  }

  function renderProjects() {
    if (!projectsGrid || !projectCards.length) return;

    const selectedCategory = projectFilter ? projectFilter.value : "all";
    const selectedSort = projectSort ? projectSort.value : "default";

    const sortedCards = getSortedProjects(projectCards, selectedSort);
    let visibleCount = 0;

    sortedCards.forEach((card) => {
      const category = card.dataset.category;
      const matchesFilter = selectedCategory === "all" || category === selectedCategory;

      card.classList.toggle("is-hidden", !matchesFilter);

      if (matchesFilter) {
        visibleCount += 1;
      }

      projectsGrid.appendChild(card);
    });

    updateProjectsStatus(visibleCount);
  }

  // =========================
  // Footer Functions
  // =========================
  function updateFooterYear() {
    if (currentYear) {
      currentYear.textContent = new Date().getFullYear();
    }
  }

  function updateFooterGreeting() {
    if (!footerGreeting) return;

    const hour = new Date().getHours();
    let greetingText = "";

    if (hour >= 5 && hour < 12) {
      greetingText = "Good morning! Thank you for visiting my portfolio.";
    } else if (hour >= 12 && hour < 17) {
      greetingText = "Good afternoon! Thank you for visiting my portfolio.";
    } else if (hour >= 17 && hour < 21) {
      greetingText = "Good evening! Thank you for visiting my portfolio.";
    } else {
      greetingText = "Good night! Thank you for visiting my portfolio.";
    }

    footerGreeting.textContent = greetingText;
  }

  // =========================
  // Animation Functions
  // =========================
  function initSkillAnimations() {
    if (!skillItems.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.15 }
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
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.15 }
    );

    projectCards.forEach((card, index) => {
      card.style.transitionDelay = `${index * 0.12}s`;
      observer.observe(card);
    });
  }

  // =========================
  // Event Listeners
  // =========================
  function initEventListeners() {
    navLinks.forEach((link) => {
      link.addEventListener("click", handleNavLinkClick);
    });

    if (contactForm) {
      contactForm.addEventListener("submit", handleFormSubmit);
    }

    if (nameInput) {
      nameInput.addEventListener("blur", validateName);
      nameInput.addEventListener("input", validateName);
    }

    if (emailInput) {
      emailInput.addEventListener("blur", validateEmail);
      emailInput.addEventListener("input", validateEmail);
    }

    if (messageInput) {
      messageInput.addEventListener("blur", validateMessage);
      messageInput.addEventListener("input", validateMessage);
    }

    if (saveNameBtn) {
      saveNameBtn.addEventListener("click", handleSaveName);
    }

    if (clearNameBtn) {
      clearNameBtn.addEventListener("click", handleClearName);
    }

    if (editNameBtn) {
      editNameBtn.addEventListener("click", handleEditName);
    }

    if (userNameInput) {
      userNameInput.addEventListener("keydown", handleNameInputKeyDown);
    }

    if (projectFilter) {
      projectFilter.addEventListener("change", renderProjects);
    }

    if (projectSort) {
      projectSort.addEventListener("change", renderProjects);
    }

    if (themeToggle) {
      themeToggle.addEventListener("click", toggleTheme);
    }

    window.addEventListener(
      "scroll",
      debounce(() => {
        updateActiveNavLink();
      }, 100)
    );
  }

  // =========================
  // App Initialization
  // =========================
  function init() {
    initTheme();
    updateFooterYear();
    updateFooterGreeting();
    initEventListeners();
    initGreetingBar();
    initSkillAnimations();
    initProjectAnimations();
    renderProjects();
    setActiveNavLink("top");

    if (getUserName()) {
      setTimeout(initWeatherDisplay, 400);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
