const withoutDuplicates = (array) =>{
    const callbackArray = array.reduce((acc,ing)=>{
        if(acc.indexOf(ing)===-1){
            acc.push(ing)
        }
        return acc
    },[])
    return callbackArray
}

const firstLetterToUpperCase = (name)=>{
    const smallLetter =  name.toLowerCase()
    return smallLetter[0].toUpperCase()+smallLetter.slice(1)
}

const removeAccent = strWithAccent => strWithAccent.normalize("NFD").replace(/[\u0300-\u036f]/g,"")

const normalizeID = (keyword)=>{
    let idName = keyword.split(" ").join("_")
    idName = idName.split("'").join("")
    return removeAccent(idName.toLowerCase())
}

const normalizeInputText =(text)=> {
    if(text.includes(">")){text=text.replace(">",`${"\u003e"}`)}
    if(text.includes("<")){text=text.replace("<",`${"\u003c"}`)}
    return text
}

export{withoutDuplicates, firstLetterToUpperCase, removeAccent, normalizeID, normalizeInputText}