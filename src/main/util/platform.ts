import { platform } from 'os'

export type OSIdentifier = 'linux' | 'mac' | 'win'

export function getPlatform(): OSIdentifier {
  switch (platform()) {
    case 'aix':
    case 'freebsd':
    case 'linux':
    case 'openbsd':
    case 'android':
      return 'linux'
    case 'darwin':
    case 'sunos':
      return 'mac'
    case 'win32':
      return 'win'
    default:
      return 'win'
  }
}
