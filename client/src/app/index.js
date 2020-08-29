"use strict";

import "./index.css";
import fs from "fs";
import Helvetica from "!!raw-loader!pdfkit/js/data/Helvetica.afm";

fs.writeFileSync("data/Helvetica.afm", Helvetica);

const blobStream = require("blob-stream");
const PDFDocument = require("pdfkit").default;

const doc = new PDFDocument({size: "LETTER", margin: 50});
const stream = doc.pipe(blobStream());
const a = document.createElement("a");

let cantidad = document.getElementById("cantidad");
let matrimonios = document.getElementById("matrimonios");
let solteros = document.getElementById("solteros");

document.body.appendChild(a);
a.style = "display: none";

let setInputFilter = (textbox, inputFilter) => {
  [
    "input",
    "keydown",
    "keyup",
    "mousedown",
    "mouseup",
    "select",
    "contextmenu",
    "drop"
  ].forEach(event => {
    textbox.addEventListener(event, () => {
      if (inputFilter(textbox.value)) {
        textbox.oldValue = textbox.value;
        textbox.oldSelectionStart = textbox.selectionStart;
        textbox.oldSelectionEnd = textbox.selectionEnd;
      } else if (textbox.hasOwnProperty("oldValue")) {
        textbox.value = textbox.oldValue;
        textbox.setSelectionRange(
          textbox.oldSelectionStart,
          textbox.oldSelectionEnd
        );
      } else {
        textbox.value = "";
      }
    });
  });
};

let setTextFilter = (textbox, textAreaFilter) => {
  [
    "input",
    "keydown",
    "keyup",
    "mousedown",
    "mouseup",
    "select",
    "contextmenu",
    "drop"
  ].forEach(event => {
    console.log(event);
    textbox.addEventListener(event, () => {
      if (textAreaFilter(textbox.textContent)) {
        textbox.oldValue = textbox.textContent;
        textbox.oldSelectionStart = textbox.selectionStart;
        textbox.oldSelectionEnd = textbox.selectionEnd;
      } else if (textbox.hasOwnProperty("oldValue")) {
        textbox.textContent = textbox.oldValue;
        textbox.setSelectionRange(
          textbox.oldSelectionStart,
          textbox.oldSelectionEnd
        );
      } else {
        textbox.value = "";
      }
    });
  });
};

setInputFilter(
  cantidad,
  value => /^\d*$/.test(value) && (value === "" || parseInt(value) < 10)
);
setTextFilter(matrimonios, textContent => /^[a-zA-Zñ]*$/i.test(textContent));
setTextFilter(solteros, textContent => /^[a-zA-Zñ]*$/i.test(textContent));

let loadTheme = (word, soup) => {
  doc
    .fontSize(20)
    .text(word.replace(word[0], word[0].toUpperCase()), {align: "center"});
  doc.fontSize(11);
  soup
    .find("div", {id: "main"})
    .findAll("p")
    .forEach(p => {
      doc.moveDown().text(p.text.replace(/(\r\n|\n|\r)/gm, " "), {
        align: "justify",
        ellipsis: true
      });
    });
};

let downloadDoc = word => {
  stream.on("finish", () => {
    let blob = stream.toBlob("application/pdf");

    if (!blob) return;

    let docUrl = window.URL.createObjectURL(blob);
    a.href = docUrl;
    a.download = `${word.toLowerCase()}.pdf`;
    a.click();
    window.URL.revokeObjectURL(docUrl);
  });
};

let main = cgrupos => {
  console.log(cgrupos);
  // let matrimonios = document.getElementById("cantidad");
  // let mensaje = document.getElementById("mensaje");
  // let solteros = document.getElementById("cantidad");
  //
  // if (cantidad.split(" ").length > 1 || word == "") {
  //   mensaje.classList.add("error");
  //   mensaje.textContent = "Palabra no valida.";
  //   return;
  // }
  //
  // let url = `https://hjg.com.ar/vocbib/art/${word.toLowerCase()}.html`;
  //
  // if (topicExists(url)) {
  //   mensaje.classList.add("success");
  //   mensaje.textContent = "Palabra encontrada.";
  //   alert("Palabra encontrada.");
  //   let soup = getTheme(url);
  //   loadTheme(word, soup);
  //   // downloadDoc(word);
  //   loadReadings(word, soup);
  //   downloadDoc(word);
  //   window.location.reload(false);
  // } else {
  //   mensaje.classList.add("error");
  //   mensaje.textContent = "Palabra no encontrada.";
  //   alert("Palabra no encontrada.");
  //   return;
  // }
};

document.getElementById("generar").addEventListener("click", event => {
  event.preventDefault();
  console.log(matrimonios.textContent);
  main(cantidad.value);
});

document.getElementById("formulario").addEventListener("submit", event => {
  event.preventDefault();
  main(cantidad.value);
});
