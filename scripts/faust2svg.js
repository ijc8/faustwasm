//@ts-check
const process = require("process");
const { default: faust2svgFiles } = require("../src/faust2svgFiles.js");

const argv = process.argv.slice(2);

if (argv[0] === "-help" || argv[0] === "-h") {
    console.log(`
faust2svg.js <file.dsp> <outputDir>
Generates Diagram SVGs of a given Faust DSP.
`);
    process.exit();
}

const [inputFile, outputDir, ...argvFaust] = argv;

faust2svgFiles(inputFile, outputDir, argvFaust);
