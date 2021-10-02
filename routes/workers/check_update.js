const version_json = require('../../version.json')
const versionCompare = require('../api/utils/version/versionCompare');
const { requestJson } = require('../api/utils/request/request');
 
function updateAvailable() {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await requestJson("GET", version_json.versionUrl);

      if (versionCompare.compare(res.version, version_json.version, ">")) {
        const mandatory =
          res.minVersion != null &&
          versionCompare.compare(res.minVersion, version_json.version, ">");

        const newRes = await requestJson(
          "GET",
          version_json.repository + `releases/tag/v${res.version}`,
          {},
          {},
          true
        );

        if (newRes.status === 200) {
          resolve({ update_available: true, version: res.version, mandatory });
        } else if (newRes.status === 404) {
          resolve({ update_available: false, version: res.version, mandatory });
        } else reject(new Error("Error fetching update data, status " + res.status));
      } else resolve({ update_available: false, version: res.version, mandatory: false });
    } catch (e) {
      reject(e);
    }
  })
}

module.exports = updateAvailable