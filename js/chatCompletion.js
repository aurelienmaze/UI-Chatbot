const form = document.getElementById('form');
const input = document.getElementById('input');
const chat = document.getElementById('chat__message');

const memories = [
    {
    content: "You're a useful assistant. Your name is JanUI and your creator's name is Aur3lien__. If is not specify, you'll answer in French only, with short, concise answers and no elaboration.",
    role: 'system'
    }
];

form.addEventListener('submit', function (event) {
    event.preventDefault();

    const question = input.value;
    input.value = '';

    chat.innerHTML += `
    <div class="chat__message__user">
        <img src="assets/avatar.png">
        <div>
            <h3>Vous</h3>
            <p>${question}</p>
        </div>
    </div>`;

    memories.push({
        content: question,
        role: 'user'
    });

    const data = JSON.stringify({
    messages: memories,
    //model: 'llama3-8b-instruct',
    //model: 'tinyllama-1.1b',
    model: 'mistral-ins-7b-q4',
    stream: false,
    max_tokens: 4096,
    stop: NaN,
    frequency_penalty: 0,
    presence_penalty: 0,
    temperature: 0.7,
    top_p: 0.95
    });

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = false;

    let answer = '';

    xhr.addEventListener('readystatechange', function () {
        if (this.readyState === this.DONE) {
            chat.innerHTML += `
            <div class="chat__message__user">
                <img src="assets/avatar_ai.png">
                <div>
                    <h3>JanUI</h3>
                    <p>${answer}</p>
                </div>
            </div>`;
            answer = ''; // Reset answer
        }
    });

    memories.push({
        content: question,
        role: 'assistant'
    });

    xhr.addEventListener('progress', function (event) {
        const response = JSON.parse(event.currentTarget.responseText);
        answer += response.choices[0].message.content;
    });

    xhr.open('POST', 'http://localhost:250/v1/chat/completions');
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send(data);
});