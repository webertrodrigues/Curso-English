// Configuração do Quiz
const quizConfig = {
    totalQuestions: 6,
    correctAnswers: {
        q1: 'a', // Doctor
        q2: 'a', // Enfermeiro(a)
        q3: 'a', // What do you do for a living?
        q4: 'b', // Doctor
        q5: 'a', // Programmer
        q6: 'b'  // School
    },
    explanations: {
        q1: {
            correct: 'Correto! "Doctor" significa médico em inglês.',
            incorrect: 'Errado! "Doctor" é a palavra correta para médico.'
        },
        q2: {
            correct: 'Correto! "Nurse" significa enfermeiro(a) em português.',
            incorrect: 'Errado! "Nurse" significa enfermeiro(a), não professor(a) ou advogado(a).'
        },
        q3: {
            correct: 'Correto! "What do you do for a living?" é como perguntar sobre a profissão.',
            incorrect: 'Errado! "What do you do for a living?" é a pergunta correta sobre profissão.'
        },
        q4: {
            correct: 'Correto! "Doctor" trabalha em hospital.',
            incorrect: 'Errado! "Doctor" é a profissão que trabalha em hospital.'
        },
        q5: {
            correct: 'Correto! "Programmer" significa programador em inglês.',
            incorrect: 'Errado! "Programmer" é a palavra correta para programador.'
        },
        q6: {
            correct: 'Correto! "Teacher" trabalha na escola (School).',
            incorrect: 'Errado! "Teacher" trabalha na escola, não no hospital ou restaurante.'
        }
    }
};

// Variáveis para o diálogo
let currentDialogueLine = 0;
let isPlaying = false;
let dialogueTimeout;

const dialogueLines = [
    "Hi, Alex! How are you?",
    "I'm great, Sarah! And you? What do you do for a living now?",
    "I'm a software engineer at a tech company. It's challenging but very rewarding.",
    "That sounds interesting! I'm a nurse at the city hospital. I love helping people.",
    "That's wonderful! Do you work long hours?",
    "Sometimes, especially during emergencies. But it's worth it."
];

// Função para falar palavras
function speakWord(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
}

// Funções para controlar os modais
function openQuizModal() {
    document.getElementById('quizModal').style.display = 'flex';
    document.getElementById('quizForm').reset();
    document.body.classList.add('modal-open');
}

function closeQuizModal() {
    document.getElementById('quizModal').style.display = 'none';
    document.body.classList.remove('modal-open');
}

function openResultModal() {
    document.getElementById('resultModal').style.display = 'flex';
    document.body.classList.add('modal-open');
}

function closeResultModal() {
    document.getElementById('resultModal').style.display = 'none';
    document.body.classList.remove('modal-open');
}

// Função para verificar respostas do quiz
function checkQuiz() {
    let score = 0;
    const results = [];
    const form = document.getElementById('quizForm');
    
    for (let i = 1; i <= quizConfig.totalQuestions; i++) {
        const questionName = `q${i}`;
        const selectedOption = form.querySelector(`input[name="${questionName}"]:checked`)?.value;
        const isCorrect = selectedOption === quizConfig.correctAnswers[questionName];
        
        if (isCorrect) score++;
        
        results.push({
            question: i,
            isCorrect,
            explanation: isCorrect 
                ? quizConfig.explanations[questionName].correct
                : quizConfig.explanations[questionName].incorrect
        });
    }
    
    showResults(score, results);
}

