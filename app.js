
// DOM element - search box
var searchInput = document.getElementById('search-input');

//DOM element - bars 
const toggleButton = document.getElementById("toggle-sidebar");



/**
 * Check and initialize the local storage items for favorite list and last input
 */
export const dbObjectFavList = "favouritesList";
 if (localStorage.getItem(dbObjectFavList) == null) {
    localStorage.setItem(dbObjectFavList, JSON.stringify([]));
}


/**
 * Check if an ID is in a list of favorites
 *
 * @param list The list of favorites
 * @param id The ID to check
 * @return true if the ID is in the list, false otherwise
 */
function isFav(list, id) {
    let res = false;
    for (let i = 0; i < list.length; i++) {
        if (id == list[i]) {
            res = true;
        }
    }
    return res;
}


if (toggleButton) {
    toggleButton.addEventListener("click", function () {
        showFavMealList();
        sidebar.classList.toggle("show");
    });
} else {
    console.error("Toggle button not found!");
}


/**
 * addRemoveToFavList - function to add or remove a meal from the favorite list
 * 
 * @param {string} id - The id of the meal to be added or removed
 *
 * This function first retrieves the data from local storage and then it checks if the provided meal id already exist in the favorite list.
 * If it exists, it removes it from the list, otherwise it adds it to the list. It then updates the local storage and updates the UI.
 */
 export function addRemoveToFavList(id, likeButton) {
    const list = JSON.parse(localStorage.getItem(dbObjectFavList));
    let db = JSON.parse(localStorage.getItem(dbObjectFavList));
    let ifExist = false;
    for (let i = 0; i < db.length; i++) {
        if (id == db[i]) {
            ifExist = true;

        }

    } if (ifExist) {
        db.splice(db.indexOf(id), 1);

    } else {
        db.push(id);

    }

    localStorage.setItem(dbObjectFavList, JSON.stringify(db));


    likeButton.innerHTML = isFav(list, id) ? 'Add To Favourite' : 'Remove From Favourite';

    MealList(searchInput.value);
    showFavMealList();
    console.log('this running')
}




function noMealToShow() {
    if(searchInput.value.trim() === '') {
        var resultSection = document.getElementById('result-section') ;
        resultSection.innerHTML = '<div id="no-meal-to-show"> No Meal to Show Here! </div>'
    }
    else {
        MealList(searchInput.value) ;
    }
}



const fetchMealsFromApi = async (url, value) => {
    const response = await fetch(`${url + value}`);
    const meals = await response.json();
    return meals;
}


/**

This function is used to show all the meals which are added to the favourite list.

@function

@async

@returns {string} html - This returns html which is used to show the favourite meals.

@throws {Error} If there is no favourite meal then it will show "Nothing To Show....."

@example

showFavMealList()
*/
export async function showFavMealList() {
    const list = JSON.parse(localStorage.getItem(dbObjectFavList));
    let favList = JSON.parse(localStorage.getItem(dbObjectFavList));
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    const favSection = document.getElementById('fav');
    favSection.innerHTML = ''; // Clear existing content
    
    if (favList.length === 0) {
        // Create a div with the message "Nothing To Show....."
        const nothingDiv = document.createElement('div');
        nothingDiv.classList.add('fav-item', 'nothing');
        const h1 = document.createElement('h1');
        h1.textContent = 'Nothing To Show.....';
        nothingDiv.appendChild(h1);
    
        // Append the created div to the favSection
        favSection.appendChild(nothingDiv);
    } else {
        for (let i = 0; i < favList.length; i++) {
            const favMealList = await fetchMealsFromApi(url, favList[i]);
            if (favMealList.meals[0]) {
                const element = favMealList.meals[0];
    
                // Create main container div
                const favItemContainer = document.createElement('div');
                favItemContainer.classList.add('fav-item');
    
                // Create fav-item-photo div
                const favItemPhoto = document.createElement('div');
                favItemPhoto.classList.add('fav-item-photo');
                const img = document.createElement('img');
                img.src = element.strMealThumb;
                img.alt = '';
                favItemPhoto.appendChild(img);
    
                // Create fav-item-details div
                const favItemDetails = document.createElement('div');
                favItemDetails.classList.add('fav-item-details');
    
                // Create fav-item-name div
                const favItemName = document.createElement('div');
                favItemName.classList.add('fav-item-name');
                const strong = document.createElement('strong');
                strong.textContent = 'Name:';
                const span = document.createElement('span');
                span.classList.add('fav-item-text');
                span.textContent = element.strMeal;
                favItemName.appendChild(strong);
                favItemName.appendChild(span);
    
                // Create fav-like-button div with onclick event
                const favLikeButton = document.createElement('button');
                favLikeButton.id = 'fav-like-button';
                favLikeButton.textContent = 'Remove';
                favLikeButton.addEventListener('click', () => addRemoveToFavList(element.idMeal, favLikeButton));
    
                // Append favItemName and favLikeButton to favItemDetails
                favItemDetails.appendChild(favItemName);
                favItemDetails.appendChild(favLikeButton);
    
                // Append favItemPhoto and favItemDetails to favItemContainer
                favItemContainer.appendChild(favItemPhoto);
                favItemContainer.appendChild(favItemDetails);
    
                // Append favItemContainer to favSection
                favSection.appendChild(favItemContainer);
            }
        }
    }
    
}





