const path = require("path");
const glob = require("glob");
const fs = require("fs");
const TerserPlugin = require("terser-webpack-plugin");

const defaultServiceRoot = "../webapp/WEB-INF/static/";
const defaultJsRoot = "src/js";
const defaultOutputRoot = defaultServiceRoot+"js";
const defaultOutputTestRoot = defaultServiceRoot+"testJs";
const checkModules = [
    ["async", "await", "promise"]
];

const getCoreJSModule = (str) => {
  switch(str) {
      case "async": case "await": case "promise":
          return "";

      default:
          return "";
  }
};

const getEntry = (dirRange) => {
    let entry = {};

    const addEntry = (url) => {
        let _import = [];
        let fileContent = fs.readFileSync(url).toString().toLowerCase();

        checkModules.forEach(checkModule => {
            checkModule.every(module => {
                console.log(url, fileContent.includes(module));
                if(fileContent.includes(module)) {
                    let getModule = getCoreJSModule(module);

                    if(getModule) {
                        _import.push(getCoreJSModule(module))
                    }
                    return false;
                }

                return true;
            })

        });

        _import.push(url);

        let filePath = url.split(defaultJsRoot)[1];
        let fileName = filePath.split("/").slice(-1)[0].split(".")[0];

        console.log("_import", _import);

        entry = {
            ...entry,
            [fileName]: {
                import: _import,
                filename: filePath.substr(1) // substr()로 맨 앞 슬래시( "/" ) 제거
            }
        }
    };

    glob.sync(dirRange).forEach(file => addEntry(file));

    return entry;
}

const doAsync = async (env) => {
    const entry = getEntry(path.resolve(__dirname,`${defaultJsRoot}/**/*.js`));
    console.log("entry", entry);
    return {
        mode:env.dev ? "development" : "production",
        entry,
        output: {
            path: path.resolve(__dirname, defaultOutputTestRoot),
            filename: "[name].js"
        },
        target: ['web', 'es5'],
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            sourceType:"unambiguous",
                            presets: [[
                                "@babel/preset-env",{
                                    "useBuiltIns" : "usage",
                                    "corejs": 3,
                                    "targets" : {'ie':"9" },
                                    "shippedProposals": true
                                }
                            ]]
                        }
                    }
                }
            ]
        },
        optimization: {
            minimize: true,
            minimizer: [new TerserPlugin()]
        }
    };
};

module.exports = doAsync;
