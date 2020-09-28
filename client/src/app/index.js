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

setInputFilter(
  cantidad,
  value => /^\d*$/.test(value) && (value === "" || parseInt(value) < 10)
);
setInputFilter(matrimonios, value => /^[a-zA-Záéíóúñ,\s]*$/i.test(value));
setInputFilter(solteros, value => /^[a-zA-Záéíóúñ,\s]*$/i.test(value));

let loadGroups = (cantidad, matrimonios, solteros) => {
  let order = {};
  let i = 1;
  for (i = 1; i <= cantidad; i++) {
    order[i] = {};
  }

  let soup = matrimonios.split(",").concat(solteros.split(","));
  i = 1;
  soup.forEach(name => {
    order[i].push(name.trim());
    i++;
    if (i > 4) {
      i = 1;
    }
  });

  let total = 0;
  for (i = 1; i <= cantidad; i++) {
    if (order[i].length > total) total = order[i].length;
  }

  doc.fontSize(20).text("Grupos", {align: "center"});
  doc.fontSize(11);
  for (i = 0; i < cantidad; i++) {
    doc.text(`Grupo ${i + 1}`, 50 + 125 * i, 100);
  }

  let vspace = 120;
  let iterator = 0;
  for (const x of Array(total).keys()) {
    for (i = 0; i < cantidad; i++) {
      doc.text(order[i + 1][x], 50 + (125 * i), vspace + 20 * iterator)
      i++;
      if (i > 4) {
        i = 1;
      }
    }

    doc
      .strokeColor("#aaaaaa")
      .lineWidth(1)
      .moveTo(50, vspace + 15 + 20 * iterator)
      .lineTo(550, vspace + 15 + 20 * iterator)
      .stroke();

    iterator++;
    if (x == 30 || x == 64) {
      doc.addPage();
      vspace = 50;
      iterator = 0;
    }
  }

  doc.end();
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

let main = (cantidad = 4, matrimonios, solteros) => {
  let mensaje = document.getElementById("mensaje");
  let matrimoniosStatus = !matrimonios.length && !matrimonios.includes(",");
  let solterosStatus = !solteros.length && !solteros.includes(",");

  if (!cantidad.length) {
    mensaje.classList.add("error");
    mensaje.textContent =
      "El campo Cantidad esta vacio, se usara 4 como valor por defecto.";
    // alert("El campo Cantidad esta vacio, se usara 4 como valor por defecto.");
    return;
  }

  if (solterosStatus || matrimoniosStatus) {
    mensaje.classList.add("error");
    mensaje.textContent =
      "El campo de Matrimonios o Solteros, al menos uno de los dos es requerido.";
    // alert("El campo de Matrimonios o Solteros, al menos uno de los dos es requerido.");
    return;
  }

  loadGroups(cantidad, matrimonios, solteros);
  downloadDoc();
};

document.getElementById("generar").addEventListener("click", event => {
  event.preventDefault();
  main(cantidad.value, matrimonios.value, solteros.value);
});

document.getElementById("formulario").addEventListener("submit", event => {
  event.preventDefault();
  main(cantidad.value, matrimonios.value, solteros.value);
});
