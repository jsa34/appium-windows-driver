import { exec } from 'teen_process';

const commands = {};

const text = 'plaintext';
const image = 'image';

/**
 * Sets the clipboard's content on the Windows PC.
 *
 * @param {!string} content - The content to be set as base64 encoded string.
 * @param {?string} contentType [plaintext] - The type of the content to set.
 *                                            Only `plaintext` and 'image' are supported.
 */
commands.setClipboard = async function setClipboard (content, contentType) {
  switch (contentType) {
    case text:
      return await exec('powershell', ['-command',
        `$str=[System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('${content}'));`,
        'Set-Clipboard -Value $str']);
    case image:
      return await exec('powershell', ['-command',
        `$img=[Drawing.Bitmap]::FromStream([IO.MemoryStream][Convert]::FromBase64String('${content}'));`,
        '[System.Windows.Forms.Clipboard]::SetImage($img);',
        '$img.Dispose();']);
    default:
      throw new Error(`Could not set clipboard as '${contentType}' is not a supported content type.`);
  }
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
  let output;
  switch (contentType) {
    case text:
      // eslint-disable-next-line no-case-declarations
      output = await exec('powershell', ['-command',
        '$str=Get-Clipboard;',
        '[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($str));'
      ]);
      break;
    case image:
      output = await exec('powershell', ['-command',
        '$s=New-Object System.IO.MemoryStream;',
        '[System.Windows.Forms.Clipboard]::GetImage().Save($s,[System.Drawing.Imaging.ImageFormat]::Png);',
        '[System.Convert]::ToBase64String($s.ToArray());']);
      break;
    default:
      throw new Error(`Could not get clipboard as '${contentType}' is not a supported content type.`);
  }
  return output.stdout;
};


export { commands };
export default commands;
