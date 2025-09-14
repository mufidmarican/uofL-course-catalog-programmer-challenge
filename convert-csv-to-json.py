import csv
import json
import sys
from pathlib import Path

def convert_csv_to_json(csv_file_path, json_file_path):
    try:
        courses = []
        with open(csv_file_path, 'r', encoding='utf-8', errors='ignore') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                course = {
                    "CRSE_ID": int(row['CRSE_ID']) if row['CRSE_ID'] else None,
                    "SUBJECT": row['SUBJECT'].strip() if row['SUBJECT'] else "",
                    "CATALOG_NBR": row['CATALOG_NBR'].strip() if row['CATALOG_NBR'] else "",
                    "DESCR": row['DESCR'].strip() if row['DESCR'] else "",
                    "SSR_COMPONENT": row['SSR_COMPONENT'].strip() if row['SSR_COMPONENT'] else ""
                }
                if course['SUBJECT'] and course['CATALOG_NBR'] and course['DESCR']:
                    courses.append(course)
        
        json_data = {
            "data": courses,
            "total_courses": len(courses),
            "last_updated": "2025-01-13"
        }
        
        with open(json_file_path, 'w', encoding='utf-8') as jsonfile:
            json.dump(json_data, jsonfile, indent=2)
        
        print(f" Successfully converted {len(courses)} courses from CSV to JSON")
        print(f" Output file: {json_file_path}")
        print("Conversion completed successfully!")
        
    except FileNotFoundError:
        print(f" Error: File not found at {csv_file_path}")
        sys.exit(1)
    except KeyError as e:
        print(f" Error during conversion: Missing expected column '{e}' in CSV.")
        sys.exit(1)
    except Exception as e:
        print(f" An unexpected error occurred: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python convert-csv-to-json.py <input_csv_file> <output_json_file>")
        sys.exit(1)
    
    input_csv = sys.argv[1]
    output_json = sys.argv[2]
    convert_csv_to_json(input_csv, output_json)