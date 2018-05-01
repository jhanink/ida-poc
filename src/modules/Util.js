
const Debug = {
  messages: [],
  log(msg, data) {
    this.debug.messages.push ({msg, data});
    if (this.debug.messages.length > 1000) {
      this.debug.messages.shift();
    }
  },
  print() {
    console.log('======= DEBUG MESSAGES =====')
    this.debug.messages.map((item, idx) => {
      console.log(`--- [${idx+1}] ${item.msg}`, item.data);
    });
  }
}

const Util = {};

export default {Debug, Util};
