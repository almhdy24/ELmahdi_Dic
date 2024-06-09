const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const definitionsContainer = document.getElementById("definitions");

searchButton.addEventListener("click", () => {
    const word = searchInput.value.trim();
    if (word === "") {
        alert("Please enter a word to search.");
        return;
    }

    definitionsContainer.innerHTML = "Loading..."; // Show loading message

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(response => response.json())
        .then(data => {
            renderDefinitions(data);
            playAudio(word);
            //definitionsContainer.innerHTML = ""; // Clear loading message after data is rendered
        })
        .catch(error => {
            // console.error("Error fetching data:", error);
            alert("An error occurred while fetching data.");
            // definitionsContainer.innerHTML = ""; // Clear loading message in case of error
        });
});
function renderDefinitions(data) {
    definitionsContainer.innerHTML = "";

    data.forEach(item => {
        item.meanings.forEach(meaning => {
            const definition = document.createElement("div");
            definition.classList.add("definition");

            const partOfSpeech = document.createElement("div");
            partOfSpeech.classList.add("part-of-speech");
            partOfSpeech.textContent = `(${meaning.partOfSpeech})`;

            meaning.definitions.forEach(def => {
                const definitionText = document.createElement("div");
                definitionText.classList.add("definition-text");
                definitionText.textContent = `Definition: ${def.definition}`;

                const example = document.createElement("div");
                example.classList.add("example");
                example.textContent = `Example: ${def.example || null}`;

                definition.appendChild(partOfSpeech);
                definition.appendChild(definitionText);
                definition.appendChild(example);
            });

            definitionsContainer.appendChild(definition);
        });
    });
}

function playAudio(word) {
    const audioContainer = document.getElementById("audio");
    audioContainer.innerHTML = "";

    const audioButton = document.createElement("button");
    let isPlaying = false;

    function toggleIcon() {
        if (isPlaying) {
            audioButton.innerHTML = `<i class="fas fa-pause"></i> Pause Audio`;
        } else {
            audioButton.innerHTML = `<i class="fas fa-play"></i> Play Audio`;
        }
    }

    toggleIcon();

    audioButton.addEventListener("click", () => {
        if (isPlaying) {
            audio.pause();
            isPlaying = false;
        } else {
            audio.play();
            isPlaying = true;
        }

        toggleIcon();
    });

    audioContainer.appendChild(audioButton);

    const audio = new Audio(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );

    audio.addEventListener("ended", () => {
        isPlaying = false;
        toggleIcon();
    });
}
