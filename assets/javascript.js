// document.querySelector('.delete-button').addEventListener('click', () => {
//     console.log('Paspaudimas')
// })


document.querySelectorAll('.delete-button').forEach((element) => {
    element.addEventListener('click', () => {
        let id = element.getAttribute('data-id')
        // console.log(id)
        fetch('http://localhost:3001/' + id, { method: 'DELETE' })
            .then(response => {
                window.location.reload()
            })
    })
})