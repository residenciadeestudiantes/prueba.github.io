let dataset, svg
let salarySizeScale, salaryXScale, categoryColorScale
let simulation, nodes
let categoryLegend, salaryLegend
/*
const categories = ['Engineering', 'Business', 'Physical Sciences', 'Law & Public Policy', 'Computers & Mathematics', 'Agriculture & Natural Resources',
'Industrial Arts & Consumer Services','Arts', 'Health','Social Science', 'Biology & Life Science','Education','Humanities & Liberal Arts',
'Psychology & Social Work','Communications & Journalism','Interdisciplinary']
*/
const categories = ['universidad', 'educacion', 'cursos', 'visitantes', 'artes',
'opositoras', 'fp', 'otros']
const categories_UTF8 = ['Universidad', 'Educación', 'Cursos', 'Visitantes', 'Artes',
'Opositoras', 'F.P.', 'Otros']

/* GAMA ORGINAL const colors = ['#ffcc00', '#ff6666', '#cc0066', '#66cccc', '#f688bb', '#65587f', 
'#baf1a1', '#333333', '#75b79e',  '#66cccc', '#9de3d0', '#f1935c', '#0c7b93', '#eab0d9', '#baf1a1', '#9399ff'] */

const colors = ['#6c5154', '#986e74', '#cea7c4', '#e3e2e2', '#bc959c',
    '#bfbebe', '#a988ac', '#f3c8dd']


/*
const categoriesXY = {'Engineering': [0, 400, 57382, 23.9],
                        'Business': [0, 600, 43538, 48.3],
                        'Physical Sciences': [0, 800, 41890, 50.9],
                        'Law & Public Policy': [0, 200, 42200, 48.3],
                        'Computers & Mathematics': [200, 400, 42745, 31.2],
                        'Agriculture & Natural Resources': [200, 600, 36900, 40.5],
                        'Industrial Arts & Consumer Services': [200, 800, 36342, 35.0],
                        'Arts': [200, 200, 33062, 60.4],
                        'Health': [400, 400, 36825, 79.5],
                        'Social Science': [400, 600, 37344, 55.4],
                        'Biology & Life Science': [400, 800, 36421, 58.7],
                        'Education': [400, 200, 32350, 74.9],
                        'Humanities & Liberal Arts': [600, 400, 31913, 63.2],
                        'Psychology & Social Work': [600, 600, 30100, 79.4],
                        'Communications & Journalism': [600, 800, 34500, 65.9],
                        'Interdisciplinary': [600, 200, 35000, 77.1]}
*/

/*
const categoriesXY = {'universidad': [0, 200, "Farmacia", 13.9, "Estudios universitarios"],
                        'educacion': [200, 200, "E.S. de Magisterio", 18.3, "Estudios en educación"],
                        'cursos': [400, 200, "Cursos de idiomas", 30.9, "Cursos"],
                        'visitantes': [600, 200, "Conferenciantes", 18.3, "Conferenciantes, etc."],
                        'artes': [0, 500, "Artes plásticas y escénicas", 31.2, "Artes"],
                        'opositoras': [200, 500, "Administración Pública", 10.5, "Opositoras"],
                        'fp': [400, 500, "Comercio", 15.0, "Formación profesional"],
                        'otros': [600, 500, "Otras situaciones", 10.4, "Otra educación"]}
                        */

const categoriesXY = {'universidad': [0, 200, "Estudios universitarios", 13.9, "Estudios universitarios"],
                        'educacion': [200, 200, "Estudios en educación", 18.3, "Estudios en educación"],
                        'cursos': [400, 200, "Cursos", 30.9, "Cursos"],
                        'visitantes': [600, 200, "Conferenciantes", 18.3, "Conferenciantes, etc."],
                        'artes': [0, 500, "Artes", 31.2, "Artes"],
                        'opositoras': [200, 500, "Opositoras", 10.5, "Opositoras"],
                        'fp': [400, 500, "Formación profesional", 15.0, "Formación profesional"],
                        'otros': [600, 500, "Otra educación", 10.4, "Otra educación"]}


