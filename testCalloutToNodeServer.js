(function () {
	console.log("calling a test callout script file.");
	fetch('https://pwmnfcn7-443.inc1.devtunnels.ms/')
		.then(response => {
			console.log('debug 2');

			if (!response.ok) {
				console.log('debug 3');

				throw new Error(`HTTP error! Status: ${response.status}`);
			}
			return response.json(); // or response.text() if it returns HTML/text
		})
		.then(data => {
			console.log('Success:', data);
		})
		.catch(error => {
			console.log('error 1');
			console.error('Error fetching data:', error);
		});
})()
