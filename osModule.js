const os = require('os');
const localAddress = {
	runningIp: "",
	setAddress: function () {
		if (this.runningIp == "") {
			let networkInterfaces = os.networkInterfaces();
			Object.values(networkInterfaces).some(interfaces => {
				interfaces.some(interfaceObj => {
					if (this.runningIp == "") {
						interfaceObj.address.includes("192.168.1") ? this.runningIp = interfaceObj.address : this.runningIp = "";
					}
				})
			});
			return this.runningIp;
		} else {
			return this.runningIp;
		}
	},
	seAddress_mac: function () {
		if (this.runningIp == "") {
			const data = os.networkInterfaces();
			for (const interfaceKey in data) {
				if (data.hasOwnProperty(interfaceKey)) {
					const interfaceData = data[interfaceKey];
					interfaceData.forEach(entry => {
						if (entry.family === 'IPv4' && entry.mac !== '00:00:00:00:00:00') {
							this.runningIp = entry.address;
						}
					});
				}
			}
			return this.runningIp;
		} else {
			return this.runningIp;
		}
	}
}
// console.log('local Address ::', localAddress.seAddress_mac())
// console.log('local Address ::', os.networkInterfaces())

module.exports = localAddress;