const margin = {left: 50, top: 50, bottom: 50, right: 50}
//const width = 1000 - margin.left - margin.right
const width = 800 - margin.left - margin.right
const height = 950 - margin.top - margin.bottom



// Es muy importante que en el fichero no haya ningún tipo de línea accesoria.
// También es importante que en la columna "category" no haya ninguna categoría que no se halle en "CategoriesXY".
d3.csv('data/Datos_Residencia_senoritas-copia.csv', function(d) {
    return {
        Major: d.Major,
        Nombre: d.Nombre,
        Total: +d.Total,
        Men: +d.Men,
        Women: +d.Women,
        Median: +d.Median,
        Unemployment: +d.Unemployment_rate,
        Category: d.Major_category,
        Category_UTF8: d.Major_category_UTF8,
        ShareWomen: +d.ShareWomen, 
        HistCol: +d.Histogram_column,
        Midpoint: +d.midpoint

    };
}).then(data => {
    dataset = data
    console.log(dataset)
    createScales()
    setTimeout(drawInitial, 100)  // Correctly referencing the function
}).catch(error => {
    console.error("Error loading the CSV file:", error)
});



// Categorias que usaremos en el histograma, y sus colores (en el mismo orden).
const categories_uni = ['Humanidades_derecho', 'Humanidades_economia', 'Humanidades_filologia', 'Humanidades_filosofia', 'Humanidades_historia', 'Humanidades_letras', 'Humanidades_pedagogia', 'ciencias_farmacia', 'ciencias_fisica', 'ciencias_ingenieria', 'ciencias_matematicas', 'ciencias_medicina', 'ciencias_naturales', 'ciencias_oceanografia', 'ciencias_odontologia', 'ciencias_oftalmologia', 'ciencias_quimica', 'ciencias_inespecificado']
const colors_uni = ['#a5481e', '#df7226', '#915a3a', '#d13e36', '#e86b53', '#bd8a70', '#ed985f', '#8f9977', '#948fa0', '#6f8ec8', '#e1dde5', '#6b7758', '#75a6b1', '#b6d6df', '#a7b48b', '#c6cdae', '#c0bdc8', '#a1bcdc']

//Create all the scales and save to global variables

function createScales(){
    salarySizeScale = d3.scaleLinear(d3.extent(dataset, d => d.Median), [10, 35])  // marca el tamaño de muchas de las bolas
    salaryXScale = d3.scaleLinear(d3.extent(dataset, d => d.Median), [margin.left, margin.left + width+250])
    salaryYScale = d3.scaleLinear([20000, 110000], [margin.top + height, margin.top])
    categoryColorScale = d3.scaleOrdinal(categories, colors)
    categoryColorScale_UTF8 = d3.scaleOrdinal(categories_UTF8, colors)
    shareWomenXScale = d3.scaleLinear(d3.extent(dataset, d => d.ShareWomen), [margin.left, margin.left + width])
    enrollmentScale = d3.scaleLinear(d3.extent(dataset, d => d.Total), [margin.left + 120, margin.left + width - 50])
    enrollmentSizeScale = d3.scaleLinear(d3.extent(dataset, d=> d.Total), [10,60])
    histXScale = d3.scaleLinear(d3.extent(dataset, d => d.Midpoint), [margin.left, margin.left + width])
    histYScale = d3.scaleLinear(d3.extent(dataset, d => d.HistCol), [margin.top + height, margin.top])
}

function createLegend(x, y){
    let svg = d3.select('#legend')

    svg.append('g')
        .attr('class', 'categoryLegend')
        .attr('transform', `translate(${x},${y})`)

    categoryLegend = d3.legendColor()
                            .shape('path', d3.symbol().type(d3.symbolCircle).size(150)())
                            .shapePadding(10)
                            .scale(categoryColorScale_UTF8)
    
    d3.select('.categoryLegend')
        .call(categoryLegend)
}

 //.PARA VER LEYENDA TAMAÑOS BOLAS
