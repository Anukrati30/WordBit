
// class FlashcardApp {
//     constructor() {
//         this.words = [];
//         this.currentCard = null;
//         this.isFlipped = false;
//         this.sessionCount = 0;
//         this.loadWords();
//         this.updateStats();
//     }

//     loadWords() {
//         // In a real app, this would load from a database
//         // For demo purposes, we'll start with some sample words
//         if (this.words.length === 0) {
//             this.words = [
//                 {
//                     word: "Serendipity",
//                     meaning: "The occurrence and development of events by chance in a happy or beneficial way",
//                     example: "Finding this perfect coffee shop was pure serendipity."
//                 },
//                 {
//                     word: "Ephemeral",
//                     meaning: "Lasting for a very short time; transitory",
//                     example: "The beauty of cherry blossoms is ephemeral, lasting only a few weeks."
//                 }
//             ];
//         }
//     }

//     saveWords() {
//         // In a real app, this would save to a database
//         console.log('Words saved:', this.words);
//     }

//     wordExists(word) {
//         return this.words.some(existingWord => 
//             existingWord.word.toLowerCase() === word.toLowerCase()
//         );
//     }

//     addWord(word, meaning, example) {
//         // Check if word already exists (case-insensitive)
//         if (this.wordExists(word)) {
//             this.showErrorMessage();
//             return false;
//         }

//         this.words.push({
//             word: word,
//             meaning: meaning || '',
//             example: example || ''
//         });
//         this.saveWords();
//         this.updateStats();
//         this.showSuccessMessage();
//         return true;
//     }

//     getRandomWord() {
//         if (this.words.length === 0) return null;
//         const randomIndex = Math.floor(Math.random() * this.words.length);
//         return this.words[randomIndex];
//     }

//     showRandomCard() {
//         const word = this.getRandomWord();
//         if (!word) {
//             document.getElementById('flashcardContainer').innerHTML = `
//                 <div class="no-words">No words added yet. Add some words first! 📚</div>
//             `;
//             return;
//         }

//         this.currentCard = word;
//         this.isFlipped = false;
//         this.sessionCount++;
//         this.updateStats();

//         document.getElementById('flashcardContainer').innerHTML = `
//             <div class="flashcard" onclick="app.flipCard()">
//                 <div class="word">${word.word}
//                     <button class="play-btn" onclick="event.stopPropagation(); app.speakWord('${word.word}')">🔊</button>
//                 </div>
//                 <div class="flip-hint">Click to reveal meaning and example</div>
//             </div>
//             <div class="flashcard-controls">
//                 <button class="btn btn-primary" onclick="app.showRandomCard()">Next Card</button>
//                 <button class="btn btn-secondary" onclick="app.speakWord('${word.word}')">🔊 Listen Again</button>
//             </div>
//         `;
//     }

//     flipCard() {
//         if (!this.currentCard || this.isFlipped) return;
        
//         this.isFlipped = true;
//         const flashcard = document.querySelector('.flashcard');
//         flashcard.classList.add('flipped');
        
//         flashcard.innerHTML = `
//             <div class="word">${this.currentCard.word}
//                 <button class="play-btn" onclick="event.stopPropagation(); app.speakWord('${this.currentCard.word}')">🔊</button>
//             </div>
//             ${this.currentCard.meaning ? `<div class="meaning">${this.currentCard.meaning}</div>` : ''}
//             ${this.currentCard.example ? `<div class="example">"${this.currentCard.example}"</div>` : ''}
//         `;
//     }

//     speakWord(word) {
//         if ('speechSynthesis' in window) {
//             // Stop any currently speaking utterance
//             speechSynthesis.cancel();
            
//             const utterance = new SpeechSynthesisUtterance(word);
//             utterance.rate = 0.7; // Slower for better pronunciation learning
//             utterance.volume = 1.0;
            
//             // Try to use a high-quality English voice
//             const voices = speechSynthesis.getVoices();
//             const englishVoice = voices.find(voice => 
//                 voice.lang.startsWith('en') && 
//                 (voice.name.includes('Google') || voice.name.includes('Premium') || voice.quality === 'high')
//             ) || voices.find(voice => voice.lang.startsWith('en'));
            
//             if (englishVoice) {
//                 utterance.voice = englishVoice;
//             }
            
//             speechSynthesis.speak(utterance);
//         } else {
//             alert('Speech synthesis not supported in your browser');
//         }
//     }

//     updateStats() {
//         document.getElementById('totalWords').textContent = this.words.length;
//         document.getElementById('studySession').textContent = this.sessionCount;
//     }

//     showSuccessMessage() {
//         const message = document.getElementById('successMessage');
//         const errorMessage = document.getElementById('errorMessage');
//         errorMessage.style.display = 'none'; // Hide error message
//         message.style.display = 'block';
//         setTimeout(() => {
//             message.style.display = 'none';
//         }, 3000);
//     }

//     showErrorMessage() {
//         const message = document.getElementById('errorMessage');
//         const successMessage = document.getElementById('successMessage');
//         successMessage.style.display = 'none'; // Hide success message
//         message.style.display = 'block';
//         setTimeout(() => {
//             message.style.display = 'none';
//         }, 4000);
//     }
// }

// const app = new FlashcardApp();

