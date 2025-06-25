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

function speak(text) {
    const rateSelect = document.getElementById('speechRate');
    const selectedRate = parseFloat(rateSelect.value);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = selectedRate;

    speechSynthesis.speak(utterance);
}

function speak2(text) {
    const rateSelect = document.getElementById('speechRate');
    const selectedRate = parseFloat(rateSelect.value);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = selectedRate;

    speechSynthesis.speak(utterance);
}

function speak3(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.6;
    speechSynthesis.speak(utterance);
}

// Configuração do Quiz
const quizConfig = {
    totalQuestions: 8,
    correctAnswers: {
        q1: 'c',
        q2: 'b',
        q3: 'c',
        q4: 'a',
        q5: 'b',
        q6: 'c',
        q7: 'a',
        q8: 'a'
    },
    explanations: {
        q1: {
            correct: 'Correto! "2:45" se diz "Quarter to three" (quinze para as três).',
            incorrect: 'Para 2:45 usamos "Quarter to three". "Quarter past two" é 2:15, "Half past two" é 2:30, e "Ten to three" seria 2:50.'
        },
        q2: {
            correct: 'Correto! "Half past seven" significa "sete e meia".',
            incorrect: '"Half past seven" significa "sete e meia". "Seven o\'clock" seria apenas "sete horas", e "quarter past seven" seria "sete e quinze".'
        },
        q3: {
            correct: 'Correto! "Quarter to" significa "quinze para".',
            incorrect: 'Para "15 para" usamos "Quarter to". "Quarter past" é para "quinze depois" e "Half past" para "meia hora depois".'
        },
        q4: {
            correct: 'Correto! 4:20 se diz "Twenty past four" (vinte depois das quatro).',
            incorrect: '4:20 é "Twenty past four". "Twenty to four" seria 3:40, "Quarter past four" é 4:15, e "Half past four" é 4:30.'
        },
        q5: {
            correct: 'Correto! "Midnight" significa meia-noite, enquanto "noon" significa meio-dia.',
            incorrect: '"Noon" significa meio-dia. A palavra correta para meia-noite é "midnight". "Evening" é noite e "dusk" é crepúsculo.'
        },
        q6: {
            correct: 'Correto! 5:50 se diz "Ten to six" (dez para as seis).',
            incorrect: 'Para 5:50 usamos "Ten to six" porque faltam 10 minutos para as 6. "Ten to five" seria 4:50, e "Ten past five" seria 5:10.'
        },
        q7: {
            correct: 'Correto! "Quarter past nine in the morning" é a forma correta para 9:15 da manhã.',
            incorrect: '"Quarter to nine" seria 8:45, "half past nine" seria 9:30, e "nine fifteen in the night" estaria errado porque seria "in the morning".'
        },
        q8: {
            correct: 'Correto! a.m. (ante meridiem) é antes do meio-dia e p.m. (post meridiem) é depois do meio-dia.',
            incorrect: 'a.m. significa antes do meio-dia (manhã) e p.m. significa depois do meio-dia (tarde/noite). Eles não são a mesma coisa e não estão invertidos.'
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
    
    if (percentage >= 90) return '🏆 Excelente! Você domina as horas em inglês!';
    if (percentage >= 70) return '👍 Muito bom! Você conhece bem as horas em inglês!';
    if (percentage >= 50) return '👌 Bom trabalho! Revise um pouco mais para melhorar!';
    return '✏️ Continue praticando! Revise as horas para melhorar!';
}

// =====================================
// Controle de Fala / Diálogo
// =====================================

document.addEventListener('DOMContentLoaded', () => {
    const dialogueLines = [
        "Excuse me, what time is it?",
        "It's half past three in the afternoon.",
        "Oh, thank you! I have a meeting at quarter to four.",
        "You still have some time. Is your meeting long?",
        "No, it's a short meeting, about half an hour. I hope to finish by five o'clock."
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