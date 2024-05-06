import {RecipeCard, Dropdown, SearchInput} from './components.js'
import {getData} from '../data/api.js'

const searchParams = {
    ingredients:[],
    appliances:[],
    ustensiles:[]
}

const dropdownsContent = {
    ingredients: getData().ingredientsOfRecipes(),
    appliances: getData().applianceOfRecipes(),
    ustensiles: getData().ustensilsOfRecipes()
}

const sortedData = {
    recipesById : getData().recipesById(),
    recipesByIngredients : getData().sortRecipesByIngredients(),
    recipesByAppliances : getData().sortRecipesByAppliances(),
    recipesByUstensils :getData().sortRecipesByUstensils()
}

const onSelectDropdownItem = (category) =>(item)=>{
    searchParams[category].push(item)
    dropdownsContent[category] = dropdownsContent[category].filter(elt => elt!=item)
    renderRecipes()
}

const onRemoveSearchItem = (category) =>(item)=>{
    const arrayPosition = searchParams[category].indexOf(item)
    searchParams[category].splice(arrayPosition,1)
    dropdownsContent[category].push(item)
    renderRecipes()
}

const displayNavBar = () =>{
    const navBar = document.querySelector("nav")
    if (navBar.children.length !== 0){
        document.querySelector("nav ul").remove()
    }
    const ul = document.createElement("ul")
    ul.className = "flex gap-16 font-manrope py-5"

    const ingredientsDropdown = new Dropdown('Ingrédients','ingredientsDropdown',dropdownsContent.ingredients, onSelectDropdownItem("ingredients"))
    const ustensilesDropdown = new Dropdown('Ustensiles','ustensilesDropdown',dropdownsContent.ustensiles, onSelectDropdownItem("ustensiles"))
    const appliencesDropdown = new Dropdown('Appareils','appliencesDropdown',dropdownsContent.appliances, onSelectDropdownItem("appliances"))

    ul.appendChild(ingredientsDropdown.render())
    ul.appendChild(appliencesDropdown.render())
    ul.appendChild(ustensilesDropdown.render())
    navBar.appendChild(ul)
}

const displayRecipes = (displayRecipesArray)=>{
    const allRecipesArray = sortedData.recipesById
    if (displayRecipesArray.length===0){
        displayRecipesArray = Object.keys(allRecipesArray)
    }
    // const numberRecipesFound = document.querySelector("nav p")
    if (document.querySelector(".searchResult")){
        document.querySelector(".searchResult").remove()
    }
    
    const searchResult = document.createElement("div")
    searchResult.className = "searchResult flex flex-wrap justify-between gap-y-16"

    Object.keys(allRecipesArray).forEach(id=>{
        if(displayRecipesArray.indexOf(id) !== -1){
            const cardContent = new RecipeCard(allRecipesArray[id])
            searchResult.appendChild(cardContent.component)
        }
    })
    document.querySelector("main").appendChild(searchResult)
    // numberRecipesFound.innerHTML = `${displayRecipesArray.length} recettes`
}

const updateDropdownsContent = (searchResult) =>{
    if(searchResult.length===0){
        dropdownsContent.ingredients = getData().ingredientsOfRecipes()
        dropdownsContent.appliances = getData().applianceOfRecipes()
        dropdownsContent.ustensiles = getData().ustensilsOfRecipes()
        displayNavBar()
        return
    }

    let leftoverIngredients = []
    let leftoverAppliances = []
    let leftoverUstensils = []
    const withoutDuplicates = (array) =>{
        const callbackArray = array.reduce((acc,ing)=>{
            if(acc.indexOf(ing)===-1){
                acc.push(ing)
            }
            return acc
        },[])
        return callbackArray
    }

    searchResult.forEach(id => {
        leftoverIngredients = leftoverIngredients.concat(sortedData.recipesById[id].ingredients.map(elt=>elt.ingredient.toLowerCase() ))
        leftoverAppliances = leftoverAppliances.concat(sortedData.recipesById[id].appliance.toLowerCase())
        leftoverUstensils = leftoverUstensils.concat(sortedData.recipesById[id].ustensils.map(elt=>elt.toLowerCase()))
    })
    dropdownsContent.ingredients = withoutDuplicates(leftoverIngredients)
    dropdownsContent.appliances = withoutDuplicates(leftoverAppliances)
    dropdownsContent.ustensiles = withoutDuplicates(leftoverUstensils)

    Object.keys(searchParams).forEach(category=>{
        searchParams[category].forEach(elt=>{
            const index = dropdownsContent[category].indexOf(elt)
            dropdownsContent[category].splice(index,1)
        })
    })
    displayNavBar()
}

const formatItemsKeywordsDiv = (itemName, removeItemFunction)=>{
    const firstLetterToUpperCase = (name)=>{
        const smallLetter =  name.toLowerCase()
        return smallLetter[0].toUpperCase()+smallLetter.slice(1)
    }
    const item = document.createElement("div")
    const removeItemCross = document.createElement('span')
    item.className ='bg-yellow w-48 h-14 flex justify-between items-center px-4 rounded-lg mb-5'
    item.innerText = firstLetterToUpperCase(itemName)
    item.id = itemName
    removeItemCross.innerText='X'
    removeItemCross.className ='cursor-pointer'
    removeItemCross.addEventListener("click",(event)=>{
        removeItemFunction((event.target.parentElement.innerText.slice(0,-2)).toLowerCase()) //slice to remove cross
    })
    item.appendChild(removeItemCross)
    return item
}

const renderRecipes = () =>{
    //initialize selected tag div
    if (document.querySelector(".keyword")){
        document.querySelector(".keyword").remove()
    }
    const keywordItems = document.createElement('div')
    keywordItems.className = "keyword flex flex-wrap gap-x-5"
    
    //updating selected tag div
    Object.keys(searchParams).forEach(category=>{
        searchParams[category].forEach(item=>{
            keywordItems.appendChild(formatItemsKeywordsDiv(item,onRemoveSearchItem(category)))
        })
    })
    document.querySelector('main').appendChild(keywordItems)

    //render recipes with empty list in searchParams
    const listOfSelectedItems = Object.values(searchParams).reduce((acc,elt)=>{
        acc = acc.concat(elt)
        return acc
    },[])
    if (listOfSelectedItems.length === 0){
        if (document.querySelector(".keyword")){
            document.querySelector(".keyword").remove()
        }
        updateDropdownsContent([])
        displayRecipes([]) //with [] parameter, display all recipes
        return
    }
    //render recipes with selected items in search
    const getRecipesOfItem = (category,item)=>{
        if(category ==="ingredients"){
            return sortedData.recipesByIngredients[item]
        }
        if(category ==="appliances"){
            return sortedData.recipesByAppliances[item]
        }
        if(category ==="ustensiles"){
            return sortedData.recipesByUstensils[item]
        }
    }
    
    let isFirst = true
    let searchResult = []
    Object.keys(searchParams).forEach(category=>{
        searchParams[category].forEach(item=>{
            if(isFirst){
               searchResult = getRecipesOfItem(category,item)
                isFirst = false
               return
            }
            searchResult = getRecipesOfItem(category,item).filter(recipeId=>searchResult.includes(recipeId))
        })
    })
    updateDropdownsContent(searchResult)
    displayRecipes(searchResult)
}

function init (){
    const divSearchInput = document.getElementById('inputSearch')
    const searchInput = new SearchInput('Rechercher une recette, un ingrédient, ...','/assets/svg/magnifyingGlass.svg')
    divSearchInput.appendChild(searchInput.component)
    displayNavBar()
    renderRecipes()
}

init()