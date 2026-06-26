#!/usr/bin/env bash
#
# new-project.sh
#
# Initializes a new repository from this template by applying the built-in naming replacements.
#
# This script is the Ubuntu/WSL/macOS counterpart of new-project.ps1. It is intended to be run
# once from the root of a freshly copied template repository. It walks the current directory
# tree, renames files and folders whose names contain known template identifiers, and rewrites
# eligible file contents using the same replacement table.
#
# The script only performs its update pass when the current directory contains template-root.keep,
# which is used as a safety marker to indicate that the working directory is the template root.
#
# During execution the script:
#   - skips folders listed in IGNORED_FOLDERS
#   - skips files with extensions listed in IGNORED_FILE_EXTENSIONS
#   - skips files ignored by Git when processing file contents
#   - renames files before updating their contents
#   - renames directories and then continues recursion from the new path
#   - removes new-project.sh after the initialization pass completes
#
# Because the script mutates names and file contents in place, it should be run only against a
# new project copy that has not already been customized.
#
# Usage:
#   ./new-project.sh

set -euo pipefail

# Replacement table. Each pair is "from|to". Replacements are applied in order.
# Review these values before execution if the default target names do not match the
# project you want to create.
REPLACES=(
  "Alloy Template|New Repositoty"      # Name of this repository
  "alloy-episerver-cms|new-name-episerver-cms" # CMS Database name
  "PreciseAlloy|NewName"
  "Precise Alloy|New Name"
  "Precise-Alloy|New-Name"
  "Precise.Alloy|New.Name"
  "precise alloy|new name"
  "precise-alloy|new-name"
  "precise.alloy|new-name"
  "preciseAlloy|newName"
  "zzz|newname"
)

IGNORED_FOLDERS=(".git" "node_modules" "bin" "obj" "packages" "_protected")
IGNORED_FILE_EXTENSIONS=(".exe" ".dll" ".zip" ".7z" ".ps1" ".sh" ".md" ".keep")

# Applies every replacement in REPLACES to the given text and prints the result.
get_replaced_string() {
  local text="$1"
  local pair from to
  for pair in "${REPLACES[@]}"; do
    from="${pair%%|*}"
    to="${pair#*|}"
    text="${text//"$from"/"$to"}"
  done
  printf '%s' "$text"
}

# Returns success (0) when the given path is ignored by Git.
is_git_ignored() {
  local path="$1"
  git check-ignore -q -- "$path" 2>/dev/null
}

# Returns success (0) when the folder name is in IGNORED_FOLDERS.
is_ignored_folder() {
  local name="$1"
  local folder
  for folder in "${IGNORED_FOLDERS[@]}"; do
    [[ "$name" == "$folder" ]] && return 0
  done
  return 1
}

# Returns success (0) when the file name has an ignored extension.
has_ignored_extension() {
  local name="$1"
  local ext
  for ext in "${IGNORED_FILE_EXTENSIONS[@]}"; do
    [[ "$name" == *"$ext" ]] && return 0
  done
  return 1
}

# Recursively renames files/folders and rewrites file contents under the given path.
update_solution_name() {
  local path="$1"

  echo "Path: $path"
  [[ -d "$path" ]] || return 0

  # Process files first.
  local file
  while IFS= read -r -d '' file; do
    if is_git_ignored "$file"; then
      continue
    fi

    local base="${file##*/}"
    if has_ignored_extension "$base"; then
      continue
    fi

    local old_name="$file"
    local new_name
    new_name="$(get_replaced_string "$old_name")"

    if [[ "$old_name" != "$new_name" ]]; then
      echo "Move $old_name to $new_name"
      mv -- "$old_name" "$new_name"
    fi

    [[ -f "$new_name" ]] || continue

    local old_content new_content
    old_content="$(cat -- "$new_name")"
    [[ -n "$old_content" ]] || continue

    new_content="$(get_replaced_string "$old_content")"

    if [[ "$old_content" != "$new_content" ]]; then
      echo "Update content of $new_name"
      printf '%s' "$new_content" >"$new_name"
    fi
  done < <(find "$path" -mindepth 1 -maxdepth 1 -type f -print0)

  # Then process directories.
  local dir
  while IFS= read -r -d '' dir; do
    local dir_base="${dir##*/}"
    local old_name="$dir"
    local new_name
    new_name="$(get_replaced_string "$old_name")"

    if is_ignored_folder "$dir_base"; then
      echo "Ignore $old_name"
      continue
    fi

    if [[ "$old_name" != "$new_name" ]]; then
      echo "Move $old_name to $new_name"
      mv -- "$old_name" "$new_name"
    fi

    update_solution_name "$new_name"
  done < <(find "$path" -mindepth 1 -maxdepth 1 -type d -print0)
}

main() {
  echo "Running $0"

  if [[ -f "template-root.keep" ]]; then
    update_solution_name "$(pwd)"
  else
    echo "Not a template root folder"
  fi
}

main
rm -- "$0"
