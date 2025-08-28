/**
 * This script defines the add, view, and delete operations for Ingredient objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to various DOM elements
 * - addIngredientNameInput
 * - deleteIngredientNameInput
 * - ingredientListContainer
 * - searchInput (optional for future use)
 * - adminLink (if visible conditionally)
 */
const addIngredientNameInput = document.getElementById("add-ingredient-name-input");
const deleteIngredientNameInput = document.getElementById("delete-ingredient-name-input");
const ingredientListContainer = document.getElementById("ingredient-list");
const adminLink = document.getElementById("back-link");

/* 
 * TODO: Attach 'onclick' events to:
 * - "add-ingredient-submit-button" → addIngredient()
 * - "delete-ingredient-submit-button" → deleteIngredient()
 */
const addIngredientSubmitButton = document.getElementById("add-ingredient-submit-button");
addIngredientSubmitButton.onclick = addIngredient;
const deleteIngredientSubmitButton = document.getElementById("delete-ingredient-submit-button");
deleteIngredientSubmitButton.onclick = deleteIngredient;
/*
 * TODO: Create an array to keep track of ingredients
 */
let ingredients = [];
/* 
 * TODO: On page load, call getIngredients()
 */
getIngredients();

/**
 * TODO: Add Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from addIngredientNameInput
 * - Validate input is not empty
 * - Send POST request to /ingredients
 * - Include Authorization token from sessionStorage
 * - On success: clear input, call getIngredients() and refreshIngredientList()
 * - On failure: alert the user
 */
async function addIngredient() {
    // Implement add ingredient logic here
    var name = addIngredientNameInput.value.trim();
    if (!name) {
        alert("Please fill in the field");
        return;
    }
    const token = window.sessionStorage.getItem("auth-token");
    if (!token) {
        alert("You are not logged in");
        return;
    }
    const requestOptions = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name })
    };
    try {
        const response = await fetch(`${BASE_URL}/ingredients`, requestOptions);
        if (response.ok) {
            await getIngredients();
            refreshIngredientList();
            addIngredientNameInput.value = "";
        } else {
            throw new Error("Unable to add ingredient");
        }
    } catch (error) {
        alert(error);
    }
}


/**
 * TODO: Get Ingredients Function
 * 
 * Requirements:
 * - Fetch all ingredients from backend
 * - Store result in `ingredients` array
 * - Call refreshIngredientList() to display them
 * - On error: alert the user
 */
async function getIngredients() {
    // Implement get ingredients logic here
    try {
        const response = await fetch(`${BASE_URL}/ingredients`);
        if (response.ok) {
            ingredients = await response.json();
            refreshIngredientList();
        } else {
            throw new Error("Could not get the ingredients");
        }
    } catch (error) {
        alert(error);
    }

}


/**
 * TODO: Delete Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from deleteIngredientNameInput
 * - Search ingredientListContainer's <li> elements for matching name
 * - Determine ID based on index (or other backend logic)
 * - Send DELETE request to /ingredients/{id}
 * - On success: call getIngredients() and refreshIngredientList(), clear input
 * - On failure or not found: alert the user
 */
async function deleteIngredient() {
    // Implement delete ingredient logic here
    var name = deleteIngredientNameInput.value;
    if (!name) {
        alert("Please fill in the field");
        return;
    }
    const requestOptions = {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name })
    };
    const targetIngredient = ingredients.find(ingredient => ingredient.name === name);
    try {
        const response = await fetch(`${BASE_URL}/ingredients/${encodeURIComponent(targetIngredient.id)}`, requestOptions);
        if (response.ok) {
            await getIngredients();
            refreshIngredientList();
            deleteIngredientNameInput.value = "";
        } else {
            throw new Error("Unable to delete ingredient");
        }
    } catch (error) {
        alert(error);
    }
}


/**
 * TODO: Refresh Ingredient List Function
 * 
 * Requirements:
 * - Clear ingredientListContainer
 * - Loop through `ingredients` array
 * - For each ingredient:
 *   - Create <li> and inner <p> with ingredient name
 *   - Append to container
 */
function refreshIngredientList() {
    // Implement ingredient list rendering logic here
    ingredientListContainer.innerHTML = "";
    for (const ingredient of ingredients) {
        const li = document.createElement("li");
        li.dataset.id = ingredient.id;
        const name = document.createElement("p");
        name.textContent = ingredient.name;
        li.appendChild(name);
        ingredientListContainer.appendChild(li);
    }
}
