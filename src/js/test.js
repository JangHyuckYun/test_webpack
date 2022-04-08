const test = async () => {
  let test = await fetch("/asd");

  console.log("test", test);
};

window.onload = () => {
  console.log("hi");

  test();
};