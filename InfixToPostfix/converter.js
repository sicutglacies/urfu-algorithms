const operators = ['(', ')', '+', '-', '*', '/', '^'];
const priority = {'+': 1, '-': 1, '*': 2, '/': 2, '^': 3};

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

class Stack{
    constructor(){
        this.items = [];
    }

    isEmpty(){
        return this.items.length == 0;
    }

    push(item){
        return this.items.push(item);
    }

    pop(){
        return this.items.pop();
    }

    size(){
        return this.items.length;
    }

    last(){
        return this.items[this.size()-1];
    }

    eval(operator){
        let res = Solve(this.items[this.size()-2], this.items[this.size()-1], operator);
        this.pop();
        this.pop();
        this.push(res.toString());
    }
}

function Solve(a, b, op){
    a = Number(a);
    b = Number(b);

    if (op == '+'){
        return a + b;
    } else if (op == '-'){
        return a - b;
    } else if (op == '*'){
        return a * b;
    } else if (op == '/'){
        if (b == 0){
            console.log('Division by 0 is not possible');
            process.exit();
        }
        return a / b;
    } else if (op == '^'){
        if (a == 0 && b <= 0){
            console.log('Result is not defined');
            process.exit();
        } else if (a < 0 && !Number.isInteger(b)){
            console.log('Negative numbers cannot be powered by a ratio');
            process.exit();
        } else {
            return a ** b;
        }
    } else {
        console.log('Unexpected operator', op);
        process.exit();
    }
}

function HasLessOrEqualPriority(a, b){
    if (!priority.hasOwnProperty(a) || !priority.hasOwnProperty(b)) return false;
    return priority[a] <= priority[b];
}

function IsOperator(operator){
    return operators.includes(operator);
}

function IsOperand(operand){
    return !isNaN(operand);
}

function IsOpenPar(char){
    return char == '(';
}

function IsClosePar(char){
    return char == ')';
}

function Convert(equation){
    let stack = new Stack();
    let output = '';

    equation = equation.split(' ');
    for (const char of equation){
        if (IsOperand(char)){ //Если число, то записываем в результат
            output += char + ' ';
        } else {
            if (IsOpenPar(char)){ //Если открывающаяся скобочка, то записываем в стек
                stack.push(char);
            } else if (IsClosePar(char)){ //Если закрывающаяся скобочка, то записываем все до откр. скобочки
                while (!IsOpenPar(stack.last())){
                    output += stack.last() + ' ';
                    operator = stack.pop();
                }
                stack.pop();
            } else { //Если знак и он меньше, либо равен по приоритету последнему знаку, 
                     //то выгружаем до последнего наиболее приоритетного
                while (!stack.isEmpty() && HasLessOrEqualPriority(char, stack.last())){
                    output += stack.last() + ' ';
                    stack.pop();
                }
                stack.push(char);
            }
        }
    }

    while (!stack.isEmpty()){ //Выгружаем остаток стека в результат
        output += stack.last() + ' ';
        stack.pop();
    }
    return output.slice(0, -1);
}

function Calculate(equation){
    let stack = new Stack;

    equation = equation.split(' ');
    for (const char of equation){
        if (IsOperand(char)){
            stack.push(char);
        } else if (IsOperator(char)){
            stack.eval(char);
        }
        //console.log(stack);
    }
    return stack.last();
}


let eq = Read(process.argv[2]);
let out = Convert(eq);
console.log('Infix:', eq);
console.log('Postfix:', out);
let res = Calculate(out);
console.log('Result:', res);

//node converter.js equation_file.js