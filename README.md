## Denote

For noting down things that happen.

Designed to reduce to an absolute minimum the 'friction to action' of noting
things down. You just run `denote` and it takes care of the naming, organisation,
versioning and pushing of the notes.

## Setup

```
cd ~
mkdir notes
cd notes
git init
hub create -p my_private_org/notes
```

## Usage

Create a bash script like this and put it in your `$PATH`:

```bash
EDITOR="atom --wait" node $HOME/path/to/denote/main.js
```

Then you can run `denote` and it'll do all the things for ya.
