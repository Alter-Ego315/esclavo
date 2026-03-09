import zipfile, os, shutil

fonts_dir = r"c:\Users\repli\OneDrive\Escritorio\Javier personal\Golden Boy\esclavo\public\Fonts"
out_dir = r"c:\Users\repli\OneDrive\Escritorio\Javier personal\Golden Boy\esclavo\public\Fonts\extracted"

os.makedirs(out_dir, exist_ok=True)

for fname in os.listdir(fonts_dir):
    if fname.lower().endswith('.zip'):
        fpath = os.path.join(fonts_dir, fname)
        print(f"\n=== {fname} ===")
        with zipfile.ZipFile(fpath) as z:
            for e in z.namelist():
                if any(e.lower().endswith(ext) for ext in ['.ttf','.otf','.woff','.woff2']):
                    print(f"  FONT: {e}")
                    basename = os.path.basename(e)
                    with z.open(e) as src, open(os.path.join(out_dir, basename), 'wb') as dst:
                        shutil.copyfileobj(src, dst)
                else:
                    print(f"  other: {e}")

print("\n=== Direct TTF files ===")
for fname in os.listdir(fonts_dir):
    if any(fname.lower().endswith(ext) for ext in ['.ttf','.otf','.woff','.woff2']):
        print(f"  {fname}")
        shutil.copy2(os.path.join(fonts_dir, fname), os.path.join(out_dir, fname))

print("\n\nExtracted:")
for f in sorted(os.listdir(out_dir)):
    print(f"  {f}")