// // Form submission
// document.getElementById('addWordForm').addEventListener('submit', function(e) {
//     e.preventDefault();
    
//     const word = document.getElementById('word').value.trim();
//     const meaning = document.getElementById('meaning').value.trim();
//     const example = document.getElementById('example').value.trim();
    
//     if (word && meaning) {
//         const success = app.addWord(word, meaning, example);
//         if (success) {
//             this.reset();
//         }
//         // Don't reset form if word already exists, so user can modify it
//     }
// });

// // Navigation
// function showSection(sectionName) {
//     // Hide all sections
//     document.querySelectorAll('.section').forEach(section => {
//         section.classList.remove('active');
//     });
    
//     // Remove active class from all nav buttons
//     document.querySelectorAll('.nav-btn').forEach(btn => {
//         btn.classList.remove('active');
//     });
    
//     // Show selected section
//     document.getElementById(sectionName).classList.add('active');
//     event.target.classList.add('active');
    
//     // If showing study section, show a random card
//     if (sectionName === 'study') {
//         app.showRandomCard();
//     }
// }

// // Initialize first card when page loads
// document.addEventListener('DOMContentLoaded', function() {
//     app.updateStats();
// });
// // Call this inside your form submission listener after validation
// const form = document.getElementById('addWordForm');
// const display = document.getElementById('displayArea');

// form.addEventListener('submit', e => {
//   e.preventDefault();
//   const word = document.getElementById('word').value.trim();
//   const meaning = document.getElementById('meaning').value.trim();
//   const example = document.getElementById('example').value.trim();

//   fetch('/api/words', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ word, meaning, example })
//   })
//   .then(res => res.json())
//   .then(data => {
//     alert(data.message);
//     form.reset();
//   })
//   .catch(err => alert('Error adding word'));
// });

// function getRandomWord() {
//   fetch('/api/random-word')
//     .then(res => res.json())
//     .then(data => {
//       display.innerHTML = `<h2>${data.word}</h2><p>${data.meaning}</p><em>${data.example}</em>`;
//       const utterance = new SpeechSynthesisUtterance(data.word);
//       speechSynthesis.speak(utterance);
//     })
//     .catch(() => display.innerHTML = '<p>No words found!</p>');
// }
function showSection(sectionName) {
    document.querySelectorAll('.section').forEach(section => {
      section.classList.remove('active');
    });
  
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.remove('active');
    });
  
    document.getElementById(sectionName).classList.add('active');
    event.target.classList.add('active');
  
    if (sectionName === 'study') {
      showRandomWord();
    }
  
    if (sectionName === 'stats') {
      updateStats();
    }
  }
  
  const successMessage = document.getElementById('successMessage');
  const errorMessage = document.getElementById('errorMessage');
  const addWordForm = document.getElementById('addWordForm');
  
  addWordForm.addEventListener('submit', e => {
    e.preventDefault();
  
    const word = document.getElementById('word').value.trim();
    const meaning = document.getElementById('meaning').value.trim();
    const example = document.getElementById('example').value.trim();
  
    if (!word || !meaning) return;
  
    fetch('/api/words', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word, meaning, example })
    })
      .then(res => {
        if (!res.ok) throw new Error('Word exists');
        return res.json();
      })
      .then(() => {
        successMessage.style.display = 'block';
        errorMessage.style.display = 'none';
        addWordForm.reset();
        setTimeout(() => (successMessage.style.display = 'none'), 3000);
      })
      .catch(() => {
        errorMessage.style.display = 'block';
        successMessage.style.display = 'none';
        setTimeout(() => (errorMessage.style.display = 'none'), 3000);
      });
  });
  
  function showRandomWord() {
    fetch('/api/random-word')
      .then(res => res.json())
      .then(data => {
        if (!data.word) {
          document.getElementById('flashcardContainer').innerHTML =
            '<div class="no-words">No words added yet. Add some words first! 📚</div>';
          return;
        }
  
        document.getElementById('flashcardContainer').innerHTML = `
          <div class="flashcard" onclick="flipCard('${data.word}', '${data.meaning}', '${data.example}')">
            <div class="word">${data.word}
              <button class="play-btn" onclick="event.stopPropagation(); speak('${data.word}')">🔊</button>
            </div>
            <div class="flip-hint">Click to reveal meaning and example</div>
          </div>
          <div class="flashcard-controls">
            <button class="btn btn-primary" onclick="showRandomWord()">Next Card</button>
            <button class="btn btn-secondary" onclick="speak('${data.word}')">🔊 Listen Again</button>
          </div>`;
      });
  }
  
  function flipCard(word, meaning, example) {
    const flashcard = document.querySelector('.flashcard');
    flashcard.classList.add('flipped');
    flashcard.innerHTML = `
      <div class="word">${word}
        <button class="play-btn" onclick="event.stopPropagation(); speak('${word}')">🔊</button>
      </div>
      <div class="meaning">${meaning}</div>
      <div class="example">${example}</div>`;
  }
  
  function speak(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    speechSynthesis.speak(utterance);
  }
  
  function updateStats() {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        document.getElementById('totalWords').textContent = data.totalWords || 0;
        document.getElementById('studySession').textContent = data.studySession || 0;
      });
  }
  
  // On page load
  document.addEventListener('DOMContentLoaded', () => {
    updateStats();
  });
  