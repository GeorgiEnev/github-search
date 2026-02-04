const input = document.getElementById("input");
const searchBtn = document.getElementById("searchBtn");
const details = document.getElementById("details");

searchBtn.addEventListener("click", onSearch);

async function onSearch() {
    const username = input.value.trim();
    const URL = `https://api.github.com/users/${username}`;

    if (!username) {
        details.innerHTML = "<p>Please enter a username.</p>";
        return;
    }

    try {
        const resp = await fetch(URL);

        if (!resp.ok) {
            details.innerHTML = "<p>User not found.</p>";
            return;
        }

        const user = await resp.json();

        displayUser(user);
    } catch {
        details.innerHTML = "<p>Something went wrong.</p>";
    }
}

function displayUser(user) {
  details.innerHTML = `
        <div class="user-info">

            <div class="user-header">
                <img
                    class="avatar"
                    src="${user.avatar_url}"
                    alt="${user.login} avatar"
                />

                <div class="user-title">
                    <h2>${user.name}</h2>
                    <a class="username" href="${user.html_url}" target="_blank" rel="noopener noreferrer">@${user.login}</a>
                </div>
            </div>

            <div class="user-stats">
                <div>
                    <span>${user.public_repos}</span>
                    <small>Public Repos</small>
                </div>
                <div>
                    <span>${user.followers}</span>
                    <small>Followers</small>
                </div>
                <div>
                    <span>${user.following}</span>
                    <small>Following</small>
                </div>
            </div>

        </div>
    `;
}

