window.onload = () => {

    document.getElementById("login").addEventListener("click", login);
    document.getElementById("register").addEventListener("click", register);

}

// global variables to be referenced later; 
let currentUserId;
let currentUserRole;
let userData = {};

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

    // input validation
    if (firstname.trim() === "" || lastname.trim() === "" || uname === null || e.trim() === "" || pw.trim() === "" || uname.trim() === "") {
        document.getElementById('register-failed').innerText = "";
        document.getElementById('register-failed').innerText = "All form fields must be filled";
    } else if (firstname.length < 2 || lastname.length < 2) {
        document.getElementById('register-failed').innerText = "";
        document.getElementById('register-failed').innerText = "Names must be 2 or more characters long";
    } else if (isNaN(firstname) === false || isNaN(lastname) === false) {
        document.getElementById('register-failed').innerText = "";
        document.getElementById('register-failed').innerText = "Names should be in string format";
    } else if (isEmail(e) === false) {
        document.getElementById('register-failed').innerText = "";
        document.getElementById('register-failed').innerText = "Invalid email";
    } else {

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
                    document.getElementById('register-failed').innerText = "";
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
                    document.getElementById('register-failed').innerText = "";
                    document.getElementById('register-failed').innerText = 'registration failed!';
                }
                if (xhr.status === 409) {
                    document.getElementById('register-failed').innerText = "";
                    document.getElementById('register-failed').innerText = 'Username already taken!';
                }
                if (xhr.status === 500) {
                    document.getElementById('register-failed').innerText = "";
                    document.getElementById('register-failed').innerText = 'An error occurred. Try again later';
                }
            }
        }
    }
}


function login() {

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if (username === null || password === null || username === "" || password === "") {
        document.getElementById('login-failed').innerText = '';
        document.getElementById('login-failed').innerText = 'All form fields must be filled';
    } else {
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
                    let fullName = user.fname + " " + user.lname;
                    console.log(user);
                    currentUserId = user.userId;
                    currentUserRole = user.roleId;
                    console.log(`current user id is: ${currentUserId} and the role id is: ${currentUserRole}`);
                    dashboardDisplay(fullName);
                    loadDashboard();
                    document.getElementById("logout").addEventListener("click", logout);


                    setTimeout(() => {
                        let reimbQuerryString = "reimbs";
                        let userReimbQuerryString = `reimbs/?reimbAuth=${currentUserId}`;
                        document.getElementById('view-reimbs').addEventListener('click', function () {
                            allReimbs(reimbQuerryString, userReimbQuerryString);
                        });

                        //Pending status reimbs
                        let pendingReimbQuerryString = "reimbs/?reimbStatus=1";
                        document.getElementById('view-pending').addEventListener('click', function () {
                            querryReimbs(pendingReimbQuerryString, userReimbQuerryString, "pending")
                        });

                        //Approved status reimbs
                        let approvedReimbQuerryString = "reimbs/?reimbStatus=2";
                        document.getElementById('view-approved').addEventListener('click', function () {
                            querryReimbs(approvedReimbQuerryString, userReimbQuerryString, "approved")
                        });

                        //Denied status reimbs
                        let deniedReimbQuerryString = "reimbs/?reimbStatus=3";
                        document.getElementById('view-denied').addEventListener('click', function () {
                            querryReimbs(deniedReimbQuerryString, userReimbQuerryString, "denied")
                        });
                    }, 500);

                    function allReimbs(managerSpec, userSpec) {
                        if (currentUserRole == 3) { getMyReimbs(managerSpec) } else { getMyReimbs(userSpec) }
                    }

                    function querryReimbs(managerSpec, userSpec, criteria) {
                        if (currentUserRole === 3) { getMyReimbs(managerSpec) } else { getSortedReimbs(userSpec, criteria) }
                    }


                }
                if (xhr.status === 401) {
                    document.getElementById('login-failed').innerText = '';
                    document.getElementById('login-failed').innerText = 'Login failed!';
                }
                if (xhr.status === 500) {
                    document.getElementById('login-failed').innerText = '';
                    document.getElementById('login-failed').innerText = 'An error occurred. Try again later';
                }
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

            // give option to send reimbursement requests to employees only. 
            if (currentUserRole === 2) {
                document.getElementById("create-reimb").addEventListener("click", reimbReqForm);
                document.getElementById("create-reimb").innerHTML = `<strong style="font-weight:300; font-size: 35px;">+</strong> Create a new request`;
            } else {
                document.getElementById("create-reimb").hidden = true;
            }

        }
    }

}

