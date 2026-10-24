async function checkSesstion() {
	const checkSession = fetch("https://pwmnfcn7-3000.inc1.devtunnels.ms/checksesstion", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			'Accept': 'application/json',
		},
		body: JSON.stringify({ session: window.sessionStorage.getItem("user"), "application": "SBM_Digital" }),
		credentials: "include"
	});
	const response = await checkSession;
	const result = await response.json();
};
checkSesstion()

document.getElementById("loginbtn").addEventListener("click", function () {
	document.getElementById("loginfrm").classList.remove("displayoff");
	document.getElementById("queryfrm").classList.add("displayoff");
});
document.getElementById("querybtn").addEventListener("click", function () {
	document.getElementById("queryfrm").classList.remove("displayoff");
	document.getElementById("loginfrm").classList.add("displayoff");
});
document.getElementById("submitbtn").addEventListener("click", function () {
	let username = document.getElementById("username").value;
	window.sessionStorage.setItem("user", username);
});
document
	.getElementById("queryform")
	.addEventListener("submit", async function (event) {
		event.preventDefault();
		const formData = new FormData(this);
		const queryWithoutSpaces = formData.get("query").trim();
		formData.set("query", queryWithoutSpaces);
		console.log("formData query: ", formData);
		try {
			const response = await fetch("/submit_query", {
				method: "POST",
				body: formData
			});

			const result = await response.json();

			if (response.ok) {
				// Form submitted successfully
				alert(result.message);
			} else {
				// Handle form errors
				alert("Form submission failed. Please check your inputs.");
			}
		} catch (error) {
			console.error("Error submitting form:", error);
		}
	});
