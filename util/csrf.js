// import { randomBytes } from 'crypto'
//
// export const injectCsrf = ({ headers = {}, ...response }) => ({
//   headers: {
//     'Set-Cookie': `csrf-token=${ randomBytes(16).toString('base64') }; Secure`,
//     ...headers,
//   },
//   ...response,
// })
//
// export const checkCsrf = () => {}
