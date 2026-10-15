const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

// Plugin robusto: legge da src/img, ottimizza e genera WebP in dist/img senza conflitti
class ImageOptimizeAndWebpPlugin {
  apply(compiler) {
    compiler.hooks.afterEmit.tapAsync('ImageOptimizeAndWebpPlugin', async (compilation, callback) => {
      const srcImgDir = path.resolve(__dirname, 'src/img');
      const distImgDir = path.resolve(compiler.options.output.path, 'img');

      if (fs.existsSync(srcImgDir)) {
        if (!fs.existsSync(distImgDir)) {
          fs.mkdirSync(distImgDir, { recursive: true });
        }

        const files = fs.readdirSync(srcImgDir);

        for (const file of files) {
          const srcPath = path.join(srcImgDir, file);
          if (fs.statSync(srcPath).isDirectory()) continue;

          const ext = path.extname(file).toLowerCase();
          const name = path.basename(file, ext);
          const distJpgPath = path.join(distImgDir, file);
          const distWebpPath = path.join(distImgDir, `${name}.webp`);

          try {
            if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
              // 1. Ottimizza e copia l'immagine originale in dist/img
              const sharpInstance = sharp(srcPath);
              if (ext === '.png') {
                await sharpInstance.png({ quality: 80 }).toFile(distJpgPath);
              } else {
                await sharpInstance.jpeg({ quality: 80 }).toFile(distJpgPath);
              }

              // 2. Genera la copia .webp corrispondente
              await sharp(srcPath)
                .webp({ quality: 75 })
                .toFile(distWebpPath);
            } else {
              // Copia diretta per altri file (svg, gif, ecc.)
              fs.copyFileSync(srcPath, distJpgPath);
            }
          } catch (err) {
            console.error(`[Image Plugin] Errore di elaborazione su ${file}:`, err);
          }
        }
      }
      callback();
    });
  }
}

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? 'source-map' : 'eval-source-map',

    entry: './src/ts/index.ts',

    output: {
      filename: 'js/main.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },

    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },

    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      port: 3000,
      open: true,
      hot: true,
      devMiddleware: {
        writeToDisk: true,
      },
    },

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'ts-loader',
              options: { transpileOnly: true },
            },
          ],
        },
        {
          test: /\.js$/,
          include: path.resolve(__dirname, 'src/js'),
          type: 'javascript/esm',
        },
        {
          test: /\.scss$/i,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                sassOptions: {
                  includePaths: [path.resolve(__dirname, 'src/sass')],
                },
              },
            },
          ],
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'font/[name][ext]',
          },
        },
      ],
    },

    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: { compress: isProduction },
        }),
        new CssMinimizerPlugin({
          minimizerOptions: {
            preset: [
              'default',
              {
                discardComments: { removeAll: true },
                svgo: false,
              },
            ],
          },
        }),
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'index.html',
      }),
      new MiniCssExtractPlugin({
        filename: 'css/style.css',
      }),
      // Copia solo i font (le immagini sono gestite dal plugin dedicato)
      new CopyPlugin({
        patterns: [
          { 
            from: 'src/font', 
            to: 'font', 
            noErrorOnMissing: true 
          },
        ],
      }),
      // Plugin unificato per copia, ottimizzazione e generazione WebP in sicurezza
      new ImageOptimizeAndWebpPlugin(),
    ],
  };
};