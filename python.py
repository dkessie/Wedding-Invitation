import os

def search_files(directory):
    """
    Search through all folders and subfolders in the specified directory
    and print file names with their extensions
    """
    try:
        # Check if the directory exists
        if not os.path.exists(directory):
            print(f"Error: Directory '{directory}' does not exist.")
            return
        
        print(f"Searching in: {directory}")
        print("-" * 50)
        
        # Walk through all directories and subdirectories
        for root, dirs, files in os.walk(directory):
            # Print current directory being searched
            if files:  # Only print if there are files in this directory
                print(f"\nDirectory: {root}")
                
            # Print each file with its extension
            for file in files:
                file_path = os.path.join(root, file)
                file_name, file_extension = os.path.splitext(file)
                
                if file_extension:
                    print(f"  {file}")
                else:
                    print(f"  {file} (no extension)")
        
        print("\n" + "-" * 50)
        print("Search completed.")
        
    except PermissionError:
        print(f"Error: Permission denied to access '{directory}'")
    except Exception as e:
        print(f"An error occurred: {e}")

# Main execution
if __name__ == "__main__":
    # Specify the directory to search
    search_directory = r"C:\Users\dkessie\OneDrive - TownOfAjax\Desktop\Workspace\Wedding Invitation"
    
    search_files(search_directory)