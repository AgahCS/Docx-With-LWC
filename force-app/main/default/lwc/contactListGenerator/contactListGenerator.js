import { LightningElement, api } from 'lwc';
import {loadScript} from 'lightning/platformResourceLoader';
import docxImport from '@salesforce/resourceUrl/docxjs';
import contactGrab from '@salesforce/apex/ContactGrabber.getAllRelatedContacts';


export default class ContactListGenerator extends LightningElement {

    @api recordId;
    downloadURL;

    connectedCallback() {
        Promise.all([loadScript(this, docxImport)]).then(() => {
            this.renderButtons();
        });
    }

    renderButtons(){
        this.template.querySelector(".hidden").classList.add("not_hidden");
        this.template.querySelector(".hidden").classList.remove("hidden");
    }

    startDocumentGeneration() {
        contactGrab({'acctId': this.recordId}).then(contacts => {
            this.buildDocument(contacts);
        });
    }

    buildDocument(contactsPassed){
        let document = new docx.Document();
        let tableCells = [];
        tableCells.push(this.generateHeaderRow());

        contactsPassed.forEach(contact => {
            tableCells.push(this.generateRow(contact));
        });

        this.generateTable(document, tableCells);
        this.generateDownloadLink(document);
    }

    generateHeaderRow() {
        let tableHeaderRow = new docx.TableRow({
            children:[
                new docx.TableCell({
                    children: [new docx.Paragraph("First Name")]
                }),
                new docx.TableCell({
                    children: [new docx.Paragraph("Last Name")]
                })
            ]
        });

        return tableHeaderRow;
    }

    generateRow(contactPassed){
        let tableRow = new docx.TableRow ({
            children: [
                new docx.TableCell({
                    children: [new docx.Paragraph({children: [this.generateTextRun(contactPassed["FirstName"].toString())]})],
                }),
                new docx.TableCell({
                    children: [new docx.Paragraph({children: [this.generateTextRun(contactPassed["LastName"].toString())]})],
                })
            ]
        });
        return tableRow;
    }

    generateTextRun(cellString) {
        let textRun = new docx.TextRun({text: cellString, bold: true, size: 24, font: "Calibri"});
        return textRun;
    }

    generateTable(DocumentPassed, tableCellsPassed) {
        let docTable = new docx.Table({
            rows: tableCellsPassed
        });

        DocumentPassed.addSection( {
            children: [docTable]
        });
    }

    generateDownloadLink(documentPassed) {
        docx.Packer.toBase64String(documentPassed).then(textBlob =>{
            this.downloadURL = 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,' + textBlob;
            this.template.querySelector(".slds-hide").classList.remove("slds-hide");
        });
    }
}