const axios = require("axios");
const fs = require("fs");

const username = "your-username"; // Put Your Username
const password = "your-password"; // Put Your password
const hostname = "your-hostname"; // Example: luqmanul.ddns.net
let preveousIP = undefined;

if (
  username === "your-username" ||
  password === "your-password" ||
  hostname === "your-hostname"
)
  return console.log(
    "You Forgot to Put your Username/Password/Hostname, Please Check!"
  );

fs.readFile("./preveousIP.txt", "utf8", (err, data) => {
  if (err) return null;
  preveousIP = data;
  console.log(`Your PreveousIP is ${preveousIP}`);
});

axios
  .get("https://api.ipify.org?format=json")
  .then(res => {
    const currentIP = res.data.ip;
    const fullURL = `http://${username}:${password}@dynupdate.no-ip.com/nic/update?hostname=${hostname}&myip=${currentIP}`;

    if (preveousIP === undefined) {
      fs.writeFileSync("./preveousIP.txt", currentIP);
      console.log(
        `You have no preveousIP File, so we will create that for you`
      );
    }

    if (preveousIP !== currentIP) {
      fs.writeFileSync("./preveousIP.txt", currentIP);

      axios
        .get(fullURL)
        .then(res => {
          console.log(`And You DDNS has been updated`);
          console.log(`Your got new IP address : ${currentIP}`);
        })
        .catch(err => console.log(err));
    } else {
      console.log("Your IP Still the same..");
    }
  })
  .catch(err => console.log(err));
