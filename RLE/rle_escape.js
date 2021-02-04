const { stringify } = require('querystring');

//node rle.js code/decode in.txt out.txt
function Read(infile){
	fs = require('fs');
	if (fs.existsSync(infile)) {
		let data = fs.readFileSync(infile);
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

function Write(outfile, data){
	fs = require('fs');
	fs.writeFileSync(outfile, data);
	console.log('Transmitted:', data);
}

function IsDigit(element){
	return /^\d+$/.test(element);
}

function Encode(data){
	let encoding = "";
	let element = data[0];
	let repCount = 1;

	for (let i = 1; i <= data.length; i++){
		ch = data[i];
		if (ch == element) {
			repCount += 1;
			if (repCount == 255) {
				encoding += '#' + String.fromCharCode(repCount) + element;
				repCount = 0;
			}
		} else {
			if (repCount >= 4) {
				encoding += '#' + String.fromCharCode(repCount) + element;
				repCount = 1;
			} else {
				if (element == '#') {
					encoding += '#' + String.fromCharCode(repCount) + element;
					repCount = 1;
				} else {
					encoding += element.repeat(repCount);
					repCount = 1;
				}
			}
		}
		element = ch;
	}
	return encoding;
}

function Decode(data){
	let decode = "";
	let length = data.length;
	let counter = 0;

	while (counter < length) {
		if (data[counter] == '#') {
			decode += data[counter+2].repeat(data[counter+1].charCodeAt(0));
			counter += 3;
		} else {
			decode += data[counter];
			counter += 1;
		}
	}

	return decode;
}

if (process.argv[2] == "decode"){
	//RLE decoding process
	let data = Read(process.argv[3]);
	data = Decode(data);
	Write(process.argv[4], data);
} else if (process.argv[2] == "code"){
	//RLE encoding process
	let data = Read(process.argv[3]);
	data = Encode(data);
	Write(process.argv[4], data);
} else {
	console.log("Wrong command!");
}