import {RecipeCard, Dropdown, SearchInput} from './components.js'
import {getData} from '../data/api.js'
import{withoutDuplicates} from './utils.js'
import {dataJson} from '../data/recipes.js'

const searchParams = {
    ingredients:[],
    appliances:[],
    ustensiles:[],
    searchRequest:""
}

const dropdownsContent = {
    ingredients: getData().ingredientsOfRecipes(),
    appliances: getData().applianceOfRecipes(),
    ustensiles: getData().ustensilsOfRecipes()
}

const sortedData = {
    allRecipes: dataJson,
    recipesById : getData().recipesById(),
    // ingredientsById : getData().ingredientsById(),
    // recipesByIngredients : getData().sortRecipesByIngredients(),
    // recipesByAppliances : getData().sortRecipesByAppliances(),
    // recipesByUstensils :getData().sortRecipesByUstensils()
}

const onSearchMainInput = (searchRequest) => {
    searchParams.searchRequest = searchRequest
    searchRecipes()
}

const searchRecipes = () => {
    const searchRequest = searchParams.searchRequest
    let searchResult=[]

    const addInSearchResult =(ids)=> {
        if(searchResult.length===0){
            searchResult=ids
        }else{
            searchResult=searchResult.filter(id=>ids.includes(id))
        }
    }

    // Search ingredients with dropdown
    for(let tag=0 ; tag<searchParams.ingredients.length ; tag++){
        let dropdownResult=[]
        for(let cpt=0 ; cpt<dataJson.length ; cpt++){
            const recipe = dataJson[cpt]
            for(let ing=0 ; ing<recipe.ingredients.length ; ing++){
                if(recipe.ingredients[ing].ingredient.toLocaleLowerCase()===searchParams.ingredients[tag]){
                    dropdownResult=dropdownResult.concat(recipe.id.toString())
                }
            }
        }
        addInSearchResult(dropdownResult)
    }

    // Search appliances with dropdown
    for(let tag=0 ; tag<searchParams.appliances.length ; tag++){
        let dropdownResult=[]
        for(let cpt=0 ; cpt<sortedData.allRecipes.length ; cpt++){
            const recipe = sortedData.allRecipes[cpt]
            if(recipe.appliance.toLocaleLowerCase()===searchParams.appliances[tag]){
                dropdownResult=dropdownResult=dropdownResult.concat(recipe.id.toString())
            }
        }
        addInSearchResult(dropdownResult)
    }

    // Search utensils with dropdown
    for(let tag=0 ; tag<searchParams.ustensiles.length ; tag++){
        let dropdownResult=[]
        for(let cpt=0 ; cpt<sortedData.allRecipes.length ; cpt++){
            const recipe = sortedData.allRecipes[cpt]
            for(let ust=0 ; ust<recipe.ustensils.length ; ust++){
                if(recipe.ustensils[ust]===searchParams.ustensiles[tag]){
                    dropdownResult=dropdownResult=dropdownResult.concat(recipe.id.toString())
                }
            }
        }
        addInSearchResult(dropdownResult)
    }
    
    // Search with main input
    let mainInputResult=[]
    for( let id=0 ; id<sortedData.allRecipes.length ; id++ ){
        const recipe = sortedData.allRecipes[id]
        if(recipe.description.toLocaleLowerCase().indexOf(searchRequest)!==-1){
            mainInputResult = mainInputResult.concat(recipe.id.toString())
        }
        if(recipe.name.toLocaleLowerCase().indexOf(searchRequest)!==-1){
            mainInputResult = mainInputResult.concat(recipe.id.toString())
        }
        for( let ing=0 ; ing<recipe.ingredients.length ; ing++){
            if(recipe.ingredients[ing].ingredient.toLocaleLowerCase()===searchParams.searchRequest){
                mainInputResult = mainInputResult.concat(recipe.id.toString())
            }
        }
    }
    addInSearchResult( withoutDuplicates(mainInputResult) )

    renderRecipes(searchResult)
}

const onSelectDropdownItem = (category) =>(item)=>{
    searchParams[category].push(item)
    dropdownsContent[category] = dropdownsContent[category].filter(elt => elt!=item)
    searchRecipes()
    // renderRecipes(resultOfDropdown())
}

const onRemoveSearchItem = (category) =>(item)=>{
    const arrayPosition = searchParams[category].indexOf(item)
    searchParams[category].splice(arrayPosition,1)
    dropdownsContent[category].push(item)
    searchRecipes()
}

