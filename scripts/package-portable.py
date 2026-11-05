"""Package the complete web build and standalone playable HTML for distribution."""
from pathlib import Path
import zipfile
root = Path(__file__).resolve().parents[1]
with zipfile.ZipFile(root/'artifacts/Boat-Race-Portable.zip','w',zipfile.ZIP_DEFLATED) as archive:
    for file in sorted((root/'dist').rglob('*')):
        if file.is_file():
            archive.write(file, 'web/'+file.relative_to(root/'dist').as_posix())
    archive.write(root/'artifacts/Boat-Race-Play.html','Boat-Race-Play.html')
    archive.writestr('START-HERE.txt', '''The Very Serious Boat Race (Not Really)

Open Boat-Race-Play.html directly in a modern browser. No network, installation or local server is needed for this self-contained edition.

For the web edition, serve the web/ directory through HTTPS or localhost. For example, with Python 3: cd web; python3 -m http.server 8080
Open http://localhost:8080 and wait for the Offline ready notice before disconnecting. All artwork and game files are local. A service worker caches the entire build.

Touch/mouse: use the large buttons. Keyboard: Tab and Enter navigate; Space activates the race action; P pauses. Optional untimed equipment picking and reduced motion are available on the home screen.

Source, manifests and original artwork: https://github.com/jessejet2004/Special-Sparks-Boat-Race/tree/work
''')
print('Portable package created: artifacts/Boat-Race-Portable.zip')
