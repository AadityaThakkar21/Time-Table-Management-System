import sys
import pandas as pd
import os

def process_timetable(input_path, output_path):
    try:
        # Load the Excel file
        df = pd.read_excel(input_path)
        
        # Column normalization
        df.columns = [str(col).strip() for col in df.columns]
        
        # Identify critical columns
        faculty_col = next((col for col in df.columns if any(x in col.lower() for x in ['faculty', 'teacher', 'instructor', 'professor'])), df.columns[0])
        duration_col = next((col for col in df.columns if any(x in col.lower() for x in ['duration', 'hours', 'time'])), None)
        level_col = next((col for col in df.columns if any(x in col.lower() for x in ['level', 'ug/pg', 'program', 'degree'])), None)
        
        print(f"Academic Analysis: Faculty={faculty_col}, Level={level_col}")

        # Summary statistics
        summary_data = []

        with pd.ExcelWriter(output_path, engine='xlsxwriter') as writer:
            # Group by Faculty
            faculties = df[faculty_col].dropna().unique()
            
            for faculty in faculties:
                faculty_df = df[df[faculty_col] == faculty]
                
                # Calculate Academic Metrics
                total_hours = 0
                if duration_col:
                    # Try to extract numbers if it's a string like "1.5 hours"
                    total_hours = pd.to_numeric(faculty_df[duration_col].astype(str).str.extract('(\d+\.?\d*)')[0], errors='coerce').sum()
                else:
                    # Default: count sessions as 1 hour each if no duration provided
                    total_hours = len(faculty_df)

                ug_count = 0
                pg_count = 0
                if level_col:
                    ug_count = faculty_df[faculty_df[level_col].astype(str).str.upper().str.contains('UG')].shape[0]
                    pg_count = faculty_df[faculty_df[level_col].astype(str).str.upper().str.contains('PG')].shape[0]

                # Store for main summary sheet
                summary_data.append({
                    'Faculty Name': faculty,
                    'Total Weekly Hours': total_hours,
                    'UG Sessions': ug_count,
                    'PG Sessions': pg_count,
                    'Total Sessions': len(faculty_df)
                })

                # Create specific sheet
                sheet_name = str(faculty)[:31].translate(str.maketrans('', '', ':/?*[]\\'))
                if not sheet_name: sheet_name = "Unknown"
                
                # Add a "Faculty Profile" header to the sheet
                header_df = pd.DataFrame([
                    ['Faculty Member', faculty],
                    ['Total Contact Hours', f"{total_hours} hrs/week"],
                    ['Academic Level', 'Mixed' if ug_count > 0 and pg_count > 0 else ('UG' if ug_count > 0 else 'PG')],
                    ['', ''] # Spacer
                ])
                header_df.to_excel(writer, sheet_name=sheet_name, index=False, header=False)
                
                # Write main data starting below header
                faculty_df.to_excel(writer, sheet_name=sheet_name, index=False, startrow=5)
                
                # Formatting
                workbook = writer.book
                worksheet = writer.sheets[sheet_name]
                
                header_format = workbook.add_format({'bold': True, 'bg_color': '#D7E4BC', 'border': 1})
                metric_format = workbook.add_format({'bold': True, 'font_color': '#215967'})
                
                # Apply formatting to header info
                worksheet.write('A1', 'Faculty Profile', header_format)
                worksheet.set_column('A:Z', 18)

            # Create Global Summary Sheet
            summary_df = pd.DataFrame(summary_data)
            summary_df.to_excel(writer, sheet_name='University Summary', index=False)
            
            # Add a Holidays/Calendar sheet placeholder
            holidays_df = pd.DataFrame({
                'Date': ['2026-01-01', '2026-01-26', '2026-03-25', '2026-04-10'],
                'Occasion': ['New Year', 'Republic Day', 'Holi', 'Good Friday'],
                'Status': ['Public Holiday', 'Academic Holiday', 'Restricted Holiday', 'Public Holiday']
            })
            holidays_df.to_excel(writer, sheet_name='Academic Calendar', index=False)

        print(f"Advanced Academic Timetable generated: {output_path}")

    except Exception as e:
        print(f"Academic processing error: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        sys.exit(1)
    process_timetable(sys.argv[1], sys.argv[2])
