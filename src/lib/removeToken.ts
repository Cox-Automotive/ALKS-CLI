import c from '@cox-automotive/clortho';
import { isPasswordSecurelyStorable } from './isPasswordSecurelyStorable';
import { log } from './log';
import netrc from 'node-netrc';

const clortho = c.forService('alkscli');
const SERVICETKN = 'alksclitoken';
const ALKS_TOKEN = 'alkstoken';

export async function removeToken() {
  log('removing token');
  if (isPasswordSecurelyStorable()) {
    return clortho.removeFromKeychain(ALKS_TOKEN);
  } else {
    netrc.update(SERVICETKN, {});
  }
}
