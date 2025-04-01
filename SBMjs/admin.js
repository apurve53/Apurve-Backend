
///////////////////////////////////////////////
let addNewAmountFormElement = "";
let addNewPlatformFormElement = "";
let thisUser = window.sessionStorage.getItem("user");
//addamountform and  newplatformform and centerdiv and platforms
let downloadSelectedInExcel = [];
let userWithPayment = [];
window.onload = async function () {
    if (thisUser === null) {
        window.location.href = "/";
    }
};
// Array of operation names
const operations = ["operation1", "operation2", "operation3", "operation4", "operation5", "operation6", "operation7", "operation8", "operation9"];
const sOprations = ["soperation1", "soperation2", "soperation3", "soperation4", "soperation5", "soperation6", "soperation7", "soperation8", "soperation9"];
// Loop to set up event listeners
operations.forEach((operation, index) => {
    const btn = document.getElementById(`operation${index + 1}Btn`);
    btn.addEventListener("click", function () {
        showFiles(operation);
    });
});
sOprations.forEach((operation, index) => {
    const btn = document.getElementById(`soperation${index + 1}Btn`);
    btn.addEventListener("click", function () {
        console.log("console by jugad : ", btn);
        console.log("printing by this :", this);
        console.log("button is working:");
        showFiles(operation);
    });
});

