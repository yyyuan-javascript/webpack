const path = require("path");
// const HtmlWebpackPlugin = require("html-webpack-plugin");
// const CusPluginPlugin1 = require("cus-plugin-plugin1");
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); 
module.exports = {
	// devtool: "source-map",
	context: __dirname,
	mode: "development",
	entry: {
		main: "./App/index.js",
		home: './App/home.js',
	},
	output: {
		path: path.resolve(__dirname, "./dist"),
		publicPath: path.posix.join(path.resolve(__dirname, "./dist"),'/'),// "/static/"
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"],
				include: [path.resolve(__dirname, "App")]
			},
			// {
			// 	test: /\.js$/,
			// 	use: [
			// 		{ loader: "cus-loader-loader1", options: { testPar1: "test" } },
			// 		{ loader: "cus-loader-loader2" }
			// 	],
			// 	include: [path.resolve(__dirname, "App")]
			// }
			{
				test: /\.png/,
				use: ["url-loader"]
			}
		]
	},
	optimization: {
		splitChunks: {
			chunks: "all",
			minSize: 0, // 默认是30kb，minSize设置为0之后
			// cacheGroups: {
			// 	        "default": {    
			// 	            "minChunks": 2,

			// 	        },
			// 	        "vendors": {
			// 		            "minChunks": 1,
			// 	        }
			// 	    }
		  }
	  },
	
	// plugins: [new CusPluginPlugin1()]
	// plugins: [new HtmlWebpackPlugin()]
	plugins: [new CleanWebpackPlugin({
		verbost: true, // write logs to console
		dry: false,
		cleanOnceBeforeBuildPatterns: ['**/*'],
	  })]
};
