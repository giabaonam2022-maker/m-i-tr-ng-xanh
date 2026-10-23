/**
 * mt.js - EcoShield Master Interactive Engine
 * Modular client-side functionality handling navigation, dark mode, counters,
 * solution filters, live swap search, interactive quiz, carbon calculator, FAQ accordions, and pledges.
 */

document.addEventListener('DOMContentLoaded', () => {
    Navigation.init();
    ThemeManager.init();
    StatsCounter.init();
    ActionFilter.init();
    SwapSearch.init();
    EcoQuiz.init();
    Calculator.init();
    FaqAccordion.init();
    PledgeForm.init();
});

/**
 * Navigation Module
 */
const Navigation = (() => {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    const navbar = document.getElementById('navbar');

    const init = () => {
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.className = navLinks.classList.contains('active') ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
            });
        }

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                if (mobileMenuBtn) {
                    mobileMenuBtn.querySelector('i').className = 'fa-solid fa-bars';
                }
            });
        });

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            } else {
                navbar.style.boxShadow = 'none';
            }
        });
    };

    return { init };
})();

/**
 * Theme Manager Module
 */
const ThemeManager = (() => {
    const themeToggleBtn = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('ecoshield_theme') || 'light';

    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        if (themeToggleBtn) {
            const icon = themeToggleBtn.querySelector('i');
            icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        }
    };

    const init = () => {
        applyTheme(currentTheme);
        if (themeToggleBtn) {
            themeToggleBtn.addEventListener('click', () => {
                const activeTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
                localStorage.setItem('ecoshield_theme', newTheme);
                applyTheme(newTheme);
                Toast.show(`Switched to ${newTheme} mode`);
            });
        }
    };

    return { init };
})();

/**
 * Stats Counter Module
 */
const StatsCounter = (() => {
    const counters = document.querySelectorAll('.counter');
    let animated = false;

    const startCounting = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000;
            const stepTime = 20;
            const steps = duration / stepTime;
            const increment = target / steps;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.innerText = target.toLocaleString();
                    clearInterval(timer);
                } else {
                    counter.innerText = Math.ceil(current).toLocaleString();
                }
            }, stepTime);
        });
    };

    const init = () => {
        window.addEventListener('scroll', () => {
            if (!animated && window.scrollY < 700) {
                startCounting();
                animated = true;
            }
        });
        startCounting();
        animated = true;
    };

    return { init };
})();

/**
 * Action Filter Module
 */
const ActionFilter = (() => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const actionCards = document.querySelectorAll('.action-card');

    const init = () => {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                actionCards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    };

    return { init };
})();

/**
 * Eco-Swaps Search Module
 */
