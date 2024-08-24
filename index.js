let prev = document.getElementById("ingredient");
async function getData() {
    let ingredients = document.getElementById("ingredient");
    let count = 0;
    if (prev != ingredients) {
        document.body.innerHTML = `<div class = "header"><br><br>
        <h1>What's in your fridge today?</h1><br>
        <h4>Create something delicious with what you have at home!</h4><br><br>
        <input id = "ingredient"type="text" placeholder = "Cheese, Tomatoes, etc..."><br><br><br>
        <button id = "btn" onclick = "getData()" type = "button">Search</button>
    </div>`;
    } 
    prev = ingredients;
    let url = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${api_key}&ingredients=${ingredients.value}`;
    let response = await fetch(url);
    let data = await response.json();
    console.log(data);
    let missingIngredients = [];
    let unusedIngredients = [];
    let itemName = "", missedCount = 0, usedCount = 0; 
    for (let x = 0; x < data.length; x++) {
        const {image, 
                missedIngredientCount : missedCount,
                missedIngredients,
                title : itemName,
                usedIngredientCount : usedCount,
                usedIngredients} = data[x];
        for (let x = 0; x < missedIngredients.length; x++) {
            const {original} = missedIngredients[x];
            missingIngredients.push(original);
        }
        for (let x = 0; x < usedIngredients.length; x++) {
            const {original} = usedIngredients[x];
            unusedIngredients.push(original);
        }
        load(image, itemName, percentOfIngredients(missedCount, usedCount), count);
        missingIngredients = [];
        unusedIngredients = [];
        count++;
    }

    count = 0;
    while (count < data.length) {
        let id = getId(count, data);
        let url_2 = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${api_key}`;
        let response_2 = await fetch(url_2);
        let data_2 = await response_2.json();
        const {sourceUrl} = data_2;
        loadrecipes(getIngredients(count, data), getName(count, data), percentageYouHave(count, data), count, sourceUrl);
        count++;
    }
}

function getIngredients(count, data) {
    let getIngredients = "";
    const {missedIngredients} = data[count]; 
    for (let x = 0; x < missedIngredients.length; x++) {
        const {original} = missedIngredients[x];
        getIngredients += original + "⭐";
    }
    const {usedIngredients} = data[count];
    for (let x = 0; x < usedIngredients.length; x++) {
        const {original} = usedIngredients[x];
        getIngredients += original + "⭐";
    }
    console.log(getIngredients);
    return getIngredients; 
}

function percentageYouHave(count, data) {
    const {missedIngredientCount, usedIngredientCount } = data[count];
    return percentOfIngredients(missedIngredientCount, usedIngredientCount);
}

function getName(count, data) {
    const {title} = data[count];
    return title;
}

function getId(count, data) {
    const {id} = data[count];
    return id;
}

async function load(image, name, percentage, count) {
    document.body.innerHTML += `<div class = "content">
    <img src = "${image}">
    <div class = "posting" id = "posting${count}">
        <h2 id = "name" class = "child">${name}</h2><br>
        <h6 class = "child">You have ${percentage}% of the ingredients</h6><br>
        <button class = "child" id = "ingred${count}">View Ingredients</button><br><br>
        <button class = "child" id = "viewIngredients">View Recipe</button>
        </div>
    </div>`
}


function loadrecipes(ingredientsList, title, percentage, count, url) { // url is for View Recipe - just need to add it to the button 
    console.log(url);
    let content = document.getElementById(`ingred${count}`);
    let posting = document.getElementById(`posting${count}`);

    content.classList.add("addStyle");
    
    content.addEventListener("click", (event) => {
        while (posting.firstChild) {
            posting.removeChild(posting.lastChild);
        }
        const heading = document.createElement("h2");
        const ingredients = document.createElement("h6");
        const img = document.createElement("img");
            
        heading.className = "h2"; 
        img.src = "images/back.png";
        img.id = `image${count}`;
        img.classList.add("image");
    
        heading.appendChild(document.createTextNode("Ingredients"));
        ingredients.appendChild(document.createTextNode(ingredientsList));
        posting.appendChild(heading);
        posting.appendChild(ingredients);
        posting.appendChild(img);
        
        document.getElementById(`image${count}`).addEventListener("click", (event) => {
            while (posting.firstChild) {
                posting.removeChild(posting.lastChild);
            }
            const name = document.createElement("h2");
            const quantity = document.createElement("h6");
            const btn1 = document.createElement("button");
            const btn2 = document.createElement("button");
            let linebreak = document.createElement("br");
    
            name.id = "name";
            btn1.id = "ingred";
            btn2.id = "viewIngredients";
            name.className = "child";
            quantity.className = "child";
            btn1.className = "child";
            btn2.className = "child";
    
            name.appendChild(document.createTextNode(title));
            quantity.appendChild(document.createTextNode(`You have ${percentage}% of the ingredients`));
            btn1.appendChild(document.createTextNode("View Ingredients"));
            btn2.appendChild(document.createTextNode("View Recipe"));
                
            posting.appendChild(name);
            posting.appendChild(linebreak);
            posting.appendChild(quantity);
            linebreak = document.createElement("br");
            posting.appendChild(linebreak);
            posting.appendChild(btn1);
            linebreak = document.createElement("br");
            posting.appendChild(linebreak);
            linebreak = document.createElement("br");
            posting.appendChild(linebreak);
            posting.appendChild(btn2);
        
        })
    })
    
}

function percentOfIngredients(missing, not_missing) {
    return (not_missing / (missing + not_missing)).toFixed(2);
}