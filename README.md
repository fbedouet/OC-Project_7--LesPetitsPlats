## OC-Project_7: Develop a search algorithm in JavaScript.

**Project name:** "Les Petits Plats".
**Project objective:** Create a recipe website like Marmiton or 750g..
**Github page:**

----------
### Release date and code advance
|Date|Comments  |
|--|--|
|``29/05/2024``|Creation of the boolean filter search method flowchart|
| ``08/04/2024`` |Restarting the project using TailWind instead of Bootstrap|
|``29/03/2024``|Start of main page integration with Bootstrap.|

### Search algorithm

```mermaid
flowchart TB
 subgraph data["Initial data"]
        tags("fa:fa-database store search parameter:
            ingredients fa:fa-arrow-right-to-bracket
            ustensils fa:fa-arrow-right-to-bracket
            appliance fa:fa-arrow-right-to-bracket
            input request fa:fa-arrow-right-to-bracket")
        json("fa:fa-database database of recipes
            json format")
  end
 subgraph search["Search function"]
        get(("fa:fa-arrows-rotate Get a database recipe"))
        filter(("filter true query"))
        processing{all query
                    is true}
        result("fa:fa-database Insert recipe in result array")
        endList{"no more recipe
        in database?"}
        subgraph testDropdown["With dropdown search"]
            isIng{"Items ingredients
                    in store ?"}
            isUst{"Items ustensiles
                    in store ?"}
            isApp{"Item appliance
                    in store ?"}
            test-ing{"Store ingredient(s) 
                        in recipe ?"}
            test-ust{"Store ustensile(s)
                        in recipe ?"}
            test-app{"Store appliance
                        in recipe ?"}
        end
        subgraph testInput["With main input search"]
            test-query{"Query in store?"}
            test-title{"Store query in
                        title of recipe ?"}
            test-desc{"Store query in
                        ingredients of recipe ?"}
            test-ingq{"Store query in
                        text of recipe?"}
            callback{"At least one
                        is true?"}
        end
  end

    data -.-> search
    start("Start") --> action("fa:fa-computer-mouse -Select dropdown item 
                            -Query in main input")
    action --> get

    get -- recipe n --> isIng--true-->test-ing
    get -- recipe n --> isUst--true-->test-ust
    get -- recipe n --> isApp--true-->test-app
    get -- recipe n -->test-query

    isIng --false-->filter
    isUst --false-->filter
    isApp --false-->filter

    test-ing -- true or false --> filter
    test-ust -- true or false --> filter
    test-app -- true or false --> filter

    test-query--true-->test-title
    test-query--true-->test-desc
    test-query--true-->test-ingq
    test-query--false-->filter

    test-title-- true or false-->callback
    test-desc--true or false-->callback
    test-ingq--true or false-->callback
    callback--true or false-->filter

    filter-->processing--yes-->result-->endList--yes recipe n+1 -->get
    processing--no-->endList
    endList--yes-->display["push result array in display process"]-->finish[End]



    style tags fill:#757575,color:#FFFFFF,stroke:#000000
    style json fill:#757575,stroke:#000000,color:#FFFFFF
    style data fill:#424242,color:#FFFFFF
    style search fill:#424242,color:#FFFFFF
    style testDropdown stroke:#F404040,fill:#585858,color:#303030
    style testInput stroke:#F404040,fill:#585858,color:#303030
    style start stroke:#D50000,fill:#FFE0B2,color:#D50000
    style finish stroke:#D50000,fill:#FFE0B2,color:#D50000
    style action fill:#757575,stroke:#2962FF,color:#FFFFFF
    style display fill:#757575,stroke:#2962FF,color:#FFFFFF
```

