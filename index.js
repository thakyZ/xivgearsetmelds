const fs = require("fs").promises;
const path = require("path");
const rp = require("request-promise-native");

const downloadedIconsCompile = promises => {
  const materia = {};
  for (const icon in promises) {
    if (Object.prototype.hasOwnProperty.call(promises, icon)) {
      const key = Object.keys(promises[icon])[0];
      materia[key] = promises[icon][key];
    }
  }

  return materia;
};

const downloadIcon = async icon => {
  const outIcon = {};
  let response;
  try {
    response = rp({
      url: `https://xivapi.com/i/020000/${icon}_hr1.png`,
      method: "GET",
      encoding: null
    });
  } catch (error) {
    console.error(error);
    outIcon[icon] = false;
  }

  return new Promise((resolve, reject) => {
    response.then(data => {
      const dataComp = "data:image/png;base64," + Buffer.from(data).toString("base64");
      outIcon[icon] = dataComp;
      resolve(outIcon);
    }).catch(error => {
      console.error(error);
      outIcon[icon] = false;
      reject(outIcon);
    });
  });
};

const downloadIconsProxy = async materia => {
  const results = [];
  for (const icon in materia) {
    if (Object.prototype.hasOwnProperty.call(materia, icon)) {
      results.push(downloadIcon(materia[icon]));
    }
  }

  return downloadedIconsCompile(await Promise.all(results));
};

const downloadIcons = async () => {
  try {
    const iconsIn = await fs.readFile(path.join(__dirname, "js", "icons-in.json"), { encoding: "utf-8", flag: "r+" });
    const json = JSON.parse(iconsIn);
    const materia = json.materiaIcons;
    const icons = await downloadIconsProxy(materia);
    await fs.writeFile(path.join(__dirname, "js", "icons.json"), JSON.stringify(icons, null, 2), { encoding: "utf-8", flag: "w+" });
  } catch (error) {
    console.error(error);
    return false;
  }
};

const run = async () => {
  const downloadIconsResult = await downloadIcons();
  return downloadIconsResult;
};

run();
