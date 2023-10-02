function isFav(list, id) {
    let res = false;
    for (let i = 0; i < list.length; i++) {
        if (id == list[i]) {
            res = true;
        }
    }
    return res;
}

async function  mealDetailPage () {
    const urlParams = new URLSearchParams(window.location.search) ;
    const mealId = urlParams.get('id');
    //const list = JSON.parse(localStorage.getItem(dbObjectFavList));
    const idMealUrl = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=' 
    const meal = await fetch(idMealUrl + mealId).then(response => response.json()).catch(error => console.error("Error: ", error));
    var mealDetails = meal.meals[0] ;  
     let html = ''
        html = `
        <div class="container remove-top-margin">
        <div class="item-details">
        <div class="item-details-left">
        <img src="  ${mealDetails.strMealThumb}" alt="">
    </div>
    <div class="item-details-right">
        <div class="item-name">
            <strong>Name: </strong>
            <span class="item-text">
            ${mealDetails.strMeal}
            </span>
         </div>
        <div class="item-category">
            <strong>Category: </strong>
            <span class="item-text">
            ${mealDetails.strCategory}
            </span>
        </div>
        <div class="item-ingrident">
            <strong>Ingrident: </strong>
            <span class="item-text">
            ${mealDetails.strIngredient1},${mealDetails.strIngredient2},
            ${mealDetails.strIngredient3},${mealDetails.strIngredient4}
            </span>
        </div>
        <div class="item-instruction">
            <strong>Instructions: </strong>
            <span class="item-text">
            ${mealDetails.strInstructions}
            </span>
        </div>
        <div class="item-video">
            <strong>Video Link:</strong>
            <span class="item-text">        
            </span>
            <div id="like-button" > 
             ${isFav(mealDetails.idMeal) ? 'Remove From Favourite' : 'Add To Favourite'} </div>
        </div>
    </div>
</div> 
        <div class="card-name">
        Related Items
    </div>
    <div id="cards-holder" class=" remove-top-margin ">`
    

    document.getElementById('meal-details-page').innerHTML = html;

    //onclick="addRemoveToFavList(${mealDetails.idMeal})"
}

mealDetailPage() ;