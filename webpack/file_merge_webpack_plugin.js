// Merge bundles into a single file
// From: https://stackoverflow.com/a/65882720/1337474
const fs = require("fs");

class FileMergeWebpackPlugin {
    constructor({ files, destination, removeSourceFiles }) {
        this.files = files;
        this.destination = destination;
        this.removeSourceFiles = removeSourceFiles;
    }

    apply(compiler) {
        compiler.hooks.afterEmit.tap("FileMergeWebpackPlugin", () => {
            console.log("");
            console.log("");
            console.log("");
            console.log("HOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO          HHHHHHHHH");
            console.log("");
            console.log("");
            console.log("");

            return;
            const files = this.files
                .filter((file) => fs.existsSync(file))
                .map((file) => fs.readFileSync(file));

            for (const file of this.files) {
                console.log(file);
                console.log(fs.existsSync(file));
            }

            console.log(files);

            fs.writeFileSync(this.destination, files.join("\n\n\n\n"), {
                encoding: "UTF-8",
            });

            if (this.removeSourceFiles) {
                this.files.forEach((file) => fs.unlinkSync(file));
            }
        });
    }
}

module.exports = FileMergeWebpackPlugin;
