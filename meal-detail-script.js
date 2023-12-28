import { addRemoveToFavList, dbObjectFavList} from "./App.js";




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




async function mealDetailPage() {
    const list = JSON.parse(localStorage.getItem(dbObjectFavList));
    const urlParams = new URLSearchParams(window.location.search);
    const mealId = urlParams.get('id');
    //const list = JSON.parse(localStorage.getItem(dbObjectFavList));
    const idMealUrl = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i='
    const meal = await fetch(idMealUrl + mealId).then(response => response.json()).catch(error => console.error("Error: ", error));
    var mealDetails = meal.meals[0];

    const container = document.createElement('div');
    container.classList.add('container', 'remove-top-margin');

    const itemDetails = document.createElement('div');
    itemDetails.classList.add('item-details');

    const itemDetailsLeft = document.createElement('div');
    itemDetailsLeft.classList.add('item-details-left');

    const img = document.createElement('img');
    img.src = mealDetails.strMealThumb;
    img.alt = '';

    itemDetailsLeft.appendChild(img);

    const itemDetailsRight = document.createElement('div');
    itemDetailsRight.classList.add('item-details-right');

    const itemName = document.createElement('div');
    itemName.classList.add('item-name');
    itemName.innerHTML = `
    <strong>Name: </strong>
    <span class="item-text">
        ${mealDetails.strMeal}
    </span>`;

    const itemCategory = document.createElement('div');
    itemCategory.classList.add('item-category');
    itemCategory.innerHTML = `
    <strong>Category: </strong>
    <span class="item-text">
        ${mealDetails.strCategory}
    </span>`;

    const itemIngredient = document.createElement('div');
    itemIngredient.classList.add('item-ingredient');
    itemIngredient.innerHTML = `
    <strong>Ingredient: </strong>
    <span class="item-text">
        ${mealDetails.strIngredient1}, ${mealDetails.strIngredient2},
        ${mealDetails.strIngredient3}, ${mealDetails.strIngredient4}
    </span>`;

    const itemInstruction = document.createElement('div');
    itemInstruction.classList.add('item-instruction');
    itemInstruction.innerHTML = `
    <strong>Instructions: </strong>
    <span class="item-text">
        ${mealDetails.strInstructions}
    </span>`;

    const itemVideo = document.createElement('div');
itemVideo.classList.add('item-video');

const videoLinkText = document.createElement('span');
videoLinkText.classList.add('item-text');
videoLinkText.innerHTML = `
    <strong>Video Link:</strong>
    <a href='${mealDetails.strYoutube}' target="blank"> Click Here<a/>`;

const lineBreak = document.createElement('p');

const likeButton = document.createElement('button');
likeButton.id = 'like-button';
likeButton.addEventListener('click', () => addRemoveToFavList(mealDetails.idMeal, likeButton));
likeButton.innerHTML = isFav(list, mealDetails.idMeal) ? 'Remove From Favourite' : 'Add To Favourite';

itemVideo.appendChild(videoLinkText);
itemVideo.appendChild(lineBreak);
itemVideo.appendChild(likeButton);


    itemDetailsRight.appendChild(itemName);
    itemDetailsRight.appendChild(itemCategory);
    itemDetailsRight.appendChild(itemIngredient);
    itemDetailsRight.appendChild(itemInstruction);
    itemDetailsRight.appendChild(itemVideo);

    itemDetails.appendChild(itemDetailsLeft);
    itemDetails.appendChild(itemDetailsRight);

    const cardsHolder = document.createElement('div');
    cardsHolder.id = 'cards-holder';
    cardsHolder.classList.add('remove-top-margin');

    container.appendChild(itemDetails);
    container.appendChild(cardsHolder);

    document.getElementById('meal-details-page').appendChild(container);

}

mealDetailPage();