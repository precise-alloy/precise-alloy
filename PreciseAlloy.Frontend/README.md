# Create React App with x-pkg

The easiest way to get started with React.js is by using x-pkg. This CLI tool enables you to quickly start building a new React.js application, with everything set up for you. To get started, use the following command:

## Interactive

You can create a new project interactively by running:

```bash
npx x-pkg@latest
```

You will be asked for the name of your project

```bash
What is your project named?
```

### Non-Interactive

You can also pass command line arguments to set up a new project
non-interactively. See `x-pkg --help`:

```bash
npx x-pkg <project-directory>
```

## SCSS Migration
To replace deprecated `@import` statements in base assets/components with `@use` and `@forward`, run this command in the frontend root folder:
```
bun migrate-scss.ts
```

## SCSS Migration
To replace deprecated `@import` statements in base assets with `@use` and `@forward`, and to automatically add `@use` statements for abstracts and mixins in component SCSS files, run this command in the frontend root folder::
```
bun migrate-scss.ts
```
