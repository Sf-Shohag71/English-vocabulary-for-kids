// Essentail feature of the application
const createElements = (arr) => {
  const htmlElements = arr.map(
    (el) => `<span class="btn bg-[#EDF7FF]">${el}</span>`,
  );
  return htmlElements.join(" ");
};

// function pronounceWord(word) {
//   const utterance = new SpeechSynthesisUtterance(word);
//   utterance.lang = "en-EN"; // English
//   // Lower values make the speech slower (default is 1.0)
//   // utterance.rate = 0.75;
//   window.speechSynthesis.speak(utterance);
// }
function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-US"; 
  
  // Lower values make the speech slower (default is 1.0)
  utterance.rate = 0.5; 
  
  window.speechSynthesis.speak(utterance);
}


const manageSpinner = (status) => {
  if (status) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("word-container").classList.add("hidden");
  } else {
    document.getElementById("word-container").classList.remove("hidden");
    document.getElementById("spinner").classList.add("hidden");
  }
};

// API's load and display data
const loadLesson = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((json) => displayLesson(json.data));
};

const removeActive = () => {
  const lessonButtons = document.querySelectorAll(".lesson-btn");
  // console.log(lessonButtons);
  lessonButtons.forEach((btn) => btn.classList.remove("active"));
};

const getLevelWord = (id) => {
  manageSpinner(true);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      removeActive(); //remove all active class
      const activeLevelBtn = document.getElementById(`lesson-btn-${id}`);
      // console.log(activeLevelBtn);
      activeLevelBtn.classList.add("active"); //add active class

      displayLevelWord(data.data);
    });
};

const loadWordDetails = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  const res = await fetch(url);
  const details = await res.json();
  displayWordDetails(details.data);
};

const displayWordDetails = (data) => {
  // console.log(data);
  // {
  //   "id": 1,
  //   "level": 1,
  //   "word": "Apple",
  //   "meaning": "আপেল",
  //   "pronunciation": "অ্যাপল",
  //   "sentence": "She eats an apple every morning.",
  //   "points": 1,
  //   "partsOfSpeech": "noun",
  //   "synonyms": [
  //       "fruit"
  //   ]
  // }
  const wordDetails = document.getElementById("details-container");
  wordDetails.innerHTML = `
    <div class="">
      <h2 class="text-2xl font-bold">
        ${data.word} (<i class="fa-solid fa-microphone-lines"></i> : ${data.pronunciation})
      </h2>
      </div>
      <div class="">
        <h2 class="font-bold">Meaning</h2>
        <p>${data.meaning}</p>
      </div>
          <div class="">
            <h2 class="font-bold">Example</h2>
            <p>${data.sentence}</p>
          </div>
          <div class="space-y-3">
            <h2 class="font-bold font-bangla">সমার্থক শব্দ গুলো</h2>
            <div class="space-x-2">
              ${createElements(data.synonyms)}
            </div>
          </div>
  `;
  document.getElementById("word_details").showModal();
};

const displayLevelWord = (words) => {
  const levelWordContainer = document.getElementById("word-container");
  levelWordContainer.innerHTML = "";

  if (words.length === 0) {
    levelWordContainer.innerHTML = `
      <div class="text-center space-y-6 col-span-full font-bangla">
        <img class="mx-auto" src="./assets/alert-error.png" />
        <p class="text-gray-400 text-md">
          এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।
        </p>
        <h2 class="text-3xl font-bold">নেক্সট Lesson এ যান</h2>
      </div>
    `;
    manageSpinner(false);
    return;
  }

  words.forEach((word) => {
    // {
    //     "id": 11,
    //     "level": 1,
    //     "word": "Sun",
    //     "meaning": "সূর্য",
    //     "pronunciation": "সান"
    // }

    const card = document.createElement("div");
    card.innerHTML = `
        <div
        class="bg-white py-10 px-5 text-center rounded-md shadow-sm space-y-4"
        >
            <h3 class="text-xl md:text-2xl font-bold">${word.word ? word.word : "শব্দ পাওয়া যায় নি"}</h3>
            <p class="font-semibold">Meaning / Pronunciation</p>
            <div class="font-bangla text-xl md:text-2xl font-medium">"${word.meaning ? word.meaning : "অর্থ পাওয়া যায় নি"} / ${word.pronunciation ? word.pronunciation : "Pronunciation পাওয়া যায় নি"}"</div>
            <div class="flex justify-between items-center">
            <button onclick="loadWordDetails(${word.id})" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF60]">
                <i class="fa-solid fa-circle-info"></i>
            </button>
            <button onclick="pronounceWord('${word.word}')" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF60]">
                <i class="fa-solid fa-volume"></i>
            </button>
            </div>
      </div>
        `;
    levelWordContainer.append(card);
  });
  manageSpinner(false);
};

const displayLesson = (lessons) => {
  const levelContainer = document.getElementById("level-container");
  levelContainer.innerHTML = "";

  for (let lesson of lessons) {
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
            <button id="lesson-btn-${lesson.level_no}" onclick="getLevelWord(${lesson.level_no})" class="btn btn-red lesson-btn">
                <i class="fa-solid fa-book-open"></i> Lesson - ${lesson.level_no}
            </button>
        `;
    levelContainer.append(btnDiv);
  }
};

loadLesson();

// Search implementation
document.getElementById("btn-search").addEventListener("click", () => {
  removeActive();
  const input = document.getElementById("input-search");
  const searchInput = input.value.trim().toLowerCase();
  // console.log(searchInput);

  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
      const allData = data.data;
      const filteredData = allData.filter((el) =>
        el.word.toLowerCase().includes(searchInput),
      );
      displayLevelWord(filteredData);
    });
});
