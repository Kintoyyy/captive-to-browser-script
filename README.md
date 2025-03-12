# Captive Portal Detection & Redirection Script

This script detects captive portals and ensures users open the authentication page in their default browser. It is particularly useful for MikroTik hotspot portals where browsers may restrict local storage, affecting login persistence.

## Features
- Detects captive portal environments using multiple indicators.
- Displays a countdown popup before redirecting.
- Attempts various redirect methods for different platforms (iOS, Android, and others).
- Provides a cancel option for users who do not wish to be redirected.

## Installation for MikroTik Hotspot

### Step 1: Add the Script to Login and Status Pages
1. Open `login.html` and `status.html` in your MikroTik hotspot files.
2. Copy the contents of `minified.js`.
3. Paste the script before the closing `</body>` tag in both files:

```html
</body>
    <!-- Keep any other code above this -->
    <script>
        // Paste the minified script here
    </script>
</body>
```
4. Done

## How It Works
1. The script runs immediately when the captive portal loads.
2. It detects if the user is inside a captive portal.
3. If detected, it displays a countdown modal.
4. After the countdown, it attempts to redirect the user to their default browser for proper login handling.
5. The user can manually continue or dismiss the popup.

## Troubleshooting
- If the script does not work, ensure JavaScript is enabled in the client's browser.
- Check that the script is correctly pasted before `</body>` in both `login.html` and `status.html`.

## License
This script is free to use and modify. Attribution is appreciated but not required.