function createSizeLegend(){
    let svg = d3.select('#legend2')
    svg.append('g')
        .attr('class', 'sizeLegend')
        .attr('transform', `translate(100,50)`)
	 //.LÍNEA PARA OCULTAR LA LEYENDA DE TAMAÑOS
	.attr('opacity', 0)

    sizeLegend2 = d3.legendSize()
        .scale(salarySizeScale)
        .shape('circle')
        .shapePadding(15)
        //.title('Salary Scale')  # ORIGINAL
        //.labelFormat(d3.format("$,.2r"))  # ORIGINAL
        .title('')   // FUL
        .labelFormat(d3.format(",.2r"))  // FUL
        .cells(7)

    d3.select('.sizeLegend')
        .call(sizeLegend2)
} //DESACTIVADO

function createSizeLegend2(){
    let svg = d3.select('#legend3')
    svg.append('g')
        .attr('class', 'sizeLegend2')
        .attr('transform', `translate(50,100)`)
	

    sizeLegend2 = d3.legendSize()
        .scale(enrollmentSizeScale)
        .shape('circle')
        .shapePadding(55)
        .orient('horizontal')
        .title('Enrolment Scale')
        .labels(['1000', '200000', '400000'])
        .labelOffset(30)
        .cells(3)

    d3.select('.sizeLegend2')
        .call(sizeLegend2)
}


function createLegend5(x, y) {
    let svg = d3.select('#legend5');

    const legendData = [
        { color: '#a7b48b', label: 'Ciencias' },
        { color: '#d13e36', label: 'Humanidades' },
        { color: '#ecb620', label: 'Educación' },
		{ color: '#c8c3d1', label: 'Otros' }
    ];

    const extraLegend = svg.append('g')
        .attr('class', 'extraLegend')
        .attr('transform', `translate(${x},${y})`)
        .style('display', 'none');  // Initially hidden

    extraLegend.selectAll('circle')
        .data(legendData)
        .enter()
        .append('circle')
        .attr('cx', 0)
        .attr('cy', (d, i) => i * 30)
        .attr('r', 10)
        .style('fill', d => d.color);

    extraLegend.selectAll('text')
        .data(legendData)
        .enter()
        .append('text')
        .attr('x', 20)
        .attr('y', (d, i) => i * 30)
        .attr('dy', '0.35em')
        .text(d => d.label);
}

// All the initial elements should be create in the drawInitial function
// As they are required, their attributes can be modified
// They can be shown or hidden using their 'opacity' attribute
// Each element should also have an associated class name for easy reference

