import React from "react";
import {
  create,
  createSession,
  connectTerminal,
  sendCommand
} from "../utils/termUtils";

export default class Xterm extends React.Component {
  async componentDidMount() {
    const term = create(this.termElm);
    const processId = await createSession();
    const tmpTerm = await connectTerminal(term, processId);
    this.setState({ processId });
    this.termElm = tmpTerm;
  }

  handleClick = async () => {
    await sendCommand(this.state.processId, "echo hello");
  };

  render() {
    return (
      <div>
        <div
          // eslint-disable-next-line no-return-assign
          ref={ref => (this.termElm = ref)}
          style={{ height: "85vh" }}
        />
        <input type="submit" onClick={this.handleClick} />
      </div>
    );
  }
}
