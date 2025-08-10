// --- Supabase Setup ---
const { createClient } = supabase;

const supabaseUrl = 'https://uyrpbigrgsblrcdfpdru.supabase.co'; // Your project URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5cnBiaWdyZ3NibHJjZGZwZHJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNzg2NzEsImV4cCI6MjA2NTc1NDY3MX0.gjjr39jmDpoDLwqufimJAdlhyJSoUkcyXurYhwpBT3A'; // Replace with your anon key
const db = createClient(supabaseUrl, supabaseKey);

class FlashcardApp {
    constructor() {
        this.words = [];
        this.currentCard = null;
        this.isFlipped = false;
        this.sessionCount = 0;
        this.loadWords();
    }

    async loadWords() {
        const { data, error } = await db
            .from("Dict_db") // Your table name
            .select("*")
            .order("id", { ascending: false });

        if (error) {
            console.error("Error loading words:", error);
        } else {
            this.words = data;
            this.updateStats();
        }
    }

    wordExists(word) {
        return this.words.some(w => w.word.toLowerCase() === word.toLowerCase());
    }

    async addWord(word, meaning, example) {
        if (this.wordExists(word)) {
            this.showErrorMessage();
            return false;
        }

        const { error } = await db
            .from("Dict_db")
            .insert([{ word, meaning, example }]);

        if (error) {
            console.error("Error adding word:", error);
            this.showErrorMessage();
            return false;
        }

        this.words.unshift({ word, meaning, example });
        this.showSuccessMessage();
        this.updateStats();
        return true;
    }

    getRandomWord() {
        if (this.words.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * this.words.length);
        return this.words[randomIndex];
    }

    showRandomCard() {
        const word = this.getRandomWord();
        const container = document.getElementById('flashcardContainer');

        if (!word) {
            container.innerHTML = `<div class="no-words">No words added yet. Add some words first! 📚</div>`;
            return;
        }

        this.currentCard = word;
        this.isFlipped = false;
        this.sessionCount++;
        this.updateStats();

        container.innerHTML = `
            <div class="flashcard" onclick="app.flipCard()">
                <div class="word">${word.word}
                    <button class="play-btn" onclick="event.stopPropagation(); app.speakWord('${word.word}')">🔊</button>
                </div>
                <div class="flip-hintnav">Click to reveal meaning and example</div>
                <div class="flip-hint">Click to reveal meaning and example</div>
            </div>
            <div class="flashcard-controls">
                <button class="btn btn-primary" onclick="app.showRandomCard()">Next Card</button>
                <button class="btn btn-secondary" onclick="app.speakWord('${word.word}')">🔊 Listen Again</button>
            </div>
        `;
    }

    flipCard() {
        if (!this.currentCard || this.isFlipped) return;

        this.isFlipped = true;
        const flashcard = document.querySelector('.flashcard');
        flashcard.classList.add('flipped');

        flashcard.innerHTML = `
            <div class="word">${this.currentCard.word}
                <button class="play-btn" onclick="event.stopPropagation(); app.speakWord('${this.currentCard.word}')">🔊</button>
            </div>
            ${this.currentCard.meaning ? `<div class="meaning">${this.currentCard.meaning}</div>` : ''}
            ${this.currentCard.example ? `<div class="example">"${this.currentCard.example}"</div>` : ''}
        `;
    }

    speakWord(word) {
        if ('speechSynthesis' in window) {
            speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(word);
            utterance.rate = 0.7;
            utterance.volume = 1.0;

            const voices = speechSynthesis.getVoices();
            const englishVoice = voices.find(v => v.lang.startsWith('en')) || null;
            if (englishVoice) utterance.voice = englishVoice;

            speechSynthesis.speak(utterance);
        }
    }

    updateStats() {
        document.getElementById('totalWords').textContent = this.words.length;
        document.getElementById('studySession').textContent = this.sessionCount;
    }

    showSuccessMessage() {
        document.getElementById('errorMessage').style.display = 'none';
        const msg = document.getElementById('successMessage');
        msg.style.display = 'block';
        setTimeout(() => msg.style.display = 'none', 3000);
    }

    showErrorMessage() {
        document.getElementById('successMessage').style.display = 'none';
        const msg = document.getElementById('errorMessage');
        msg.style.display = 'block';
        setTimeout(() => msg.style.display = 'none', 4000);
    }
}

const app = new FlashcardApp();

// --- Event Listeners ---
document.getElementById('addWordForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const word = document.getElementById('word').value.trim();
    const meaning = document.getElementById('meaning').value.trim();
    const example = document.getElementById('example').value.trim();

    if (word && meaning) {
        const success = await app.addWord(word, meaning, example);
        if (success) this.reset();
    }
});

function showSection(sectionName) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    document.getElementById(sectionName).classList.add('active');
    event.target.classList.add('active');

    if (sectionName === 'study') {
        app.showRandomCard();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    app.updateStats();
});
