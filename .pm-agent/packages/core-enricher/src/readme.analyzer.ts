import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

export interface ReadmeAnalysis {
  purpose: string | null;
  problemSolved: string | null;
  description: string | null;
  hasReadme: boolean;
}

/**
 * Extract purpose and problem from README files
 * Pure function following functional pattern
 */
export const analyzeReadme = async (projectPath: string): Promise<ReadmeAnalysis> => {
  const result: ReadmeAnalysis = {
    purpose: null,
    problemSolved: null,
    description: null,
    hasReadme: false,
  };

  // Find README file (case-insensitive)
  const possibleReadmes = ['README.md', 'readme.md', 'Readme.md', 'README.MD', 'README.txt', 'README'];
  let readmePath: string | null = null;

  for (const filename of possibleReadmes) {
    const path = join(projectPath, filename);
    if (existsSync(path)) {
      readmePath = path;
      result.hasReadme = true;
      break;
    }
  }

  if (!readmePath) {
    return result;
  }

  try {
    const content = await readFile(readmePath, 'utf-8');

    // Extract purpose from first paragraph or description section
    result.purpose = extractPurpose(content);

    // Extract problem being solved
    result.problemSolved = extractProblemSolved(content);

    // Extract general description
    result.description = extractDescription(content);

    return result;
  } catch (error) {
    console.error(`Error reading README at ${readmePath}:`, error);
    return result;
  }
};

/**
 * Extract the project purpose from README content
 */
const extractPurpose = (content: string): string | null => {
  // Look for the first paragraph (after any badges/images)
  const lines = content.split('\n');
  let firstParagraph = '';
  let foundContent = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip badges, images, and headers
    if (trimmed.startsWith('![') || trimmed.startsWith('#') || trimmed.startsWith('<img')) {
      continue;
    }

    // Start collecting when we find content
    if (trimmed && !foundContent) {
      foundContent = true;
    }

    // Collect paragraph until empty line
    if (foundContent) {
      if (!trimmed) {
        break;
      }
      firstParagraph += trimmed + ' ';
    }
  }

  if (firstParagraph) {
    return cleanText(firstParagraph);
  }

  // Look for explicit purpose/about sections
  const purposeSection = extractSection(content, ['## Purpose', '## About', '## What is', '## Overview']);
  if (purposeSection) {
    return cleanText(purposeSection);
  }

  return null;
};

/**
 * Extract the problem being solved from README content
 */
const extractProblemSolved = (content: string): string | null => {
  // Look for explicit problem/motivation sections
  const problemSection = extractSection(content, [
    '## Problem',
    '## Why',
    '## Motivation',
    '## Background',
    '## The Challenge',
    '## Problem Statement',
  ]);

  if (problemSection) {
    return cleanText(problemSection);
  }

  // Look for "solves", "addresses", "fixes" patterns in content
  const lines = content.split('\n');
  for (const line of lines) {
    const lower = line.toLowerCase();
    if (
      lower.includes('solves') ||
      lower.includes('addresses') ||
      lower.includes('fixes') ||
      lower.includes('problem:') ||
      lower.includes('issue:')
    ) {
      return cleanText(line);
    }
  }

  return null;
};

/**
 * Extract a general description from README content
 */
const extractDescription = (content: string): string | null => {
  // Try to find Description section
  const descSection = extractSection(content, ['## Description', '## Summary', '## Introduction']);
  if (descSection) {
    return cleanText(descSection);
  }

  // Fall back to first 2-3 paragraphs
  const lines = content.split('\n');
  const paragraphs: string[] = [];
  let currentParagraph = '';

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip headers, badges, images
    if (trimmed.startsWith('#') || trimmed.startsWith('![') || trimmed.startsWith('<img')) {
      continue;
    }

    if (trimmed) {
      currentParagraph += trimmed + ' ';
    } else if (currentParagraph) {
      paragraphs.push(currentParagraph.trim());
      currentParagraph = '';
      if (paragraphs.length >= 2) {
        break;
      }
    }
  }

  if (currentParagraph && paragraphs.length < 2) {
    paragraphs.push(currentParagraph.trim());
  }

  if (paragraphs.length > 0) {
    return cleanText(paragraphs.join(' '));
  }

  return null;
};

/**
 * Extract a section from markdown content by header
 */
const extractSection = (content: string, headers: string[]): string | null => {
  const lines = content.split('\n');
  let inSection = false;
  let sectionContent = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Check if we're entering a target section
    if (headers.some(h => trimmed.toLowerCase() === h.toLowerCase())) {
      inSection = true;
      continue;
    }

    // Check if we're leaving the section (next header)
    if (inSection && trimmed.startsWith('#')) {
      break;
    }

    // Collect section content
    if (inSection) {
      sectionContent += line + '\n';
    }
  }

  return sectionContent.trim() || null;
};

/**
 * Clean and truncate extracted text
 */
const cleanText = (text: string, maxLength: number = 500): string => {
  // Remove markdown links but keep text
  let cleaned = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // Remove inline code backticks
  cleaned = cleaned.replace(/`([^`]+)`/g, '$1');

  // Remove excessive whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  // Truncate if too long
  if (cleaned.length > maxLength) {
    cleaned = cleaned.substring(0, maxLength - 3) + '...';
  }

  return cleaned;
};