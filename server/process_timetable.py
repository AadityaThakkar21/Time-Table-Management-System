import sys
import pandas as pd
import sys
import os

def process_timetable(input_path, output_path):
    try:
        # Load the Excel file
        df = pd.read_excel(input_path)
        
        # Identify columns - Assuming a standard format or trying to auto-detect "Faculty" column
        # If specific columns are not found, we will try to group by the first column or look for keywords
        
        possible_faculty_cols = [col for col in df.columns if 'faculty' in str(col).lower() or 'teacher' in str(col).lower() or 'instructor' in str(col).lower()]
        
        if possible_faculty_cols:
            faculty_col = possible_faculty_cols[0]
        else:
            # Fallback: assume the first column is the grouping criteria if no "Faculty" column found
            faculty_col = df.columns[0]
            
        print(f"Grouping by column: {faculty_col}")

        # Create a Pandas Excel writer using XlsxWriter as the engine
        with pd.ExcelWriter(output_path, engine='xlsxwriter') as writer:
            # Get unique faculties
            faculties = df[faculty_col].dropna().unique()
            
            for faculty in faculties:
                # Filter data for this faculty
                faculty_data = df[df[faculty_col] == faculty]
                
                # Clean the sheet name (Excel limits: 31 chars, no special chars)
                sheet_name = str(faculty)[:30].replace(':', '').replace('/', '-').replace('\\', '-').replace('?', '').replace('*', '').replace('[', '').replace(']', '')
                
                if not sheet_name:
                    sheet_name = "Unknown"
                
                # Write data to a sheet named after the faculty
                faculty_data.to_excel(writer, sheet_name=sheet_name, index=False)
                
                # Auto-adjust column widths
                worksheet = writer.sheets[sheet_name]
                for i, col in enumerate(faculty_data.columns):
                    column_len = max(faculty_data[col].astype(str).map(len).max(), len(str(col))) + 2
                    worksheet.set_column(i, i, column_len)

        print(f"Successfully generated {output_path}")

    except Exception as e:
        print(f"Error processing file: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python process_timetable.py <input_file> <output_file>")
        sys.exit(1)
        
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    
    process_timetable(input_file, output_file)
