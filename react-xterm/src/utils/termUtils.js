import { Terminal } from "xterm";
import { AttachAddon } from "xterm-addon-attach";
import { FitAddon } from "xterm-addon-fit";

import "xterm/css/xterm.css";

export const create = termElm => {
  const term = new Terminal();
  const fitAddon = new FitAddon();

  term.setOption("cursorBlink", true);
  term.setOption("fontSize", 18);
  term.setOption("fontWeight", "normal");
  term.setOption("fontFamily", "Consolas");

  term.loadAddon(fitAddon);

  term.open(termElm);
  fitAddon.fit();
  return term;
};

export const createSession = async () => {
  const res = await fetch(`http://localhost:8333/terminals?cols=&rows=`, {
    method: "POST",
    headers: { "Content-Type": "application/json" }
  });

  const processId = await res.text();
  return processId;
};

export const connectTerminal = (term, processId) => {
  const protocol = window.location.protocol === "https:" ? "wss://" : "ws://";
  let socketURL = protocol + `localhost:8333/terminals/`;
  socketURL += processId;
  const socket = new WebSocket(socketURL);
  const attachAddon = new AttachAddon(socket);
  term.loadAddon(attachAddon);

  return term;
};

export const sendCommand = async (processId, command) => {
  await fetch(`http://localhost:8333/terminals/${processId}/writeln`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ command })
  });
};
