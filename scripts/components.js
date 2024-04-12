class RecipeCard {
    constructor (data) {
        this._id = data.id
        this._imageFile = data.image
        this._recipeName = data.name
        this._servings = data.servings
        this._ingredients = data.ingredients
        this._time = data.time
        this._preparation = data.description
        this._appliances = data.appliance
        this._ustensils = data.ustensils
    }

    ingredientList(){
        const htmlIngredients = document.createElement('ul')
        htmlIngredients.classList.add('font-manrope','text-sm','flex','flex-wrap')
        this._ingredients.forEach(elt => {
            const ingredient = document.createElement('li')
            ingredient.innerHTML = `<p class="w-40 mt-4 font-medium">${elt.ingredient}</p><p class="text-grey">${elt.quantity?elt.quantity:""} ${elt.unit?elt.unit:""}</p>`
            htmlIngredients.appendChild(ingredient)
        })
        return htmlIngredients
    }

    get component() {
        const card = document.createElement('div')
        card.classList.add('w-96','bg-white','rounded-lg','overflow-hidden','pb-16','relative')
        card.innerHTML = `<img class="w-full h-64 object-cover"src="/assets/photos/${this._imageFile}" alt="${this._recipeName}">`
        const content = document.createElement('div')
        content.classList.add('mx-6')
        content.innerHTML=`
            <h2 class="font-anton text-lg mt-8">${this._recipeName}</h2>
            <h3 class="mt-7 text-grey font-manrope text-xs font-bold">RECETTE</h3>
            <p class="h-20 mt-4 font-manrope text-sm overflow-hidden">${this._preparation}</p>
            <h3 class="mt-7 text-grey font-manrope text-xs font-bold">INGRÉDIENTS</h3>
        `
        content.appendChild(this.ingredientList())
        const badge = document.createElement('span')
        badge.innerHTML=`<span class="bg-yellow py-1 px-3.5 rounded-full font-manrope text-xs absolute top-5 right-5">${this._time}mn</span>`
        card.appendChild(content)
        card.appendChild(badge)
        return card
    }
}
export{RecipeCard}