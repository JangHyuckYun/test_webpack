import user from "./info";

function handleTask(id) {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log(`task${id} finished!`);
            resolve();
        }, 1000);
    })
}

function main() {
    const tasks = [1, 2, 3, 4, 5];

    console.log('before');

    tasks.forEach(async task => {
        await handleTask(task);
    });

    console.log('after');
}

console.log("ASDASD");
console.log("user", user);

let arr = [1,2,3];
let testArr = [...arr];

console.log(testArr);

let objName = {
    name: "ja",
    age:14
};

const { name, age } = objName;

console.log(name, age);

main();