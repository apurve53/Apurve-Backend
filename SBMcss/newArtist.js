const loader = document.getElementById("loader");
const thisUser = window.sessionStorage.getItem("user");
let slideTitle = document.getElementById("header");
let allPaymentForUser = null;
let artistClamRelesList = null;
let contentArea = document.getElementById("section3-content");
function tougleSideBar() {
    if (window.screen.width <= 510) {
        const sidebar = document.getElementById("sidebar");
        const isOpen = sidebar.classList.contains("open");
        sidebar.classList.toggle("open", !isOpen);
        if (document.getElementById("editbuton").classList.contains("display-off")) {
            document.getElementById("editbuton").classList.remove("display-off");
            document.getElementById("artistname").classList.remove("display-off");
            document.getElementById("profilepic").classList.remove("display-off");
            document.getElementById("logoutmobile").classList.remove("display-off");
        } else {
            document.getElementById("editbuton").classList.add("display-off");
            document.getElementById("artistname").classList.add("display-off");
            document.getElementById("profilepic").classList.add("display-off");
            document.getElementById("logoutmobile").classList.add("display-off");
        }
    }

}
document.getElementById("togglesidebar").addEventListener("click", function () {
    tougleSideBar();
});

window.onload = async function () {
    if (thisUser === null) {
        window.location.href = "/";
    }
    document.getElementById("username").value = window.sessionStorage.getItem("user");
    createUserPanal(await getInfoFromServer("userinfo", { user: thisUser }));
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;
    document.getElementById("releaseDate").setAttribute("min", today);
    if (window.screen.width <= 510) {
        document.getElementById("editbuton").classList.add("display-off");
        document.getElementById("artistname").classList.add("display-off");
        document.getElementById("profilepic").classList.add("display-off");
        document.getElementById("logoutmobile").classList.add("display-off");
    }

};

async function handleClickOnService() {
    let dropdown = document.getElementById("dropdown");
    const sidebar = document.getElementById("sidebar");
    const isOpen = sidebar.classList.contains("open");
    if (this.innerText === "Catalogue") {
        createAndAppenduploads(await getInfoFromServer("getuploads", { user: thisUser }));
        tougleSideBar();
    } else if (this.innerText === "YouTube Services" || this.innerText === "YouTube Services ▼") {
        this.innerText = this.innerText === "YouTube Services" ? "YouTube Services ▼" : "YouTube Services";
        dropdown.classList.contains("display-off") ? dropdown.classList.remove("display-off") : dropdown.classList.add("display-off");
    } else if (this.innerText === "Claim Release") {
        artistClamRelesList = await getInfoFromServer("getallclamRelese", {
            user: thisUser
        });
        createAndAppendClames(artistClamRelesList);
        tougleSideBar();
    } else if (this.innerText === "New Release") {
        slideTitle.innerText = "New Release";
        changeVisiblity("useruploadform");
        tougleSideBar();
    } else if (this.innerText === "Payment") {
        allPaymentForUser = await getInfoFromServer("allpaymentforuser", {
            user: thisUser
        });
        createPaymentSection(allPaymentForUser);
        tougleSideBar();
    } else if (this.innerText === "Cntent ID Request") {
        changeVisiblity("contentidreq");
        createContentIdReqForm();
        slideTitle.innerText = "YouTube Content ID Request";
        tougleSideBar();
    } else if (this.innerText === "Artist channel Request") {
        changeVisiblity("artistchannelreq");
        artistChannelReqForm();
        slideTitle.innerText = "Artist channel Request";
        tougleSideBar();
    }
    changeColorOfOptions(this);
}

async function createUserPanal(userInfo) {
    loader.classList.add("display-off");
    document.getElementById("artistname").innerText = userInfo.name;
    if (userInfo.profilepic !== "") {
        document.getElementById("profilepic").src = userInfo.profilepic;
    } else {
        document.getElementById("profilepic").src = "profile-picture.jpg";
    }
    createSidebarOptions(userInfo);
    createAndAppenduploads(await getInfoFromServer("getuploads", { user: thisUser }));
}

