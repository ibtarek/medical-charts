# Medical Charts

This is a simple command line tool to generate human-readable medical charts using Human API.

## Prerequisites

This tool requires Nodejs 10+

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

You can try it with demo data

```
node charts -t demo -o demo.html
```
