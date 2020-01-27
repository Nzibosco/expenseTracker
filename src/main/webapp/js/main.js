window.onload = () => {
    //loadNav();
    console.log('did the JS load?');
    //loadLogin();
    document.getElementById('login').addEventListener('click', login);
    document.getElementById('logout').addEventListener('click', logout);
}

// function loadLogin() {

//     console.log('in loadLogin()');

//     let xhr = new XMLHttpRequest();
//     xhr.open('GET', 'login.view', true);
//     xhr.send();
//     xhr.onreadystatechange = () => {
//         if(xhr.readyState === 4 && xhr.status === 200) {
//             document.getElementById('root').innerHTML = xhr.responseText;
//             document.getElementById('login').addEventListener('click', login);
//         }
//     }

// }

function login() {

    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    let creds = {
        username: username,
        password: password
    };

    let credJSON = JSON.stringify(creds);

    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'auth', true);
    xhr.send(credJSON);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                document.getElementById("login-model").click();
                document.getElementById("profile-info").innerHTML = "";
                let user = JSON.parse(xhr.responseText);
                console.log(user);
                dashboardDisplay(user.fname);
                loadDashboard()
                setTimeout( ()=> {
                    //document.getElementById("full-name").innerHTML= `Welcome ${user.fname}`;
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
            console.log('logout successful!')
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
        if(xhr.readyState === 4 && xhr.status === 200) {
            document.getElementById('root').innerHTML = xhr.responseText;
            // document.getElementById('login').addEventListener('click', login);
        }
    }

}

// function loadNav(){
// var xhr = new XMLHttpRequest;
// xhr.open('get', 'partials/navbar.html', true);
// xhr.onreadystatechange = function() {
//     if (xhr.readyState == 4 && xhr.status == 200) { 
//         document.getElementById("nav-area").innerHTML = xhr.responseText;
//         console.log("navbar called!")
//     } 
// }
// xhr.send();
// }
function dashboardDisplay(fullName){
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
    fnameArea.innerHTML= fullName;
}
