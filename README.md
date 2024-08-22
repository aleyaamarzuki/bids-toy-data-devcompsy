# bids-toy-data-devcompsy

This repository shows an example for how behavioural data can be arranged following the BIDS convention. 

The example input data consists of 3 .csv files per participant with consistent filenames, i.e., [subID]_210_all_data.csv,  [subID]_211_all_data.csv, [subID]_212_all_data.csv 

Running the bash script 'organize_bids.sh' will organise each participants' data into separate folders. Output consists of:

- a single 'dataset_description.json' file with details of the data overall
- a 'participants.tsv' file listing all subject IDs
- separate folders per subject
- data files converted to .tsv
- .json files describing column data per subject and task file

To run the bash script:
1. Download the data from the toy_data folder
2. Edit the input and output directories in the .sh script based on how you've named your folders
3. Save the .sh file in a sensible directory
4. Using command line with 'bash' capabilities, cd to where your .sh script is
5. Make the script executable by typing:
   ```
   chmod +x organize_bids.sh
   ```
6. Run the script:
   ```
   ./organize_bids.sh
   ```

Software:
I ran this on conda 4.13.0 using GNU bash, version 4.3.48(1)-release (x86_64-pc-linux-gnu)

## Licenses

* This experiment is released under the AGPLv3 License. See the [LICENSE](experiment/LICENSE) file for more information.
* The data is released under the CC-BY-4.0 License. See the [LICENSE](data/LICENSE) file for more information.