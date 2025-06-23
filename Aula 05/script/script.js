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
        q1: 'b',
        q2: 'c',
        q3: 'b',
        q4: 'a',
        q5: 'd',
        q6: 'c',
        q7: 'b',
        q8: 'd'
    },
    explanations: {
        q1: {
            correct: 'Correto! "She" usa "is" no presente simples',
            incorrect: 'Errado! "She" deve usar "is" no presente simples'
        },
        q2: {
            correct: 'Correto! "They are" é a forma correta para eles/elas',
            incorrect: 'Errado! "They are" é a forma correta para eles/elas'
        },
        q3: {
            correct: 'Correto! "They are at the park" é a tradução correta',
            incorrect: 'Errado! A tradução correta é "They are at the park"'
        },
        q4: {
            correct: 'Correto! "I" sempre usa "am" no presente simples',
            incorrect: 'Errado! "I" sempre usa "am" no presente simples'
        },
        q5: {
            correct: 'Correto! "He" deve usar "is", não "are"',
            incorrect: 'Errado! A frase incorreta é "He are happy" - deveria ser "He is happy"'
        },
        q6: {
            correct: 'Correto! "My friends" (they) usa "are"',
            incorrect: 'Errado! "My friends" (they) deve usar "are"'
        },
        q7: {
            correct: 'Correto! Perguntas no inglês invertem a ordem (are you)',
            incorrect: 'Errado! Em perguntas, invertemos a ordem: "Are you tired?"'
        },
        q8: {
            correct: 'Correto! "To be" não é usado para ações em progresso (usamos "to be" + gerúndio para isso)',
            incorrect: 'Errado! "To be" não é usado diretamente para ações (usamos "to be" + gerúndio para ações em progresso)'
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
    
    if (percentage >= 90) return '🏆 Excelente! Você domina o verbo "to be"!';
    if (percentage >= 70) return '👍 Muito bom! Você conhece bem o verbo "to be"!';
    if (percentage >= 50) return '👌 Bom trabalho! Revise um pouco mais para melhorar!';
    return '✏️ Continue praticando! Revise o verbo "to be" para melhorar!';
}