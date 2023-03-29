/**
 * @see https://www.electron.build/configuration/configuration
 */
module.exports = {
  appId: 'YourAppID',
  asar: true,
  icon: 'public/favicon.ico',
  directories: {
    // eslint-disable-next-line no-template-curly-in-string
    output: 'release/${version}',
  },
  files: ['dist-electron', 'dist'],
  mac: {
    // eslint-disable-next-line no-template-curly-in-string
    artifactName: '${productName}_${version}.${ext}',
    target: ['dmg'],
  },
  win: {
    target: [
      {
        target: 'nsis',
        arch: ['x64'],
      },
    ],
    // eslint-disable-next-line no-template-curly-in-string
    artifactName: '${productName}_${version}.${ext}',
  },
  nsis: {
    oneClick: false,
    perMachine: false,
    allowToChangeInstallationDirectory: true,
    deleteAppDataOnUninstall: false,
  },
}
