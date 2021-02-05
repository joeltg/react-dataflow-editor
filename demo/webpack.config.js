const path = require("path")

module.exports = {
	target: "web",
	devtool: "source-map",

	entry: {
		index: path.resolve(__dirname, "index.tsx"),
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
