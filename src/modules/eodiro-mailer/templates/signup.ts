/**
 * @param {string} verificationCode
 */
export default function(verificationCode: string): string {
  const template = `
    <a href="https://eodiro.com/verification?token=${verificationCode}">인증하기</a>
  `
  return template
}
