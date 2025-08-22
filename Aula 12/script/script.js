// Configuração do Quiz
const quizConfig = {
    totalQuestions: 6,
    correctAnswers: {
        q1: 'c', // Ambas estão corretas
        q2: 'b', // Quarto
        q3: 'b', // In the kitchen
        q4: 'b', // Bed
        q5: 'a', // Sala de estar
        q6: 'b'  // Bathroom
    },
    explanations: {
        q1: {
            correct: 'Correto! Tanto "House" quanto "Home" significam casa em inglês.',
            incorrect: 'Errado! Tanto "House" quanto "Home" significam casa em inglês.'
        },
        q2: {
            correct: 'Correto! "Bedroom" significa quarto em português.',
            incorrect: 'Errado! "Bedroom" significa quarto, não banheiro ou cozinha.'
        },
        q3: {
            correct: 'Correto! Você cozinha "in the kitchen" (na cozinha).',
            incorrect: 'Errado! Você cozinha "in the kitchen" (na cozinha).'
        },
        q4: {
            correct: 'Correto! "Bed" significa cama em inglês.',
            incorrect: 'Errado! "Bed" é a palavra correta para cama.'
        },
        q5: {
            correct: 'Correto! "Living room" significa sala de estar.',
            incorrect: 'Errado! "Living room" significa sala de estar.'
        },
        q6: {
            correct: 'Correto! "Bathroom" significa banheiro em inglês.',
            incorrect: 'Errado! "Bathroom" é a palavra correta para banheiro.'
        }
    }
};

// Variáveis para o diálogo
let currentDialogueLine = 0;
let isPlaying = false;
let dialogueTimeout;

const dialogueLines = [
    "Wow, your house is beautiful!",
    "Thank you! Come in, let me show you around.",
    "This living room is so cozy. I love the sofa.",
    "Yes, it's my favorite place to relax. And this is the kitchen.",
    "It looks great! Is that a new refrigerator?",
    "Yes, it is! And upstairs, we have the bedrooms."
];

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
    
    if (percentage >= 90) return '🏆 Excelente! Você domina o vocabulário de casa e móveis!';
    if (percentage >= 70) return '👍 Muito bom! Você tem um conhecimento sólido sobre o tema!';
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
    
    playBtn.disabled = isPlaying;
    pauseBtn.disabled = !isPlaying;
    stopBtn.disabled = !isPlaying;
}

// Atualizar indicador de velocidade
document.getElementById('dialogueSpeed').addEventListener('change', function() {
    document.getElementById('speedIndicator').textContent = this.value + 'x';
});

// Speech synthesis function
function speakWord(text) {
    const speed = document.getElementById('speedControl') ? 
                 parseFloat(document.getElementById('speedControl').value) : 
                 1.0;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speed;
    utterance.lang = 'en-US';
    
    window.speechSynthesis.speak(utterance);
}

// Função para testar velocidade
function testSpeed() {
    speakWord('This is a test of the speech speed control for house and furniture vocabulary. House, bedroom, kitchen, living room, bathroom, bed.');
}

// Função para mostrar/esconder tradução
function toggleTranslation() {
    const translation = document.getElementById('translation');
    translation.classList.toggle('hidden-answer');
    translation.classList.toggle('show-answer');
}

// Função para mostrar/esconder respostas
function toggleAnswer(answerId) {
    const answer = document.getElementById(answerId);
    answer.classList.toggle('hidden-answer');
    answer.classList.toggle('show-answer');
}

// Fechar modais ao clicar fora deles
window.addEventListener('click', (e) => {
    const quizModal = document.getElementById('quizModal');
    const resultModal = document.getElementById('resultModal');
    
    if (e.target === quizModal) {
        closeQuizModal();
    }
    if (e.target === resultModal) {
        closeResultModal();
    }
});

// Verificar suporte à API de síntese de fala
if (!window.speechSynthesis) {
    console.error('API de síntese de fala não suportada neste navegador');
}