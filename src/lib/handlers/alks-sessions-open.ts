import commander from 'commander';
import { checkForUpdate } from '../checkForUpdate';
import { errorAndExit } from '../errorAndExit';
import { getIamKey } from '../getIamKey';
import { getKeyOutput } from '../getKeyOutput';
import { getSessionKey } from '../getSessionKey';
import { log } from '../log';
import { trackActivity } from '../trackActivity';
import { tryToExtractRole } from '../tryToExtractRole';
import { Key } from '../../model/keys';
import { getAlksAccount } from '../state/alksAccount';
import { getAlksRole } from '../state/alksRole';
import { getOutputFormat } from '../state/outputFormat';

export async function handleAlksSessionsOpen(options: commander.OptionValues) {
  let alksAccount: string | undefined = options.account;
  let alksRole: string | undefined = options.role;

  // Try to guess role from account if only account was provided
  if (alksAccount && !alksRole) {
    log('trying to extract role from account');
    alksRole = tryToExtractRole(alksAccount);
  }

  try {
    if (options.default) {
      try {
        alksAccount = await getAlksAccount();
        alksRole = await getAlksRole();
      } catch (err) {
        errorAndExit('Unable to load default account!', err);
      }
    }

    let key: Key;
    if (options.iam) {
      key = await getIamKey(
        alksAccount,
        alksRole,
        options.newSession,
        options.favorites
      );
    } else {
      key = await getSessionKey(
        alksAccount,
        alksRole,
        false,
        options.newSession,
        options.favorites
      );
    }

    console.log(
      getKeyOutput(
        options.output || (await getOutputFormat()),
        key,
        options.namedProfile,
        options.force
      )
    );

    log('checking for updates');
    await checkForUpdate();
    await trackActivity();
  } catch (err) {
    errorAndExit(err.message, err);
  }
}
