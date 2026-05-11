# CMS template

## Rename

To rename the code base, update `$replaces` array in **new-project.ps1** file, then run following PowerShell script:

```powershell
& ./new-project.ps1
```

## Documentation

Please read our guides [here](https://tuyen.blog/optimizely-cms/frontend/get-started/).

## AI and Developer Tools

These **optional** tools can speed up frontend work when you are generating components or exploring the codebase:

- [Alloy CLI Frontend](https://github.com/dinh-pham-optimizely/alloy-cli-frontend) by Dinh Pham: generates frontend components from natural-language prompts in VS Code Copilot Chat while following the project's Atomic Design structure.

## Important notes

The frontend pipeline for this repository utilizes the latest version of Bun. It's recommended to specify the Bun version when using this template in your project.

## License

MIT.
