
import { getPlatform } from "../util/platform"
import { join as joinPath, dirname } from 'path';

import appRootDir from 'app-root-dir';
import { env } from "process";
import { ChildProcessWithoutNullStreams, spawn } from "child_process";

export function executeBinary(binaryPath: string): ChildProcessWithoutNullStreams {
  const execPath = (env.name === 'production') ?
    joinPath(dirname(appRootDir.get()), 'bin') :
    joinPath(appRootDir.get(), 'resources', getPlatform());

  const cmd = `${joinPath(execPath, binaryPath)}`;
  return spawn(cmd);
}