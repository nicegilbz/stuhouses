#!/usr/bin/env node

/**
 * This script helps convert American English to UK English spellings
 * across the codebase for consistency.
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const chalk = require('chalk');

// Mapping from US to UK English
const spellingMap = {
  // -ize to -ise
  'organize': 'organise',
  'organization': 'organisation',
  'organizing': 'organising',
  'organized': 'organised',
  'prioritize': 'prioritise',
  'customize': 'customise',
  'realize': 'realise',
  'specialize': 'specialise',
  'specialized': 'specialised',
  'apologize': 'apologise',
  'apologized': 'apologised',
  'apologizing': 'apologising',
  'authorize': 'authorise',
  'authorized': 'authorised',
  'authorizing': 'authorising',
  'authorization': 'authorisation',
  'capitalize': 'capitalise',
  'capitalized': 'capitalised',
  'categorize': 'categorise',
  'categorized': 'categorised',
  'characterize': 'characterise',
  'characterized': 'characterised',
  'criticize': 'criticise',
  'criticized': 'criticised',
  'emphasize': 'emphasise',
  'emphasized': 'emphasised',
  'finalize': 'finalise',
  'finalized': 'finalised',
  'initialize': 'initialise',
  'initialized': 'initialised',
  'memorize': 'memorise',
  'memorized': 'memorised',
  'minimize': 'minimise',
  'minimized': 'minimised',
  'modernize': 'modernise',
  'modernized': 'modernised',
  'normalize': 'normalise',
  'normalized': 'normalised',
  'optimized': 'optimised',
  'optimize': 'optimise',
  'standardize': 'standardise',
  'standardized': 'standardised',
  'synchronize': 'synchronise',
  'synchronized': 'synchronised',
  'summarize': 'summarise',
  'summarized': 'summarised',
  'utilize': 'utilise',
  'utilized': 'utilised',
  'utilizing': 'utilising',
  
  // -or to -our
  'color': 'colour',
  'colors': 'colours',
  'colored': 'coloured',
  'favor': 'favour',
  'favors': 'favours',
  'favored': 'favoured',
  'flavor': 'flavour',
  'flavors': 'flavours',
  'flavored': 'flavoured',
  'humor': 'humour',
  'humors': 'humours',
  'humorous': 'humourous',
  'labor': 'labour',
  'labors': 'labours',
  'labored': 'laboured',
  'neighbor': 'neighbour',
  'neighbors': 'neighbours',
  'neighborhood': 'neighbourhood',
  'favorite': 'favourite',
  'favorites': 'favourites',
  'behavior': 'behaviour',
  'behaviors': 'behaviours',
  'behavioral': 'behavioural',
  'endeavor': 'endeavour',
  'endeavors': 'endeavours',
  'harbor': 'harbour',
  'harbors': 'harbours',
  'honor': 'honour',
  'honors': 'honours',
  'honored': 'honoured',
  'honorable': 'honourable',
  'rumor': 'rumour',
  'rumors': 'rumours',
  'valor': 'valour',
  'vigor': 'vigour',
  'savior': 'saviour',
  
  // -er to -re
  'center': 'centre',
  'centers': 'centres',
  'theater': 'theatre',
  'theaters': 'theatres',
  'meter': 'metre',
  'meters': 'metres',
  'fiber': 'fibre',
  'fibers': 'fibres',
  'caliber': 'calibre',
  'liter': 'litre',
  'liters': 'litres',
  'specter': 'spectre',
  'scepter': 'sceptre',
  
  // -og to -ogue
  'analog': 'analogue',
  'catalog': 'catalogue',
  'catalogs': 'catalogues',
  'dialog': 'dialogue',
  'dialogs': 'dialogues',
  'monolog': 'monologue',
  'monologs': 'monologues',
  'epilog': 'epilogue',
  'epilogs': 'epilogues',
  'prolog': 'prologue',
  'prologs': 'prologues',
  
  // -am to -amme
  'program': 'programme',
  'programs': 'programmes',
  // exception for computer programs
  'programming': 'programming',
  'programmer': 'programmer',
  
  // -l to -ll
  'fulfill': 'fulfil',
  'fulfillment': 'fulfilment',
  'enrollment': 'enrolment',
  'enrollments': 'enrolments',
  'installment': 'instalment',
  'installments': 'instalments',
  'traveled': 'travelled',
  'traveling': 'travelling',
  'traveler': 'traveller',
  'travelers': 'travellers',
  'canceled': 'cancelled',
  'canceling': 'cancelling',
  'counselor': 'counsellor',
  'counselors': 'counsellors',
  'labeled': 'labelled',
  'labeling': 'labelling',
  'modeled': 'modelled',
  'modeling': 'modelling',
  'signaled': 'signalled',
  'signaling': 'signalling',
  
  // -ense to -ence
  'defense': 'defence',
  'defenses': 'defences',
  'offense': 'offence',
  'offenses': 'offences',
  'pretense': 'pretence',
  'license': 'licence', // noun form
  'licenses': 'licences',
  
  // -ter to -tre
  'center': 'centre',
  'centers': 'centres',
  
  // Miscellaneous spelling differences
  'analyze': 'analyse',
  'analyzed': 'analysed',
  'analyzing': 'analysing',
  'analysis': 'analysis', // same in both
  'artifact': 'artefact',
  'artifacts': 'artefacts',
  'catalog': 'catalogue',
  'catalogs': 'catalogues',
  'check': 'cheque', // financial context only
  'checking': 'current', // banking context
  'draft': 'draught', // beer/wind context
  'aluminum': 'aluminium',
  'estrogen': 'oestrogen',
  'aging': 'ageing',
  'gray': 'grey',
  'maneuver': 'manoeuvre',
  'maneuvers': 'manoeuvres',
  'pajamas': 'pyjamas',
  'plow': 'plough',
  'sulfur': 'sulphur',
  'tire': 'tyre', // car context
  'tires': 'tyres', // car context
  
  // Different words for same concept
  'apartment': 'flat',
  'apartments': 'flats',
  'cookie': 'biscuit', // food context
  'cookies': 'biscuits', // food context only - web context should stay "cookie"
  'soccer': 'football',
  'fall': 'autumn', // season context
  'vacation': 'holiday',
  'vacations': 'holidays',
  'garbage': 'rubbish',
  'trash': 'rubbish',
  'can': 'bin', // container context
  'garbage can': 'rubbish bin',
  'trash can': 'rubbish bin',
  'gasoline': 'petrol',
  'gas': 'petrol', // fuel context
  'cellphone': 'mobile',
  'cellphones': 'mobiles',
  'cell phone': 'mobile phone',
  'cell phones': 'mobile phones',
  'parking lot': 'car park',
  'parking lots': 'car parks',
  'sidewalk': 'pavement',
  'sidewalks': 'pavements',
  'zipcode': 'postcode',
  'zipcodes': 'postcodes',
  'zip code': 'postcode',
  'zip codes': 'postcodes',
  'movie theater': 'cinema',
  'movie theaters': 'cinemas',
  'truck': 'lorry', // large goods vehicle context
  'trucks': 'lorries',
  'trunk': 'boot', // car context
  'hood': 'bonnet', // car context
  'line': 'queue', // waiting in line/queue context
  'in line': 'in the queue',
  'wait in line': 'queue',
  'waiting in line': 'queuing',
  'bangs': 'fringe', // hair context
  'sneakers': 'trainers',
  'sweater': 'jumper',
  'sweaters': 'jumpers',
  'elevator': 'lift',
  'elevators': 'lifts',
  'faucet': 'tap',
  'faucets': 'taps',
  'diaper': 'nappy',
  'diapers': 'nappies',
  'drugstore': 'chemist',
  'drugstores': 'chemists'
};

// Files and directories to exclude
const excludeDirs = [
  'node_modules',
  '.git',
  '.next',
  'dist',
  'build',
  'public',
];

// File extensions to process
const includeExtensions = [
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.md',
  '.json',
  '.html',
  '.css',
];

// Create regex patterns for case-insensitive search but preserve case when replacing
const createPatterns = () => {
  const patterns = [];
  Object.entries(spellingMap).forEach(([us, uk]) => {
    // Skip if UK spelling is already a substring of another pattern
    if (Object.keys(spellingMap).some(key => 
      key !== us && key.includes(us) && spellingMap[key].includes(uk)
    )) {
      return;
    }
    
    // Skip when the word is part of another word
    patterns.push({
      regex: new RegExp(`\\b${us}\\b`, 'gi'),
      replacement: (match) => {
        // Preserve case
        if (match === match.toUpperCase()) {
          return uk.toUpperCase();
        } else if (match[0] === match[0].toUpperCase()) {
          return uk.charAt(0).toUpperCase() + uk.slice(1);
        } else {
          return uk;
        }
      },
    });
  });
  return patterns;
};

const patterns = createPatterns();

// Check if a file should be processed
const shouldProcessFile = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  return includeExtensions.includes(ext);
};

// Process a file
const processFile = async (filePath) => {
  try {
    // Read the file content
    const content = await readFile(filePath, 'utf8');
    
    // Apply transformations
    let newContent = content;
    let replaced = false;
    
    patterns.forEach(({ regex, replacement }) => {
      const updatedContent = newContent.replace(regex, replacement);
      if (updatedContent !== newContent) {
        replaced = true;
        newContent = updatedContent;
      }
    });
    
    // Write back if changes were made
    if (replaced) {
      await writeFile(filePath, newContent, 'utf8');
      console.log(chalk.green(`✓ Updated: ${filePath}`));
      return 1;
    }
    
    return 0;
  } catch (err) {
    console.error(chalk.red(`Error processing ${filePath}:`), err);
    return 0;
  }
};

// Recursively process directories
const processDirectory = async (dirPath) => {
  let filesChanged = 0;
  
  try {
    const entries = await readdir(dirPath);
    
    for (const entry of entries) {
      const entryPath = path.join(dirPath, entry);
      
      // Skip excluded directories
      if (excludeDirs.some(dir => entryPath.includes(dir))) {
        continue;
      }
      
      try {
        const stats = await stat(entryPath);
        
        if (stats.isDirectory()) {
          // Recursively process subdirectories
          filesChanged += await processDirectory(entryPath);
        } else if (stats.isFile() && shouldProcessFile(entryPath)) {
          // Process file
          filesChanged += await processFile(entryPath);
        }
      } catch (err) {
        console.error(chalk.red(`Error processing ${entryPath}:`), err);
      }
    }
  } catch (err) {
    console.error(chalk.red(`Error reading directory ${dirPath}:`), err);
  }
  
  return filesChanged;
};

// Main function
const main = async () => {
  console.log(chalk.blue('🇬🇧 Converting to UK English spellings...'));
  console.log(chalk.blue('This may take a while, please wait...'));
  
  // Process frontend and backend directories
  const directories = ['frontend', 'backend'];
  let totalFilesChanged = 0;
  
  for (const dir of directories) {
    if (fs.existsSync(dir)) {
      console.log(chalk.blue(`Processing ${dir} directory...`));
      totalFilesChanged += await processDirectory(dir);
    }
  }
  
  console.log(chalk.green(`\n✓ Completed! ${totalFilesChanged} files updated to UK English.`));
};

// Run the script
main().catch(err => {
  console.error(chalk.red('Error:'), err);
  process.exit(1);
}); 