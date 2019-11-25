@flavour/cli
============

Flavour CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@flavour/cli.svg)](https://npmjs.org/package/@flavour/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@flavour/cli.svg)](https://npmjs.org/package/@flavour/cli)
[![License](https://img.shields.io/npm/l/@flavour/cli.svg)](https://github.com/flavour/cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Other install method](#other-install-method)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @flavour/cli
$ flavour COMMAND
running command...
$ flavour (-v|--version|version)
@flavour/cli/0.7.1 darwin-x64 node-v10.15.3
$ flavour --help [COMMAND]
USAGE
  $ flavour COMMAND
...
```
<!-- usagestop -->

# Other install method
```sh
curl -L https://flavours.dev/cli/install.sh | sh
```

# Commands
<!-- commands -->
* [`flavour add [ADDONS]`](#flavour-add-addons)
* [`flavour autocomplete [SHELL]`](#flavour-autocomplete-shell)
* [`flavour check [ADDONS]`](#flavour-check-addons)
* [`flavour help [COMMAND]`](#flavour-help-command)
* [`flavour remove [ADDONS]`](#flavour-remove-addons)
* [`flavour update [CHANNEL]`](#flavour-update-channel)

## `flavour add [ADDONS]`

Add addon

```
USAGE
  $ flavour add [ADDONS]

ARGUMENTS
  ADDONS  The flavour identifier(s) of the addon, e.g.: divio/django

OPTIONS
  -h, --help                   show CLI help
  --addonmanager=addonmanager  Optionally specify addon manager, bypassing the registry
  --[no-]cache                 Should use flavour addon managers that is available locally or check for latest
  --[no-]check                 Check if the addon is valid
  --package=package            File path or the url to package yaml
  --registry=registry          [default: https://hub.eu.aldryn.io]
  --verbose                    Verbose output

EXAMPLE
  $ flavour add addon1 addon2
```

_See code: [src/commands/add.ts](https://github.com/flavour/cli/blob/v0.7.1/src/commands/add.ts)_

## `flavour autocomplete [SHELL]`

display autocomplete installation instructions

```
USAGE
  $ flavour autocomplete [SHELL]

ARGUMENTS
  SHELL  shell type

OPTIONS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

EXAMPLES
  $ flavour autocomplete
  $ flavour autocomplete bash
  $ flavour autocomplete zsh
  $ flavour autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v0.1.0/src/commands/autocomplete/index.ts)_

## `flavour check [ADDONS]`

Check addon

```
USAGE
  $ flavour check [ADDONS]

ARGUMENTS
  ADDONS  The flavour identifier(s) of the addon, e.g.: divio/django

OPTIONS
  -h, --help                   show CLI help
  --addonmanager=addonmanager  Optionally specify addon manager, bypassing the registry
  --[no-]cache                 Should use flavour addon managers that is available locally or check for latest
  --package=package            File path or the url to package yaml
  --registry=registry          [default: https://hub.eu.aldryn.io]
  --verbose                    Verbose output

EXAMPLE
  $ flavour check addon1 addon2
```

_See code: [src/commands/check.ts](https://github.com/flavour/cli/blob/v0.7.1/src/commands/check.ts)_

## `flavour help [COMMAND]`

display help for flavour

```
USAGE
  $ flavour help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.6/src/commands/help.ts)_

## `flavour remove [ADDONS]`

Remove addon

```
USAGE
  $ flavour remove [ADDONS]

ARGUMENTS
  ADDONS  The flavour identifier(s) of the addon, e.g.: divio/django

OPTIONS
  -h, --help                   show CLI help
  --addonmanager=addonmanager  Optionally specify addon manager, bypassing the registry
  --[no-]cache                 Should use flavour addon managers that is available locally or check for latest
  --[no-]check                 Check if the addon is valid
  --package=package            File path or the url to package yaml
  --registry=registry          [default: https://hub.eu.aldryn.io]
  --verbose                    Verbose output

EXAMPLE
  $ flavour remove addon1 addon2
```

_See code: [src/commands/remove.ts](https://github.com/flavour/cli/blob/v0.7.1/src/commands/remove.ts)_

## `flavour update [CHANNEL]`

update the flavour CLI

```
USAGE
  $ flavour update [CHANNEL]
```

_See code: [@oclif/plugin-update](https://github.com/oclif/plugin-update/blob/v1.3.9/src/commands/update.ts)_
<!-- commandsstop -->
