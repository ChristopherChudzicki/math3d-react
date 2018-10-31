// flow
export default function preprocessPrimes(fromMQ: string) {
  const re = /[A-Za-z\_\{\}\']+\(/g
  console.log(fromMQ)
  let match
  while ((match = re.exec(fromMQ)) !== null) {
  console.log(`Found ${match[0]}. at ${match.index}`);
  // expected output: "Found foo. Next starts at 9."
  // expected output: "Found foo. Next starts at 19."
  }

}
