window.onload = () => {

    document.getElementById("login").addEventListener("click", login);
    document.getElementById("register").addEventListener("click", register);
}

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
                dashboardDisplay(user.fname);
                loadDashboard();
                document.getElementById("logout").addEventListener("click", logout);

                setTimeout(() => {
                // call the function to create reimbursement request form
                    //document.getElementById("display-area").innerHTML = "";
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
            // document.getElementById('login').addEventListener('click', login);
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
    document.getElementById("form-loading").innerHTML = "Loading reimbursement form ....";
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'req-form.view', true);
    xhr.send();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            document.getElementById('displayArea').innerHTML = "";
            document.getElementById('displayArea').innerHTML = xhr.responseText;
            // document.getElementById('login').addEventListener('click', login);
        }
    }
    //document.getElementById("display-area") = form;
}


