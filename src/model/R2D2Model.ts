import { spawn } from "child_process"
import * as rpc from "vscode-jsonrpc/node";

export class R2D2Model {
  connection: rpc.MessageConnection;

  public constructor() {
    const rrddProcess = spawn("mlir-r2d2-server");

    this.connection = rpc.createMessageConnection(
      new rpc.StreamMessageReader(rrddProcess.stdout),
      new rpc.StreamMessageWriter(rrddProcess.stdin)
    );
    this.connection.listen();
  }
}