//////////////////////////////////////////////////////////////////////////////////////////////
document.getElementById("togglesidebar").addEventListener("click", function () {
    const sidebar = document.getElementById("sidebar");
    const isOpen = sidebar.classList.contains("open");
    sidebar.classList.toggle("open", !isOpen);

});
function closeSidebar() {
    const sidebarOperationsArea = document.getElementById("sidebaroperations");
    const allOprations = document.getElementById("operations");
    const isOpen = sidebar.classList.contains("open");
    // sidebarOperationsArea.innerHTML = allOprations.innerHTML;
    sidebar.classList.toggle("open", !isOpen);
}
// document.addEventListener( "click", function ( event ) {
//     console.log( "gsgfsf" );
//     const sidebar = document.getElementById( "sidebar" );
//     const isClickInsideSidebar = sidebar.contains( event.target );
//     const isSidebarButton = event.target.classList.contains( "sidebar-toggle" );
//     if ( !isClickInsideSidebar && !isSidebarButton ) {
//         closeSidebar();
//     }
// } );
/////////////////////////////////////////////////////////////////////////////////////////////
function showFiles(operation) {
    console.log("operation :", operation);
    closeSidebar();
    const operationContents = document.querySelectorAll(".middle > div");
    operationContents.forEach(content => {
        content.classList.add("display-off");
    });

    if (operation.charAt(0) === 's') {
        operation = operation.slice(1);
    }
    const operationContent = document.getElementById(`${operation}Content`);
    operationContent.classList.remove("display-off");
    if (operation.includes("1")) {
        loadFileNames(operation);
    }
    if (operation.includes("2")) {
        loadUserNames();
    }

    if (operation.includes("4")) {
        findQueries();
    }
    if (operation.includes("5")) {
        getAllClamRelese();
    }
    if (operation.includes("6")) {
        getAllPayment();
    }
    if (operation.includes("7")) {
        createUserEditArea();
    }
    if (operation.includes("8")) {
        createYoutubeContentReqArea();
    }
    if (operation.includes("9")) {
        createOACArea();
    }
}
async function createOACArea() {
    let allOac = await getInfoFromServer("alloac", { user: thisUser });
    let tableHolder = document.getElementById("operation9Content");
    tableHolder.innerHTML = "";
    let userTable = document.createElement("table");
    tableHolder.appendChild(userTable);
    let thead = document.createElement("thead");
    userTable.appendChild(thead);
    let tr = document.createElement("tr");
    thead.appendChild(tr);
    let td = document.createElement("td");
    td.innerText = "Artist";
    tr.appendChild(td);
    td = document.createElement("td");
    td.innerText = "YouTube OAC Channels";
    tr.appendChild(td);
    let tbody = document.createElement("tbody");
    userTable.appendChild(tbody);
    for (let [user, oacList] of Object.entries(allOac)) {
        tr = document.createElement("tr");
        tbody.appendChild(tr);
        td = document.createElement("td");
        td.innerText = user;
        tr.appendChild(td);
        td = document.createElement("td");
        tr.appendChild(td);
        createTdForYTRequests(oacList, "Label Name", td);
    }
}
async function getInfoFromServer(route, bodyData) {
    const response = await fetch(`/${route}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        },
        body: JSON.stringify(bodyData)
    });
    let result = await response.json();
    if (response.ok) {
        if (result) {
            return result;
        } else {
            return "Opration Done";
        }
    }
}

async function sendInfoToServer(route, bodyData) {
    const response = await fetch(`/${route}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        },
        body: JSON.stringify(bodyData)
    });
    if (response.ok) {
        return "Opration Done";
    }
}
async function createYoutubeContentReqArea() {
    let tableHolder = document.getElementById("operation8Content");
    tableHolder.innerHTML = "";
    let allUsersWithYtreqs = await getInfoFromServer("allytcreq", {
        user: thisUser
    });
    let userTable = document.createElement("table");
    tableHolder.appendChild(userTable);
    let thead = document.createElement("thead");
    userTable.appendChild(thead);
    let tr = document.createElement("tr");
    thead.appendChild(tr);
    let td = document.createElement("td");
    td.innerText = "Artist";
    tr.appendChild(td);
    td = document.createElement("td");
    td.innerText = "YouTube ID Content Request";
    tr.appendChild(td);
    let tbody = document.createElement("tbody");
    userTable.appendChild(tbody);
    for (let [user, ytRequests] of Object.entries(allUsersWithYtreqs)) {
        tr = document.createElement("tr");
        tbody.appendChild(tr);
        td = document.createElement("td");
        td.innerText = user;
        tr.appendChild(td);
        td = document.createElement("td");
        tr.appendChild(td);
        createTdForYTRequests(ytRequests, "Album Title", td);
    }
}
function createTdForYTRequests(dataList, property, td) {
    dataList.forEach(data => {
        const value = data[property];
        const createdDiv = document.createElement("div");
        createdDiv.classList.add("section");
        // Add cross button
        const crossButton = document.createElement("span");
        crossButton.classList.add("crossButton");
        crossButton.textContent = "✖";
        crossButton.onclick = async function (event) {
            event.stopPropagation();
            let relatedUser = this.closest("tr").firstElementChild.innerText;
            let reqTitle = this.parentElement.children[1].innerText;
            let reqBody = {
                user: thisUser,
                title: reqTitle,
                relateduser: relatedUser
            };
            if (property === "albumTitle") {
                let removedRequest = await sendInfoToServer("removeuserytreq", reqBody);
            }
            if (property === "Label Name") {
                let removedRequest = await sendInfoToServer("removeoac", reqBody);
            }
            createdDiv.remove();
        };

        // Create content with property and value
        const content = document.createElement("p");
        content.textContent = `${value}`;

        createdDiv.appendChild(crossButton);
        createdDiv.appendChild(content);
        createdDiv.addEventListener("click", function (event) {
            createYCIReqDiv(data);
        });
        // Append the created div to the body or another container
        td.appendChild(createdDiv);
    });
}
function createYCIReqDiv(ycirReq) {
    const centeredDiv = document.createElement("div");
    centeredDiv.className = "centered-div";
    const table = document.createElement("table");
    for (const property in ycirReq) {
        if (ycirReq.hasOwnProperty(property)) {
            const value = ycirReq[property];
            const row = table.insertRow();
            const cell1 = row.insertCell(0);
            cell1.textContent = property;
            const cell2 = row.insertCell(1);
            cell2.textContent = value;
        }
    }
    const crossButton = document.createElement("span");
    crossButton.classList.add("crossButton");
    crossButton.textContent = "✖";
    crossButton.onclick = function () {
        centeredDiv.remove();
    };
    centeredDiv.appendChild(crossButton);
    centeredDiv.appendChild(table);
    document.body.appendChild(centeredDiv);
    centeredDiv.style.display = "block";
}
async function createUserEditArea() {
    let usersAndOptions = await getInfoFromServer("userwithoptions", {
        user: window.sessionStorage.getItem("user")
    });
    console.log(usersAndOptions);
    let restrictedUsers = usersAndOptions.restusers;
    let allOptions = usersAndOptions.options;
    let ytOptions = usersAndOptions.ytoptions;
    let allUsers = Object.keys(usersAndOptions);

    allUsers.splice(0, 3);
    let table = document.createElement("table");
    let thead = document.createElement("thead");
    let tbody = document.createElement("tbody");
    table.appendChild(thead);
    table.appendChild(tbody);
    for (let i = 0; i < allUsers.length; i++) {
        let tr = document.createElement("tr");
        tbody.appendChild(tr);
        let td1 = document.createElement("td");
        td1.innerText = allUsers[i];
        let delUserBtn = document.createElement("button");
        delUserBtn.className = "deluser";
        delUserBtn.innerText = "Delete";
        delUserBtn.addEventListener("click", deleteUser);
        td1.appendChild(delUserBtn);
        let restrectBtnDiv = document.createElement("div");
        td1.appendChild(restrectBtnDiv);
        let restractBtn = document.createElement("input");
        restractBtn.type = "checkbox";
        restractBtn.checked = restrictedUsers.includes(allUsers[i]) ? true : false;
        restractBtn.name = "restract";
        restractBtn.addEventListener("change", restractUser);
        let label = document.createElement("label");
        label.for = "restract";
        label.innerText = "Restricted :";
        restrectBtnDiv.appendChild(label);
        restrectBtnDiv.appendChild(restractBtn);
        tr.appendChild(td1);
        let td2 = document.createElement("td");
        tr.appendChild(td2);
        let td2Div = document.createElement("div");
        td2Div.className = "optionDiv";
        td2.appendChild(td2Div);
        for (let j = 0; j < allOptions.length; j++) {
            let lable = document.createElement("label");
            let chkbox = document.createElement("input");
            chkbox.type = "checkbox";
            chkbox.checked = usersAndOptions[allUsers[i]].options.includes(allOptions[j]) ? true : false;
            chkbox.addEventListener("change", addOrRemoveOptionToUser);
            lable.appendChild(chkbox);
            lable.append(allOptions[j]);
            td2Div.appendChild(lable);
            td2Div.appendChild(document.createElement("br"));
        }
        for (let j = 0; j < ytOptions.length; j++) {
            let lable = document.createElement("label");
            let chkbox = document.createElement("input");
            chkbox.type = "checkbox";
            chkbox.checked = usersAndOptions[allUsers[i]].ytoptions.includes(ytOptions[j]) ? true : false;
            chkbox.addEventListener("change", addOrRemoveOptionToUser);
            lable.appendChild(chkbox);
            lable.append(ytOptions[j]);
            td2Div.appendChild(lable);
            td2Div.appendChild(document.createElement("br"));
        }
    }
    document.getElementById("usereditarea").innerHTML = "";
    document.getElementById("usereditarea").appendChild(table);
}
async function restractUser() {
    const user = this.closest("tr").querySelector("td:first-child").innerText.trim().split("Delete")[0].trim();
    reqObj = { user: thisUser, relateduser: user };
    console.log("user to restract :", reqObj);
    let restractUser = await sendInfoToServer("restractuser", reqObj);
}
async function deleteUser(event) {
    // console.log(event.target.closest(tr).firstElementChild.innerText);
    // console.log(this.parentNode.textContent.trim().split('Delete')[0].trim());
    // var user = this.parentNode.textContent.trim().split('Delete')[0].trim();
    const user = this.closest("tr").querySelector("td:first-child").innerText.trim().split("Delete")[0].trim();
    let deletedUser = await sendInfoToServer("deleteuser", {
        user: thisUser,
        relateduser: user
    });
    if (deletedUser === "Opration Done") {
        this.closest("tr").remove();
    }
}
async function addOrRemoveOptionToUser() {
    console.log("checked or not checked : ", this.checked);
    let relatedUser = this.closest("tr").firstElementChild.innerText;
    relatedUser = relatedUser.replace("Delete", "");
    relatedUser = relatedUser.replace("Restricted :", "");
    relatedUser = relatedUser.replace(" ", "");
    relatedUser = relatedUser.trim();
    console.log("related User : ", relatedUser.length);
    let labelElement = this.closest("label");
    let relatedOption = labelElement.textContent.trim();
    console.log("related Option : ", relatedOption);
    let reqBody = {
        user: thisUser,
        relatedoption: relatedOption,
        relateduser: relatedUser,
        addorremove: this.checked
    };
    let response = await getInfoFromServer("changeoptions", reqBody);
    console.log("Changed :", response);
}

