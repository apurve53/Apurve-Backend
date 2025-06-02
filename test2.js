let arr = [];
for (i = 1; i <= 100; i++) {
    arr[i] = false;
}


for (let i = 1; i <= 100; i++) {
    for (j = 1; j <= 10; j++) {
        let res = i * j;
        if (res <= 100) {
            arr[res] = !arr[res];
        }
    }
}

for (i = 0; i < 100; i++) {
    if (arr[i] === true) {
        console.log(arr[i], " :: ", i);
    }
}