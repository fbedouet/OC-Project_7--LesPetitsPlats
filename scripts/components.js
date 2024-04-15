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

class Dropdown {
    constructor (title, data){
        this._title = title
        this._list = data
        this._btnClass = 'bg-white font-medium w-48 h-14 flex justify-between items-center px-4 rounded-lg'
        this._menuClass = 'w-48 max-h-80 px-4 bg-white rounded-lg absolute top-0 z-10 overflow-hidden invisible'
        this._menuBtnClass ='mt-4 font-medium w-40 flex justify-between items-center'
        this._menuInputClass = 'mt-3.5 w-full h-9 border-light_grey border-solid border rounded-sm'
        this._menuListClass = 'mt-6 text-sm overflow-y-scroll h-52'
    }

    _dropdownButton(){
        const btn = document.createElement('button')
        btn.className = this._btnClass
        btn.innerHTML=`${this._title} <span class="fa-solid fa-angle-down"></span>`
        return btn
    }

    _dropdownMenuList(){
        const list = document.createElement('ul')
        list.className = this._menuListClass
        this._list.forEach(elt=>{
            const item = document.createElement('li')
            item.classList.add('mb-3')
            item.innerText=elt
            list.appendChild(item)
        })
        return list
    }

    _dropdownMenu(){
        const div = document.createElement('div')
        div.className = this._menuClass
        const btn = document.createElement('button')
        btn.className = this._menuBtnClass
        btn.innerHTML=`${this._title} <span class="fa-solid fa-angle-up"></span>`
        btn.addEventListener("click",()=>{
            div.classList.add('invisible')
        })
        const input = document.createElement('input')
        input.className = this._menuInputClass
        div.appendChild(btn)
        div.appendChild(input)
        div.appendChild(this._dropdownMenuList())
        return div
    }

    get component(){
        const li = document.createElement('li')
        const btn = this._dropdownButton()
        const menu = this._dropdownMenu()
        li.classList.add('relative')
        btn.addEventListener('click',()=>{
            menu.classList.remove('invisible')
        })
        li.appendChild(btn)
        li.appendChild(menu)
        return li
    }

}

class SearchInput {
    constructor(placeholder,srcImg){
        this._placeholder = placeholder
        this._srcImg = srcImg
        this._sizeClass = 'relative h-16 w-2/3'
        this._inputClass = 'w-full h-full rounded-xl pl-9 font-manrope' //placeholder:text-grey'
        this._btnClass = 'absolute right-2 top-2 bg-black w-12 h-12 flex justify-center items-center rounded-lg'
    }

    get component(){
        const div = document.createElement('div')
        div.className = this._sizeClass
        const input = document.createElement('input')
        input.className = this._inputClass
        input.placeholder = this._placeholder
        input.type = "search"
        const btn = document.createElement('button')
        btn.className = this._btnClass
        btn.innerHTML=`<img class="w-7 h-7" src=${this._srcImg} alt=""></button>`
        div.appendChild(input)
        div.appendChild(btn)
        return div
    }


}

export{RecipeCard, Dropdown, SearchInput}