function createSidebarOptions(userInfo) {
    let serviceList = userInfo.options;
    serviceList.forEach(service => {
        let listItem = document.createElement("li");
        listItem.className = "services";
        let anchor = document.createElement("a");
        anchor.id = `${service.trim()}`;
        anchor.href = `#${service.trim()}`;
        anchor.textContent = service;
        anchor.addEventListener("click", handleClickOnService);
        listItem.appendChild(anchor);
        document.getElementById("servicearea").appendChild(listItem);

    });
    let youtube = userInfo.ytoptions;
    if (youtube !== undefined && youtube.length > 0) {
        let ytServices = document.createElement("li");
        let anchor = document.createElement("a");
        anchor.href = `#YouTobe Service`;
        anchor.textContent = "YouTube Services";
        anchor.addEventListener("click", handleClickOnService);
        ytServices.appendChild(anchor);
        ytServices.className = "services";
        document.getElementById("servicearea").appendChild(ytServices);
        let dropdownContainer = document.createElement("div");
        dropdownContainer.className = "ytservicecontainer";
        dropdownContainer.classList.add("display-off");
        dropdownContainer.id = "dropdown";
        if (youtube) {
            youtube.forEach(service => {
                let listItem = document.createElement("li");
                listItem.className = "ytservice";
                let anchor = document.createElement("a");
                anchor.id = `${service.trim()}`;
                anchor.href = `#${service.trim()}`;
                anchor.textContent = service;
                anchor.addEventListener("click", handleClickOnService);
                listItem.appendChild(anchor);
                dropdownContainer.appendChild(listItem);
            });
        }
        document.getElementById("servicearea").appendChild(dropdownContainer);
        if (window.screen.width <= 510) {
            let logoutSpan = document.createElement("span");
            logoutSpan.innerText = "Log Out";
            logoutSpan.id = "logoutmobile";
            logoutSpan.classList.add("servicelogout");
            logoutSpan.addEventListener("click", logoutHandle)
            document.getElementById("servicearea").appendChild(logoutSpan);
        }
    }

    let optionsList = document.querySelectorAll(".services");
    for (let i = 0; i < optionsList.length; i++) {
        if (optionsList[i].firstElementChild.innerText === "Catalogue") {
            optionsList[i].classList.add("selected");
            break;
        }
    }
}
document.getElementById("editbuton").addEventListener("click", function () {
    document.getElementById("fileInput").click();
});
document.getElementById("fileInput").addEventListener("change", async event => {
    loader.classList.remove("display-off");
    setTimeout(() => {
        document.getElementById("submitbtn").click();
        loader.classList.add("display-off");
    }, 2000);
});
document.getElementById("profilepicform").addEventListener("submit", async function (event) {
    event.preventDefault();
    loader.classList.remove("display-off");
    const formData = new FormData(this);
    formData.set("user", thisUser);
    const response = await fetch(`/profilepicupload`, {
        method: "POST",
        body: formData
    });
    if (response.ok) {
        let result = await response.text();
        loader.classList.add("display-off");
        alert(result);
        location.reload();
    }
});

//////////////////////////////////////////////////////////////////////////////////////////////
let musicLabel = document.getElementById("upmusic");
let imageLabel = document.getElementById("upimage");
let imageInputField = document.getElementById("imageinput");
let musicInputField = document.getElementById("musicfile");
let musicUploadGuid = document.getElementById("uploadguide");
let imageUploadGuid = document.getElementById("imguploadguid");
let imgUploadArea = document.getElementById("imagefilelbl");
let musicUploadArea = document.getElementById("musicfilelbl");

imageLabel.addEventListener("click", () => {
    imageInputField.click();
});
musicLabel.addEventListener("click", () => {
    musicInputField.click();
});

musicInputField.addEventListener("change", event => {
    musicUploadGuid.innerText = event.target.files[0].name;
});

imageInputField.addEventListener("change", event => {
    imageUploadGuid.innerText = event.target.files[0].name;
});

imgUploadArea.addEventListener("dragover", event => {
    event.preventDefault();
});

