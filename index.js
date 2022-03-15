import { writeFile, readFile, access } from 'fs'
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
    access(database, (err) => {
        if (err) {
            console.log('Failo nepavyko surasti')
        } else {
            console.log('Failas sekmingai surastas')
        }
    })
})





app.get('/add-user', (req, res) => {
    res.render('add-user')
})

// app.post('/add-user', function (req, res) {
//     let masyvas = []

//     if (Object.keys(req.body).length > 0) {
//         masyvas.push(
//             req.body
//         )
//     }

//     writeFile('./database.json', JSON.stringify(masyvas), 'utf8', function (err) {
//         if (!err) {
//             console.log('Failas sekmingai issaugotas')
//         } else {
//             console.log('Ivyko klaida')
//         }
//     })

//     res.send('Success')
// })


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

            let masyvas = []

            access(database, (err) => {

                if (err) {

                    masyvas.push(req.body)

                    writeFile(database, JSON.stringify(masyvas), 'utf8', (err) => {
                        if (!err) {
                            console.log('Failas sekmingai issaugotas')
                        } else {
                            console.log(err)
                        }
                    })

                    return false


                } else {


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
                }
            })


        }

    }
})


app.listen(3001)