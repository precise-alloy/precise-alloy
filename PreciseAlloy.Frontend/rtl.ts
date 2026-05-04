/* eslint-disable no-console */
import * as fs from 'fs';
import * as path from 'path';

interface ConversionRule {
  pattern: RegExp;
  replacement: string | ((match: string, ...groups: string[]) => string);
  description: string;
}

interface ConversionReport {
  file: string;
  changes: Array<{
    line: number;
    original: string;
    converted: string;
    rule: string;
  }>;
}

class SCSSRTLConverter {
  private conversionRules: ConversionRule[] = [
    // Margin logical properties
    {
      pattern: /margin-left:/g,
      replacement: 'margin-inline-start:',
      description: 'margin-left ⟶ margin-inline-start',
    },
    {
      pattern: /margin-right:/g,
      replacement: 'margin-inline-end:',
      description: 'margin-right ⟶ margin-inline-end',
    },

    // Padding logical properties
    {
      pattern: /padding-left:/g,
      replacement: 'padding-inline-start:',
      description: 'padding-left ⟶ padding-inline-start',
    },
    {
      pattern: /padding-right:/g,
      replacement: 'padding-inline-end:',
      description: 'padding-right ⟶ padding-inline-end',
    },

    // Border logical properties
    {
      pattern: /border-left:/g,
      replacement: 'border-inline-start:',
      description: 'border-left ⟶ border-inline-start',
    },
    {
      pattern: /border-right:/g,
      replacement: 'border-inline-end:',
      description: 'border-right ⟶ border-inline-end',
    },
    {
      pattern: /border-top-left-radius:/g,
      replacement: 'border-start-start-radius:',
      description: 'border-top-left-radius ⟶ border-start-start-radius',
    },
    {
      pattern: /border-top-right-radius:/g,
      replacement: 'border-start-end-radius:',
      description: 'border-top-right-radius ⟶ border-start-end-radius',
    },
    {
      pattern: /border-bottom-left-radius:/g,
      replacement: 'border-end-start-radius:',
      description: 'border-bottom-left-radius ⟶ border-end-start-radius',
    },
    {
      pattern: /border-bottom-right-radius:/g,
      replacement: 'border-end-end-radius:',
      description: 'border-bottom-right-radius ⟶ border-end-end-radius',
    },

    // Positioning logical properties
    {
      pattern: /\bleft:/g,
      replacement: 'inset-inline-start:',
      description: 'left ⟶ inset-inline-start',
    },
    {
      pattern: /\bright:/g,
      replacement: 'inset-inline-end:',
      description: 'right ⟶ inset-inline-end',
    },

    // Text alignment
    {
      pattern: /text-align:\s*left/g,
      replacement: 'text-align: start',
      description: 'text-align: left ⟶ text-align: start',
    },
    {
      pattern: /text-align:\s*right/g,
      replacement: 'text-align: end',
      description: 'text-align: right ⟶ text-align: end',
    },

    // Float (add comment for manual review)
    {
      pattern: /float:\s*(left|right)/g,
      replacement: (match, direction) => `/* RTL-TODO: Review float */ float: ${direction}`,
      description: 'float: left/right ⟶ add review comment',
    },

    // Transform translateX (add comment for manual review)
    {
      pattern: /translateX\(([^)]+)\)/g,
      replacement: (match, value) => `/* RTL-TODO: Review translateX */ translateX(${value})`,
      description: 'translateX() ⟶ add review comment',
    },

