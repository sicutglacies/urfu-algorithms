const { stringify, decode } = require('querystring');

//node rle.js code/decode in.txt out.txt
function Read(infile){
	fs = require('fs');
	if (fs.existsSync(infile)) {
		var data = fs.readFileSync(infile);
		if (data.length == 0){
			console.log('File is empty!');
			process.exit();
		}
		console.log('Recieved:', data.toString());
		return data.toString();
	} else {
		console.log(infile + '\n' + 'File not found!');
		process.exit();
	}
}

function Write(outfile, data) {
	fs = require('fs');
	fs.writeFileSync(outfile, data);
	console.log('Transmitted:', data);
}

function IsDigit(element) {
	return /^\d+$/.test(element);
}

function Encode(data){
	let i = 0; 
	let nRep = 1; 
	let nNonRep = 1;
	let TempStr = "";
	let resStr = "";

	inpText = data.toString();
    inpLength = data.length;

	while (i < inpLength){
	    if (inpText.charAt(i) == inpText.charAt(i+1)){
	        nRep++;

	        if (nNonRep > 1){
	            resStr += String.fromCharCode(nNonRep+127) + TempStr;
	            TempStr = "";
	            nNonRep = 1;
	        }

	    } else {

	        if (nRep > 1){
	            if (nRep > 127){
	                let divQuotient = 0;

	                while (nRep > 127){
	                    nRep -= 127; 
	                    divQuotient++;
	                }

	                for (j = 0; j < divQuotient; j++){
	                    resStr += String.fromCharCode(127) + inpText.charAt(i);
	                }

	                resStr += String.fromCharCode(nRep) + inpText.charAt(i);
	                nRep = 1;

	            } else {
	                resStr += String.fromCharCode(nRep)+inpText.charAt(i);
	                nRep = 1;
	            }

	        } else {
	            nNonRep++; 
	            TempStr += inpText.charAt(i);
	        }
	    }

	    i++;
	}
	if (nNonRep > 1){
	    resStr += String.fromCharCode(nNonRep+127) + TempStr;
	}
	return resStr;
}


function Decode(data) {
	let resStr = "";
	let i = 0;
	inpText = data.toString();
    inpLength = data.length;

	while (i < inpLength){

        if (inpText.charCodeAt(i) <= 128){
       		let count = inpText.charCodeAt(i);

       		for (let j = 0; j < count; j++){
       			resStr += inpText.charAt(i+1);
       		}

       		i++;  

       	} else {
			let count = inpText.charCodeAt(i)-128;
			
        	for (let j = 0; j < count; j++){
        		resStr += inpText.charAt(i+1);
         		i++;
     		}
        }
        i++;
	}
    return resStr;
}

if (process.argv[2] == "decode") {
	//RLE decoding process
	var data = Read(process.argv[3]);
	data = Decode(data);
	Write(process.argv[4], data);
} else if (process.argv[2] == "code") {
	//RLE encoding process
	var data = Read(process.argv[3]);
	data = Encode(data);
	Write(process.argv[4], data);
} else {
	console.log("Wrong command!");
}