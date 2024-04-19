let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const toyCollection = document.getElementById("toy-collection");
  const toyForm = document.querySelector(".add-toy-form");

  // Task 1: Fetch and render toys
  function fetchAndRenderToys() {
      fetch("http://localhost:3000/toys")
          .then(response => response.json())
          .then(toys => {
              toys.forEach(toy => renderToyCard(toy));
          })
          .catch(error => console.error("Error fetching toys:", error));
  }

  function renderToyCard(toy) {
      const card = document.createElement("div");
      card.className = "card";

      const h2 = document.createElement("h2");
      h2.textContent = toy.name;

      const img = document.createElement("img");
      img.src = toy.image;
      img.className = "toy-avatar";

      const p = document.createElement("p");
      p.textContent = `${toy.likes} Likes`;

      const likeButton = document.createElement("button");
      likeButton.textContent = "Like ❤️";
      likeButton.className = "like-btn";
      likeButton.dataset.toyId = toy.id;

      likeButton.addEventListener("click", () => {
          updateLikes(toy);
      });

      card.append(h2, img, p, likeButton);
      toyCollection.appendChild(card);
  }

  // Task 2: Add a new toy
  toyForm.addEventListener("submit", event => {
      event.preventDefault();
      const formData = new FormData(toyForm);
      const newToy = {
          name: formData.get("name"),
          image: formData.get("image"),
          likes: 0
      };

      fetch("http://localhost:3000/toys", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
          },
          body: JSON.stringify(newToy)
      })
      .then(response => response.json())
      .then(newToy => renderToyCard(newToy))
      .catch(error => console.error("Error adding new toy:", error));

      toyForm.reset();
  });

  // Task 3: Update toy likes
  function updateLikes(toy) {
      const newLikes = toy.likes + 1;

      fetch(`http://localhost:3000/toys/${toy.id}`, {
          method: "PATCH",
          headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
          },
          body: JSON.stringify({ likes: newLikes })
      })
      .then(response => response.json())
      .then(updatedToy => {
          const toyCard = document.querySelector(`.card[data-toy-id="${updatedToy.id}"]`);
          toyCard.querySelector("p").textContent = `${updatedToy.likes} Likes`;
      })
      .catch(error => console.error("Error updating toy likes:", error));
  }

  // Fetch and render toys on page load
  fetchAndRenderToys();
});