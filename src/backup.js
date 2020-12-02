

//set initial row and column index
//change the index when clicking cells
var rowindex = 1;
var columnindex = 0;
var downLoadTestFileName = "data.csv";

// document.getElementsByTagName("td").addEventListener("click", getRowAndColumnIndex());

function init() {
    let columnTitle = document.getElementById("columnTitle");
    if(columnTitle.childElementCount === 1){
        // <!--        add column titles to initial table-->
        for(let i =65; i<91;i++){
            let th = document.createElement("th");
            th.addEventListener("click",getRowAndColumnIndex);
            th.innerHTML = String.fromCharCode(i);
            columnTitle.appendChild(th);
        }
        //    add 20 rows to initial table
        setTimeout(creatRows, 10);

    }else{
        alert("Please refresh first!");
    }

}

function creatRows() {
    for(let i = 0;i<20;i++){
        addRow();
    }
}
// get the cell indices when clicking on the cell and change the variables
function getRowAndColumnIndex() {
    var td = document.getElementsByTagName("td");
    for(var i = 0;i<td.length;i++){
        td[i].style.background = 'white';
    }
    rowindex = event.target.parentElement.rowIndex;
    columnindex = event.target.cellIndex;

    // show difference when a cell is selected, when clicking on a row title or a column title, the whole row or column will be different
    if(rowindex === 0){ // clicking on column title
        // event.target.style.background = 'lightgrey';
        var tchild = document.getElementById("tbody").children;
        for(var i = 0; i < tchild.length; i++){
            tchild[i].children[columnindex].style.background = 'lightgrey';
        }
    } else if( columnindex === 0 ){ // clicking on row title
        var tchild = document.getElementById("tbody").children[rowindex];
        for(var i = 0; i < tchild.children.length; i++){
            tchild.children[i].style.background = 'lightgrey';
        }
    } else {
        // event.target.style.background = 'lightgrey';

    }
    console.log("rowindex is " + rowindex + "; columnindex is " + columnindex);
}


// add row function
function addRow() {
    var tbody = document.getElementById("tbody");
    var tchild = document.getElementById("tbody").children; //rows in body

    //change the row indices of rows below selected row
    for(var i = rowindex; i<tchild.length; i++){
        var childrenArr = tchild[i].children;// get ith row, all the cells in the row
        var number = Number(childrenArr[0].innerHTML); // get ith row's row index
        childrenArr[0].innerHTML = number +1;
    }

    // creat a new row under the selected row, should be like the following
    let newTr =  document.createElement("tr");

    // creat the row title cell
    let newTd = document.createElement("td");

    newTd.innerHTML = rowindex+1; //
    // newTr's row index
    newTd.onclick = function(){    //为什么这里一定要用function包起来
        getRowAndColumnIndex();
    }
    newTr.appendChild(newTd);

    //creat n empty cells according to the num of columns
    let n = document.getElementById("columnTitle").childElementCount-1;

    for(let i = 0; i < n; i++){
        let td = document.createElement("td");
        let div = document.createElement("div");
        td.appendChild(div);
        td.contentEditable = "true";
        td.addEventListener('click',getRowAndColumnIndex);

        // td.onclick = function(){
        //     handleStaticFormula(this);
        // }
        td.onkeyup = function(e) {
            // 兼容FF和IE和Opera
            var event = e || window.event;
            var key = event.which || event.keyCode || event.charCode;
            if (key == 13) {
                handleStaticFormula(target.parentElement);
            }
        };
        // td.addEventListener('click',handleStaticFormula(this));
        newTr.appendChild(td);
    }
    // insert the new row below the selected row
    tbody.insertBefore(newTr, tbody.children[rowindex]);
}

function addColumn() {

    var columnTitle = document.getElementById("columnTitle");
    var cchild = document.getElementById("columnTitle").children; //column titles
    if(cchild.length === 27){
        alert("most 26 columns allowed");
    }else{
        //create a new column title
        var newTitle = document.createElement("th");
        if(columnindex === 0){ //when adding a first column
            var char = 'A';
        }else{
            char = String.fromCharCode(cchild[columnindex].innerHTML.charCodeAt()+1);
        }
        newTitle.innerHTML =char;
        newTitle.onclick = function () {
            getRowAndColumnIndex();
        }
        //change the column indices of columns on the right side of selected row
        for( var i = columnindex+1; i<cchild.length; i++){
            var char = String.fromCharCode(cchild[i].innerHTML.charCodeAt()+1);
            cchild[i].innerHTML = char;
        }
        // insert the title on the right side of selected column
        columnTitle.insertBefore(newTitle,cchild[columnindex+1])

        //creat empty cells for the column
        var tchild = document.getElementById("tbody").children; //rows in body

        for( var i = 0; i <tchild.length; i++){
            var td = document.createElement("td");
            td.contentEditable = "true";
            td.onclick = function(){
                getRowAndColumnIndex();
            }
            tchild[i].insertBefore(td, tchild[i].children[columnindex+1]);
        }
    }

}

function deleteRow() {
    var tbody  = document.getElementById("tbody");
    var tchild = document.getElementById("tbody").children;
    if(tchild.length === 1){
        alert("LAST Row!!")
    } else{
        // make the indices of the rows below the selected row -1
        for(var i = rowindex; i<tchild.length; i++){
            var childrenArr = tchild[i].children;// get ith row, all the cells in the row
            var number = Number(childrenArr[0].innerHTML); // get ith row's row index
            childrenArr[0].innerHTML = number - 1;
        }
        //remove the row
        tbody.removeChild(tbody.children[rowindex]);
    }

}

