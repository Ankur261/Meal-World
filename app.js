
var searchInput = document.getElementById('search-input');
const toggleButton = document.getElementById("toggle-sidebar");


/**
 * Check and initialize the local storage items for favorite list and last input
 */
const dbObjectFavList = "favouritesList";
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


toggleButton.addEventListener("click", function () {
    showFavMealList();
    sidebar.classList.toggle("show");
    flexBox.classList.toggle('shrink');
});


/**
 * addRemoveToFavList - function to add or remove a meal from the favorite list
 * 
 * @param {string} id - The id of the meal to be added or removed
 *
 * This function first retrieves the data from local storage and then it checks if the provided meal id already exist in the favorite list.
 * If it exists, it removes it from the list, otherwise it adds it to the list. It then updates the local storage and updates the UI.
 */

function addRemoveToFavList(id) {
    const detailsPageLikeBtn = document.getElementById('like-button');
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
    if (detailsPageLikeBtn != null) {
        detailsPageLikeBtn.innerHTML = isFav(db, id) ? 'Remove From Favourite' : 'Add To Favourite';
    }

    showMealList();
    showFavMealList();
    updateTask();
}



function noMealToShow() {
    if(searchInput.value.trim() === '') {
        var resultSection = document.getElementById('result-section') ;
        resultSection.innerHTML = '<div id="no-meal-to-show"> No Meal to Show Here! </div>'
    }
    else {
        MealList(searchInput.value)
        console.log(searchInput.value) ;
    }
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
async function showFavMealList() {
    let favList = JSON.parse(localStorage.getItem(dbObjectFavList));
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html = "";

    if (favList.length == 0) {
        html = `<div class="fav-item nothing"> <h1> 
        Nothing To Show.....</h1> </div>`
    } else {
        for (let i = 0; i < favList.length; i++) {
            const favMealList = await fetchMealsFromApi(url, favList[i]);
            if (favMealList.meals[0]) {
                let element = favMealList.meals[0];
                html += `
                <div class="fav-item" onclick="showMealDetails(${element.idMeal},'${generateOneCharString()}')">

              
                <div class="fav-item-photo">
                    <img src="${element.strMealThumb}" alt="">
                </div>
                <div class="fav-item-details">
                    <div class="fav-item-name">
                        <strong>Name: </strong>
                        <span class="fav-item-text">
                           ${element.strMeal}
                        </span>
                    </div>
                    <div id="fav-like-button" onclick="addRemoveToFavList(${element.idMeal})">
                        Remove
                    </div>

                </div>

            </div>               
                `
            }
        }
    }
    document.getElementById('fav').innerHTML = html;
}





var MealList = async function (searchKeyword) {
    const searchMelaUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
    const response = await fetch(searchMelaUrl + searchKeyword).then(response => response.json()).catch(error => console.error("Error: ", error));
    let html = '';
    if (response.meals) {
        html = response.meals.map(element => {
            return `
            
            <div class="card" >
            <a href="./meal-detail-page.html?id=${element.idMeal}" target="blank">
            <div class="card-top" >
                <div class="dish-photo" >
                    <img src="${element.strMealThumb}" alt="">
                </div>
                <div class="dish-name">
                    ${element.strMeal}
                </div>
                <div class="dish-details">
                 Catergory: ${element.strCategory}
                 <br>
                 Native: ${element.strArea}
                 <br>
                 Tags: ${element.strTags}
                </div>
            </div>
            </a>
            <div class="card-bottom">
                <div id="like" >
                <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path fill="#e71313" d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>
                </div>
                <div class="play">
                <a href="${element.strYoutube}" target="blank">
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><style>svg{fill:#ea0606}</style><path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"/></svg>
                </a>
                </div>
            </div>
        </div>
        
            `
        }).join('');

        document.getElementById('result-section').innerHTML = html;
    }
}


searchInput.addEventListener("input", (e) => {
   noMealToShow() ;
})

window.addEventListener("load", (e) => {
    noMealToShow() ;
})



