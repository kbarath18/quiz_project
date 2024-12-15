const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const scoreElement = document.getElementById('score');
const nextButton = document.getElementById('next-button');

let currentScore = 0; // Correct answers count
let questionCount = 0; // Total questions asked
const totalQuestions = 10;

// Fetch and display a new question
async function fetchQuestion() {
    try {
        // Fetching general knowledge questions (category 9)
        const response = await fetch('https://opentdb.com/api.php?amount=1&category=9&type=multiple');
        if (!response.ok) throw new Error('Failed to fetch question.');
        
        const data = await response.json();
        const questionData = data.results[0];

        displayQuestion(questionData);
    } catch (error) {
        console.error('Error fetching the question:', error);
        questionElement.textContent = 'Failed to load question. Please check your connection and try again.';
        optionsElement.innerHTML = '';
        nextButton.textContent = 'Retry';
        nextButton.disabled = false;
        nextButton.onclick = fetchQuestion;
    }
}

// Decode HTML entities into readable characters
function decodeHTML(html) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = html;
    return textArea.value;
}

// Display the question and options
function displayQuestion(questionData) {
    // Decode the question text
    questionElement.textContent = decodeHTML(questionData.question);

    // Combine and shuffle all options
    const allOptions = [
        ...questionData.incorrect_answers.map(decodeHTML), // Decode incorrect answers
        decodeHTML(questionData.correct_answer) // Decode correct answer
    ].sort(() => Math.random() - 0.5);

    optionsElement.innerHTML = '';
    allOptions.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.addEventListener('click', () => handleAnswer(button, option, decodeHTML(questionData.correct_answer)));
        optionsElement.appendChild(button);
    });

    nextButton.textContent = 'Next Question';
    nextButton.disabled = true;
    nextButton.onclick = handleNextQuestion;

    updateScoreDisplay();
}

// Handle answer selection
function handleAnswer(button, selectedAnswer, correctAnswer) {
    if (selectedAnswer === correctAnswer) {
        button.classList.add('correct');
        currentScore++;
    } else {
        button.classList.add('wrong');
    }

    Array.from(optionsElement.children).forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === correctAnswer) {
            btn.classList.add('correct');
        }
    });

    nextButton.disabled = false;
}

// Move to the next question
function handleNextQuestion() {
    if (questionCount < totalQuestions) {
        questionCount++;
        updateScoreDisplay();
        fetchQuestion();
    } else {
        endQuiz();
    }
}

// Update the score display
function updateScoreDisplay() {
    scoreElement.textContent = `Score: ${currentScore}/${questionCount}`;
}

// End the quiz and display the final score
function endQuiz() {
    questionElement.textContent = 'Quiz Completed!';
    optionsElement.innerHTML = '';
    nextButton.style.display = 'none';
    scoreElement.textContent = `Final Score: ${currentScore}/${totalQuestions}`;
}

// Start the quiz
fetchQuestion();