export var MealList = async function (searchKeyword) {
    const list = JSON.parse(localStorage.getItem(dbObjectFavList));
    const searchMelaUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
    const response = await fetch(searchMelaUrl + searchKeyword).then(response => response.json()).catch(error => console.error("Error: ", error));
    if (response.meals) {
        const resultSection = document.getElementById('result-section');

// Clear existing content
resultSection.innerHTML = '';

response.meals.forEach(element => {
    // Create main container div
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('card');

    // Create anchor element
    const anchorElement = document.createElement('a');
    anchorElement.href = `./meal-detail-page.html?id=${element.idMeal}`;
    anchorElement.target = '_blank';

    // Create card-top div
    const cardTop = document.createElement('div');
    cardTop.classList.add('card-top');

    // Create dish-photo div
    const dishPhoto = document.createElement('div');
    dishPhoto.classList.add('dish-photo');
    const img = document.createElement('img');
    img.src = element.strMealThumb;
    img.alt = '';
    dishPhoto.appendChild(img);

    // Create dish-name div
    const dishName = document.createElement('div');
    dishName.classList.add('dish-name');
    dishName.textContent = element.strMeal;

    // Create dish-details div
    const dishDetails = document.createElement('div');
    dishDetails.classList.add('dish-details');
    dishDetails.innerHTML = `
        Category: ${element.strCategory} <br>
        Native: ${element.strArea} <br>
        Tags: ${element.strTags}
    `;

    // Append dish-photo, dish-name, and dish-details to card-top
    cardTop.appendChild(dishPhoto);
    cardTop.appendChild(dishName);
    cardTop.appendChild(dishDetails);

    // Append card-top to anchor element
    anchorElement.appendChild(cardTop);

    // Create card-bottom div
    const cardBottom = document.createElement('div');
    cardBottom.classList.add('card-bottom');

    // Create like div
    const likeDiv = document.createElement('button');
    likeDiv.id = 'like-button';
    likeDiv.addEventListener('click', () => addRemoveToFavList(element.idMeal, likeDiv));
    likeDiv.innerHTML = isFav(list, element.idMeal) ? 'Remove From Favourite' : 'Add To Favourite';


    // Create play div
    const playDiv = document.createElement('div');
playDiv.classList.add('play');

playDiv.innerHTML = `
    <a href="${element.strYoutube}" target="_blank">
    <svg xmlns="http://www.w3.org/2000/svg" height="16" width="18" viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path fill="#f10909" d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z"/></svg>
    </a>
`;

// Now, append playDiv to your document or another container
document.body.appendChild(playDiv);


    // Append likeDiv and playDiv to card-bottom
    cardBottom.appendChild(likeDiv);
    cardBottom.appendChild(playDiv);

    // Append anchorElement and card-bottom to cardContainer
    cardContainer.appendChild(anchorElement);
    cardContainer.appendChild(cardBottom);

    // Append cardContainer to resultSection
    resultSection.appendChild(cardContainer);
});

    }
}





if (searchInput) {
    searchInput.addEventListener("input", (e) => {
        noMealToShow();
    });

    window.addEventListener("load", (e) => {
        noMealToShow();
    });
} else {
    console.error("Search input not found!");
}
