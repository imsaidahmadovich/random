const chatBox = document.getElementById('chat-box');
const msgInput = document.getElementById('msg-input');

function startChat() {
    document.getElementById('welcome-screen').classList.add('hidden');
    document.getElementById('chat-container').classList.remove('hidden');
}

function sendMessage() {
    const text = msgInput.value.trim();
    if (text === "") return;

    // Create message element
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', 'sent');
    msgDiv.textContent = text;

    chatBox.appendChild(msgDiv);

    // Auto-scroll to bottom
    chatBox.scrollTop = chatBox.scrollHeight;

    // Clear input
    msgInput.value = "";

    // Save to session (Deleted when tab closes)
    saveSession(text);
}

function saveSession(text) {
    let history = JSON.parse(sessionStorage.getItem('chatHistory')) || [];
    history.push(text);
    sessionStorage.setItem('chatHistory', JSON.stringify(history));
}

// Allow "Enter" key to send
msgInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});