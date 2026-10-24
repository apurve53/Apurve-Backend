// client.js (another script running on same system)

const pokerUsers = [
	{
		username: "Apurve Srivastava",
		email: "apurve@gmail.con",
		password: 'asdasd'
	}
]

async function signupUser(user) {
	try {
		const response = await fetch("https://pwmnfcn7-3000.inc1.devtunnels.ms/poker_signup", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(user)
		});
		const data = await response.json();
		console.log("Signup response", data);
	} catch (err) {
		console.error("Error calling poker_signup:", err);
	}
}

async function deleteAccount() {
	try {

		// Step 2: call delete route with cookies
		let deleteResponse = await fetch("https://pwmnfcn7-3000.inc1.devtunnels.ms/poker_delete_user", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			}
		});
		let result = await deleteResponse.json();
		console.log("Delete response:", result);
	} catch (err) {
		console.error("Error:", err);
	}
}


signupUser(pokerUsers[0]);
setTimeout(() => {
	deleteAccount();
}, 1000);


