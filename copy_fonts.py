import os, shutil

src = r"c:\Users\repli\OneDrive\Escritorio\Javier personal\Golden Boy\esclavo\public\Fonts\extracted"
dst = r"c:\Users\repli\OneDrive\Escritorio\Javier personal\Golden Boy\esclavo\public\Fonts"

# Copy all extracted fonts to the Fonts folder (skip duplicates already there)
for f in os.listdir(src):
    src_path = os.path.join(src, f)
    dst_path = os.path.join(dst, f)
    shutil.copy2(src_path, dst_path)
    print(f"Copied: {f}")

print("\nDone.")
