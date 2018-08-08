import '../src/test.css';
export var  a=function () {
    console.log(2);
}
function fn() {
   console.log(44);
}
fn();
console.log(...[1,2,3,4]);
var test=document.getElementById("test");
test.onclick=function () {
    alert(22);
}
$("#test").on("click",function () {
    alert(124);
});