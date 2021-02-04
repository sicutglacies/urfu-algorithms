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

function getNextState(pattern, M, state, x, order){
    if (state < M && x == order.indexOf(pattern[state])){
        return state+1;
    }
    let i = 0;
    for (let ns = state; ns > 0; ns--){
        if (order.indexOf(pattern[ns-1]) == x){
            while (i < ns-1){
                if (pattern[i] != pattern[state-ns+1+i]){
                    break;
                }
                i++;
            }
            if (i == ns-1){
                return ns;
            }
        }
    }
    return 0;
}

function createAlphabet(sub){
    let l = sub.length;
    sub = sub.split('').filter(function(item, i, ar){ return ar.indexOf(item) === i; });
    let TF = Array.from(Array(l), () => new Array(sub.length));
    for (let i = 0; i < l; i++){
        for (let j = 0; j < sub.length; j++){
            TF[i][j] = 0;
        }
    }
    return [sub, TF]; 
}

function computeTF(pattern, M){
    let [order, TF] = createAlphabet(pattern);

    for (let state = 0; state < M; state++){
        for (let x = 0; x < order.length; x++){
            let val = getNextState(pattern, M, state, x, order);
            TF[state][x] = val; 
        }
    }
    return [order, TF];
}

function search(pattern, txt, args){
    let M = pattern.length;
    let N = txt.length;
    let [order, TF] = computeTF(pattern, M);
    let total = 0;

    if (args['-a']){
        console.log(order);
        console.table(TF);
    }

    let state = 0;
    for (let i = 0; i < N; i++){
        if (order.indexOf(txt[i]) > -1){
            state = TF[state][order.indexOf(txt[i])];
        } else {
            state = 0;
        }
        if (state == M){
            if (args['-n'] && total < args['N']){
                console.log('Found occurence at index '+ (i-M+1).toString());
                total++;
            } else if (!args['-n']){
                console.log('Found occurence at index '+ (i-M+1).toString());
                total++;
            }  else {
                break;
            }
        }
    }
    console.log('Total occurences:', total);
}

let position = 0;
let arguments = process.argv.length;
let args = {};

args['-a'] = false;
args['-t'] = false;
args['-n'] = false;
args['N'] = false;



while (arguments >= position){
    if (process.argv[position] == '-a'){
        args['-a'] = true;
    } else if (process.argv[position] == '-t'){
        args['-t'] = true;
    } else if (process.argv[position] == '-n'){
        args['-n'] = true;
        args['N'] = process.argv[position+1];
    }
    position += 1;
}

if (args['-t']){
    let txt = Read(process.argv[arguments-2]);
    let pat = Read(process.argv[arguments-1]);
    if (txt.length < pat.length){
        console.log('Substring > string');
        process.exit();
    }
    console.time('Search time');
    search(pat, txt, args);
    console.timeEnd('Search time');
} else {
    let txt = Read(process.argv[arguments-2]);
    let pat = Read(process.argv[arguments-1]);
    if (txt.length < pat.length){
        console.log('Substring > string');
        process.exit();
    }
    search(pat, txt, args);
}

//node automata.js [ключи] string_file substring_file