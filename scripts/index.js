import {RecipeCard, Dropdown, SearchInput} from './components.js'
import { dataJson } from '../data/recipes.js'
import { firstLetterToUpperCase } from './utils.js'

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

// const formatItemsKeywordsDiv = (itemName)=>{
//     const item = document.createElement("div")
//     const removeItemCross = document.createElement('span')
//     item.className ='bg-yellow w-48 h-14 flex justify-between items-center px-4 rounded-lg mb-5'
//     item.innerText = itemName
//     item.id = itemName
//     removeItemCross.innerText='X'
//     removeItemCross.className ='cursor-pointer'
//     removeItemCross.addEventListener("click",(event)=>{
//         document.getElementById(event.target.parentElement.id).remove()
        
//     })
//     item.appendChild(removeItemCross)
//     return item
// }

// const callback = (event)=>{
//     const divIngredients = document.getElementById(event[0].target.id)
//     const divKeywords = document.getElementById("keywords")
//     if(event[0].attributeName !== "class"){
//         const selectedIngredient = divIngredients.dataset.selecteditemslist
//         divKeywords.appendChild(formatItemsKeywordsDiv(selectedIngredient))
//         return
//     }
// }

function init (){
    const recipesById = dataJson.reduce((acc,recipe)=>{
        acc[recipe.id] = recipe
        return acc
    },{})

    const searchResult = document.querySelector(".searchResult")
    Object.keys(recipesById).forEach(id=>{
        const cardContent = new RecipeCard(recipesById[id])
        searchResult.appendChild(cardContent.component)
    })

    const allIngredients = getIngredientsOfRecipes(recipesById)
    const allUstensiles = getUstensilsOfRecipes(recipesById)
    const allAppliances = getApplianceOfRecipes(recipesById)

    const divSearchInput = document.getElementById('inputSearch')
    const searchInput = new SearchInput('Rechercher une recette, un ingrédient, ...','/assets/svg/magnifyingGlass.svg')
    divSearchInput.appendChild(searchInput.component)

    const navBar = document.querySelector("nav ul")
    const ingredientsDropdown = new Dropdown('Ingrédients','ingredientsDropdown',allIngredients)
    const ustensilesDropdown = new Dropdown('Ustensiles','ustensilesDropdown',allUstensiles)
    const appliencesDropdown = new Dropdown('Appareils','appliencesDropdown',allAppliances)

    navBar.appendChild(ingredientsDropdown.render)
    navBar.appendChild(appliencesDropdown.render)
    navBar.appendChild(ustensilesDropdown.render)

    // const checkSelectedIngredientsList = new MutationObserver(callback)
    // checkSelectedIngredientsList.observe(document.getElementById('ingredientsDropdown'),{attributes: true})

    // const checkSelectedUstensilesList = new MutationObserver(callback)
    // checkSelectedUstensilesList.observe(document.getElementById('ustensilesDropdown'),{attributes: true})

    // const checkSelectedAppliancesList = new MutationObserver(callback)
    // checkSelectedAppliancesList.observe(document.getElementById('appliencesDropdown'),{attributes: true})

    // ingredientsDropdown.addItem = "Achocker"
}

init()