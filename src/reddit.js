import axios from 'axios';
import stringify from 'qs-stringify';
import Bottleneck from 'bottleneck';

// eslint-disable-next-line import/no-unresolved
import { version } from './package.json';

export default class Reddit {
  static userAgent = `GatsbySourceRedditWiki/${version}`;
  static tokenUrl = 'https://www.reddit.com/api/v1/access_token';
  static baseUrl = 'https://oauth.reddit.com';
  static requestTimeoutMs = 30000;

  constructor(options) {
    this.rateLimiter = new Bottleneck(options.rateLimiter);
    this.options = options;
    this.token = null;
    this.tokenExpiration = this.currentTime;

    this.rateLimit = this.rateLimit.bind(this);
    this.refreshToken = this.refreshToken.bind(this);
    this.request = this.request.bind(this);
  }

  get currentTime() {
    return Date.now() / 1000;
  }

  async request(url, data = {}, method = 'GET') {
    await this.refreshToken();

    if (!this.token) {
      throw new Error('Did not obtain access token!');
    }

    return await this.rateLimit(axios, {
      method,
      url: `${Reddit.baseUrl}/${url}`,
      data: {
        ...data,
        // eslint-disable-next-line camelcase
        api_type: 'json'
      },
      headers: {
        Authorization: `Bearer ${this.token}`,
        'User-Agent': Reddit.userAgent
      },
      timeout: Reddit.requestTimeoutMs
    });
  }

  async rateLimit(fn, ...args) {
    return await this.rateLimiter.schedule(fn.bind(this, ...args));
  }

  async refreshToken() {
    const currentTime = this.currentTime;

    if (this.token && this.tokenExpiration > currentTime) {
      return;
    }

    const { username, password, appId, appSecret } = this.options;
    const basicToken = Buffer.from(`${appId}:${appSecret}`).toString('base64');
    const tokenResponse = await axios({
      url: Reddit.tokenUrl,
      method: 'POST',
      data: stringify({
        // eslint-disable-next-line camelcase
        grant_type: 'password',
        username,
        password
      }),
      headers: {
        Authorization: `Basic ${basicToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': Reddit.userAgent
      },
      timeout: Reddit.requestTimeoutMs
    });
    const { status, data } = tokenResponse;
    const majorStatus = status / 100;

    if (majorStatus === 2) {
      const {
        access_token: accessToken,
        expires_in: expiresIn,
        token_type: tokenType
      } = data;

      if (tokenType === null || accessToken === null) {
        const responseString = JSON.stringify(data);

        throw new Error(
          `Invalid token_type or access_token in response: ${responseString}`
        );
      }

      this.token = accessToken;
      // pad the expiration date so that it always expires a bit early
      this.tokenExpiration = (this.currentTime + expiresIn) * 0.9;
    } else {
      throw new Error(`Token request failed with ${status}: ${data}`);
    }
  }
}