function drawInitial(){
    createSizeLegend()
    createSizeLegend2()

    let svg = d3.select("#vis")
                    .append('svg')
                    .attr('width', 1000)
                    .attr('height', 950)
                    .attr('opacity', 1)

    // Instantiates the force simulation
    // Has no forces. Actual forces are added and removed as required
    simulation = d3.forceSimulation(dataset)

     // Define each tick of simulation
    simulation.on('tick', () => {
        nodes
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
    })

    // Stop the simulation until later
    simulation.stop()

    // Selection of all the circles 
    nodes = svg
        .selectAll('circle')
        .data(dataset)
        .enter()
        .append('circle')
            //.attr('fill', 'black')  // Esto era para el equivalente a draw1(). Lo inactivo.
            //.attr('r', 3)  // Esto también era para el equivalente a draw1(). Lo inactivo.
            .attr('r', d => salarySizeScale(d.Median) * 1.2)  // Queremos empezar como sería draw2().
            .attr('fill', d => categoryColorScale(d.Category))  // Idem. Por eso hemos incorporado estas dos líneas.
            .attr('cx', (d, i) => salaryXScale(d.Median) + 5)
            .attr('cy', (d, i) => i * 5.2 + 30)
            .attr('opacity', 0.8)
        
    // Add mouseover and mouseout events for all circles
    // Changes opacity and adds border
    svg.selectAll('circle')
        .on('mouseover', mouseOver)
        .on('mouseout', mouseOut)

    function mouseOver(d, i){

        console.log('hi')
        d3.select(this)
            .transition('mouseover').duration(100)
            .attr('opacity', 1)
            .attr('stroke-width', 5)
            .attr('stroke', 'black')
            
        d3.select('#tooltip')
            .style('left', (d3.event.pageX + 10)+ 'px')
            .style('top', (d3.event.pageY - 25) + 'px')
            .style('display', 'inline-block')
            .html(`<strong>Actividad:</strong> ${ d.Nombre}
                <br> <strong>Categoría:</strong> ${d.Category}
                <br> <strong1> ${d3.format(",.2r")(d.Total)}</strong1> `)
                //<strong>Actividad:</strong> ${d.Major[0] + d.Major.slice(1,).toLowerCase()}   // Este era el encabezado originalmente usado.
                //<br> <strong>Median Salary:</strong> $${d3.format(",.2r")(d.Median)} 
                //<br> <strong>% Female:</strong> ${Math.round(d.ShareWomen*100)}%
    }
    
    function mouseOut(d, i){
        d3.select('#tooltip')
            .style('display', 'none')

        d3.select(this)
            .transition('mouseout').duration(100)
            .attr('opacity', 0.8)
            .attr('stroke-width', 0)
    }

    //All the required components for the small multiples charts
    //Initialises the text and rectangles, and sets opacity to 0 
    svg.selectAll('.cat-rect')
        .data(categories).enter()
        .append('rect')
            .attr('class', 'cat-rect')
            .attr('x', d => categoriesXY[d][0] + 120 + 1000)
            .attr('y', d => categoriesXY[d][1] + 30)
            .attr('width', 160)
            .attr('height', 30)
            .attr('opacity', 0)
            .attr('fill', 'grey')


    svg.selectAll('.lab-text')
        .data(categories).enter()
        .append('text')
        .attr('class', 'lab-text')
        .attr('opacity', 0)
        .raise()

    svg.selectAll('.lab-text')
        .text(d => `Average: $${d3.format(",.2r")(categoriesXY[d][2])}`)
        .attr('x', d => categoriesXY[d][0] + 200 + 1000)
        .attr('y', d => categoriesXY[d][1] - 500)
        .attr('font-family', 'Arial')
        .attr('font-size', '12px')
        .attr('font-weight', 700)
        .attr('fill', '#616161')
        .attr('text-anchor', 'middle')       

    svg.selectAll('.lab-text')
            .on('mouseover', function(d, i){
                d3.select(this)
                    .text(d)
            })
            .on('mouseout', function(d, i){
                d3.select(this)
                    .text(d => `Average: $${d3.format(",.2r")(categoriesXY[d][2])}`)
            })


// Por algún motivo, estas dos líneas influyen en que el estado inicial sea el correcto (como "draw2()).
    let scatterxAxis = d3.axisBottom(shareWomenXScale)
    let scatteryAxis = d3.axisLeft(salaryYScale).tickSize([width])


    svg.append('g')
        .call(scatterxAxis)
        .attr('class', 'scatter-x')
        .attr('opacity', 0)
        .attr('transform', `translate(0, ${height + margin.top})`)
        .call(g => g.select('.domain')
            .remove())
    
    svg.append('g')
        .call(scatteryAxis)
        .attr('class', 'scatter-y')
        .attr('opacity', 0)
        .attr('transform', `translate(${margin.left - 20 + width}, 0)`)
        .call(g => g.select('.domain')
            .remove())
        .call(g => g.selectAll('.tick line'))
            .attr('stroke-opacity', 0.2)
            .attr('stroke-dasharray', 2.5)

    // Axes for Histogram 

    let histxAxis = d3.axisBottom(enrollmentScale)

    svg.append('g')
        .attr('class', 'enrolment-axis')
        .attr('transform', 'translate(0, 700)')
        .attr('opacity', 0)
        .call(histxAxis)


    simulation
        .force('charge', d3.forceManyBody().strength([2]))
        .force('forceX', d3.forceX(d => categoriesXY[d.Category][0] + 200))
        .force('forceY', d3.forceY(d => categoriesXY[d.Category][1] - 50))
        .force('collide', d3.forceCollide(d => salarySizeScale(d.Median) + 4))
        .alphaDecay([0.02])

    simulation.alpha(0.9).restart()

    createLegend(20, 50)


    console.log("Initial data:", dataset);
    console.log("CategoriesXY:", categoriesXY);
    
}        

//Cleaning Function
//Will hide all the elements which are not necessary for a given chart type 

