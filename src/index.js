/**
 * 将资源路径替换为CDN地址
 *
 * @file CDNProcessor
 * @author yanghuabei(yanghuabei@baidu.com)
 */

import edp from 'edp-core';
import cheerio from 'cheerio';
import AbstractProcessor from 'edp-build/lib/processor/abstract';

let path = edp.path;

const BASE_URL_REGEXP = /['"]?baseUrl['"]?:\s?['"](.*)['"]/;

/**
 * 将资源路径替换为CDN路径
 */
export default class CDNProcessor extends AbstractProcessor {

    static DEFAULT_OPTIONS = {
        name: 'CDNProcessor',
        dist: '',
        resourceTypes: '*.{js,css,png}',
        // 默认要处理的配置文件
        files: ['*.html'],
        enableDNSPrefetch: false
    };

    /**
     * 构建处理
     *
     * @param {edp-build.FileInfo} file 文件信息对象
     * @param {edp-build.ProcessContext} processContext 构建环境对象
     * @param {Function} callback 处理完成回调函数
     */
    process(file, processContext, callback) {
        // 提供cdn域名才执行处理逻辑
        if (this.domain) {
            let {data, extname} = file;
            switch (extname) {
                case 'html':
                    data = this.processHTML(file, processContext);
                    break;
            }
            file.setData(data);
        }

        callback();
    }

    /**
     * 处理html文件
     *
     * @param {edp-build.FileInfo} file 文件信息对象
     * @param {edp-build.ProcessContext} processContext 构建环境对象
     * @return {string}
     */
    processHTML(file, processContext) {
        let $ = cheerio.load(file.data, {decodeEntities: false});
        // 替换路径的方法
        let processPath = (element, attribute) => {
            let $element = $(element);
            let value = $element.attr(attribute);
            if (value && path.isLocalPath(value) && path.satisfy(value, this.resourceTypes)) {
                $element.attr(attribute, this.getCDNURL(file.fullPath, processContext.baseDir, value));
            }
        };

        // 处理link标签
        $('link').each((i, element) => processPath(element, 'href'));

        // 处理其他资源标签
        $('img, script, embed, video, audio, track').each((i, element) => processPath(element, 'src'));

        // 增加dns prefetch标签
        if (this.enableDNSPrefetch) {
            $('head').prepend(`<link rel="dns-prefetch" href="${this.domain}">`);
        }

        let data = $.html();

        // 修改页面的esl配置
        data = data.replace(
            BASE_URL_REGEXP,
            (match, dir) => `\'baseUrl\': \'${this.getCDNURL(file.fullPath, processContext.baseDir, dir)}\'`
        );

        return data;
    }

    /**
     * 获取cdn路径
     *
     * @param {string} fullPath 文件路径
     * @param {string} baseDir edp-build的运行目录
     * @param {string} url 资源路径
     * @return {string}
     */
    getCDNURL(fullPath, baseDir, url) {
        // 部署目录
        let dist = path.join('/', this.dist);

        // 相对路径的资源先转为相对项目的绝对路径，然后加上cdn域名、部署目录
        if (path.isRelativePath(url)) {
            // 当前文件所在目录
            let currentDir = path.dirname(fullPath);
            // 当前文件相对项目目录的路径
            currentDir = currentDir.slice(baseDir.length);
            return this.domain + path.join(dist, currentDir, url);
        }
        // 绝对路径资源直接加上cdn域名
        return this.domain + url;
    }
}
