# bids-toy-data-devcompsy

This repository shows an example for how behavioural data can be arranged following the BIDS convention. 

The example input data consists of 3 .csv files per participant with consistent filenames, i.e., <subID>_210_all_data.csv,  <subID>_211_all_data.csv, <subID>_212_all_data.csv.

Running the bash script 'organize_bids.sh' will organise each participants' data into separate folders. Output consists of:

- separate folders per subject
- data files converted to .tsv
- .json files describing column data per subject and task file

  Outside of the subject folders:
- a single dataset_description.json file with details of the data overall
- a 'participants.tsv' file listing all subject IDs
