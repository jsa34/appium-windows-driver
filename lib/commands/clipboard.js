import { exec } from 'teen_process';

const commands = {};

/**
 * Sets the clipboard's content on the Windows PC.
 *
 * @param {!string} content - The content to be set as base64 encoded string.
 * @param {?string} contentType [plaintext] - The type of the content to set.
 *                                            Only `plaintext` and 'image' are supported.
 */
commands.setClipboard = async function setClipboard (content, contentType) {
  if (contentType === 'plaintext') {
    await exec('powershell', ['-command', `$str=[System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String(${content}));Set-Clipboard -Value $str`]);
  } else if (contentType === 'image') {
    await exec('powershell', ['-command', `$img=[Drawing.Bitmap]::FromStream([IO.MemoryStream][Convert]::FromBase64String(${content}));[System.Windows.Forms.Clipboard]::SetImage($img);$img.Dispose();`]);
  }
  throw new Error(`Could not set clipboard as '${contentType}' is not a supported content type.`);
};

/**
 * Sets the clipboard's content on the Windows PC.
 *
 * @param {?string} contentType [plaintext] - The type of the content to get.
 *                                            Only `plaintext` and 'image' are supported.
 *                                            Images must be in PNG format.
 * @returns {string} The actual clipboard content encoded into base64 string.
 * An empty string is returned if the clipboard contains no data.
 */
commands.getClipboard = async function getClipboard (contentType) {
  if (contentType === 'plaintext') {
    const {stdout} = await exec('powershell', ['-command', `$str=Get-Clipboard;[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($str));`]);
    return stdout;
  } else if (contentType === 'image') {
    const {stdout} = await exec('powershell', ['-command', `$s=New-Object System.IO.MemoryStream;[System.Windows.Forms.Clipboard]::GetImage().Save($s,[System.Drawing.Imaging.ImageFormat]::Png);[System.Convert]::ToBase64String($s.ToArray());`]);
    return stdout;
  }
  throw new Error(`Could not get clipboard as '${contentType}' is not a supported content type.`);
};

export { commands };
export default commands;
