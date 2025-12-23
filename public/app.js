import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBrl1m4wkwpBvyO22el7vYnNtI2ZVLoIqo",
  authDomain: "buf-paste.firebaseapp.com",
  projectId: "buf-paste",
  storageBucket: "buf-paste.firebasestorage.app",
  messagingSenderId: "535545472896",
  appId: "1:535545472896:web:f20336bf0729d50397c365"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const pastesCollection = collection(db, "pastes");

// DOM elements
const form = document.getElementById("paste-form");
const input = document.getElementById("paste-input");
const pastesContainer = document.getElementById("pastes");

// Add new paste
async function submitPaste() {
  const content = input.value.trim();
  if (!content) return;

  await addDoc(pastesCollection, {
    content,
    createdAt: serverTimestamp()
  });

  input.value = "";
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  submitPaste();
});

// Keyboard shortcut: Cmd+Enter or Ctrl+Enter
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
    e.preventDefault();
    submitPaste();
  }
});

// Time ago helper
function timeAgo(date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

// Listen for pastes
const q = query(pastesCollection, orderBy("createdAt", "desc"));

onSnapshot(q, (snapshot) => {
  const pastes = snapshot.docs.map((doc, index) => ({
    id: doc.id,
    number: snapshot.docs.length - index,
    ...doc.data()
  }));

  pastesContainer.innerHTML = pastes.map(paste => `
    <article class="paste">
      <header class="paste-header">
        <span class="paste-number">#${paste.number}</span>
        <time class="paste-time">${paste.createdAt ? timeAgo(paste.createdAt.toDate()) : "just now"}</time>
      </header>
      <div class="paste-body" data-content="${escapeAttr(paste.content)}">
        <pre class="paste-content">${escapeHtml(paste.content)}</pre>
        <button class="copy-btn" type="button" title="Copy">
          <svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </button>
      </div>
    </article>
  `).join("");
});

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Escape for HTML attributes
function escapeAttr(text) {
  return text.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

// Copy paste content (event delegation)
pastesContainer.addEventListener("click", async (e) => {
  const btn = e.target.closest(".copy-btn");
  if (!btn) return;

  const content = btn.closest(".paste-body").dataset.content;
  await navigator.clipboard.writeText(content);
  btn.classList.add("copied");
  setTimeout(() => btn.classList.remove("copied"), 1500);
});
