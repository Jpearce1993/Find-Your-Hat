// initalization of prompt variable for user interaction
const prompt = require('prompt-sync')({sigint: true});

// initializing variables for 
// field, player, and goal
const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

// user prompt to pick a field size to play on
console.log("Please pick a field size. 'Small', 'Medium', or 'Large': ");
let fieldSize = prompt();

// function implemented to randomize where the hat 
// appears at the end of the array, rather than
// always spawning in the final index of the array
function randomIntFromInterval(min, max) { 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// function that clears the screen
function wipe() {
    var lines = process.stdout.getWindowSize()[1];
    for(var i = 0; i < lines; i++) {
        console.log('\r\n');
    }
}

// Field class initialization
// takes in single field parameter
class Field {
    constructor(fieldSize){
        this._fieldSize = fieldSize.toLowerCase();
        this._field = [];
    }

    get fieldSize() {
        return this._fieldSize;
    }

    get field() {
        return this._field;
    }

    set field(newField) {
        this._field = newField;
    }

    // method to generate a random game field based
    // on user input with the place always starting at index 0
    // and the hat will be placed somewhere randomly 
    //in the bottom row of the field
    generateField(){
        // initializing field array with character starting point
        let field = [];
        let size = 0;
        let choice = this.fieldSize;

        // array built to hold obstacles randomly picked for the field
        // adding more fieldCharacters increases the chance of them 
        // being picked for the playing field
        let obstacles = [hole,fieldCharacter,fieldCharacter,fieldCharacter,fieldCharacter];

        // if statement for predetermined field sizes
        // having predetermined sizes makes outputting the field 
        // look better and feel more filled out
        if (choice === 'large'){
            size = 89;
        } else if (choice === 'medium') {
            size = 69;
        } else if (choice === 'small') {
            size = 49;
        } else {
            console.log("Please pick a size of either: 'Small', 'Medium', or 'Large'.");
            return process.exit(1);
        }

        // for loop that generates a random number between 0-4 and 
        // uses that number to pick an obstacle from the obstacles
        // array before adding it to the field array
        for (let x = 0; x < size; x++){
            if (x <= 9 && x >= 0){
                field.push('X');
            } else if (x <= size && x >= (size - 11)) {
                field.push('X');
            } else if ((x % 10) === 9) {
                field.push('X');
            } else if ((x % 10) === 0) {
                field.push('X');
            } else {
                field.push(obstacles[Math.floor(Math.random() * 5)]); 
            }
        } // end for loop

        // determining hat endpoint and player
        // starting position in array

        if (choice === 'large'){
            field.splice(randomIntFromInterval(71, 78), 0, hat);
            field.splice(11, 1, pathCharacter);
        } else if (choice === 'medium') {
            field.splice(randomIntFromInterval(51, 58), 0, hat);
            field.splice(11, 1, pathCharacter);
        } else if (choice === 'small') {
            field.splice(randomIntFromInterval(31, 38), 0, hat);
            field.splice(11, 1, pathCharacter);
        }
        

        // assigning newly generated field
        // to class field property
        this.field = field;
        
        // return the array holding the field
        return field;
    } // end generateField method

    // method to output a field 
    printField(){
        let count = 0;
        console.log();

        // for loop that prints the indices out
        // 10 at a time to create a equal sized field
        for(let x = 0; x < this.field.length; x++){
            process.stdout.write(this.field[x]);
            count++;
            
            if (count === 10) {
                console.log();
                count = 0;
            } // end if statement
        } // end for loop

        console.log();
    } // end printField method

    move(userInput){
        let move = userInput.toLowerCase();
        let x = 0;

        if (move === 'a') {
            // move left
            return -1; 
        } else if (move === 'd') { 
            // move right
            return 1;
        } else if (move === 's') {
            // move down
            return 10;
        } else if (move === 'w') {
            // move up
            return -10;
        } else {
            // invalid move
            console.log('Invalid move. Use (WASD) to move.');
            return 0;
        }
    }

    // method to check the path the player is on
    // if the index contains a hole, player loses
    // if the index contains the hat, player wins
    // if neither, game continues
    pathCheck(position) {
        if (this.field[position] === hole){
            console.log('\n*************************');
            console.log('\n   You fell in a hole!');
            console.log('\n       GAME OVER');
            console.log('\n*************************');
            this.printField();
            return process.exit(1);
        } else if (this.field[position] === hat){
            console.log('\n*************************');
            console.log('\n   You found the hat!');
            console.log('\n       GAME OVER');
            console.log('\n*************************');
            this.printField();
            return process.exit(1);
        }
    }

    rules(){
        console.log();
        console.log("**************************************");
        console.log();
        console.log("Controls: (W = Move Up)");
        console.log("          (A = Move Left)");    
        console.log("          (S = Move Down)");
        console.log("          (D = Move Right)");
        console.log("          (Ctrl + c = Exit)");
        console.log();
        console.log("Sprites:  (^ = Your Hat)");
        console.log("          (* = You)");
        console.log("          (X = Edge of field)");
        console.log("          (O = Hole (Game Over))");
        console.log("          (░ = Safe Path)");
        console.log();
        console.log("Goal: (Move * to the ^ to win!)");
        console.log("      (Avoid the holes in the ground)");
        console.log("      (Or it's a game over!)");
        console.log();
        console.log("**************************************");
        console.log();
    }

    play(){
        // initalizing player position
        // and temp to check player isn't
        // moving off the field
        let current = 11;
        let temp = 0;

        // printing field for player to start
        this.printField();

        // while loop that runs the game
        // until the player finds the hat
        // or falls into a hole 
        while (current < 9999) {
            // prompt user to move
            console.log('Which way? (WASD):');
            let movement = prompt();
            
            // remember current position in the array
            // and move to new position 
            // checks if new position is off the field
            temp = current + this.move(movement);

            // if statement to check if the player 
            // is moving off the field or not
            // also marks the index the player 
            // was previously on with fieldCharacter
            // for easier visibility
            if (this.field[temp] === 'X') {
                wipe();
                console.log('\n*************************');
                console.log('\nYou are leaving the field');
                console.log('\n*************************');
            } else {
                wipe();
                this.field[current] = fieldCharacter;
                current = current + this.move(movement);
            }

            // call pathCheck method to see if
            // the player has found the hat or a hole 
            this.pathCheck(current);

            // moves the player to the new index position
            this.field[current] = pathCharacter;

            // reprint the field with
            // the new positionings
            this.printField();
        }
    }
}

// run the full script
function main(){
    // initialize the new field class and 
    // create a random field based on the
    // user's fieldSize choice.
    const fieldTest = new Field(fieldSize);
    fieldTest.generateField();

    // ask the player if they want to see the rules
    console.log("\nWould you like to review how to play?(Y/N):");
    let rules = prompt();

    if (rules.toLowerCase() === 'y') {
        fieldTest.rules();
    } else if (rules.toLowerCase() === 'n') {
        console.log();
    } else {
        console.log('Invalid input. Please answer with (Y/N)');
        return process.exit(1);
    }
    
    // ask the player if they want to play
    console.log("\nWould you like to play?(Y/N):");
    let play = prompt();
    if (play.toLowerCase() === 'y') {
        // play the game
        fieldTest.play();
    } else if (play.toLowerCase() === 'n') {
        console.log("Maybe next time.");
        return process.exit(1);
    } else {
        console.log('Invalid input. Please answer with (Y/N)');
        return process.exit(1);
    }
}

main();