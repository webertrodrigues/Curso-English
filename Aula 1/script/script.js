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

// Variável global para armazenar a velocidade
let speechSpeed = 0.9;

// Função para falar palavras
function speakWord(text) {
    if ('speechSynthesis' in window) {
        // Cancela qualquer fala em andamento
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = speechSpeed; // Usa a velocidade definida
        utterance.pitch = 1;

        const voices = window.speechSynthesis.getVoices();
        const englishVoice = voices.find(voice => 
            voice.lang.includes('en-') && voice.name.includes('Female'));
        
        if (englishVoice) {
            utterance.voice = englishVoice;
        }
        
        window.speechSynthesis.speak(utterance);
    } else {
        alert('Seu navegador não suporta a funcionalidade de fala. Tente usar Chrome, Edge ou Safari.');
    }
}

// Função para testar a velocidade atual
function testSpeed() {
    speakWord("Hello, how are you today?");
}

// Atualiza a velocidade quando o seletor muda
document.getElementById('speedControl').addEventListener('change', function() {
    speechSpeed = parseFloat(this.value);
    
    // Feedback visual
    const speedControl = this;
    speedControl.classList.add('bg-gold', 'text-white');
    setTimeout(() => {
        speedControl.classList.remove('bg-gold', 'text-white');
    }, 300);
});

// Carrega as vozes quando disponíveis
window.speechSynthesis.onvoiceschanged = function() {
    // Vozes carregadas
};