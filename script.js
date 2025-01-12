"use strict";

// DOM Elemente
const toggleBtn = document.querySelector('.toggle_btn');
const toggleBtnIcon = document.querySelector('.toggle_btn .material-symbols-outlined');
const dropdownMenu = document.querySelector('.dropdown_menu');
const header = document.querySelector('header');

// Initialer Check für Scroll-Position
function checkScroll() {
    if (window.scrollY > 0) {
        header.classList.add('scrolled');
        if (dropdownMenu.classList.contains('open')) {
            dropdownMenu.classList.add('scrolled');
        }
    } else {
        header.classList.remove('scrolled');
        dropdownMenu.classList.remove('scrolled');
    }
}

// Führe den Check direkt beim Laden der Seite aus
checkScroll();

// Scroll Event Handler - unabhängig vom Toggle Button
window.addEventListener('scroll', checkScroll);

// Smooth Scroll für alle Links mit href="#..."
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            const headerOffset = header.offsetHeight;
            const elementPosition = targetSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Schließe das Dropdown-Menü nach der Navigation
            dropdownMenu.classList.remove('open');
        }
    });
});

// Toggle Button Click Handler
toggleBtn.onclick = function(e) {
    e.stopPropagation();
    dropdownMenu.classList.toggle('open');
    // Check Scroll-Status direkt nach dem Öffnen
    checkScroll();
};

// Click Outside Handler
document.addEventListener('click', (e) => {
    if (!dropdownMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
        dropdownMenu.classList.remove('open');
    }
});

// Verhindert, dass Klicks innerhalb des Menüs es schließen
dropdownMenu.addEventListener('click', (e) => {
    e.stopPropagation();
});

const privacyCheckbox = document.getElementById('privacy');
const submitButton = document.querySelector('.submit-btn');

privacyCheckbox.addEventListener('change', function() {
    submitButton.disabled = !this.checked;
});

// Formular-Handler
const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        try {
            const response = await fetch(this.action, {
                method: 'POST',
                body: new FormData(this),
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Formular ausblenden mit Animation
                contactForm.style.opacity = '0';
                contactForm.style.transition = 'opacity 0.5s ease';
                
                // Nach der Animation Formular verstecken und Erfolgsmeldung zeigen
                setTimeout(() => {
                    contactForm.style.display = 'none';
                    successMessage.style.display = 'block';
                    // Kurze Verzögerung für die Animation
                    setTimeout(() => {
                        successMessage.classList.add('show');
                    }, 50);
                }, 500);
            } else {
                throw new Error('Fehler beim Senden');
            }
        } catch (error) {
            console.error('Fehler:', error);
            alert('Es gab einen Fehler beim Senden Ihrer Nachricht. Bitte versuchen Sie es später erneut.');
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const buyButton = document.getElementById('buyButton');
    const paypalContainer = document.getElementById('paypal-button-container');
    
    // PayPal Button initialisieren
    paypal.Buttons({
        style: {
            layout: 'vertical',
            color:  'gold',
            shape:  'pill',
            label:  'pay'
        },
        
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: '89.99',
                        currency_code: 'EUR'
                    },
                    description: 'Elegance Parfum'
                }]
            });
        },
        
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                // Erfolgreiche Zahlung
                alert('Transaktion erfolgreich! Danke für Ihren Einkauf, ' + details.payer.name.given_name);
            });
        },
        
        onError: function(err) {
            console.error('PayPal Fehler:', err);
            alert('Es gab einen Fehler bei der Zahlung. Bitte versuchen Sie es später erneut.');
        }
    }).render('#paypal-button-container');
    
    // PayPal Button Container initial ausblenden
    paypalContainer.style.display = 'none';
    
    // Event Listener für den Kauf-Button
    buyButton.addEventListener('click', function() {
        paypalContainer.style.display = 'block';
        buyButton.style.display = 'none';
    });
});