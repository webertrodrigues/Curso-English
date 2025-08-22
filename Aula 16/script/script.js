// ==== QUIZ CONFIG (baseado no padrão do lesson13) ====
const quizConfig = {
    totalQuestions: 6,
    correctAnswers: {
        q1: 'b', // Snowy
        q2: 'b', // Outono
        q3: 'b', // Windy
        q4: 'b', // Anemometer
        q5: 'b', // Muito quente
        q6: 'a'  // Weather forecast
    },
    explanations: {
        q1: {
            correct: 'Correto! "Snowy" significa nevando.',
            incorrect: 'Quase! "Snowy" é usado para quando está nevando.'
        },
        q2: {
            correct: 'Correto! "Autumn" (ou "Fall") é outono.',
            incorrect: 'Atenção: "Autumn" (ou "Fall") corresponde a outono.'
        },
        q3: {
            correct: 'Correto! "Windy" é ventando.',
            incorrect: '"Windy" é a opção certa para ventando.'
        },
        q4: {
            correct: 'Correto! "Anemometer" mede a velocidade do vento.',
            incorrect: 'Revise: "Anemometer" mede a velocidade do vento; barometer mede pressão.'
        },
        q5: {
            correct: 'Correto! "Hot" descreve algo muito quente.',
            incorrect: 'Cuidado: "Hot" significa muito quente.'
        },
        q6: {
            correct: 'Correto! "Weather forecast" = previsão do tempo.',
            incorrect: 'A expressão correta para previsão do tempo é "weather forecast".'
        }
    }
};

// ==== DIÁLOGO ====
let currentDialogueLine = 0;
let isPlaying = false;
let dialogueTimeout;
const dialogueLines = [
    "What's the weather like this weekend?",
    "It should be warm and sunny on Saturday.",
    "Great! Do you want to go for a hike?",
    "Sure! But on Sunday it's going to rain.",
    "Then let's go on Saturday morning.",
    "Perfect. I'll bring water and sunscreen."
];

// Fala a palavra/frase
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

// ---- Quiz ----
function checkQuiz() {
    let score = 0;
    const results = [];
    const form = document.getElementById('quizForm');
    
    for (let i = 1; i <= quizConfig.totalQuestions; i++) {
        const questionName = `q${i}`;
        const selected = form.querySelector(`input[name="${questionName}"]:checked`)?.value;
        const isCorrect = selected === quizConfig.correctAnswers[questionName];
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

function showResults(score, results) {
    const scoreEl = document.getElementById('scoreText');
    const resultsContainer = document.getElementById('quizResults');
    scoreEl.innerHTML = `
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

function getScoreMessage(score, total) {
    const pct = (score / total) * 100;
    if (pct >= 90) return '🏆 Excelente! Você domina o vocabulário de clima e estações!';
    if (pct >= 70) return '👍 Muito bom! Seu vocabulário está sólido!';
    if (pct >= 50) return '👌 Bom trabalho! Continue praticando!';
    return '📚 Continue praticando! Revise o vocabulário e tente novamente!';
}

// ---- Diálogo Interativo (mesma UX do lesson13) ----
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
    if (isPlaying) { stopDialogue(); }
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
            dialogueTimeout = setTimeout(() => { playNextLine(); }, 800);
        }
    });
}
function speakDialogueLine(text, callback) {
    const speed = parseFloat(document.getElementById('dialogueSpeed').value);
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = speed;
    utter.lang = 'en-US';
    utter.onend = callback;
    window.speechSynthesis.speak(utter);
}
function highlightLine(lineIndex) {
    clearHighlight();
    const line = document.querySelector(`[data-line="${lineIndex}"]`);
    if (line) {
        line.classList.add('playing');
    }
}
function clearHighlight() {
    document.querySelectorAll('.dialogue-line').forEach(l => l.classList.remove('playing'));
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
document.getElementById('dialogueSpeed').addEventListener('change', function() {
    document.getElementById('speedIndicator').textContent = this.value + 'x';
});

// ---- Toggles ----
function toggleAnswer(n) {
    const el = document.getElementById('answer' + n);
    el.classList.toggle('hidden-answer');
    el.classList.toggle('show-answer');
}
function toggleTranslation() {
    const el = document.getElementById('translation');
    el.classList.toggle('hidden-answer');
    el.classList.toggle('show-answer');
}

// ---- Estilos adicionais (mesmo padrão do lesson13) ----
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
    .form-radio:checked { background-color: var(--wine); }
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
    .form-radio:focus { box-shadow: 0 0 0 2px var(--gold); }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    #quizModal, #resultModal { animation: fadeIn 0.25s ease-out; }
    #quizModal > div, #resultModal > div { animation: slideIn 0.25s ease-out; }

    .modal-content {
        background-color: white;
        border-radius: 8px;
        width: 90%;
        max-width: 700px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    }
    body.modal-open { overflow: hidden; }

    .dialogue-line {
        padding: 0.8rem;
        margin: 0.5rem 0;
        border-radius: 8px;
        transition: all 0.3s ease;
        cursor: pointer;
        border: 2px solid transparent;
    }
    .dialogue-line:hover { background-color: rgba(212, 175, 55, 0.1); border-color: var(--gold); }
    .dialogue-line.playing { background-color: var(--light-gold); border-color: var(--wine); transform: translateX(5px); }

    .dialogue-btn {
        background: rgba(255,255,255,0.2);
        border: 2px solid rgba(255,255,255,0.3);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-family: 'Libre Baskerville', serif;
    }
    .dialogue-btn:hover { background: rgba(255,255,255,0.3); border-color: var(--gold); }
    .dialogue-btn:disabled { opacity: 0.5; cursor: not-allowed; }

    .speed-indicator {
        background: var(--gold);
        color: var(--wine);
        padding: 0.3rem 0.8rem;
        border-radius: 20px;
        font-weight: bold;
        font-size: 0.9rem;
    }

    @media (max-width: 768px) {
        .modal-content { width: 95%; padding: 1rem; }
        .dialogue-controls { flex-direction: column; text-align: center; }
    }
`;
const styleEl = document.createElement('style');
styleEl.textContent = additionalStyles;
document.head.appendChild(styleEl);