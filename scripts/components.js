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

    #ingredientList(){
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
        content.appendChild(this.#ingredientList())
        const badge = document.createElement('span')
        badge.innerHTML=`<span class="bg-yellow py-1 px-3.5 rounded-full font-manrope text-xs absolute top-5 right-5">${this._time}mn</span>`
        card.appendChild(content)
        card.appendChild(badge)
        return card
    }
}

class Dropdown {
    constructor (title, idName, dataList, callBackFunction){
        this._title = title
        this._list = dataList
        this._id = idName
        this._div = document.createElement('div')
        this._callback = callBackFunction

        //Tailwind CSS
        this._btnClass = 'bg-white font-medium w-48 h-14 flex justify-between items-center px-4 rounded-lg'
        this._menuClass = 'w-48 max-h-80 bg-white rounded-lg absolute top-0 z-10 overflow-hidden invisible'
        this._menuBtnClass ='mt-4 font-medium font-grey w-40 flex justify-between items-center mx-4'
        this._menuInputClass = 'noclose pl-2 mt-3.5 h-9 w-40 font-manrope font-regular text-grey border-light_grey border-solid border rounded-sm ml-4'
        this._magnifyingGlassInputClass ='absolute top-[3.95rem] right-6 *:w-4 *:stroke-grey'
        this._resetCrossBtnInputClass = 'absolute top-[4rem] right-12 text-xs text-grey invisible'
        this._selectedItemsClass = 'mt-4 pl-4 py-2 bg-yellow truncate'
        this._menuListClass = 'mt-6 text-sm overflow-y-scroll h-52 '
        this._itemListClass ='ml-4 mb-3 cursor-pointer'
    }
    #removeAccent = strWithAccent => strWithAccent.normalize('NFD').replace(/[\u0300-\u036f]/g,'')

