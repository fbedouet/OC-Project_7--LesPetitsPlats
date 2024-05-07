import {dataJson} from './recipes.js'

function getData () {

    const recipesById = () => {
        const data = dataJson.reduce((acc,recipe)=>{
            acc[recipe.id] = recipe
            return acc
        },{})
        return data
    }

    const recipesData = recipesById()

    const ingredientsOfRecipes = () => {
        const ingredientsWithDoubles = Object.values(recipesData).reduce((acc,recipe)=>{
            const ingredients = recipe.ingredients.map(elt=>(elt.ingredient).toLowerCase())
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

    const ustensilsOfRecipes = ()=>{
        const ustensilsWithDoubles = Object.values(recipesData).reduce((acc,recipe)=>{
            return acc.concat(recipe.ustensils)
        },[])
        const ustensilsAllRecipes = ustensilsWithDoubles.reduce((acc,ing)=>{
            const formatedName = ing.toLowerCase()
            if(acc.indexOf(formatedName)===-1){
                acc.push(formatedName)
            }
            return acc
        },[])
        return ustensilsAllRecipes
    }

    const applianceOfRecipes = ()=>{
        const  appliancesWithDoubles = Object.values(recipesData).map(recipe=>recipe.appliance)
        const appliancesAllRecipes = appliancesWithDoubles.reduce((acc,ing)=>{
            const formatedName = ing.toLowerCase()
            if(acc.indexOf(formatedName)===-1){
                acc.push(formatedName)
            }
            return acc
        },[])
        return appliancesAllRecipes
    }

    const sortRecipesByIngredients = ()=>{
        const ingredients = ingredientsOfRecipes()
        const callbackObject={}
        ingredients.forEach(ingredient=>{
            Object.entries(recipesData).forEach(recipe=>{
                recipe[1].ingredients.forEach(ing=>{
                    if(ing.ingredient.toLowerCase() ===ingredient){
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

    const sortRecipesByAppliances = ()=>{
        const appliances = applianceOfRecipes()
        const callbackObject={}
        appliances.forEach(appliance=>{
            Object.entries(recipesData).forEach(recipe=>{
                if(recipe[1].appliance.toLowerCase() ===appliance){
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
    
    const sortRecipesByUstensils = ()=>{
        const ustensils = ustensilsOfRecipes()
        const callbackObject={}
        ustensils.forEach(ustensils=>{
            Object.entries(recipesData).forEach(recipe=>{
                recipe[1].ustensils.forEach(ust=>{
                    if(ust.toLowerCase() ===ustensils){
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

    const ingredientsById = () => {
        let ingredientsByRecipes = {}
        Object.keys(recipesData).forEach(id=>{
            ingredientsByRecipes[id] = recipesData[id].ingredients.map(elt=>(elt.ingredient).toLowerCase())
        })
        return ingredientsByRecipes
    }

    return {recipesById, ingredientsById,
            ingredientsOfRecipes, ustensilsOfRecipes, applianceOfRecipes,
            sortRecipesByIngredients, sortRecipesByAppliances, sortRecipesByUstensils
        }
}
export{getData}