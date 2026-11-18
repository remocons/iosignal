// os: a page has no network interfaces or memory total to report.
export function networkInterfaces() { return {} }
export function totalmem() { return 0 }
export default { networkInterfaces, totalmem }
