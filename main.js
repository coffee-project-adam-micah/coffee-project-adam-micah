"use strict"

function renderCoffeeDiv(coffee) {
    let html = '<div class="coffee col-md-6 col-sm-12" data-id="' + coffee.id + '">';
    html += '<h1 class=" ">' + coffee.name + '</h1>';
    html += '<p class="text-secondary font-pacifico">' + coffee.roast + '</p>';
    if (coffee.addedByUser) {
        html += `<button class="btn btn-sm btn-outline-danger ms-auto align-self-center button-remove-item"><i class="fa-solid fa-trash"></i></button>`;
    }
    html += '</div>';

    return html;
}

function renderCoffees(arr) {
    let html = '';
    for (let i = 0; i < arr.length; i++) {
        html += renderCoffeeDiv(arr[i]);
    }
    return html;
}

function searchCoffees(string) {
    let arr = [];
    if (string === "") {
        return arr
    }
    if (string === "all roasts") {
        return coffees
    }
    for (const coffee of coffees) {
        if (coffee.name.toLowerCase().includes(string.toLowerCase()) || coffee.roast.includes(string.toLowerCase())) {
            arr.push(coffee);
        }
    }
    return arr;
}

function addCoffee(name, roast) {
    if (checkForCoffeeDuplicates(name, roast)) {
        return
    }
    let myId = coffees.length + 1;
    let myOb = {
        id: myId,
        name: name,
        roast: roast,
        addedByUser: true,
    }
    coffees.push(myOb)
    localStorage.setItem("coffees", JSON.stringify(coffees));
}

function checkForCoffeeDuplicates(name, roast) {
    for (const coffee of coffees) {
        if (coffee.name.toLowerCase() === name.toLowerCase() && coffee.roast.toLowerCase() === roast.toLowerCase()) {
            displayWarningUnder(submitCoffee, coffee.name);
            return true;
        }
    }
    return false;
}

function loadCoffeesFromLocalStorage() {
    let arr = JSON.parse(localStorage.getItem("coffees") || "[]");
    if (coffees.length < arr.length) {
        coffees = arr;
    }
}

function removeCoffeeDiv(id) {
    const coffeeToRemoveIdx = coffees.findIndex(e => e.id === id);
    coffees.splice(coffeeToRemoveIdx, 1);
    localStorage.setItem("coffees", JSON.stringify(coffees));
}

function displayWarningUnder(element, name) {
    const warning = document.createElement('div');
    warning.classList.add('alert', 'alert-warning', 'alert-dismissible', 'fade', 'show');
    warning.innerHTML = `${name} already exists! <button type="button" class="btn-close" data-bs-dismiss="alert"></button>`
    element.parentNode.insertBefore(warning, element.nextSibling);
}

function addRemoveItemEventListeners() {
    const buttons = Array.from(removeItemButtons);
    for (const button of buttons) {
        button.addEventListener('click', (event) => {
            let id = event.target.parentElement.getAttribute('data-id');
            removeCoffeeDiv(id);
            window.location.reload();
        });
    }
}

// from http://www.ncausa.org/About-Coffee/Coffee-Roasts-Guide
let coffees = [
    {id: 1, name: 'Light City', roast: 'light'},
    {id: 2, name: 'Half City', roast: 'light'},
    {id: 3, name: 'Cinnamon', roast: 'light'},
    {id: 4, name: 'City', roast: 'medium'},
    {id: 5, name: 'American', roast: 'medium'},
    {id: 6, name: 'Breakfast', roast: 'medium'},
    {id: 7, name: 'High', roast: 'dark'},
    {id: 8, name: 'Continental', roast: 'dark'},
    {id: 9, name: 'New Orleans', roast: 'dark'},
    {id: 10, name: 'European', roast: 'dark'},
    {id: 11, name: 'Espresso', roast: 'dark'},
    {id: 12, name: 'Viennese', roast: 'dark'},
    {id: 13, name: 'Italian', roast: 'dark'},
    {id: 14, name: 'French', roast: 'dark'},
];

const tbody = document.querySelector('#coffees');
const submitButton = document.querySelector('#submit-search');
const coffeeSearch = document.querySelector("#coffee-search");
const roastSelection = document.querySelector('#roast-selection');
const submitCoffee = document.querySelector("#submit-coffee");
const addCoffeeRoast = document.querySelector("#add-coffee-roast");
const addCoffeeName = document.querySelector("#add-coffee-name");
const removeLocalStorageButton = document.querySelector('#remove-local-storage');
const removeItemButtons = document.getElementsByClassName('button-remove-item');

loadCoffeesFromLocalStorage();
tbody.innerHTML = renderCoffees(coffees);
addRemoveItemEventListeners();

submitButton.addEventListener('click', () => {
    tbody.innerHTML = renderCoffees(searchCoffees(coffeeSearch.value));
});

coffeeSearch.addEventListener("keyup", () => {
    tbody.innerHTML = renderCoffees(searchCoffees(coffeeSearch.value.trim()));
});

roastSelection.addEventListener('change', () => {
    tbody.innerHTML = renderCoffees(searchCoffees(roastSelection.value));
});

submitCoffee.addEventListener("click", () => {
    addCoffee(addCoffeeName.value, addCoffeeRoast.value);
    tbody.innerHTML = renderCoffees(coffees);
    addRemoveItemEventListeners();
});

removeLocalStorageButton.addEventListener("click", () => {
    localStorage.removeItem("coffees");
    window.location.reload();
});

