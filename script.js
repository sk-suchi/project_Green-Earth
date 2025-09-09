const spinner = document.querySelector("#spinner");

function showSpinner() {
  spinner.classList.remove("hidden");
  document.querySelector("#cardSection").innerText = ""; 
}

function hideSpinner() {
  spinner.classList.add("hidden");
  document.querySelector("#cardSection").classList.remove("hidden"); 
}

if (!spinner) {
  document.querySelector("#spinner").classList.add("hidden");
}

const getAllPlants = async () => {
  showSpinner();
  await fetch(`https://openapi.programming-hero.com/api/plants`)
    .then((res) => res.json())
    .then((data) => showCard(data.plants));
};
getAllPlants();

document
  .querySelector("#allCategories")
  .addEventListener("click", getAllPlants);

const showCard = (plants) => {
  hideSpinner();
  const cardSelection = document.querySelector("#cardSection");
  cardSelection.innerHTML = "";
  plants.forEach((plant) => {
    const span = document.createElement("span");
    span.innerHTML = `
  <div class="card bg-base-100 shadow-sm p-4 h-full">
          <figure class="w-full" >
            <img class="w-full h-48 object-cover rounded-xl" src=${plant.image} alt="Shoes" class="rounded-xl" />
          </figure>
          <div class="card-body px-0">
            <h2 id="cardTitle" class="card-title">${plant.name}</h2>
            <p>${plant.description}</p>
            <div class="flex justify-between">
              <div class="badge bg-green-200 text-green-700">${plant.category}</div>
              <div>
                <p class="font-bold" >৳ ${plant.price}</p>
              </div>
            </div>
            <div class="card-actions w-full mt-auto pt-5">
              <button
              id="cartBtn"
              class="btn btn-success w-full rounded-2xl">Add To Cart</button>
            </div>
          </div>
        </div>
  `;
    span.querySelector("#cardTitle").addEventListener("click", () => {
      const modal = document.querySelector("#my_modal_2");

      const modalTitle = modal.querySelector("#modalTitle");
      const modalImage = modal.querySelector("#modalImage");
      const modalDescription = modal.querySelector("#modalDescription");
      const price = document.querySelector("#price");
      const category = document.querySelector("#category");

      modalImage.src = plant.image;
      modalDescription.innerText = plant.description;
      modalTitle.innerText = plant.name;
      price.innerText = plant.price;
      category.innerText = plant.category;

      modal.showModal();
    });

    const button = span.querySelector("#cartBtn");
    button.addEventListener("click", () => {
      if (confirm(`Do you want to add ${plant.name} to your card`)) {
        cartFunctionality(plant);
      }
    });
    cardSelection.appendChild(span);
  });
};

const categorisSection = async () => {
  showSpinner();
  await fetch(`https://openapi.programming-hero.com/api/categories`)
    .then((res) => res.json())
    .then((data) => leftBarr(data.categories));
};

categorisSection();

const leftBarr = (categories) => {
  hideSpinner();
  const leftSideBar = document.querySelector("#leftBar");
  const allCategoriesBtn = document.querySelector("#allCategories");

  allCategoriesBtn.addEventListener("click", () => {
    const allBtns = leftSideBar.querySelectorAll("button");
    allBtns.forEach((btn) =>
      btn.classList.remove("bg-green-700", "text-white")
    );
    allCategoriesBtn.classList.add("bg-green-700", "text-white");
    getAllPlants();
  });

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.classList.add(
      "hover:bg-green-400",
      "cursor-pointer",
      "w-full",
      "text-start",
      "font-semibold",
      "p-1",
      "rounded"
    );
    button.innerText = `${category.category_name}`;
    leftSideBar.appendChild(button);

    button.addEventListener("click", () => {
      showCardByCategories(category.id);
      const allBtn = leftSideBar.querySelectorAll("button");
      allBtn.forEach((btn) =>
        btn.classList.remove("bg-green-700", "text-white")
      );
      button.classList.add("bg-green-700", "text-white");
    });
  });
};

const showCardByCategories = async (id) => {
  showSpinner();
  await fetch(`https://openapi.programming-hero.com/api/category/${id}`)
    .then((res) => res.json())
    .then((data) => showCard(data.plants));
};

let cartArr = 0;

const cartFunctionality = (plant) => {
  let plantName = plant.name;
  let plantPrice = plant.price;
  let plantId = plant.id;

  const cardSection = document.querySelector("#cartSection");
  document.querySelector("#toggleCartDiv").classList.remove("hidden");
  const price = document.querySelector("#totalTk");
  const div = document.createElement("div");
  div.innerHTML = `
  <div class="bg-gray-100 flex items-center justify-between rounded-xl p-1 mb-2">
            <div>
              <p class="font-bold">${plantName}</p>
              <p class="text-gray-500 font-semibold">৳ ${plantPrice}  × 1</p>
            </div>
            <button id="removeBtn" class="cursor-pointer pr-3 hover:text-red-700 font-bold text-4xl">❌</button>
          </div>
  `;
  cartArr += plantPrice;
  price.innerText = cartArr;
  cardSection.appendChild(div);

  div.querySelector("#removeBtn").addEventListener("click", () => {
    div.remove();
    cartArr -= plantPrice;
    price.innerText = cartArr;
    if (cartArr === 0) {
      document.querySelector("#toggleCartDiv").classList.add("hidden");
    }
  });
};
