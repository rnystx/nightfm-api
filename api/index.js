const modules = require('NeteaseCloudMusicApi');

module.exports = async (req, res) => {
  const path = req.url.split('?')[0].replace(/^\//, '');
  const moduleName = path.replace(/\//g, '_');

  if (!modules[moduleName]) {
    return res.status(404).json({ error: 'unknown module', module: moduleName });
  }

  try {
    const result = await modules[moduleName](req.query);
    res.status(200).json(result.body || result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