    #firstLetterToUpperCase = (name)=>{
        const smallLetter =  name.toLowerCase()
        return smallLetter[0].toUpperCase()+smallLetter.slice(1)
    }

    #dropdownButton(){
        const btn = document.createElement('button')
        btn.id = "btn_".concat(this._id)
        btn.className = this._btnClass
        btn.innerHTML=`${this._title} <span class="fa-solid fa-angle-down"></span>`
        return btn
    }

    #dropdownMenuList(listOfItems){
        const list = document.createElement('ul')
        list.className = this._menuListClass

        let searchResult = []
        this._list.forEach(item=>{
            searchResult.push([this.#firstLetterToUpperCase(this.#removeAccent(item)),item])
        })
        searchResult.sort()
        searchResult.forEach(elt=>{
            const item = document.createElement('li')
            item.className = this._itemListClass
            item.innerText= this.#firstLetterToUpperCase(elt[1])
            item.addEventListener("click",(event)=>{
                this._callback((event.target.innerText).toLowerCase())
                this._div.classList.add("invisible")
            })
            list.appendChild(item)
        })
        return list
    }

    #dropdownMenu(){
        this._div.className = this._menuClass
        this._div.id = this._id

        const btn = document.createElement('button')
        btn.className = this._menuBtnClass
        btn.innerHTML=`${this._title} <span class="fa-solid fa-angle-up"></span>`
        btn.addEventListener("click",()=>{
            this.#resetInputValue()
            resetCrossBtn.classList.add("invisible")
            this._div.classList.add('invisible')
        })

        const input = document.createElement('input')
        input.className = this._menuInputClass
        const inputListener = (event)=>{
            //input filter
            const searchValue = (event.target.value).toLowerCase()
            const ul = this._div.children[4]
            ul.remove()
            const list = document.createElement('ul')
            list.className = this._menuListClass

            let searchResult = []
            this._list.forEach(item=>{
                if( item.indexOf(searchValue)!== -1){
                    searchResult.push([this.#firstLetterToUpperCase(this.#removeAccent(item)),item])
                }
            })
            searchResult.sort()
            searchResult.forEach(elt=>{
                const item = document.createElement('li')
                item.className = this._itemListClass
                item.innerText=this.#firstLetterToUpperCase(elt[1])
                item.addEventListener("click",(event)=>{
                    this._callback((event.target.innerText).toLowerCase())
                    this.#resetInputValue()
                    resetCrossBtn.classList.add("invisible")
                    this._div.classList.add("invisible")
                })
                list.appendChild(item)
            })
            this._div.appendChild(list)

            //visibilty reset cross
            if(event.target.value){
                resetCrossBtn.classList.remove("invisible")
                return
            }
            if(!resetCrossBtn.classList.contains("invisible")){
                resetCrossBtn.classList.add("invisible")
                return
            }
        }
        input.addEventListener("input",inputListener)
        const magnifyingGlass = document.createElement('div')
        magnifyingGlass.className = this._magnifyingGlassInputClass
        magnifyingGlass.innerHTML = `
            <svg class="noclose" viewBox="0 0 28 29" fill="none">
                <circle cx="10" cy="10.4219" r="9.5"/>
                <line x1="18.3536" y1="19.0683" x2="27.3536" y2="28.0683"/>
            </svg>
        `
        const resetCrossBtn = document.createElement('button')
        resetCrossBtn.className=this._resetCrossBtnInputClass
        resetCrossBtn.innerHTML=`<span class="noclose fa-solid fa-xmark"></span>`
        resetCrossBtn.addEventListener('click',()=>{
            this.#resetInputValue()
            resetCrossBtn.classList.add("invisible")
        })

        this._div.appendChild(btn)
        this._div.appendChild(input)
        this._div.appendChild(magnifyingGlass)
        this._div.appendChild(resetCrossBtn)
        this._div.appendChild(this.#dropdownMenuList(this._list))
        return this._div
    }

    #resetInputValue(){
        const ul = this._div.children[4]
        const input = this._div.children[1]
        ul.remove()
        this._div.appendChild(this.#dropdownMenuList(this._list))
        input.value=""
    }

    render(){
        const li = document.createElement('li')
        const btn = this.#dropdownButton()
        const menu = this.#dropdownMenu()
        li.classList.add('relative')
        btn.addEventListener('click',()=>{
            menu.classList.remove('invisible')
        })
        li.appendChild(btn)
        li.appendChild(menu)
        return li
    }

    update(data){
        const ul = this._div.children[4]
        this._list = data
        ul.remove()
        this._div.appendChild(this.#dropdownMenuList(this._list))
    }
}

class SearchInput {
    constructor(placeholder, srcImg, callBackFunction){
        this._placeholder = placeholder
        this._srcImg = srcImg
        this._callback = callBackFunction

        //Tailwind CSS
        this._sizeClass = 'relative h-16 w-2/3'
        this._inputClass = 'w-full h-full rounded-xl pl-9 font-manrope'
        this._searchBtnClass = 'absolute right-2 top-2 bg-black hover:bg-yellow w-12 h-12 flex justify-center items-center rounded-lg hover:*:stroke-black *:p-2'
        this._magnifyingGlassClass='stroke-white'
        this._resetCrossBtnClass = 'absolute right-20 top-5 font-manrope font-bold text-light_grey invisible'
    }

    #normalizeInputText(text){
        console.log("dh")
        console.log("entrée:",text)
        if(text.includes(">")){text=text.replaceAll(">","&gt;")}
        if(text.includes("<")){text=text.replaceAll("<","&lt;")}
        if(text.includes("\"")){text=text.replaceAll("\"","&quot;")}
        if(text.includes("\'")){text=text.replaceAll("\'","&apos;")}
        if(text.includes("\`")){text=text.replaceAll("\`","&grave;")}
        if(text.includes("/")){text=text.replaceAll("/","&sol;")}
        if(text.includes("=")){text=text.replaceAll("=","&equals;")}
        console.log("sortie:",text)
         return text.toLowerCase()
     }

    render(){
        const div = document.createElement('div')
        div.className = this._sizeClass

        const input = document.createElement('input')
        input.className = this._inputClass
        input.placeholder = this._placeholder
        input.type = "text"
        input.addEventListener("input",(event)=>{
            if(event.target.value.length<3){
                this._callback("")
            }
            if(event.target.value.length>2){
                resetCrossBtn.classList.remove("invisible")
                if (event.target.value)
                    this._callback(this.#normalizeInputText(event.target.value))

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
            this._callback("")
        })

        div.appendChild(input)
        div.appendChild(searchBtn)
        div.appendChild(resetCrossBtn)
        return div
    }


}

export{RecipeCard, Dropdown, SearchInput}