<#
.SYNOPSIS
Initializes a new repository from this template by applying the built-in naming replacements.

.DESCRIPTION
This script is intended to be run once from the root of a freshly copied template repository.
It walks the current directory tree, renames files and folders whose names contain known
template identifiers, and rewrites eligible file contents using the same replacement table.

The replacement map is defined in the $replaces collection in this file. Each entry contains
the template value to search for and the default replacement value that should be written into
the new solution.

The script only performs its update pass when the current directory contains template-root.keep,
which is used as a safety marker to indicate that the working directory is the template root.

During execution the script:
- skips folders listed in $ignoredFolders
- skips files with extensions listed in $ignoredFileExtensions
- skips files ignored by Git when processing file contents
- renames files before updating their contents
- renames directories and then continues recursion from the new path
- removes new-project.ps1 after the initialization pass completes

Because the script mutates names and file contents in place, it should be run only against a
new project copy that has not already been customized.

.NOTES
Run this script from the repository root. Review the values in $replaces before execution if
the default target names do not match the project you want to create.

.EXAMPLE
PS> ./new-project.ps1

Runs the template initialization in the current directory, updates matching names and content,
and removes the setup script when finished.
#>
$ErrorActionPreference = 'Stop'

$replaces = @(
  @{
    from        = 'Alloy Template';
    to          = 'New Repositoty';
    description = 'Name of this repository'
  };
  @{
    from        = 'alloy-episerver-cms';
    to          = 'new-name-episerver-cms';
    description = 'CMS Database name'
  };
  @{
    from        = 'PreciseAlloy';
    to          = 'NewName';
    description = '';
  };
  @{
    from        = 'Precise Alloy';
    to          = 'New Name';
    description = '';
  };
  @{
    from        = 'Precise-Alloy';
    to          = 'New-Name';
    description = '';
  };
  @{
    from        = 'Precise.Alloy';
    to          = 'New.Name';
    description = '';
  };
  @{
    from        = 'precise alloy';
    to          = 'new name';
    description = '';
  };
  @{
    from        = 'precise-alloy';
    to          = 'new-name';
    description = '';
  };
  @{
    from        = 'precise.alloy';
    to          = 'new-name';
    description = '';
  };
  @{
    from        = 'preciseAlloy';
    to          = 'newName';
    description = '';
  };
  @{
    from        = 'zzz';
    to          = 'newname';
    description = '';
  }
)

$ignoredFolders = '.git', 'node_modules', 'bin', 'obj', 'packages', '_protected'
$ignoredFileExtensions = '.exe', '.dll', '.zip', '.7z', '.ps1', '.md', '.keep'

function Get-ReplacedString {
  param (
    [Parameter(Mandatory = $true)] [String]$Text
  )

  $replaces | ForEach-Object {
    $Text = $Text.Replace($_.from, $_.to)
  }

  return $Text
}

function Update-SolutionName {
  param (
    [Parameter(Mandatory = $true)] [String]$Path
  )

  Write-Host "Path: $Path"
  if (!(Test-Path -LiteralPath $Path)) {
    return
  }

  Get-ChildItem -LiteralPath $Path -File | ForEach-Object {
    if (git check-ignore $_.FullName) {
      return
    }

    if ($ignoredFileExtensions -contains $_.Extension) {
      return
    }

    $oldName = $_.FullName
    $newName = Get-ReplacedString -Text $oldName

    if ($oldName -ne $newName) {
      Write-Host "Move $oldName to $newName" -ForegroundColor DarkYellow
      Move-Item -LiteralPath $oldName -Destination $newName
    }

    if (!(Test-Path $newName)) {
      return
    }
    
    $oldContent = Get-Content -LiteralPath $newName -Raw
    if (!$oldContent) {
      return
    }

    $newContent = Get-ReplacedString -Text $oldContent
    
    if ($oldContent -ne $newContent) {
      Write-Host "Update content of $newName" -ForegroundColor DarkYellow
      Set-Content -LiteralPath $newName -Value $newContent -NoNewline
    }
  }

  Get-ChildItem -LiteralPath $Path -Directory -Force | ForEach-Object {
    $oldName = $_.FullName
    $newName = Get-ReplacedString -Text $oldName

    if ($ignoredFolders -contains $_.Name) {
      Write-Host "Ignore $oldName"
      return
    }

    if ($oldName -ne $newName) {
      Write-Host "Move $oldName to $newName" -ForegroundColor DarkYellow
      Move-Item -LiteralPath $oldName -Destination $newName
    }

    Update-SolutionName -Path $newName
  }
}

function Start-NewSolution {
  param (
    [Parameter(Mandatory = $true)] [String]$Path
  )

  "Running {0}" -f $PSCommandPath | Out-Host

  if (Test-Path -LiteralPath 'template-root.keep') {
    Update-SolutionName -Path $Path
  }
  else {
    Write-Host 'Not a template root folder'
  }
}

Start-NewSolution -Path (Get-Location)
Remove-Item -LiteralPath ./new-project.ps1
