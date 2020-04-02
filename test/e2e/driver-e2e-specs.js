import wd from 'wd';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { startServer } from '../../lib/server';
chai.should();
chai.use(chaiAsPromised);

const TEST_PORT = 4788;
const TEST_HOST = 'localhost';

let server, driver;

describe('Driver', function () {
  before(async function () {
    server = await startServer(TEST_PORT, TEST_HOST);
  });

  after(async function () {
    await server.close();
  });

  beforeEach(function () {
    driver = wd.promiseChainRemote(TEST_HOST, TEST_PORT);
  });

  afterEach(async function () {
    await driver.quit();
  });

  it('should run a basic session using a real client', async function () {
    await driver.init({
      app: 'Microsoft.WindowsCalculator_8wekyb3d8bbwe!App',
      platformName: 'Windows',
      deviceName: 'WindowsPC'
    });
    await driver.elementByName('Calculator');
  });

  it('should set text to clipboard and paste', async function () {
    await driver.init({
      app: 'C:\\Windows\\System32\\notepad.exe',
      platformName: 'Windows',
      deviceName: 'WindowsPC'
    });
    const title = await driver.title();
    title.should.eql('Untitled - Notepad');
    const setClipboardTestText = 'Set Clipboard Test';
    //Set test text
    await driver.setClipboard(Buffer.from(setClipboardTestText, 'utf8').toString('base64'), 'plaintext');
    //Paste text
    await driver.elementByClassName('Edit').sendKeys('\uE009' + 'v');
    const pastedText = await driver.elementByClassName('Edit').text();
    pastedText.should.eql(setClipboardTestText);
    await driver.elementByClassName('Edit').clear();
  });

  it('should copy text to the clipboard', async function () {
    await driver.init({
      app: 'C:\\Windows\\System32\\notepad.exe',
      platformName: 'Windows',
      deviceName: 'WindowsPC'
    });
    const title = await driver.title();
    title.should.eql('Untitled - Notepad');
    const getClipboardTestText = 'Get Clipboard Test';
    //Type test text
    await driver.elementByClassName('Edit').sendKeys(getClipboardTestText);
    //Copy to clipboard
    await driver.elementByClassName('Edit').sendKeys('\uE009' + 'a');
    await driver.elementByClassName('Edit').sendKeys('\uE009' + 'x');
    //Compare clipboard text to original text
    const originalTextBaseSf = await (Buffer.from(getClipboardTestText, 'utf8').toString('base64'));
    const clipboardText = await driver.getClipboard('plaintext');
    //Notepad adds carriage returns to clipboard text
    const trimmedClipboardText = clipboardText.replace(/[\r\n]/g, '');
    trimmedClipboardText.should.eql(originalTextBaseSf);
  });

});
