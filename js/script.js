const list = document.querySelector('.pokelist')
const habitats = document.querySelector('.habitats')
const message = document.querySelector('.message')
const refresh = document.querySelector('.refresh')
const overlay = document.querySelector('.overlay')

refresh.addEventListener('click', function(){window.location.reload()})
habitats.addEventListener('click', getData)
document.querySelector('body').addEventListener('click', displayInfo) //event listener to handle ls created by JS
overlay.addEventListener('click', function(){overlay.classList.add('hide')})

let counter = 0 //counter for max poke of 10

function displayInfo(e) {
    let node = e.target.nodeName.toLowerCase()
    if (node === 'li') {
        let name = e.target.innerText

        fetch(`https://pokeapi.co/api/v2/pokemon/${name}`) //get information for overlay
            .then(res => res.json())
            .then(data => {
                let abilities = []
                data.abilities.forEach(e => abilities.push(e.ability.name))

                document.querySelector('.sprite').src = data.sprites.front_default
                document.querySelector('.name').innerText = `Name: ${name}`
                document.querySelector('.height').innerText = `Height: ${data.height}`
                document.querySelector('.abilities').innerText = `Abilities: ${abilities.join(", ")}`
                document.querySelector('.flavorText').innerText = "Observations:\n"

                fetch(data.species.url)
                    .then(res => res.json())
                    .then(data => {
                        document.querySelector('.habitat').innerText = `Habitat: ${data.habitat.name}`
                        
                        let n = 0
                        while (data.flavor_text_entries[n].language.name != 'en') { //english translations only!
                            n++
                        }
                        document.querySelector('.flavorText').innerText = `Observations:\n${data.flavor_text_entries[n].flavor_text.replace("", " ").replace("\n", " ").toLowerCase()}`


                    })
                    .catch(err => {
                        console.log(`error ${err}`)
                    })

                document.querySelector('.overlay').classList.remove('hide')
            })
            .catch(err => {
                console.log(`error ${err}`)
        });
    }
}

function getData(e) {

    let place = e.target.className

    fetch(`https://pokeapi.co/api/v2/pokemon-habitat/${place}/`)
        .then(res => res.json()) 
        .then(data => {
            let num = Math.floor(Math.random() * Math.floor(data.pokemon_species.length))
            let randomPoke = data.pokemon_species[num]
            let name = randomPoke.name


            //add pokemon name to list
            let text = document.createTextNode(name)
            let el = document.createElement('li')
            el.appendChild(text)
            list.appendChild(el)

        })
        .catch(err => {
            console.log(`error ${err}`)
        });

    counter++ //increment counter every time a pokemon is discovered

    if (counter >= 10) {

        document.querySelector('.max').innerText = "you have observed as many pokémon as you can!\nClick the button to refresh and start again"

        message.classList.remove('hide') //show maximum observed pokemon message

        if (habitats.removeEventListener) { // For all major browsers, except IE 8 and earlier
            habitats.removeEventListener("click", getData);
        } else if (habitats.detachEvent) {                    // For IE 8 and earlier versions
            habitats.detachEvent("onmousemove", myFunction);
        }
    }
}