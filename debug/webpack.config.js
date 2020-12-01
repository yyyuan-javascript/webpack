const path = require("path");
// const HtmlWebpackPlugin = require("html-webpack-plugin");
// const CusPluginPlugin1 = require("cus-plugin-plugin1");
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); 
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const SplitChunksPlugin = require('./webpack-plugins/split-chunks-plugin');
const [params0] = process.argv.slice(2)||[];
const isAnalyze = params0 === 'analyze';
module.exports = {
	// devtool: "source-map",
	context: __dirname,
	mode: "development",
	entry: {
		main: "./src/index.js",
		home: './src/home.js',
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
				include: [path.resolve(__dirname, "src")]
			},
			// {
			// 	test: /\.js$/,
			// 	use: [
			// 		{ loader: "cus-loader-loader1", options: { testPar1: "test" } },
			// 		{ loader: "cus-loader-loader2" }
			// 	],
			// 	include: [path.resolve(__dirname, "src")]
			// }
			{
				test: /\.png/,
				use: ["url-loader"]
			}
		]
	},
	optimization: {
		// splitChunks: false,
		// splitChunks: {
		// 	chunks: "all",
		// 	minSize: 0, 
		// 	// cacheGroups: {
		// 	// 	        "default": {    
		// 	// 	            "minChunks": 2,

		// 	// 	        },
		// 	// 	        "vendors": {
		// 	// 		            "minChunks": 1,
		// 	// 	        }
		// 	// 	    }
		//   }
		splitChunks:{
			    "hidePathInfo": false,
			    "chunks": "all",
			    "minSize":0,
			    "minChunks": 1,
			//     "maxAsyncRequests": null,
			    "automaticNameDelimiter": "~",
			    "automaticNameMaxLength": 109,
			//     "maxInitialRequests": null,
			    "name": true,
			    "cacheGroups": {
			        "default": {    
			            "automaticNamePrefix": "default",
			            "reuseExistingChunk": true,
			            "minChunks": 2,
			            "priority": -20
			        },
			        "vendors": {
			            "automaticNamePrefix": "vendors",
			//             "test": "/[\\\\/]node_modules[\\\\/]/",
			            "priority": -10
			        }
			    }
			}
	  },
	
	// plugins: [new CusPluginPlugin1()]
	// plugins: [new HtmlWebpackPlugin()]
	plugins: [
	  new SplitChunksPlugin({
		  chunks:"all",
		  minSize:0,
	  }),
	  new CleanWebpackPlugin({
		verbost: true, // write logs to console
		dry: false,
		cleanOnceBeforeBuildPatterns: ['**/*'],
	  }),
	  isAnalyze && new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerHost: '127.0.0.1',
        analyzerPort: 8888,
        reportFilename: 'report.html',
        defaultSizes: 'parsed',
        openAnalyzer: true,
        generateStatsFile: false,
        statsFilename: 'stats.json',
        statsOptions: null,
        logLevel: 'info',
	  }),
	].filter(Boolean)
};
