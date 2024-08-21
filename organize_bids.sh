#!/bin/bash

# Define paths
input_dir="./Pilot_Data"  # Directory where your original CSV files are located
output_dir="./experiment"  # Directory where the BIDS structure will be created

# Create necessary directories
mkdir -p "$output_dir"

# Create the dataset_description.json file
cat <<EOT >> "$output_dir/README.json" 
{
  "Name": "Your Study Name",
  "BIDSVersion": "1.6.0",
  "License": "CC0",
  "Authors": ["Author One", "Author Two"],
  "Acknowledgements": "Thanks to...",
  "Funding": ["Grant #123"],
  "ReferencesAndLinks": ["doi:10.0/xyz123"],
  "DatasetDOI": "doi:10.0/yourdoi"
}
EOT

# Create participants.tsv file
echo -e "participant_id" > "$output_dir/participants.tsv"

# Process each CSV file
for csv_file in "$input_dir"/*.csv; do
    # Extract subject ID and task ID from the filename
    filename=$(basename -- "$csv_file")
    subject_id=$(echo $filename | cut -d '_' -f 1)
    task_id=$(echo $filename | cut -d '_' -f 2)
    
    # Define the output directory for this subject
    subject_dir="$output_dir/sub-$subject_id/beh"
    mkdir -p "$subject_dir"
    
    # Convert CSV to TSV and move it to the BIDS structure
    tsv_file="$subject_dir/sub-${subject_id}_task-${task_id}_beh.tsv"
    tr ',' '\t' < "$csv_file" > "$tsv_file"
    
    # Create the accompanying JSON file for the TSV
    json_file="$subject_dir/sub-${subject_id}_task-${task_id}_beh.json"
    cat <<EOT >> "$json_file"

#these are just examples, change depending on your columns
{
  "TaskName": "$task_id", 
  "Columns": {
    "onset": "The onset of the event",
    "duration": "The duration of the event",
    "response_time": "The response time in seconds",
    "accuracy": "The accuracy of the response"
  }
}
EOT
    
    # Add the subject ID to participants.tsv if not already present
    if ! grep -q "sub-$subject_id" "$output_dir/participants.tsv"; then
        echo -e "sub-$subject_id" >> "$output_dir/participants.tsv"
    fi

done

# print to console

echo "BIDS organization complete." 
