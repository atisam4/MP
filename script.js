// Navigation
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Update active navigation link on scroll
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 60) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
});

// Modal Management
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function hideModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close button functionality for all modals
document.querySelectorAll('.close-btn').forEach(btn => {
    btn.onclick = function() {
        const modal = this.closest('.modal');
        hideModal(modal.id);
    };
});

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        hideModal(event.target.id);
    }
}

// Get Started Button
document.getElementById("get-started-btn").onclick = function() {
    showModal('login-section');
};

// Login Options
document.getElementById("google-login").onclick = function() {
    // Google Login Implementation
    alert("Google login will be implemented here");
    hideModal('login-section');
    showModal('application-section');
};

document.getElementById("fb-login").onclick = function() {
    // Facebook Login Implementation
    alert("Facebook login will be implemented here");
    hideModal('login-section');
    showModal('application-section');
};

// Login Form
document.getElementById("login-form").onsubmit = function(e) {
    e.preventDefault();
    // Add login validation here
    hideModal('login-section');
    showModal('application-section');
};

// Application Form
document.getElementById("application-form").onsubmit = function(event) {
    event.preventDefault();
    
    // Form Validation
    const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        position: document.getElementById("position").value,
        message: document.getElementById("message").value
    };

    // File handling for resume
    const resumeFile = document.getElementById("resume").files[0];
    if (resumeFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            formData.resume = e.target.result;
            submitApplication(formData);
        };
        reader.readAsDataURL(resumeFile);
    } else {
        submitApplication(formData);
    }
};

function submitApplication(formData) {
    // Here you would typically send the data to your server
    console.log("Submitting application:", formData);
    alert("Thank you for your application! We will contact you soon.");
    
    // Reset form and close modal
    document.getElementById("application-form").reset();
    hideModal('application-section');
}

// Contact Form
document.getElementById("contact-form").onsubmit = function(e) {
    e.preventDefault();
    const name = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const message = this.querySelector('textarea').value;

    // Here you would typically send the contact form data to your server
    console.log("Contact form submission:", { name, email, message });
    alert("Thank you for your message! We will get back to you soon.");
    
    this.reset();
};
