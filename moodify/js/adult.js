var slideIndex = 0;
showSlides();


//pics sliding
function showSlides() {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}
  slides[slideIndex-1].style.display = "block";
  setTimeout(showSlides, 5000); // Change image every 5 seconds
}



 // Questions database
        const questions = [
            {
                question: "How often have you felt down, depressed, or hopeless in the past week?",
                options: [
                    "Not at all",
                    "Several days",
                    "More than half the days",
                    "Nearly every day"
                ],
                category: "depression"
            },
            {
                question: "How often have you felt nervous, anxious, or on edge in the past week?",
                options: [
                    "Not at all",
                    "Several days",
                    "More than half the days",
                    "Nearly every day"
                ],
                category: "anxiety"
            },
            {
                question: "How often have you had little interest or pleasure in doing things you usually enjoy?",
                options: [
                    "Not at all",
                    "Several days",
                    "More than half the days",
                    "Nearly every day"
                ],
                category: "depression"
            },
            {
                question: "How often have you had trouble falling or staying asleep, or sleeping too much?",
                options: [
                    "Not at all",
                    "Several days",
                    "More than half the days",
                    "Nearly every day"
                ],
                category: "sleep"
            },
            {
                question: "How often have you felt tired or had little energy in the past week?",
                options: [
                    "Not at all",
                    "Several days",
                    "More than half the days",
                    "Nearly every day"
                ],
                category: "energy"
            },
            {
                question: "How often have you had poor appetite or overeaten in the past week?",
                options: [
                    "Not at all",
                    "Several days",
                    "More than half the days",
                    "Nearly every day"
                ],
                category: "appetite"
            },
            {
                question: "How often have you felt bad about yourself — or that you're a failure or have let yourself or your family down?",
                options: [
                    "Not at all",
                    "Several days",
                    "More than half the days",
                    "Nearly every day"
                ],
                category: "self-esteem"
            },
            {
                question: "How often have you felt little interest or pleasure in doing things in the past week?",
                options: [
                    "Not at all",
                    "Several days",
                    "More than half the days",
                    "Nearly every day"
                ],
                category: "concentration"
            },
            {
                question: "How often have you been moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual?",
                options: [
                    "Not at all",
                    "Several days",
                    "More than half the days",
                    "Nearly every day"
                ],
                category: "activity"
            },
            {
                question: "How often have you had thoughts that you would be better off dead or of hurting yourself in some way?",
                options: [
                    "Not at all",
                    "Several days",
                    "More than half the days",
                    "Nearly every day"
                ],
                category: "suicidal"
            }
        ];

        // DOM elements
        const quizSection = document.getElementById('quiz-section');
        const moodSection = document.getElementById('mood-section');
        const historySection = document.getElementById('history-section');
        const questionContainer = document.getElementById('question-container');
        const nextBtn = document.getElementById('next-btn');
        const resultCard = document.getElementById('result-card');
        const resultMessage = document.getElementById('result-message');
        const resourcesContainer = document.getElementById('resources');
        const restartBtn = document.getElementById('restart-btn');
        const progressBar = document.getElementById('progress-bar');
        const moodOptions = document.querySelectorAll('.mood-option');
        const saveMoodBtn = document.getElementById('save-mood-btn');
        const moodResultCard = document.getElementById('mood-result-card');
        const moodResultMessage = document.getElementById('mood-result-message');
        const trackAnotherBtn = document.getElementById('track-another-btn');
        const historyItems = document.getElementById('history-items');
        const noHistoryMessage = document.getElementById('no-history-message');
        const tabs = document.querySelectorAll('.tab');

        // State variables
        let currentQuestionIndex = 0;
        let selectedQuestions = [];
        let answers = [];
        let selectedMood = null;
        let history = JSON.parse(localStorage.getItem('mentalHealthHistory')) || [];

        // Tab switching
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                const tabName = tab.getAttribute('data-tab');
                quizSection.classList.add('hidden');
                moodSection.classList.add('hidden');
                historySection.classList.add('hidden');
                
                if (tabName === 'quiz') {
                    quizSection.classList.remove('hidden');
                } else if (tabName === 'mood') {
                    moodSection.classList.remove('hidden');
                } else if (tabName === 'history') {
                    historySection.classList.remove('hidden');
                    loadHistory();
                }
            });
        });

        // Initialize quiz
        function initQuiz() {
            // Select 5 random questions
            selectedQuestions = [...questions]
                .sort(() => 0.5 - Math.random())
                .slice(0, 5);
            
            currentQuestionIndex = 0;
            answers = [];
            showQuestion();
        }

        // Show current question
        function showQuestion() {
            const question = selectedQuestions[currentQuestionIndex];
            progressBar.style.width = `${(currentQuestionIndex / selectedQuestions.length) * 100}%`;
            
            questionContainer.innerHTML = `
                <div class="question">
                    <div class="question-text">${question.question}</div>
                    <div class="options">
                        ${question.options.map((option, index) => `
                            <label class="option ${answers[currentQuestionIndex] === index ? 'selected' : ''}">
                                <input type="radio" name="answer" value="${index}" ${answers[currentQuestionIndex] === index ? 'checked' : ''}>
                                ${option}
                            </label>
                        `).join('')}
                    </div>
                </div>
            `;
            
            // Add event listeners to options
            document.querySelectorAll('.option').forEach(option => {
                option.addEventListener('click', function() {
                    document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
                    this.classList.add('selected');
                    const radio = this.querySelector('input');
                    radio.checked = true;
                });
            });
            
            // Update next button text
            nextBtn.textContent = currentQuestionIndex === selectedQuestions.length - 1 ? 'See Results' : 'Next Question';
        }

        // Show results
        function showResults() {
            quizCard.classList.add('hidden');
            resultCard.classList.remove('hidden');
            
            // Calculate scores by category
            const categoryScores = {};
            selectedQuestions.forEach((question, index) => {
                if (!categoryScores[question.category]) {
                    categoryScores[question.category] = 0;
                }
                categoryScores[question.category] += answers[index];
            });
            
            // Generate result message
            let message = "Based on your answers:\n\n";
            let concerns = [];
            
            if (categoryScores.depression >= 6) {
                concerns.push("You're showing signs of depression");
            }
            if (categoryScores.anxiety >= 6) {
                concerns.push("You're showing signs of anxiety");
            }
            if (categoryScores.suicidal > 0) {
                concerns.push("You mentioned thoughts about self-harm");
            }
            
            if (concerns.length > 0) {
                message += `⚠️ ${concerns.join(', ')}. It might be helpful to talk to someone about how you're feeling.\n\n`;
            } else {
                message += "Your responses don't indicate significant mental health concerns. Keep taking care of your mental health!\n\n";
            }
            
            // Add general advice
            message += "Remember that everyone has ups and downs. If you're struggling, consider:\n";
            message += "- Talking to a trusted friend or adult\n";
            message += "- Practicing self-care activities\n";
            message += "- Getting enough sleep and exercise\n";
            
            resultMessage.innerHTML = message.replace(/\n/g, '<br>');
            
            
            // Save to history
            const historyItem = {
                type: 'quiz',
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString(),
                scores: categoryScores,
                concerns: concerns
            };
            
            history.unshift(historyItem);
            localStorage.setItem('mentalHealthHistory', JSON.stringify(history));
        }

        function addResource(title, description, icon) {
            const resource = document.createElement('div');
            resource.className = 'resource-item';
            resource.innerHTML = `
                <i class="${icon} resource-icon"></i>
                <div>
                    <h4>${title}</h4>
                    <p>${description}</p>
                </div>
            `;
            resourcesContainer.appendChild(resource);
        }

        // Mood tracker functionality
        moodOptions.forEach(option => {
            option.addEventListener('click', function() {
                moodOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                selectedMood = parseInt(this.getAttribute('data-mood'));
            });
        });

        // Save mood
        saveMoodBtn.addEventListener('click', function() {
            if (!selectedMood) {
                alert('Please select how you feel today');
                return;
            }
            
            const moodNote = document.getElementById('mood-note').value;
            const moodText = ['Very Bad', 'Bad', 'Neutral', 'Good', 'Great'][selectedMood - 1];
            
            // Save to history
            const historyItem = {
                type: 'mood',
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString(),
                mood: selectedMood,
                note: moodNote
            };
            
            history.unshift(historyItem);
            localStorage.setItem('mentalHealthHistory', JSON.stringify(history));
            
            // Show result
            moodResultMessage.textContent = `You reported feeling ${moodText} today. ${moodNote ? 'Your note: ' + moodNote : ''}`;
            document.querySelector('.card').classList.add('hidden');
            moodResultCard.classList.remove('hidden');
            
            // Reset form
            document.getElementById('mood-note').value = '';
            selectedMood = null;
        });

        // Track another mood
        trackAnotherBtn.addEventListener('click', function() {
            moodResultCard.classList.add('hidden');
            document.querySelector('.card').classList.remove('hidden');
            moodOptions.forEach(opt => opt.classList.remove('selected'));
        });

        // Next question button
        nextBtn.addEventListener('click', function() {
            const selectedOption = document.querySelector('input[name="answer"]:checked');
            
            if (!selectedOption) {
                alert('Please select an answer');
                return;
            }
            
            answers[currentQuestionIndex] = parseInt(selectedOption.value);
            
            if (currentQuestionIndex < selectedQuestions.length - 1) {
                currentQuestionIndex++;
                showQuestion();
            } else {
                showResults();
            }
        });

        // Restart quiz
        restartBtn.addEventListener('click', function() {
            resultCard.classList.add('hidden');
            quizCard.classList.remove('hidden');
            initQuiz();
        });

        // Load history
        function loadHistory() {
            historyItems.innerHTML = '';
            
            if (history.length === 0) {
                noHistoryMessage.style.display = 'block';
                return;
            }
            
            noHistoryMessage.style.display = 'none';
            
            history.forEach(item => {
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                
                if (item.type === 'quiz') {
                    historyItem.innerHTML = `
                        <div class="history-date">${item.date} at ${item.time}</div>
                        <div>
                            <span class="history-mood" style="background-color: #e0f7fa;">Quiz Completed</span>
                            ${item.concerns.length > 0 ? 
                                `<span class="history-mood" style="background-color: #ffebee; color: #c62828;">${item.concerns.join(', ')}</span>` : 
                                '<span class="history-mood" style="background-color: #e8f5e9; color: #2e7d32;">No significant concerns</span>'}
                        </div>
                    `;
                } else {
                    const moodColors = ['#ffcdd2', '#ffcc80', '#fff59d', '#c8e6c9', '#81c784'];
                    const moodText = ['Very Bad', 'Bad', 'Neutral', 'Good', 'Great'][item.mood - 1];
                    
                    historyItem.innerHTML = `
                        <div class="history-date">${item.date} at ${item.time}</div>
                        <div>
                            <span class="history-mood" style="background-color: ${moodColors[item.mood - 1]};">${moodText}</span>
                            ${item.note ? `<p>${item.note}</p>` : ''}
                        </div>
                    `;
                }
                
                historyItems.appendChild(historyItem);
            });
        }

        // Initialize
        const quizCard = document.getElementById('quiz-card');
        initQuiz();