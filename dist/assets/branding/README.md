# Stockfish AI Chess icon

Approved artwork: ivory knight with a red accent on lighter blue. Generated with the built-in image generation tool, then exported at the required pixel sizes without changing the design.

- `approved-icon-master.png`: original approved artwork.
- `AppIcon.appiconset`: 1024 × 1024 opaque PNG and Xcode asset catalog metadata. Drag into the iOS project's Assets.xcassets and select AppIcon as its app icon. Verify in Xcode when the native iOS project exists.
- `apple-touch-icon.png`: 180 × 180 opaque PNG for a home-screen web shortcut.

The PNGs have square outer corners; the operating system applies the icon mask. No branding image is added to the game screen. The browser preview is a visual mockup, not an iOS simulator or an installed app.

Apple reference: https://developer.apple.com/documentation/xcode/configuring-your-app-icon

Generation prompt: Create a single square app icon for Stockfish AI Chess: large sculptural ivory-white knight on lighter sky blue, one subtle precision-cut blue accent in its neck, crisp silhouette, restrained dimensional lighting, clear at small home-screen sizes. No text, watermark, border, rounded exterior corners, other pieces, or existing Stockfish logo.

Light-blue revision: edited with the built-in image generation tool. Prompt: Change only the dark navy background to a lighter medium sky blue gradient (#449ADD to #287AC0); preserve the ivory knight, blue neck accent, composition, and square opaque format. Exported to the existing icon and launch sizes. Original navy assets are retained in ios/branding-backup-navy.

Red-accent revision approved September 22, 2026. Edited using the built-in image generation tool. Prompt: Change only the narrow blue inset inside the ivory knight’s neck to vivid ruby red, preserving its shading and highlights; preserve the blue background, ivory knight, composition, and square opaque format. Generated master exported to 1024px app icons, 180px web icon and 144/288/432px launch marks. Previous blue-accent assets backed up in ios/branding-backup-blue-accent.

Exact red-accent edit prompt (built-in image tool):
> Use case: precise-object-edit. Edit target: the provided 1024x1024 iOS chess app icon. Change ONLY the narrow saturated blue inset/accent inside the ivory knight's curved neck to a rich vivid ruby red, preserving its existing shading, depth and highlights. Keep the entire blue background unchanged. Preserve the ivory knight, silhouette, eye, lighting, material, pedestal, positioning, scale, and every other detail as closely as possible. No added elements or text. Output a square opaque 1024x1024 icon, without rounded exterior corners.
