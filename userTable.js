const ExcelJS = require("exceljs");
// Load the existing workbook
const workbook = new ExcelJS.Workbook();
const fs = require("fs");
const filePath = __dirname + '/SBM/data.xlsx';
let cellNumber = 1;
let clameNumber = 1;
const newUser = function (userData) {
    console.log("user Data :", userData);
    const cellReferences = {}
    cellReferences[`A${cellNumber}`] = userData.name;
    cellReferences[`B${cellNumber}`] = userData.username;
    cellReferences[`C${cellNumber}`] = userData.phone;
    cellReferences[`D${cellNumber}`] = userData.address;
    cellReferences[`E${cellNumber}`] = userData.password;
    cellReferences[`F${cellNumber}`] = userData.options;
    cellReferences[`G${cellNumber}`] = userData.ytoptions;
    workbook.xlsx.readFile(filePath)
        .then(() => {
            const sheet = workbook.getWorksheet("Users");
            Object.entries(cellReferences).forEach(([cell, value]) => {
                sheet.getCell(cell).value = value;
            });
            cellNumber++;
            return workbook.xlsx.writeFile(filePath);
        })
        .then(() => {
            console.log('Excel file updated successfully.');
        })
        .catch((error) => {
            console.error('Error updating Excel file:', error.message);
        });
}

const clameRelsese = function (userClame) {
    console.log("userClame :", userClame);
    workbook.xlsx.readFile(filePath).then(() => {
        const sheet = workbook.getWorksheet("Clame");
        sheet.getCell(`A${clameNumber}`).value = userClame.user;
        sheet.getCell(`B${clameNumber}`).value = decodeURIComponent(userClame.clame);
        clameNumber++;
        return workbook.xlsx.writeFile(filePath);
    }).then(() => {
        console.log('Excel file updated successfully.');
    }).catch((error) => {
        console.error('Error updating Excel file:', error.message);
    });
}
module.exports = {
    newUser,
    clameRelsese
}
