import resolve from 'rollup-plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';

export default {
    input: 'src/index.js',
    output: {
        file: 'dist/index.js',
        format: 'cjs',
        globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            'prop-types': 'PropTypes',
            'fast-deep-equal': 'equal',
            'styled-components': 'styled',
            'lodash.debounce': 'debounce',
        },
    },
    external: [
        'react',
        'react-dom',
        'prop-types',
        'fast-deep-equal',
        '@researchgate/react-intersection-observer',
        'intersection-observer',
        'styled-components',
        'lodash.debounce',
    ],
    plugins: [
        postcss({
            modules: true,
        }),
        resolve(),
        babel({
            exclude: 'node_modules/**',
        }),
        replace({
            exclude: 'node_modules/**',
            ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        }),
    ],

};
