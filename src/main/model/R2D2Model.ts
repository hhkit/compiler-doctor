import { spawn } from "child_process"
import * as rpc from "vscode-jsonrpc/node";
import { getPlatform } from "../util/platform"
import { join as joinPath, dirname } from 'path';

import appRootDir from 'app-root-dir';
import { env } from "process";



export class R2D2Model {
  connection: rpc.MessageConnection;

  public constructor() {
    const execPath = (env.name === 'production') ?
      joinPath(dirname(appRootDir.get()), 'bin') :
      joinPath(appRootDir.get(), 'resources', getPlatform());
    const cmd = `${joinPath(execPath, 'mlir-r2d2-server')}`;
    const r2d2process = spawn(cmd);

    this.connection = rpc.createMessageConnection(
      new rpc.StreamMessageReader(r2d2process.stdout),
      new rpc.StreamMessageWriter(r2d2process.stdin)
    );
    this.connection.listen();
  }

  public load(r2d2File: string): Promise<string> {
    return this.connection.sendRequest("r2d2/load", { str: r2d2File });
  }
}