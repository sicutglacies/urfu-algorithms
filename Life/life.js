var grid = Array();
var h;
var w;

function initGeneration(height, width) {
    grid = new Array(width).fill(null)
        .map(() =>  new Array(height).fill(0));
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            grid[i][j] = new Object({'isAlive': false, 'x': j, 'y': i});
        }
    }
    h = height;
	w = width;
}

function initRandomGeneration(h, w) {
    for (let i = 0; i < w; i++) {
        for (let j = 0; j < h; j++) {
            grid[i][j] = new Object({'isAlive': !!(Math.floor(Math.random() * 2)), 'x': j, 'y': i});
        }
    }
}

function getGeneration() {
    return grid;
}

function changeGeneration(y, x) {
    //console.log(grid[x][y]);
    if (grid[x][y].isAlive) {
        grid[x][y].isAlive = false;
    } else {
        grid[x][y].isAlive = true;
    }
}

function newGeneration() {
    const pastGen = deepCopy(grid);

    for (let col = 0; col < w; col++) {
        for (let row = 0; row < h; row++) {
            const cell = pastGen[row][col];
            let numNeighbors = 0;
    

            for (let x = -1; x < 2; x++) {
                for (let y = -1; y < 2; y++) {
                    if (x == 0 && y == 0) {
                        //pass
                    } else {
                        numNeighbors += Number(pastGen[(((cell.y + y)%h)+h)%h][(((cell.x + x)%w)+w)%w].isAlive);
                    }
                }
            }

            // if (numNeighbors > 0){
            //     console.log(cell.x, cell.y, 'num', numNeighbors);
            // }

            if (cell.isAlive && numNeighbors < 2) {
                grid[cell.y][cell.x].isAlive = false;
            } else if (cell.isAlive && numNeighbors > 3) {
                grid[cell.y][cell.x].isAlive = false;
            } else if (!cell.isAlive && numNeighbors === 3) {
                grid[cell.y][cell.x].isAlive = true;
            }
        }
    }
    // console.log(pastGen);
    // console.log(grid);
}

const deepCopy = (arr) => {
    let copy = [];
    arr.forEach(elem => {
      if (Array.isArray(elem)) {
        copy.push(deepCopy(elem))
      }else {
        if (typeof elem === 'object') {
          copy.push(deepCopyObject(elem))
      } else {
          copy.push(elem)
        }
      }
    })
    return copy;
  }

  const deepCopyObject = (obj) => {
    let tempObj = {};
    for (let [key, value] of Object.entries(obj)) {
      if (Array.isArray(value)) {
        tempObj[key] = deepCopy(value);
      } else {
        if (typeof value === 'object') {
          tempObj[key] = deepCopyObject(value);
        } else {
          tempObj[key] = value
        }
      }
    }
    return tempObj;
  }