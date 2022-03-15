import { writeFile, readFile, accessSync } from 'fs'
import express from 'express'
import { engine } from 'express-handlebars'

const app = express()
const database = './database.json'

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.urlencoded({
    extended: false
}))

app.get('/check-file', (req, res) => {
    try {
        accessSync(database)
        console.log('Failas egzistuoja')
        res.send('Failas egzistuoja')
    } catch (err) {
        console.log('Failo nera')
        res.send('Failo nera')
    }
})

app.get('/add-user', (req, res) => {
    res.render('add-user')
})

app.post('/add-user', (req, res) => {
    if (Object.keys(req.body).length > 0) {
        //Tikriname ar suvesti teisingi prisijungimo duomenys
        if (req.body.name === '' ||
            req.body.last_name === '' ||
            req.body.phone === '' ||
            req.body.email === '' ||
            req.body.address === ''
        ) {

            res.render('add-user', { message: 'Neteisingai užpildyti duomenys' })
            return

        } else {

            try {

                accessSync(database)

                //Jeigu failas yra

                readFile(database, 'utf8', (err, data) => {
                    let dataArray = JSON.parse(data)

                    dataArray.push(req.body)

                    writeFile(database, JSON.stringify(dataArray), 'utf8', (err) => {
                        if (!err) {
                            console.log('Failas sekmingai issaugotas')
                        } else {
                            console.log(err)
                        }
                    })

                })

            } catch (err) {

                //Jeigu failo nera

                let masyvas = []

                masyvas.push(req.body)

                writeFile(database, JSON.stringify(masyvas), 'utf8', (err) => {
                    if (!err) {
                        console.log('Failas sekmingai issaugotas')
                    } else {
                        console.log(err)
                    }
                })

            }

        }

    }
})

app.listen(3001)