let selectOptionArea = async () => {
    let options = await getInfoFromServer("optionsforadmin", {
        user: window.sessionStorage.getItem("user")
    });
    let ytOptions = await getInfoFromServer("ytoptionsforadmin", {
        user: window.sessionStorage.getItem("user")
    });
    createOptionsArea("options", options);
    createOptionsArea("ytoptions", ytOptions);
};
function createOptionsArea(parentId, list) {
    let optionArea = document.getElementById(parentId);
    for (let i = 0; i < list.length; i++) {
        let label = document.createElement("label");
        let input = document.createElement("input");
        input.type = "checkbox";
        input.value = list[i];
        input.name = parentId == "options" ? "options" : "ytoptions";
        label.appendChild(input);
        label.append(list[i]);
        optionArea.append(label);
        optionArea.appendChild(document.createElement("br"));
    }
}
selectOptionArea();
async function getAllPayment() {
    const response = await fetch("/allpaymentforadmin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        },
        body: JSON.stringify({ user: window.sessionStorage.getItem("user") })
    });

    let result = await response.json();
    if (response.ok) {
        createallPaymentTable(result);
    } else {
        alert("clame Releses are not founsd Please check your inputs.");
    }
}
function createallPaymentTable(paymentData) {
    let parentDiv = document.getElementById("paymentshow");
    parentDiv.innerHTML = "";
    for (let i = 0; i < paymentData.length; i++) {
        let divForUser = document.createElement("div");
        divForUser.className = "paymentdiv";
        let userName = document.createElement("h4");
        let singleUserName = Object.keys(paymentData[i])[0];
        userName.innerText = singleUserName;
        divForUser.appendChild(userName);
        let listOfPlatformObjects = paymentData[i][singleUserName];
        let totlePay = 0;
        for (let j = 0; j < listOfPlatformObjects.length; j++) {
            let singlePlatform = Object.keys(listOfPlatformObjects[j])[0];
            const amountList = listOfPlatformObjects[j][singlePlatform].map(obj => obj.pay);
            totlePay = totlePay + amountList.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        }
        let totlepay = document.createElement("h3");
        totlepay.innerText = totlePay;
        divForUser.appendChild(totlepay);
        let button = document.createElement("button");
        button.innerText = "Add Payment";
        button.addEventListener("click", event => {
            addAmoutToThisUser(event);
        });
        divForUser.appendChild(button);
        parentDiv.appendChild(divForUser);
    }
}

