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

const sortRecipesByIngredients = (ingredients,recipesData)=>{
    const callbackObject={}
    ingredients.forEach(ingredient=>{
        Object.entries(recipesData).forEach(recipe=>{
            recipe[1].ingredients.forEach(ing=>{
                if(firstLetterToUpperCase(ing.ingredient)===ingredient){
                    try{
                        callbackObject[ingredient].push(recipe[0])
                    }catch{
                       callbackObject[ingredient]=[recipe[0]] 
                    }
                }
            })
        })
    })
    return callbackObject
}

const sortRecipesByAppliances = (appliances, recipesData)=>{
    const callbackObject={}
    appliances.forEach(appliance=>{
        Object.entries(recipesData).forEach(recipe=>{
            if(firstLetterToUpperCase(recipe[1].appliance)===appliance){
                try{
                    callbackObject[appliance].push(recipe[0])
                }catch{
                   callbackObject[appliance]=[recipe[0]] 
                }
            }
        })
    })
    return callbackObject
}

const sortRecipesByUstensils = (ustensils, recipesData)=>{
    const callbackObject={}
    ustensils.forEach(ustensils=>{
        Object.entries(recipesData).forEach(recipe=>{
            recipe[1].ustensils.forEach(ust=>{
                if(firstLetterToUpperCase(ust)===ustensils){
                    try{
                        callbackObject[ustensils].push(recipe[0])
                    }catch{
                       callbackObject[ustensils]=[recipe[0]] 
                    }
                }
            })
        })
    })
    return callbackObject
}

const displayRecipes = (allRecipesArray, displayRecipesArray)=>{
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
    //data indexing
    const recipesById = dataJson.reduce((acc,recipe)=>{
        acc[recipe.id] = recipe
        return acc
    },{})
    const allIngredients = getIngredientsOfRecipes(recipesById)
    const allUstensiles = getUstensilsOfRecipes(recipesById)
    const allAppliances = getApplianceOfRecipes(recipesById)

    const recipesByIngredients = sortRecipesByIngredients (allIngredients, recipesById)
    const recipesByAppliances = sortRecipesByAppliances (allAppliances, recipesById)
    const recipesByUstensils = sortRecipesByUstensils (allUstensiles, recipesById)

    //state manager
    const searchParams = {
        ingredients:[],
        appliances:[],
        ustensiles:[]
    }

    const dropdownsContent = {
        ingredients: allIngredients,
        appliances: allAppliances,
        ustensiles: allUstensiles
    }

    const updateDropdownList = () => {
        ingredientsDropdown.update (dropdownsContent.ingredients)
        appliencesDropdown.update (dropdownsContent.appliances)
        ustensilesDropdown.update (dropdownsContent.ustensiles)
    }
    
    const onSelectDropdownItems = (category) =>(item)=>{
        searchParams[category].push(item)
        dropdownsContent[category] = dropdownsContent[category].filter(elt => elt!=item)
        updateDropdownList()
        renderRecipes()
    }
    const onRemoveItemsFunction = (category) =>(item)=>{
        const arrayPosition = searchParams[category].indexOf(item)
        searchParams[category].splice(arrayPosition,1)
        dropdownsContent[category].push(item)
        updateDropdownList()
        renderRecipes()
    }

    //build and display html page
    const divSearchInput = document.getElementById('inputSearch')
    const searchInput = new SearchInput('Rechercher une recette, un ingrédient, ...','/assets/svg/magnifyingGlass.svg')
    divSearchInput.appendChild(searchInput.component)

    const navBar = document.querySelector("nav ul")

    const ingredientsDropdown = new Dropdown('Ingrédients','ingredientsDropdown',allIngredients, onSelectDropdownItems("ingredients"))
    const ustensilesDropdown = new Dropdown('Ustensiles','ustensilesDropdown',allUstensiles, onSelectDropdownItems("ustensiles"))
    const appliencesDropdown = new Dropdown('Appareils','appliencesDropdown',allAppliances, onSelectDropdownItems("appliances"))

    navBar.appendChild(ingredientsDropdown.render())
    navBar.appendChild(appliencesDropdown.render())
    navBar.appendChild(ustensilesDropdown.render())


    
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
                keywordItems.appendChild(formatItemsKeywordsDiv(item,onRemoveItemsFunction(category)))
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
            displayRecipes(recipesById, Object.keys(recipesById))
            return
        }
        //render recipes with selected items in search
        const getRecipesOfItem = (category,item)=>{
            if(category ==="ingredients"){
                return recipesByIngredients[item]
            }
            if(category ==="appliances"){
                return recipesByAppliances[item]
            }
            if(category ==="ustensiles"){
                return recipesByUstensils[item]
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
        displayRecipes(recipesById,searchResult)
    }
    renderRecipes()
}

init()