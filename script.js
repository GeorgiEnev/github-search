const input = document.getElementById("input");
const searchBtn = document.getElementById("searchBtn");
const details = document.getElementById("details");

let currentUser = null;

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
    showLoading();

    searchBtn.disabled = true;
    searchBtn.textContent = "Searching...";
    searchBtn.style.opacity = "0.7";

    const delay = new Promise((resolve) => setTimeout(resolve, 800));

    const fetchPromise = fetch(URL);

    const [_, resp] = await Promise.all([delay, fetchPromise]);

    if (!resp.ok) {
      details.innerHTML = "<p>User not found.</p>";
      return;
    }

    const user = await resp.json();
    displayUser(user);
  } catch {
    details.innerHTML = "<p>Something went wrong.</p>";
  } finally {
    searchBtn.disabled = false;
    searchBtn.textContent = "Search";
    searchBtn.style.opacity = "1";
  }
}

function showLoading() {
  details.innerHTML = `
        <div class="wrapper">
            <div class="circle"></div>
            <div class="circle"></div>
            <div class="circle"></div>
            <div class="shadow"></div>
            <div class="shadow"></div>
            <div class="shadow"></div>
        </div>
        <div class="loading-text">Searching GitHub...</div>
    `;
}

function displayUser(user) {
  const template = document.getElementById("user-template");
  const clone = template.content.cloneNode(true);

  currentUser = user;

  const reposStat = clone.querySelector(".repos-clickable");

  reposStat.addEventListener("click", showRepos);

  const avatar = clone.querySelector(".avatar");
  avatar.src = user.avatar_url;
  avatar.alt = `${user.login}'s avatar`;

  const blogLink = clone.querySelector(".profile-link");
  if (user.blog) {
    blogLink.href = user.blog;
  } else {
    blogLink.remove();
  }

  clone.querySelector(".name").textContent = user.name ?? user.login;

  const usernameLink = clone.querySelector(".username");
  usernameLink.href = user.html_url;
  usernameLink.querySelector("span").textContent = `@${user.login}`;

  const bio = clone.querySelector(".user-bio");
  if (user.bio) {
    bio.textContent = user.bio;
  } else {
    bio.remove();
  }

  const location = clone.querySelector(".location");
  if (user.location) {
    location.textContent = user.location;
  } else {
    location.remove();
  }

  const joined = clone.querySelector(".joined");
  if (user.created_at) {
    joined.textContent = `Joined ${formatJoinDate(user.created_at)}`;
  } else {
    joined.remove();
  }

  clone.querySelector(".repos").textContent = user.public_repos;
  clone.querySelector(".followers").textContent = user.followers;
  clone.querySelector(".following").textContent = user.following;

  details.innerHTML = "";
  details.appendChild(clone);
}

function formatJoinDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

async function showRepos() {
  if (!currentUser) return;

  details.innerHTML = "<p>Loading repositories…</p>";

  try {
    const resp = await fetch(currentUser.repos_url);

    if (!resp.ok) {
      details.innerHTML = "<p>Failed to load repositories.</p>";
      return;
    }

    const repos = await resp.json();

    renderRepos(repos);
  } catch {
    details.innerHTML = "<p>Something went wrong.</p>";
  }
}

function renderRepos(repos) {
  const template = document.getElementById("repos-template");
  const clone = template.content.cloneNode(true);

  const list = clone.querySelector(".repos-list");
  const backBtn = clone.querySelector(".back-btn");

  backBtn.addEventListener("click", () => {
    displayUser(currentUser);
  });

  if (repos.length === 0) {
    list.innerHTML = "<p>No repositories found.</p>";
  }

  repos.forEach((repo) => {
    const item = document.createElement("div");
    item.className = "repo-item";

    item.innerHTML = `
      <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
        ${repo.name}
      </a>
      ${repo.description ? `<p>${repo.description}</p>` : ""}
    `;

    list.appendChild(item);
  });

  details.innerHTML = "";
  details.appendChild(clone);
}
