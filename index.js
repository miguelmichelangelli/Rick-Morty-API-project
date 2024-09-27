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
        } else {
            

            let epi = character.data.results.map( ep => axios.get(ep.episode[0]))

            seen = await Promise.all(epi)

            console.log(seen.data)
        }

        // PRUEBAS
        // console.log(`Episode object: ${seen}`)
        // console.log('Object: ' + JSON.stringify(character.data))
        // console.log('ID:' + id)
        // console.log(typeof character.data)

        res.render('index.ejs', { 
            content: character.data,
            firstSeen: seen.data,
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


