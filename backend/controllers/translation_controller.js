const path = require('path');
const os = require('os');
const crypto = require('crypto');
const fs = require('fs');
const { spawn } = require('child_process');

const pythonScriptFolder = path.join(__dirname, '../../model/script_files');

const activatePythonScript = (scriptName, args) => {
    var output = '';

    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', ['-m', scriptName, ...args], {
            cwd: pythonScriptFolder,
            env: { ...process.env, PYTHONPATH: pythonScriptFolder }
        } );

        pythonProcess.stdout.on('data', (data) => {
            const currnt_output = data.toString().trim();
            console.log(currnt_output);
            output += currnt_output;
        });


        pythonProcess.stderr.on('data', (data) => {
            const currentError = data.toString().trim();
            console.error(currentError);
        });

        pythonProcess.on('close', (code) => {
            console.log(`Process exited with code ${code}`);
            if (code !== 0) {
                reject(stderrOutput)
            }
            if (output.includes('Done Successfully...')) {
                resolve('Successful');
            }
            else {
                reject('Failed');
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
    const { pythonScript, outputFiles } = options;

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
            `--video_path=${videoFilePath}`,
            `--output_path=${tempFolderPath}`,
            ...options.additionalArgs
        ];
        const result = await activatePythonScript(pythonScript, args);
        console.log('Result:', result);
        if (result == 'Successful') {
            var output = {};
            console.log(outputFiles);
            for (const [responseKey, outputFile] of Object.entries(outputFiles)) {
                let data = await fs.promises.readFile(path.join(tempFolderPath, outputFile));
                output[responseKey] = data.toString();
            }
            res.send(output);
        }
        else {
            res.status(500).send(`Failed to process`);
        }
    } catch (error) {
        res.status(500).send(`Failed to process: ${error.message}`);
    } finally {
        await cleanUpTempFolder(tempFolderPath);
    }
};

const translate_text = (req, res) =>  {
    processTranslation(req, res, {
        pythonScript: 'translation.bin',
        outputFiles: {text_translation: 'text_translation.txt'},
        additionalArgs: ['--text_translation=true']
    });
};

const translate_signwriting = (req, res) => {
    processTranslation(req, res, {
        pythonScript: 'translation.bin',
        outputFiles: {signWriting_translation: 'signWriting_translation.txt'},
        additionalArgs: ['--signWriting_translation=true']
    });
};

const translate_sound = (req, res) => {
    processTranslation(req, res, {
        pythonScript: 'translation.bin',
        outputFiles: {voice_translation: 'voice_translation.mp3'},
        additionalArgs: ['--voice_translation=true']
    });
};

const translate_all = (req, res) => {
    processTranslation(req, res, {
        pythonScript: 'translation.bin',
        outputFiles: {
            text_translation: 'text_translation.txt',
            signWriting_translation: 'signWriting_translation.txt',
            voice_translation: 'voice_translation.mp3'
        },
        additionalArgs: ['--signWriting_translation=true', '--voice_translation=true', '--text_translation=true']
    });
};

module.exports = {
    translate_text,
    translate_signwriting,
    translate_sound,
    translate_all
};
