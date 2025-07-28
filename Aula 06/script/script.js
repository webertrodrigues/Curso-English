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

// Configuração do Quiz
const quizConfig = {
    totalQuestions: 8,
    correctAnswers: {
        q1: 'a',
        q2: 'b',
        q3: 'b',
        q4: 'b',
        q5: 'b',
        q6: 'a',
        q7: 'c',
        q8: 'b'
    },
    explanations: {
        q1: {
            correct: 'Correto! "I" é o pronome pessoal para primeira pessoa do singular.',
            incorrect: 'Errado! "I" é o pronome pessoal correto para primeira pessoa do singular.'
        },
        q2: {
            correct: 'Correto! "Her" é o pronome possessivo correspondente a "She".',
            incorrect: 'Errado! "Her" é o pronome possessivo correspondente a "She".'
        },
        q3: {
            correct: 'Correto! "They" é o pronome pessoal para terceira pessoa do plural.',
            incorrect: 'Errado! "They" é o pronome pessoal correto para terceira pessoa do plural.'
        },
        q4: {
            correct: 'Correto! "His" é o pronome possessivo masculino.',
            incorrect: 'Errado! A tradução correta é "This is his book" usando o pronome possessivo "his".'
        },
        q5: {
            correct: 'Correto! "Our" é o pronome possessivo para primeira pessoa do plural.',
            incorrect: 'Errado! "Our" é o pronome possessivo correto para primeira pessoa do plural.'
        },
        q6: {
            correct: 'Correto! "It" é o pronome pessoal usado para objetos e animais.',
            incorrect: 'Errado! "It" é o pronome pessoal usado para objetos e animais.'
        },
        q7: {
            correct: 'Correto! "Your" é o pronome possessivo para segunda pessoa.',
            incorrect: 'Errado! "Your" é o pronome possessivo correto para segunda pessoa.'
        },
        q8: {
            correct: 'Correto! "They are happy" usa o pronome pessoal correto.',
            incorrect: 'Errado! A frase correta é "They are happy" usando o pronome pessoal "they".'
        }
    }
};

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

// Função para verificar respostas
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
    
    if (percentage >= 90) return '🏆 Excelente! Você domina pronomes pessoais e possessivos!';
    if (percentage >= 70) return '👍 Muito bom! Você conhece bem pronomes pessoais e possessivos!';
    if (percentage >= 50) return '👌 Bom trabalho! Revise um pouco mais para melhorar!';
    return '✏️ Continue praticando! Revise os pronomes para melhorar!';
}

// Speech synthesis function
function speakWord(text) {
    // Get the selected speed
    const speed = document.getElementById('speedControl') ? 
                 parseFloat(document.getElementById('speedControl').value) : 
                 1.0;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    // Create a new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speed;
    utterance.lang = 'en-US';
    
    // Speak the text
    window.speechSynthesis.speak(utterance);
}

// Test speed function
function testSpeed() {
    speakWord('This is my book');
}

// =====================================
// Controle de Fala / Diálogo
// =====================================

