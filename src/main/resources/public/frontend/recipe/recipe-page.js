/**
 * This script defines the CRUD operations for Recipe objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

let recipes = [];

// Wait for DOM to fully load before accessing elements
window.addEventListener("DOMContentLoaded", () => {

    /* 
     * TODO: Get references to various DOM elements
     * - Recipe name and instructions fields (add, update, delete)
     * - Recipe list container
     * - Admin link and logout button
     * - Search input
    */
    const addRecipeNameInput = document.getElementById("add-recipe-name-input");
    const addRecipeInstructionsInput = document.getElementById("add-recipe-instructions-input");
    const updateRecipeNameInput = document.getElementById("update-recipe-name-input");
    const updateRecipeInstructionsInput = document.getElementById("update-recipe-instructions-input");
    const deleteRecipeNameInput = document.getElementById("delete-recipe-name-input");

    const recipeList = document.getElementById("recipe-list");

    const adminLink = document.getElementById("admin-link");

    const logoutButton = document.getElementById("logout-button");
    const addRecipeButton = document.getElementById("add-recipe-submit-input");
    const updateRecipeButton = document.getElementById("update-recipe-submit-input");
    const deleteRecipeButton = document.getElementById("delete-recipe-submit-input");
    const searchButton = document.getElementById("search-button");

    const searchInput = document.getElementById("search-input");
    /*
     * TODO: Show logout button if auth-token exists in sessionStorage
     */
    if (sessionStorage.getItem("auth-token")) {
        logoutButton.style.display = "block";
    }
    /*
     * TODO: Show admin link if is-admin flag in sessionStorage is "true"
     */
    if (sessionStorage.getItem("is-admin") === true) {
        adminLink.style.display = "block";
    }
    /*
     * TODO: Attach event handlers
     * - Add recipe button → addRecipe()
     * - Update recipe button → updateRecipe()
     * - Delete recipe button → deleteRecipe()
     * - Search button → searchRecipes()
     * - Logout button → processLogout()
     */
    addRecipeButton.onclick = addRecipe;
    updateRecipeButton.onclick = updateRecipe;
    deleteRecipeButton.onclick = deleteRecipe;
    searchButton.onclick = searchRecipes;
    logoutButton.onclick = processLogout;

    /*
     * TODO: On page load, call getRecipes() to populate the list
     */
    getRecipes();

    /**
     * TODO: Search Recipes Function
     * - Read search term from input field
     * - Send GET request with name query param
     * - Update the recipe list using refreshRecipeList()
     * - Handle fetch errors and alert user
     */
    async function searchRecipes() {
        // Implement search logic here
        var search = searchInput.value;

    }

    /**
     * TODO: Add Recipe Function
     * - Get values from add form inputs
     * - Validate both name and instructions
     * - Send POST request to /recipes
     * - Use Bearer token from sessionStorage
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function addRecipe() {
        // Implement add logic here
        var addRecipeInstructions = addRecipeInstructionsInput.value;
        var addRecipeName = addRecipeNameInput.value;
        const token = sessionStorage.getItem("auth-token");
        if (!addRecipeInstructions || !addRecipeName) {
            alert("Both fields must be filled");
            return;
        }
        const requestOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ addRecipeName, addRecipeInstructions })
        };
        const response = await fetch(`${BASE_URL}/recipes`, requestOptions);
        if (response.status === 201) {
            recipes.push();
            refreshRecipeList(); 
            addRecipeInstructionsInput.value = "";
            addRecipeNameInput.value = "";
        }
    }

    /**
     * TODO: Update Recipe Function
     * - Get values from update form inputs
     * - Validate both name and updated instructions
     * - Fetch current recipes to locate the recipe by name
     * - Send PUT request to update it by ID
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function updateRecipe() {
        // Implement update logic here
        var updateRecipeInstructions = updateRecipeInstructionsInput.value;
        var updateRecipeName = updateRecipeNameInput.value;
        if (!updateRecipeInstructions || !updateRecipeName) {
            alert("Both fields must be filled");
            return;
        }
        const requestOptions = {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ updateRecipeName, updateRecipeInstructions })
        };
        const response = await fetch(`${BASE_URL}/recipes`, requestOptions);
        if (response.status === 201) {
            refreshRecipeList(); 
            updateRecipeInstructionsInput.value = "";
            updateRecipeNameInput.value = "";
        }
    }

    /**
     * TODO: Delete Recipe Function
     * - Get recipe name from delete input
     * - Find matching recipe in list to get its ID
     * - Send DELETE request using recipe ID
     * - On success: refresh the list
     */
    async function deleteRecipe() {
        // Implement delete logic here
        var deleteRecipeName = deleteRecipeNameInput.value;
        if (!deleteRecipeName) {
            alert("Please fill in the field");
        }
        const requestOptions = {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ deleteRecipeName })
        };
        const response = await fetch(`${BASE_URL}/recipes`, requestOptions);
        if (response.status === 201) {
            refreshRecipeList(); 
            deleteRecipeNameInput.value = "";
        }
    }

    /**
     * TODO: Get Recipes Function
     * - Fetch all recipes from backend
     * - Store in recipes array
     * - Call refreshRecipeList() to display
     */
    async function getRecipes() {
        // Implement get logic here
        var currentRecipes = recipeList.value;
        recipes = currentRecipes;
    }

    /**
     * TODO: Refresh Recipe List Function
     * - Clear current list in DOM
     * - Create <li> elements for each recipe with name + instructions
     * - Append to list container
     */
    function refreshRecipeList() {
        // Implement refresh logic here
    }

    /**
     * TODO: Logout Function
     * - Send POST request to /logout
     * - Use Bearer token from sessionStorage
     * - On success: clear sessionStorage and redirect to login
     * - On failure: alert the user
     */
    async function processLogout() {
        // Implement logout logic here
    }

});