function deleteColumn() {
    var columnTitle = document.getElementById("columnTitle");
    var cchild = document.getElementById("columnTitle").children; //column titles
    if (cchild.length === 2) {
        alert("LAST Column!!")
    } else {
        // make the indices of the columns on the right side of the selected column -1
        for (var i = columnindex + 1; i < cchild.length; i++) {
            var char = String.fromCharCode(cchild[i].innerHTML.charCodeAt() - 1);
            cchild[i].innerHTML = char;
        }
        //remove the row
        columnTitle.removeChild(columnTitle.children[columnindex]);

        // delete the cells of column
        var tchild = document.getElementById("tbody").children; //rows in body

        for (var i = 0; i < tchild.length; i++) {
            var childrenArr = tchild[i].children;
            tchild[i].removeChild(childrenArr[columnindex]);
        }
    }
}

function upLoad(){
    //get the file
    var fileUpload = document.getElementById("fileUpload");
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
    // get the tbody element
    var tbody = document.getElementById("tbody");
    //check if the file is valid
    if(regex.test(fileUpload.value.toLowerCase())){
        //check if the browser support HTML5
        if(typeof (FileReader)!="undefined"){
            var reader = new FileReader();
            reader.onload = function (e) {
                // get the content and put it into an array
                var rows = e.target.result.split("\n");
                //if there's not enough space will alert
                if(rows.length > tbody.children.length){
                    alert("NO ENOUGH ROW will cause data loss!")
                }
                for(var i = 0; i< rows.length; i++){
                    var child = tbody.children[i];
                    var cells = rows[i].split(",");
                    if(cells.length > child.children.length-1){
                        alert("NO ENOUGH COLUMN will cause data loss!")
                    }
                    for(var j=0; j<cells.length;j++){
                        child.children[j+1].innerHTML = cells[j];
                    }
                }
            }
            for(var i = 0; i<fileUpload.files.length; i++){
                reader.readAsText(fileUpload.files[i]);
            }
        }else{
            alert("This browser does not support HTML5");
        }
    } else {
        alert("Please upload a valid CSV file");
    }
}

function downloadCSV(csv, filename){
    var csvFile;
    var downloadLink;
    //csv file
    csvFile = new Blob([csv],{type:"text/csv"});
    // download link
    downloadLink = document.createElement("a");
    // file name
    downloadLink.download = filename;
    // create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);
    // hide download link
    downloadLink.style.display = "none";
    //add the link to DOM
    document.body.appendChild(downloadLink);
    //click download link
    downloadLink.click();
}

function exportCSV(downLoadTestFileName) {
    var csv = [];
    var rows = document.getElementById("tbody").children;

    for(var i = 0;i<rows.length;i++){
        var row = [];
        var cells = rows[i].children;
        for(var j = 0; j < cells.length;j++){
            row.push(cells[j].innerText);
        }
        csv.push(row.join(","));
    }

    downloadCSV(csv.join("\n"),downLoadTestFileName);

}
function findTd(s){
    let col = s[0].charCodeAt()-64;
    let row = s[1]-1;
    let tbody = document.getElementById('tbody');
    return tbody.children[row][col];
}

function handleStaticFormula(td) {
    let text = td.childNodes[0].value;
    // console.log(text);
    if (text[0] == "=") {
        let formula = text.slice(1); //  去掉等号
        let cells = formula.split('+');
        if (text.includes("+")) {  // add function
            let res = 0;
            // td.textContent = parseInt(add1.value) + parseInt(add2.value);
            if (td.childNodes.length == 1) {
                let txt = document.createElement("div");
                txt.style.display = "none"; // this div will not be showing
                txt.textContent = text;
                td.appendChild(txt);
            } else {
                td.childNodes[1].textContent = text;
            }
            for(let i = 0; i<cells.length; i++){
                res += parseInt(findTd(cells[i]).value);
            }
            td.childNodes[0].value = res;
        } else if (text.includes("-")) {  // minus
            let res = 0;
            if (td.childNodes.length == 1) {
                let txt = document.createElement("div");
                txt.style.display = "none"; // this div will not be showing
                txt.textContent = text;
                td.appendChild(txt);
            } else {
                td.childNodes[1].textContent = text;
            }
            for(let i = 0; i<cells.length; i++){
                res -= parseInt(findTd(cells[i]).value);
            }
            td.childNodes[0].value = res;
        } else if (text.includes("*")) {
            let res = 0;
            if (td.childNodes.length == 1) {
                let txt = document.createElement("div");
                txt.style.display = "none"; // this div will not be showing
                txt.textContent = text;
                td.appendChild(txt);
            } else {
                td.childNodes[1].textContent = text;
            }
            for(let i = 0; i<cells.length; i++){
                res *= parseInt(findTd(cells[i]).value);
            }
            td.childNodes[0].value = res;
        } else if (text.includes("/")) {
            let res = 0;
            if (td.childNodes.length == 1) {
                let txt = document.createElement("div");
                txt.style.display = "none"; // this div will not be showing
                txt.textContent = text;
                td.appendChild(txt);
            } else {
                td.childNodes[1].textContent = text;
            }
            for(let i = 0; i<cells.length; i++){
                res /= parseInt(findTd(cells[i]).value);
            }
            td.childNodes[0].value = res;
        }
    }
}

// import {Observable} from "rxjs";
// var observable = Observable.create((observer:any)=>{
//     observer.next("Hello world");
// });
// observable.subscribe(
//     (x:any)=>console.log(x),
//     (error:any)=>logItem(`error: ${error}`),
//     ()=>logItem("complete!")
// );
document.onkeyup = function(e) {
    // 兼容FF和IE和Opera
    var event = e || window.event;
    var key = event.which || event.keyCode || event.charCode;
    if (key == 13) {
        /*Do something. 调用一些方法*/
    }
};