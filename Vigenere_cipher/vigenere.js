const enAlphabet = 'abcdefghijklmnopqrstuvwxyz';
const enFrequency = [8.2, 1.5, 2.8, 4.3, 13, 2.2, 2, 6.1, 7, 0.15, 0.77, 4, 2.4, 6.7, 7.5, 1.9, 0.095, 6, 6.3, 9.1, 2.8, 0.98, 2.4, 0.15, 2, 0.074];
const ruAlphabet = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
const ruFrequency = [8.01, 1.59, 4.54, 1.7, 2.98, 8.45, 0.04, 0.94, 1.65, 7.35, 1.21, 3.49, 4.4, 3.21, 6.7, 10.97, 2.81, 4.73, 5.47, 6.26, 2.62, 0.26, 0.97, 0.48, 1.44, 0.73, 0.36, 0.04, 1.9, 1.74, 0.32, 0.64, 2.01];
const maxKeyLength = 20;

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

function Preprocess(txt, alphabet){
    let prep = '';
    for (let i = 0; i < txt.length; i++){
        if (alphabet.includes(txt[i])){
            prep += txt[i];
        }
    }
    return prep;
}

function ShiftPat(str, shift, alphabet){
    let n = alphabet.length;
    str = str.split('');
    for (let i = 0; i < str.length; i++){
        str[i] = alphabet[(((alphabet.indexOf(str[i])-shift) % n)+n)%n];
    }
    str = str.join('');
    return str;
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

function CountLetters(txt, alphabet){
    let counts = new Array(alphabet.length).fill(0);
    for (let i = 0; i < txt.length; i++){
        if (alphabet.indexOf(txt[i]) > -1){
            counts[alphabet.indexOf(txt[i])]++;
        }
    }
    return counts;
}

function IndexOfCoincidence(str, alphabet){
    let counts = CountLetters(str, alphabet);
    let total = 0;
    let sum = 0;

    for (let i = 0; i < alphabet.length; i++){
        sum += counts[i]*(counts[i]-1);
        total += counts[i];
    }
    return sum / ((total * (total-1)) / alphabet.length);
}

function GuessKeyLength(txt, alphabet){
    txt = Preprocess(txt, alphabet);
    let icTable = new Array();
    for (let i = 0; i < maxKeyLength; i++){
        let icSum = 0;
        let avgIc = 0;
        for (let j = 0; j < i; j++){
            let seq = '';
            for (let k = 0; k < txt.length-i; k += i){
                seq += txt[j+k];
            }
            icSum += IndexOfCoincidence(seq, alphabet);
        }
        if (i != 0){
            avgIc = icSum/i;
        }
        icTable.push(avgIc);
    }

    const arrayCopy = [...icTable];
    let bestGuess = icTable.indexOf(arrayCopy.sort()[arrayCopy.length - 1]);
    let secondGuess = icTable.indexOf(arrayCopy.sort()[arrayCopy.length - 2]);

    //console.log('best guess', bestGuess);
    //console.log('second guess', secondGuess);

    if (bestGuess % secondGuess == 0){
        return secondGuess;
    } else {
        return bestGuess;
    }
}

function FreqAnalysis(seq, freqs, alphabet){
    let squares = new Array(freqs.length).fill(0);
    for (let i = 0; i < freqs.length; i++){
        let acFreqs = CountLettersFrequency(ShiftPat(seq, i, alphabet), alphabet);
        squares[i] = CalcSquareDiff(acFreqs, freqs);
    }
    shift = squares.indexOf(Math.min(...squares))
    return alphabet[shift];
}

function FindKey(txt, keyLength, freqs, alphabet){
    txt = Preprocess(txt, alphabet);
    let key = '';
    for (let i = 0; i < keyLength; i++){
        let seq = '';
        for (let j = 0; j < txt.length-i; j += keyLength){
            seq += txt[i+j];
        }
        key += FreqAnalysis(seq, freqs, alphabet);
    }
    return key;
}

function Encrypt(txt, key, alphabet){
    let encoded = '';
    key = key.toLowerCase();
    txt = txt.toLowerCase();
    let i = 0;
    let j = 0;
    while (i < txt.length){
        if (alphabet.indexOf(txt[i]) > -1){
            encoded += alphabet[(alphabet.indexOf(txt[i]) + alphabet.indexOf(key[j%key.length])) % alphabet.length];
            j++;
        } else {
            encoded += txt[i];
        }
        i++;
    }
    return encoded;
}

function Decrypt(txt, key, alphabet){
    let decoded = '';
    let n = alphabet.length;
    let i = 0;
    let j = 0;
    while (i < txt.length){
        if (alphabet.indexOf(txt[i]) > -1){
            decoded += alphabet[(((alphabet.indexOf(txt[i]) - alphabet.indexOf(key[j%key.length])) % n)+n)%n];
            j++;
        } else {
            decoded += txt[i];
        }
        i++;
    }
    return decoded;
}

if (process.argv[2] == 'code'){
    let str = Read(process.argv[3]);
    if (process.argv[6] == 'en'){
        Write(process.argv[4], Encrypt(str, process.argv[5], enAlphabet));
    } else if (process.argv[6] == 'ru'){
        Write(process.argv[4], Encrypt(str, process.argv[5], ruAlphabet));
    } else {
        console.log('No such language provided');
    }
} else if (process.argv[2] == 'decode'){
    let str = Read(process.argv[3]);
    console.log(str);
    if (process.argv[5] == 'en'){
        let keyLength = GuessKeyLength(str, enAlphabet);
        console.log('Probably the key length is', keyLength);
        let key = FindKey(str, keyLength, enFrequency, enAlphabet);
        console.log('Probably the key is', key);
        let txt = Decrypt(str, key, enAlphabet);
        Write(process.argv[4], txt);
    } else if (process.argv[5] == 'ru'){
        let keyLength = GuessKeyLength(str, ruAlphabet);
        console.log('Probably the key length is', keyLength);
        let key = FindKey(str, keyLength, ruFrequency, ruAlphabet);
        console.log('Probably the key is', key);
        let txt = Decrypt(str, key, ruAlphabet);
        Write(process.argv[4], txt);
    } else {
        console.log('No such language provided');
    }
} else {
    console.log('No such command');
}

// node vigenere.js code in.txt out.txt keyword en
// node vigenere.js decode out.txt result.txt en