import niceware from 'niceware'

const passwdArr: string[] = niceware.generatePassphrase(6).map((word) => {
  return word.charAt(0) + word.slice(1)
})

const passwdStr = passwdArr.join('-')
console.log(passwdStr)
