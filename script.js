const toggle = document.getElementById('dark-mode-toggle');
const currentTheme = localStorage.getItem('theme');
// When the user scrolls, execute the functions
window.onscroll = function() {
    updateProgressBar();
    scrollFunction();
};

function updateProgressBar() {
    var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = (winScroll / height) * 100;
    document.getElementById("myBar").style.width = scrolled + "%";
}

function scrollFunction() {
    const topBtn = document.getElementById("backToTop");
    // Show button after scrolling down 300px
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        topBtn.style.display = "block";
    } else {
        topBtn.style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top
function topFunction() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Smooth scrolling effect
    });
}

// Function to show/hide the button based on scroll position
window.onscroll = function() {
    scrollFunction();
};

function scrollFunction() {
    const topBtn = document.getElementById("backToTop");
    if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
        topBtn.style.display = "block";
    } else {
        topBtn.style.display = "none";
    }
}

// Function to smoothly scroll back to the top
function topFunction() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Check for saved theme preference
if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') toggle.textContent = '☀️';
}

toggle.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        toggle.textContent = '🌙';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        toggle.textContent = '☀️';
    }
});

// Change the date automatically
function setTodayDate() {
    const dateElement = document.getElementById('today-date');
    if (dateElement) {
        const today = new Date();
        
        // Options to format the date: e.g., "Feb 3, 2026"
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        const formattedDate = today.toLocaleDateString('en-US', options);
        
        dateElement.innerText = formattedDate;
    }
}

// Run the function when the page loads
window.addEventListener('load', setTodayDate);