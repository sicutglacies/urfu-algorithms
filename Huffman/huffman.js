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

function ReadJSON(jsonfile){
    const fs = require('fs')
    let table = fs.readFileSync(jsonfile, (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err)
            return
        }  
    });
    table = JSON.parse(table);
    console.log('Weights are loaded');
    console.log(table);
    return table;
}

function GetMaxValueLen(table){
    let maxLen = 0;
    for (const property in table) {
        if (table[property].length > maxLen){
            maxLen = table[property].length
        }
    }
    return maxLen; 
}

function Write(outfile, data){
    fs = require('fs');
    fs.writeFileSync(outfile, data);
    console.log('Transmitted:', data);
}

function GetKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

function CountFrequency(str){
    const set = {};
    const freqs = str.split('').forEach(symbol => (set[symbol] ? set[symbol]++ : (set[symbol] = 1)));
    return set;
}

function SortFreq(freqs){
    var tuples = [];
    for(var elem in freqs){
        tuples.push([freqs[elem], elem]);
    }
    return tuples.sort(function(a,b){
        return a[0]-b[0]
    });
}

function BuildTree(tuples){  
    while(tuples.length > 1){  
        leastTwo = [tuples[0][1], tuples[1][1]];  
        //console.log(leastTwo);  
        theRest = tuples.slice(2, tuples.length);  
        //console.log(theRest);  
        combFreq = tuples[0][0] + tuples[1][0];  
        //console.log(combFreq);  
        tuples = theRest;  
        end = [combFreq, leastTwo];  
        tuples.push(end);  
        //console.log(tuples);  
        tuples.sort();  
        //console.log(tuples);  
    }  
    return tuples[0][1];  
}  

function AssignCode(node, pattern){
    if (typeof(node) == typeof("")){  
        codes[node] = pattern;
    } else {  
        AssignCode(node[0], pattern + '1');  
        AssignCode(node[1], pattern + '0');  
    }
}

function Encode(codes, str){  
    let output = '';  
    for(s in str)  
        output += codes[str[s]];  
    return output;  
}    

function Decode (codes, str){
    let output = "";
    let tmp = "";
    let maxCodeLen = GetMaxValueLen(codes);
    for (bit of str){
        tmp += bit;
        if (tmp.length <= maxCodeLen){
            if (Object.values(codes).indexOf(tmp) > -1){
                output += GetKeyByValue(codes, tmp);
                tmp = "";
            }
        } else {
            console.log('An error occured while decoding the message');
            return output;
        }
    }
    return output;
}

var codes = {}
var pattern = '';

if (process.argv[2] == "encode"){
    let data = Read(process.argv[3]);
    let tree = BuildTree(SortFreq(CountFrequency(data)));
    AssignCode(tree, pattern);
    console.log('Codes assigned:', codes);
    data = Encode(codes, data);
    table = JSON.stringify(codes);
    const fs = require('fs');
    fs.writeFile(process.argv[4], table, (err) => {
        if (err) {
            throw err;
        }
    });
    console.log('Saved weights to', process.argv[4]);
    Write(process.argv[5], data);
} else if (process.argv[2] == "decode"){
    let data = Read(process.argv[3]);
    let table = ReadJSON(process.argv[4]);
    data = Decode(table, data);
    Write(process.argv[5], data);
} else {
    console.log("Wrong command!");
}

//node huffman.js encode in.txt table.json out.txt
//node huffman.js decode out.txt table.json result.txt