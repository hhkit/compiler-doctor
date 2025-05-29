import * as rpc from 'vscode-jsonrpc/node'
import { R2D2 } from './R2D2ServerInterface'
import { executeBinary } from '../util/executeBinary'
import { ChildProcessWithoutNullStreams } from 'child_process'

export class R2D2Model {
  r2d2process: ChildProcessWithoutNullStreams
  connection: rpc.MessageConnection

  public constructor() {
    this.r2d2process = executeBinary('mlir-r2d2-server')

    this.connection = rpc.createMessageConnection(
      new rpc.StreamMessageReader(this.r2d2process.stdout),
      new rpc.StreamMessageWriter(this.r2d2process.stdin)
    )
    this.connection.listen()
  }

  public load(r2d2File: string): Promise<string> {
    return this.connection.sendRequest('r2d2/load', { str: r2d2File })
  }

  public trace(loc: R2D2.FileLineCol, dir: R2D2.TraceDirection): Promise<R2D2.TraceResponse> {
    return this.connection.sendRequest('r2d2/trace', {
      source: loc,
      traceDirection: dir,
      maxDepth: 1
    })
  }
}
