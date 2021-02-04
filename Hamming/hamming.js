function Calculation(arr, r){ 
    for (let i = 0; i < r; i++) { 
        let x = Math.pow(2, i); 
        for (let j = 1; j < arr.length; j++) { 
            if (((j >> i) & 1) == 1) { 
                if (x != j) 
                    arr[x] = arr[x] ^ arr[j]; 
            } 
        } 
        console.log("r" + x + " = " + arr[x]); 
    } 
    return arr; 
}

function GenerateCode(str, M, r){ 
    let arr = new Array(r + M + 1); 
    let j = 0; 
    for (let i = 1; i < arr.length; i++) { 
        if ((Math.ceil(Math.log(i) / Math.log(2)) - Math.floor(Math.log(i) / Math.log(2))) == 0){
            arr[i] = 0; 
        } 
        else { 
            arr[i] = str.charAt(j) - '0'; 
            j++; 
        } 
    } 
    return arr; 
} 

function GetCode(str){
    let M = str.length; 
    let r = 1; 
    while (Math.pow(2, r) < (M + r + 1)) { 
        r++; 
    } 
    let arr = GenerateCode(str, M, r); 
    arr = Calculation(arr, r).join(''); 
    return arr;
}

function CalcXOR(str){
    let bit = Number(str[0]);
    for (let i = 1; i < str.length; i++){
        bit = bit^Number(str[i]);
    }
    return bit;
}

function CatchError(str){
    let M = str.length; 
    let r = 2; 
    let errPos = 0;
    while (Math.pow(2, r) - 1 < M) { 
        r++; 
    }
    for (let i = 0; i < r; i++){
        let j = Math.pow(2, i)-1;
        let k = Math.pow(2, i);
        let p = new Array();
        while (j < str.length){
            for (let l = 0; l < k; l++){
                p.push(str[j]);
                j++;
            }
            j += Math.pow(2, i)
        }
        errPos += CalcXOR(p.join(''))*Math.pow(2,i);
    }
    if (errPos == 0){
        console.log('No errors detected');
    } else {
        console.log('Error on the position', errPos);
        if (str[M-errPos] == 0){
            str[M-errPos] = 1;
        } else {
            str[M-errPos] = 0; 
        }
    }
    return str;
}

function PrintDecoded(str){
    str = str.split('');
    let M = str.length; 
    let r = 2;
    while (Math.pow(2, r) - 1 < M) { 
        r++; 
    }
    for (let i = 0; i < r; i++){
        str[Math.pow(2, i)-1] = undefined;
    }
    str = str.join('');
    return str;
}



let str = '0011001';
CatchError(str);
console.log(PrintDecoded(str));