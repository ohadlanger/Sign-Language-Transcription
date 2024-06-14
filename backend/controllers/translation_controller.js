const path = require('path');
const os = require('os');
const crypto = require('crypto');
const fs = require('fs');
const { spawn } = require('child_process');

const pythonScriptFolder = path.join(__dirname, '../../model/script_files');

const activatePythonScript = (scriptName, args) => {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', [scriptName, ...args]);
        pythonProcess.stdout.on('data', (data) => {
            if (data.toString().trim() === 'Done Successfully...') {
                resolve('Successful');
            } else {
                reject('Failed');
            }
        });
        pythonProcess.stderr.on('data', (data) => {
            reject(data.toString());
        });
        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                reject(`Process exited with code ${code}`);
            }
        });
    });
};

const createTempFolder = async () => {
    const tempDir = os.tmpdir();
    const uniqueFolderName = `temp-folder-${crypto.randomBytes(16).toString('hex')}`;
    const tempFolderPath = path.join(tempDir, uniqueFolderName);
    await fs.promises.mkdir(tempFolderPath);
    return tempFolderPath;
};

const cleanUpTempFolder = async (tempFolderPath) => {
    try {
        await fs.promises.rm(tempFolderPath, { recursive: true, force: true });
    } catch (cleanupError) {
        console.error('Failed to clean up temporary folder:', cleanupError);
    }
};

const processTranslation = async (req, res, options) => {
    const { pythonScript, outputFile, responseKey } = options;

    const tempFolderPath = await createTempFolder();

    try {
        const videoFileData = req.body.videoFile;
        const videoFileName = req.body.fileName || 'video.mp4';

        if (!videoFileData) {
            return res.status(400).send('No video file data provided.');
        }

        const videoBuffer = Buffer.from(videoFileData, 'base64');
        const videoFilePath = path.join(tempFolderPath, videoFileName);

        await fs.promises.writeFile(videoFilePath, videoBuffer);

        const args = [
            videoFilePath,
            `--video_path=${videoFilePath}`,
            `--output_path=${tempFolderPath}`,
            ...options.additionalArgs
        ];

        const result = await activatePythonScript(pythonScript, args);

        if (result === 'Successful') {
            const data = await fs.promises.readFile(path.join(tempFolderPath, outputFile));
            res.send({ [responseKey]: data.toString() });
        } else {
            res.status(500).send(`Failed to process ${responseKey}`);
        }
    } catch (error) {
        res.status(500).send(`Failed to process ${responseKey}: ${error.message}`);
    } finally {
        await cleanUpTempFolder(tempFolderPath);
    }
};

const translate_text = (req, res) =>  {
    processTranslation(req, res, {
        pythonScript: path.join(pythonScriptFolder, 'translation/bin.py'),
        outputFile: 'text_translation.txt',
        responseKey: 'text_translation',
        additionalArgs: ['--text_translation=true']
    });
};

const translate_signwriting = (req, res) => {
    processTranslation(req, res, {
        pythonScript: path.join(pythonScriptFolder, 'translation/bin.py'),
        outputFile: 'signWriting_translation.txt',
        responseKey: 'signWriting_translation',
        additionalArgs: ['--signWriting_translation=true']
    });
};

const translate_sound = (req, res) => {
    processTranslation(req, res, {
        pythonScript: path.join(pythonScriptFolder, 'translation/bin.py'),
        outputFile: 'voice_translation.txt',
        responseKey: 'voice_translation',
        additionalArgs: ['--voice_translation=true']
    });
};

const translate_all = (req, res) => {
    processTranslation(req, res, {
        pythonScript: path.join(pythonScriptFolder, 'translation/bin.py'),
        outputFile: 'signWriting_translation.txt',
        responseKey: 'signWriting_translation',
        additionalArgs: ['--signWriting_translation=true', '--voice_translation=true', '--text_translation=true']
    });
};

module.exports = {
    translate_text,
    translate_signwriting,
    translate_sound,
    translate_all
};