async function addAmoutToThisUser(event) {
    let user = event.target.parentElement.firstElementChild.innerText;
    const centeredDiv = document.createElement("div");
    centeredDiv.className = "centered-div";
    centeredDiv.classList.add("dispblock");
    centeredDiv.id = "centerdiv";

    const closeButton = document.createElement("span");
    closeButton.className = "close-button";
    closeButton.innerHTML = "&#10006;";
    closeButton.addEventListener("click", event => {
        event.target.parentElement.remove();
    });
    centeredDiv.appendChild(closeButton);
    document.body.appendChild(centeredDiv);
    centeredDiv.append(await AddAmountForm(user));
}
function enterYearOptionsIn(selectElement) {
    const currentDate = new Date();
    const currentYear = +currentDate.getFullYear() + 6;
    for (let year = 2023; year <= currentYear; year++) {
        let yearOption = document.createElement("option");
        yearOption.setAttribute("value", year);
        yearOption.innerText = year;
        selectElement.appendChild(yearOption);
    }
}

function enterMonthOptionsIn(monthElement) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    for (let i = 0; i < months.length; i++) {
        let monthOption = document.createElement("option");
        monthOption.setAttribute("value", months[i]);
        monthOption.innerText = months[i];
        monthElement.appendChild(monthOption);
    }
}
async function AddAmountForm(user) {
    var form = document.createElement("form");
    form.id = "addamountform";
    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        const formData = new FormData(this);
        formData.append("user", thisUser);
        if (formData.get("platform") === "Add New" || formData.get("platform") === "") {
            alert("you Did not select the Platform");
        } else {
            formData.append("relatedUser", user);
            const response = await fetch("/setnewamout", {
                method: "POST",
                body: formData
            });
            if (response.ok) {
                alert(`Amount is set`);
            } else {
            }
        }
    });

    // Create label and select element for platform
    var platformLabel = document.createElement("label");
    platformLabel.setAttribute("for", "platform");
    platformLabel.innerText = "Select Platform";
    form.appendChild(platformLabel);

    var platformSelect = document.createElement("select");
    platformSelect.required = true;
    platformSelect.addEventListener("change", addNewPalrform);

    platformSelect.setAttribute("name", "platform");
    platformSelect.setAttribute("id", "platforms");
    let platformOptionEmpty = document.createElement("option");
    platformOptionEmpty.setAttribute("value", "");
    platformOptionEmpty.innerText = "";
    platformOptionEmpty.disabled = true;
    platformOptionEmpty.selected = true;
    platformSelect.appendChild(platformOptionEmpty);
    const response = await fetch("/allplatformforuser", {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        },
        body: JSON.stringify({ user: thisUser, relateduser: user })
    });
    if (response.ok) {
        let platforms = await response.json();
        // console.log("platforms : ", platforms);
        for (let i = 0; i < platforms.length; i++) {
            let platformOption = document.createElement("option");
            platformOption.setAttribute("value", platforms[i]);
            platformOption.innerText = platforms[i];
            platformSelect.appendChild(platformOption);
        }
    }

    let platformOption = document.createElement("option");
    platformOption.setAttribute("value", "Add New");
    platformOption.innerText = "Add New";
    platformSelect.appendChild(platformOption);
    form.appendChild(platformSelect);

    // Create label and input element for amount
    var amountLabel = document.createElement("label");
    amountLabel.setAttribute("for", "amount");
    amountLabel.innerText = "Amount";
    form.appendChild(amountLabel);

    var amountInput = document.createElement("input");
    amountInput.setAttribute("type", "number");
    amountInput.setAttribute("name", "amount");
    amountInput.required = true;
    form.appendChild(amountInput);

    let selectYesrLabel = document.createElement("label");
    selectYesrLabel.setAttribute("for", "yearofpay");
    selectYesrLabel.innerText = "Year";
    form.appendChild(selectYesrLabel);

    let selectYear = document.createElement("select");
    selectYear.setAttribute("name", "yearofpay");
    enterYearOptionsIn(selectYear);
    form.appendChild(selectYear);

    let selectMonthLabel = document.createElement("label");
    selectMonthLabel.setAttribute("for", "monthofpay");
    selectMonthLabel.innerText = "Month";
    form.appendChild(selectMonthLabel);

    let selectMonth = document.createElement("select");
    selectMonth.setAttribute("name", "monthofpay");
    enterMonthOptionsIn(selectMonth);
    form.appendChild(selectMonth);

    // Create label and input element for excel file
    var excelFileLabel = document.createElement("label");
    excelFileLabel.setAttribute("for", "excelfile");
    excelFileLabel.innerText = "Upload a File";
    excelFileLabel.required = true;
    form.appendChild(excelFileLabel);

    var excelFileInput = document.createElement("input");
    excelFileInput.setAttribute("type", "file");
    excelFileInput.setAttribute("name", "excelfile");
    excelFileInput.required = true;
    form.appendChild(excelFileInput);

    var submitAmountForm = document.createElement("input");
    submitAmountForm.type = "submit";
    submitAmountForm.id = "paysubmit";
    form.appendChild(submitAmountForm);
    // Append form to body
    return form;
}

