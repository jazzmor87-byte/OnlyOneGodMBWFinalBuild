let messages = [];
let listeners = [];

export const sendMessage = (msg) => {
  messages.push(msg);
  listeners.forEach(cb => cb(messages));
};

export const subscribeChat = (cb) => {
  listeners.push(cb);
};

export const getMessages = () => messages;
