// Configuração do Quiz
const quizConfig = {
    totalQuestions: 6,
    correctAnswers: {
        q1: 'a', // Car
        q2: 'a', // Avião
        q3: 'a', // How do you get to work?
        q4: 'b', // Bicycle
        q5: 'a', // Metrô
        q6: 'b'  // Drive
    },
    explanations: {
        q1: {
            correct: 'Correto! "Car" significa carro em inglês.',
            incorrect: 'Errado! "Car" é a palavra correta para carro.'
        },
        q2: {
            correct: 'Correto! "Airplane" significa avião em português.',
            incorrect: 'Errado! "Airplane" significa avião, não trem ou navio.'
        },
        q3: {
            correct: 'Correto! "How do you get to work?" é como perguntar sobre o meio de transporte.',
            incorrect: 'Errado! "How do you get to work?" é a pergunta correta sobre transporte.'
        },
        q4: {
            correct: 'Correto! "Bicycle" significa bicicleta em inglês.',
            incorrect: 'Errado! "Bicycle" é a palavra correta para bicicleta.'
        },
        q5: {
            correct: 'Correto! "Subway" significa metrô.',
            incorrect: 'Errado! "Subway" significa metrô, não ônibus ou táxi.'
        },
        q6: {
            correct: 'Correto! "Drive" significa dirigir em inglês.',
            incorrect: 'Errado! "Drive" é a palavra correta para dirigir.'
        }
    }
};

// Variáveis para o diálogo
let currentDialogueLine = 0;
let isPlaying = false;
let dialogueTimeout;

const dialogueLines = [
    "How are you planning to get to the airport?",
    "I think I'll take a taxi. It's faster than the bus.",
    "That's a good idea. What time is your flight?",
    "My flight is at 7 AM, so I need to leave home by 4:30 AM.",
    "Wow, that's early! Are you flying directly to London?",
    "Yes, I am. It's a long flight, about 10 hours."
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
    
    if (percentage >= 90) return '🏆 Excelente! Você domina o vocabulário de transporte!';
    if (percentage >= 70) return '👍 Muito bom! Você tem um conhecimento sólido sobre transporte!';
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

// Estilos CSS adicionais para os modais e diálogo
const additionalStyles = `
    .form-radio {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        width: 1.2em;
        height: 1.2em;
        border: 2px solid var(--wine);
        border-radius: 50%;
        outline: none;
        cursor: pointer;
        position: relative;
        transition: all 0.2s ease;
    }

    .form-radio:checked {
        background-color: var(--wine);
    }

    .form-radio:checked::after {
        content: '';
        position: absolute;
        width: 0.6em;
        height: 0.6em;
        background-color: white;
        border-radius: 50%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .form-radio:focus {
        box-shadow: 0 0 0 2px var(--gold);
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes slideIn {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }

    #quizModal, #resultModal {
        animation: fadeIn 0.3s ease-out;
    }

    #quizModal > div, #resultModal > div {
        animation: slideIn 0.3s ease-out;
    }

    .modal-content {
        background-color: white;
        border-radius: 8px;
        width: 90%;
        max-width: 700px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }

    body.modal-open {
        overflow: hidden;
    }

    .dialogue-line {
        padding: 0.8rem;
        margin: 0.5rem 0;
        border-radius: 8px;
        transition: all 0.3s ease;
        cursor: pointer;
        border: 2px solid transparent;
    }

    .dialogue-line:hover {
        background-color: rgba(212, 175, 55, 0.1);
        border-color: var(--gold);
    }

    .dialogue-line.playing {
        background-color: var(--light-gold);
        border-color: var(--wine);
        transform: translateX(5px);
    }

    .dialogue-controls {
        background: var(--wine);
        color: white;
        padding: 1rem;
        border-radius: 12px;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 1rem;
    }

    .dialogue-btn {
        background: rgba(255, 255, 255, 0.2);
        border: 2px solid rgba(255, 255, 255, 0.3);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-family: 'Libre Baskerville', serif;
    }

    .dialogue-btn:hover {
        background: rgba(255, 255, 255, 0.3);
        border-color: var(--gold);
    }

    .dialogue-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .speed-indicator {
        background: var(--gold);
        color: var(--wine);
        padding: 0.3rem 0.8rem;
        border-radius: 20px;
        font-weight: bold;
        font-size: 0.9rem;
    }

    .object-icon {
        width: 40px;
        height: 40px;
        background-color: var(--light-gold);
        border: 2px solid var(--gold);
        border-radius: 8px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-right: 12px;
        font-size: 1.5rem;
    }

    @media (max-width: 768px) {
        .modal-content {
            width: 95%;
            padding: 1rem;
        }

        .dialogue-controls {
            flex-direction: column;
            text-align: center;
        }
    }
`;

// Adicionar estilos CSS ao documento
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);