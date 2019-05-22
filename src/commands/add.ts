import { flags } from '@oclif/command';

import Command from '../base-command';
import { addRequirement } from '../utils';

export default class Add extends Command {
  static description = 'Add addon';
  static examples = ['$ flavour add addon1 addon2'];
  static args = [...Command.args];
  static flags = {
    ...Command.flags,
    check: flags.boolean({
      description: 'Check if the addon is valid',
      default: true,
      allowNo: true,
    }),
  };
  self = Add;
  command = addRequirement;
  title = 'Adding requirement';
  successTitle = (addon: string) => `Installed ${addon}`;
}