function addNewPalrform(event) {
    if (this.value === "Add New") {
        let newForm = addNewPlatformForm();
        this.parentElement.classList.remove("dispblock");
        this.parentElement.classList.add("display-off");
        this.parentElement.parentElement.append(newForm);
    }
}
function addNewPlatformForm() {
    const form = document.createElement("form");
    form.id = "newplatformform";

    // Create label element
    const label = document.createElement("label");
    label.setAttribute("for", "newPlatform");
    label.innerText = "New Platform:";

    // Create input element
    const input = document.createElement("input");
    input.type = "text";
    input.id = "newPlatform";
    input.name = "newPlatform";
    input.placeholder = "Enter a new platform name";
    input.required = true;

    // Create submit button
    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.innerText = "Submit";

    // Append elements to the form
    form.appendChild(label);
    form.appendChild(input);
    form.appendChild(submitButton);

    // Add submit event listener
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const newPlatformName = input.value;
        let newoption = document.createElement("option");
        newoption.value = newPlatformName;
        newoption.innerText = newPlatformName;
        let platformSelectElm = document.getElementById("platforms");
        platformSelectElm.insertBefore(newoption, platformSelectElm.childNodes[1]);
        // document.getElementById("platforms").appendChild(newoption);

        this.classList.add("display-off");
        document.getElementById("addamountform").classList.add("dispblock");
        // You can handle the new platform name as needed, for example, send it to the server.
        alert(`New Platform Name: ${newPlatformName} submitted!`);
    });
    return form;
}
/////////////////////////////////////////////////////////////////////////////////
async function getAllClamRelese() {
    try {
        const response = await fetch("/allclamereleseforadmin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            body: JSON.stringify({ user: window.sessionStorage.getItem("user") })
        });

        const result = await response.json();

        if (response.ok) {
            // Form submitted successfully
            // console.log("Response : " + JSON.stringify(result));
            createclameReleseTable(result);
        } else {
            // Handle form errors
            alert("clame Releses are not founsd Please check your inputs.");
        }
    } catch (error) {
        // console.error("Error submitting form:", error);
    }
}