const displayNavBar = () =>{
    const navBar = document.querySelector("nav")
    if (navBar.children.length !== 0){
        document.querySelector("nav ul").remove()
        document.querySelector("nav p").remove()
    }
    const ul = document.createElement("ul")
    ul.className = "flex gap-16 font-manrope py-5"

    const ingredientsDropdown = new Dropdown('Ingrédients','ingredientsDropdown',dropdownsContent.ingredients, onSelectDropdownItem("ingredients"))
    const ustensilesDropdown = new Dropdown('Ustensiles','ustensilesDropdown',dropdownsContent.ustensiles, onSelectDropdownItem("ustensiles"))
    const appliencesDropdown = new Dropdown('Appareils','appliencesDropdown',dropdownsContent.appliances, onSelectDropdownItem("appliances"))
    const p = document.createElement("p")
    p.className = "font-anton text-xl"

    ul.appendChild(ingredientsDropdown.render())
    ul.appendChild(appliencesDropdown.render())
    ul.appendChild(ustensilesDropdown.render())
    
    navBar.appendChild(ul)
    navBar.appendChild(p)
}

const displayRecipes = (displayRecipesArray)=>{
    const allRecipesArray = sortedData.recipesById
    if (displayRecipesArray.length===0){
        displayRecipesArray = Object.keys(allRecipesArray)
    }
    const numberRecipesFound = document.querySelector("nav p")
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
    numberRecipesFound.innerHTML = `${displayRecipesArray.length} recettes`
}

const updateDropdownsContent = (searchResult,itemToRemoved) =>{
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

    searchResult.forEach(id => {
        leftoverIngredients = leftoverIngredients.concat(sortedData.recipesById[id].ingredients.map(elt=>elt.ingredient.toLowerCase() ))
        leftoverAppliances = leftoverAppliances.concat(sortedData.recipesById[id].appliance.toLowerCase())
        leftoverUstensils = leftoverUstensils.concat(sortedData.recipesById[id].ustensils.map(elt=>elt.toLowerCase()))
    })
    dropdownsContent.ingredients = withoutDuplicates(leftoverIngredients)
    dropdownsContent.appliances = withoutDuplicates(leftoverAppliances)
    dropdownsContent.ustensiles = withoutDuplicates(leftoverUstensils)

    Object.keys(searchParams).forEach(category=>{
        if(category!=="searchRequest"){
            searchParams[category].forEach(elt=>{
                const index = dropdownsContent[category].indexOf(elt)
                dropdownsContent[category].splice(index,1)
            })
        }
    })
    if(itemToRemoved){
        const index = dropdownsContent.ingredients.indexOf(itemToRemoved)
        dropdownsContent.ingredients.splice(index,1)
    }
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

const renderRecipes = (searchResult, itemToRemoved) =>{
    if(searchResult.length===0 && searchParams.searchRequest!==""){
        document.querySelector(".searchResult").remove()
        const searchResultDiv = document.createElement("div")
        searchResultDiv.className = "searchResult"
        searchResultDiv.innerHTML = `Aucune recette ne contient pas '${searchParams.searchRequest}' vous pouvez chercher «
        tarte aux pommes », « poisson », etc.`
        document.querySelector("main").appendChild(searchResultDiv)
        return
    }
    //initialize selected tag div
    if (document.querySelector(".keyword")){
        document.querySelector(".keyword").remove()
    }
    const keywordItems = document.createElement('div')
    keywordItems.className = "keyword flex flex-wrap gap-x-5"
    
    //updating selected tag div
    Object.keys(searchParams).forEach(category=>{
        if(category!=="searchRequest"){
            searchParams[category].forEach(item=>{
                keywordItems.appendChild(formatItemsKeywordsDiv(item,onRemoveSearchItem(category)))
            })
        }
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

    updateDropdownsContent(searchResult,itemToRemoved)
    displayRecipes(searchResult)
}

const closeDropdownWhenClickedOutside = (event) => {
    if( event.target.classList[0] === "noclose" || event.target.id === "btn_ingredientsDropdown" || event.target.parentElement.id === "btn_ingredientsDropdown" )
        {}else{
            document.getElementById("ingredientsDropdown").classList.add("invisible")
    }

    if( event.target.classList[0] === "noclose" || event.target.id === "btn_appliencesDropdown" || event.target.parentElement.id === "btn_appliencesDropdown" )
        {}else{
            document.getElementById("appliencesDropdown").classList.add("invisible")
    }

    if( event.target.classList[0] === "noclose" || event.target.id === "btn_ustensilesDropdown" || event.target.parentElement.id === "btn_ustensilesDropdown" )
        {}else{
            document.getElementById("ustensilesDropdown").classList.add("invisible")
    }
}

function init (){
    const divSearchInput = document.getElementById('inputSearch')
    const searchInput = new SearchInput('Rechercher une recette, un ingrédient, ...', '/assets/svg/magnifyingGlass.svg', onSearchMainInput)
    divSearchInput.appendChild(searchInput.render())
    displayNavBar()
    renderRecipes([])
    document.addEventListener("click",closeDropdownWhenClickedOutside)
}

init()