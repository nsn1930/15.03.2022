import { writeFile, readFile, existsSync } from 'fs'
import express from 'express'
import { engine } from 'express-handlebars'
import chalk from 'chalk'

const app = express()
const database = './database.json'

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.urlencoded({
    extended: false
}))



app.use('/assets', express.static('assets'))

app.get('/check-file', (req, res) => {
    if (existsSync(database)) {
        console.log(chalk.blue('Failas egzistuoja'))
        res.send('Failas egzistuoja')
    } else {
        console.log(chalk.red('Failo nera'))
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

            res.render('add-user', { message: 'Neteisingai užpildyti duomenys', status: 'red' })
            return

        } else {

            if (existsSync(database)) {

                //Jeigu failas yra

                readFile(database, 'utf8', (err, data) => {
                    let dataArray = JSON.parse(data)

                    //Auto increment
                    req.body.id = dataArray[dataArray.length - 1].id + 1

                    dataArray.push(req.body)

                    writeFile(database, JSON.stringify(dataArray), 'utf8', (err) => {
                        if (!err) {
                            res.render('add-user', { message: 'Duomenys papildyti', status: 'green' })
                            return
                        } else {
                            console.log(err)
                        }
                    })

                })

            } else {

                //Jeigu failo nera

                let masyvas = []

                req.body.id = 0

                masyvas.push(req.body)

                writeFile(database, JSON.stringify(masyvas), 'utf8', (err) => {
                    if (!err) {
                        res.render('add-user', { message: 'Duomenys issiusti', status: 'green' })
                    } else {
                        console.log(err)
                    }
                })

            }

        }

    }
})

app.delete('/:id', (req, res) => {
    let id = req.params.id

    readFile(database, 'utf-8', (err, data) => {
        if (err) {
            res.send('Nepavyko perskaityti failo')
            return
        }
        //Issifruojame json informacija atgal i JS masyva
        const json = JSON.parse(data)

        const jsonId = json.findIndex((el) => el.id == id)


        if (jsonId === -1) {
            res.send('Nepavyko rasti tokio elemento')
            return
        }

        json.splice(jsonId, 1)

        let jsonString = JSON.stringify(json)

        writeFile(database, jsonString, 'utf-8', (err) => {
            if (err) {
                res.send('Nepavyko irasyti failo')
            } else {
                res.send('Failas sekmingai issaugotas')
            }
        })
    })
})

app.get('/', (req, res) => {
    readFile(database, 'utf-8', (err, data) => {
        let value = JSON.parse(data)

        res.render('person_info', { value })
    })
})





app.listen(3001)