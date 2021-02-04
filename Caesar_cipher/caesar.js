const enAlphabet = 'abcdefghijklmnopqrstuvwxyz';
const enFrequency = [8.2, 1.5, 2.8, 4.3, 13, 2.2, 2, 6.1, 7, 0.15, 0.77, 4, 2.4, 6.7, 7.5, 1.9, 0.095, 6, 6.3, 9.1, 2.8, 0.98, 2.4, 0.15, 2, 0.074];
const ruAlphabet = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
const ruFrequency = [8.01, 1.59, 4.54, 1.7, 2.98, 8.45, 0.04, 0.94, 1.65, 7.35, 1.21, 3.49, 4.4, 3.21, 6.7, 10.97, 2.81, 4.73, 5.47, 6.26, 2.62, 0.26, 0.97, 0.48, 1.44, 0.73, 0.36, 0.04, 1.9, 1.74, 0.32, 0.64, 2.01];

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

function Write(outfile, data){
    fs = require('fs');
    fs.writeFileSync(outfile, data);
    console.log('Transmitted:', data);
}

function CountLettersFrequency(str, alphabet){
    let arr = new Array(alphabet.length).fill(0);
    for (let i = 0; i < str.length; i++){
        if (alphabet.indexOf(str[i]) > -1){
            arr[alphabet.indexOf(str[i])] += 1;
        }
    }
    let s = arr.reduce((a, b) => a + b, 0);
    for (let i = 0; i < arr.length; i++){
        arr[i] /= s;
        arr[i] *= 100;
    }
    return arr;
}

function CalcSquareDiff(freqs, theoryFreqs){
    let diff = 0;
    for (let i = 0; i < freqs.length; i++){
        diff += (theoryFreqs[i] - freqs[i]) ** 2;
    }
    return diff;
}

function Crack(str, alphabet, theoryFrequency){
    let tmp = '';
    let shifts = [];
    for (let i = 0; i < alphabet.length; i++){
        tmp = Code(alphabet, str, i);
        let freqs = CountLettersFrequency(tmp, alphabet);
        shifts.push(CalcSquareDiff(freqs, theoryFrequency));
    }
    let sh = shifts.indexOf(Math.min(...shifts));
    console.log('Probably shift is', (alphabet.length - sh) % alphabet.length);
    return sh;
}

function Code(alphabet, str, shift){
    str = str.toLowerCase();
    shift = Number(shift);
    let output = '';
    for (let i = 0; i < str.length; i++){
        if (alphabet.indexOf(str[i]) > -1){
            let pos = (alphabet.indexOf(str[i]) + shift) % alphabet.length;
            output += alphabet[pos];
        } else {
            output += str[i];
        }
    }
    return output;
}

if (process.argv[2] == 'code'){
    let str = Read(process.argv[3]);
    if (process.argv[6] == 'en'){
        Write(process.argv[4], Code(enAlphabet, str, process.argv[5]));
    } else if (process.argv[6] == 'ru'){
        Write(process.argv[4], Code(ruAlphabet, str, process.argv[5]));
    } else {
        console.log('No such language provided');
    }
} else if (process.argv[2] == 'decode'){
    let str = Read(process.argv[3]);
    if (process.argv[5] == 'en'){
        Write(process.argv[4], Code(enAlphabet, str, Crack(str, enAlphabet, enFrequency)));
    } else if (process.argv[5] == 'ru'){
        Write(process.argv[4], Code(ruAlphabet, str, Crack(str, ruAlphabet, ruFrequency)));
    } else {
        console.log('No such language provided');
    }
} else {
    console.log('No such command');
}

//node caesar.js code input.txt output.txt 6 en
//node caesar.js decode output.txt result.txt en