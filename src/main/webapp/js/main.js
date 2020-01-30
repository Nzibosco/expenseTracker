window.onload = () => {

    document.getElementById("login").addEventListener("click", login);
    document.getElementById("register").addEventListener("click", register);
}

// global variables to be referenced later; 
let currentUserId;

// register a new user
function register() {
    let firstname = document.getElementById("fname").value;
    let lastname = document.getElementById("lname").value;
    let uname = document.getElementById("uname").value;
    let pw = document.getElementById("pw").value;
    let e = document.getElementById("email").value;
    // let getrole = document.getElementById("select-role");
    // let roleId = getrole.options[getrole.selectedIndex].getAttribute("value");
    // console.log(roleId);

    let user = {
        fname: firstname,
        lname: lastname,
        email: e,
        username: uname,
        password: pw,
        roleId: 2
    }

    let userJSON = JSON.stringify(user);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "users", true);
    xhr.send(userJSON);

    // clear the form
    document.getElementById("fname").value = "";
    document.getElementById("lname").value = "";
    document.getElementById("email").value = "";
    document.getElementById("uname").value = "";
    document.getElementById("pw").value = "";
    // document.getElementById("select-role").options[0];

    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log(userJSON);
                document.getElementById("model-body").innerHTML = "";
                document.getElementById("register-modelTitle").innerHTML = "";
                document.getElementById("model-body").innerHTML = "Register successfull! ";
                let callLogin = document.getElementById("model-body");
                let loginModal = document.createElement("a");
                loginModal.setAttribute("href", "#");
                loginModal.setAttribute("id", "call-login");
                loginModal.setAttribute("data-toggle", "modal");
                loginModal.setAttribute("data-target", "#login-model");
                loginModal.innerText = "Click to continue with login";
                callLogin.appendChild(loginModal);
                document.getElementById("call-login").addEventListener("click", closeRegistermodel);

                function closeRegistermodel() {
                    setTimeout(() => {
                        document.getElementById("register-model").click();
                    }, 10);
                }
            }
            if (xhr.status === 401) {
                document.getElementById('register-failed').innerText = 'registration failed!';
            }
            if (xhr.status === 409) {
                document.getElementById('register-failed').innerText = 'Username already taken!';
            }
        }
    }

}


function login() {

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let creds = {
        username: username,
        password: password
    };

    let credJSON = JSON.stringify(creds);

    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'auth', true);
    xhr.send(credJSON);
    //clear the form field
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                document.getElementById("login-model").click();
                document.getElementById("profile-info").innerHTML = "";
                let user = JSON.parse(xhr.responseText);
                console.log(user);
                currentUserId = user.userId;
                console.log(`current user id is: ${currentUserId}`);
                dashboardDisplay(user.fname);
                loadDashboard();
                document.getElementById("logout").addEventListener("click", logout);

                setTimeout(() => {
                // call the function to create reimbursement request form
                    document.getElementById("create-reimb").addEventListener("click", reimbReqForm);
                    document.getElementById("nameField").innerHTML = user.fname + " " + user.lname;
                    document.getElementById("unameField").innerHTML = user.username;
                    document.getElementById("reimbNumberField").innerHTML = "0";
                }, 2000);
            }
            if (xhr.status === 401) {
                document.getElementById('login-failed').innerText = 'Login failed!';
            }
        }
    }
}

function logout() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'auth', true);
    xhr.send();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log('logout successful!');
            window.location.reload();
        }
    }
}


// Load Dashboard partial and attach it to the index.html
function loadDashboard() {

    console.log('in loadDashboard()');

    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'dashboard.view', true);
    xhr.send();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            document.getElementById('root').innerHTML = xhr.responseText;
            document.getElementById('view-reimbs').addEventListener('click', getMyReimbs);
        }
    }

}