function dashboardDisplay(fullName) {

    let profileCorner = `<img alt= "profile" src = "https://previews.123rf.com/images/nexusby/nexusby1810/nexusby181000286/111362910-default-avatar-placeholder-profile-icon-male.jpg"
    style = "width: 70px; height: 50px;">
    <p>${fullName}</p>
    <p><button class="btn btn-success" id="edit-profile">Edit your profile</button></p>
    <a href="#" id="logout">Logout</a>
    `;

    document.getElementById("profile-info").innerHTML = profileCorner;

}

// reimbursement request form
function reimbReqForm() {
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
            document.getElementById('displayArea').innerText = "Form could not be loaded";
        }
        if (xhr.status === 500) {
            document.getElementById('displayArea').innerText = "An internal error occurred. Try again";
        }
    }
    //document.getElementById("display-area") = form;
}

//send reimbursement request
function sendReimbReq() {
    let amount = document.getElementById("amount-req").value;
    let description = document.getElementById("description-req").value;
    let getType = document.getElementById("type-req");

    let type = getType.options[getType.selectedIndex].getAttribute("value");

    if (amount < 1 || description.trim() === null || description.trim() === "" || type === null || type === "") {

        document.getElementById("invalid-input").innerHTML = "Invalid Input. Try again with valid input";
    } else {

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
                    document.getElementById("displayArea").innerHTML = "Reimbursement request successfully sent.";
                }
                if (xhr.status === 401) {
                    document.getElementById("displayArea").innerText = "Request failed!";
                }
                if (xhr.status === 409) {
                    document.getElementById('displayArea').innerText = "Request could not be sent. Try again";
                }
                if (xhr.status === 500) {
                    document.getElementById('displayArea').innerText = "Request could not be sent. Try again";
                }
            }
        }
    }
}


//Get all reimbursements requests with user id
/*
Ways to get reimbs: 
1. All reimbs (Feature available for the manager and admin roles only)
2. Reimbs by author
3. Reimbs by status
4. Reimbs by type
5. Reimbs by id

querry string passed in the getReimbs function is responsible for specifying which type of reimbs to get
*/
function getMyReimbs(querryString) {

    let xhr = new XMLHttpRequest();
    xhr.open("GET", querryString, true);
    xhr.send();

    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let response = xhr.responseText;
                let resp = JSON.parse(response);
                console.log(resp);
                displayReimbs(resp);
            }
            if (xhr.status === 401) {
                document.getElementById("displayArea").innerText = 'Request failed!';
            }
            if (xhr.status === 409) {
                document.getElementById('displayArea').innerText = 'Request could not be sent. Try again';
            }
            if (xhr.status === 500) {
                document.getElementById('displayArea').innerText = 'An error occurred. Try again';
            }
        }
    }

}

//display reimbs to the dashboard 
function displayReimbs(resp) {

    if (resp.length === 0) { document.getElementById("displayArea").innerText = 'No match found! Try other options'; }
    document.getElementById("displayArea").innerHTML = "";
    let displayArea = document.getElementById("displayArea");
    let reqdetails = document.createElement("div");
    displayArea.append(reqdetails);

    for (let i = 0; i < resp.length; i++) {
        //getUser(resp[i].resolver);

        console.log(resp[i]);
        let reimbHtml = document.createElement("div");
        let reqData = `
       <div class = "card border-primary mb-3"">
       <div class = "card-body">
       <ol style = "list-style-type: none;">
        <li><b>Request id: </b>${resp[i].reimbId}</li>
        <li><b>Requestor Id: </b> ${resp[i].author}</li>
        <li><b>Date requested: </b>${resp[i].submittedOn.substring(0, 16)}</li>
        ${resp[i].resolvedOn != null ? `<li><b>Resolved On: </b>${resp[i].resolvedOn.substring(0, 16)}</li> 
        <li><b>Resolver Id: </b> ${resp[i].resolver} </li>` : ""}
        <div id="${resp[i].resolver}"></div>
        <li><b>Details: </b>${resp[i].description}</li>
        <li><b>Amount: </b>${resp[i].amount}</li>
        <li><b>Status: </b><span style = "color: red">${resp[i].statusId === 1 ? " Pending" : resp[i].statusId === 2 ? "Approved" : "Denied"}</span></li>
        </ol>
        ${currentUserRole === 3 && resp[i].statusId === 1 ? `<p style = "float:right;" class="buttons"><span><button class= "Approved" value= ${resp[i].reimbId}>Approve</button></span> 
        <span><button class="Denied" value= ${resp[i].reimbId}>Deny</button></span></p>` : ""}
        </div>
        </div>`;
        reimbHtml.innerHTML = reqData;
        reqdetails.append(reimbHtml);
    }
    reqButtons();
}

// sort employee specific reimbs querries 
/* 
- using author id to get the querries,
- parsing the objects to displayreimb function to do the rest. 
*/

