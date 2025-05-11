// console.log("This is render.js : ", electronAPI.ping());

function submitURL() {
    const urlInput = document.getElementById('urlid');
    window.electronAPI.submiturl(urlInput.value);
}

// /home/apurv/Desktop/Desktop App/Electrone-Application/Electrone Application