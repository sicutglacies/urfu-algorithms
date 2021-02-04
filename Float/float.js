function fillMantissa(mantissa) {
    if (mantissa.length < 23) {
        while (mantissa.length < 23) {
            mantissa += '0';
        }
    }
    return mantissa;
}

function fillExp(exp) {
    if (exp.length < 8) {
        while (exp.length < 8) {
            exp = '0' + exp;
        }
    }
    return exp;
}

function float(n) {
    if (isNaN(n)) {
        console.log('0 11111111 10000000000000000000000');
    } else {
        let signBit = Number(n.toString()[0] == '-').toString();
        n = Math.abs(n);
        let binary = n.toString(2);
        let exp = 0;
        let mantissa = '';
        let isInf = false;

        //console.log(binary);

        if (n == '0') {
            console.log(signBit, fillExp(exp.toString()), fillMantissa(mantissa));
            process.exit();
        } else {
            let intPart = binary.split('.')[0];
            let fracPart = binary.split('.')[1];
            if (fracPart == undefined) {
                fracPart = '';
            }   
            let ind = intPart.indexOf('1');
            if (ind > -1) {
                if (((intPart.length - ind - 1) + 127) > 255) isInf = true;
                exp = ((intPart.length - ind - 1) + 127).toString(2);
                mantissa = intPart.slice(ind+1, intPart.length) + fracPart;
            } else {
                ind = fracPart.indexOf('1');
                exp -= ind + 1;

                if (exp+127 > 255) isInf = true;
    
                mantissa = fracPart.slice(ind+1, fracPart.length);
                if (exp + 127 < 0) {
                    mantissa = fracPart.slice(ind, fracPart.length);
                    while (exp + 127 != 0) {
                        mantissa = '0' + mantissa;
                        exp++;
                    }
                }
                exp = (exp+127).toString(2);
            }

            if (mantissa.length > 23) {
                mantissa = mantissa.slice(0, 23);
            } else {
                mantissa = fillMantissa(mantissa);
            }
        }
        exp = fillExp(exp);
        if (isInf) {
            if (signBit > 0) {
                console.log('-Infinity');
            } else {
                console.log('+Infinity');
            }
        } else {
            console.log(signBit, exp, mantissa);
        }
    }
}

float(process.argv[2]);