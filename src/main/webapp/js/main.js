window.onload = () => {

    document.getElementById("login").addEventListener("click", login);
    document.getElementById("register").addEventListener("click", register);
}

// global variables to be referenced later; 
let currentUserId;
let currentUserRole;

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
                let fullName = user.fname + " " + user.lname;
                console.log(user);
                currentUserId = user.userId;
                currentUserRole = user.roleId;
                console.log(`current user id is: ${currentUserId} and the role id is: ${currentUserRole}`);
                dashboardDisplay(fullName);
                loadDashboard();
                document.getElementById("logout").addEventListener("click", logout);
             

                setTimeout(() => {
                // call the function to create reimbursement request form
                // document.getElementById("create-reimb").addEventListener("click", reimbReqForm);
                // document.getElementById("create-reimb").innerHTML = `<strong style="font-weight:300; font-size: 35px;">+</strong> Create a new request`;
                // document.getElementById("nameField").innerHTML = user.fname + " " + user.lname;
                // document.getElementById("unameField").innerHTML = user.username;
                // document.getElementById("reimbNumberField").innerHTML = "0";
                // }, 500);


                let reimbQuerryString = "reimbs";
                let userReimbQuerryString = `reimbs/?reimbAuth=${currentUserId}`;
                document.getElementById('view-reimbs').addEventListener('click', function (){
                    allReimbs(reimbQuerryString, userReimbQuerryString);
                });

                //Pending status reimbs
                let pendingReimbQuerryString = "reimbs/?reimbStatus=1";
                document.getElementById('view-pending').addEventListener('click', function(){
                    querryReimbs(pendingReimbQuerryString, userReimbQuerryString, "pending")
                });

                //Approved status reimbs
                let approvedReimbQuerryString = "reimbs/?reimbStatus=2";
                document.getElementById('view-approved').addEventListener('click', function(){
                    querryReimbs(approvedReimbQuerryString, userReimbQuerryString, "approved")
                });

                //Denied status reimbs
                let deniedReimbQuerryString = "reimbs/?reimbStatus=3";
                document.getElementById('view-denied').addEventListener('click', function(){
                    querryReimbs(deniedReimbQuerryString, userReimbQuerryString, "denied")
                });
           // }
        }, 500);
            //else { // other users only view their own requests
                // let userReimbQuerryString = `reimbs/?reimbAuth=${currentUserId}`;
                // document.getElementById('view-reimbs').addEventListener('click', getMyReimbs(reimbQuerryString)); // all
                // document.getElementById('view-pending').addEventListener('click', getSortedReimbs(reimbQuerryString, "pending")); // pending
                // document.getElementById('view-approved').addEventListener('click', getSortedReimbs(reimbQuerryString, "approved")); // approved
                // document.getElementById('view-denied').addEventListener('click', getSortedReimbs(reimbQuerryString, "denied")); // pending
            //}
        //}

        function allReimbs(managerSpec, userSpec){
            if(currentUserRole == 3){getMyReimbs(managerSpec)} else {getMyReimbs(userSpec)}
        }

        function querryReimbs(managerSpec, userSpec, criteria){
            if(currentUserRole === 3){getMyReimbs(managerSpec)} else{getSortedReimbs(userSpec, criteria)}
        }

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

            // calling the get reimbursements method
            // document.getElementById('view-reimbs').addEventListener('click', getReimbs);
            // document.getElementById('view-pending').addEventListener('click', getReimbs);
            // document.getElementById('view-approved').addEventListener('click', getReimbs);
            // document.getElementById('view-denied').addEventListener('click', getReimbs);

            // give option to send reimbursement requests to employees only. 
            if (currentUserRole === 2) {
                document.getElementById("create-reimb").addEventListener("click", reimbReqForm);
                document.getElementById("create-reimb").innerHTML = `<strong style="font-weight:300; font-size: 35px;">+</strong> Create a new request`;
            } else {
                document.getElementById("create-reimb").hidden = true;
            }
            //else{ // other users only view their own requests
            //let reimbQuerryString = `reimbs/?reimbAuth=${currentUserId}`;
            //document.getElementById('view-reimbs').addEventListener('click', getMyReimbs(reimbQuerryString));
            //}


            // functions for calling the get reimbursements method
            //function getReimbs() {
                //if (currentUserRole === 3) { // manager can view all reimb requests
            //         let reimbQuerryString = "reimbs";
            //         let userReimbQuerryString = `reimbs/?reimbAuth=${currentUserId}`;
            //         document.getElementById('view-reimbs').addEventListener('click', allReimbs(reimbQuerryString, userReimbQuerryString));

            //         //Pending status reimbs
            //         let pendingReimbQuerryString = "reimbs/?reimbStatus=1";
            //         document.getElementById('view-pending').addEventListener('click', querryReimbs(pendingReimbQuerryString, userReimbQuerryString, "pending"));

            //         //Approved status reimbs
            //         let approvedReimbQuerryString = "reimbs/?reimbStatus=2";
            //         document.getElementById('view-approved').addEventListener('click', querryReimbs(approvedReimbQuerryString, userReimbQuerryString, "approved"));

            //         //Denied status reimbs
            //         let deniedReimbQuerryString = "reimbs/?reimbStatus=3";
            //         document.getElementById('view-denied').addEventListener('click', querryReimbs(deniedReimbQuerryString, userReimbQuerryString, "denied"));
            //    // }
            //     //else { // other users only view their own requests
            //         // let userReimbQuerryString = `reimbs/?reimbAuth=${currentUserId}`;
            //         // document.getElementById('view-reimbs').addEventListener('click', getMyReimbs(reimbQuerryString)); // all
            //         // document.getElementById('view-pending').addEventListener('click', getSortedReimbs(reimbQuerryString, "pending")); // pending
            //         // document.getElementById('view-approved').addEventListener('click', getSortedReimbs(reimbQuerryString, "approved")); // approved
            //         // document.getElementById('view-denied').addEventListener('click', getSortedReimbs(reimbQuerryString, "denied")); // pending
            //     //}
            // //}

            // function allReimbs(managerSpec, userSpec){
            //     if(currentUserRole == 3){getMyReimbs(managerSpec)} else {getMyReimbs(userSpec)}
            // }

            // function querryReimbs(managerSpec, userSpec, criteria){
            //     if(currentUserRole === 3){getMyReimbs(managerSpec)} else{getSortedReimbs(userSpec, criteria)}
            // }


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
            document.getElementById('displayArea').innerText = "Form could not be load";
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
        }
    }

}

