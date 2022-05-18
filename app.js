const fs = require('fs');
const model = require('./model.js');
const prompt = require('prompt');

prompt.start()


const studentArray = tryToLoadData()

console.log('benvenuti nel sito della scuola!')

startMenu();

function startMenu() {

    console.log('Sono disponibili 5 opzioni:');
    console.log('1) Visualizza studenti');
    console.log('2) Inserisci studente');
    console.log('3) Cerca studente');
    console.log('4) Elimina studente');
    console.log('5) Esci');
    console.log('6) modifica');



    const schema = {
        properties: {
            selection: {
                description: 'seleziona una delle opzioni'
            }
        }
    }

    prompt.get(schema, startMenuDone);
}

function startMenuDone(err, res) {
    switch (res.selection) {
        case '1':
            visulizeStudents(studentArray)
            startMenu()
            break;
        case '2':
            insertStudent()
            break;
        case '3':
            searchStudent()
            break;
        case '4':
            removeStudent()
            break;
        case '5':
            console.log('ciao ciao')
            process.exit();
        case '6':
            modifyStudent()
            break;
        default:
            console.log('opzione non valida');
            startMenu();
            break;
    }
}

function insertStudent() {

    const schema = {
        properties: {
            name: {
                description: 'inserisci il nome'
            },
            surname: {
                description: 'inserire il cognome'
            },
            gender: {
                description: 'inserire il genere ("m" => maschile, "f" => femminile, "n" => non definito)'
            },
            yob: {
                description: 'inserire l\'anno di nascita'
            }
        }
    }

    prompt.get(schema, insertStudentDone);

}

function insertStudentDone(err, res) {
    let gender;
    if (res.gender === 'm') {
        gender = model.Student.GENDER.male;
    } else if (res.gender === 'f') {
        gender = model.Student.GENDER.female;
    } else {
        gender = model.Student.GENDER.undefined;
    }

    const student = new model.Student(res.name, res.surname, gender, parseInt(res.yob));

    studentArray.push(student);

    tryToSaveData()

    startMenu();
}

function searchStudent() {
    schema = {
        properties: {
            searchWord: {
                description: ' inserisci la carola da cercare'
            }
        }
    }
    prompt.get(schema, executeSearch);

}

function executeSearch(err, res) {
    const tempArray = [];
    for (const student of studentArray) {
        const foundInName = student.name.toLowerCase().includes(res.searchWord.toLowerCase())
        const foundInSurname = student.surname.toLowerCase().includes(res.searchWord.toLowerCase())
        if (foundInName || foundInSurname) {
            tempArray.push(student);
        }
    }
    visulizeStudents(tempArray);
    startMenu()
}



function removeStudent() {
    console.log("ecco gli studenti attualmente registrati");
    visulizeStudents(studentArray)

    const schema = {
        properties: {
            selectionIndex: {
                description: ' inserisci il numero dello studente da eleiminare '
            }
        }
    }
    prompt.get(schema, executeRemoveStudent)
}


function executeRemoveStudent(err, res) {
    const humanIndex = parseInt(res.selectionIndex);

    if (humanIndex === NaN) {
        startMenu()
        return;
    }

    const index = humanIndex - 1;

    const isInArray = index >= 0 && index < studentArray.length;
    if (isInArray) {
        studentArray.splice(index, 1);
        tryToSaveData()
    } else {
        console.log('indice non trovato');
        startMenu()
        return;
    }

}

function visulizeStudents(arrayToVisulize) {
    for (let i = 0; i < arrayToVisulize.length; i++) {
        const Student = arrayToVisulize[i];
        const humanIndex = i + 1
        console.log(humanIndex + ' ) ' + Student.toString()); // da finire 
        console.log('------------------------'); // da finire
    }
    //   for (const student of studentArray) {
    //     console.log(student.toString());
    //     console.log('------------------------')
    //   }


}


function tryToLoadData() {

    let array;

    try {
        const jsonArray = fs.readFileSync('./student-data.json', 'utf8');
        array = JSON.parse(jsonArray)
    } catch (err) {
        array = [];
    }

    const studentArray = []

    for (const obj of array) {
        const student = model.Student.createStudentWithObject(obj)
        studentArray.push(student);
    }

    return studentArray;

}

function tryToSaveData() {

    const jsonArray = JSON.stringify(studentArray);

    try {
        fs.writeFileSync('./student-data.json', jsonArray);
    } catch (error) {
        console.log('errore nel salvataggio');
    }

}

function modifyStudent() {
    console.log("ecco gli studenti attualmente registrati");
    visulizeStudents(studentArray)

    const schema = {
        properties: {
            selectionIndex: {
                description: ' inserisci il numero dello studente da modificare '
            },
            name: {
                description: 'inserisci il nome'
            },
            surname: {
                description: 'inserire il cognome'
            },
            gender: {
                description: 'inserire il genere ("m" => maschile, "f" => femminile, "n" => non definito)'
            },
            yob: {
                description: 'inserire l\'anno di nascita'
            }
        }

    }
    prompt.get(schema, executeModifyStudent)

}

function executeModifyStudent(err, res) {
    const humanIndex = parseInt(res.selectionIndex);
    if (humanIndex === NaN) {
        startMenu()
        return;
    }
    const index = humanIndex - 1;
    const isInArray = index >= 0 && index < studentArray.length;
    if (isInArray) {
        let gender;
    if (res.gender === 'm') {
        gender = model.Student.GENDER.male;
    } else if (res.gender === 'f') {
        gender = model.Student.GENDER.female;
    } else {
        gender = model.Student.GENDER.undefined;
    }

    const student = new model.Student(res.name, res.surname, gender, parseInt(res.yob));
        studentArray[index] = student
        tryToSaveData()

    } else {
        console.log('indice non trovato');
        startMenu()
        return;
    }
}