function dashboardDisplay(fullName) {
    let profilePictureArea = document.createElement("img");
    let fnameArea = document.createElement("p"); // clicking on this fullname will reveal a collapsible to show and edit the profile.
    profilePictureArea.setAttribute("id", "prof-picture");
    profilePictureArea.setAttribute("src", "https://previews.123rf.com/images/nexusby/nexusby1810/nexusby181000286/111362910-default-avatar-placeholder-profile-icon-male.jpg");
    profilePictureArea.setAttribute("alt", "profile");
    profilePictureArea.style = "width: 50px; height: 50px;"
    fnameArea.setAttribute("id", "full-name");
    let logoutBtn = document.createElement("a");
    logoutBtn.setAttribute("href", "#");
    logoutBtn.setAttribute("id", "logout");
    logoutBtn.innerHTML = "Logout";
    let profileDiv = document.getElementById("profile-info");
    profileDiv.append(profilePictureArea);
    profileDiv.append(fnameArea);
    profileDiv.append(logoutBtn);
    fnameArea.innerHTML = fullName;
}

// reimbursement request form
function reimbReqForm(){
    //document.getElementById("form-loading").innerHTML = "Loading reimbursement form ....";
    document.getElementById("displayArea").innerHTML = "";
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'req-form.view', true);
    xhr.send();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            document.getElementById('displayArea').innerHTML = "";
            document.getElementById('displayArea').innerHTML = xhr.responseText;
            document.getElementById('submit-reimb-req').addEventListener('click', sendReimbReq);
        }
        if (xhr.status === 401) {
            document.getElementById("displayArea").innerText = 'Not allowed to send a request';
        }
        if (xhr.status === 409) {
            document.getElementById('displayArea').innerText = "Form could not be load";
        }
    }
    //document.getElementById("display-area") = form;
}

//send reimbursement request
function sendReimbReq(){
    let amount = document.getElementById("amount-req").value;
    let description = document.getElementById("description-req").value;
    let getType = document.getElementById("type-req");
    
    let type = getType.options[getType.selectedIndex].getAttribute("value");

    let reimbCreds = {
        amount: amount,
        description: description,
        author: currentUserId,
        typeId: type
    };

    let reimbJSON = JSON.stringify(reimbCreds);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "reimbs", true);
    xhr.send(reimbJSON);

    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log(reimbJSON);
                console.log(reimbJSON.amount);
                document.getElementById("displayArea").innerHTML = "";
                document.getElementById("displayArea").innerHTML = `<p>Reimbursement request successfully sent.</p>`;
            }
            if (xhr.status === 401) {
                document.getElementById("displayArea").innerText = 'Request failed!';
            }
            if (xhr.status === 409) {
                document.getElementById('displayArea').innerText = 'Request could not be sent. Try again';
            }
        }
    }
}


//Get all reimbursements requests with user id
function getMyReimbs(){

let xhr = new XMLHttpRequest();
xhr.open("GET", `reimbs/?reimbAuth=${currentUserId}`, true);
xhr.send();

xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            let response = xhr.responseText;
            let resp = JSON.parse(response);
            //console.log(resp);
            document.getElementById("displayArea").innerHTML = "";
            let displayArea = document.getElementById("displayArea");
            let reqdetails = document.createElement("div");
            displayArea.append(reqdetails);
            for(let i = 0; i<resp.length; i++){
                console.log(resp[i]);
                let reimbHtml = document.createElement("div");
               let reqData =  `<ol>
                <li>Request id: ${resp[i].reimbId}</li>
                <li>Date requested: ${resp[i].submittedOn}</li>
                <li>Details: ${resp[i].description}</li>
                <li>Amount: ${resp[i].amount}</li>
                <li>Status: ${resp[i].statusId}</li>
                </ol>`; 
                reimbHtml.innerHTML = reqData;
                reqdetails.append(reimbHtml);
            }

            // resp.map(request = () => {
            //     console.log(request);
            //    let reqData =  `<div>
            //     <p>Request id: ${request.reimbId}</p>
            //     <p>Date requested: ${request.submittedOn}</p>
            //     <p>Details: ${request.description}</p>
            //     <p>Amount: ${request.amount}</p>
            //     <p>Status: ${request.statusId === 1 ? " Pending" : request.statusId === 2 ? "Approved": "Denied"}</p>
            //     </div>`; 
            //     reqdetails.append(reqData);
            // })
            
        }
        if (xhr.status === 401) {
            document.getElementById("displayArea").innerText = 'Request failed!';
        }
        if (xhr.status === 409) {
            document.getElementById('displayArea').innerText = 'Request could not be sent. Try again';
        }
    }
}

}


