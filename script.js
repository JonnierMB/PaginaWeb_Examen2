const apiUrl = "https://pokeapi.co/api/v2/pokemon/"

async function searchpokeApi(url) {
    try {
        const response = await axios.get(url);
        return response.data;

    } catch (error) {
        console.error(`No Element Found: ${error} Number Error`);

    }
}

//Get static data
async function getpokeData(url) {
    const datas = await searchpokeApi(url);
    console.log(datas);
    const error = document.querySelector(".containerError");
    const container = document.querySelector(".containerInfo");
    switch(datas){
        case undefined: 
            error.style.display = "flex";
            container.style.display = "none";
        break
        default:
            error.style.display = "none";
            let pokeName = datas.forms[0].name; //name -
            let pokeImg = datas.sprites.other["official-artwork"].front_default;//image-
            let pokeAbility = [];
            let pokeAbilitystring = "";
            for (let i = 0; i< datas.abilities.length; i++){
                console.log(datas.abilities[i].ability.name) 
                onePokehab = datas.abilities[i].ability.name;
                pokeAbility.push(onePokehab);
                pokeAbilitystring += (i === datas.abilities.length - 1) ? onePokehab : onePokehab + ", ";
            }
            console.log(pokeAbilitystring);//abilities - 

            let searchpokeTypeApi = datas.forms[0].url; //Search 
            console.log(searchpokeTypeApi);//Search
            const searchpokeType = await searchpokeApi(searchpokeTypeApi); // ApiType
            console.log(searchpokeType.types[0].type.name);
            let pokeType = searchpokeType.types[0].type.name // Type -


            let pokeIndex = datas.game_indices[4].game_index; //index 
            const searchpokeIndex = await searchpokeApi(`https://pokeapi.co/api/v2/pokemon-species/${pokeIndex}`); // ApiSpecies evolution-chain and description
            console.log(searchpokeIndex);
            
            let flavorTextEntriesEnEspanol = searchpokeIndex.flavor_text_entries.filter(entry => entry.language.name === "es"); // Description - 
            let flavorTextEspanol = flavorTextEntriesEnEspanol.map(entry => entry.flavor_text); 
            console.log(`${flavorTextEspanol[0]} ${flavorTextEspanol[1]} ${flavorTextEspanol[3]}`);

            let evolutionchainApi =  searchpokeIndex.evolution_chain.url; // Evolution chain API
            const searchEvolutionchain = await searchpokeApi(evolutionchainApi); 
            let pokemonName = [];
            pokemonName.push(searchEvolutionchain.chain.species.name);
            searchEvolutionchain.chain.evolves_to.forEach(evolution => {
                pokemonName.push(evolution.species.name);
                evolution.evolves_to.forEach(subEvolution => {
                  pokemonName.push(subEvolution.species.name);
                });
            });
            console.log(pokemonName);//Evolution chain


            //put data in html code
            let type = document.querySelector('.pokemonType');
            type.innerHTML = pokeType;
            let imgdata = document.querySelector('.pokemonImg');
            imgdata.setAttribute("src", pokeImg )
            let description = document.querySelector('.pokemonDescrition');
            description.innerHTML = `${flavorTextEspanol[0]} ${flavorTextEspanol[1]} ${flavorTextEspanol[3]}`;
            let abilitiess = document.querySelector('.pokemonAbilities');
            abilitiess.innerHTML = pokeAbilitystring;


            //show data in page
            
            container.style.display = "flex";

            //Is Evolutionable?
            let pos = pokemonName.indexOf(pokeName);
            const Evolution = document.querySelector(".containerEvolution");
            let nextpos = pos + 1;
            if (nextpos < pokemonName.length) {
                let evolution = pokemonName[nextpos];
                Evolution.style.display = "flex";
                const evoButton = document.querySelector('.buttonEvolution');
                evoButton.addEventListener(
                    "click",
                    () => {
                        const getInput = evolution;
                        console.log(getInput);
                        newQuery(getInput);
                    }
                )
            } else {
                Evolution.style.display = "none";
            }
            

    }
}


//Search DB
const searchButton = document.querySelector('.buttonSearch');
const searchInput = document.getElementById('in1');
searchButton.addEventListener(
    "click",
    () => {
        const getInput = searchInput.value;
        console.log(getInput);
        newQuery(getInput);
    }
)

function newQuery(getdata){
    getdata = getdata.trim();
    getdata = getdata.replace(/ /g, "%20");
    const url = `${apiUrl}${getdata}`;
    searchInput.value = "";
    getpokeData(url);
}

//Proof API Search
// (async() =>{
//     const datas = await searchpokeApi(apiUrl);

//     if(datas == null){
//         console.log("Is not define")
//     }
//     console.log(datas);
// })();