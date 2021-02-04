let fs = require('fs')
content = fs.readFileSync(process.argv[2]).toString()
base = process.argv[3]

function entropy (str, base){
	const len = str.length;
	const set = {};
	const freqs = str.split('').forEach(symbol => (set[symbol] ? set[symbol]++ : (set[symbol] = 1)));

	return Object.keys(set).reduce((sum, symbol) => {
    	const p = set[symbol] / len;
    	return sum - (p * (Math.log(p) / Math.log(base))); 
	}, 0);
}

console.log('Base of the logarithm is ' + base);
console.log('Entropy equals ');
console.log(entropy(content, base).toFixed(2));

//node entropy.js in.txt base