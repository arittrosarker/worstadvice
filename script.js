// Add your OpenRouter API keys below
const OPENROUTER_API_KEYS = [
  ""
  // Add more keys if needed
];
let currentKeyIndex = 0;

// Rotate through multiple API keys
function getApiKey() {
  const key = OPENROUTER_API_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % OPENROUTER_API_KEYS.length;
  return key;
}

const API_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

const adviceForm = document.getElementById("adviceForm");
const userInput = document.getElementById("userInput");
const loadingDiv = document.getElementById("loading");
const resultCard = document.getElementById("resultCard");
const adviceTextDiv = document.getElementById("adviceText");
const anotherBtn = document.getElementById("anotherBtn");
const loveItBtn = document.getElementById("loveItBtn");

let currentPrompt = "";

// Typewriter effect
function typeWriter(text, element, index = 0) {
  if (index < text.length) {
    element.innerHTML += text.charAt(index);
    setTimeout(() => typeWriter(text, element, index + 1), 50);
  }
}

// Fetch advice from OpenRouter
async function fetchAdvice(prompt) {
  loadingDiv.classList.remove("hidden");
  resultCard.classList.add("hidden");
  adviceTextDiv.innerHTML = "";

  // Stricter system prompt for 2 lines
  const payload = {
    model: "openai/gpt-3.5-turbo",
    max_tokens: 60,  // limit tokens to keep responses short
    messages: [
      {
        role: "system",
        content: 
          "You are a terrible advice giver. Respond with the worst, most sarcastic, and hilariously unhelpful advice. " +
          "Write EXACTLY two lines, each line no more than 15 words. Keep it snappy, absurd, and loosely related."
      },
      {
        role: "user",
        content: prompt
      }
    ]
  };

  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + getApiKey()
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    const advice = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content
      ? data.choices[0].message.content.trim()
      : "Error: No advice found.";
    displayAdvice(advice);

  } catch (error) {
    displayAdvice("Oops, something went wrong. Try again later.");
    console.error(error);
  }
}

// Display advice with typewriter effect
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

  // Enforce 25-word limit
  const wordCount = prompt.split(/\s+/).length;
  if (wordCount > 25) {
    alert("Please limit your problem to 25 words.");
    return;
  }

  currentPrompt = prompt;
  fetchAdvice(prompt);
});

// "Get Another Advice" re-fetches with the same stored prompt
anotherBtn.addEventListener("click", function(e) {
  e.preventDefault();
  if (currentPrompt) {
    // Restore the prompt in the text area before fetching advice again
    userInput.value = currentPrompt;
    fetchAdvice(currentPrompt);
  }
});

// "This is terrible, I love it" button action
loveItBtn.addEventListener("click", function(e) {
  e.preventDefault();
  alert("Thanks for loving the worst advice, you should love Arittro too!");
});
