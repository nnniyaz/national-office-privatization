const path = require("path");
const {parse} = require("csv-parse");
const fs = require("fs");

function TxtGen() {
    const csvFilePath = path.resolve(".", './txtmaps.csv');

    const headers = ["key", "kz", "ru", "en"];

    const fileContent = fs.readFileSync(csvFilePath, {encoding: 'utf-8'});

    parse(fileContent, {
        delimiter: ',',
        columns: headers,
    }, (error, result) => {
        if (error) {
            console.error(error);
            process.exit(1)
        }
        let txtMap = {}
        result.forEach((v) => {
            txtMap[v.key] = v
        })
        fs.writeFile(
            "./src/pkg/core/txts.ts",
            "import {MlString} from '@/domain/base/mlString/mlString';\n\nexport const txts: {[key: string]: MlString} = " + JSON.stringify(txtMap),
            (err) => {
                if (err != null) {
                    console.log("error write to txt.json", err)
                    process.exit(1)
                }
            }
        )
    })

    console.log("translates generated");
}

TxtGen()