//display reimbs to the dashboard 
function displayReimbs(resp) {

    document.getElementById("displayArea").innerHTML = "";
    let displayArea = document.getElementById("displayArea");
    let reqdetails = document.createElement("div");
    displayArea.append(reqdetails);

    for (let i = 0; i < resp.length; i++) {
        console.log(resp[i]);
        let reimbHtml = document.createElement("div");
        let reqData = `
       <div class = "card border-primary mb-3"">
       <div class = "card-body">
       <ol style = "list-style-type: none;">
        <li><b>Request id: </b>${resp[i].reimbId}</li>
        <li><b>Date requested: </b>${resp[i].submittedOn.substring(0, 16)}</li>
        ${resp[i].resolvedOn != null ? `<li><b>Resolved On: </b>${resp[i].resolvedOn.substring(0, 16)}</li> <li><b>Resolver Id: </b>${resp[i].resolver}</li>` : ""}
        <li><b>Details: </b>${resp[i].description}</li>
        <li><b>Amount: </b>${resp[i].amount}</li>
        <li><b>Status: </b><span style = "color: red">${resp[i].statusId === 1 ? " Pending" : resp[i].statusId === 2 ? "Approved" : "Denied"}</span></li>
        </ol>
        ${currentUserRole === 3 && resp[i].statusId === 1 ? `<p style = "float:right;" id="buttons"><span><button id= "approve-reimb">Approve</button></span> <span><button id="deny-reimb">Deny</button></span></p>` : ""}
        </div>
        </div>`;
        reimbHtml.innerHTML = reqData;
        reqdetails.append(reimbHtml);
    }

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

                if(criteria === "pending"){
                    //let resp = [];
                    for(let i = 0; i<resp.length; i++){
                        if(resp[i].statusId === 1){r.push(resp[i])}
                    }
                console.log("in pending reimbs");
                console.log(r);
                displayReimbs(r);
                }
                if(criteria === "approved"){
                    //let resp = [];
                    for(let i = 0; i<resp.length; i++){
                        if(resp[i].statusId === 2){r.push(resp[i])}
                    }
                console.log("in approved reimbs");
                console.log(r);
                displayReimbs(r);
                }
                if(criteria === "denied"){
                    //let resp = [];
                    for(let i = 0; i<resp.length; i++){
                        if(resp[i].statusId === 3){r.push(resp[i])}
                    }
                console.log("in denied reimbs");
                console.log(r);
                displayReimbs(r);
                }
                if(r.length === 0){ document.getElementById("displayArea").innerText = 'No match found failed!';}
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


