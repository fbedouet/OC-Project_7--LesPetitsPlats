import {RecipeCard, Dropdown, SearchInput} from './components.js'
import {getData} from '../data/api.js'
import{withoutDuplicates} from './utils.js'
import {dataJson} from '../data/recipes.js'

const searchParams = {
    ingredients:[],
    appliances:[],
    ustensiles:[],
    searchRequest:[]
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
    searchParams.searchRequest = [searchRequest]
    searchRecipes()
}

const searchRecipes = () => {
    const searchRequest = searchParams.searchRequest
    // let searchResult=[]

    const filteredRecipes = sortedData.allRecipes.filter((recipe) => {
        let isMatchingTagIngredient = false
        let isMatchingTagUstensil = false
        let isMatchingTagAppliance = false
        let isMatchingSearchInput = false

        const numberOfCategorySelected = [
                    searchParams.ingredients.length!==0, 
                    searchParams.ustensiles.length!==0,
                    searchParams.appliances.length!==0,
                    searchParams.searchRequest.length!==0].filter(elt=>elt===true).length

        if(searchParams.ingredients.length!==0){
            isMatchingTagIngredient = searchParams.ingredients.every((ingredient) => {
                return recipe.ingredients.some((recipeIngredient) => recipeIngredient.ingredient.toLocaleLowerCase() === ingredient)
            })
        }
        if(searchParams.ustensiles.length!==0){
            isMatchingTagUstensil = searchParams.ustensiles.every(tag=>{
                return recipe.ustensils.some(ust=>ust.toLocaleLowerCase()===tag)
            })
        }
        
        if(searchParams.appliances.length!==0){
            isMatchingTagAppliance = searchParams.appliances.every((tag) => {
                return recipe.appliance.toLocaleLowerCase() === tag
            })
        }
        if(searchParams.searchRequest.length!==0){
            isMatchingSearchInput = 
                recipe.name.toLocaleLowerCase().includes(searchParams.searchRequest) ||
                recipe.description.toLocaleLowerCase().includes(searchParams.searchRequest) ||
                searchParams.searchRequest.every((request=>{
                    return recipe.ingredients.some(recipeIngredient => recipeIngredient.ingredient.toLocaleLowerCase().includes(request))
                }))
        }

        const isMatchingRequest =()=> {
            if(numberOfCategorySelected===1){
                return isMatchingTagIngredient || isMatchingTagUstensil || isMatchingTagAppliance || isMatchingSearchInput
            }
            if(numberOfCategorySelected===2){
               return   (isMatchingTagIngredient && isMatchingTagUstensil && !isMatchingTagAppliance && !isMatchingSearchInput) || 
                        (isMatchingTagIngredient && !isMatchingTagUstensil && isMatchingTagAppliance && !isMatchingSearchInput) || 
                        (isMatchingTagIngredient && !isMatchingTagUstensil && !isMatchingTagAppliance && isMatchingSearchInput) || 
                        (!isMatchingTagIngredient && isMatchingTagUstensil && isMatchingTagAppliance && !isMatchingSearchInput) ||    
                        (!isMatchingTagIngredient && isMatchingTagUstensil && !isMatchingTagAppliance && isMatchingSearchInput) ||   
                        (!isMatchingTagIngredient && !isMatchingTagUstensil && isMatchingTagAppliance && isMatchingSearchInput)     
            }
            if(numberOfCategorySelected===3){
                return  (isMatchingTagIngredient && isMatchingTagUstensil && isMatchingTagAppliance && !isMatchingSearchInput) ||   
                        (!isMatchingTagIngredient && isMatchingTagUstensil && isMatchingTagAppliance && isMatchingSearchInput) || 
                        (isMatchingTagIngredient && !isMatchingTagUstensil && isMatchingTagAppliance && isMatchingSearchInput) ||  
                        (isMatchingTagIngredient && isMatchingTagUstensil && !isMatchingTagAppliance && isMatchingSearchInput)   

            }
            if(numberOfCategorySelected===4){
                return  (isMatchingTagIngredient && isMatchingTagUstensil && isMatchingTagAppliance && isMatchingSearchInput)
            }
        }
        if(isMatchingRequest()){
            console.log(recipe.id,isMatchingTagIngredient, isMatchingTagUstensil,isMatchingTagAppliance,isMatchingSearchInput,numberOfCategorySelected)
        }
        return isMatchingRequest()

    })
    renderRecipes(filteredRecipes.map(({id})=>id.toString()))
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
    if(searchResult.length===0 && searchParams.searchRequest.length!==0){
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