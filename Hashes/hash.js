function Read(infile){
	fs = require('fs');
	if (fs.existsSync(infile)){
		var data = fs.readFileSync(infile);
		if (data.length == 0){
			console.log('File is empty!');
			process.exit();
		}
		data = data.toString();
		console.log('String recieved');
		return data;
	} else {
		console.log(infile + '\n' + 'File not found!');
		process.exit();
	}
}

class Hash{
    constructor(txt, wordLength){
        this.text = txt;
        this.hash = 0;
        this.sizeWord = wordLength;
        for (let i = 0; i < this.sizeWord; i++){
            this.hash += (this.text.charCodeAt(i) - 'a'.charCodeAt(0) + 1)*(26**(this.sizeWord-i-1));
        }
        this.windowStart = 0;
        this.windowEnd = this.sizeWord;
    }

    moveWindow(){
        if (this.windowEnd <= this.text.length - 1){
            this.hash -= (this.text.charCodeAt(this.windowStart) - 'a'.charCodeAt(0)+1)*26**(this.sizeWord-1);
            this.hash *= 26;
            this.hash += this.text.charCodeAt(this.windowEnd) - 'a'.charCodeAt(0) + 1;
            this.windowStart += 1;
            this.windowEnd +=1; 
        }
    }

    windowText(){
        return this.text.slice(this.windowStart, this.windowEnd);
    }
}

function BruteForce(str, sub, args){
    let N = str.length;
    let M = sub.length;
    let total = 0;

    for (let i = 0; i < N - M + 1; i++){
        let j = 0;
        while (j < M){
            if (str[i+j] != sub[j]){
                break;
            }
            j += 1;
        }
        if (j == M){
            if (args['-n'] && total < args['N']){
                console.log('Found occurence at index', i);
                total++;
            } else if (!args['-n']){
                console.log('Found occurence at index', i);
                total++;
            }  else {
                break;
            }
        }
    }
    console.log('Total occurences:', total);
}

function HashesSum(str, sub, power, args){
    let M = str.length;
    let N = sub.length;
    let collisionCounter = 0;
    let total = 0;
    let subHashSum = 0;
    let strHashSum = 0;

    for (let i = 0; i < N; i++){
        subHashSum += sub.charCodeAt(i) ** power;
        strHashSum += str.charCodeAt(i) ** power;
    }

    for (let i = 1; i < M - N; i++){
        if (subHashSum == strHashSum){
            if (str.slice(i-1, i+N-1) == sub){
                if (args['-n'] && total < args['N']){
                    console.log('Found occurence at index', i-1);
                    total++;
                } else if (!args['-n']){
                    console.log('Found occurence at index', i-1);
                    total++;
                }  else {
                    break;
                }
            } else {
                collisionCounter += 1;
            }
        }
        let firstHash = str.charCodeAt(i-1) ** power;
        strHashSum += str.charCodeAt(i+N-1) ** power - firstHash;
    }
    if (args['-c']){
        console.log('Total collisions', collisionCounter);
    }
    console.log('Total occurences', total);
}

function RabinKarp(args, str, sub){
    const N = str.length;
    const M = sub.length;
    let total = 0;
    let collisionCounter = 0;
    strHash = new Hash(str, M);
    subHash = new Hash(sub, M);

    for (let i = 0; i < N-M+1; i++){
        if (strHash.hash == subHash.hash){
            if (strHash.windowText() == sub){
                if (args['-n'] && total < args['N']){
                    console.log('Found occurence at index', i);
                    total++;
                } else if (!args['-n']){
                    console.log('Found occurence at index', i);
                    total++;
                }  else {
                    break;
                }
            } else {
                collisionCounter += 1;
            }
        }
        strHash.moveWindow();
    }
    
    if (args['-c']){
        console.log('Total collisions', collisionCounter);
    }
    console.log('Total occurences', total);
}

let position = 0;
let arguments = process.argv.length;
let args = {};

args['b'] = false;
args['h1'] = false;
args['h2'] = false;
args['h3'] = false;
args['-t'] = false;
args['-n'] = false;
args['N'] = false;
args['-c'] = false;



while (arguments >= position){
    if (process.argv[position] == 'b'){
        args['b'] = true;
    } else if (process.argv[position] == '-t'){
        args['-t'] = true;
    } else if (process.argv[position] == '-n'){
        args['-n'] = true;
        args['N'] = process.argv[position+1];
    } else if (process.argv[position] == '-c'){
        args['-c'] = true;
    } else if (process.argv[position] == 'h1'){
        args['h1'] = true;
    } else if (process.argv[position] == 'h2'){
        args['h2'] = true;
    } else if (process.argv[position] == 'h3'){
        args['h3'] = true;
    }
    position += 1;
}

let string = Read(process.argv[arguments-2]);
let substring = Read(process.argv[arguments-1]);

if (string.length < substring.length){
    console.log('substring > string');
    process.exit();
}

if (args['b']){
    console.log('Using bruteforce algorithm');
    if (args['-t']){
        console.time();
        BruteForce(string, substring, args);
        console.timeEnd();
    } else {
        BruteForce(string, substring, args);
    }
} else if (args['h1']){
    console.log('Using hash sum algorithm with power of 1');
    if (args['-t']){
        console.time();
        HashesSum(string, substring, 1, args);
        console.timeEnd();
    } else {
        HashesSum(string, substring, 1, args);
    }
} else if (args['h2']){
    console.log('Using hash sum algorithm with power of 2');
    if (args['-t']){
        console.time();
        HashesSum(string, substring, 2, args);
        console.timeEnd();
    } else {
        HashesSum(string, substring, 2, args);
    }
} else if (args['h3']){
    console.log('Using Rabin-Karp algorithm');
    if (args['-t']){
        console.time();
        RabinKarp(args, string, substring);
        console.timeEnd();
    } else {
        RabinKarp(args, string, substring);
    }
}