const SwapSearch = (() => {
    const searchInput = document.getElementById('swapSearchInput');
    const swapCards = document.querySelectorAll('.swap-card');

    const init = () => {
        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();

            swapCards.forEach(card => {
                const keywords = card.getAttribute('data-keywords') || '';
                const text = card.innerText.toLowerCase();

                if (keywords.includes(query) || text.includes(query) || query === '') {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    };

    return { init };
})();

/**
 * Interactive Eco-Quiz Module
 */
const EcoQuiz = (() => {
    const quizData = [
        {
            q: "What is the primary greenhouse gas driving anthropogenic global warming?",
            options: ["Nitrous Oxide", "Carbon Dioxide (CO2)", "Chlorofluorocarbons", "Ozone"],
            correctIndex: 1
        },
        {
            q: "Approximately how much plastic waste enters global oceans annually?",
            options: ["1 million metric tons", "4 million metric tons", "Over 8 million metric tons", "50,000 metric tons"],
            correctIndex: 2
        },
        {
            q: "Which renewable energy source accounts for the fastest capacity growth worldwide?",
            options: ["Geothermal Power", "Solar Photovoltaics", "Tidal Barrages", "Coal Gasification"],
            correctIndex: 1
        },
        {
            q: "What does practicing a 'circular economy' primarily seek to eliminate?",
            options: ["Manufacturing jobs", "Linear waste and resource depletion", "All transportation", "International trade"],
            correctIndex: 1
        }
    ];

    let currentQuestion = 0;
    let score = 0;

    const currentQNum = document.getElementById('currentQNum');
    const quizQuestionTitle = document.getElementById('quizQuestionTitle');
    const quizOptions = document.getElementById('quizOptions');
    const quizQuestionBox = document.getElementById('quizQuestionBox');
    const quizResultBox = document.getElementById('quizResultBox');
    const finalScore = document.getElementById('finalScore');
    const restartQuizBtn = document.getElementById('restartQuizBtn');

    const loadQuestion = () => {
        if (currentQuestion >= quizData.length) {
            quizQuestionBox.classList.add('hidden');
            quizResultBox.classList.remove('hidden');
            finalScore.innerText = score;
            return;
        }

        const data = quizData[currentQuestion];
        currentQNum.innerText = currentQuestion + 1;
        quizQuestionTitle.innerText = data.q;
        quizOptions.innerHTML = '';

        data.options.forEach((opt, index) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn';
            btn.innerText = opt;
            btn.addEventListener('click', () => {
                if (index === data.correctIndex) {
                    score++;
                    Toast.show('Correct answer!');
                } else {
                    Toast.show('Incorrect answer.');
                }
                currentQuestion++;
                loadQuestion();
            });
            quizOptions.appendChild(btn);
        });
    };

    const init = () => {
        if (!quizQuestionBox) return;
        loadQuestion();

        if (restartQuizBtn) {
            restartQuizBtn.addEventListener('click', () => {
                currentQuestion = 0;
                score = 0;
                quizResultBox.classList.add('hidden');
                quizQuestionBox.classList.remove('hidden');
                loadQuestion();
                Toast.show('Quiz restarted!');
            });
        }
    };

    return { init };
})();

/**
 * Carbon Footprint Calculator Module
 */
const Calculator = (() => {
    const form = document.getElementById('footprintForm');
    const resultBox = document.getElementById('calcResult');
    const co2ValueSpan = document.getElementById('co2Value');
    const resultAdvice = document.getElementById('resultAdvice');

    const init = () => {
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const transport = parseFloat(document.getElementById('transportMethod').value) || 0;
            const diet = parseFloat(document.getElementById('dietChoice').value) || 0;
            const energy = parseFloat(document.getElementById('energyUsage').value) || 0;

            const totalCO2 = Math.round(transport + diet + (energy * 0.82));

            co2ValueSpan.innerText = totalCO2.toLocaleString();
            resultBox.classList.remove('hidden');

            if (totalCO2 < 350) {
                resultAdvice.innerText = 'Outstanding! Your estimated monthly emissions are exceptionally low. Keep inspiring others!';
            } else if (totalCO2 < 700) {
                resultAdvice.innerText = 'Moderate footprint. Consider scaling up renewable energy adoption and minimizing meat consumption.';
            } else {
                resultAdvice.innerText = 'High carbon footprint detected. Prioritize electric or public transit and household energy audits.';
            }

            Toast.show('Emission calculation updated!');
        });
    };

    return { init };
})();

/**
 * FAQ Accordion Module
 */
const FaqAccordion = (() => {
    const faqItems = document.querySelectorAll('.faq-item');

    const init = () => {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                faqItems.forEach(i => i.classList.remove('active'));
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    };

    return { init };
})();

/**
 * Pledge Form Submission Module
 */
const PledgeForm = (() => {
    const form = document.getElementById('pledgeForm');

    const init = () => {
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('pledgeName').value.trim();

            if (name) {
                Toast.show(`Thank you, ${name}! Your official climate pledge is registered.`);
                form.reset();
            }
        });
    };

    return { init };
})();

/**
 * Notification Toast Helper
 */
const Toast = (() => {
    const toastEl = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMessage');
    let timeoutId;

    const show = (message) => {
        if (!toastEl) return;
        toastMsg.innerText = message;
        toastEl.classList.remove('hidden');

        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            toastEl.classList.add('hidden');
        }, 3500);
    };

    return { show };
})();