imgUploadArea.addEventListener("drop", event => {
    event.preventDefault();
    var files = event.dataTransfer.files;
    imageInputField.files = files;
    if (files.length > 0) {
        let uploadGuide = document.getElementById("imguploadguid");
        imageUploadGuid.innerText = "Selected file: " + files[0].name;
        imageUploadGuid.classList.remove("display-off");
    }
});

musicUploadArea.addEventListener("dragover", event => {
    event.preventDefault();
});

musicUploadArea.addEventListener("drop", event => {
    event.preventDefault();
    var files = event.dataTransfer.files;
    musicInputField.files = files;
    if (files.length > 0) {
        musicUploadGuid.innerText = "Selected file: " + files[0].name;
        musicUploadGuid.classList.remove("display-off");
    }
});
////////////////////////////////////////////////////////////////////////////////////////////
async function getInfoFromServer(route, bodyData) {
    loader.classList.remove("display-off");
    const response = await fetch(`/${route}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        },
        body: JSON.stringify(bodyData)
    });
    let result = "";
    if (response.ok) {
        loader.classList.add("display-off");
        result = await response.json();
        return result;
    }
}
document.getElementById("timeInput").addEventListener("input", formatTime);
function formatTime() {
    console.log("running in in input :");
    let formattedValue = this.value.replace(/\D/g, "");
    if (formattedValue.length > 2) {
        formattedValue = formattedValue.slice(0, 2) + ":" + formattedValue.slice(2, 4) + ":" + formattedValue.slice(4, 6);
    } else if (formattedValue.length > 4) {
        formattedValue = formattedValue.slice(0, 2) + ":" + formattedValue.slice(2, 4) + ":" + formattedValue.slice(4, 6);
    }
    this.value = formattedValue;
}

function artistChannelReqForm() {
    document.getElementById("artistchannelreq").innerHTML = "";
    const form = document.createElement("form");
    form.action = "createoac";
    form.id = "artchareq";
    form.method = "POST";
    let firstSection = document.createElement("div");
    firstSection.className = "firstsection";
    let firstDiv = document.createElement("div");
    firstDiv.className = "firstDiv";
    let label = document.createElement("label");
    label.for = "Artist Name";
    label.innerText = "Artist Name";
    firstDiv.appendChild(label);
    firstDiv.appendChild(document.createElement("br"));
    let input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Artist Name";
    input.name = "Artist Name";
    input.required = true;
    firstDiv.appendChild(input);
    firstSection.appendChild(firstDiv);
    let secondDiv = document.createElement("div");
    label = document.createElement("label");
    label.for = "Label Name";
    label.innerText = "Label Name";
    secondDiv.appendChild(label);
    secondDiv.appendChild(document.createElement("br"));
    input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Channel Name";
    input.name = "Label Name";
    input.required = true;
    secondDiv.appendChild(input);
    firstSection.appendChild(secondDiv);

    let secondSection = document.createElement("div");
    secondSection.className = "secondsection";
    label = document.createElement("label");
    label.for = "Topic Channel URL";
    label.innerText = "Topic Channel URL";
    secondSection.appendChild(label);
    secondSection.appendChild(document.createElement("br"));
    input = document.createElement("input");
    input.type = "text";
    input.placeholder = "URL Ex. https://www.youtube.com/@Channel_ID";
    input.name = "Topic Channel URL";
    input.required = true;
    secondSection.appendChild(input);

    let thirdSection = document.createElement("div");
    thirdSection.className = "secondsection";
    label = document.createElement("label");
    label.for = "Youtube channel URL";
    label.innerText = "YouTube Channel URL (with channel ID) Cstome URL not allowed";
    thirdSection.appendChild(label);
    thirdSection.appendChild(document.createElement("br"));

    input = document.createElement("input");
    input.type = "text";
    input.placeholder = "URL Ex. https://www.youtube.com/@Channel_ID";
    input.name = "Youtube channel URL";
    input.required = true;
    thirdSection.appendChild(input);

    let fourthSection = document.createElement("div");
    fourthSection.className = "fourthsection";
    let lebelDiv = document.createElement("div");

    label = document.createElement("label");
    label.for = "UPC1";
    label.innerText = "3 Song UPC";
    lebelDiv.appendChild(label);
    fourthSection.appendChild(lebelDiv);
    let fourthInputSection = document.createElement("div");
    input = document.createElement("input");
    input.type = "text";
    input.placeholder = "UPC 1";
    input.name = "UPC1";
    fourthInputSection.appendChild(input);
    fourthInputSection.className = "upcdiv";
    input = document.createElement("input");
    input.type = "text";
    input.placeholder = "UPC 2";
    input.name = "UPC2";
    fourthInputSection.appendChild(input);
    input = document.createElement("input");
    input.type = "text";
    input.placeholder = "UPC 3";
    input.name = "UPC3";
    fourthInputSection.appendChild(input);
    fourthSection.appendChild(fourthInputSection);
    form.appendChild(firstSection);
    form.appendChild(secondSection);
    form.appendChild(thirdSection);
    form.appendChild(fourthSection);
    let submitBtn = document.createElement("input");
    submitBtn.type = "submit";
    submitBtn.innerText = "Submit";
    form.appendChild(submitBtn);
    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        loader.classList.remove("display-off");
        const formData = new FormData(this);
        formData.append("user", thisUser);
        const response = await fetch(`createoac`, {
            method: "POST",
            body: formData
        });
        if (response.ok) {
            let result = await response.text();
            loader.classList.add("display-off");
            alert(result);
            this.reset();
        }
    });
    document.getElementById("artistchannelreq").appendChild(form);
}
function createContentIdReqForm() {
    document.getElementById("contentidreq").innerHTML = "";
    const form = document.createElement("form");
    form.id = "contentidreqform";
    form.className = "cirform";
    const requestTypeLabel = document.createElement("label");
    requestTypeLabel.setAttribute("for", "Request Type");
    requestTypeLabel.textContent = "Request Type:";
    form.appendChild(requestTypeLabel);
    form.appendChild(document.createElement("br"));

    const requestTypeSelect = document.createElement("select");
    requestTypeSelect.setAttribute("id", "requestType");
    requestTypeSelect.setAttribute("name", "Request Type");

    const optionDefault = document.createElement("option");
    optionDefault.setAttribute("value", "");
    optionDefault.selected = true;
    optionDefault.disabled = true;
    optionDefault.textContent = "Content ID ON / Content ID OFF";
    requestTypeSelect.appendChild(optionDefault);

    const onOption = document.createElement("option");
    onOption.setAttribute("value", "on");
    onOption.textContent = "On";
    requestTypeSelect.appendChild(onOption);

    const offOption = document.createElement("option");
    offOption.setAttribute("value", "off");
    offOption.textContent = "Off";
    requestTypeSelect.appendChild(offOption);

    form.appendChild(requestTypeSelect);
    form.appendChild(document.createElement("br"));

    const albumTitleLabel = document.createElement("label");
    albumTitleLabel.setAttribute("for", "Album Title");
    albumTitleLabel.textContent = "Album Title:";
    form.appendChild(albumTitleLabel);
    form.appendChild(document.createElement("br"));

    const albumTitleInput = document.createElement("input");
    albumTitleInput.setAttribute("type", "text");
    albumTitleInput.setAttribute("id", "albumTitle");
    albumTitleInput.setAttribute("name", "Album Title");
    albumTitleInput.setAttribute("required", "true");
    albumTitleInput.setAttribute("placeholder", "Your Song Title");
    form.appendChild(albumTitleInput);
    form.appendChild(document.createElement("br"));

    let label3 = document.createElement("label");
    label3.for = "Label Name";
    label3.innerText = "Label Name";
    form.appendChild(label3);
    form.appendChild(document.createElement("br"));

    let LabelName = document.createElement("input");
    LabelName.name = "Label Name";
    LabelName.placeholder = "Your Label Name";
    LabelName.type = "text";
    LabelName.required = true;
    form.appendChild(LabelName);
    form.appendChild(document.createElement("br"));

    let label4 = document.createElement("label");
    label4.for = "Album UPC";
    label4.innerText = "Album UPC";
    form.appendChild(label4);
    form.appendChild(document.createElement("br"));

    let albumUpc = document.createElement("input");
    albumUpc.name = "Album UPC";
    albumUpc.placeholder = "Enter UPC/EAN";
    albumUpc.required = true;
    albumUpc.type = "text";
    form.appendChild(albumUpc);
    form.appendChild(document.createElement("br"));

    let label5 = document.createElement("label");
    label5.for = "Song ISRC";
    label5.innerText = "Song ISRC";
    form.appendChild(label5);
    form.appendChild(document.createElement("br"));

    let songIsrc = document.createElement("input");
    songIsrc.name = "Song ISRC";
    songIsrc.placeholder = "Enter ISRC";
    songIsrc.required = true;
    songIsrc.type = "text";

    form.appendChild(songIsrc);
    form.appendChild(document.createElement("br"));

    let label6 = document.createElement("label");
    label6.for = "YouTube URL";
    label6.innerText = "YouTube URL";
    form.appendChild(label6);
    form.appendChild(document.createElement("br"));

    let youtubeUrl = document.createElement("input");
    youtubeUrl.name = "YouTube URL";
    youtubeUrl.placeholder = "YouTube Topic Channel Video Link";
    youtubeUrl.required = true;
    youtubeUrl.type = "text";
    form.appendChild(youtubeUrl);
    form.appendChild(document.createElement("br"));

    const submitButton = document.createElement("input");
    submitButton.setAttribute("type", "submit");
    submitButton.setAttribute("value", "Submit");
    form.appendChild(submitButton);

    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        loader.classList.remove("display-off");
        const formData = new FormData(this);
        console.log("Formdaa value :", formData.get("Request Type"));
        if (formData.get("Request Type") == null) {
            alert("Please Select Request Type On/OFF");
            loader.classList.add("display-off");
        } else {
            formData.append("user", thisUser);
            const response = await fetch(`contentidrequest`, {
                method: "POST",
                body: formData
            });
            if (response.ok) {
                let result = await response.text();
                loader.classList.add("display-off");
                alert(result);
                this.reset();
            }
        }
    });
    document.getElementById("contentidreq").appendChild(form);
}

function changeColorOfOptions(element) {
    let optionsList = document.querySelectorAll(".services, .ytservice");
    for (let i = 0; i < optionsList.length; i++) {
        if (element.innerText != "YouTube Services" && element.innerText != "YouTube Services ▼") {
            if (optionsList[i].firstElementChild.innerText === element.innerText) {
                optionsList[i].classList.add("selected");
            } else {
                optionsList[i].classList.remove("selected");
            }
        } else {
            element.innerText = element.innerText === "YouTube Services" ? "YouTube Services ▼" : "YouTube Services";
        }
    }
}
async function getDownloadPaymentDetail() {
    try {
        const response = await fetch("/downloadpaymentdetail", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ user: window.sessionStorage.getItem("user") })
        });
        if (response.status === 200) {
            const blob = await response.blob();
            console.log(blob);
            const link = document.createElement("a");
            link.download = "payment detail.xlsx";

            link.href = window.URL.createObjectURL(blob);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            alert("Form submission failed. Please check your inputs.");
        }
    } catch (error) {
        // console.error("Error submitting form:", error);
    }
}
function createPaymentSection(data) {
    console.log("data :", data);
    const paymentDiv = document.getElementById("paymentdiv");
    paymentDiv.innerHTML = "";
    paymentTableButtons(paymentDiv);
    slideTitle.innerText = "Your Payments";
    // if (!document.getElementById("downloadbtn")) {
    //     let headerDiv = document.getElementById("headerdiv");
    //     let downloadBtn = document.createElement("div");
    //     downloadBtn.id = "downloadbtn";
    //     downloadBtn.innerText = "Download Payment Details";
    //     headerDiv.appendChild(downloadBtn);
    //     downloadbtn.addEventListener("click", getDownloadPaymentDetail);
    // }

    const table = document.createElement("table");
    table.id = "allpaymenttable";
    table.classList.add("payment-table");
    // Create header row
    const headerRow = table.insertRow();
    const headerPlatform = headerRow.insertCell();
    const headerPayCell = headerRow.insertCell();
    const headerTimeCell = headerRow.insertCell();
    headerPlatform.textContent = "Platform";
    headerPayCell.textContent = "Pay";
    headerTimeCell.textContent = "Time";

    // Iterate over the data and create rows
    for (const platform in data) {
        data[platform].forEach(payment => {
            const row = table.insertRow();
            const platformCell = row.insertCell();
            platformCell.textContent = platform;
            const payCell = row.insertCell();
            const timeCell = row.insertCell();
            timeCell.className = "timecell";
            payCell.textContent = payment.pay;
            const trimmedDateString = payment.time.replace(/ GMT.*/, "");
            let downloadButton = document.createElement("div");
            downloadButton.innerText = "Download Details";
            downloadButton.className = "downloadbtn";
            downloadButton.addEventListener("click", downloadThisMonthPayment);
            timeCell.textContent = trimmedDateString;
            timeCell.appendChild(downloadButton);
        });
    }
    paymentDiv.appendChild(table);
    changeVisiblity("paymentdiv");
}
async function downloadThisMonthPayment() {
    console.log(this);
    const platform = this.parentElement.parentElement.children[0].textContent;
    const month = this.parentElement.textContent.split(" ")[0];
    let year = this.parentElement.textContent.split(" ")[1];
    year = year.replace("Download", "");
    let relatedData = { user: thisUser, platform: platform, month: month, year: year };
    try {
        const response = await fetch("/downloadpaymentdetail", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(relatedData)
        });
        if (response.status === 200) {
            const blob = await response.blob();
            console.log(blob);
            const link = document.createElement("a");
            link.download = "payment detail.xlsx";

            link.href = window.URL.createObjectURL(blob);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            alert("Form submission failed. Please check your inputs.");
        }
    } catch (error) {
        // console.error("Error submitting form:", error);
    }
}
function createAndAppendClames(clameReleseList) {
    let clameReleseParent = document.getElementById("clamerelese");
    clameReleseParent.innerHTML = "";
    slideTitle.innerText = "YouTube Claim Release";
    let ol = document.createElement("ol");

    for (let i = 0; i < clameReleseList.length; i++) {
        let newReleseDiv = document.createElement("div");
        newReleseDiv.className = "clam-reelese-div";
        newReleseDiv.appendChild(ol);
        let newLi = document.createElement("li");
        ol.appendChild(newLi);

        let linkElement = document.createElement("a");
        linkElement.className = "atag";
        linkElement.href = decodeURIComponent(clameReleseList[i].link);
        linkElement.innerText = decodeURIComponent(clameReleseList[i].link);
        linkElement.target = "_blank";
        newLi.appendChild(linkElement);
        if (clameReleseList[i].resion) {
            let resionText = document.createElement("div");
            newLi.append(clameReleseList[i].resion);
        }
        let statusArea = document.createElement("div");
        statusArea.className = "statusarea";

        statusArea.innerText = clameReleseList[i].status;
        statusArea.classList.add(statusAreaColor(clameReleseList[i].status));
        newLi.appendChild(statusArea);
        ol.appendChild(newLi);
    }
    clameReleseParent.appendChild(ol);
    changeVisiblity("linkdiv");
}

function statusAreaColor(status) {
    if (status === "Pending") {
        // return "#ffd800c9";
        return "yellow";
    } else if (status === "Claim Released") {
        return "green";
    } else if (status === "Rejected") {
        return "red";
    }
}

function changeVisiblity(fieldToDisp) {
    let idList = ["useruploadform", "filediv", "linkdiv", "paymentdiv", "contentidreq", "artistchannelreq"];
    for (let i = 0; i < idList.length; i++) {
        if (idList[i] === fieldToDisp) {
            document.getElementById(fieldToDisp).classList.remove("display-off");
            console.log("Matched :", document.getElementById(fieldToDisp))
        } else {
            document.getElementById(idList[i]).classList.add("display-off");
            console.log("unmatched :", document.getElementById(idList[i]))

        }
    }
    window.scrollTo(0, 0);
}
async function addNewClameRelese() {
    let inputurlValue = document.getElementById("linkInput").value;
    let bodyData = { link: encodeURIComponent(inputurlValue), user: thisUser };
    let newLink = await getInfoFromServer("cleamrelese", bodyData);
    createAndAppendClames(await getInfoFromServer("getallclamRelese", { user: thisUser }));
}
function createAndAppenduploads(respObject) {

    const uploadsContainer = document.getElementById("section3-content");
    const fileDiv = document.getElementById("filediv");
    let fileList = respObject.fileList;
    fileDiv.innerHTML = "";
    if (fileList.length === 0) {
        let emptyDiv = document.createElement("div");
        emptyDiv.className = "emptydiv";
        emptyDiv.innerHTML = "You have no Uploades yet";
        fileDiv.classList.add("nouploads");
        fileDiv.classList.remove("filediv");
        fileDiv.appendChild(emptyDiv);
    } else {
        fileDiv.classList.remove("nouploads");
        fileDiv.classList.add("filediv");
    }

    slideTitle.innerText = "All Releases";
    for (let i = 0; i < fileList.length; i++) {
        const audioName = fileList[i].audio;
        const imageName = fileList[i].img;
        // Create a card element
        const card = document.createElement("div");
        card.classList.add("card");
        // Create an audio element
        // const audioElement = document.createElement("audio");
        // audioElement.controls = true;
        // audioElement.src = `${audioName}`;
        // card.appendChild(audioElement);
        // Create an image element
        const imageElement = document.createElement("img");
        imageElement.className = "thumbnail";
        imageElement.src = `${imageName}`;
        card.appendChild(imageElement);
        let songTitle = document.createElement("h3");
        songTitle.innerText = audioName;
        card.appendChild(songTitle);
        let artistName = document.createElement("p");
        artistName.innerText = fileList[i].artist;
        card.appendChild(artistName);
        let statusDiv = document.createElement("div");
        statusDiv.className = "status";
        if (fileList[i].status === "Rejected") {
            statusDiv.classList.add("statusbutton");
            statusDiv.addEventListener("click", async function () {
                let resionDiv = document.createElement("div");
                let crossButton = document.createElement("span");
                crossButton.className = "crossButton";
                crossButton.innerText = "✖";
                crossButton.onclick = function (event) {
                    event.stopPropagation();
                    resionDiv.remove();
                };
                resionDiv.classList.add("resiondiv");
                resionDiv.appendChild(crossButton);
                resionDiv.appendChild(document.createElement("br"));
                let textDiv = document.createElement("p");
                textDiv.className = "textdiv";
                textDiv.innerText = fileList[i].resion;
                resionDiv.appendChild(textDiv);
                let slidHeader = document.getElementById("slidheader");
                slidHeader.insertBefore(resionDiv, slidHeader.children[1]);
            });
        }
        statusDiv.innerText = fileList[i].status;
        card.appendChild(statusDiv);
        // Append the card to the uploads container
        fileDiv.appendChild(card);
    }
    changeVisiblity("filediv");
}

document.getElementById("useruploadform").addEventListener("submit", async function (event) {
    event.preventDefault();
    document.getElementById("loader").classList.remove("display-off");
    const formData = new FormData(this);
    formData.set("user", window.sessionStorage.getItem("user"));
    try {
        const response = await fetch("/upload", {
            method: "POST",
            body: formData
        });
        const result = await response.json();
        if (response.ok) {
            document.getElementById("loader").classList.add("display-off");
            alert(result.message);
            this.reset();
            musicUploadGuid.innerText = "No Music File is Selected";
            imageUploadGuid.innerText = "No Image File is selected";
        } else {
            alert("Form submission failed. Please check your inputs.");
        }
    } catch (error) {
        console.error("Error submitting form:", error);
    }
});

function paymentTableButtons(paymentDiv) {
    const containerDiv = document.createElement("div");
    containerDiv.classList.add("payment-table-button-container");

    const allPaymentsBtn = document.createElement("button");
    allPaymentsBtn.id = "allpaymentbtn";
    allPaymentsBtn.classList.add("pbutton");
    allPaymentsBtn.textContent = "All Payments";

    const totalPaymentsBtn = document.createElement("button");
    totalPaymentsBtn.id = "totelpayments";
    totalPaymentsBtn.classList.add("pbutton");
    totalPaymentsBtn.textContent = "Total Payment";

    containerDiv.appendChild(allPaymentsBtn);
    containerDiv.appendChild(totalPaymentsBtn);

    paymentDiv.appendChild(containerDiv);

    allPaymentsBtn.addEventListener("click", function () {
        createPaymentSection(allPaymentForUser);
    });

    totalPaymentsBtn.addEventListener("click", async function () {
        let totlePayments = await getInfoFromServer("allpaymentforuser", {
            user: window.sessionStorage.getItem("user")
        });
        createTotlePaymentSection(totlePayments, paymentDiv);
    });
}

function createTotlePaymentSection(data, divForTable) {
    const monthlyTotal = {};
    for (const platform in data) {
        data[platform].forEach(entry => {
            const key = `${entry.yearofpay}-${entry.monthofpay}`;
            if (!monthlyTotal[key]) {
                monthlyTotal[key] = 0;
            }
            monthlyTotal[key] += entry.pay;
        });
    }

    const table = document.createElement("table");
    table.className = "payment-table";
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    const headerRow = document.createElement("tr");
    headerRow.innerHTML = "<th>Month</th><th>Total Pay</th>";
    thead.appendChild(headerRow);
    table.appendChild(thead);

    for (const monthKey in monthlyTotal) {
        const monthRow = document.createElement("tr");
        const [year, month] = monthKey.split("-");
        monthRow.innerHTML = `<td>${month} ${year}</td><td>${monthlyTotal[monthKey]}</td>`;
        tbody.appendChild(monthRow);
    }

    table.appendChild(tbody);
    divForTable.innerHTML = "";
    paymentTableButtons(divForTable);

    divForTable.appendChild(table);
}
document.getElementById("linkSubmit").addEventListener("click", async function () {
    let inputurlValue = document.getElementById("linkInput").value;
    if (inputurlValue !== "") {
        let newClame = await getInfoFromServer("cleamrelese", {
            link: encodeURIComponent(inputurlValue),
            user: thisUser
        });
        artistClamRelesList.unshift(newClame);
        createAndAppendClames(artistClamRelesList);
        document.getElementById("linkInput").value = "";
    }
});

createSelectList();
async function createSelectList() {
    let ListOfSelectLists = await getInfoFromServer("selectlists", {
        user: thisUser
    });
    let languages = ListOfSelectLists[0];
    const selectElement = document.getElementById("language");
    // Create options dynamically
    languages.forEach(language => {
        const optionElement = document.createElement("option");
        optionElement.value = language.toLowerCase();
        optionElement.textContent = language;
        selectElement.appendChild(optionElement);
    });
    let genre = ListOfSelectLists[1];
    const generElement = document.getElementById("genre");
    // Create options dynamically
    genre.forEach(gen => {
        const optionElement = document.createElement("option");
        optionElement.value = gen.toLowerCase();
        optionElement.textContent = gen;
        generElement.appendChild(optionElement);
    });
    let subGenre = ListOfSelectLists[2];
    const subGenreElement = document.getElementById("subgenre");
    // Create options dynamically
    subGenre.forEach(subgen => {
        const optionElement = document.createElement("option");
        optionElement.value = subgen.toLowerCase();
        optionElement.textContent = subgen;
        subGenreElement.appendChild(optionElement);
    });

    let moods = ListOfSelectLists[3];
    const moodsElement = document.getElementById("mood");
    moods.forEach(mood => {
        const optionElement = document.createElement("option");
        optionElement.value = mood.toLowerCase();
        optionElement.textContent = mood;
        moodsElement.appendChild(optionElement);
    });
}
async function logoutHandle() {
    if (confirm("Do you Want to log out now")) {
        const response = await fetch(`/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            body: JSON.stringify({ user: thisUser })
        });
        if (response.ok) {
            window.sessionStorage.removeItem("user");
            window.location.href = "/";
        }
    }
}
document.getElementById("lgout").addEventListener("click", logoutHandle);