    // Box shadow (add comment for manual review)
    {
      pattern: /box-shadow:\s*(-?\d+[a-z]*)\s+/g,
      replacement: (match, offset) => `/* RTL-TODO: Review shadow direction */ box-shadow: ${offset} `,
      description: 'box-shadow ⟶ add review comment',
    },
  ];

  /**
   * Scan a directory recursively for .scss files
   */
  private findScssFiles(dir: string): string[] {
    const files: string[] = [];

    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Skip node_modules and other common directories
        if (!['node_modules', '.git', 'dist', 'build'].includes(item)) {
          files.push(...this.findScssFiles(fullPath));
        }
      } else if (item.endsWith('.scss')) {
        files.push(fullPath);
      }
    }

    return files;
  }

  /**
   * Convert a single SCSS file to RTL-compatible format
   */
  private convertFile(filePath: string, dryRun: boolean = false): ConversionReport {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const changes: ConversionReport['changes'] = [];
    let convertedContent = content;

    for (const rule of this.conversionRules) {
      const originalContent = convertedContent;

      if (typeof rule.replacement === 'string') {
        convertedContent = convertedContent.replace(rule.pattern, rule.replacement);
      } else {
        convertedContent = convertedContent.replace(rule.pattern, rule.replacement);
      }

      // Track changes
      if (originalContent !== convertedContent) {
        const originalLines = originalContent.split('\n');
        const convertedLines = convertedContent.split('\n');

        for (let i = 0; i < originalLines.length; i++) {
          if (originalLines[i] !== convertedLines[i]) {
            changes.push({
              line: i + 1,
              original: originalLines[i].trim(),
              converted: convertedLines[i].trim(),
              rule: rule.description,
            });
          }
        }
      }
    }

    // Write the converted content back to file (if not dry run)
    if (!dryRun && changes.length > 0) {
      fs.writeFileSync(filePath, convertedContent, 'utf-8');
    }

    return {
      file: filePath,
      changes,
    };
  }

  /**
   * Convert all SCSS files in a directory
   */
  public convertDirectory(directory: string, options: { dryRun?: boolean; verbose?: boolean } = {}): void {
    const { dryRun = false, verbose = false } = options;

    console.log(`🔍 Scanning for SCSS files in: ${directory}`);
    console.log(`Mode: ${dryRun ? 'DRY RUN (no files will be modified)' : 'WRITE'}\n`);

    const scssFiles = this.findScssFiles(directory);

    console.log(`Found ${scssFiles.length} SCSS files\n`);

    const reports: ConversionReport[] = [];
    let totalChanges = 0;

    for (const file of scssFiles) {
      const report = this.convertFile(file, dryRun);

      if (report.changes.length > 0) {
        reports.push(report);
        totalChanges += report.changes.length;

        console.log(`\n📝 ${path.relative(directory, file)}`);
        console.log(`   ${report.changes.length} changes detected`);

        if (verbose) {
          for (const change of report.changes) {
            console.log(`   Line ${change.line}: ${change.rule}`);
            console.log(`   - ${change.original}`);
            console.log(`   + ${change.converted}`);
          }
        }
      }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('✨ Conversion Summary');
    console.log('='.repeat(60));
    console.log(`Files scanned: ${scssFiles.length}`);
    console.log(`Files with changes: ${reports.length}`);
    console.log(`Total changes: ${totalChanges}`);

    if (dryRun) {
      console.log('\n⚠️  DRY RUN: No files were modified');
      console.log('Run without --dry-run to apply changes');
    } else {
      console.log('\n✅ Files have been updated!');
    }

    console.log('\n📋 Manual Review Required:');
    console.log('   - Check all "RTL-TODO" comments');
    console.log('   - Verify directional icons need flipping');
    console.log('   - Test with actual RTL content');
    console.log('   - Review any custom positioning logic');
  }

  /**
   * Generate a backup of all SCSS files before conversion
   */
  public createBackup(directory: string, backupDir: string): void {
    const scssFiles = this.findScssFiles(directory);

    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    console.log(`📦 Creating backup in: ${backupDir}`);

    for (const file of scssFiles) {
      const relativePath = path.relative(directory, file);
      const backupPath = path.join(backupDir, relativePath);
      const backupDirPath = path.dirname(backupPath);

      if (!fs.existsSync(backupDirPath)) {
        fs.mkdirSync(backupDirPath, { recursive: true });
      }

      fs.copyFileSync(file, backupPath);
    }

    console.log(`✅ Backed up ${scssFiles.length} files\n`);
  }
}

// CLI Usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const converter = new SCSSRTLConverter();

  if (args.includes('--help') || args.length === 0) {
    console.log(`
SCSS RTL Converter
==================

Usage:
  ts-node scss-rtl-converter.ts <directory> [options]

Options:
  --dry-run          Preview changes without modifying files
  --verbose          Show detailed changes for each file
  --backup <dir>     Create backup before conversion
  --help             Show this help message

Examples:
  # Preview changes
  ts-node scss-rtl-converter.ts ./src/styles --dry-run --verbose

  # Convert with backup
  ts-node scss-rtl-converter.ts ./src/styles --backup ./backup

  # Convert directly
  ts-node scss-rtl-converter.ts ./src/styles
    `);
    process.exit(0);
  }

  const directory = args[0];
  const dryRun = args.includes('--dry-run');
  const verbose = args.includes('--verbose');
  const backupIndex = args.indexOf('--backup');
  const backupDir = backupIndex !== -1 ? args[backupIndex + 1] : null;

  if (!fs.existsSync(directory)) {
    console.error(`❌ Error: Directory not found: ${directory}`);
    process.exit(1);
  }

  // Create backup if requested
  if (backupDir) {
    converter.createBackup(directory, backupDir);
  }

  // Run conversion
  converter.convertDirectory(directory, { dryRun, verbose });
}

export default SCSSRTLConverter;
