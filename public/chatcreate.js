let encUser = null;
var socket;
let manualChat = [];
function loadCSS(filename) {
	const link = document.createElement('link');
	link.rel = 'stylesheet';
	link.type = 'text/css';
	link.href = filename;
	link.media = 'all';

	// Append the link element to the <head>
	document.getElementsByTagName('head')[0].appendChild(link);
}

function loadSocketIO(callback) {
	const script = document.createElement("script");
	script.src = "https://cdn.socket.io/4.8.1/socket.io.min.js";
	script.onload = callback;
	document.head.appendChild(script);
}

document.addEventListener('DOMContentLoaded', async () => {
	await getUserChat();
	await displayChat();
	loadCSS('http://localhost:443/css-file-for-chatcreate.css');
	loadSocketIO(() => {
		const scripts = document.getElementsByTagName('script');
		Array.from(scripts).forEach((script, index) => {
			let srcValue = script.src;
			if (srcValue.includes('chatcreate?user')) {
				let splitedString = srcValue.split("=");
				encUser = splitedString[1];
			} else {
			}
		});
		socket = io.connect('http://localhost:443', {
			secure: true,
			reconnection: true,
			rejectUnauthorized: false, // Set to true in production
			query: { user: encUser, type: "clientUser" }
		});
		socket.on("connect", () => {
		});
		socket.on('chat', (chatObj) => {
			manualChat.push({ 'chat': chatObj.chat, 'from': 'Support' });
			addChatToChatArea();
		})
	})
})

// // chat.js
let chatData = {};
let selectedChat = [];
let chatDataRef = {};
const chatButton = renderChatButton();
const chatWindow = renderChatBox();
let open = false;

const getUserChat = async () => {
	let response = await fetch('https://localhost:443/userchat', {
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		method: "POST",
		credentials: 'include',
	});

	if (response.ok) {
		let userChatData = await response.json();
		chatDataRef = { ...userChatData };
		chatData = Object.keys(userChatData).length === 0 ? {} : userChatData;
	}
};

function renderChatBox() {
	// Create and toggle the chat box
	const chatBox = document.createElement('div');
	chatBox.classList.add('chat-box');
	chatBox.style.position = 'fixed';
	chatBox.style.bottom = '0';
	chatBox.style.right = '0';
	chatBox.style.width = '300px';
	chatBox.style.height = '500px';
	chatBox.style.backgroundColor = 'white';
	chatBox.style.boxShadow = '0px 0px 15px rgba(0, 0, 0, 0.3)';
	chatBox.style.zIndex = '9999';

	// Chat top bar
	const topBar = document.createElement('div');
	topBar.classList.add('chat-top-bar');
	topBar.innerText = 'How can I help you?';
	topBar.onclick = toggleChat;
	chatBox.appendChild(topBar);

	// Chat area
	const chatArea = document.createElement('div');
	chatArea.classList.add('chat-area');
	chatArea.style.height = 'calc(100% - 95px)';
	chatArea.style.overflowY = 'scroll';
	chatBox.appendChild(chatArea);

	// Text area and send button
	const textAreaContainer = document.createElement('div');
	textAreaContainer.classList.add('text-area');
	const textArea = document.createElement('textarea');
	textArea.name = 'chatarea';
	textArea.id = 'apchatapp22692';
	textArea.classList.add('type-area');
	const sendButton = document.createElement('button');
	sendButton.classList.add('send-button');
	sendButton.innerText = 'Send';
	sendButton.onclick = handleSend;
	textAreaContainer.appendChild(textArea);
	textAreaContainer.appendChild(sendButton);
	chatBox.appendChild(textAreaContainer);

	// Append chat box to the document
	return chatBox;
	// document.body.appendChild(chatBox);
}

function renderChatButton() {
	// Create a small toggle button for the chat
	const toggleButton = document.createElement('button');
	toggleButton.classList.add('chat-toggle-button');
	toggleButton.style.position = 'fixed';
	toggleButton.style.bottom = '20px';
	toggleButton.style.right = '20px';
	toggleButton.style.width = '50px';
	toggleButton.style.height = '50px';
	toggleButton.style.borderRadius = '50%';
	toggleButton.style.backgroundColor = 'pink';
	toggleButton.style.border = 'none';
	toggleButton.style.cursor = 'pointer';
	toggleButton.style.zIndex = '9999';
	toggleButton.innerHTML = `
          <svg width="24" height="24" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="black" stroke-width="2" fill="none"/>
            <text x="12" y="16" text-anchor="middle" font-size="14" fill="black">?</text>
          </svg>
        `;
	toggleButton.addEventListener('click', toggleChat);
	return toggleButton;
}
function handleClick(chat) {
	if (Object.keys(chatData[chat]).length > 0) {
		chatData = chatData[chat];
		selectedChat.push(chat);
		updateChatView();
	}
}

function handleBackButton() {
	if (selectedChat.length === 0) {
		alert("This is the first page");
	} else {
		selectedChat.pop();
		let tempChat = { ...chatDataRef };
		selectedChat.forEach(chat => {
			tempChat = tempChat[chat];
		});
		chatData = tempChat;
		updateChatView();
	}
}

function handleSend() {
	let typedChat = document.getElementById("apchatapp22692").value;
	manualChat.push({ "chat": typedChat, "from": "Me" });
	addChatToChatArea();
	socket.emit('chat', typedChat);
	document.getElementById("apchatapp22692").value = "";
}

function updateChatView() {
	const chatArea = document.querySelector('.chat-area');
	chatArea.innerHTML = ''; // Clear previous chat options
	Object.keys(chatData).forEach(chat => {
		const chatOption = document.createElement('div');
		chatOption.classList.add('chat-option');
		chatOption.innerText = chat;
		chatOption.onclick = () => handleClick(chat);
		chatArea.appendChild(chatOption);
	});
	addBackButton();
}

function toggleChat() {
	if (open) {
		const chatBox = document.querySelector('.chat-box');
		chatBox.remove();
		document.body.appendChild(chatButton);
	} else {
		const chatBtn = document.querySelector('.chat-toggle-button');
		chatBtn.remove();
		document.body.appendChild(chatWindow)
		addChatToChatArea();
	}
	open = open ? false : true;
}

async function displayChat() {
	document.body.appendChild(open ? chatWindow : chatButton);
}

function addChatToChatArea() {
	const chatArea = document.querySelector('.chat-area');
	if (manualChat.length > 0) {
		chatArea.innerHTML = "";
		manualChat.map((chatObj) => {
			let chatDiv = document.createElement('div');
			chatDiv.innerText = `${chatObj.from} :-- ${chatObj.chat} `
			chatArea.appendChild(chatDiv);
		})
	} else {
		if (chatArea.childNodes.length === 0) {
			Object.keys(chatData).forEach(chat => {
				const chatOption = document.createElement('div');
				chatOption.classList.add('chat-option');
				chatOption.innerText = chat;
				chatOption.onclick = () => handleClick(chat);
				chatArea.appendChild(chatOption);
			});
		}
		addBackButton();
	}
}

function addBackButton() {
	const chatArea = document.querySelector('.chat-area');
	const backbtn = document.createElement('div');
	backbtn.classList.add('back-btn');
	backbtn.innerText = "Go To Bach Menue";
	backbtn.style.padding = '5px';
	backbtn.style.fontWeight = '500';
	backbtn.addEventListener('click', handleBackButton);
	if (selectedChat.length > 0) {
		chatArea.appendChild(backbtn);
	}
}