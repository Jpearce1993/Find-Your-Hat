// initalization of prompt variable for user interaction
const prompt = require('prompt-sync')({sigint: true});

// initializing variables for 
// field, player, and goal
const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

// function implemented to randomize where the hat 
// and player appear in the array
function randomIntFromInterval(min, max) { 
    return Math.floor(Math.random() * (max - min + 1) + min);
} // end randomIntFromInterval()

// function that clears the screen
function wipe() {
    var lines = process.stdout.getWindowSize()[1];
    for(var i = 0; i < lines; i++) {
        console.log('\r\n');
    } // end for loop
} // end wipe()

// Field class initialization
// takes in single field parameter
class Field {
    constructor(fieldSize){
        this._fieldSize = fieldSize.toLowerCase();
        this._field = this.generateField(fieldSize);
        this._moves = 0;
        this._fastest = 0;
        this._wins = 0;
        this._loses = 0;
        this._hardMode = false;
    }

    // getters for class properties
    get fieldSize() {
        return this._fieldSize;
    }

    get field() {
        return this._field;
    }

    get moves() {
        return this._moves;
    }

    get fastest() {
        return this._fastest;
    }

    get wins() {
        return this._wins;
    }

    get loses() {
        return this._loses;
    }
    
    get stats() {
        return [this._wins, this._loses];
    }

    get hardMode(){
        return this._hardMode;
    }

    // setters for class properties
    set field(newField) {
        this._field = newField;
    }

    set moves(newMove){
        this._moves = newMove;
    }

    set fastest(newFastest){
        this._fastest = newFastest;
    }

    set wins(newWin){
        this._wins = this._wins + newWin;
    }

    set loses(newLose){
        this._loses = this._loses + newLose;
    }

    set hardMode(newMode){
        this._hardMode = newMode;
    }

    fieldValidation(){
        return true;
    } // end fieldValidation()

    // method to generate a random game field based
    // on user input with the place always starting at index 0
    // and the hat will be placed somewhere randomly 
    //in the bottom row of the field
    generateField(fieldSize){
        // initializing field array 
        let field = [];
        let size = 0;
        let valid = false;

        // array built to hold obstacles randomly picked for the field
        // adding more fieldCharacters increases the chance of them 
        // being picked for the playing field
        let obstacles = [hole,fieldCharacter,fieldCharacter,fieldCharacter,fieldCharacter];

        // if statement for predetermined field sizes
        // having predetermined sizes makes outputting the field 
        // look better and feel more filled out
        if (fieldSize === 'large'){
            size = 89;
        } else if (fieldSize === 'medium') {
            size = 69;
        } else if (fieldSize === 'small') {
            size = 49;
        } else {
            console.log("Please pick a size of either: 'Small', 'Medium', or 'Large'.");
            return process.exit(1);
        } // end if statment

        // while loop to check validity of the newly 
        // generated field and creates a new field if
        // it is not able to be completed by the player
        while (valid === false){
            // for loop that generates a random number between 0-4 and 
            // uses that number to pick an obstacle from the obstacles
            // array before adding it to the field array and creates the
            // border around the entire field
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
                } // end if statement
            } // end for loop

            // determining randomized hat endpoints and
            // player starting positions in array
            if (fieldSize === 'large'){
                field.splice(randomIntFromInterval(71, 78), 0, hat);
            } else if (fieldSize === 'medium') {
                field.splice(randomIntFromInterval(51, 58), 0, hat);    
            } else if (fieldSize === 'small') {
                field.splice(randomIntFromInterval(31, 38), 0, hat);
            } // end if statement

            // place the player at a randomized position
            // at the top of the field
            field.splice(randomIntFromInterval(11, 18), 1, pathCharacter);
            
