import merge from 'deepmerge';
import {createSpaConfig} from '@open-wc/building-rollup';

const baseConfig = createSpaConfig({
    developmentMode: process.env.ROLLUP_WATCH === 'true',
    injectServiceWorker: false
});

export default merge(baseConfig, {
    // any <script type="module"> inside will be bundled by Rollup
    input: './example/index.html'
});
