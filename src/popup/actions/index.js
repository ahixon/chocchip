export function addCookie(cookie) {
  return {
    type: 'ADD_COOKIE',
    cookie: cookie
  };
}