            // if statement to check validity of 
            // the randomized field
            if (this.fieldValidation(field)) {
                valid = true;
            } // end if statement
        } // end while loop

        // assigning newly generated field
        // to class field property
        this.field = field;
        
        // return the array holding the field
        return field;
    } // end generateField method

    // method created to determine player
    // starting position after it is randomized 
    playerStartPos(){
        for (let x = 0; x < this.field.length; x++){
            if (this.field[x] === '*'){
                return x;
            } // end if statement
        }; // end for loop
    } // end playerStartPos()

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
    } // end printField()

    // method used to determine what direction
    // the player is moving in
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
        } // end if statement
    } // end move()

    // method to increase move count by 1
    addMoves(increase){
        this.moves = this.moves + increase;
    } // end addMoves()

    // method to check and keep track of
    // the fastest game the player has had
    checkFastest() {
        if (this.fastest === 0){
            this.fastest = this.moves;
        } else {
            if (this.moves < this.fastest){
                this.fastest = this.moves;
                console.log('This was your fastest game yet!');
            } // end if statement
        } // end if statement
    } // end checkFastest()

    // method to check the path the player is on
    // if the index contains a hole, player loses
    // if the index contains the hat, player wins
    // if neither, game continues
    pathCheck(position) {
        if (this.field[position] === hole){
            this.printField();
            this.loses = 1;
            console.log('\n*************************');
            console.log('\n   You fell in a hole!');
            console.log('\n       GAME OVER');
            console.log('\n*************************\n');
            return true;
        } else if (this.field[position] === hat){
            this.printField();
            this.wins = 1;
            this.checkFastest();
            console.log('\n*************************');
            console.log('\n   You found the hat!');
            console.log('\n    You found it in:');
            console.log(`\n       ${this.moves} moves`);
            console.log('\n       GAME OVER');
            console.log('\n*************************\n');
            return true; 
        } else {
            return false;
        } // end if statement
    } // end pathCheck()
    
    // method to increase the difficulty of the game
    // by adding a new hole to the field everytime the
    // player moves the * sprite
    increaseDifficulty() {
        // switch variable for the while loop
        let searching = true;

        // if statement to check if the player
        // selected hard mode or not
        if (this.hardMode === false){
            console.log();
        } else if (this.hardMode === true){
            
            // while loop to continue looking for
            // a fieldCharacter to replace with a hole
            while (searching === true){
                //initializing the random roll
                let rand = Math.floor(Math.random() * this.field.length);

                // if statement to reroll if the field index
                // is not a fieldCharacter and a rewrite of 
                // the field if the index is a fieldCharacter
                if (this.field[rand] !== fieldCharacter){
                    rand = Math.floor(Math.random() * this.field.length);
                } else if (this.field[rand] === fieldCharacter){
                    this.field[rand] = hole;
                    searching = false;
                } // end if statement
            } // end while loop
        } // end if statement 
    } // end increaseDifficulty()


    // method used to output the rules, controls,
    // and sprites used in the game  
    rules(){
        console.log("\n*************************************************************\n");
        console.log("Controls:");
        console.log("         (W = Move Up)");
        console.log("         (A = Move Left)");    
        console.log("         (S = Move Down)");
        console.log("         (D = Move Right)");
        console.log("         (Ctrl + c = Exit)\n");
        console.log("Sprites:");
        console.log("        (^ = Your Hat)");
        console.log("        (* = You)");
        console.log("        (X = Edge of field)");
        console.log("        (O = Hole (Game Over))");
        console.log("        (░ = Safe Path)\n");
        console.log("Goal:");
        console.log("     (Move * to the ^ to win!)");
        console.log("     (Avoid the holes in the ground)");
        console.log("     (Or it's a game over!)\n");
        console.log("Game Modes:");
        console.log("          (Normal: Field doesn't change during game)");
        console.log("          (Hard: Field adds more holes when player moves)\n");
        console.log("*************************************************************\n");
    } // end rules()

    // method used to play the game
    play(){
        // initalizing player position
        // and temp to check player isn't
        // moving off the field
        let current = this.playerStartPos();
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
                console.log('\n*************************\n');
            } else {
                wipe();
                this.field[current] = fieldCharacter;
                current = current + this.move(movement);
                this.addMoves(1);
                this.increaseDifficulty();
            } // end if statement

            // call pathCheck method to see if
            // the player has found the hat or a hole 
            if (this.pathCheck(current) === true){
                break;
            } else if (this.pathCheck(current) === false){
                // moves the player to the new index position
                this.field[current] = pathCharacter;

                // reprint the field with
                // the new positionings
                this.printField();
            } // end if statement
        } // end while loop
        // return true to show game is over
        return true;
    } // end play()

    // method to validate user choice for field size
    fieldType(){
        // variable initialization for while loops
        let validate = false;

        // user prompt to pick a field size to play on
        console.log("\nPlease pick a field size. 'Small', 'Medium', or 'Large': ");
        let choice = prompt();

        // while loop to check validity of input
        while (validate === false){
            if (choice.toLowerCase() === 'small' || 
            choice.toLowerCase() === 'medium' || choice.toLowerCase() === 'large' ){
                validate = true;
            } else {
                console.log("\nPlease choose 'small', 'medium', or 'large': ")
                choice = prompt();
            } // end if statement
        } // end while loop
        return choice;
    } // end fieldType()

    // method to validate user choice for game mode
    gameMode() {
        // variable initialization for while loops
        let validate = false;

        // user prompt to pick a game mode to play on
        console.log("\nPlease pick a game mode. 'Normal' / 'Hard': ");
        let choice = prompt();

        // while loop to check validity of input
        // and which game mode is chosen
        while (validate === false){
            if (choice.toLowerCase() === 'normal' || 
            choice.toLowerCase() === 'hard'){
                if(choice.toLowerCase() === 'normal' ){
                    this.hardMode = false;
                } else if (choice.toLowerCase() === 'hard'){
                    this.hardMode = true;
                }
                validate = true;
            } else {
                console.log("\nPlease choose 'Normal' or 'Hard': ");
                choice = prompt()
            } // end if statement
        } // end while loop
    } // end gameMode()

    // welcome method that welcomes the user
    // and creates a newly generated field
    // based on user interaction.
    // Also offers to display rules and asks
    // if the user wants to play a game
    welcome(){
        console.log('\n*****************************\n');
        console.log('  Welcome to Find Your Hat!');
        console.log('\n*****************************\n');

        // initialize validate variable for while loops
        let validate = false;

        // ask the player if they want to see the rules
        console.log("\nWould you like to review how to play?(Y/N):");
        let rules = prompt();

        // while loop to validate user input if user wants
        // to see rules or not
        while (validate === false){
            if (rules.toLowerCase() === 'y') {
                // displays game rules
                this.rules();
                validate = true;
            } else if (rules.toLowerCase() === 'n') {
                // moves on if player doesn't want to see rules
                validate = true;
            } else {
                console.log('\nInvalid input. Please answer with (Y/N)');
                rules = prompt();
            } // end if statement
        } // end while loop

        // reset validate for next loop
        validate = false;

        // ask the player if they want to play
        console.log("\nWould you like to play?(Y/N):");
        let play = prompt();

        // while loop to validate user input if player
        // wants to start a game or not
        while (validate === false){
            if (play.toLowerCase() === 'y') {

                // determining fieldsize and gamemode
                let fieldSize = this.fieldType();
                this.gameMode();

                // overwrites the intialized 'small' 
                // field with users choice
                this.generateField(fieldSize);

                // play the game
                this.play();
                break;
            } else if (play.toLowerCase() === 'n') {
                console.log("Maybe next time.");
                return process.exit(1);
            } else {
                console.log('\nInvalid input. Please try again with (Y/N)');
                play = prompt();
            } // end if statement
        } // end while loop
    } // end welcome()

    // method to format and print
    // the stats of the player's games
    printStats() {
        console.log('\n*******************************\n');
        console.log(`         Win/Loss: ${this.wins}/${this.loses}\n`);
        if (this.fastest > 0){
            console.log(`Your fastest win was in ${this.fastest} moves\n`);
        }
        console.log('      Thanks for playing!\n');
        console.log('\n*******************************\n');
    } // end printStats()
} // end Field Class

