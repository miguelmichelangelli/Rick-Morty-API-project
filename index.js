import express from 'express'
import axios from 'axios'
import bodyparser from 'body-parser'

const app = express()
const port = 3000

const BASE_URL = 'https://rickandmortyapi.com/api'

app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'))

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.post('/character', async (req, res) => {
    try {
        const id = req.body.id

        const config = {
            params: {
                name: req.body.name,
                status: req.body.status,
                gender: req.body.gender
            }
        }

        const URL = id ? `${BASE_URL}/character/${id}` : `${BASE_URL}/character`
        
        const character = await axios.get(URL, config)

        let seen

        if(id) {
            seen = await axios.get(character.data.episode[0])
            seen = seen.data

        } else {
            // arreglo de objetos que coincidan con los parametros dados
            const charsArr = character.data.results

            // guardamos en un nuevo arreglo el primer url del arreglo
            // de la propiedad episode, que representa el primer
            // episodio en el que apareció el personaje
            const urlsArr = charsArr.map(char => char.episode[0])

            // consumimos todas las apis del arreglo urlsArr con Promise.all
            // y las gaurdamos en un nuevo arreglo
            const myData = await Promise.all(urlsArr.map(url => axios.get(url)))

            // arreglo con el nombre del primer episodio en el que aparece
            // el personaje que coincida con la búsqueda, se obtiene a 
            // partir de las apis recien consumidas 
            const episodesArr = myData.map(episode => episode.data.name)

            let defArr = []

            // en un nuevo arreglo guardamos el arreglo que contiene
            // a los personajes y agregamos la propiedad episodea cada personaje
            charsArr.forEach((char, index) => {
                defArr.push({
                    ...char,
                    capName: episodesArr[index]
                })
            })

            seen = defArr
        }

        res.render('index.ejs', { 
            content: character.data,
            firstSeen: seen,
            character: true })
    
    } catch(err) {
        const message = err.response ? err.response.data : err.message;
        console.log(`ERROR: ${message}`);
        res.send(`ERROR: ${JSON.stringify(message)}`);
    }
})

app.post('/planet', async (req, res) => {
    try {
        const id = req.body.id

        const config = {
            name: req.body.name,
        }

        const URL = id ? `${BASE_URL}/location/${id}` : `${BASE_URL}/location`

        const planet = await axios.get(URL, config)

        res.render('index.ejs', {
            content: planet.data,
            location: true })

    } catch(err) {
        const message = err.response ? err.response.data : err.message;
        console.log(`ERROR: ${message}`);
        res.send(`ERROR: ${JSON.stringify(message)}`);
    }
})

app.post('/episode', async (req, res) => {
    try {
        const id = req.body.id

        const config = {
            name: req.body.name,
        }

        const URL = id ? `${BASE_URL}/episode/${id}` : `${BASE_URL}/episode`

        const episode = await axios.get(URL, config)

        res.render('index.ejs', { 
            content: episode.data,
            capitule: true })

    } catch(err) {
        const message = err.response ? err.response.data : err.message;
        console.log(`ERROR: ${message}`);
        res.send(`ERROR: ${JSON.stringify(message)}`);
    }
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})