function clean(chartType){
    let svg = d3.select('#vis').select('svg')
    if (chartType !== "isScatter") {
        svg.select('.scatter-x').transition().attr('opacity', 0)
        svg.select('.scatter-y').transition().attr('opacity', 0)
        svg.select('.best-fit').transition().duration(200).attr('opacity', 0)
    }
    if (chartType !== "isMultiples"){
        svg.selectAll('.lab-text').transition().attr('opacity', 0)
            .attr('x', 1800)
        svg.selectAll('.cat-rect').transition().attr('opacity', 0)
            .attr('x', 1800)
    }
    // Referido al gráfico de draw1()
    if (chartType !== "isFirst"){
        svg.select('.first-axis').transition().attr('opacity', 0)
        svg.selectAll('.small-text').transition().attr('opacity', 0)
            .attr('x', -200)
    }
    if (chartType !== "isHist"){
        svg.selectAll('.hist-axis').transition().attr('opacity', 0)
    }
    if (chartType !== "isBubble"){
        svg.select('.enrolment-axis').transition().attr('opacity', 0)
    }
}

//First draw function

/*
function draw1(){
    //Stop simulation
    simulation.stop()
    
    let svg = d3.select("#vis")
                    .select('svg')
                    .attr('width', 1000)
                    .attr('height', 950)
    
    clean('isFirst')

    d3.select('.categoryLegend').transition().remove()

    svg.select('.first-axis')
        .attr('opacity', 1)
    
    svg.selectAll('circle')
        .transition().duration(500).delay(100)
        .attr('fill', 'black')
        .attr('r', 3)
        .attr('cx', (d, i) => salaryXScale(d.Median)+5)
        .attr('cy', (d, i) => i * 5.2 + 30)

    svg.selectAll('.small-text').transition()
        .attr('opacity', 1)
        .attr('x', margin.left)
        .attr('y', (d, i) => i * 5.2 + 30)
}
*/

function draw2(){
    let svg = d3.select("#vis").select('svg')
    
    clean('none')

    svg.selectAll('circle')
        .transition().duration(300).delay((d, i) => i * 5)
        .attr('r', d => salarySizeScale(d.Median) * 1.2) // Este factor amplifica la escala, resaltando diferencias.
        .attr('fill', d => categoryColorScale(d.Category))

    simulation  
        .force('charge', d3.forceManyBody().strength([2]))
        .force('forceX', d3.forceX(d => categoriesXY[d.Category][0] + 200))
        .force('forceY', d3.forceY(d => categoriesXY[d.Category][1] - 50))
        .force('collide', d3.forceCollide(d => salarySizeScale(d.Median) + 4))
        .alphaDecay([0.02])

    //Reheat simulation and restart
    simulation.alpha(0.9).restart()
    
    createLegend(20, 50)
}

function draw3(){
    let svg = d3.select("#vis").select('svg')
    clean('isMultiples')
    d3.selectAll('.extraLegend').style('display', 'none');
    
    svg.selectAll('circle')
        .transition().duration(400).delay((d, i) => i * 5)
        .attr('r', d => salarySizeScale(d.Median) * 1.2)
        .attr('fill', d => categoryColorScale(d.Category))

    svg.selectAll('.cat-rect').transition().duration(300).delay((d, i) => i * 30)
        .attr('opacity', 0.2)
        .attr('x', d => categoriesXY[d][0] + 120)
        
        svg.selectAll('.lab-text').transition().duration(300).delay((d, i) => i * 30)
        //.text(d => `Average salary: $${d3.format(",.2r")(categoriesXY[d][2])}`)  // Versión original
        //.text(d => `Más frecuente: ${categoriesXY[d][2]}`)  // El texto inicial del recuadro
        .text(d => `${categoriesXY[d][2]}`)  // El texto inicial del recuadro

        .attr('x', d => categoriesXY[d][0] + 200)
        .attr('y', d => categoriesXY[d][1] + 50)
        .attr('opacity', 1)

    svg.selectAll('.lab-text')
        .on('mouseover', function(d, i){
            d3.select(this)
                .text(d => ` ${categoriesXY[d][2]}`)
                //.text(d)  // texto al pasar el puntero del ratón por encima
        })
        .on('mouseout', function(d, i){
            d3.select(this)
                .text(d => ` ${categoriesXY[d][2]}`)  // Texto al sacar el puntero del ratón
                //.text(d => `Más frecuente: ${categoriesXY[d][2]}`)  // Texto al sacar el puntero del ratón

        })

    simulation  
        .force('charge', d3.forceManyBody().strength([2]))
        .force('forceX', d3.forceX(d => categoriesXY[d.Category][0] + 200))
        .force('forceY', d3.forceY(d => categoriesXY[d.Category][1] - 50))
        .force('collide', d3.forceCollide(d => salarySizeScale(d.Median) + 4))
        .alpha(0.7).alphaDecay(0.02).restart()

}

