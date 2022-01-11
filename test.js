
const w = 2
const h = 5

const arr = new Array(w*h).fill(-1)

for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
        const idx = x * h + y
        arr[idx] = 666
    }
}

console.log(arr)