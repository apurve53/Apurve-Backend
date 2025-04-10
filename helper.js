const ExcelJS = require("exceljs");
const fs = require("fs");
async function getSelectList() {
    var listOfSelectLists = [];
    const selectListWorkBook = new ExcelJS.Workbook();
    try {
        await selectListWorkBook.xlsx.readFile("./SBM/Music Distribution Site Data.xlsx");
        const dataSheet = selectListWorkBook.getWorksheet(1);
        const columnB = dataSheet.getColumn("B");
        const columnA = dataSheet.getColumn("A");
        let languges = columnA.values;
        languges.shift();
        languges.shift();
        let genre = columnB.values;
        genre.shift();
        genre.shift();
        const columnC = dataSheet.getColumn("C");
        let subGenre = columnC.values;
        let stringofList = subGenre.join(",");
        let stringWithoutBOM = stringofList.replace(`\ufeff`, "");
        subGenre = stringWithoutBOM.split(",");
        subGenre.shift();
        subGenre.shift();
        const columnD = dataSheet.getColumn("D");
        let moods = columnD.values;
        moods.shift();
        moods.shift();
        listOfSelectLists.push(languges);
        listOfSelectLists.push(genre);
        listOfSelectLists.push(subGenre);
        listOfSelectLists.push(moods);
        return listOfSelectLists;
    } catch (error) {
        console.error("Error reading xlsx file:", error);
        return null;
    }
}

const doesValueExist = function (array, propertyName, targetValue) {
    return array.some(obj => obj[propertyName] === targetValue);
};

const checkAndUpdate = function (array, propertyName, targetValue, newPropertyValue) {
    const foundIndex = array.findIndex(obj => obj[propertyName] === targetValue);

    if (foundIndex !== -1) {
        array[foundIndex]["pay"] = newPropertyValue;
        return true;
    }
    return false;
};

const getValueByProperties = function (array, propertyToFind, valueToMatch, otherProperty, otherValue) {
    const foundObject = array.find(obj => obj[propertyToFind] === valueToMatch && obj[otherProperty] === otherValue);
    return foundObject ? foundObject[propertyToFind] : null;
};
const deleteOldProfilePicture = function (fileName) {
    fs.unlink(__dirname + `/SBMuploads/profilepicture/${fileName}`, err => {
        if (err) {
            console.error("Error deleting file:", err);
        } else {
            console.log("File deleted successfully");
        }
    });
};
module.exports = {
    getSelectList,
    doesValueExist,
    checkAndUpdate,
    deleteOldProfilePicture
};
