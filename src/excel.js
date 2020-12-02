import { Subscription, fromEvent, Observable } from 'rxjs';

window.subP1Map = {};
window.subP2Map = {};
window.sumMap = {};

var rowindex = 1;
var columnindex = 0;

window.init = function init() {
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
window.creatRows = function creatRows() {
    for(let i = 0;i<20;i++){
        addRow();
    }
}

// get the cell indices when clicking on the cell and change the variables
window.getRowAndColumnIndex = function getRowAndColumnIndex() {
    let theInput = event.target;
    let children = theInput.parentNode.children;
    if(children.length == 2){
        children[0].value = children[1].innerHTML;
    }
    rowindex = event.target.parentElement.parentElement.rowIndex;
    columnindex = event.target.parentElement.cellIndex;
    console.log("rowindex is " + rowindex + "; columnindex is " + columnindex);
}
let createTD = () =>{
    let td = document.createElement('td');
    let input = document.createElement('input');
    input.type = "text";
    input.setAttribute("onblur","handleCell(event)");
    td.appendChild(input);
    td.addEventListener('click',getRowAndColumnIndex);
    return td;
};
// add row function
window.addRow = function addRow() {
    let tbody = document.getElementById("tbody");
    let tchild = document.getElementById("tbody").children; //rows in body
    //change the row indices of rows below selected row
    for(let i = rowindex; i<tchild.length; i++){
        let childrenArr = tchild[i].children;// get ith row, all the cells in the row
        let number = Number(childrenArr[0].innerHTML); // get ith row's row index
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
        let td = createTD();
        newTr.appendChild(td);
    }
    // insert the new row below the selected row
    tbody.insertBefore(newTr, tbody.children[rowindex]);
}
window.addColumn = function addColumn() {
    let columnTitle = document.getElementById("columnTitle");
    let cchild = document.getElementById("columnTitle").children; //column titles
    if(cchild.length === 27){
        alert("most 26 columns allowed");
    }else{
        //create a new column title
        let newTitle = document.createElement("th");
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
        for( let i = columnindex+1; i<cchild.length; i++){
            let char = String.fromCharCode(cchild[i].innerHTML.charCodeAt()+1);
            cchild[i].innerHTML = char;
        }
        // insert the title on the right side of selected column
        columnTitle.insertBefore(newTitle,cchild[columnindex+1])
        //creat empty cells for the column
        let tchild = document.getElementById("tbody").children; //rows in body

        for( let i = 0; i <tchild.length; i++){
            let td = createTD();
            tchild[i].insertBefore(td, tchild[i].children[columnindex+1]);
        }
    }
}

window.deleteRow = function deleteRow() {
    let tbody  = document.getElementById("tbody");
    let tchild = document.getElementById("tbody").children;
    if(tchild.length === 1){
        alert("LAST Row!!")
    } else{
        // make the indices of the rows below the selected row -1
        for(let i = rowindex; i<tchild.length; i++){
            let childrenArr = tchild[i].children;// get ith row, all the cells in the row
            let number = Number(childrenArr[0].innerHTML); // get ith row's row index
            childrenArr[0].innerHTML = number - 1;
        }
        //remove the row
        tbody.removeChild(tbody.children[rowindex-1]);
    }

}

window.deleteColumn = function deleteColumn() {
    let columnTitle = document.getElementById("columnTitle");
    let cchild = document.getElementById("columnTitle").children; //column titles
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

window.upLoad = function upLoad(){
    //get the file
    let tbody = document.getElementById("tbody");
    let tds = document.getElementsByTagName("td");
    // delete original function
    for(let i = 0; i <tds.length; i++){
        if(tds[i].childElementCount == 2){
            tds[i].removeChild(tds[i].children[1]);
        }
    }
    var fileUpload = document.getElementById("fileUpload");
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
    // get the tbody element
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
                        child.children[j+1].childNodes[0].value = cells[j];
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

window.downloadCSV = function downloadCSV(csv, filename){
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
};

window.exportCSV = function exportCSV(downLoadTestFileName) {
    downLoadTestFileName = "data.csv";
    let csv = [];
    let rows = document.getElementById("tbody").children;
    let title = document.getElementById('columnTitle');
    let head = [];
    for(let i = 1; i <title.length; i++){
        head.push(title.children[i].innerHTML);
    }
    csv.push(head.join(","));
    for(let i = 0;i<rows.length;i++){
        let row = [];
        let cells = rows[i].children;
        for(let j = 0; j < cells.length;j++){
            row.push(cells[j].childNodes[0].value);
        }
        csv.push(row.join(","));
    }
    downloadCSV(csv.join("\n"),downLoadTestFileName);

};
window.findTd = function findTd(s){
    let col = s[0].charCodeAt()-64;
    let rowIndex = [];
    for(let i = 1;i <s.length; i++){
        rowIndex.push(s[i]);
    }
    let row1 = rowIndex.join("");
    let row = parseInt(row1)-1;
    let tbody = document.getElementById('tbody');
    let theRow = tbody.children[row];
    let theCell = theRow.children[col];
    console.log("found row"+row+" col"+col);
    return theCell.children[0];
};


// This function  for sum Calculation
let handleSumFormula=(start, end, formulaTd)=>{
    let start_td = start.parentElement;
    let end_td = end.parentElement;
    let start_row = start_td.parentElement.rowIndex;
    let start_col = start_td.cellIndex;
    let end_row = end_td.parentElement.rowIndex;
    let end_col = end_td.cellIndex;

    let table = document.getElementById('tbody')
    let trs = table.children;
    let res = 0;
    console.log("start:"+start_row);
    console.log("end:"+end_row);
    for (let i = Math.min(start_row, end_row); i <= Math.max(start_row, end_row); i++) {
        let tds = trs[i-1].children;
        for (let j = Math.min(start_col, end_col); j<= Math.max(start_col, end_col); j++) {
            let td = tds[j];
            let Ob = fromEvent(td.childNodes[0], "input");
            // let cord = formulaTd.parentNode.className + formulaTd.className;
            let cord = formulaTd.parentElement.rowIndex + ' '+ formulaTd.cellIndex;
            sumMap[cord].push(Ob.subscribe(() => handleSubscribe(formulaTd)))
            let val = td.querySelector('input').value;
            console.log(val);
            if (val == ""){
                res += 0
            } else {
                res += parseInt(val)
            }
        }
    }
    return res
}
// this function can call  the handleStaticFormula
function handleSubscribe(td) {
    td.childNodes[0].value = td.childNodes[1].textContent;
    handleStaticFormula(td)
}
// this function is for Arithmetic
var reg = /=SUM(.*:.*)/;
window.handleStaticFormula = function handleStaticFormula(td) {
    let text = td.childNodes[0].value;
    console.log(text);
    // if there's a formula in input
    if (text!="" && text[0] == "=") {
        let part1;
        let part2;
        let res;
        let formula = text.slice(1);
        //handle + - * / function of 2 cells
        if (text.includes("+")) {   //handle add
            part1 = findTd(formula.split('+')[0]);
            part2 = findTd(formula.split('+')[1]);
            let p1v = parseInt(part1.value);
            console.log(p1v);
            let p2v = parseInt(part2.value);
            console.log(p2v);
            if (part1.value == "")
                p1v = 0
            if (part2.value == "")
                p2v = 0
            res = p1v + p2v;
        } else if (text.includes("-")) {  //handle minus
            part1 = findTd(formula.split('-')[0])
            part2 = findTd(formula.split('-')[1])
            let p1v = parseInt(part1.value)
            let p2v = parseInt(part2.value)
            if (part1.value == "")
                p1v = 0
            if (part2.value == "")
                p2v = 0
            res = p1v - p2v;
        } else if (text.includes("*")) {  //handle multiply
            part1 = findTd(formula.split('*')[0])
            part2 = findTd(formula.split('*')[1])
            let p1v = parseInt(part1.value)
            let p2v = parseInt(part2.value)
            if (part1.value == "")
                p1v = 0
            if (part2.value == "")
                p2v = 0
            res = p1v * p2v;
        } else if (text.includes("/")) {   //handle divided
            part1 = findTd(formula.split('/')[0])
            part2 = findTd(formula.split('/')[1])
            let p1v = parseInt(part1.value)
            let p2v = parseInt(part2.value)
            if (part1.value == "")
                p1v = 0
            if (part2.value == "")
                p2v = 0
            res = p1v / p2v;
        }
        //handle sum function
        else if (reg.test(text)){
            console.log('handle SUM')
            formula = formula.slice(4, formula.length-1)
            console.log("startAt: "+formula.split(':')[0]);
            console.log("endAt: "+formula.split(':')[1]);
            part1 = findTd(formula.split(':')[0])// start cell
            part2 = findTd(formula.split(':')[1])// end cell
            // let cord = td.parentElement.parentElement.rowIndex + td.parentElement.cellIndex;
            let cord = td.parentElement.rowIndex + ' '+ td.cellIndex;
            console.log(cord);
            if (sumMap[cord]) {
                console.log("in sumMap"+sumMap[cord]);
                sumMap[cord].forEach(element => {
                    element.unsubscribe();
                });
            } else {
                console.log("not in sumMap"+cord);
                sumMap[cord] = []
            }
            res = handleSumFormula(part1, part2, td)
        } else { // if it's not a formula
            if (td.childNodes.length == 2) {  // if it has 2 inputs in td, one formula, one result, then update the formula
                td.childNodes[1].textContent = text
            }
            let cord = td.parentElement.rowIndex + ' '+ td.cellIndex;
            if (sumMap[cord]) { // if it has 2 inputs in td, one formula, one result, then update the formula
                sumMap[cord].forEach(element => {
                    element.unsubscribe();
                });
            }
            if (subP1Map[cord]) {
                subP1Map[cord].unsubscribe();
                console.log(subP1Map);
                console.log("UNSUB 1")
            }
            if (subP2Map[cord]) {
                subP2Map[cord].unsubscribe()
                console.log("UNSUB 2")
            }
            return
        }
        if (td.childNodes.length == 1) {    // if there's only one element in td and it's value is not a formula
            let txt = document.createElement("div")
            txt.style.display = "none"
            txt.textContent = text
            td.appendChild(txt);
        } else {  // if there's already 2 elements in td, update the formula
            td.childNodes[1].textContent = text
        }
        td.childNodes[0].value = res;
        let p1Ob = fromEvent(part1, "click");
        let p2Ob = fromEvent(part2, "click");
        let cord = td.parentElement.rowIndex + ' '+ td.cellIndex;
        if (subP1Map[cord]) {
            subP1Map[cord].unsubscribe()
        }
        if (subP2Map[cord]) {
            subP2Map[cord].unsubscribe()
        }
        subP1Map[cord] = p1Ob.subscribe(() => handleSubscribe(td))
        subP2Map[cord] = p2Ob.subscribe(() => handleSubscribe(td))
    } else { //if text is not a formula
        if (td.childNodes.length != 1) {
            td.childNodes[1].textContent = text //update formula
        }
        let cord = td.parentElement.rowIndex + ' '+ td.cellIndex;
        //find which map the cell is in, unsubscribe it
        if (sumMap[cord]) {
            sumMap[cord].forEach(element => {
                element.unsubscribe();
            });
        }
        if (subP1Map[cord]) {
            subP1Map[cord].unsubscribe()
            console.log("UNSUB 1")
        }
        if (subP2Map[cord]) {
            subP2Map[cord].unsubscribe()
            console.log("UNSUB 2")
        }
        return;
    }
}

window.handleCell = function handleCell(event) {
    let td = event.target.parentNode;
    handleStaticFormula(td);
}
