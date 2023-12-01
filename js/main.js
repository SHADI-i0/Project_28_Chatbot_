const API_KEY = prompt("Create API key : / https://platform.openai.com/api-keys /")
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatBox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const showChat = document.querySelector("#show-chatbot");
const chatbotCloseBtn = document.querySelector(".header span");

const inputInitHeight = chatInput.scrollHeight;
let userMessage;

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent =
        className === "outgoing" ?
        `<p></p>` :
        `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
};

const generateResponse = (incomingChatLi) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatLi.querySelector("p");
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{
                role: "user",
                content: userMessage,
            }],
        }),
    };
    fetch(API_URL, requestOptions)
        .then((res) => res.json())
        .then((data) => messageElement.textContent = data.choices[0].message.content)
        .catch(() => {
            messageElement.classList.add("error");
            messageElement.textContent = "Oops! Something went wrong. Please try again.";
        })
        .finally(() => {
            chatBox.scrollTo({
                left: 0,
                top: chatBox.scrollHeight,
                behavior: "smooth",
            });
        });
};

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;
    chatBox.appendChild(createChatLi(userMessage, "outgoing"));
    chatBox.scrollTo({
        left: 0,
        top: chatBox.scrollHeight,
        behavior: "smooth",
    });
    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatBox.appendChild(incomingChatLi);
        chatBox.scrollTo({
            left: 0,
            top: chatBox.scrollHeight,
            behavior: "smooth",
        });
        generateResponse(incomingChatLi);
    }, 600);
};

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
chatbotToggler.addEventListener("click", () => showChat.classList.toggle("show-chatbot"));
chatbotCloseBtn.addEventListener("click", () => showChat.classList.remove("show-chatbot"));
