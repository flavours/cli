import { flags } from '@oclif/command';

import Command from '../base-command';
import { removeRequirement } from '../utils';

export default class Remove extends Command {
  static description = 'Remove addon';
  static examples = ['$ flavour remove addon1 addon2'];
  static args = [...Command.args];
  static flags = {
    ...Command.flags,
    check: flags.boolean({
      description: 'Check if the addon is valid',
      default: true,
      allowNo: true,
    }),
  };

  self = Remove;
  command = removeRequirement;
  title = 'Removing requirement';
  rootTitle = (addon: string) => `Removing ${addon}`;
  successTitle = (addon: string) => `Removed ${addon}`;
}
