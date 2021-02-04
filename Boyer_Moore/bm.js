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

function goodSuffixPreprocess1(shifts, pos, pat){
	let m = pat.length;
	let i = m;
	let j = m+1;
	pos[i] = j;

	while(i > 0){
		while(j <= m && pat[i-1] != pat[j-1]){
			if (shifts[i] == 0){
				shifts[j] = j-i;
			}
			j = pos[j];
		}
		i--;
		j--;
		pos[i] = j;
	}
	return shifts;
}

function goodSuffixPreprocess2(shifts, pos, pat){
	let m = pat.length;
	let j = pos[0];

	for(let i = 0; i < m+1; i++){
		if (shifts[i] == 0){
			shifts[i] = j;
		}
		if (i == j){
			j = pos[j];
		}
	}
	return shifts;
}



class BoyerMoore{
	constructor(str){
		this.str = str;
		this.badCharTable = new Object();
		for (let i = 0; i < this.str.length; i++){
			this.badCharTable[str[i]] = Math.max(1, this.str.length-i-1);
		}
		this.goodSuffixTable = new Array(this.str.length+1).fill(0);
		this.pos = new Array(this.str.length+1).fill(0);
		this.goodSuffixTable = goodSuffixPreprocess1(this.goodSuffixTable, this.pos, this.str);
		this.goodSuffixTable = goodSuffixPreprocess2(this.goodSuffixTable, this.pos, this.str);
	}

	badCharRule(s){
		if (this.badCharTable[s]){
			return [true, this.badCharTable[s]];
		} else {
			return [false, this.str.length];
		}
	}

	goodSuffixRule(j){
		return this.goodSuffixTable[j+1];																																																																																																																																																																																																																																																																																																																																
	}
}

function Search(pat, txt, bm, args){
	let i = 0;
	let n = txt.length;
	let m = pat.length;
	let total = 0;

	while (i < n-m+1){
		let shift = 1;
		let mismatched = false;

		for (let j = m-1; j >= 0; j--){
			if (pat[j] != txt[i+j]){
				let skipgs = 1;
				let [applicable, skipbc] = bm.badCharRule(txt[i+j]);
				if (j == m-1){
					skipgs = 1;
				} else {
					if (!applicable){
						skipbc = 1;
					}
					skipgs = bm.goodSuffixRule(j);
				}
				shift = Math.max(shift, skipbc, skipgs);
				mismatched = true;
				break;
			}
		}

		if (!mismatched){
			console.log('Found occurence at index', i);
			total += 1;
			if (args['-n']){
				if (total == args['N']){
					break;
				}
			}
			skipgs = bm.goodSuffixTable[0];
			shift = skipgs;
			//shift = Math.max(shift, skipgs);
		}
		i += shift;
	}
	console.log('Total occurences:', total);
}


let position = 0;
let arguments = process.argv.length;
let args = {};

args['-t'] = false;
args['-n'] = false;
args['N'] = false;


while (arguments >= position){
    if (process.argv[position] == '-t'){
        args['-t'] = true;
    } else if (process.argv[position] == '-n'){
        args['-n'] = true;
        args['N'] = process.argv[position+1];
    }
    position += 1;
}


let str = Read(process.argv[arguments-2]);
let pat = Read(process.argv[arguments-1]);

if (args['-t']){
	console.time();
	let bm = new BoyerMoore(pat);
	Search(pat, str, bm, args);
	console.timeEnd();
} else {
	let bm = new BoyerMoore(pat);
	Search(pat, str, bm, args);
}