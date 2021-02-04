const readlineSync = require('readline-sync');

function Read(infile){
	fs = require('fs');
	if (fs.existsSync(infile)){
		var data = fs.readFileSync(infile);
		if (data.length == 0){
			console.log('File is empty!');
			process.exit();
		}
		data = data.toString();
		data = data.split(/[\n\s]/);
		console.log('Code recieved');
		return data;
	} else {
		console.log(infile + '\n' + 'File not found!');
		process.exit();
	}
}

function FindIP(commands, num){
	let three = ['add', 'sub', 'cmp', 'more', 'cmpgoto'];
	let two = ['put'];
	let one = ['print', 'input', 'goto'];

	let i = 0;
	let j = 1;

	while (j < num){
		if (three.includes(commands[i])){
			i += 3 + 1;
		} else if (two.includes(commands[i])){
			i += 2 + 1;
		} else if (one.includes(commands[i])){
			i += 1 + 1;
		}
		j += 1;
		//console.log(i, j);
	}
	return i;
}

function Operate(command, commands, codeLen, ip){
	if (command == 'add'){
		commands[codeLen+Number(commands[ip+3])] = commands[codeLen+Number(commands[ip+1])] + commands[codeLen+Number(commands[ip+2])];
		ip += 3;
//		console.log('Add operation completed');
	} else if (command == 'sub'){
		commands[codeLen+Number(commands[ip+3])] = commands[codeLen+Number(commands[ip+1])] - commands[codeLen+Number(commands[ip+2])];
		ip += 3;
//		console.log('Substract operation completed');
	} else if (command == 'cmp'){
		if (commands[codeLen+Number(commands[ip+1])] == commands[codeLen+Number(commands[ip+2])]){
			commands[codeLen+Number(commands[ip+3])] = 1;
		} else {
			commands[codeLen+Number(commands[ip+3])] = 0;
		}
		ip += 3;
//		console.log('Compare operation completed');
	} else if (command == 'put'){
		commands[codeLen+Number(commands[ip+1])] = Number(commands[ip+2]);
		ip += 2
//		console.log('Put operation completed');
	} else if (command == 'print'){
		console.log(commands[codeLen+Number(commands[ip+1])]);
		ip += 1;
//		console.log('Print operation completed');
	} else if (command == 'goto'){
		ip = FindIP(commands, commands[ip+1]) - 1;
//		console.log('Interaction pointer is now at position ', Number(command[1]));
	} else if (command == 'cmpgoto'){
		if (commands[codeLen+Number(commands[ip+1])] == commands[codeLen+Number(commands[ip+2])]){
			ip = FindIP(commands, commands[ip+3]) - 1;
		} else {
			ip += 3;
		}
	} else if (command == 'more'){
		if (commands[codeLen+Number(commands[ip+1])] > commands[codeLen+Number(commands[ip+2])]){
			commands[codeLen+Number(commands[ip+3])] = 1;
		} else {
			commands[codeLen+Number(commands[ip+3])] = 0;
		}
		ip += 3
	} else if (command == 'input'){
		commands[codeLen+Number(commands[ip+1])] = Number(readlineSync.question('Input: '));
		ip += 1;
	}
	return [ip, commands];
}

function Launch(commands, codeLen){
	var ip = 0;
	while (commands[ip] != 'exit'){
		[ip, commands] = Operate(commands[ip], commands, codeLen, ip);
		ip += 1;
	}
	console.log('Program exited with code 0');
}

var code = Read(process.argv[2]);
var codeLen = code.length - 1;
Launch(code, codeLen);