function createclameReleseTable(clameRelesesList) {
    let divToupdate = document.getElementById("operation5Content");
    divToupdate.innerHTML = "";
    let table = document.createElement("table");
    let tbody = document.createElement("tbody");
    table.appendChild(tbody);
    for (let i = 0; i < clameRelesesList.length; i++) {
        let tr = document.createElement("tr");
        tr.className = "clametr";
        let td = document.createElement("td");
        let key = Object.keys(clameRelesesList[i])[0];
        // console.log(key);
        td.innerText = clameRelesesList[i][key].username;
        tr.appendChild(td);
        let allClameRelese = clameRelesesList[i][key].clamrelese;
        let td2 = document.createElement("td");
        tr.appendChild(td2);
        allClameRelese.forEach(singleClame => {
            let showLinkStatus = document.createElement("div");
            showLinkStatus.className = "clamerelese";
            let li = document.createElement("li");
            let linkElement = document.createElement("a");
            linkElement.href = decodeURIComponent(singleClame.link); // Set the link URL
            linkElement.innerText = decodeURIComponent(singleClame.link);
            linkElement.target = "_blank";
            li.appendChild(linkElement);
            showLinkStatus.appendChild(li);
            let options = ["Pending", "Claim Released", "Rejected"];
            let statusSelectTag = document.createElement("select");
            options.forEach(optionText => {
                let option = document.createElement("option");
                option.value = optionText;
                option.text = optionText;
                statusSelectTag.appendChild(option);
            });
            if (singleClame.status === "Rejected") {
                statusSelectTag = document.createElement("div");
                statusSelectTag.innerText = singleClame.resion;
            } else {
                statusSelectTag.value = singleClame.status;
            }
            statusSelectTag.addEventListener("change", event => {
                let parentDiv = event.target.parentElement;
                let linkLi = parentDiv.firstElementChild;
                let linkATag = linkLi.firstElementChild;
                let link = linkATag.href;
                let row = parentDiv.parentElement;
                let parentTr = row.parentElement;
                let emailTd = parentTr.firstElementChild;
                let email = emailTd.innerText;
                if (event.target.value === "Rejected") {
                    let resionDiv = document.createElement("div");
                    resionDiv.className = "centered-div";
                    resionDiv.style.display = "block";
                    const textarea = document.createElement("textarea");
                    textarea.rows = 5;
                    textarea.cols = 60;
                    textarea.placeholder = "Enter your Resion here...";
                    resionDiv.appendChild(textarea);
                    const submitButton = document.createElement("button");
                    submitButton.type = "button";
                    submitButton.textContent = "Submit";
                    submitButton.addEventListener("click", () => {
                        alert("Textarea content: " + textarea.value);
                        changeStatusOfClameRelese({
                            relateduser: email,
                            clamlink: encodeURIComponent(link),
                            updatedvalue: event.target.value,
                            resion: textarea.value
                        });
                        resionDiv.remove();
                    });
                    resionDiv.appendChild(submitButton);

                    document.body.appendChild(resionDiv);
                } else {
                    changeStatusOfClameRelese({
                        relateduser: email,
                        clamlink: encodeURIComponent(link),
                        updatedvalue: event.target.value
                    });
                }
            });
            showLinkStatus.appendChild(statusSelectTag);
            td2.appendChild(showLinkStatus);
        });
        tbody.append(tr);
    }
    divToupdate.appendChild(table);
}
async function changeStatusOfClameRelese(statusObject) {
    try {
        const response = await fetch("/updateclamerelesestatus", {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            body: JSON.stringify({
                user: window.sessionStorage.getItem("user"),
                statustochange: statusObject
            })
        });
        if (response.ok) {
            alert("Status Changed");
        } else {
            // Handle form errors
            alert("clame Releses are not founsd Please check your inputs.");
        }
    } catch (error) {
        // console.error("Error submitting form:", error);
    }
}
//This function is related to show all Files uploaded by all users on first Tab on admin Panal
const uploadsContainer = document.getElementById("operation1Content");
async function loadFileNames(operation) {
    const operationContent = document.getElementById(`${operation}Content`);
    try {
        const response = await fetch("/getallfiles", {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            body: JSON.stringify({ user: window.sessionStorage.getItem("user") })
        });
        const result = await response.json();
        if (response.ok) {
            createAllSongTable(result);
        } else {
            alert("Files Reaponse is not ok.");
        }
    } catch (error) {
        // console.error("Error submitting getallfiles:", error);
    }
}
function createAllSongTable(userWithSongs) {
    console.table("user With Songs :", userWithSongs);
    uploadsContainer.innerHTML = "";
    let allSongsHeading = document.createElement("h1");
    allSongsHeading.innerText = "All Songs";
    uploadsContainer.appendChild(allSongsHeading);
    let userList = userWithSongs.filelist;
    console.table("userList :", userList);
    userList.forEach(usersWithSongList => {
        console.log("usersWithSongList :", usersWithSongList);

        let singleUser = Object.keys(usersWithSongList)[0];

        let singleUsersSongs = usersWithSongList[singleUser];
        console.log("singleUsersSongs :", singleUsersSongs);

        let userNameDisplay = document.createElement("h3");
        console.log("singleUsersSongs.length :", singleUsersSongs.length);

        if (singleUsersSongs.length > 0) {
            userNameDisplay.className = "all-song-user"; //---------------- class name ------------
            userNameDisplay.innerText = singleUser;
            uploadsContainer.appendChild(userNameDisplay);
            console.log("uploadsContainer: ", uploadsContainer)
        }
        for (let i = 0; i < singleUsersSongs.length; i++) {
            const audioName = singleUsersSongs[i].audio;
            const imageName = singleUsersSongs[i].img;
            console.log("song Name :", audioName);
            console.log("imageName Name :", imageName);
            // Create a card element
            const card = document.createElement("div");
            card.classList.add("card");
            let lebel = document.createElement("label");
            lebel.innerText = audioName;
            lebel.for = audioName;
            card.appendChild(lebel);
            // Create an audio element
            const audioElement = document.createElement("audio");
            audioElement.name = audioName;
            audioElement.controls = true;
            audioElement.src = `${audioName}`; // Replace with your audio path
            card.appendChild(audioElement);
            console.log("card before:", card);
            let downBtn = document.createElement("a");
            downBtn.innerText = "Download Song";
            downBtn.href = `${audioName}`;
            downBtn.download = true;
            console.log("download Button:", downBtn)
            card.appendChild(downBtn);
            console.log("card after:", card);

            // Create an image element
            const imageElement = document.createElement("img");
            imageElement.src = `${imageName}`; // Replace with your image path
            card.appendChild(imageElement);
            let songStatus = document.createElement("select");
            songStatus.className = "songstatus";
            // console.log("audioName :", audioName, "Status :", singleUsersSongs[i].status)
            let option1 = document.createElement("option");
            option1.innerText = "Submitted";
            option1.value = "Submitted";
            songStatus.appendChild(option1);
            let option2 = document.createElement("option");
            option2.innerText = "Procesing";
            option2.value = "Procesing";
            songStatus.appendChild(option2);
            let option3 = document.createElement("option");
            option3.innerText = "Released";
            option3.value = "Released";
            songStatus.appendChild(option3);
            let option4 = document.createElement("option");
            option4.innerText = "Rejected";
            option4.value = "Rejected";
            songStatus.appendChild(option4);
            songStatus.value = singleUsersSongs[i].status;
            songStatus.addEventListener("change", function () {
                if (this.value === "Rejected") {
                    let resionDiv = document.createElement("div");
                    resionDiv.className = "centered-div";
                    resionDiv.style.display = "block";
                    const textarea = document.createElement("textarea");
                    textarea.rows = 5;
                    textarea.cols = 60;
                    textarea.placeholder = "Enter your Resion here...";
                    resionDiv.appendChild(textarea);
                    const submitButton = document.createElement("button");
                    submitButton.type = "button";
                    submitButton.textContent = "Submit";
                    submitButton.addEventListener("click", () => {
                        alert("Textarea content: " + textarea.value);
                        songStatusChange(singleUser, this.value, audioName, textarea.value);
                        resionDiv.remove();
                    });
                    resionDiv.appendChild(submitButton);
                    document.body.appendChild(resionDiv);
                } else {
                    songStatusChange(singleUser, this.value, audioName);
                }
            });
            card.appendChild(songStatus);
            // Append the card to the uploads container
            uploadsContainer.appendChild(card);
        }
    });
}

