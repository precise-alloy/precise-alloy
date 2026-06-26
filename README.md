# CMS template

## Rename

To rename the code base, update the replacement table, then run the script for your platform.

On Windows (PowerShell), update the `$replaces` array in **new-project.ps1**, then run:

```powershell
& ./new-project.ps1
```

On Ubuntu/WSL/macOS (Bash), update the `REPLACES` array in **new-project.sh**, then run:

```bash
chmod +x ./new-project.sh
./new-project.sh
```

## Documentation

Please read our guides [here](https://tuyen.blog/optimizely-cms/frontend/get-started/).

## AI and Developer Tools

These **optional** tools can speed up frontend work when you are generating components or exploring the codebase:

- [AI Workflow](https://github.com/precise-alloy/aiworkflow) by Truong Phan, Dinh Pham and Tuyen Pham: A generic, project-agnostic AI-assisted development workflow. Covers role detection, triage, task generation, execution, standards enforcement, and doc discipline. Works with any language, stack, or team size.

- [Alloy CLI Frontend](https://github.com/dinh-pham-optimizely/alloy-cli-frontend) by Dinh Pham: generates frontend components from natural-language prompts in VS Code Copilot Chat while following the project's Atomic Design structure.

## Important notes

The frontend pipeline for this repository utilizes the latest version of Bun. It's recommended to specify the Bun version when using this template in your project.

## License

MIT.
