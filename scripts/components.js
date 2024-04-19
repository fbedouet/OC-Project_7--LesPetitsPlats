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
    constructor (title, idName, dataList){
        this._title = title
        this._list = dataList
        this.selectedItemsList = []
        this._isItemsSelected = false
        this._id = idName 

        //Tailwind CSS
        this._btnClass = 'bg-white font-medium w-48 h-14 flex justify-between items-center px-4 rounded-lg'
        this._menuClass = 'w-48 max-h-80 bg-white rounded-lg absolute top-0 z-10 overflow-hidden invisible'
        this._menuBtnClass ='mt-4 font-medium w-40 flex justify-between items-center mx-4'
        this._menuInputClass = 'mt-3.5 h-9 w-40 border-light_grey border-solid border rounded-sm ml-4'
        this._selectedItemsClass = 'mt-4 pl-4 py-2 bg-yellow truncate'
        this._menuListClass = 'mt-6 text-sm overflow-y-scroll h-52 '
        this._itemListClass ='ml-4 mb-3 cursor-pointer'
    }

    _dropdownButton(){
        const btn = document.createElement('button')
        btn.className = this._btnClass
        btn.innerHTML=`${this._title} <span class="fa-solid fa-angle-down"></span>`
        return btn
    }

    _onItemClick(item){
        if(!this._isItemsSelected){
            this._addSelectedItem(item)
            const arrayPosition = this._list.indexOf(item)
            this._list.splice(arrayPosition,1)
            this._changeListItems()
            this._isItemsSelected = true
        }
    }

    _dropdownMenuList(){
        const list = document.createElement('ul')
        list.className = this._menuListClass
        this._list.forEach(elt=>{
            const item = document.createElement('li')
            item.className = this._itemListClass
            item.innerText=elt
            item.addEventListener("click",(event)=>{this._onItemClick(event.target.innerText)})
            list.appendChild(item)
        })
        return list
    }

    _dropdownMenu(){
        const div = document.createElement('div')
        div.className = this._menuClass
        div.id = this._id
        const btn = document.createElement('button')
        btn.className = this._menuBtnClass
        btn.innerHTML=`${this._title} <span class="fa-solid fa-angle-up"></span>`
        btn.addEventListener("click",()=>{
            div.classList.add('invisible')
        })
        const input = document.createElement('input')
        input.className = this._menuInputClass
        const selectedItems = document.createElement('p')
        selectedItems.id = "selectedItems"
        div.appendChild(btn)
        div.appendChild(input)
        div.appendChild(selectedItems)
        div.appendChild(this._dropdownMenuList())
        return div
    }

    get createComponent(){
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

    _changeListItems(){
        const dropdownDiv = document.getElementById(this._id)
        const ul = dropdownDiv.children[3]
        ul.remove()
        dropdownDiv.appendChild(this._dropdownMenuList())
    }

    _addSelectedItem(item){
        const selectedItem = document.querySelector(`#${this._id} #selectedItems`)
        selectedItem.className = this._selectedItemsClass
        selectedItem.innerText = item
        selectedItem.addEventListener("click", ()=> {
            this._list.push(selectedItem.innerText)
            selectedItem.innerText = ""
            selectedItem.className=""
            this._changeListItems()
            this._isItemsSelected = false
        })
        this._isItemsSelected = true
        return
    }
}

class SearchInput {
    constructor(placeholder,srcImg){
        this._placeholder = placeholder
        this._srcImg = srcImg

        //Tailwind CSS
        this._sizeClass = 'relative h-16 w-2/3'
        this._inputClass = 'w-full h-full rounded-xl pl-9 font-manrope'
        this._searchBtnClass = 'absolute right-2 top-2 bg-black hover:bg-yellow w-12 h-12 flex justify-center items-center rounded-lg hover:*:stroke-black *:p-2'
        this._magnifyingGlassClass='stroke-white'
        this._resetCrossBtnClass = 'absolute right-20 top-5 font-manrope font-bold text-light_grey invisible'
    }

    get component(){
        const div = document.createElement('div')
        div.className = this._sizeClass

        const input = document.createElement('input')
        input.className = this._inputClass
        input.placeholder = this._placeholder
        input.type = "text"
        input.addEventListener("input",(event)=>{
            if(event.target.value){
                resetCrossBtn.classList.remove("invisible")
                return
            }
            if(!resetCrossBtn.classList.contains("invisible")){
                resetCrossBtn.classList.add("invisible")
            }
        })

        const searchBtn = document.createElement('button')
        searchBtn.className = this._searchBtnClass
        searchBtn.innerHTML=`
            <svg class=${this._magnifyingGlassClass} viewBox="0 0 28 29" fill="none">
                <circle cx="10" cy="10.4219" r="9.5"/>
                <line x1="18.3536" y1="19.0683" x2="27.3536" y2="28.0683"/>
            </svg>
        `
        
        const resetCrossBtn = document.createElement('button')
        resetCrossBtn.className = this._resetCrossBtnClass
        resetCrossBtn.innerHTML = `<span class="fa-solid fa-xmark"></span>`
        resetCrossBtn.addEventListener("click",()=>{
            input.value=""
            resetCrossBtn.classList.add("invisible")
        })

        div.appendChild(input)
        div.appendChild(searchBtn)
        div.appendChild(resetCrossBtn)
        return div
    }


}

export{RecipeCard, Dropdown, SearchInput}