document.addEventListener('DOMContentLoaded', () => {

    const dialogueLines = [
        "Is this your bag?",
        "No, it's not my bag. I think it's his bag.",
        "Oh, I see. And where are your keys?",
        "My keys are in my pocket."
    ];

    let currentLine = 0;
    let isDialoguePlaying = false;
    const speechSynth = window.speechSynthesis;

    const playBtn = document.getElementById('playDialogue');
    const pauseBtn = document.getElementById('pauseDialogue');
    const stopBtn = document.getElementById('stopDialogue');
    const speedControl = document.getElementById('dialogueSpeed');

    function speakLineAsync(text, rate = 1.0) {
        return new Promise((resolve, reject) => {
            const utter = new SpeechSynthesisUtterance(text);
            utter.rate = rate;
            utter.lang = 'en-US';
            utter.onend = () => resolve();
            utter.onerror = (e) => reject(e);
            speechSynth.speak(utter);
        });
    }

    function highlightCurrentLine() {
        document.querySelectorAll('.dialogue-line').forEach(line => {
            line.classList.remove('highlight');
        });

        const lines = document.querySelectorAll('.dialogue-line');
        if (lines[currentLine]) {
            lines[currentLine].classList.add('highlight');
            const el = document.getElementById(`line${currentLine + 1}`);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    }

    async function playDialogueFrom(index) {
        isDialoguePlaying = true;
        playBtn.classList.add('hidden');
        pauseBtn.classList.remove('hidden');

        for (let i = index; i < dialogueLines.length; i++) {
            currentLine = i;
            highlightCurrentLine();

            if (!isDialoguePlaying) break;

            try {
                await speakLineAsync(dialogueLines[i], parseFloat(speedControl.value));
            } catch (e) {
                console.error('Erro na fala:', e);
                break;
            }
        }

        stopDialogue();
    }

    function playDialogue() {
        if (speechSynth.paused) {
            speechSynth.resume();
            isDialoguePlaying = true;
            playBtn.classList.add('hidden');
            pauseBtn.classList.remove('hidden');
        } else {
            stopDialogue();
            playDialogueFrom(currentLine);
        }
    }

    function pauseDialogue() {
        isDialoguePlaying = false;
        speechSynth.pause();
        playBtn.classList.remove('hidden');
        pauseBtn.classList.add('hidden');
    }

    function stopDialogue() {
        isDialoguePlaying = false;
        speechSynth.cancel();
        currentLine = 0;
        playBtn.classList.remove('hidden');
        pauseBtn.classList.add('hidden');

        document.querySelectorAll('.dialogue-line').forEach(line => {
            line.classList.remove('highlight');
        });
    }

    playBtn.addEventListener('click', playDialogue);
    pauseBtn.addEventListener('click', pauseDialogue);
    stopBtn.addEventListener('click', stopDialogue);

    document.querySelectorAll('.dialogue-line').forEach((line, index) => {
        line.addEventListener('click', () => {
            stopDialogue();
            playDialogueFrom(index);
        });
    });

    speedControl.addEventListener('change', () => {
        if (isDialoguePlaying) {
            stopDialogue();
            playDialogueFrom(currentLine);
        }
    });

    if (!window.speechSynthesis) {
        console.error('API de síntese de fala não suportada neste navegador');
        document.querySelector('.dialogue-controls').innerHTML =
            '<p class="text-red-600">Seu navegador não suporta a reprodução de áudio. Por favor, atualize ou use outro navegador.</p>';
    }
});

// --- Lógica do Diálogo Interativo ---
let currentDialogueLine = 0;
let isPlaying = false;
let isPaused = false;
let dialogueTimeout;

const dialogueLines = [
    "Is this your bag?",
    "No, it's not my bag. I think it's his bag.",
    "Oh, I see. And where are your keys?",
    "My keys are in my pocket."
];

function playDialogue() {
    if (isPaused) {
        isPlaying = true;
        isPaused = false;
        window.speechSynthesis.resume();
        updateDialogueControls();
    } else if (!isPlaying) {
        isPlaying = true;
        isPaused = false;
        currentDialogueLine = 0;
        updateDialogueControls();
        playNextLine();
    }
}

function pauseDialogue() {
    if (isPlaying && !isPaused) {
        isPaused = true;
        isPlaying = false;
        window.speechSynthesis.pause();
        clearTimeout(dialogueTimeout);
        updateDialogueControls();
    }
}

function stopDialogue() {
    isPlaying = false;
    isPaused = false;
    currentDialogueLine = 0;
    window.speechSynthesis.cancel();
    clearTimeout(dialogueTimeout);
    updateDialogueControls();
    clearHighlight();
}

function playFromLine(lineIndex) {
    stopDialogue();
    currentDialogueLine = lineIndex;
    isPlaying = true;
    isPaused = false;
    updateDialogueControls();
    playNextLine();
}

function playNextLine() {
    if (!isPlaying || currentDialogueLine >= dialogueLines.length) {
        stopDialogue();
        return;
    }
    highlightLine(currentDialogueLine);
    const speed = parseFloat(document.getElementById('dialogueSpeed').value);
    const utterance = new SpeechSynthesisUtterance(dialogueLines[currentDialogueLine]);
    utterance.rate = speed;
    utterance.lang = 'en-US';
    utterance.onend = () => {
        if (isPlaying) {
            dialogueTimeout = setTimeout(() => {
                currentDialogueLine++;
                playNextLine();
            }, 1000); // Pausa de 1 segundo entre as falas
        }
    };
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

    playBtn.disabled = isPlaying && !isPaused;
    pauseBtn.disabled = !isPlaying || isPaused;
    stopBtn.disabled = !isPlaying && !isPaused;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const stopBtn = document.getElementById('stopBtn');
    const speedSelector = document.getElementById('dialogueSpeed');
    
    playBtn.addEventListener('click', playDialogue);
    pauseBtn.addEventListener('click', pauseDialogue);
    stopBtn.addEventListener('click', stopDialogue);
    
    document.querySelectorAll('.dialogue-line').forEach((line, index) => {
        line.addEventListener('click', () => playFromLine(index));
    });
    
    if (speedSelector) {
        speedSelector.addEventListener('change', function() {
            document.getElementById('speedIndicator').textContent = this.value + 'x';
            if (isPlaying) {
                // Se estiver reproduzindo, reinicie com nova velocidade
                stopDialogue();
                playFromLine(currentDialogueLine);
            }
        });
    }
});