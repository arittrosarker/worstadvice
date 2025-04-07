// Set the API endpoint to your Vercel serverless function URL
const API_ENDPOINT = "https://worstadvice-gjvo6b50g-arittrosarkers-projects.vercel.app/api/openrouter";

const adviceForm = document.getElementById("adviceForm");
const userInput = document.getElementById("userInput");
const loadingDiv = document.getElementById("loading");
const resultCard = document.getElementById("resultCard");
const adviceTextDiv = document.getElementById("adviceText");
const anotherBtn = document.getElementById("anotherBtn");
const loveItBtn = document.getElementById("loveItBtn");

let currentPrompt = "";

// Typewriter effect to display text gradually
function typeWriter(text, element, index = 0) {
  if (index < text.length) {
    element.innerHTML += text.charAt(index);
    setTimeout(() => typeWriter(text, element, index + 1), 50);
  }
}

// Fetch advice from your Vercel serverless function
async function fetchAdvice(prompt) {
  loadingDiv.classList.remove("hidden");
  resultCard.classList.add("hidden");
  adviceTextDiv.innerHTML = "";

  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    const advice = data.choices &&
                   data.choices[0] &&
                   data.choices[0].message &&
                   data.choices[0].message.content
      ? data.choices[0].message.content.trim()
      : "Error: No advice found.";
    displayAdvice(advice);

  } catch (error) {
    displayAdvice("Oops, something went wrong. Try again later.");
    console.error(error);
  }
}

// Display advice with a typewriter effect
function displayAdvice(text) {
  loadingDiv.classList.add("hidden");
  resultCard.classList.remove("hidden");
  adviceTextDiv.innerHTML = "";
  typeWriter(text, adviceTextDiv);
}

// Handle form submission
adviceForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const prompt = userInput.value.trim();
  if (!prompt) return;

  // Enforce a 25-word limit
  const wordCount = prompt.split(/\s+/).length;
  if (wordCount > 25) {
    alert("Please limit your problem to 25 words.");
    return;
  }

  currentPrompt = prompt;
  fetchAdvice(prompt);
});

// "Get Another Advice" button to re-fetch with the same prompt
anotherBtn.addEventListener("click", function(e) {
  e.preventDefault();
  if (currentPrompt) {
    userInput.value = currentPrompt;
    fetchAdvice(currentPrompt);
  }
});

// "This is terrible, I love it" button action
loveItBtn.addEventListener("click", function(e) {
  e.preventDefault();
  alert("Thanks for loving the worst advice, you should love Arittro too!");
});
