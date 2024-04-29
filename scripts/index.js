import {RecipeCard, Dropdown, SearchInput} from './components.js'
import { dataJson } from '../data/recipes.js'
import { firstLetterToUpperCase, removeAccent, normalizeID } from './utils.js'

const getIngredientsOfRecipes = (recipesData) => {
    const ingredientsWithDoubles = Object.values(recipesData).reduce((acc,recipe)=>{
        const ingredients = recipe.ingredients.map(elt=>firstLetterToUpperCase(elt.ingredient))
        acc= acc.concat(ingredients)
        return acc
    },[])

    const ingredientsAllRecipes = ingredientsWithDoubles.reduce((acc,ing)=>{
        if(acc.indexOf(ing)===-1){
            acc.push(ing)
        }
        return acc
    },[])
    return ingredientsAllRecipes
}

const getUstensilsOfRecipes = (recipesData)=>{
    const ustensilsWithDoubles = Object.values(recipesData).reduce((acc,recipe)=>{
        return acc.concat(recipe.ustensils)
    },[])
    const ustensilsAllRecipes = ustensilsWithDoubles.reduce((acc,ing)=>{
        const formatedName = firstLetterToUpperCase(ing)
        if(acc.indexOf(formatedName)===-1){
            acc.push(formatedName)
        }
        return acc
    },[])
    return ustensilsAllRecipes
}

const getApplianceOfRecipes = (recipesData)=>{
    const  appliancesWithDoubles = Object.values(recipesData).map(recipe=>recipe.appliance)
    const appliancesAllRecipes = appliancesWithDoubles.reduce((acc,ing)=>{
        const formatedName = firstLetterToUpperCase(ing)
        if(acc.indexOf(formatedName)===-1){
            acc.push(formatedName)
        }
        return acc
    },[])
    return appliancesAllRecipes
}

const displayRecipes = (allRecipesArray, displayRecipesArray)=>{
    const searchResult = document.querySelector(".searchResult")
    Object.keys(allRecipesArray).forEach(id=>{
        if(displayRecipesArray.indexOf(Number(id)) !== -1){
            const cardContent = new RecipeCard(allRecipesArray[id])
            searchResult.appendChild(cardContent.component)
        }
    })
}

const formatItemsKeywordsDiv = (itemName, removeItemsFunction)=>{
    const item = document.createElement("div")
    const removeItemCross = document.createElement('span')
    item.className ='bg-yellow w-48 h-14 flex justify-between items-center px-4 rounded-lg mb-5'
    item.innerText = itemName
    item.id = itemName
    removeItemCross.innerText='X'
    removeItemCross.className ='cursor-pointer'
    removeItemCross.addEventListener("click",(event)=>{
        removeItemsFunction(event.target.parentElement.innerText.slice(0,-2)) //slice to remove cross
    })
    item.appendChild(removeItemCross)
    return item
}

function init (){
    const recipesById = dataJson.reduce((acc,recipe)=>{
        acc[recipe.id] = recipe
        return acc
    },{})
    const allIngredients = getIngredientsOfRecipes(recipesById)
    const allUstensiles = getUstensilsOfRecipes(recipesById)
    const allAppliances = getApplianceOfRecipes(recipesById)
    const searchParams = {
        ingredients:[],
        appliances:[],
        ustensiles:[]
    }
    
    const divSearchInput = document.getElementById('inputSearch')
    const searchInput = new SearchInput('Rechercher une recette, un ingrédient, ...','/assets/svg/magnifyingGlass.svg')
    divSearchInput.appendChild(searchInput.component)

    const navBar = document.querySelector("nav ul")
    const onSelectDropdownItems = (elt1) =>(callback)=>{
        searchParams[elt1].push(callback)
        renderRecipes()
    }
    const ingredientsDropdown = new Dropdown('Ingrédients','ingredientsDropdown',allIngredients, onSelectDropdownItems("ingredients"))
    const ustensilesDropdown = new Dropdown('Ustensiles','ustensilesDropdown',allUstensiles, onSelectDropdownItems("ustensiles"))
    const appliencesDropdown = new Dropdown('Appareils','appliencesDropdown',allAppliances, onSelectDropdownItems("appliances"))

    navBar.appendChild(ingredientsDropdown.render)
    navBar.appendChild(appliencesDropdown.render)
    navBar.appendChild(ustensilesDropdown.render)

    

    const renderRecipes = () =>{
        const divKeywords = document.getElementById("keywords")
        Object.values(searchParams).forEach(elt=>elt.forEach(item=>{
            divKeywords.appendChild(formatItemsKeywordsDiv(firstLetterToUpperCase(item)))
        }))
        displayRecipes(recipesById,[50,2,20,25,30])
    }

    renderRecipes()

}

init()