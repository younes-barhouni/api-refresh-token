import { http } from '../../../../utils/http/http';

const API_URL = 'http://localhost:3000/auth/';

/**
 * AuthServices
 */
export default class AuthServices {
  /**
   * register
   * @param email
   * @param password
   */
  public register(email: string, password: string) {
    const post = http('POST', {}, { email, password });

    post(`${API_URL}register`, (data, error) => {
      if (!error && data !== null) {
        // success scenario
      }
    });
  }

  /**
   * login
   * @param email
   * @param password
   */
  public login(email: string, password: string) {
    const post = http('POST', {}, { email, password });

    post(`${API_URL}login`, (data, error) => {
      if (!error && data !== null) {
        // success scenario
      }
    });
  }

  /**
   * logout
   * @param refreshToken
   */
  public logout(refreshToken: string) {
    const del = http('DELETE', {}, { refreshToken });

    del(`${API_URL}logout`, (data, error) => {
      if (!error && data !== null) {
        // success scenario
      }
    });
  }
}
