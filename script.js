const input = document.getElementById("input");
const searchBtn = document.getElementById("searchBtn");
const details = document.getElementById("details");

searchBtn.addEventListener("click", onSearch);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") onSearch();
});

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
  const formattedDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  details.innerHTML = `
    <div class="user-info">
      <div class="user-header">
        <div class="avatar-container">
          <img
            class="avatar"
            src="${user.avatar_url}"
            alt="${user.login}'s profile picture"
            loading="lazy"
          />
          ${
            user.blog
              ? `
            <a href="${user.blog}" class="profile-link" target="_blank">
              <i class="fas fa-link"></i>
            </a>
          `
              : ""
          }
        </div>
        
        <div class="user-title">
          <h2>${user.name || user.login}</h2>
          <a class="username" href="${user.html_url}" target="_blank" rel="noopener noreferrer">
            <i class="fab fa-github"></i> @${user.login}
          </a>
          
          ${
            user.bio
              ? `
            <p class="user-bio">
              <i class="fas fa-quote-left"></i>
              ${user.bio}
            </p>
          `
              : ""
          }
          
          <div class="user-meta">
            ${
              user.location
                ? `
              <span class="meta-item">
                <i class="fas fa-map-marker-alt"></i>
                ${user.location}
              </span>
            `
                : ""
            }
            
            ${
              user.created_at
                ? `
              <span class="meta-item">
                <i class="far fa-calendar-alt"></i>
                Joined ${formattedDate}
              </span>
            `
                : ""
            }
          </div>
        </div>
      </div>

      <div class="user-stats">
        <div class="stat-item">
          <span class="stat-number">${user.public_repos}</span>
          <small class="stat-label">Public Repos</small>
        </div>
        <div class="stat-item">
          <span class="stat-number">${user.followers}</span>
          <small class="stat-label">Followers</small>
        </div>
        <div class="stat-item">
          <span class="stat-number">${user.following}</span>
          <small class="stat-label">Following</small>
        </div>
      </div>
    </div>
  `;
}