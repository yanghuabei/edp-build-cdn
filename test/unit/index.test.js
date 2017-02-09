import {assert} from 'chai';

import CDNProcessor from '../../src/index';

describe('CDNProcessor', () => {
    it('CDNProcessor should be a class', () => {
        assert.isFunction(CDNProcessor)
    });

    it('CDNProcessor.DEFAULT_OPTIONS should be right', () => {
        assert.deepEqual(
            CDNProcessor.DEFAULT_OPTIONS,
            {
                name: 'CDNProcessor',
                dist: '',
                resourceTypes: '*.{js,css,png}',
                // 默认要处理的配置文件
                files: ['*.html'],
                enableDNSPrefetch: false
            }
        );
    });
});