function draw5(){
    
    clean('isBubble')

    let svg = d3.select('#vis').select('svg')
    clean('isMultiples')

    simulation
        .force('forceX', d3.forceX(d => categoriesXY[d.Category][0] + 200))
        .force('forceY', d3.forceY(d => categoriesXY[d.Category][1] - 50))
        .force('collide', d3.forceCollide(d => salarySizeScale(d.Median) + 4))

    simulation.alpha(1).restart()
   
    /* TEXTO COLORACIÓN POR PORCENTAJES
    svg.selectAll('.lab-text').transition().duration(300).delay((d, i) => i * 30)
        .text(d => `% Extranjeras: ${(categoriesXY[d][3])}%`)
        .attr('x', d => categoriesXY[d][0] + 200)   
        .attr('y', d => categoriesXY[d][1] + 50)
        .attr('opacity', 1)*/
    
    /*svg.selectAll('.lab-text')
        .on('mouseover', function(d, i){
            d3.select(this)
                .text(d)
        })
        .on('mouseout', function(d, i){
            d3.select(this)
                .text(d => `% Female: ${(categoriesXY[d][3])}%`)
        })
   
    svg.selectAll('.cat-rect').transition().duration(300).delay((d, i) => i * 30)
        .attr('opacity', 0.2)
        .attr('x', d => categoriesXY[d][0] + 120)
        */

    svg.selectAll('circle')
        .transition().duration(400).delay((d, i) => i * 4)
            .attr('fill', colorByGender)
            .attr('r', d => salarySizeScale(d.Median))
    createLegend5(50, 50);  // Adjust the coordinates as needed
    d3.select('#legend5 .extraLegend').style('display', null);
}

function colorByGender(d, i){
    if (d.ShareWomen < 0.2){
        return '#a7b48b'
    } else if (d.ShareWomen > 0.8) {
        return '#d13e36'
    } 
    else if (d.ShareWomen > 0.2 && d.ShareWomen < 0.4) {
        return '#ecb620'
    }
    else {
        return  '#c8c3d1'
    }
}

/*
function draw6(){
    simulation.stop()
    
    let svg = d3.select("#vis").select("svg")
    clean('isScatter')

    svg.selectAll('.scatter-x').transition().attr('opacity', 0.7).selectAll('.domain').attr('opacity', 1)
    svg.selectAll('.scatter-y').transition().attr('opacity', 0.7).selectAll('.domain').attr('opacity', 1)

    svg.selectAll('circle')
        .transition().duration(800).ease(d3.easeBack)
        .attr('cx', d => shareWomenXScale(d.ShareWomen))
        .attr('cy', d => salaryYScale(d.Median))
    
    svg.selectAll('circle').transition(1600)
        .attr('fill', colorByGender)
        .attr('r', 10)

    svg.select('.best-fit').transition().duration(300)
        .attr('opacity', 0.5)
   
}
*/

