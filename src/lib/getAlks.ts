import ALKS, { AlksProps, create } from 'alks.js';
import { getUserAgentString } from './getUserAgentString';
import { getServer } from './state/server';

interface TokenProps {
  token: string;
}

function isTokenProps(props: Props): props is TokenProps {
  return !!(props as TokenProps).token;
}

interface PasswordProps {
  userid: string;
  password: string;
}

export type Props = TokenProps | PasswordProps;

/**
 * Gets a preconfigured alks.js object
 */
export async function getAlks(props: Props): Promise<ALKS.Alks> {
  const server = await getServer();

  const params = {
    baseUrl: server,
    userAgent: getUserAgentString(),
  };

  let alks;

  if (isTokenProps(props)) {
    alks = create(params as AlksProps);
    const result = await alks.getAccessToken({
      refreshToken: props.token,
    });
    alks = alks.create({
      ...params,
      accessToken: result.accessToken,
    });
  } else {
    // According to typescript, alks.js doesn't officially support username & password
    alks = create(({
      ...params,
      userid: props.userid,
      password: props.password,
    } as unknown) as AlksProps);
  }

  return alks;
}
