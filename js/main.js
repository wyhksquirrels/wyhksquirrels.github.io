/**
 * Wah Yan Squirrel Protection Work Team - Global Unified Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Scroll Progress Bar & Navbar styling
    const progressBar = document.getElementById('progressBar');
    const navbar = document.getElementById('navbar');

    // --- Smooth Scrolling with Navbar Offset ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            // Allow standard links to other pages to pass through
            if (targetId === '#' || targetId.includes('.html')) return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 80; // Height of fixed navbar
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // --- Scroll Spy for Active Nav Links ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const handleScrollEffects = () => {
        const winScroll = window.scrollY || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        
        if (height > 0) {
            const scrolled = (winScroll / height) * 100;
            if(progressBar) progressBar.style.width = scrolled + '%';
        }

        // Scroll Spy Logic
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (winScroll >= (sectionTop - 150)) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            // Reset state
            link.classList.remove('text-green-700', 'font-bold');
            link.classList.add('text-slate-600');
            
            // Only apply active state if there is a match and we are not hardcoded elsewhere
            if (currentSection && link.getAttribute('href').includes(currentSection)) {
                link.classList.add('text-green-700', 'font-bold');
                link.classList.remove('text-slate-600');
            }
        });

        // Update Navbar Glassmorphism
        if (navbar) {
            if (winScroll > 50) {
                navbar.classList.add('scrolled');
                navbar.style.transform = 'translateY(0)';
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        
        // Parallax Hero Elements (Only applies to index.html text logic)
        const heroText = document.querySelector('.max-w-4xl.space-y-6');
        if(heroText && winScroll < window.innerHeight) {
            heroText.style.transform = `translateY(${winScroll * 0.3}px) scale(${1 - winScroll * 0.0005})`;
            heroText.style.opacity = 1 - (winScroll / window.innerHeight) * 1.5;
        }
    };

    window.addEventListener('scroll', handleScrollEffects);
    handleScrollEffects(); // Init on load

    // 2. Advanced Scroll Reveal & Staggered Animations
    const revealElements = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay based on index if multiple items appear at once
                setTimeout(() => {
                    entry.target.classList.add("active");
                }, index * 100);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    revealElements.forEach(el => observer.observe(el));

    // 3. Mobile Menu Toggle Overlay (With Staggered Entrance)
    const menuBtn = document.getElementById('menuBtn');
    
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            let mobileMenu = document.getElementById('mobileMenuOverlay');
            
            if (!mobileMenu) {
                mobileMenu = document.createElement('div');
                mobileMenu.id = 'mobileMenuOverlay';
                mobileMenu.className = 'fixed inset-0 bg-white/95 backdrop-blur-2xl z-[100] flex flex-col items-center justify-center space-y-8 text-slate-900 transition-all duration-500 opacity-0 pointer-events-none scale-110';
                
                const closeBtn = document.createElement('button');
                closeBtn.innerHTML = '<i class="fa-solid fa-xmark text-4xl hover:rotate-180 transition duration-500"></i>';
                closeBtn.className = 'absolute top-8 right-8 text-slate-800';
                
                const links = `
                    <a href="index.html" class="mobile-link text-5xl font-black hover:text-green-700 transition transform hover:scale-110 opacity-0 translate-y-8">Home</a>
                    <a href="knowledge.html" class="mobile-link text-5xl font-black hover:text-green-700 transition transform hover:scale-110 opacity-0 translate-y-8" style="transition-delay: 300ms">Information</a>
                    <a href="squirrelgo.html" class="mobile-link text-5xl font-black hover:text-green-700 transition transform hover:scale-110 opacity-0 translate-y-8" style="transition-delay: 300ms">Squirrel GO</a>
                    <a href="stcg.html" class="mobile-link text-5xl font-black hover:text-green-700 transition transform hover:scale-110 opacity-0 translate-y-8" style="transition-delay: 300ms">STCG</a>
                    <a href="news.html" class="mobile-link text-5xl font-black hover:text-green-700 transition transform hover:scale-110 opacity-0 translate-y-8" style="transition-delay: 300ms">Photos & News</a>
                `;
                
                mobileMenu.innerHTML = links;
                mobileMenu.appendChild(closeBtn);
                document.body.appendChild(mobileMenu);

                const closeMenu = () => {
                    mobileMenu.classList.add('opacity-0', 'pointer-events-none', 'scale-110');
                    mobileMenu.classList.remove('opacity-100', 'scale-100');
                    document.body.style.overflow = 'auto';
                    
                    document.querySelectorAll('.mobile-link').forEach(link => {
                        link.classList.add('opacity-0', 'translate-y-8');
                        link.classList.remove('opacity-100', 'translate-y-0');
                    });
                };

                closeBtn.addEventListener('click', closeMenu);
                mobileMenu.querySelectorAll('a').forEach(link => {
                    link.addEventListener('click', closeMenu);
                });
            }

            // Open menu
            mobileMenu.classList.remove('opacity-0', 'pointer-events-none', 'scale-110');
            mobileMenu.classList.add('opacity-100', 'scale-100');
            document.body.style.overflow = 'hidden';

            // Escape key to close mobile menu
            document.addEventListener('keydown', function escListener(e) {
                if (e.key === 'Escape') {
                    const closeBtn = mobileMenu.querySelector('button');
                    if(closeBtn) closeBtn.click();
                    document.removeEventListener('keydown', escListener);
                }
            });

            // Animate links in
            setTimeout(() => {
                document.querySelectorAll('.mobile-link').forEach(link => {
                    link.classList.remove('opacity-0', 'translate-y-8');
                    link.classList.add('opacity-100', 'translate-y-0');
                    link.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                });
            }, 100);
        });
    }

    // 4. Mapbox Initialization (Only if map element exists on page)
    if (document.getElementById('map') && typeof mapboxgl !== 'undefined') {
        mapboxgl.accessToken = 'pk.eyJ1IjoiaGF5ZGVuY2hldW5nZ2ciLCJhIjoiY21vNzZkemV0MDNxYjJwc2VtdmdxYnFweSJ9._H98zs88_wfAVlT_LODkqg'; 
        
        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [114.17607, 22.27422], 
            zoom: 16.5 
        });

        map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

        const markerEl = document.createElement('div');
        markerEl.className = 'w-10 h-10 bg-green-700 rounded-full flex items-center justify-center text-white shadow-xl border-2 border-white cursor-pointer';
        markerEl.innerHTML = '<i class="fa-solid fa-tree"></i>';

        const popup = new mapboxgl.Popup({ offset: 25, className: 'custom-popup' }).setHTML(
            `<div class="p-1">
                <h3 class="font-bold text-green-800 text-lg leading-tight mb-1">Wah Yan College</h3>
                <p class="text-sm text-slate-600">Mount Parish<br>281 Queen's Road East</p>
            </div>`
        );

        new mapboxgl.Marker({ element: markerEl })
            .setLngLat([114.17607, 22.27422]) // 22.27422° N, 114.17607° E
            .setPopup(popup)
            .addTo(map);
    }

    // 5. Accordion Initialization (Only applies to knowledge.html)
    const firstAccordion = document.querySelector('.accordion-button');
    if(firstAccordion) toggleAccordion(firstAccordion);

    // 6. Quiz Initialization (Only applies to knowledge.html)
    if(document.getElementById('quiz-container')) {
        loadQuiz();
    }
});

// --- Global Functions for Knowledge.html ---

// Accordion Logic
window.toggleAccordion = function(button) {
    const content = button.nextElementSibling;
    const item = button.parentElement;
    const isOpen = content.classList.contains('open');

    document.querySelectorAll('.accordion-content').forEach(el => {
        el.classList.remove('open');
        el.previousElementSibling.classList.remove('active');
        el.parentElement.classList.remove('active-item');
    });

    if (!isOpen) {
        content.classList.add('open');
        button.classList.add('active');
        item.classList.add('active-item');
    }
}

// Quiz Data & State
const quizData = [
    {
        question: "What is a squirrel's leafy nest called?",
        options: ["Burrow", "Drey", "Lodge", "Hive"],
        correct: 1
    },
    {
        question: "What do we call a baby squirrel?",
        options: ["Cub", "Pup/Kitten", "Joey", "Fawn"],
        correct: 1
    },
    {
        question: "Why are squirrels known as 'nature's gardeners'?",
        options: ["They eat harmful weeds", "They chase away pests", "They forget buried seeds, planting trees", "They build nests in branches"],
        correct: 2
    },
    {
        question: "Which of the following should you NOT feed a squirrel?",
        options: ["Unsalted nuts", "Apples", "Processed human snacks", "Seeds"],
        correct: 2
    }
];

let currentQuestionIndex = 0;
let score = 0;

window.loadQuiz = function() {
    const container = document.getElementById('quiz-container');
    
    if (currentQuestionIndex >= quizData.length) {
        showResults(container);
        return;
    }

    const q = quizData[currentQuestionIndex];
    const progressPct = ((currentQuestionIndex) / quizData.length) * 100;
    
    let optionsHtml = '';
    q.options.forEach((opt, index) => {
        optionsHtml += `
            <button class="w-full text-left p-4 rounded-xl border-2 border-slate-100 hover:border-orange-400 hover:bg-orange-50 hover:shadow-md transform hover:-translate-y-1 transition-all font-medium text-slate-700 mb-4 group focus:outline-none" onclick="checkAnswer(${index}, this)">
                <span class="inline-block w-8 h-8 text-center leading-8 rounded-lg bg-slate-100 text-slate-500 mr-3 group-hover:bg-orange-500 group-hover:text-white transition-colors font-bold shadow-sm">${String.fromCharCode(65 + index)}</span>
                ${opt}
            </button>`;
    });

    container.innerHTML = `
        <div class="absolute top-0 left-0 w-full h-1.5 bg-slate-100">
            <div class="h-full bg-orange-500 transition-all duration-500 ease-out" style="width: ${progressPct}%"></div>
        </div>
        
        <div class="mt-2 mb-6 flex justify-between items-center text-sm font-bold text-slate-400 uppercase tracking-widest">
            <span class="bg-slate-100 px-3 py-1 rounded-full text-slate-500">Question ${currentQuestionIndex + 1} of ${quizData.length}</span>
            <span>Score: <span class="text-orange-500 text-lg">${score}</span></span>
        </div>
        
        <h3 class="text-2xl md:text-3xl font-bold text-slate-800 mb-8 leading-tight animate-[fadeIn_0.3s_ease-out]">${q.question}</h3>
        
        <div class="space-y-1 animate-[fadeIn_0.5s_ease-out]" id="options-container">
            ${optionsHtml}
        </div>
        
        <div class="mt-8 text-right hidden" id="next-btn-container">
            <button onclick="nextQuestion()" class="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ring-4 ring-orange-500/20">
                Next Question <i class="fa-solid fa-arrow-right ml-2 animate-bounce"></i>
            </button>
        </div>
    `;
}

window.checkAnswer = function(selectedIndex, btnElement) {
    const correctIndex = quizData[currentQuestionIndex].correct;
    const buttons = document.querySelectorAll('#options-container button');

    buttons.forEach(btn => {
        btn.disabled = true;
        btn.classList.remove('hover:border-orange-400', 'hover:bg-orange-50', 'hover:-translate-y-1', 'hover:shadow-md');
    });

    if (selectedIndex === correctIndex) {
        btnElement.classList.replace('border-slate-100', 'border-green-500');
        btnElement.classList.add('bg-green-50', 'text-green-800', 'ring-4', 'ring-green-500/20');
        btnElement.innerHTML += ' <i class="fa-solid fa-circle-check float-right text-green-500 text-2xl mt-1 animate-[fadeIn_0.3s_ease-out]"></i>';
        score++;
        
        const scoreSpan = document.querySelector('.text-orange-500.text-lg');
        scoreSpan.innerHTML = score;
        scoreSpan.classList.add('scale-150', 'text-green-500');
        scoreSpan.style.transition = 'all 0.3s';
        setTimeout(() => scoreSpan.classList.remove('scale-150', 'text-green-500'), 300);

    } else {
        btnElement.classList.replace('border-slate-100', 'border-red-500');
        btnElement.classList.add('bg-red-50', 'text-red-800');
        btnElement.innerHTML += ' <i class="fa-solid fa-circle-xmark float-right text-red-500 text-2xl mt-1 animate-[fadeIn_0.3s_ease-out]"></i>';
        btnElement.classList.add('animate-[wiggle_0.3s_ease-in-out]');

        const correctBtn = buttons[correctIndex];
        correctBtn.classList.replace('border-slate-100', 'border-green-500');
        correctBtn.classList.add('bg-green-50', 'text-green-800');
        correctBtn.innerHTML += ' <i class="fa-solid fa-circle-check float-right text-green-500 text-2xl mt-1"></i>';
    }

    const nextBtn = document.getElementById('next-btn-container');
    nextBtn.classList.remove('hidden');
    nextBtn.classList.add('animate-[fadeIn_0.5s_ease-out]');
}

window.nextQuestion = function() {
    currentQuestionIndex++;
    loadQuiz();
}

window.showResults = function(container) {
    let message = "";
    let icon = "";
    if (score === quizData.length) {
        message = "Perfect! You are a true Squirrel Expert! 🏆";
        icon = "fa-trophy text-yellow-500 drop-shadow-lg";
    } else if (score >= quizData.length / 2) {
        message = "Great job! You know a lot about our furry friends! 🐿️";
        icon = "fa-star text-orange-500 drop-shadow-lg";
    } else {
        message = "Good try! Review the facts above and try again! 📚";
        icon = "fa-book-open text-blue-500 drop-shadow-lg";
    }

    container.innerHTML = `
        <div class="absolute top-0 left-0 w-full h-1.5 bg-orange-500"></div>
        
        <div class="text-center py-8 animate-[fadeIn_0.8s_ease-out]">
            <div class="inline-flex p-8 bg-slate-50 rounded-full mb-8 shadow-inner relative">
                <div class="absolute inset-0 border-4 border-dashed border-slate-200 rounded-full animate-[spin_10s_linear_infinite]"></div>
                <i class="fa-solid ${icon} text-7xl relative z-10 animate-bounce"></i>
            </div>
            <h3 class="text-4xl font-bold text-slate-800 mb-4">Quiz Completed!</h3>
            <p class="text-xl text-slate-600 mb-6">You scored <span class="font-black text-orange-600 text-3xl">${score}</span> out of <span class="font-bold text-slate-900 text-2xl">${quizData.length}</span>.</p>
            <p class="text-xl font-medium text-slate-700 mb-12 bg-orange-50 inline-block px-6 py-3 rounded-2xl border border-orange-100">${message}</p>
            <br>
            <button onclick="restartQuiz()" class="bg-slate-900 text-white px-10 py-4 rounded-full font-bold shadow-xl hover:bg-slate-800 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <i class="fa-solid fa-rotate-right mr-2"></i> Retake Quiz
            </button>
        </div>
    `;
}

window.restartQuiz = function() {
    currentQuestionIndex = 0;
    score = 0;
    loadQuiz();
}