function draw7(){
    let svg = d3.select('#vis').select('svg')

    clean('isBubble')
    d3.selectAll('.extraLegend').style('display', 'none');

    simulation
        .force('forceX', d3.forceX(d => enrollmentScale(d.Total)))
        .force('forceY', d3.forceY(500))
        .force('collide', d3.forceCollide(d => enrollmentSizeScale(d.Total) + 2))
        .alpha(0.8).alphaDecay(0.05).restart()

    svg.selectAll('circle')
        .transition().duration(300).delay((d, i) => i * 4)
        .attr('r', d => enrollmentSizeScale(d.Total))
        .attr('fill', colorByGender)
        //.attr('fill', d => categoryColorScale(d.Category))


    //Show enrolment axis (remember to include domain)
    svg.select('.enrolment-axis').attr('opacity', 0.5).selectAll('.domain').attr('opacity', 1)

}
/*
function draw4(){
    let svg = d3.select('#vis').select('svg')

    clean('isHist')

    simulation.stop()

    svg.selectAll('circle')
        .transition().duration(600).delay((d, i) => i * 2).ease(d3.easeBack)
            .attr('r', 10)
            .attr('cx', d => histXScale(d.Midpoint))
            .attr('cy', d => histYScale(d.HistCol))
            .attr('fill', d => categoryColorScale(d.Category))

    let xAxis = d3.axisBottom(histXScale)
    svg.append('g')
        .attr('class', 'hist-axis')
        .attr('transform', `translate(0, ${height + margin.top + 10})`)
        .call(xAxis)

    svg.selectAll('.lab-text')
        .on('mouseout', )
}
*/

/*   WITH AWKWARD WOBBLE
function draw4(){
    let svg = d3.select('#vis').select('svg')

    clean('isHist')

    simulation.stop()

    // Position circles with a transition
    svg.selectAll('circle')
        .transition().duration(600).delay((d, i) => i * 2).ease(d3.easeBack)
            .attr('r', 10)
            .attr('cx', d => histXScale(d.Midpoint))
            .attr('cy', d => histYScale(d.HistCol))
            .attr('fill', d => categoryColorScale(d.Category))
            .on('end', () => {
                // Once transition ends, start the wobble effect
                startWobble()
            })

    // Define the x-axis for the histogram
    let xAxis = d3.axisBottom(histXScale)
    svg.append('g')
        .attr('class', 'hist-axis')
        .attr('transform', `translate(0, ${height + margin.top + 10})`)
        .call(xAxis)

    svg.selectAll('.lab-text')
        .on('mouseout', null)  // This seems to be incomplete, so setting it to null for now

    // Function to add a "wobble" effect by applying small random displacements
    function addWobble(value, amount) {
        return value + (Math.random() - 0.5) * amount
    }

    // Start the wobble effect
    function startWobble() {
        setInterval(() => {
            svg.selectAll('circle')
                .transition().duration(300)
                .attr('cx', d => addWobble(histXScale(d.Midpoint), 10))
                .attr('cy', d => addWobble(histYScale(d.HistCol), 10))
        }, 300)
    }
}
*/



function draw8(){
    clean('none')

    let svg = d3.select('#vis').select('svg')
    svg.selectAll('circle')
        .transition()
        .attr('r', d => salarySizeScale(d.Median) * 1.6)
        .attr('fill', d => categoryColorScale(d.Category))

    simulation 
        .force('forceX', d3.forceX(500))
        .force('forceY', d3.forceY(500))
        .force('collide', d3.forceCollide(d => salarySizeScale(d.Median) * 1.6 + 4))
        .alpha(0.6).alphaDecay(0.05).restart()
        
}

//Array of all the graph functions
//Will be called from the scroller functionality

let activationFunctions = [
//    draw1,
    draw2,
    draw3,
//    draw4,
    draw5, 
//    draw6, 
    draw7,
    draw8
]

//All the scrolling function
//Will draw a new graph based on the index provided by the scroll


let scroll = scroller()
    .container(d3.select('#graphic'))
scroll()

let lastIndex, activeIndex = 0

scroll.on('active', function(index){
    d3.selectAll('.step')
        .transition().duration(500)
        .style('opacity', function (d, i) {return i === index ? 1 : 0.1;});
    
    activeIndex = index
    let sign = (activeIndex - lastIndex) < 0 ? -1 : 1; 
    let scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
    scrolledSections.forEach(i => {
        activationFunctions[i]();
    })
    lastIndex = activeIndex;

})

scroll.on('progress', function(index, progress){
    if (index == 2 & progress > 0.2){

    }
})