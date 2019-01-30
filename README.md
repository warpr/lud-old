# Lûd

lûd is an opinionated browser based media player.

# Install

    wget https://deb.nodesource.com/setup_10.x
    sudo bash ./setup_10.x

    sudo apt install nodejs php-cli php-curl php-mbstring php-xml
    sudo phpenmod curl
    sudo phpenmod mbstring
    sudo phpenmod xml
    sudo phpenmod sqlite3

    bin/composer install
    npm install

# Optional

    python3 -m venv ve
    ve/bin/pip install litecli

# Hacking

lûd doesn't use a build step, each javascript source file should be written to be
directly used in a browser.

But there are some tools in use which format or verify source files:

-   [husky](https://github.com/typicode/husky) is used to setup precommit hooks,
    this should be setup automatically by npm install
-   [prettier](https://prettier.io/) is used to format code
-   [import-sort](https://github.com/renke/import-sort) is used to sort imports
-   [flow](https://flow.org/) is used for type-checking

To keep an eye on type issues, run:

    npm run flow:watch

You may have to install types if you've added a package or just did
`npm install` for the first time:

    npm run install-flow-types

# License

Copyright 2018 Kuno Woudt <mailto:kuno@frob.nl>

This program is free software: you can redistribute it and/or modify
it under the terms of copyleft-next 0.3.1. See
[copyleft-next-0.3.1.txt](copyleft-next-0.3.1.txt).