// Função para mostrar resultados
function showResults(score, results) {
    const scoreElement = document.getElementById('scoreText');
    const resultsContainer = document.getElementById('quizResults');
    
    scoreElement.innerHTML = `
        Você acertou <span class="text-wine font-bold">${score}/${quizConfig.totalQuestions}</span> questões!
        <p class="font-baskerville text-lg mt-2 text-navy">${getScoreMessage(score, quizConfig.totalQuestions)}</p>
    `;
    
    resultsContainer.innerHTML = results.map(result => `
        <div class="p-4 rounded-lg ${result.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'} mb-3">
            <p class="font-baskerville font-bold ${result.isCorrect ? 'text-green-800' : 'text-red-800'}">
                Questão ${result.question}: ${result.isCorrect ? '✅ Acertou!' : '❌ Errou'}
            </p>
            <p class="font-baskerville mt-2 text-navy">${result.explanation}</p>
        </div>
    `).join('');
    
    closeQuizModal();
    openResultModal();
}

// Função para mensagem de pontuação
function getScoreMessage(score, total) {
    const percentage = (score / total) * 100;
    
    if (percentage >= 90) return '🏆 Excelente! Você domina o vocabulário de profissões!';
    if (percentage >= 70) return '👍 Muito bom! Você tem um conhecimento sólido sobre profissões!';
    if (percentage >= 50) return '👌 Bom trabalho! Continue estudando para melhorar ainda mais!';
    return '📚 Continue praticando! Revise o vocabulário e tente novamente!';
}

// Funções do diálogo interativo
function playDialogue() {
    if (!isPlaying) {
        isPlaying = true;
        currentDialogueLine = 0;
        updateDialogueControls();
        playNextLine();
    }
}

function pauseDialogue() {
    if (isPlaying) {
        isPlaying = false;
        window.speechSynthesis.cancel();
        clearTimeout(dialogueTimeout);
        updateDialogueControls();
        clearHighlight();
    }
}

function stopDialogue() {
    isPlaying = false;
    currentDialogueLine = 0;
    window.speechSynthesis.cancel();
    clearTimeout(dialogueTimeout);
    updateDialogueControls();
    clearHighlight();
}

function playFromLine(lineIndex) {
    if (isPlaying) {
        stopDialogue();
    }
    currentDialogueLine = lineIndex;
    isPlaying = true;
    updateDialogueControls();
    playNextLine();
}

function playNextLine() {
    if (!isPlaying || currentDialogueLine >= dialogueLines.length) {
        stopDialogue();
        return;
    }

    highlightLine(currentDialogueLine);
    speakDialogueLine(dialogueLines[currentDialogueLine], () => {
        currentDialogueLine++;
        if (isPlaying) {
            dialogueTimeout = setTimeout(() => {
                playNextLine();
            }, 1000);
        }
    });
}

function speakDialogueLine(text, callback) {
    const speed = parseFloat(document.getElementById('dialogueSpeed').value);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speed;
    utterance.lang = 'en-US';
    utterance.onend = callback;
    
    window.speechSynthesis.speak(utterance);
}

function highlightLine(lineIndex) {
    clearHighlight();
    const line = document.querySelector(`[data-line="${lineIndex}"]`);
    if (line) {
        line.classList.add('playing');
    }
}

function clearHighlight() {
    document.querySelectorAll('.dialogue-line').forEach(line => {
        line.classList.remove('playing');
    });
}

function updateDialogueControls() {
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const stopBtn = document.getElementById('stopBtn');
    const speedIndicator = document.getElementById('speedIndicator');
    const speedSelect = document.getElementById('dialogueSpeed');
    
    playBtn.disabled = isPlaying;
    pauseBtn.disabled = !isPlaying;
    stopBtn.disabled = !isPlaying;
    
    speedIndicator.textContent = speedSelect.value + 'x';
}

// Event listener para mudança de velocidade
document.getElementById('dialogueSpeed').addEventListener('change', function() {
    document.getElementById('speedIndicator').textContent = this.value + 'x';
});

// Funções para toggle de respostas e tradução
function toggleAnswer(questionNumber) {
    const answer = document.getElementById('answer' + questionNumber);
    answer.classList.toggle('hidden-answer');
    answer.classList.toggle('show-answer');
}

function toggleTranslation() {
    const translation = document.getElementById('translation');
    translation.classList.toggle('hidden-answer');
    translation.classList.toggle('show-answer');
}