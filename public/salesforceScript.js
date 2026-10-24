const chatButton = renderChatButton();
const chatWindow = renderChatBox();
let manualChat = [];
let encUser = null;
var socket;
let open = false;
let chatData = {};
let selectedChat = [];
let chatDataRef = {};
var socket;


(async function () {
	console.log('External Script Run');
	await getUserChat();
	await dislayChat();
})()

async function dislayChat() {
	console.log('Display chat function');
	console.log('In displayChat function open ::');

	document.body.appendChild(open ? chatWindow : chatButton);
}

function toggleChat(evt) {
	console.log('Target ::', evt.target);
	console.log('Toggel Chat function ::', open);
	if (open) {
		console.log('chat closing');
		const chatBox = document.querySelector('.chat-box');
		chatBox.remove();
		document.body.appendChild(chatButton);
	} else {
		console.log('chat opening');
		const chatBtn = document.querySelector('.chat-toggle-button');
		chatBtn.remove();
		console.log('chatBtn removed');
		document.body.appendChild(chatWindow);
		console.log('appending chatWindow after log');
		addChatToChatArea();
	}
	open = open ? false : true;
	console.log('in last of togel chat :: ', open);

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

function renderChatBox() {
	console.log('Render Chat Box');
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

function handleSend() {
	try {
		console.log('From another Script ::', test2);
	} catch (error) {
		return
	}
	let typedChat = document.getElementById("apchatapp22692").value;
	console.log('Typesd Chat ::', typedChat);

	manualChat.push({ "chat": typedChat, "from": "Me" });
	addChatToChatArea();
	socket.emit('chat', typedChat);
	document.getElementById("apchatapp22692").value = "";
}

function addChatToChatArea() {
	const chatArea = document.querySelector('.chat-area');
	console.log(' addChatToChatArea chat area using var manualChat ::', manualChat);
	if (manualChat.length > 0) {
		chatArea.innerHTML = "";
		manualChat.map((chatObj) => {
			let chatDiv = document.createElement('div');
			chatDiv.innerText = `${chatObj.from} :-- ${chatObj.chat} `
			chatArea.appendChild(chatDiv);
		})
	} else {
		if (chatArea.childNodes.length === 0) {
			console.log('iske neeche');
			Object.keys(chatData).forEach(chat => {
				console.log('Is it here?');
				const chatOption = document.createElement('div');
				chatOption.classList.add('chat-option');
				chatOption.innerText = chat;
				chatOption.onclick = () => handleClick(chat);
				chatArea.appendChild(chatOption);
			});
		}
		addBackButton();
	}

	function handleClick(chat) {
		if (Object.keys(chatData[chat]).length > 0) {
			chatData = chatData[chat];
			selectedChat.push(chat);
			updateChatView();
		}
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

const getUserChat = async () => {
	console.log('getting user chat ::');
	let response = await fetch('https://pwmnfcn7-443.inc1.devtunnels.ms/userchat', {
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