function getSortedReimbs(querryString, criteria) {

    let xhr = new XMLHttpRequest();
    xhr.open("GET", querryString, true);
    xhr.send();

    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let response = xhr.responseText;
                let resp = JSON.parse(response);
                let r = []

                if (criteria === "pending") {
                    //let resp = [];
                    for (let i = 0; i < resp.length; i++) {
                        if (resp[i].statusId === 1) { r.push(resp[i]) }
                    }
                    console.log("in pending reimbs");
                    console.log(r);
                    displayReimbs(r);
                }
                if (criteria === "approved") {
                    //let resp = [];
                    for (let i = 0; i < resp.length; i++) {
                        if (resp[i].statusId === 2) { r.push(resp[i]) }
                    }
                    console.log("in approved reimbs");
                    console.log(r);
                    displayReimbs(r);
                }
                if (criteria === "denied") {
                    //let resp = [];
                    for (let i = 0; i < resp.length; i++) {
                        if (resp[i].statusId === 3) { r.push(resp[i]) }
                    }
                    console.log("in denied reimbs");
                    console.log(r);
                    displayReimbs(r);
                }
                if (r.length === 0) { document.getElementById("displayArea").innerText = 'No match found! Try other options'; }
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

// approve or deny reimbs
function processReimbRequest(reimb, dec, resolver) {

    //if(currentUserId != 3){return "unauthorised action"}
    console.log("processReimbRequest function called");
    let reimbUpdates = {
        reimbId: reimb,
        decision: dec,
        resolverId: resolver
    }

    let reimbUpdatesJSON = JSON.stringify(reimbUpdates);

    let xhr = new XMLHttpRequest();
    xhr.open("PUT", "reimbs", true);
    xhr.send(reimbUpdatesJSON);

    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let response = xhr.responseText;
                let resp = JSON.parse(response);
                console.log(resp);
                // on success, call the remaining pending reqs to continue taking actions
                getMyReimbs("reimbs/?reimbStatus=1");

                // document.getElementById("displayArea").innerHTML = "";
                // document.getElementById("displayArea").innerHTML = `<p>Reimbursement request successfully sent.</p>`;
            }
            if (xhr.status === 401) {
                // document.getElementById("displayArea").innerText = 'Request failed!';
            }
            if (xhr.status === 409) {
                // document.getElementById('displayArea').innerText = 'Request could not be sent. Try again';
            }
        }
    }

}


function reqButtons() {
    if (document.getElementsByClassName("Approved").length > 0) {
        console.log("process reimb reqs loaded");
        let done = false;
        let approveBtn = document.getElementsByClassName("Approved");
        for (let i = 0; i < approveBtn.length; i++) {
            approveBtn[i].addEventListener("click", function (e) {
                e.preventDefault();
                if (done === false) {
                    processReimbRequest(this.getAttribute("value"), this.getAttribute("class"), currentUserId);
                    done = true;
                }
            })
        }
    }
    if (document.getElementsByClassName("Denied").length > 0) {

        let done = false;
        let deniedBtn = document.getElementsByClassName("Denied");
        for (let i = 0; i < deniedBtn.length; i++) {
            deniedBtn[i].addEventListener("click", function (e) {
                e.preventDefault();
                if (done === false) {
                    processReimbRequest(this.getAttribute("value"), this.getAttribute("class"), currentUserId);
                    done = true;
                }
            })
        }
    }
}

// html forms input validation
// validating email
function isEmail(string) {
    let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let email = string;
    let check = mailformat.test(email);
    return check;
}

// more tasks....
// - pop up user info when author or resolver id is clicked. 

//get request for a user id
function getUser(id) {

    let xhr = new XMLHttpRequest();
    xhr.open("GET", "users/?userId="+id, true);
    xhr.send();

    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let response = xhr.responseText;
                let resp = JSON.parse(response);
                //console.log(resp);
                // displayReimbs(resp);
                let userDetails = `
                 <li>Full names: ${resp.fname + " " + resp.lname}</li>
                <li>Email: ${resp.email}</li>
                `;
                let list = document.createElement("ul");
                list.innerHTML = userDetails;

                document.getElementById(id).append(list);
                //userData = {};
                //userData = resp;
                console.log(resp);
                //setUserDetails(resp);
            }
            if (xhr.status === 401) {
                //document.getElementById("displayArea").innerText = 'Request failed!';
            }
            if (xhr.status === 409) {
                //document.getElementById('displayArea').innerText = 'Request could not be sent. Try again';
            }
            if (xhr.status === 500) {
                //document.getElementById('displayArea').innerText = 'An error occurred. Try again';
            }
        }
    }

}


