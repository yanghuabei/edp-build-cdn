# edp-build-cdn

![Build Status](https://img.shields.io/travis/yanghuabei/edp-build-cdn.svg)
![Coverage](https://img.shields.io/coveralls/yanghuabei/edp-build-cdn.svg)
![Downloads](https://img.shields.io/npm/dm/edp-build-cdn.svg)
![Downloads](https://img.shields.io/npm/dt/edp-build-cdn.svg)
![npm version](https://img.shields.io/npm/v/edp-build-cdn.svg)
![dependencies](https://img.shields.io/david/yanghuabei/edp-build-cdn.svg)
![dev dependencies](https://img.shields.io/david/dev/yanghuabei/edp-build-cdn.svg)
![License](https://img.shields.io/npm/l/edp-build-cdn.svg)

Processor for edp-build to add cdn support.

## Getting Started

Install it via npm:

```shell
npm install edp-build-cdn
```

And include in your project:

```javascript
import CDNProcessor from 'edp-build-cdn';

let CDNProcessor = require('edp-build-cdn').default;

let processor = new CDNProcessor({
    name: 'CDNProcessor',
    // cdn加速域名
    domain: '//xxx.xxcdn.com',
    // cdn上的资源
    resourceTypes: '*.{js,css,png}',
    // 部署目录
    dist: 'app',
    // 需要处理的文件类型，目前仅支持html
    files: [
        '*.html'
    ],
    // 是否需要在html head中增加cdn域名的prefetch
    enableDNSPrefetch: true
});
```

## License

MIT
