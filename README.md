# Medical Charts

This is a simple command line tool to generate human-readable medical charts using [Human API](https://www.humanapi.co).

## Prerequisites

This tool requires Nodejs 10+.

You also need a developer account at Human API in order to retrieve medical
data.

## Install

After cloning this repository,

```
npm install
```

## How to use it

To generate the medical charts for a given user :

```
node charts -t <access token> -o <filename.html>
```

You can try it with demo data :

```
node charts -t demo -o demo.html
```

If you don't remember, you can print usage information :

```
node charts --help
```


### Logging

The app uses bunyan for logging.

To display legible log messages, you can just pipe the program's output to
bunyan :

```
node charts -t ... -o ... | ./node_modules/.bin/bunyan
```


You can set an environment variable to tweak
verbosity :

```
LOG_LEVEL=fatal node charts -t .... -o ....
```

## Contributing

Everyone is welcome to contribute. Please read [CONTRIBUTING](./CONTRIBUTING.md)
for details on our code of conduct, and the process for submitting pull requests to us.

## License

This project is licensed under the MIT license. Please read [LICENSE](./LICENSE.md)
