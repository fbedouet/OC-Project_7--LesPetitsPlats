const firstLetterToUpperCase = (name)=>{
    const smallLetter =  name.toLowerCase()
    return smallLetter[0].toUpperCase()+smallLetter.slice(1)
}

export{firstLetterToUpperCase}