async function songStatusChange(relatedUser, value, songName, resion) {
    let reqBody = {
        user: window.sessionStorage.getItem("user"),
        relateduser: relatedUser,
        value: value,
        songname: songName
    };
    if (resion) {
        reqBody["resion"] = resion;
    }
    const response = await fetch(`/changesongstatus`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        },
        body: JSON.stringify(reqBody)
    });
    let result = "";
    if (response.ok) {
        result = await response.text();
        window.alert(result);
    }
}

//--------------------------------------------------------------------------------------------

//This is fuction for 2nd tab that is for show all users and their songs to download
let users = [];
async function loadUserNames() {
    let allUserDiv = document.getElementById("operation2Content");
    allUserDiv.innerHTML = "";
    let allUsers = await getInfoFromServer("getusers", {
        user: window.sessionStorage.getItem("user")
    });
    let table = createTable(allUsers);
    allUserDiv.innerHTML = "";
    allUserDiv.append(table);
}

function createTable(data) {
    console.log("User Data Table :", data);
    var table = document.createElement("table");
    table.classList.add("table-auto");
    const thead = document.createElement("thead");
    const theadRow = document.createElement("tr");
    const th1 = document.createElement("th");
    th1.textContent = "Artist";
    const th2 = document.createElement("th");
    th2.textContent = "Songs";
    theadRow.appendChild(th1);
    theadRow.appendChild(th2);
    thead.appendChild(theadRow);
    table.appendChild(thead);
    const tbody = document.createElement("tbody");
    data.forEach(item => {
        const tr = document.createElement("tr");
        const td1 = document.createElement("td");
        td1.textContent = item.username;
        const td2 = document.createElement("td");
        item.filelist.forEach(song => {
            const li = document.createElement("li");
            let checkbox = document.createElement("input");
            checkbox.className = "songselect";
            checkbox.type = "checkbox";
            checkbox.addEventListener("change", function () {
                if (this.checked) {
                    console.log(this.parentNode.textContent);
                    let listItemText = this.parentNode.textContent;
                    downloadSelectedInExcel.push(listItemText);
                } else {
                    console.log(this.parentNode.textContent);
                    let listItemText = this.parentNode.textContent;
                    let removedList = downloadSelectedInExcel.splice(downloadSelectedInExcel.indexOf(listItemText), 1);
                }
                if (downloadSelectedInExcel.length == 0) {
                    document.getElementById("downloadButtonId").classList.add("display-off");
                } else {
                    document.getElementById("downloadButtonId").classList.remove("display-off");
                }
            });
            li.textContent = song.audio;
            li.appendChild(checkbox);
            td2.appendChild(li);
        });
        tr.appendChild(td1);
        tr.appendChild(td2);
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    let buttonTr = document.createElement("tr");
    buttonTr.id = "downloadButtonId";
    buttonTr.classList.add("display-off");
    let downloadButton = document.createElement("button");
    downloadButton.innerText = "Download Selected Files";
    downloadButton.addEventListener("click", function () {
        getDownloadexcelUser();
    });
    buttonTr.appendChild(downloadButton);
    tbody.appendChild(buttonTr);
    return table;
}

async function getDownloadexcelUser() {
    try {
        const response = await fetch("/downloadExcel", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user: window.sessionStorage.getItem("user"),
                songname: downloadSelectedInExcel
            })
        });
        if (response.status === 200) {
            const blob = await response.blob();
            const link = document.createElement("a");
            if (downloadSelectedInExcel.length === 1) {
                link.download = downloadSelectedInExcel[0];
            }

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
async function findQueries() {
    try {
        const response = await fetch("/find_querys", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query: "",
                user: window.sessionStorage.getItem("user")
            })
        });
        const result = await response.json();

        if (response.ok) {
            dataList = result.queries;
            let container = document.getElementById("operation4Content");
            dataList.forEach(userData => {
                const table = createQueryTable(userData);
                container.appendChild(table);
            });
        } else {
            // Handle form errors
            alert("Form submission failed. Please check your inputs.");
        }
    } catch (error) {
        // console.error("Error submitting form:", error);
    }
}
let isHeaders = true;
let table = document.createElement("table");
function createQueryTable(userData) {
    if (isHeaders) {
        const headerRow = table.insertRow();
        // Add headers
        for (const key in userData) {
            if (userData.hasOwnProperty(key)) {
                const th = document.createElement("th");
                th.textContent = key;
                headerRow.appendChild(th);
            }
        }
        isHeaders = false;
    }
    // Add data
    const dataRow = table.insertRow();
    for (const key in userData) {
        if (userData.hasOwnProperty(key)) {
            const td = document.createElement("td");
            // if (key === "query") {
            //     const queryText = userData[key];
            //     if (queryText.length > 50) {
            //         const truncatedText = queryText.substring(0, 50);
            //         td.textContent = truncatedText;
            //         const readMoreLink = document.createElement("a");
            //         readMoreLink.href = "#"; // Add your link logic here
            //         readMoreLink.textContent = "Read More";

            //         // Handle click event for "Read More"
            //         readMoreLink.addEventListener("click", function() {
            //             // Replace the truncated text with the full query
            //             td.id = userData[email];
            //             td.textContent = queryText;
            //         });

            //         // Append the "Read More" link
            //         td.appendChild(document.createElement("br"));
            //         td.appendChild(readMoreLink);
            //     } else {
            //         td.textContent = queryText;
            //     }
            // } else {
            //     // For other fields, display as is
            //     td.textContent = userData[key];
            // }
            td.textContent = userData[key];
            dataRow.appendChild(td);
        }
    }
    return table;
}

