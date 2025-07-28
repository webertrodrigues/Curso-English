// Funções para mostrar/esconder respostas e tradução
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

// Função geral para falar texto (usada pelos botões de vocabulário)
function speakWord(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Interrompe qualquer fala para dar prioridade à nova
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 1.0; // Velocidade padrão para palavras isoladas
        window.speechSynthesis.speak(utterance);
    } else {
        alert('Seu navegador não suporta a funcionalidade de fala.');
    }
}

// --- Início da Lógica do Diálogo Interativo ---

// Variáveis de estado do diálogo
let currentDialogueLine = 0;
let isPlaying = false;
let isPaused = false; // Controla o estado de pausa
let dialogueTimeout;

// Falas do diálogo
const dialogueLines = [
    "Hello, my name is Anna. Nice to meet you.",
    "Hi Anna, I'm Ben. Nice to meet you too. How are you?",
    "I'm fine, thank you. And you?"
];

// Função para iniciar ou continuar o diálogo
function playDialogue() {
    if (isPaused) {
        // Se estava pausado, apenas continua a fala
        isPlaying = true;
        isPaused = false;
        window.speechSynthesis.resume();
        updateDialogueControls();
    } else if (!isPlaying) {
        // Se não está tocando, começa do início
        isPlaying = true;
        isPaused = false;
        currentDialogueLine = 0;
        updateDialogueControls();
        playNextLine();
    }
}

// Função para pausar o diálogo
function pauseDialogue() {
    if (isPlaying && !isPaused) {
        isPaused = true;
        isPlaying = false;
        window.speechSynthesis.pause(); // Pausa a fala
        clearTimeout(dialogueTimeout);
        updateDialogueControls();
    }
}

// Função para parar e resetar o diálogo
function stopDialogue() {
    isPlaying = false;
    isPaused = false;
    currentDialogueLine = 0;
    window.speechSynthesis.cancel(); // Interrompe completamente
    clearTimeout(dialogueTimeout);
    updateDialogueControls();
    clearHighlight();
}

// Função para tocar a partir de uma linha específica
function playFromLine(lineIndex) {
    stopDialogue(); // Para qualquer reprodução antes de começar de uma nova linha
    currentDialogueLine = lineIndex;
    isPlaying = true;
    isPaused = false;
    updateDialogueControls();
    playNextLine();
}

// Função recursiva para tocar a próxima linha
function playNextLine() {
    if (!isPlaying || currentDialogueLine >= dialogueLines.length) {
        stopDialogue(); // Para quando chegar ao fim
        return;
    }

    highlightLine(currentDialogueLine);
    // A função speakDialogueLine agora controla o avanço
    speakDialogueLine(dialogueLines[currentDialogueLine], () => {
        if (isPlaying) {
            // Pausa de 1 segundo entre as falas
            dialogueTimeout = setTimeout(() => {
                currentDialogueLine++;
                playNextLine();
            }, 1000);
        }
    });
}

// Função que cria e executa a fala de uma linha do diálogo
function speakDialogueLine(text, onEndCallback) {
    const speed = parseFloat(document.getElementById('dialogueSpeed').value);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speed;
    utterance.lang = 'en-US';
    utterance.onend = onEndCallback; // Define o que fazer quando a fala terminar

    window.speechSynthesis.speak(utterance);
}

// Funções visuais para o diálogo
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

// Atualiza o estado (habilitado/desabilitado) dos botões de controle
function updateDialogueControls() {
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const stopBtn = document.getElementById('stopBtn');

    playBtn.disabled = isPlaying && !isPaused;
    pauseBtn.disabled = !isPlaying || isPaused;
    stopBtn.disabled = !isPlaying && !isPaused;
}

// Event listener para o seletor de velocidade
document.addEventListener('DOMContentLoaded', () => {
    const speedSelector = document.getElementById('dialogueSpeed');
    if (speedSelector) {
        speedSelector.addEventListener('change', function() {
            document.getElementById('speedIndicator').textContent = this.value + 'x';
        });
    }

    // Verifica se a API de fala é suportada
    if (!('speechSynthesis' in window)) {
        console.error('API de síntese de fala não suportada neste navegador.');
        // Desabilita botões se não houver suporte
        document.querySelectorAll('.dialogue-btn, .pronounce-btn').forEach(btn => btn.disabled = true);
    }
});

// --- Fim da Lógica do Diálogo Interativo ---
