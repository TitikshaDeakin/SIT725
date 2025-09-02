
// ----- keep your existing helpers -----
function changeText() {
  var textsArray = ["Text 1", "Text 2", "Text 3", "Text 4", "Text 5"];
  var number = getRandomNumberBetween(0, textsArray.length - 1);
  console.log("Index: ", number);
  document.getElementById("heading").innerHTML = textsArray[number];
}

function getRandomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// ----- new: socket hookup + keep your form logic -----
document.addEventListener('DOMContentLoaded', function () {
  // 1) Connect to Socket.IO server (the /socket.io client script adds global `io`)
  const socket = window.io ? io() : null;

  if (socket) {
    // show a live value if you add <span id="number">–</span> in index.html
    socket.on('number', (msg) => {
      console.log('Random number:', msg);
      const el = document.getElementById('number');
      if (el) el.textContent = String(msg);
    });

    socket.on('connect',   () => console.log('🔌 socket connected', socket.id));
    socket.on('disconnect',() => console.log('🔌 socket disconnected'));
    socket.on('connect_error', (err) => console.error('socket error:', err));
  } else {
    console.warn('Socket.IO client not loaded — check the <script src="/socket.io/socket.io.js"> tag');
  }

  // 2) Your existing form code (unchanged)
  const form = document.querySelector('form');
  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const firstName = document.getElementById('first_name').value;
    const lastName  = document.getElementById('last_name').value;
    const email     = document.getElementById('email').value;

    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email })
    });

    const result = await response.json();

    if (response.ok) {
      document.getElementById('output').innerText =
        `Name: ${firstName} ${lastName}\nEmail: ${email}`;
      const resultCard = document.getElementById('formResult');
      resultCard.style.display = 'block';
      resultCard.classList.add('fade-in');
    } else {
      alert("❌ Error: " + result.message);
    }
  });
});