document.getElementById("generatePassword").addEventListener("click", function () {
    const password = generateRandomPassword();
    document.getElementById("password").value = password;
});

function generateRandomPassword() {
    // You can implement your own logic to generate a random password
    // Here's a simple example generating a password of 8 characters
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const passwordLength = 8;
    let password = "";
    for (let i = 0; i < passwordLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters.charAt(randomIndex);
    }
    return password;
}

const userForm = document.getElementById("userForm");
userForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    const keys = Array.from(formData.keys());
    if (!formData.has("ytoptions")) {
        formData.append("ytoptions", []);
    }
    if (!formData.has("options")) {
        formData.append("options", []);
    }
    for (let entry of formData.entries()) {
        console.log(entry[0], typeof entry[1]);
    }
    formData.append("user", window.sessionStorage.getItem("user"));
    fetch("/createuser", { method: "POST", body: formData })
        .then(response => response.text())
        .then(data => {
            alert(data);
            userForm.reset();
        })
        .catch(error => {
            // console.error("Error:", error);
        });
});
document.getElementById("changpass").addEventListener("click", async function () {
    console.log("changing");
    // Create the main div for the change password window
    let passDiv = document.createElement("div");
    passDiv.className = "centered-div";
    // Create form element
    let form = document.createElement("form");
    // Create label and input for old password
    let label = document.createElement("label");
    label.innerText = "Old Password: ";
    label.setAttribute("for", "oldpassword");
    let oldPasswordInp = document.createElement("input");
    oldPasswordInp.type = "password";
    oldPasswordInp.name = "oldpassword";
    oldPasswordInp.placeholder = "Old Password";
    form.appendChild(label);
    form.appendChild(oldPasswordInp);
    // Create label and input for new password
    label = document.createElement("label");
    label.innerText = "New Password: ";
    label.setAttribute("for", "newpassword");
    form.appendChild(document.createElement("br")); // Line break for spacing
    form.appendChild(document.createElement("br")); // Additional line break for spacing
    let newPasswordInp = document.createElement("input");
    newPasswordInp.type = "password";
    newPasswordInp.name = "newpassword";
    newPasswordInp.placeholder = "New Password";
    form.appendChild(label);
    form.appendChild(newPasswordInp);

    // Create label and input for confirming new password
    form.appendChild(document.createElement("br"));
    form.appendChild(document.createElement("br"));
    label = document.createElement("label");
    label.innerText = "Confirm Password: ";
    label.setAttribute("for", "confirmpassword");
    let confirmPasswordInp = document.createElement("input");
    confirmPasswordInp.type = "password";
    confirmPasswordInp.name = "confirmpassword";
    confirmPasswordInp.placeholder = "Confirm Password";
    form.appendChild(label);
    form.appendChild(confirmPasswordInp);
    form.appendChild(document.createElement("br"));
    form.appendChild(document.createElement("br"));
    let submit = document.createElement("input");
    submit.type = "submit";
    submit.value = "Change Password";
    form.appendChild(submit);
    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        const formData = new FormData(this);

        formData.append("user", thisUser);
        const response = await fetch("/adminchangepassword", {
            method: "POST",
            body: formData
        });
        if (response.ok) {
            let result = await response.text();
            if (result === "Password has been changed") {
                window.alert(result);
                window.sessionStorage.removeItem("user");
                window.location.href = "/";
            } else {
                window.alert(result);
            }
        } else {
        }
    });
    passDiv.appendChild(form);
    passDiv.style.display = "block";
    document.body.appendChild(passDiv);
});

document.getElementById("lgout").addEventListener("click", async function () {
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
});

// $( function () {
//     $( "#togglesidebar" ).click( function () {
//         console.log( "jquery running function" );
//         $( ".sidebar" ).slideToggle( 500 );
//     } );
// } ); 
