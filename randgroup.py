#!/usr/bin/python3

from __future__ import print_function, unicode_literals

import json
import pdfkit
import random
from PyInquirer import style_from_dict, Token, prompt, Separator
from examples import custom_style_2
from prettytable import PrettyTable


class Group:
    def __init__(self):
        with open("comunidad.json") as json_file:
            self.data = json.load(json_file)

        self.comunidad = list()

        self.options = {
            "page-size": "Letter",
            "margin-top": "0.75in",
            "margin-right": "0.75in",
            "margin-bottom": "0.75in",
            "margin-left": "0.75in",
            "encoding": "utf-8",
            "custom-header": [("Accept-Encoding", "gzip")],
        }

    def get_delivery_options(self, answers):
        options = ["bike", "car", "truck"]
        if answers["size"] == "jumbo":
            options.append("helicopter")
        return options

    def run(self):
        types = ["Preparacion", "Encuesta"]
        name = "grupo"
        questions = [
            {
                "type": "list",
                "name": name,
                "message": "Seleccione el tipo de grupo.",
                "choices": types,
            }
        ]
        answers = prompt(questions, style=custom_style_2)
        return {types[0]: self.presentation, types[1]: self.survey}[
            answers[name]
        ]()

    def presentation(self):
        print("Grupo de Preparacion")

    def survey(self):
        print("Grupo de Encuesta")
        self.comunidad = self.data["matrimonio"] + self.data["soltero"]
        questions = [
            {
                "type": "checkbox",
                "qmark": "😃",
                "message": "Elija a los responsables",
                "name": "responsables",
                "choices": [{"name": item} for item in self.comunidad],
                "validate": lambda answer: "Debe eligir al menos 4 responsables"
                if len(answer) < 4
                else True,
            }
        ]

        tmp = "<!DOCTYPE html><html><head><style>table { width:100%; } table, th, td { border: 1px solid black; border-collapse: collapse; } th, td { padding: 15px; text-align: left; }</style></head><body>"
        tmp = (
            tmp
            + '<div id="main"><div class="title">Grupos de Encuesta</div><table><tr>'
        )

        answers = prompt(questions, style=custom_style_2)
        for item in answers["responsables"]:
            self.comunidad.remove(item)
            tmp = tmp + "<th>" + item + "</th>"
        tmp = tmp + "</tr>"

        table = PrettyTable(answers["responsables"])
        while len(self.comunidad) >= 4:
            tmp = tmp + "<tr>"
            tmprow = self.randomchoise(
                self.comunidad, len(answers["responsables"])
            )
            table.add_row(tmprow)
            for cell in tmprow:
                tmp = tmp + "<td>" + cell + "</td>"
            tmp = tmp + "</tr>"
        tmprow = self.addLagging(self.comunidad, len(answers["responsables"]))
        table.add_row(tmprow)
        tmp = tmp + "<tr>"
        for cell in tmprow:
            tmp = tmp + "<td>" + cell + "</td>"
        tmp = tmp + "</tr>"

        print(table)
        tmp = tmp + "</table></div></body></html>"
        pdfkit.from_string(
            tmp, "grupos-encuesta.pdf", options=self.options, css="dtb.css"
        )

    def addLagging(self, listitems, colcount):
        return list(
            listitems + list("" for i in range(colcount - len(listitems)))
        )

    def randomchoise(self, listchoises, colcount):
        itemchoise = list()
        returnitems = list()

        while len(itemchoise) < colcount:
            n = random.randint(0, len(listchoises) - 1)
            if n not in itemchoise:
                itemchoise.append(n)

        if len(itemchoise) == colcount:
            returnitems = list(listchoises[n] for n in itemchoise)
            for member in returnitems:
                self.comunidad.remove(member)

            return returnitems


if __name__ == "__main__":
    group = Group().run()
