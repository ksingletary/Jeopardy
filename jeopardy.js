// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

let categories = [];
const $pageBod = $('body');

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */
// Math.floor(Math.random() * (30 - 25 + 1) + 25)

async function getCategoryIds() {
    let idArr = [];

    const res = await axios.get('http://jservice.io/api/categories', {
        params: {
            count: 54,
            offset: Math.floor(Math.random() * (10000 - 25 + 1) + 25)
        }   
    })
    for (let obj of res.data){
        if (obj.clues_count > 5){
            idArr.push(obj.id);
        }
    }
    return idArr;
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catId) {
    let dataObj = {};

    const res = await axios.get('http://jservice.io/api/category', {
        params: {
            id: catId
        }   
    })
    for (let obj of res.data.clues){            //removing data we dont need
        delete obj['id'];
        delete obj['airdate'];
        delete obj['category_id'];
        delete obj['game_id'];
        delete obj['invalid_count'];
        delete obj['value'];
        obj['showing'] = null;
    }
    
    dataObj['title'] = res.data.title;
    dataObj['clues'] = [res.data.clues.slice(0, 5)];

    return dataObj;
}


async function fillCategoriesArr(){
    const ids = await getCategoryIds();  //array of ids
    for (let id in ids){
        const idObj = await getCategory(ids[id]);
        categories.push(idObj)
    }
    
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 * array[Math.floor(Math.random() * array.length)]
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {
    await fillCategoriesArr();
    // console.log(categories);
    // console.log(categories[0].clues[0]);    

    const width = 5;
    const height = 4; //change variable names for cleaner code

    const $table = $('<table>');
    $table.attr('id', 'jeopardy');
    const $thead = $('<tr>');
    for (let x = 0; x <= width; x++) {
        const $thdata = $('<th>');
        console.log(categories[x])
        $thdata.text(Object.values(categories[x])[0]);
        $thead.prepend($thdata);
        $table.prepend($thead);
      }
      
    for (let y = 0; y <= height; y++) {
        const $tbody = $('<tr>');
  
        for (let z = 0; z <= width; z++) {
            const tdata = document.createElement('td');
            tdata.setAttribute('data-question', Object.values(categories[z].clues[0][y])[1] )
            tdata.setAttribute('data-answer', Object.values(categories[z].clues[0][y])[0] )
            tdata.setAttribute('showing', Object.values(categories[z].clues[0][y])[2] )
            // $tdata.attr('value', Object.values(categories[z].clues[0][y])[1] );
            // $tdata.text(Object.values(categories[z].clues[0][y])[1]); //some dont have clues?
            // console.log(tdata)
            tdata.textContent = '?';  
            $tbody.prepend(tdata);
        }
        $table.append($tbody);
    }
    $pageBod.append($table); 
}
fillTable();

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

$(document).on('click', 'td', function handleClick() {
    this.innerHTML = '';
    const textDisplay = document.createElement('div')
    textDisplay.classList.add('card-text');    
    console.log(this);

    if(textDisplay.getAttribute('showing') === null) {
        textDisplay.innerHTML = this.getAttribute('data-question');
        this.append(textDisplay);
        this.setAttribute('showing', "question");
    } 
    this.addEventListener('click', function(){
        if (this.getAttribute('showing') === "question") {
            this.innerHTML = '';
            this.innerHTML = this.getAttribute('data-answer');
            this.setAttribute('showing', "answer");
        } else {
            return;
        }
    })    
})
const btn = $('<button>');
$pageBod.append(btn);
btn.attr('id', 'btn');
btn.text('Restart');

btn.on('click', function(){
    window.location.reload();
})
/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
}

/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO