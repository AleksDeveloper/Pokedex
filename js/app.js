const pokedex =document.getElementById("ol-pokedex");
console.log(pokedex);
const cachePokemon = {};

const fetchPokemon = async () => {
    const url = "https://pokeapi.co/api/v2/pokemon?limit=150";
    const res = await fetch(url);
    const data = await res.json();
    const pokemon = data.results.map((result, index) => ({
        name: result.name,
        apiURL: result.url,
        id: index+1,
        image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"+(index+1)+".png"
    }));
    console.log(data.results);
    muestraPokemon(pokemon);
};   


const buscaPokemon = async () => {
    let busqueda = document.getElementById('barraBusqueda').value;
    if(!busqueda==""){
        const url = "https://pokeapi.co/api/v2/pokemon/"+busqueda;
        const promise = [];
        promise.push(fetch(url).then((res) => res.json()));
        
        Promise.all(promise).then((results) => {
            const pokemon = results.map((data) => ({
                name: data.name,
                apiURL: url,
                id: data.id,
                image: data.sprites['front_default']
            }))
            console.log(pokemon);
            muestraPokemon(pokemon);
        })
    }else{
        fetchPokemon();
    }
}


const muestraPokemon = (pokemon) => {
    //console.log(pokemon);
    const pokemonHTMLString = pokemon.map ( pokeman =>
        "<li class=\"card\" onclick=\"selectPokemon("+pokeman.id+")\">"+
            "<img class=\"card-image\" src = " + "\"" + pokeman.image + "\"" + "/>"+
            "<h2 class=\"card-title\">" + pokeman.id + ".- " + pokeman.name+
        "</li>"
    ).join('');
    pokedex.innerHTML = pokemonHTMLString;
};

const selectPokemon = async (id) => {
    // console.log(id);
    if(!cachePokemon[id]){
        const url = "https://pokeapi.co/api/v2/pokemon/"+id;
        const res = await fetch(url);
        const pokeman = await res.json();
        cachePokemon[id] = pokeman;
        muestraVentanaEmergente(pokeman);
    }else{
        muestraVentanaEmergente(cachePokemon[id]);
    }
    
}

const muestraVentanaEmergente = (pokeman) => {
    // console.log(pokeman);
    const type = pokeman.types.map((type) => type.type.name).join(', ');
    const image = pokeman.sprites['front_default'];
    // console.log(type);
    const htmlString = 
        "<div class = \"ventanaEmergente\">"+
            "<button id = \"botonCerrar\" onclick = \"cierraVentanaEmergente()\">Cerrar</button>"+
            "<div class = \"card\">"+
                "<img class = \"card-image\" src = \""+image+"\">"+
                "<h2 class = \"card-title\">"+pokeman.id+".- "+pokeman.name+"</h2>"+
                "<p><small>Altura: </small>"+pokeman.height+ " pies " +
                "| <small>Peso: </small>"+pokeman.weight+ " libras " +
                "| <small>Tipo: </small>"+type+
            "</div>"+
        "</div>";
    pokedex.innerHTML = htmlString + pokedex.innerHTML;
    //console.log(htmlString);
}

const cierraVentanaEmergente = () => {
    const ventanaEmergente = document.querySelector('.ventanaEmergente');
    ventanaEmergente.parentElement.removeChild(ventanaEmergente);
}


fetchPokemon();