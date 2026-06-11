// eslint-disable-next-line @typescript-eslint/no-var-requires,no-undef
const path = require("path");
// eslint-disable-next-line @typescript-eslint/no-var-requires,no-undef
const {parse} = require('csv-parse');
// eslint-disable-next-line @typescript-eslint/no-var-requires,no-undef
const fs = require('fs');

function TxtGen() {
    const csvFilePath = path.resolve(".", './txtmaps.csv');

    const headers = ["key","kz", "ru", "en"];

    const fileContent = fs.readFileSync(csvFilePath, {encoding: 'utf-8'});

    console.log("generate txt from csv");

    parse(fileContent, {
        delimiter: ',',
        columns: headers,
    }, (error, result) => {
        if (error) {
            console.error(error);
            // eslint-disable-next-line @typescript-eslint/no-var-requires,no-undef
            process.exit(1)
        }
        let txtMap = {}
        result.forEach((v) => {
            txtMap[v.key] = v
        })
        fs.writeFile(
            "./src/shared/core/i18ngen.ts",
            "import {MlString} from '../../domain/base/mlString.ts';\n\nexport const txts: {[key: string]: MlString} = " + JSON.stringify(txtMap),
            (err) => {
                if (err != null) {
                    console.log("error write to txt.json", err)
                    process.exit(1)
                }
            }
        )
    })
}

TxtGen()
