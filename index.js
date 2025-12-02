let userInput = document.getElementById("userID");
let btn = document.getElementById("btn");

async function fetchUser(username) {
    try {
        let response = await fetch(`https://api.github.com/users/${username}`);
        
        if (!response.ok) {
            throw new Error(`User not found (Status: ${response.status})`);
        }
        
        let result = await response.json();
        displayUser(result);
    } catch (error) {
        console.error("Error fetching user:", error);
        displayError();
    }
}

function displayUser({
    avatar_url,
    name,
    bio,
    followers,
    following,
    public_repos,
    html_url,
    login,
    location,
    blog,
    twitter_username,
    created_at
}) {
    if(!avatar_url) {
        displayError();
        return;
    } 

    if(!name) name = login;
    if(!bio) bio = 'No bio available';
    
    let joinDate = "Unknown";
    if (created_at) {
        const date = new Date(created_at);
        joinDate = date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    document.getElementById("userProfile").innerHTML = `
        <div class="userInfo">
            <img src="${avatar_url}" class="userImg" alt="User Avatar">
            <div class="userDetail">
                <p class="userName">${name}</p>
                <p class="userBio">${bio}</p>
                ${location ? `<p class="user-location"><i class="fas fa-map-marker-alt"></i> ${location}</p>` : ''}
                ${blog ? `<p class="user-blog"><i class="fas fa-link"></i> <a href="${blog.startsWith('http') ? blog : 'https://' + blog}" target="_blank">${blog}</a></p>` : ''}
                ${twitter_username ? `<p class="user-twitter"><i class="fab fa-twitter"></i> <a href="https://twitter.com/${twitter_username}" target="_blank">@${twitter_username}</a></p>` : ''}
                <p class="user-join-date"><i class="far fa-calendar-alt"></i> Joined GitHub on ${joinDate}</p>
            </div>
        </div>
        <div class="userFollow">
            <div class="Follower">
                <div class="repo">
                    <p><i class="fas fa-users"></i> Followers</p>
                    <p>${followers}</p>
                </div>
                <div class="repo">
                    <p><i class="fas fa-user-friends"></i> Following</p>
                    <p>${following}</p>
                </div>
                <div class="repo">
                    <p><i class="fas fa-code-branch"></i> Repositories</p>
                    <p>${public_repos}</p>
                </div>
            </div>
            <a href="${html_url}" target="_blank" class="VisitProfile">
                <i class="fab fa-github"></i>
                <span>Visit GitHub Profile</span>
            </a>
        </div>`;
}

function displayError() {
    document.getElementById("userProfile").innerHTML = `
        <div class="error-state">
            <div class="error-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h2 class="error-title">User Not Found</h2>
            <p class="error-subtitle">The GitHub username you entered doesn't exist. Please check the spelling and try again.</p>
            <button class="btn try-again-btn" onclick="resetSearch()">
                <i class="fas fa-redo"></i>
                <span>Try Again</span>
            </button>
        </div>`;
}

function resetSearch() {
    document.getElementById("userProfile").innerHTML = `
        <div class="initial-state">
            <div class="initial-icon">
                <i class="fas fa-search"></i>
            </div>
            <h2 class="initial-title">Search for a GitHub user</h2>
            <p class="initial-subtitle">Enter a GitHub username above to view their profile, stats, and repositories</p>
        </div>`;
    userInput.value = "";
    userInput.focus();
}

btn.addEventListener("click", () => {
    let username = userInput.value.trim();
    
    if (username) {
        document.getElementById("userProfile").innerHTML = `<span class="loader"></span>`;
        fetchUser(username);
    } else {
        userInput.focus();
        userInput.style.borderColor = "#ff4757";
        setTimeout(() => {
            userInput.style.borderColor = "#334155";
        }, 1000);
    }
});

userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        btn.click();
    }
});

document.querySelectorAll(".example-tag").forEach(tag => {
    tag.addEventListener("click", () => {
        const username = tag.getAttribute("data-user");
        userInput.value = username;
        document.getElementById("userProfile").innerHTML = `<span class="loader"></span>`;
        fetchUser(username);
    });
});

function animateProfileSection() {
    const profileSection = document.getElementById("userProfile");
    profileSection.style.opacity = "0";
    profileSection.style.transform = "translateY(20px)";
    
    setTimeout(() => {
        profileSection.style.opacity = "1";
        profileSection.style.transform = "translateY(0)";
    }, 100);
}

const originalDisplayUser = displayUser;
displayUser = function(userData) {
    originalDisplayUser(userData);
    animateProfileSection();
};

window.addEventListener("load", () => {
    userInput.focus();
});