// run the full script
function main(){
    // initialize a new field class with 'small'
    // which will be replaced when the user 
    // inputs their first fieldSize choice
    const fieldTest = new Field('small');
    let playing = true;
    let validate = false;
    // welcomes the user to Find Your Hat
    fieldTest.welcome();

    // user prompt for the first replay
    console.log('Would you like to play again?(Y/N):');
    let replay = prompt();

    while (!validate){
        if (replay.toLowerCase() === 'y'){
            playing = true;
            validate = true;
        } else if (replay.toLowerCase() === 'n'){
            playing = false;
            validate = true;
        } else {
            console.log('Please enter (Y/N):');
            replay = prompt();
        } // end if statement
    } // end while loop

    // while loop to replay the game
    // this allows for the win/lose stats
    // to accumulate for the player
    while (playing) {
        validate = false;

        // calling methods to determine new field
        let fieldSize = fieldTest.fieldType();
        fieldTest.gameMode();

        // reset move counter
        fieldTest.moves = 0;

        // generate new field
        fieldTest.generateField(fieldSize);

        // play new game
        fieldTest.play();

        // prompt user to play again
        console.log('Would you like to play again?(Y/N):');
        replay = prompt();

        while (!validate){
            if (replay.toLowerCase() === 'y'){
                playing = true;
                validate = true;
            } else if (replay.toLowerCase() === 'n'){
                playing = false;
                validate = true;
            } else {
                console.log('Please enter (Y/N):');
                replay = prompt();
            } // end if statement
        } // end while loop
    } // end while loop

    // print out stats of all games
    fieldTest.printStats();
} // end main

// calls main script function
main();
