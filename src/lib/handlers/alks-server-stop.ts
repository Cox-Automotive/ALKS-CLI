import clc from 'cli-color';
import commander from 'commander';
import { isOsx } from '../isOsx';

export async function handleAlksServerStop(_options: commander.OptionValues) {
  if (!isOsx()) {
    console.error(clc.red('The metadata server is only supported on OSX.'));
    process.exit(0);
  }

  console.error(clc.white('Stopping metadata server..'));

  const forever = await import('forever');

  forever.list(false, (_err: Error | null, list: unknown | null) => {
    if (list === null) {
      console.log(clc.white('Metadata server is not running.'));
    } else {
      forever.stopAll();
      console.log(clc.white('Metadata server stopped.'));
    }
  });
}
