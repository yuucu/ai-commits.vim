# ai-commits.vim

![vim-ai demo](./demo.gif)

## Features

TODO

## Installation

### Prerequisites

- [API key](https://platform.openai.com/account/api-keys)

```sh
export OPENAI_API_KEY="YOUR_OPENAI_API_KEY"
```

### Using [lazy.nvim](https://github.com/folke/lazy.nvim)

```lua
  {
    "yuucu/ai-commits.vim",
    cmd = { "AICommits" },
    lazy = false,
    dependencies = {
      'vim-denops/denops.vim'
    },
  }
```


## Usage

```
" Automatic commit by ai
:AICommits
```
