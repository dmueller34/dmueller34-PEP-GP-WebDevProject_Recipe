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
    if (window.sessionStorage.getItem("auth-token")) {
        logoutButton.style.display = "inline-block";
    }
    /*
     * TODO: Show admin link if is-admin flag in sessionStorage is "true"
     */
    if (window.sessionStorage.getItem("is-admin") === "true") {
        adminLink.style.display = "inline";
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
        var search = searchInput.value.trim();
        try {
            const response = await fetch(`${BASE_URL}/recipes?name=${encodeURIComponent(search)}`);
            if (response.status === 200) {
                recipes = await response.json();
                refreshRecipeList();
                return;
            } else {
                throw new Error("Cannot find recipe");
            }
        } catch (error) {
            alert(error);
        }

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
        var instructions = addRecipeInstructionsInput.value.trim();
        var name = addRecipeNameInput.value.trim();
        const token = window.sessionStorage.getItem("auth-token");
        if (!instructions || !name) {
            alert("Both fields must be filled");
            return;
        }
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
            body: JSON.stringify({ name, instructions })
        };
        const response = await fetch(`${BASE_URL}/recipes`, requestOptions);
        if (response.ok) {
            await getRecipes();
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
        var instructions = updateRecipeInstructionsInput.value.trim();
        var name = updateRecipeNameInput.value.trim();
        if (!instructions || !name) {
            alert("Both fields must be filled");
            return;
        }
        const requestOptions = {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, instructions })
        };
        const targetRecipe = recipes.find(recipe => recipe.name === name);
        const response = await fetch(`${BASE_URL}/recipes/${encodeURIComponent(targetRecipe.id)}`, requestOptions);
        if (response.status === 200) {
            await getRecipes();
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
        var name = deleteRecipeNameInput.value;
        if (!name) {
            alert("Please fill in the field");
        }
        const requestOptions = {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name })
        };
        const targetRecipe = recipes.find(recipe => recipe.name === name);
        const response = await fetch(`${BASE_URL}/recipes/${encodeURIComponent(targetRecipe.id)}`, requestOptions);
        if (response.status === 200) {
            await getRecipes();
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
        const response = await fetch(`${BASE_URL}/recipes`);
        recipes = await response.json();
        refreshRecipeList();
    }

    /**
     * TODO: Refresh Recipe List Function
     * - Clear current list in DOM
     * - Create <li> elements for each recipe with name + instructions
     * - Append to list container
     */
    function refreshRecipeList() {
        // Implement refresh logic here
        recipeList.innerHTML = "";
        for (const recipe of recipes) {
            const li = document.createElement("li");
            li.dataset.id = recipe.id;
            const name = document.createElement("strong");
            name.textContent = recipe.name;
            const instructions = document.createElement("p");
            instructions.textContent = recipe.instructions;
            li.appendChild(name);
            li.appendChild(instructions);
            recipeList.appendChild(li);
        }
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
        const token = window.sessionStorage.getItem("auth-token");
        const requestOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({  })
        };
        try {
            const response = await fetch(`${BASE_URL}/logout`, requestOptions);
            if (response.status === 200) {
                window.sessionStorage.removeItem("auth-token");
                window.sessionStorage.removeItem("is-admin");
                window.location.href = "../login/login-page.html";
                return;
            } else {
                throw new Error("Logout failed");
            }
        } catch (error) {
            alert(error);
        }
    }

});
