
// Part1 - Implementem una funció `getData`encarregada de fer les peticions http
const getData = async (url) => {
    try {
        // Si fem "await" el codi no continuarà fins que no s'hagi resolt la petició (promesa)
        const response = await fetch(url);
        if (!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Arribats a aquest punt, tenim la resposta però s'han de "parsejar" les dades amb .json(), que també retorna una promesa!!!
        const data = await response.json();
        return data; 
        
    } catch (error) {
        console.error('Error: ', error)
        throw error;
    }
};

// Part2 - Aquí obtenim les dades de l'INE que volem
const getRentPrices = async () => {
    const url ="https://servicios.ine.es/wstempus/js/ES/DATOS_TABLA/59057?nult=10"
    try {
        // "await" farà que el codi s'aturi fins que rebi la informació de getData
        const data = await getData(url);
        
        return data;  
    } catch (error) {
        console.error('Error: ', error)
        return [];
    }
};

const showRentPrices = (data) => {
    // Filtrem les dades per obtenir només les que contenen "Nombre: Cataluña"
    data = data.filter((element)=> element.Nombre.includes('Cataluña. Total'))
    // Obtenim els divs de la secció on afegir les dades
    const divs = document.querySelectorAll('.contenidor > div')

    // Creem els elements de la llista 
    const ulElementVariacio = document.createElement('ul')
    const ulElementIndex = document.createElement('ul')

    // Comencaria la meva lògica recursiva per mostrar les dades necessàries
    data.forEach(element => {
        element.Data.forEach((item) =>{
            //1. Crear un element li per cada item de dades
            const liElement = document.createElement('li')
            //2. Comprovar si es tracta de la Variacio Anual o de l'índex de Preus
            if(element.Nombre.includes('Índice')){
                //3. Afegir el contingut a cada element
                liElement.innerHTML = `<b>${item.Anyo}</b> - ${item.Valor}`
                 //4. Afegir cada element a la llista corresponent (variacio o index)
                ulElementIndex.appendChild(liElement)
            } else if(element.Nombre.includes('Variación')){
                //3. Afegir el contingut a cada element
                liElement.innerHTML = `<b>${item.Anyo}</b> ${item.Valor}`
                //4. Afegir cada element a la llista corresponent (variacio o index)
                ulElementVariacio.appendChild(liElement)
            }
        })
    });
    // Acaba lògica
    
    // Afegeix la llista de Variació Anual al div corresponent 
    divs[0].appendChild(ulElementIndex)
    divs[1].appendChild(ulElementVariacio)
};

const getIPC = async () => {
    // 1. Fem la petició a la API amb getData
    const url = 'https://servicios.ine.es/wstempus/js/ES/DATOS_TABLA/50934?nult=10'
    try {
        const data = await getData(url)
        // 2. Obtenim el nostre "select" a través del DOM
        const selector = document.getElementById('ipc-selector')

        // Per a cada tipus de IPC, vull anar afegint aquest al "select"
        data.forEach(element =>{
            // Per cada entrada, creem i afegim un nou element "option"
            const opcio = document.createElement('option')
            // Ens podem desfer de la part del nom que es repeteix a totes les entrades
            const nameParts = element.Nombre.split('.');
            //console.log(nameParts)
            const nameAfterFirstDot = nameParts.slice(1).join('.')
            //console.log(nameAfterFirstDot)
            opcio.value = nameAfterFirstDot
            opcio.text = nameAfterFirstDot
            selector.appendChild(opcio)
        })
        return data;

    } catch (error) {
        console.error('Error:', error)
        return []
    }
}

const showIPC = async () => {
    const data = await getIPC()
    console.log(data)
    // Obtenim el valor seleccionat del selector de tipus d'IPC
    const select = document.getElementById('ipc-selector')
    const IPCselected = select.value

    let filteredData = data.filter((element)=> element.Nombre.includes(IPCselected))
    filteredData = filteredData[0];
    console.log(filteredData)

    const labels = []
    const values = []

    filteredData.Data.forEach(item =>{
        labels.push(item.Anyo);
        values.push(item.Valor)
    })

    // Canviem l'ordre dels eixos per fer-ho més lògic al gràfic
    labels.reverse()
    values.reverse()

    myChart(labels, values)
}

let chart = null; // Declarem una variable global per a guardar el gràfic

const myChart = (labels, data) => {
    console.log(labels, data)
    const ctx = document.getElementById('myChart').getContext('2d');
    if (chart) { // If a chart exists
        chart.destroy(); // Destroy it
    }
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Índex de Preus',
                backgroundColor: 'rgb(255, 220, 132)',
                borderColor: 'rgb(30, 30, 132)',
                data: data
            }]
        },
        options: {}
    });
}



main = async () => {
    const data = await getRentPrices();
    showRentPrices(data)
    showIPC()
    // Necessitem un event listener per quan es c('anvia el valor del selector
const select = document.getElementById('ipc-selector')
select.addEventListener('change', showIPC)
}

main();