const path = require("path")

module.exports = {
	target: "web",
	devtool: "source-map",

	entry: {
		editable: path.resolve(__dirname, "editable.tsx"),
		readonly: path.resolve(__dirname, "readonly.tsx"),
	},

	output: {
		filename: "[name].min.js",
		path: __dirname,
	},

	resolve: {
		extensions: [".js", ".jsx", ".ts", ".tsx"],
	},

	module: {
		rules: [{ test: /\.tsx?$/, loader: "ts-loader" }],
	},
}
