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
        <img class="avatar" src="${user.avatar_url}" alt="${user.login} avatar"/>

        <h2>${user.name}</h2>

        <p class="username">
            <a href="${user.html_url}" target="_blank" rel="noopener noreferrer">
                @${user.login}
            </a>
        </p>

      <p>Public repositories: ${user.public_repos}</p>
      <p>Followers: ${user.followers}</p>
      <p>Following: ${user.following}</p>
    </div>
  `;
    
}
