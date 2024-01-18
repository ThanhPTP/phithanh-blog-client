export const setCookie = (
  cookieName: string,
  cookieValue: string,
  expiresMinutes: number,
) => {
  const d = new Date();
  d.setTime(d.getTime() + expiresMinutes * 60 * 1000);
  const expires = `expires=${d.toUTCString()}`;
  document.cookie = `${cookieName}=${cookieValue};${expires};path=/`;
};

export const getCookie = (cookieName: string): string => {
  try {
    const match = document.cookie.match(
      new RegExp(`(^| )${cookieName}=([^;]+)`),
    );
    if (match) {
      return match[2] || '';
    } else {
      return '';
    }
  } catch (err) {
    return '';
  }
};

export const deleteAllCookies = () => {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i += 1) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  }
};
