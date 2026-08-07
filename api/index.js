const { request } = require('NeteaseCloudMusicApi/util/request');
const createOption = require('NeteaseCloudMusicApi/util/request').createRequest;
const cache = {};

async function getModule(moduleName) {
  if (cache[moduleName]) return cache[moduleName];
  try {
    const mod = require('NeteaseCloudMusicApi/module/' + moduleName);
    cache[moduleName] = mod;
    return mod;
  } catch (e) {
    return null;
  }
}

module.exports = async (req, res) => {
  const url = req.url.split('?')[0].replace(/^\//, '');
  const moduleName = url.replace(/\//g, '_');
  const query = req.query || {};
  
  // 添加cookie支持
  if (!query.cookie && process.env.COOKIE) {
    query.cookie = process.env.COOKIE;
  }
  if (!query.realIP) {
    query.realIP = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || '';
  }
  
  const mod = await getModule(moduleName);
  if (!mod) {
    return res.status(404).json({ error: 'unknown module', module: moduleName });
  }
  
  try {
    const result = await mod(query, createOption(query, ''));
    res.status(200).json(result.body || result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
